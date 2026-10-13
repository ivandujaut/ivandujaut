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
  | "avalaraPage"
  | "saldosVias"
  | "kaszekPosting"
  | "brintaFilingManagement"
  | "brintaBlogFilings"
  | "brintaRoles";

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
  saldosVias:
    "https://eleconomista.com.ar/economia/saldos-favor-cuales-son-opciones-recuperarlos-ganancias-iva-e-ingresos-brutos-n97603",
  kaszekPosting: "https://jobs.kaszek.com/jobs/brinta/569fa539-f2a2-4ec6-a532-4ed4b0f6f788",
  brintaFilingManagement: "https://docs.brinta.com/docs/filing-management",
  brintaBlogFilings:
    "https://brinta.com/blog/how-to-process-tax-returns-on-brinta-s-tax-automation-platform-without-erp-integration",
  brintaRoles: "https://docs.brinta.com/docs/en-roles-permissions-details",
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
  { id: "plataforma", label: "El día a día" },
  { id: "pruebas", label: "Por qué yo" },
  { id: "cierre", label: "Cierre" },
] as const;

export const hero = {
  kicker: "Brinta, leída desde afuera",
  title: "Los impuestos no son un trámite.",
  titleAccent: "Son caja.",
  lede: "Leí a Brinta como si me tocara decidir hacia dónde va. Esto es lo que vi, la tesis que saqué y un primer paso para probarla.",
  byline: "Octubre de 2026",
  cue: "Ocho minutos de lectura. La cinta de la izquierda es la plata y baja a medida que leés.",
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
      text: "Pero el impuesto real de ese mes era menor. La diferencia no vuelve sola: queda en el fisco como saldo a favor. Es caja atrapada.",
    },
    {
      id: "pool",
      text: "Y ahí se queda. En un relevamiento de la UIA, 22% de las empresas tarda más de un año en recuperar ese saldo o lo da por perdido.",
      source: "uia2024" as SourceId,
    },
  ],
  stats: [
    {
      value: "$719 millones",
      label: "de saldo a favor promedio por empresa, a marzo de 2025",
      source: "uia2025" as SourceId,
      sourceLabel: "UIA",
    },
    {
      value: "84%",
      label:
        "de las empresas medianas y grandes encuestadas declara saldo a favor de Ingresos Brutos",
      source: "kpmg" as SourceId,
      sourceLabel: "KPMG",
    },
    {
      value: "$1,5 billones",
      label: "retenidos sobre cobros con tarjeta y billetera entre enero y agosto de 2026",
      source: "comarb" as SourceId,
      sourceLabel: "Comisión Arbitral",
    },
  ],
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
  heading: "Brasil está llevando el impuesto al momento del pago",
  steps: [
    {
      id: "cbs",
      text: "Desde el 1 de enero de 2027, Brasil cobra de lleno la CBS, el nuevo impuesto federal al consumo.",
      source: "receitaCbs" as SourceId,
    },
    {
      id: "split",
      text: "La ley obliga a los procesadores de pago a separar el impuesto al liquidar: el split payment. Las pruebas empiezan el 15 de octubre y la obligación entre empresas se proyecta para 2028.",
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
      text: "Y la cuenta del período la arma el fisco. La empresa sólo puede ajustarla: si no responde a tiempo, queda aceptada. Es caja en riesgo.",
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
  recap: {
    title: "Tres clases de caja",
    lead: "Las tres aparecieron en los dibujos. Cada una pide un producto distinto.",
    items: [
      {
        id: "sale",
        name: "La que sale",
        text: "El impuesto que corresponde: los $1.800 del cobro, la CBS que va al fisco.",
      },
      {
        id: "atrapada",
        name: "La atrapada",
        text: "Lo que se pagó de más y no vuelve: los $1.200 que quedaron en el fisco.",
      },
      {
        id: "riesgo",
        name: "La que está en riesgo",
        text: "La cuenta que arma el fisco y nadie revisa: la que queda aceptada por silencio.",
      },
    ],
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
  sentence: "Calcular deja de ser el diferencial.",
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
      lead: "El modelo ya existe.",
      text: "En marzo, Avalara lanzó Avalara Capital, un crédito para pagar impuestos que otorga un prestamista socio. Avalara aclara que no es prestamista y que aporta los datos. No es la misma caja, pero es el mismo modelo: el dato es propio y la plata, de otro.",
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
  /**
   * "favor": el fisco cobra de más. "pendiente": crédito que depende del
   * proveedor. En enero de 2027 no hay split, así que rige la excepción del
   * art. 48: el crédito pide la factura bien hecha, no el pago del proveedor.
   */
  status?: "favor" | "pendiente";
}

export const firstStep = {
  index: "06",
  eyebrow: "Un primer paso",
  heading: "Diferencias CBS: revisar la cuenta del fisco antes de que quede aceptada",
  goal: {
    lead: "El objetivo.",
    text: "Que en 2027 ningún cliente de Brinta en Brasil acepte por silencio una cuenta de CBS que no le corresponde. Lo vendería como un módulo de la plataforma de declaraciones, por empresa y por período, con un precio muy por debajo de lo que recupera.",
  },
  who: "Para plataformas que facturan con Brinta en Brasil. Ahí Brinta emite las facturas de venta y captura las de compra, así que tiene la cuenta completa para compararla con la del fisco. Vive en la plataforma de declaraciones, como un cruce más en la etapa de revisión.",
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
        reason:
          "La factura del proveedor trae mal el impuesto: el crédito no entra hasta que la corrija",
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
      pendiente: "que dependen de que un proveedor corrija su factura",
      adjusted: "Ajuste propuesto. El cliente no paga de más.",
      stamp: "Aceptado por silencio",
      silenced: "Nadie respondió: la cuenta del fisco quedó como deuda confesada.",
    },
  },
  why: {
    title: "Por qué este primero",
    items: [
      "El plazo es real: la CBS se cobra desde enero de 2027, y desde el 1 de diciembre las facturas de plataformas tienen que llevar IBS y CBS.",
      "Los datos ya están en Brinta: emite las ventas y captura las compras.",
      "Un país, un impuesto, un segmento. Se aprende rápido y se mide limpio.",
      "No hacer nada cuesta caro: el cliente acepta una deuda que no corresponde.",
    ],
    sources: ["receitaCbs", "nfsePlataformas", "brintaPilot"] as SourceId[],
    pilot: "Brinta dice, además, que participa del piloto oficial de la CBS.",
    argentina: {
      lead: "¿Y Argentina, que abre esta página?",
      text: "Va después. Ahí Brinta calcula la retención de cada comercio, pero la declaración del comercio no pasa por Brinta, así que no sabe cuánto impuesto le correspondía. En Brasil tiene las dos puntas de la cuenta y un plazo legal.",
    },
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
        cut: "Si configurar un cliente lleva más de 8 horas de trabajo manual, se frena hasta automatizar el mapeo.",
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
    paragraphs: [
      {
        text: "Cuando el split esté en marcha, el crédito del comprador va a depender de cómo le pagó a cada proveedor. Con el registro de qué crédito está firme y cuál pendiente, el paso siguiente es mostrarle cómo pagar para asegurarlo. Más adelante, adelantar el saldo que el fisco debe devolver, con un socio que ponga la plata. Como adelanto y no como compra: la ley no deja transferir ese saldo a terceros.",
        sources: ["lc214"] as SourceId[],
      },
      {
        text: "En Argentina, el paso equivalente es prevenir: sumar la declaración del comercio a través del procesador y avisarle cuando lo retenido le gana al impuesto, para que pida a tiempo la exclusión o la reducción de la retención. Frenar el saldo es más rápido que recuperarlo.",
        sources: ["saldosVias"] as SourceId[],
      },
    ],
  },
};

