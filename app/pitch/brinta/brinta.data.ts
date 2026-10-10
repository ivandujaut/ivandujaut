/**
 * Pieza para Brinta (Senior PM, octubre 2026). Todo el texto y todos los
 * números de la página viven acá; cada cifra real tiene su fuente en `sources`
 * y en la hoja de hechos (`data/brinta/facts.md`, fuera del repo). Las cifras
 * del cobro y del libro mayor son inventadas y la página las rotula como
 * "datos de ejemplo".
 */

export type SourceId =
  | "brintaAbout"
  | "brintaFilings"
  | "brintaPilot"
  | "brintaSales"
  | "brintaSettle"
  | "brintaSupplier"
  | "brintaInvoicing"
  | "brintaFiscalDocs"
  | "brintaFilingsOverview"
  | "vertex10qQ1"
  | "vertex10qQ2"
  | "comarb"
  | "arba"
  | "kpmg"
  | "uia2025"
  | "uia2024"
  | "corte"
  | "receitaCbs"
  | "lc214"
  | "splitTests"
  | "split2028"
  | "nfsePlataformas"
  | "calculadora"
  | "avalaraNews"
  | "avalaraPage";

export const sources: Record<SourceId, string> = {
  brintaAbout: "https://brinta.com/about",
  brintaFilings: "https://docs.brinta.com/docs/filings-per-country",
  brintaPilot:
    "https://brinta.com/blog/brinta-joins-brazil-s-federal-revenue-service-s-rfb-consumption-tax-reform-pilot-project",
  brintaSales: "https://docs.brinta.com/docs/tax-determination-with-sales",
  brintaSettle:
    "https://docs.brinta.com/docs/settling-funds-to-a-merchant-transfers-with-to-settle",
  brintaSupplier:
    "https://docs.brinta.com/docs/paying-a-supplier-invoice-transfers-with-payment-from-invoice",
  brintaInvoicing: "https://docs.brinta.com/docs/invoicing-flow-latam-e-invoicing",
  brintaFiscalDocs: "https://docs.brinta.com/reference/fiscal-documents-introduction",
  brintaFilingsOverview: "https://docs.brinta.com/docs/filings-overview",
  vertex10qQ1:
    "https://www.sec.gov/Archives/edgar/data/1806837/000110465926057207/verx-20260331x10q.htm",
  vertex10qQ2:
    "https://www.sec.gov/Archives/edgar/data/1806837/000110465926090420/verx-20260630x10q.htm",
  comarb:
    "https://www.ca.gob.ar/descargas/gacetillas/2026/Gacetilla_Recaudacion_Mensual_08_Ago_2026.pdf",
  arba: "https://www.arba.gov.ar/Intranet/Legislacion/Normas/Resoluciones/2022/Res028-22.pdf",
  kpmg: "https://mercado.com.ar/actualidad-tributaria/ingresos-brutos-vuelve-a-liderar-el-impacto-tributario-en-precios-segun-encuesta-de-kpmg",
  uia2025:
    "https://eleconomista.com.ar/economia/la-uia-alerta-profundizacion-saldos-favor-iibb-mas-800-millones-promedio-empresa-una-provincia-voraz-n90815",
  uia2024:
    "https://blogdelcontador.com.ar/saldos-a-favor-de-ingresos-brutos-problematicas-y-desafios-para-empresas-y-gobiernos",
  corte:
    "https://www.iprofesional.com/impuestos/463370-fallo-freno-retenciones-7000-millones-pesos-ingresos-brutos",
  receitaCbs:
    "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/entenda",
  lc214: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm",
  splitTests:
    "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/setembro/comunicado-5",
  split2028:
    "https://www.reformatributaria.com/tecnologia/split-payment-so-sera-obrigatorio-em-2028-diz-receita-federal/",
  nfsePlataformas:
    "https://www.cgibs.gov.br/upload/arquivos/202607/31091735-20260730-16h30-ato-conjunto-rfb-cgibs-na-c2-ba-4-260731-090909.pdf",
  calculadora:
    "https://www.reformatributaria.com/tecnologia/receita-federal-libera-ferramenta-oficial-de-calculo-da-reforma-tributaria-sobre-o-consumo/",
  avalaraNews:
    "https://www.cpapracticeadvisor.com/2026/03/31/avalara-launches-embedded-working-capital-solution-for-businesses/180582/",
  avalaraPage: "https://www.avalara.com/us/en/products/avalaracapital.html",
};

export const author = {
  name: "Iván Dujaut",
  linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
  emailUserReversed: "navituajud",
  emailDomainReversed: "moc.liamg",
};

