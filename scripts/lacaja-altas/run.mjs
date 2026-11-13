/**
 * Corre las veinte altas de `cases.mjs`: cada una pasa por el lector
 * (`extract.mjs`), después por las reglas (`rules.mjs`), y se compara con la
 * respuesta correcta escrita de antemano. Deja el resultado en
 * `app/pitch/lacaja/prueba/results.json`, que es lo que muestra la página.
 *
 *   ANTHROPIC_API_KEY=... node scripts/lacaja-altas/run.mjs
 *
 * Con `ALTAS_REUSE=1` no llama al modelo: reaplica las reglas a las lecturas de
 * la corrida anterior. Sirve para cambiar una regla y ver qué decisión se mueve.
 *
 * Si la lectura de un caso falla por cualquier motivo, ese caso se deriva a
 * una persona: un error nunca termina en un certificado.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cases, fleets, inspections } from "./cases.mjs";
import { MODEL, extract } from "./extract.mjs";
import { NEXT_STEP, RULES, decide } from "./rules.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "../../app/pitch/lacaja/prueba/results.json");

/** Dólares por millón de tokens (entrada, salida), precios de lista de noviembre de 2026. */
const PRICES = {
  "claude-opus-5-5": [4, 20],
  "claude-sonnet-5-5": [2, 10],
  "claude-haiku-5-5": [0.1, 0.5],
};
/** De las altas que se cierran solas, una de cada cinco se revisa después. */
const AUDIT_EVERY = 5;
const CONCURRENCY = 4;

const registry = { fleets, inspections };

/** Lecturas de la corrida anterior, por solicitud, si se pidió reusarlas. */
const previous = process.env.ALTAS_REUSE
  ? new Map(JSON.parse(await readFile(OUT, "utf8")).cases.map((c) => [c.id, c]))
  : null;

async function read(request) {
  const saved = previous?.get(request.id);
  if (saved?.read) {
    return {
      extraction: saved.read,
      seconds: saved.seconds,
      usage: saved.tokens,
      model: saved.model,
    };
  }
  return extract(request);
}

async function runCase(request) {
  let reading = null;
  let outcome;
  let error = null;
  try {
    reading = await read(request);
    outcome = decide(reading.extraction, request, registry);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : String(cause);
    outcome = {
      decision: "refer",
      reason: "data",
      fleet: null,
      checks: RULES.map((rule) => ({ id: rule.id, status: "skipped", detail: null })),
    };
  }

  const failure = outcome.checks.find((check) => check.status === "fail");
  const vehicle = reading?.extraction.vehicle;
  return {
    id: request.id,
    channel: request.channel,
    label: request.label,
    body: request.body,
    attachments: request.attachments.map((a) => ({ name: a.name, text: a.text ?? null })),
    fleet: outcome.fleet?.name ?? null,
    vehicle: vehicle
      ? [vehicle.make, vehicle.model, vehicle.condition === "0km" ? "0 km" : vehicle.year]
          .filter(Boolean)
          .join(" ")
      : null,
    decision: outcome.decision,
    reason: outcome.reason,
    detail: error ? `No se pudo leer la solicitud: ${error}` : (failure?.detail ?? null),
    nextStep: outcome.reason ? NEXT_STEP[outcome.reason] : null,
    checks: outcome.checks,
    flagged: reading?.extraction.out_of_process_request ?? null,
    read: reading?.extraction ?? null,
    expected: request.expected,
    correct: outcome.decision === request.expected.decision,
    reasonCorrect: outcome.reason === request.expected.reason,
    seconds: reading ? Number(reading.seconds.toFixed(1)) : null,
    tokens: reading?.usage ?? null,
    model: reading?.model ?? null,
    error,
  };
}

async function runAll(items) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await runCase(items[index]);
      const r = results[index];
      console.log(
        `${r.id}  ${r.decision === "issue" ? "cerrada sola " : "a una persona"}  ${r.correct && r.reasonCorrect ? "ok " : "MAL"}  ${r.reason ?? ""}`,
      );
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const results = await runAll(cases);

// Control posterior: una de cada cinco cerradas solas, en orden de llegada.
const issued = results.filter((r) => r.decision === "issue");
issued.forEach((r, i) => {
  r.audit = i % AUDIT_EVERY === 0;
  r.certificate = `CERT-EJ-${r.id.slice(-4)}`;
});
for (const r of results) {
  r.audit ??= false;
  r.certificate ??= null;
}

const tokens = results.reduce(
  (sum, r) => ({
    input: sum.input + (r.tokens?.input ?? 0),
    output: sum.output + (r.tokens?.output ?? 0),
  }),
  { input: 0, output: 0 },
);
const [priceIn, priceOut] = PRICES[MODEL] ?? [null, null];
const costUsd =
  priceIn === null ? null : (tokens.input * priceIn + tokens.output * priceOut) / 1_000_000;
const timed = results.filter((r) => r.seconds !== null).map((r) => r.seconds);

const summary = {
  total: results.length,
  issued: issued.length,
  referred: results.length - issued.length,
  // La vara: emitidas cuando había que derivar. Tiene que dar cero.
  wrongIssues: results.filter((r) => r.decision === "issue" && r.expected.decision === "refer")
    .length,
  // El costo de ser prudente: derivadas que se podían cerrar solas.
  extraReferrals: results.filter((r) => r.decision === "refer" && r.expected.decision === "issue")
    .length,
  // Derivadas bien, pero con un motivo distinto al esperado.
  wrongReasons: results.filter((r) => r.correct && !r.reasonCorrect).length,
  audited: results.filter((r) => r.audit).length,
  auditEvery: AUDIT_EVERY,
  flagged: results.filter((r) => r.flagged).length,
  errors: results.filter((r) => r.error).length,
  medianSeconds: timed.length ? Number(median(timed).toFixed(1)) : null,
  maxSeconds: timed.length ? Math.max(...timed) : null,
  tokens,
  costUsd: costUsd === null ? null : Number(costUsd.toFixed(2)),
  costPerCaseUsd: costUsd === null ? null : Number((costUsd / results.length).toFixed(3)),
};

const output = {
  // Al reusar lecturas, la fecha y el modelo son los de la corrida que las produjo.
  meta: previous
    ? JSON.parse(await readFile(OUT, "utf8")).meta
    : { ranOn: new Date().toISOString().slice(0, 10), model: MODEL },
  rules: RULES,
  summary,
  cases: results,
};
await writeFile(OUT, `${JSON.stringify(output, null, 2)}\n`);

console.log("\n", summary);
console.log(`\nResultado en ${path.relative(process.cwd(), OUT)}`);
if (summary.wrongIssues > 0) {
  console.error("\nHay altas emitidas que había que derivar. La corrida no pasa.");
  process.exitCode = 1;
}
