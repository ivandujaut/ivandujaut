/**
 * Corre el segundo conjunto (`blind-cases.json`, treinta solicitudes que no
 * escribió quien escribió las reglas) con dos modelos como lector, y deja la
 * comparación en `app/pitch/lacaja/prueba/blind.json`.
 *
 *   ANTHROPIC_API_KEY=... node scripts/lacaja-altas/blind-run.mjs
 *
 * Con `ALTAS_REUSE=1` reaplica las reglas a las lecturas ya guardadas, sin
 * llamar a ningún modelo.
 *
 * `ALTAS_STAGE` nombra la pasada (v1, v2, v3). Cada pasada guarda su resumen y
 * las anteriores no se pisan: así queda a la vista qué cambió entre una y otra.
 * El detalle caso por caso es siempre el de la última pasada corrida.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fleets } from "./cases.mjs";
import { extract } from "./extract.mjs";
import { RULES, decide } from "./rules.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "../../app/pitch/lacaja/prueba/blind.json");
// El lector cambió entre pasadas (desde la v3 marca otros pedidos y condiciones
// raras), así que cada versión guarda sus lecturas en su propio archivo.
const READER = process.env.ALTAS_READER ?? "1";
const READINGS = path.join(here, `blind-readings${READER === "1" ? "" : `-${READER}`}.json`);

/** Dólares por millón de tokens (entrada, salida), precios de lista de noviembre de 2026. */
const MODELS = [
  { id: "claude-opus-5-5", name: "Claude Opus 5.5", price: [4, 20] },
  { id: "claude-haiku-5-5", name: "Claude Haiku 5.5", price: [0.1, 0.5] },
];
const ONLY = process.env.ALTAS_MODELS?.split(",");
const CONCURRENCY = 4;
const STAGE = process.env.ALTAS_STAGE ?? "v1";

const set = JSON.parse(await readFile(path.join(here, "blind-cases.json"), "utf8"));
const registry = { fleets, inspections: set.inspections };

/** Lecturas guardadas: { [modelo]: { [solicitud]: { extraction, seconds, usage } } }. */
const saved = process.env.ALTAS_REUSE ? JSON.parse(await readFile(READINGS, "utf8")) : {};

async function readAll(model) {
  const readings = saved[model] ?? {};
  let next = 0;
  const worker = async () => {
    while (next < set.cases.length) {
      const request = set.cases[next++];
      if (readings[request.id]) continue;
      try {
        const { extraction, seconds, usage } = await extract(request, model);
        readings[request.id] = { extraction, seconds, usage };
      } catch (cause) {
        readings[request.id] = { error: cause instanceof Error ? cause.message : String(cause) };
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return readings;
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

function judge(request, reading) {
  // Una lectura que falló nunca termina en un certificado.
  const outcome = reading.error
    ? { decision: "refer", reason: "data", checks: [] }
    : decide(reading.extraction, request, registry);
  const failure = outcome.checks.find((check) => check.status === "fail");
  return {
    decision: outcome.decision,
    reason: outcome.reason,
    detail: reading.error ? `No se pudo leer: ${reading.error}` : (failure?.detail ?? null),
    correct: outcome.decision === request.expected.decision,
    reasonCorrect: outcome.reason === request.expected.reason,
  };
}

const allReadings = {};
const models = [];
for (const model of MODELS.filter((m) => !ONLY || ONLY.includes(m.id))) {
  console.log(`\n${model.name}`);
  const readings = await readAll(model.id);
  allReadings[model.id] = readings;

  const results = Object.fromEntries(
    set.cases.map((request) => [request.id, judge(request, readings[request.id])]),
  );
  for (const request of set.cases) {
    const r = results[request.id];
    if (!r.correct || !r.reasonCorrect) {
      console.log(
        `  ${request.id}  ${r.decision}/${r.reason ?? "-"}  esperado ${request.expected.decision}/${request.expected.reason ?? "-"}  ${request.label}`,
      );
    }
  }

  const list = set.cases.map((request) => ({ request, r: results[request.id] }));
  const read = Object.values(readings).filter((x) => !x.error);
  const tokens = read.reduce(
    (sum, x) => ({ input: sum.input + x.usage.input, output: sum.output + x.usage.output }),
    { input: 0, output: 0 },
  );
  const costUsd = (tokens.input * model.price[0] + tokens.output * model.price[1]) / 1_000_000;
  const summary = {
    issued: list.filter((x) => x.r.decision === "issue").length,
    wrongIssues: list.filter(
      (x) => x.r.decision === "issue" && x.request.expected.decision === "refer",
    ).length,
    extraReferrals: list.filter(
      (x) => x.r.decision === "refer" && x.request.expected.decision === "issue",
    ).length,
    wrongReasons: list.filter((x) => x.r.correct && !x.r.reasonCorrect).length,
    errors: Object.values(readings).filter((x) => x.error).length,
    medianSeconds: Number(median(read.map((x) => x.seconds)).toFixed(1)),
    costPerCaseUsd: Number((costUsd / set.cases.length).toFixed(4)),
  };
  console.log(" ", summary);
  models.push({ id: model.id, name: model.name, summary, results });
}

if (!process.env.ALTAS_REUSE) {
  await writeFile(READINGS, `${JSON.stringify(allReadings, null, 2)}\n`);
}

const ids = (list, pick) => list.filter(pick).map((x) => x.request.id);
const stage = {
  models: models.map(({ id, name, summary, results }) => {
    const list = set.cases.map((request) => ({ request, r: results[request.id] }));
    return {
      id,
      name,
      summary,
      wrongIssueIds: ids(
        list,
        (x) => x.r.decision === "issue" && x.request.expected.decision === "refer",
      ),
      extraReferralIds: ids(
        list,
        (x) => x.r.decision === "refer" && x.request.expected.decision === "issue",
      ),
    };
  }),
};

let previous = {};
try {
  previous = JSON.parse(await readFile(OUT, "utf8")).stages ?? {};
} catch {
  // Primera corrida: todavía no hay pasadas guardadas.
}

const output = {
  meta: {
    generatedOn: set.meta.generatedOn,
    writer: set.meta.model,
    total: set.cases.length,
    expectedIssues: set.cases.filter((c) => c.expected.decision === "issue").length,
    latestStage: STAGE,
  },
  rules: RULES,
  stages: { ...previous, [STAGE]: stage },
  cases: set.cases.map((request) => ({
    id: request.id,
    channel: request.channel,
    label: request.label,
    summary: request.truth.summary,
    expected: request.expected,
    expectedWhy: request.labelWhy,
    byModel: Object.fromEntries(models.map((m) => [m.id, m.results[request.id]])),
  })),
};
await writeFile(OUT, `${JSON.stringify(output, null, 2)}\n`);
console.log(`\nPasada ${STAGE} guardada en ${path.relative(process.cwd(), OUT)}`);