export const meta = {
  title: "Brinta: los impuestos son caja",
  description:
    "Una lectura de Brinta, una tesis sobre hacia dónde puede ir y un primer paso para probarla.",
};

export const nav = [
  { id: "inicio", label: "Inicio" },
  { id: "plata", label: "Seguí la plata" },
  { id: "reglas", label: "Lo difícil" },
  { id: "brasil", label: "Lo que viene" },
  { id: "brinta", label: "Por qué Brinta puede" },
  { id: "tesis", label: "La tesis" },
  { id: "caso", label: "Un primer paso" },
  { id: "pruebas", label: "Por qué yo" },
  { id: "cierre", label: "Cierre" },
] as const;

export const hero = {
  kicker: "Brinta, leída desde afuera",
  title: "Los impuestos no son un trámite.",
  titleAccent: "Son caja.",
  lede: "Leí a Brinta como si me tocara decidir hacia dónde va. Esto es lo que vi, la tesis que saqué y un primer paso para probarla.",
  byline: "Octubre de 2026",
  cue: "Cinco minutos de lectura. La cinta de la izquierda es la plata y baja a medida que leés.",
  ribbonLabel: "Un cobro de $100.000",
};

/** Escena 01. Montos de ejemplo; la alícuota de 3% es la de ARBA para quien no está en el padrón. */
export const followMoney = {
  index: "01",
  eyebrow: "Seguí la plata",
  heading: "Un cobro con tarjeta, de punta a punta",
  exampleBadge: "datos de ejemplo",
  amounts: { cobro: 100_000, retencion: 3_000, impuestoReal: 1_800, atrapado: 1_200 },
  labels: {
    cobro: "$100.000 cobrados",
    comercio: "$97.000 al comercio",
    lens: "Con lupa: los $3.000",
    retencion: "$3.000 retenidos",
    impuesto: "$1.800 era el impuesto",
    atrapado: "$1.200 quedan en el fisco",
    pool: "saldo a favor",
  },
  steps: [
    {
      id: "cobro",
      text: "Un comercio de la provincia de Buenos Aires cobra $100.000 con tarjeta.",
    },
    {
      id: "retencion",
      text: "Antes de pagarle, el procesador le retiene Ingresos Brutos. Si el comercio no figura en el padrón, la retención es de 3%: $3.000.",
      source: "arba" as SourceId,
    },
    {
      id: "split",
      text: "Pero el impuesto real de ese mes era menor. La diferencia no vuelve sola: queda en el fisco como saldo a favor.",
    },
    {
      id: "pool",
      text: "Y ahí se queda. En un relevamiento de la UIA, 22% de las empresas tarda más de un año en recuperar ese saldo o lo da por perdido.",
      source: "uia2024" as SourceId,
    },
  ],
  stats: [
    {
      value: "$1,5 billones",
      label: "retenidos sobre cobros con tarjeta y billetera entre enero y agosto de 2026",
      source: "comarb" as SourceId,
      sourceLabel: "Comisión Arbitral",
    },
    {
      value: "84%",
      label:
        "de las empresas medianas y grandes encuestadas declara saldo a favor de Ingresos Brutos",
      source: "kpmg" as SourceId,
      sourceLabel: "KPMG",
    },
    {
      value: "$719 millones",
      label: "de saldo a favor promedio por empresa, a marzo de 2025",
      source: "uia2025" as SourceId,
      sourceLabel: "UIA",
    },
  ],
  kinds: {
    title: "Tres clases de caja",
    items: [
      { id: "sale", name: "La que sale", text: "El impuesto que corresponde." },
      { id: "atrapada", name: "La atrapada", text: "Lo que se pagó de más y no vuelve." },
      {
        id: "riesgo",
        name: "La que está en riesgo",
        text: "Lo que calcula el fisco y nadie revisa.",
      },
    ],
  },
};

