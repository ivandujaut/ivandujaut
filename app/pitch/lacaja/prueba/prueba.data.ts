/**
 * Respaldo del tramo 04 de la pieza de La Caja: la maqueta del alta, corrida.
 * Los números salen de `results.json`, que escribe `scripts/lacaja-altas/run.mjs`
 * (veinte altas inventadas, un lector de documentos y cinco reglas). Acá vive
 * sólo el texto. Nada de esto usa datos ni sistemas de La Caja.
 */
import results from "./results.json";
import { errorCeiling, type WorthInputs } from "./worth";

export type Decision = "issue" | "refer";
export type CheckStatus = "pass" | "fail" | "skipped";

export interface RunCase {
  id: string;
  channel: "mail" | "excel";
  label: string;
  body: string;
  attachments: Array<{ name: string; text: string | null }>;
  fleet: string | null;
  vehicle: string | null;
  decision: Decision;
  reason: string | null;
  detail: string | null;
  nextStep: string | null;
  checks: Array<{ id: string; status: CheckStatus; detail: string | null }>;
  flagged: string | null;
  correct: boolean;
  reasonCorrect: boolean;
  seconds: number | null;
  audit: boolean;
  certificate: string | null;
}

export interface Run {
  meta: { ranOn: string; model: string };
  rules: Array<{ id: string; text: string }>;
  summary: {
    total: number;
    issued: number;
    referred: number;
    wrongIssues: number;
    extraReferrals: number;
    wrongReasons: number;
    audited: number;
    auditEvery: number;
    flagged: number;
    medianSeconds: number | null;
    maxSeconds: number | null;
    costUsd: number | null;
    costPerCaseUsd: number | null;
  };
  cases: RunCase[];
}

export const run = results as unknown as Run;

const s = run.summary;
/** Solicitudes que pedían saltear un control y aun así se emitieron. Tiene que dar cero. */
const flaggedIssued = run.cases.filter((c) => c.flagged && c.decision === "issue").length;
const number = (value: number, digits = 0) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const [year, month, day] = run.meta.ranOn.split("-").map(Number);
export const ranOnLabel = `${day} de ${MONTHS[month - 1]} de ${year}`;

const MODEL_NAMES: Record<string, string> = {
  "claude-opus-5-5": "Claude Opus 5.5",
  "claude-sonnet-5-5": "Claude Sonnet 5.5",
  "claude-haiku-5-5": "Claude Haiku 5.5",
};
const modelName = MODEL_NAMES[run.meta.model] ?? run.meta.model;

export const meta = {
  title: "La Caja: la maqueta del alta, corrida",
  description:
    "Veinte altas de ejemplo pasadas por un lector de documentos y cinco reglas: qué se cerró solo, qué fue a una persona y qué no prueba la corrida.",
};

export const intro = {
  kicker: "Respaldo del tramo 04 · el primer paso",
  title: "La maqueta del alta, corrida con veinte solicitudes.",
  lede: "Escribí veinte altas de vehículo como las que pueden llegar un mes cualquiera, por correo y por planilla, y las pasé por lo que propone la página: un lector de documentos y cinco reglas fijas. Acá está qué pasó con cada una.",
  exampleBadge: "datos de ejemplo",
  back: "Volver a la lectura",
  backHref: "/lacaja#paso",
};

export const flow = {
  index: "A",
  eyebrow: "Antes y después",
  heading: "Cambia quién toca cada solicitud.",
  intro:
    "El camino normal deja de pasar por una persona, y a la persona le llega sólo lo que las reglas no pueden cerrar. Un lector de documentos puesto sobre la misma bandeja no cambia eso: cada alta la sigue revisando alguien.",
  before: {
    label: "Hoy, visto de afuera",
    count: `Supuesto: ${s.total} de ${s.total} esperan a una persona`,
    steps: [
      "Entra por el portal o por correo",
      "Espera en la bandeja",
      "Una persona lee los documentos y los compara",
      "Carga la unidad y emite",
      "Avisa al cliente",
    ],
    note: "El portal dice «48 horas hábiles» y desde afuera no se ve cuántas ya se resuelven solas. Sigue siendo la primera pregunta.",
  },
  after: {
    label: "Con el primer paso",
    count: `${s.issued} se cierran solas, ${s.referred} llegan a una persona`,
    steps: [
      "Entra igual que hoy",
      "Se leen el pedido y la factura, en segundos",
      "Cinco reglas fijas deciden",
      "Sale el certificado, o va a una persona con el motivo y lo que falta",
      `Control después: una de cada ${number(s.auditEvery)} emitidas se revisa`,
    ],
    note: `Van ${s.referred} de ${s.total} a una persona porque armé el conjunto para eso: más de la mitad son casos difíciles a propósito. La proporción real sale de los datos de adentro.`,
  },
  legend: {
    waiting: "Espera a una persona",
    issued: "Cerrada sola",
    referred: "A una persona, con el caso armado",
    audit: "Cerrada sola y elegida para revisión posterior",
  },
  question: {
    label: "Dato de adentro",
    text: "¿De quién es la bandeja?",
    why: "Si el portal es de un área y la bandeja de otra, este cambio se acuerda entre las dos antes de escribir una línea de código.",
  },
};

