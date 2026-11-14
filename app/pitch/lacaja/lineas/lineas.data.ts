/**
 * Respaldo del tramo 03 de la pieza de La Caja: qué deja cada línea, según el
 * balance que la compañía presenta a la SSN. Los números salen de `lines.json`,
 * que escribe `scripts/analysis/lacaja-lineas.py` a partir de los datos
 * abiertos del regulador. Acá vive sólo el texto. No hay ningún dato interno.
 */
import results from "./lines.json";

export interface Line {
  id: string;
  label: string;
  /** Línea que el sitio de La Caja ofrece a empresas y pasa por el Portal Empresas. */
  portal: boolean;
  /** Primas emitidas netas de anulaciones, en miles de millones de pesos. */
  premiums: number;
  /** Parte de la producción de La Caja, en %. */
  share: number;
  /** Gastos de explotación sobre primas, en %. */
  operating: number;
  /** Resultado técnico sobre primas, en %. */
  technical: number;
  /** Resultado técnico en miles de millones de pesos. */
  technicalAmount: number;
  market: { operating: number; technical: number };
  previous: { operating: number; technical: number };
}

const data = results as unknown as {
  meta: {
    period: string;
    previousPeriod: string;
    premiums: number;
    technicalAmount: number;
    operating: number;
    floor: number;
  };
  lines: Line[];
  omitted: string[];
};

export const lines = data.lines;

const plain = (value: number, digits = 1) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(value));

/** Porcentaje con signo, con el menos tipográfico: "−7,4%" o "+2,2%". */
export const signed = (value: number, digits = 1) =>
  `${value < 0 ? "−" : "+"}${plain(value, digits)}%`;
export const percent = (value: number, digits = 1) => `${plain(value, digits)}%`;
/** Une sin permitir corte de renglón: el signo queda pegado al monto. */
const JOIN = String.fromCharCode(0x2060);
const NBSP = String.fromCharCode(0xa0);
/** Miles de millones de pesos, con signo si se pide: "−$59,6 mil M". No se parte al final del renglón. */
export const billions = (value: number, withSign = false, digits = 1) =>
  `${value < 0 ? `−${JOIN}` : withSign ? `+${JOIN}` : ""}$${plain(value, digits)}${NBSP}mil${NBSP}M`;
export const amount = (value: number, digits = 1) => plain(value, digits);

const byId = (id: string) => {
  const line = lines.find((l) => l.id === id);
  if (!line) throw new Error(`Falta la línea ${id} en lines.json`);
  return line;
};
const autos = byId("automotores");
const apGroup = byId("ap-colectivo");
const burial = byId("sepelio-colectivo");
const commerce = byId("integral-comercio");
/** Lo que dieron, sumadas, todas las líneas que no son automotores. */
const rest = data.meta.technicalAmount - autos.technicalAmount;
const smallLoss = apGroup.technicalAmount + burial.technicalAmount;
const smallShare = apGroup.share + burial.share;

export const meta = {
  title: "La Caja: qué deja cada línea",
  description:
    "El resultado técnico de cada línea de La Caja según su balance en la SSN, contra el mercado y contra su año anterior.",
};

export const intro = {
  kicker: "Respaldo del tramo 03 · no todo se cierra igual",
  title: "Qué deja cada línea, según el balance que La Caja presenta a la SSN.",
  lede: "La página propone cruzar, por producto, lo que deja cada cuenta con lo que cuesta atenderla. Ese cruce se hace adentro. Pero hay una versión pública: el balance trimestral abre por línea las primas, los siniestros y los gastos de estructura. Esto es lo que dice el de marzo de 2026.",
  back: "Volver a la lectura",
  backHref: "/lacaja#segmentos",
};

