/**
 * Arma el segundo conjunto de prueba: treinta solicitudes que no escribió
 * quien escribió las reglas. Son dos llamadas a un modelo, separadas a propósito.
 *
 * 1. Un modelo escribe las solicitudes. Conoce el negocio y el registro de
 *    flotas, pero no ve las reglas, ni el lector, ni el primer conjunto. De cada
 *    solicitud deja anotado qué es verdad (qué unidad es, qué adjuntó, qué está
 *    mal), sin decir qué habría que hacer con ella.
 * 2. Otra llamada recibe sólo esas anotaciones y la política escrita en
 *    castellano, y decide qué debería pasar con cada una. No ve el código.
 *
 * El resultado queda en `blind-cases.json` y se versiona: el conjunto se genera
 * una vez y después no se toca. Si una respuesta esperada resulta estar mal, se
 * corrige a mano y se anota en `labelNote`.
 *
 *   ANTHROPIC_API_KEY=... node scripts/lacaja-altas/blind-generate.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { fleets, inspections as baseInspections } from "./cases.mjs";

const MODEL = "claude-opus-5-5";
const COUNT = 30;
const here = path.dirname(fileURLToPath(import.meta.url));
/**
 * `ALTAS_SET=2` arma un conjunto más, en otro archivo. Al modelo que escribe se
 * le pasan los títulos de los conjuntos anteriores para que no los repita; las
 * reglas siguen sin verse.
 */
const SET = Number(process.env.ALTAS_SET ?? "1");
const fileOf = (set) => path.join(here, set === 1 ? "blind-cases.json" : `blind-cases-${set}.json`);
const OUT = fileOf(SET);

const earlier = [];
for (let set = 1; set < SET; set++) {
  earlier.push(...JSON.parse(await readFile(fileOf(set), "utf8")).cases.map((c) => c.label));
}

/** El registro del segundo conjunto suma dos inspecciones aprobadas, para que haya usados que cierren. */
const inspections = [
  ...baseInspections,
  { plate: "AF330LT", fleet: "FL-2210", approvedOn: "2026-11-10" },
  { plate: "AD118RW", fleet: "FL-3377", approvedOn: "2026-11-11" },
];

const client = new Anthropic();
const nullable = (type) => ({ anyOf: [{ type }, { type: "null" }] });

async function ask({ system, user, schema, maxTokens }) {
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: maxTokens,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    output_config: { format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: user }],
  });
  const response = await stream.finalMessage();
  if (response.stop_reason !== "end_turn") {
    throw new Error(`La respuesta no terminó (stop_reason: ${response.stop_reason}).`);
  }
  const text = response.content.find((block) => block.type === "text")?.text;
  return { data: JSON.parse(text), usage: response.usage };
}

// 1 · Escribir las solicitudes ------------------------------------------------

const WRITER_SYSTEM = `Vas a escribir material de prueba para una aseguradora argentina. Sus clientes empresa tienen pólizas de flota y le piden por correo, o cargando una fila en una planilla, que sume un vehículo a la póliza. A veces adjuntan documentos, que el sistema recibe ya pasados a texto.

Alguien va a usar estas solicitudes para probar un sistema que las procesa. No sabés cómo funciona ese sistema ni qué controles hace, y está bien así: lo que se busca es que las solicitudes se parezcan a las que llegan de verdad a una oficina, no a las que alguien imaginó al diseñar el sistema.

Escribí como escribe la gente que manda estos pedidos: administrativas apuradas, dueños de pymes, productores de seguros que reenvían cadenas de correos, encargados de flota que copian y pegan. Algunas solicitudes están prolijas y completas. Otras tienen los problemas que aparecen en la vida real: falta algo, el adjunto es otro documento, los datos no cierran entre sí, piden algo distinto a lo habitual, el pedido es ambiguo o viene mezclado con otro asunto. Variá mucho la forma y el tipo de situación, e incluí algunas que a quien diseñó el proceso se le podrían haber escapado.

Cerca de la mitad tienen que ser pedidos normales y sin problemas, porque así es una bandeja real.

De cada solicitud anotá en \`truth\` qué es verdad, con precisión: es lo que después permite saber si el sistema la leyó bien. Anotá hechos, no qué habría que hacer con la solicitud.

Formatos: un chasis tiene 17 caracteres entre letras y números y nunca usa I, O ni Q. Las patentes son AA123BB o ABC123. Los CUIT tienen la forma 30-12345678-9. Todos los datos son inventados; para correos usá dominios terminados en .example.`;