/**
 * Escena 07. Los estados de una declaración salen de los docs y del blog de
 * Brinta; "hand" marca los pasos donde esas fuentes muestran a una persona.
 */
export const platform = {
  index: "07",
  eyebrow: "El día a día",
  heading: "Una plataforma que no dependa de manos",
  lead: "El aviso pide llevar el día a día de la plataforma de declaraciones. Así se ve una declaración por dentro, según los docs de Brinta.",
  leadSources: ["kaszekPosting", "brintaFilingsOverview"] as SourceId[],
  legend: { hand: "Paso con una persona", auto: "Paso automático" },
  stations: [
    {
      id: "setup",
      name: "Configuración",
      status: "Setup",
      hand: true,
      text: "El cliente sube sus archivos y Brinta los lee. Los parámetros de cada formulario los define el equipo de Vertex.",
      source: "brintaFilingManagement" as SourceId,
    },
    {
      id: "processing",
      name: "Proceso",
      status: "Processing",
      hand: false,
      text: "Brinta ordena los datos y arma el borrador con su papel de trabajo.",
      source: "brintaBlogFilings" as SourceId,
    },
    {
      id: "review",
      name: "Revisión",
      status: "Review",
      hand: true,
      text: "Validaciones y cruces. Un aprobador la aprueba, o “Asignar a Brinta” abre un ticket de soporte.",
      source: "brintaBlogFilings" as SourceId,
      branch: "Acá entraría Diferencias CBS: un cruce más, contra la cuenta del fisco.",
    },
    {
      id: "ready",
      name: "Lista para presentar",
      status: "Ready to File",
      hand: true,
      text: "Alguien elige si la presenta el cliente a mano o Brinta por integración.",
      source: "brintaBlogFilings" as SourceId,
    },
    {
      id: "preparing",
      name: "Presentando",
      status: "Preparing Filing",
      hand: false,
      text: "Si la presenta Brinta, sale sola y pasa a presentada.",
      source: "brintaBlogFilings" as SourceId,
    },
    {
      id: "filed",
      name: "Presentada",
      status: "Filed",
      hand: true,
      text: "Si la presentó el cliente, alguien la marca como transmitida.",
      source: "brintaRoles" as SourceId,
    },
  ],
  why: "Diferencias CBS suma una revisión por cliente y por mes. Si cada una pasa por una persona, el producto no escala: la tesis depende de este trabajo.",
  design: {
    lead: "Las manos están a propósito.",
    text: "En impuestos el control importa, y que un experto defina cada formulario es parte del producto. La pregunta no es sacarlas todas, sino cuáles se repiten.",
  },
  ladder: {
    title: "Cómo sale una mano del camino",
    steps: [
      "Una guía para operaciones",
      "Una automatización interna",
      "Autoservicio para el cliente",
      "Producto",
    ],
    note: "Se sube un escalón a la tercera repetición, no antes: con un solo caso, generalizar es adivinar.",
  },
  metrics: {
    title: "Qué miraría",
    items: [
      {
        name: "Tickets de “Asignar a Brinta” cada 100 declaraciones",
        why: "Dice dónde se traba la plataforma.",
      },
      {
        name: "Declaraciones presentadas sin intervención manual",
        why: "Dice si escala sin sumar gente.",
      },
      {
        name: "Rectificativas y rechazos del fisco",
        why: "Es el límite: sacar manos no puede costar calidad.",
      },
    ],
    baseline: "No hay números públicos: la línea de base la fijo el primer mes, con operaciones.",
  },
  notDo: {
    title: "Qué no haría",
    items: [
      "Sacar al experto tributario del circuito.",
      "Automatizar un formulario antes de verlo repetirse.",
    ],
  },
  caseLink: {
    text: "Diferencias CBS nace con esa vara: entra en la revisión como un cruce más, y si configurar un cliente lleva más de 8 horas a mano, se frena.",
    label: "Volver al caso",
    href: "#caso",
  },
};

export const proofs = {
  index: "08",
  eyebrow: "Por qué yo",
  heading: "Tres cosas que ya hice y que este camino necesita",
  items: [
    {
      id: "pix",
      title: "Pix Brasil",
      number: "Datos del BCB",
      line: "Leí con datos abiertos del Banco Central a Pix, uno de los medios de pago con los que arranca el split payment.",
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