export const table = {
  index: "A",
  eyebrow: "La tabla",
  heading: `${lines.length} líneas, de ${data.meta.period}.`,
  intro:
    "Gastos de explotación es la estructura que La Caja le asigna a cada línea (sueldos, sistemas, alquileres), medida sobre sus primas. Resultado técnico es lo que queda de la prima después de siniestros y gastos, antes de lo que rinden las inversiones.",
  columns: {
    line: "Línea",
    premiums: "Primas",
    premiumsUnit: "mil M de $",
    share: "De su producción",
    operating: "Gastos de explotación",
    technical: "Resultado técnico",
    lacaja: "La Caja",
    market: "Mercado",
    previous: "Un año antes",
    amount: "En pesos",
  },
  portalTag: "pasa por el portal",
  /** Automotores entra por las flotas, que son una parte que la SSN no separa. */
  fleetTag: "incluye las flotas",
  total: {
    label: "Toda La Caja",
    premiums: data.meta.premiums,
    operating: data.meta.operating,
    technicalAmount: data.meta.technicalAmount,
    technical: (data.meta.technicalAmount / data.meta.premiums) * 100,
  },
  footnote: `Primas emitidas netas de anulaciones, nueve meses acumulados. Los porcentajes van sobre esas primas. «Mercado» es la suma de todas las aseguradoras en el mismo ramo, La Caja incluida. Quedan fuera las líneas con menos de $${plain(data.meta.floor, 0)} mil M de prima: ${data.omitted.join(", ").toLowerCase()}.`,
  source: "ssnBalances" as const,
};

export const readings = {
  index: "B",
  eyebrow: "Tres lecturas",
  heading: "Dónde está la plata, y dónde está la pregunta.",
  items: [
    {
      title: "La pérdida técnica es de autos.",
      text: `Automotores es el ${percent(autos.share)} de la prima y dio ${billions(autos.technicalAmount)} de resultado técnico. Las demás líneas, sumadas, dieron ${billions(rest, true)}. En autos la estructura asignada es ${percent(autos.operating)} de la prima, contra ${percent(autos.market.operating)} del mercado en el mismo ramo. Ahí adentro están las flotas, que la SSN no separa.`,
    },
    {
      title: "Dos líneas chicas pierden dos años seguidos.",
      text: `Accidentes personales colectivo (${signed(apGroup.technical)}) y sepelio colectivo (${signed(burial.technical)}) también fueron negativas un año antes (${signed(apGroup.previous.technical)} y ${signed(burial.previous.technical)}), y el mercado gana en las dos (${signed(apGroup.market.technical)} y ${signed(burial.market.technical)}). Juntas son el ${percent(smallShare)} de la prima y ${billions(smallLoss)} en nueve meses.`,
    },
    {
      title: "La estructura no está repartida pareja.",
      text: `La Caja le asigna a accidentes personales colectivo una estructura de ${percent(apGroup.operating)} de su prima, y a integral de comercio, ${percent(commerce.operating)}. No sé con qué criterio. Si es gente atendiendo nóminas, automatizar ataca justo ese gasto. Si es una clave de reparto, cerrar la línea no ahorra nada.`,
    },
  ],
  question: {
    label: "Dato de adentro",
    text: "¿Con qué criterio se reparten los gastos de estructura entre líneas?",
    why: "De eso depende que la tabla muestre un costo de servir o una convención contable.",
  },
};

export const limits = {
  index: "C",
  eyebrow: "Cómo leerlo",
  heading: "Lo que la tabla no alcanza a decir.",
  items: [
    `El resultado técnico no incluye lo que rinden las inversiones. Con inflación alta, automotores da técnico negativo en casi todo el mercado, y La Caja está en línea: ${signed(autos.technical)} contra ${signed(autos.market.technical)}.`,
    "El reparto de gastos entre líneas lo decide la compañía y el balance no lo explica. Un gasto asignado no desaparece por cerrar la línea.",
    "Accidentes personales colectivo incluye lo que se vende por alianzas, no sólo a empresas. La SSN no lo separa.",
    "En sepelio colectivo, casi el 90% de la prima figura como «otros gastos de producción». Puede ser el costo del servicio, que presta un tercero. No lo sé.",
    "Las líneas chicas se mueven mucho con un solo siniestro. Por eso miré dos ejercicios y no uno.",
    "Son nueve meses acumulados, en la moneda del balance. No es un año completo.",
    "La comparación con el año anterior puede no ser pareja: en 2026 la SSN cambió cómo se calcula el resultado técnico, y no sé si eso movió alguna cuenta de lugar.",
  ],
};

export const closing = {
  ran: "Fuente: balances de la SSN en datos abiertos, cortes del 31 de marzo de 2026 y de 2025. La cuenta está en el repositorio de este sitio.",
  footnote:
    "La suma de las líneas coincide con el total que informa la compañía. No uso ningún dato interno de La Caja y no tengo relación con ella.",
};