export const outcome = {
  index: "B",
  eyebrow: "La corrida",
  heading:
    s.wrongIssues === 0
      ? "Ninguna se emitió por error."
      : `${s.wrongIssues} se emitieron por error.`,
  intro:
    "Antes de correr nada escribí qué tenía que pasar con cada solicitud y por qué. El lector no ve esa respuesta: se usa para comparar.",
  stats: [
    {
      value: `${s.issued} de ${s.total}`,
      label: "se cerraron solas, con el certificado en el momento.",
    },
    {
      value: number(s.wrongIssues),
      label: "emitidas cuando había que derivar. Es la vara de toda la prueba.",
    },
    {
      value: number(s.extraReferrals),
      label: "derivadas que se podían cerrar solas. Es el costo de derivar ante la duda.",
    },
    {
      value: s.medianSeconds === null ? "s/d" : `${number(s.medianSeconds, 1)} s`,
      label:
        s.maxSeconds === null
          ? "tardó cada lectura, en la mediana."
          : `tardó cada lectura, en la mediana. La más lenta, ${number(s.maxSeconds, 1)} s.`,
    },
  ],
  cost:
    s.costUsd === null || s.costPerCaseUsd === null
      ? null
      : `Leer las ${s.total} costó US$ ${number(s.costUsd, 2)}, unos ${number(s.costPerCaseUsd * 100, 1)} centavos de dólar por solicitud, con ${modelName}. El número que falta para compararlo es cuánto cuesta hoy una gestión asistida.`,
  list: {
    title: "Las veinte, una por una",
    hint: "Abrí cualquiera para ver lo que entró y qué regla la frenó.",
    filters: { all: "Todas", issue: "Cerradas solas", refer: "A una persona" },
    channel: { mail: "correo", excel: "planilla" },
    decision: { issue: "Cerrada sola", refer: "A una persona" },
    audit: "revisión posterior",
    flagged: "pedía saltear un control",
    mismatch: "no coincide con lo esperado",
    entered: "Lo que entró",
    attachment: "Adjunto",
    noAttachments: "Sin adjuntos.",
    rules: "Las cinco reglas",
    status: { pass: "Cumple", fail: "No cumple", skipped: "No se evaluó" },
    nextStep: "Qué sigue",
    certificate: "Certificado de ejemplo",
    read: "Leído",
  },
};

/** C · ¿Conviene hacerlo? Los nueve números son de adentro; los de ejemplo sólo prueban la cuenta. */
export interface WorthField {
  id: keyof WorthInputs;
  label: string;
  hint?: string;
  /** `money`: pesos sin decimales. `count`: entero. `rate`: admite decimales. */
  kind: "money" | "count" | "rate";
  suffix?: string;
  example: string;
}