export const rules = {
  index: "02",
  eyebrow: "Lo difícil",
  heading:
    "Lo difícil es que cada país, cada provincia y cada municipio tiene sus reglas, y que cambian todo el tiempo.",
  counters: [
    { value: 19, suffix: "+", label: "países", source: "brintaAbout" as SourceId },
    { value: 6000, suffix: "+", label: "jurisdicciones", source: "brintaAbout" as SourceId },
    { value: 50, suffix: "+", label: "cambios por día", source: "brintaAbout" as SourceId },
    {
      value: 285,
      suffix: "",
      label: "formularios en sus docs",
      source: "brintaFilings" as SourceId,
    },
  ],
  countersNote: "Así dimensiona Brinta el problema en su sitio y en su documentación.",
  threads: [
    "CABA",
    "Buenos Aires",
    "Córdoba",
    "Santa Fe",
    "Misiones",
    "Tucumán",
    "São Paulo",
    "Rio de Janeiro",
    "Minas Gerais",
    "Bogotá",
    "Medellín",
    "Cali",
    "Ciudad de México",
    "Jalisco",
    "Nuevo León",
  ],
  highlightThread: "Misiones",
  anecdote: {
    lead: "Un ejemplo de cuánto pesa una sola jurisdicción.",
    text: "En el relevamiento de la UIA, Misiones concentra más del 30% de los saldos a favor de Ingresos Brutos con menos del 5% de los establecimientos. En agosto, la Corte Suprema suspendió de forma cautelar las retenciones de la provincia a dos empresas.",
    sources: ["uia2025", "corte"] as SourceId[],
  },
  close:
    "Multiplicalo por cada provincia argentina, cada municipio colombiano y cada estado de Brasil. Mantener eso al día, por API, es lo que hace Brinta.",
};

export const brazil = {
  index: "03",
  eyebrow: "Lo que viene",
  heading: "En 2027, en Brasil, el impuesto se cobra en el momento del pago",
  steps: [
    {
      id: "cbs",
      text: "Desde el 1 de enero de 2027, Brasil cobra de lleno la CBS, el nuevo impuesto federal al consumo.",
      source: "receitaCbs" as SourceId,
    },
    {
      id: "split",
      text: "La ley obliga a los procesadores de pago a separar el impuesto en el momento de liquidar: el split payment. Las pruebas con la Receita empiezan el 15 de octubre y la obligación entre empresas se proyecta para 2028.",
      sources: ["lc214", "splitTests", "split2028"] as SourceId[],
    },
    {
      id: "credito",
      text: "El que compra se acredita el impuesto cuando el del proveedor quedó pagado. Cómo y cuándo le pagás a un proveedor pasa a definir cuánta caja recuperás.",
      source: "lc214" as SourceId,
      note: "Art. 47 de la LC 214, con una excepción mientras el split no esté en marcha.",
    },
    {
      id: "silencio",
      text: "Y la cuenta del período la arma el fisco. La empresa sólo puede ajustarla: si no responde a tiempo, queda aceptada.",
      source: "lc214" as SourceId,
      note: "Art. 46 de la LC 214.",
    },
  ],
  labels: {
    pago: "pago",
    proveedor: "al proveedor",
    fisco: "CBS al fisco",
    credito: "crédito del comprador",
    apuracion: "Cuenta del período",
    stamp: "Aceptado por silencio",
  },
  footnote:
    "La Receita, además, publicó una calculadora oficial gratuita y con API, así que calcular deja de ser un diferencial.",
  footnoteSource: "calculadora" as SourceId,
};

export const sees = {
  index: "04",
  eyebrow: "Por qué Brinta puede",
  heading:
    "Un estudio contable ve la declaración del mes. Brinta ve cada transacción que la produce.",
  nodes: [
    {
      id: "venta",
      name: "Venta",
      endpoint: "POST /sales",
      text: "Calcula el impuesto de cada línea, con el medio de pago y las cuotas.",
      source: "brintaSales" as SourceId,
    },
    {
      id: "liquidacion",
      name: "Liquidación a un comercio",
      endpoint: "POST /transfers · to settle",
      text: "Calcula la retención que el procesador aplica antes de pagarle.",
      source: "brintaSettle" as SourceId,
    },
    {
      id: "proveedor",
      name: "Pago a un proveedor",
      endpoint: "POST /transfers · payment from invoice",
      text: "Calcula la retención sobre una factura recibida.",
      source: "brintaSupplier" as SourceId,
    },
    {
      id: "factura",
      name: "Factura",
      endpoint: "POST /invoices",
      text: "Emite el comprobante y recibe la respuesta del fisco por webhook.",
      source: "brintaInvoicing" as SourceId,
    },
    {
      id: "certificado",
      name: "Certificado",
      endpoint: "fiscal-documents",
      text: "Genera el certificado de retención y la orden de pago.",
      source: "brintaFiscalDocs" as SourceId,
    },
    {
      id: "declaracion",
      name: "Declaración",
      endpoint: "filings",
      text: "Arma la declaración del período en cuanto abre la ventana.",
      source: "brintaFilingsOverview" as SourceId,
    },
  ],
  asset:
    "El activo de Brinta es la versión de la empresa, transacción por transacción, del mismo dato con el que el fisco arma su cuenta.",
  vertex:
    "Desde marzo, además, Brinta es parte de Vertex, que la compró para ampliar su cobertura en América Latina con la facturación electrónica de Brinta.",
  vertexSource: "vertex10qQ1" as SourceId,
};