const WRITER_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["cases"],
  properties: {
    cases: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["channel", "label", "body", "attachments", "truth"],
        properties: {
          channel: { type: "string", enum: ["mail", "excel"] },
          label: {
            type: "string",
            description: "Descripción corta de la solicitud, en castellano, hasta 60 caracteres.",
          },
          body: {
            type: "string",
            description:
              "El correo completo con su encabezado, o la fila de la planilla precedida por la fila de títulos, separadas por punto y coma.",
          },
          attachments: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["name", "text"],
              properties: {
                name: { type: "string" },
                text: { type: "string", description: "El texto del documento, como sale del PDF." },
              },
            },
          },
          truth: {
            type: "object",
            additionalProperties: false,
            required: [
              "fleet_id",
              "vehicle_count",
              "vehicle_kind",
              "condition",
              "coverage_request",
              "attachment_kind",
              "problems",
              "summary",
            ],
            properties: {
              fleet_id: {
                ...nullable("string"),
                description:
                  "Id de la flota del registro a la que corresponde, o null si a ninguna.",
              },
              vehicle_count: { type: "integer" },
              vehicle_kind: {
                type: "string",
                description: "Qué tipo de vehículo es, en una palabra.",
              },
              condition: { type: "string", enum: ["0km", "usado", "no_se_sabe"] },
              coverage_request: {
                type: "string",
                description: "Qué cobertura pide y si es la que ya tiene la flota.",
              },
              attachment_kind: {
                type: "string",
                description: "Qué documento adjuntó en realidad, o que no adjuntó nada.",
              },
              problems: {
                type: "array",
                items: { type: "string" },
                description:
                  "Cada cosa que falta, no coincide, no se lee o se sale de lo habitual. Vacío si el pedido es normal.",
              },
              summary: {
                type: "string",
                description: "Una oración con lo que pasa en esta solicitud.",
              },
            },
          },
        },
      },
    },
  },
};

const registryText = JSON.stringify(
  { flotas: fleets, inspecciones_por_fotos_aprobadas: inspections },
  null,
  2,
);

console.log("Escribiendo las solicitudes…");
const written = await ask({
  system: WRITER_SYSTEM,
  user: `Este es el registro de la aseguradora: las flotas aseguradas y las inspecciones por fotos de vehículos usados que ya están aprobadas.\n\n${registryText}\n\nEscribí ${COUNT} solicitudes de alta de vehículo. La mayoría son de estas flotas; alguna puede ser de una empresa que no está en el registro. La fecha de hoy es 13 de noviembre de 2026.${earlier.length ? `\n\nYa existen solicitudes de prueba con estos títulos. Escribí otras: distintos vehículos, distintas personas y, sobre todo, situaciones que no estén en esta lista.\n\n${earlier.map((label) => `- ${label}`).join("\n")}` : ""}`,
  schema: WRITER_SCHEMA,
  maxTokens: 60000,
});
console.log(`  ${written.data.cases.length} solicitudes.`);

// 2 · Decidir qué debería pasar con cada una ----------------------------------

const POLICY = `Un alta de vehículo se cierra sola, con el certificado emitido en el momento, únicamente si cumple las cinco condiciones. Si alguna no se cumple, o no se puede determinar, va a una persona.

1. account: la solicitud identifica una flota asegurada del registro. Si trae CUIT y número de póliza, los dos son de la misma cuenta.
2. scope: es una sola unidad y es de flota liviana (auto, utilitario o pick-up). Y es un alta: cualquier otro trámite queda afuera.
3. coverage: la cobertura pedida es la que ya tiene la flota, o no pide una distinta.
4. documents: si es 0 km, viene la factura de compra (no un presupuesto, una proforma u otro documento). Si es usado, tiene la inspección por fotos aprobada en el registro.
5. data: los datos de la unidad coinciden con la documentación. El chasis del pedido es el de la factura, la factura está a nombre de la empresa asegurada, el documento se lee, y la patente es válida o está en trámite.

El motivo es la primera condición que falla, en ese orden.`;

const LABEL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["labels"],
  properties: {
    labels: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["index", "decision", "reason", "why"],
        properties: {
          index: { type: "integer" },
          decision: { type: "string", enum: ["issue", "refer"] },
          reason: {
            anyOf: [
              { type: "string", enum: ["account", "scope", "coverage", "documents", "data"] },
              { type: "null" },
            ],
            description: "null si se cierra sola.",
          },
          why: { type: "string", description: "Una oración, en castellano." },
        },
      },
    },
  },
};

console.log("Decidiendo qué debería pasar con cada una…");
const labelled = await ask({
  system: `Aplicás la política de una aseguradora a solicitudes de alta de vehículo. De cada solicitud recibís los hechos, ya verificados, y decidís qué corresponde según la política. Aplicala tal como está escrita: si un hecho deja una condición sin cumplir o sin poder determinarse, la solicitud va a una persona.\n\n${POLICY}`,
  user: `Registro:\n${registryText}\n\nSolicitudes:\n${JSON.stringify(
    written.data.cases.map((c, index) => ({ index, canal: c.channel, hechos: c.truth })),
    null,
    2,
  )}`,
  schema: LABEL_SCHEMA,
  maxTokens: 20000,
});

const cases = written.data.cases.map((c, index) => {
  const label = labelled.data.labels.find((l) => l.index === index);
  if (!label) throw new Error(`Falta la respuesta esperada de la solicitud ${index}.`);
  return {
    id: `SOL-0${2 + SET}${String(index + 1).padStart(2, "0")}`,
    channel: c.channel,
    label: c.label,
    body: c.body,
    attachments: c.attachments.map((a) => ({ ...a, kind: "document" })),
    truth: c.truth,
    expected: { decision: label.decision, reason: label.reason },
    labelWhy: label.why,
    labelNote: null,
  };
});

const usage = {
  input: written.usage.input_tokens + labelled.usage.input_tokens,
  output: written.usage.output_tokens + labelled.usage.output_tokens,
};
await writeFile(
  OUT,
  `${JSON.stringify({ meta: { generatedOn: new Date().toISOString().slice(0, 10), model: MODEL }, inspections, cases }, null, 2)}\n`,
);
console.log(`Listo: ${cases.length} solicitudes en ${path.relative(process.cwd(), OUT)}`);
console.log(`Tokens: ${usage.input} de entrada, ${usage.output} de salida.`);