export const worthCopy = {
  index: "C",
  eyebrow: "¿Conviene hacerlo?",
  heading: "Cuánto puede equivocarse antes de costar más de lo que ahorra.",
  intro:
    "Cerrar sola un alta ahorra una gestión y suma un riesgo: emitir algo que una persona habría frenado. La cuenta pone las dos cosas en pesos, junto con lo que cuesta construirlo y operarlo. Los nueve números están adentro: cargá los de ustedes, o probá con los de ejemplo.",
  groups: [
    {
      title: "Hoy",
      fields: [
        { id: "requests", label: "Altas de vehículo por mes", kind: "count", example: "1500" },
        {
          id: "alreadyAuto",
          label: "Parte que hoy ya se cierra sola",
          kind: "rate",
          suffix: "%",
          example: "20",
        },
        {
          id: "assistedCost",
          label: "Costo de una gestión asistida",
          kind: "money",
          example: "9000",
        },
      ],
    },
    {
      title: "Con el primer paso",
      fields: [
        {
          id: "autoShare",
          label: "Parte de las manuales que pasaría a cerrarse sola",
          hint: `En la corrida fue ${Math.round((s.issued / s.total) * 100)}%, con un conjunto armado para forzar excepciones.`,
          kind: "rate",
          suffix: "%",
          example: "50",
        },
        {
          id: "buildCost",
          label: "Costo de construirlo, una vez",
          kind: "money",
          example: "60000000",
        },
        {
          id: "monthlyRunCost",
          label: "Costo de operarlo por mes",
          hint:
            s.costPerCaseUsd === null
              ? "Lectura, soporte y mantenimiento."
              : `Lectura, soporte y mantenimiento. La lectura sola costó US$ ${number(s.costPerCaseUsd, 3)} por solicitud en la corrida.`,
          kind: "money",
          example: "1200000",
        },
      ],
    },
    {
      title: "El error",
      fields: [
        {
          id: "errorPerThousand",
          label: "Emisiones equivocadas cada 1.000 cerradas solas",
          hint: "Es lo que hay que medir antes de abrirlo.",
          kind: "rate",
          example: "2",
        },
        {
          id: "errorTodayPerThousand",
          label: "Emisiones equivocadas hoy, cada 1.000 revisadas a mano",
          hint: "Las personas también se equivocan. Cuenta la diferencia.",
          kind: "rate",
          example: "1",
        },
        {
          id: "errorCost",
          label: "Costo de una emisión equivocada",
          hint: "Corregirla y, en el peor caso, un siniestro que no correspondía pagar, pesado por su probabilidad. Lo define Técnica.",
          kind: "money",
          example: "900000",
        },
      ],
    },
  ] as Array<{ title: string; fields: WorthField[] }>,
  loadExample: "Cargar valores de ejemplo",
  clear: "Vaciar",
  exampleNote:
    "Valores de ejemplo para probar la cuenta. No son de La Caja ni una estimación de sus costos.",
  empty: "La cuenta aparece cuando están los nueve números.",
  account: {
    title: "La cuenta, por mes",
    saving: "Gestiones que se ahorran",
    control: `Control posterior, una de cada ${number(s.auditEvery)}`,
    error: "Emisiones equivocadas de más",
    run: "Operación",
    net: "Resultado",
    auto: "altas por mes pasarían a cerrarse solas",
  },
  payback: {
    title: "Repago de la construcción",
    months: "meses",
    never: "No se paga: cada mes cuesta más de lo que ahorra.",
  },
  threshold: {
    title: "El criterio para adoptarlo",
    text: "Con estos números empieza a perder plata a partir de {x} emisiones equivocadas cada 1.000 cerradas solas.",
    none: "Ni con el mismo error que hoy cubre el control y la operación. Antes de mirar el error hay que revisar el volumen o el costo de operarlo.",
    proof:
      "Para mostrar que está por debajo hacen falta {n} altas cerradas solas sin ningún error: {m} corriendo en paralelo.",
    shadow:
      "Ese tiempo corre sin riesgo: el lector decide sin emitir y se compara con lo que resolvió la persona.",
  },
  levers: {
    title: "Tres formas de pasar el criterio",
    items: [
      "Bajar el error: mejores lecturas y reglas más estrictas, aunque deriven más.",
      "Bajar lo que cuesta cada error: cerrar solas sólo las altas de menor riesgo y detectar antes con el muestreo.",
      "No abrirlo donde no pasa: el corte por segmento ya está en la propuesta.",
    ],
  },
  footnote: `La cantidad de altas sale de la regla de tres: con cero errores en n casos, el error real queda por debajo de 3 dividido n, con 95% de confianza. Con los ${s.total} de la corrida, ese techo es ${number(errorCeiling(s.total) * 100)}%. La revisión posterior se cuenta al costo de una gestión asistida.`,
};

export const limits = {
  index: "D",
  eyebrow: "El control y los límites",
  heading: "Dónde queda el control, y qué no prueba esta corrida.",
  control: {
    title: "El control cambia de lugar",
    text: `Si hoy alguien mira cada alta, el control está antes de emitir. Acá pasa a después y sobre una muestra: ${s.audited} de las ${s.issued} cerradas solas quedaron marcadas para revisión. Con eso y con los siniestros de las primeras 72 horas se decide si un segmento sigue cerrándose solo o vuelve a solicitud.`,
    note: "Cada cuántas se revisa una lo fija Técnica, igual que el umbral del corte.",
  },
  decides: {
    title: "Quién decide",
    text: `Un modelo de lenguaje lee. Las reglas son código, y son las que deciden. Por eso un correo que pide «emitir directamente sin revisar» se deriva igual: ${s.flagged} de las ${s.total} pedían avanzar sin un control, y ${flaggedIssued === 0 ? "ninguna se emitió" : `${flaggedIssued} se emitieron`}.`,
  },
  notProven: {
    title: "Qué no prueba esta corrida",
    items: [
      "Que funcione con los sistemas de La Caja. No toca ninguno: el registro de flotas es una lista de ejemplo.",
      "Una tasa de cierre. Las veinte solicitudes las escribí yo, con más excepciones de las que tiene una cartera.",
      "La lectura de un escaneo o de una foto. Las facturas entran como texto ya extraído del PDF.",
      "Que las reglas sean las correctas. Son las tres de la maqueta y dos compuertas; las de verdad las escribe Técnica.",
      `Nada con valor estadístico. Con cero errores en ${s.total} casos, lo más que se puede afirmar es que el error real está por debajo del ${number(errorCeiling(s.total) * 100)}%.`,
    ],
  },
};

export const closing = {
  ran: `Corrida del ${ranOnLabel}. El código y las veinte solicitudes están en el repositorio de este sitio.`,
  footnote:
    "Las flotas, los CUIT, los chasis, los correos y las facturas son inventados. La página no usa material de La Caja y no tengo relación con la compañía.",
};