export const thesis = {
  index: "05",
  eyebrow: "La tesis",
  sentence: "Calcular va a ser gratis.",
  sentenceAccent: "El negocio es la caja.",
  rungs: [
    {
      id: "dato",
      tag: "Ya está",
      name: "El dato",
      text: "La posición fiscal de cada cliente, transacción por transacción.",
    },
    {
      id: "plata",
      tag: "Lo que viene",
      name: "La plata",
      text: "El impuesto pasa a pagarse en el momento del pago. Brinta organiza ese pago sin tocar los fondos y cobra por cada evento.",
    },
    {
      id: "caja",
      tag: "El negocio",
      name: "La caja",
      text: "Que el cliente no pague de más, que no le quede plata atrapada y que la que el fisco le debe vuelva antes.",
    },
  ],
  evidence: [
    {
      id: "avalara",
      lead: "Avalara ya lo hace.",
      text: "En marzo lanzó Avalara Capital, un crédito para pagar impuestos que otorga un prestamista socio. Avalara aclara que no es prestamista y que aporta los datos.",
      sources: ["avalaraNews", "avalaraPage"] as SourceId[],
    },
    {
      id: "vertex",
      lead: "Encaja con el dueño.",
      text: "Vertex se presenta como una empresa “Decision-to-Defense”. Esta tesis es esa promesa aplicada a América Latina.",
      sources: ["vertex10qQ2"] as SourceId[],
    },
  ],
};

export interface LedgerRow {
  id: string;
  doc: string;
  kind: string;
  ours: number;
  fisco: number;
  /** Explicación de la diferencia; sin `reason` la fila coincide. */
  reason?: string;
  /** "favor": el fisco cobra de más. "pendiente": crédito que depende de un pago. */
  status?: "favor" | "pendiente";
}

export const firstStep = {
  index: "06",
  eyebrow: "Un primer paso",
  heading: "Diferencias CBS: revisar la cuenta del fisco antes de que quede aceptada",
  who: "Para plataformas que facturan con Brinta en Brasil. Ahí Brinta emite las facturas de venta y captura las de compra, así que tiene la cuenta completa para compararla con la del fisco.",
  ledger: {
    exampleBadge: "datos de ejemplo",
    period: "Enero de 2027",
    currency: "R$",
    columns: {
      doc: "Documento",
      ours: "Cuenta de Brinta",
      fisco: "Cuenta del fisco",
      diff: "Diferencia",
    },
    rows: [
      { id: "r1", doc: "NFS-e 1042", kind: "venta", ours: 1_240, fisco: 1_240 },
      {
        id: "r2",
        doc: "NFS-e 1043",
        kind: "venta cancelada",
        ours: 0,
        fisco: 420,
        reason: "Factura cancelada que el fisco todavía cuenta",
        status: "favor",
      },
      { id: "r3", doc: "NFS-e 1051", kind: "venta", ours: 980, fisco: 980 },
      {
        id: "r4",
        doc: "Nota de crédito 88",
        kind: "devolución",
        ours: -400,
        fisco: 0,
        reason: "Devolución que el fisco no descontó",
        status: "favor",
      },
      {
        id: "r5",
        doc: "Compra 77",
        kind: "crédito",
        ours: -310,
        fisco: 0,
        reason: "El proveedor todavía no pagó: el crédito queda pendiente",
        status: "pendiente",
      },
      { id: "r6", doc: "Compra 81", kind: "crédito", ours: -150, fisco: -150 },
    ] satisfies LedgerRow[],
    totalLabel: "Saldo del período",
    deadline: "Quedan 9 días para ajustar",
    actions: {
      overlay: "Superponer la cuenta del fisco",
      adjust: "Proponer el ajuste",
      ignore: "No hacer nada",
      reset: "Volver a empezar",
    },
    summary: {
      favor: "a favor del cliente, por errores de la cuenta del fisco",
      pendiente: "que dependen de un pago pendiente al proveedor",
      adjusted: "Ajuste propuesto. El cliente no paga de más.",
      stamp: "Aceptado por silencio",
      silenced: "Nadie respondió: la cuenta del fisco quedó como deuda confesada.",
    },
  },
  why: {
    title: "Por qué este primero",
    items: [
      "El plazo es real: la CBS se cobra desde enero de 2027 y las facturas de plataformas llevan IBS y CBS desde el 1 de diciembre.",
      "Los datos ya están en Brinta: emite las ventas y captura las compras.",
      "Un país, un impuesto, un segmento. Se aprende rápido y se mide limpio.",
      "No hacer nada cuesta caro: el cliente acepta una deuda que no corresponde.",
    ],
    sources: ["receitaCbs", "nfsePlataformas", "brintaPilot"] as SourceId[],
    pilot: "Brinta dice, además, que participa del piloto oficial de la CBS.",
  },
  metrics: {
    title: "Cómo lo mediría",
    baseline:
      "La línea de base es el primer período con CBS plena: enero de 2027. Los cortes se fijan antes de ver resultados.",
    head: {
      segment: "Segmento",
      question: "Pregunta",
      leading: "Adelanta",
      lagging: "Confirma",
      guardrail: "Cuida",
      cut: "Lo medimos hasta acá",
    },
    segments: [
      {
        id: "plataformas",
        segment: "Plataformas que facturan con Brinta",
        question: "¿La cuenta del fisco coincide con la nuestra?",
        leading: "Períodos revisados antes del vencimiento",
        lagging: "Reales corregidos a favor del cliente, por período",
        guardrail: "Diferencias marcadas que el equipo fiscal del cliente descarta",
        cut: "Si en los tres primeros períodos menos de 1 de cada 5 clientes tiene una diferencia confirmada, se apaga.",
      },
      {
        id: "financieras",
        segment: "Instituciones financieras (régimen específico)",
        question: "¿El mismo control sirve con las reglas del sector financiero?",
        leading: "Clientes con su declaración conciliada contra la cuenta del fisco",
        lagging: "Diferencias confirmadas por cliente",
        guardrail: "Horas de configuración manual por cliente",
        cut: "Si cada cliente necesita configuración a mano, se frena hasta automatizar el mapeo.",
      },
    ],
  },
  notToBuild: {
    title: "Qué no construir",
    items: [
      "Una calculadora propia: la del fisco ya es gratis.",
      "Un tablero de todos los impuestos de todos los países.",
      "Servicios de litigio.",
      "Préstamos con balance propio.",
    ],
  },
  kill: {
    title: "Qué lo mata",
    text: "Que casi nunca haya diferencias, o que las haya y nadie ajuste. En cualquiera de los dos casos se apaga.",
  },
  next: {
    title: "Después",
    text: "Con el registro de qué crédito está firme y cuál pendiente, el paso siguiente es mostrarle al comprador cómo pagarle a cada proveedor para asegurar su crédito. Más adelante, adelantar el saldo que el fisco debe devolver, con un socio que ponga la plata.",
  },
};

export const proofs = {
  index: "07",
  eyebrow: "Por qué yo",
  heading: "Tres cosas que ya hice y que este camino necesita",
  items: [
    {
      id: "pix",
      title: "Pix Brasil",
      number: "Datos del BCB",
      line: "Leí con datos abiertos del Banco Central el rail de pagos donde arranca el split payment.",
      proves: "Entiendo los pagos de Brasil desde el dato.",
      href: "/projects/pix-brasil",
      hrefLabel: "Leer el caso",
    },
    {
      id: "bot",
      title: "Bot asesor de seguros",
      number: "64%",
      line: "De las consultas repetidas resueltas sin tocar el modelo, con un umbral elegido por curva ROC.",
      proves: "Sé llevar un agente a producción y medirlo.",
      href: "/projects/insurance-advisor-bot",
      hrefLabel: "Ver el caso",
    },
    {
      id: "visa",
      title: "Casebook: Visa",
      number: "Quién cobra qué",
      line: "A Visa le conviene que pagues el café con tarjeta: arancel, intercambio y volumen en un solo pago.",
      proves: "Sé seguir la plata dentro de un cobro.",
      href: "/casebook/visa-volumen-o-precio",
      hrefLabel: "Leer el caso",
    },
  ],
};

export const close = {
  heading: "Es una lectura de afuera.",
  body: "Me gustaría contrastarla con lo que ven adentro: qué está bien, qué está mal y qué no se puede ver desde acá.",
  emailLabel: "Escribime",
  siteLabel: "Ver mi trabajo publicado",
  siteHref: "/",
  sourcesLine: "Cada dato de esta página tiene su fuente.",
  sourcesToggle: "Ver las {n} fuentes públicas",
  footnote:
    "Las cifras del cobro y del libro mayor son datos de ejemplo. Página sin marca ni material de Brinta ni de Vertex.",
};

/** Fuentes únicas en orden de aparición, para el pie. */
export function sourceList(): string[] {
  return Array.from(new Set(Object.values(sources)));
}
