/**
 * Fuente única de datos para /lebane.
 * Regla: ningún número aparece en la UI si no está acá con su `source`.
 * Los datos marcados `illustrative: true` son inventados para la maqueta del caso
 * y se muestran con el rótulo "datos de ejemplo".
 */

export type Sourced<T> = { value: T; source: string; note?: string };

export const company = {
  name: "Lebane",
  founded: { value: 2023, source: "https://www.startupjournal.io/article/lebane-levanta-4M" },
  hq: { value: "Buenos Aires (Saavedra, CABA)", source: "https://construi-en-lebane.lovable.app/" },
  markets: { value: ["Argentina", "México"], source: "https://www.lebane.app/ar" },
  usersInCountries: {
    value: 6,
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
    note: "Incluye Uruguay, Paraguay, Estados Unidos y España",
  },
} as const;

export type Milestone = {
  date: string;
  label: string;
  /** Cifra tal como se muestra al final de la animación. */
  metric?: string;
  /**
   * Descomposición de `metric` para animar el número con `textContent`:
   * `prefix + count + suffix` tiene que reconstruir `metric` exactamente.
   */
  count?: { value: number; prefix?: string; suffix?: string };
  source: string;
};

export const timeline: Milestone[] = [
  {
    date: "Ago 2023",
    label: "Sale de stealth mode",
    source: "https://agroempresario.com/publicacion/110981/",
  },
  {
    date: "Jul 2024",
    label: "30 clientes",
    metric: "30",
    count: { value: 30 },
    source:
      "https://www.iproup.com/startups/60609-argentinos-revolucionan-el-mercado-inmobiliario-con-ia-levanta-usd-1-millon",
  },
  {
    date: "2025",
    label: "Más de 150 clientes, proyección USD 1M",
    metric: "150+",
    count: { value: 150, suffix: "+" },
    source:
      "https://www.forbesargentina.com/negocios/se-conocieron-ascensor-crearon-startup-argentina-ia-revoluciona-real-estate-proyectan-facturar-us-1-millon-n76379",
  },
  {
    date: "Feb 2026",
    label: "Ronda seed USD 4M · más de 300 clientes · facturación x4",
    metric: "USD 4M",
    count: { value: 4, prefix: "USD ", suffix: "M" },
    source:
      "https://www.infobae.com/economia/2026/02/18/la-startup-argentina-que-recaudo-usd-4-millones-para-ponerle-fin-al-caos-del-excel-y-digitalizar-el-negocio-de-la-construccion/",
  },
  {
    date: "Ago 2026",
    label: "Payments + Lena · más de 400 clientes · 100.000 transacciones/mes",
    metric: "400+",
    count: { value: 400, suffix: "+" },
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
];

export const funding = {
  seedRound: {
    value: "USD 4M",
    source:
      "https://dfsud.com/america/argentina-lebane-cierra-ronda-de-inversion-de-us-4-millones-y-consolida",
  },
  leads: {
    value: ["Atlántico", "Zacua Ventures"],
    source:
      "https://dfsud.com/america/argentina-lebane-cierra-ronda-de-inversion-de-us-4-millones-y-consolida",
  },
  participants: {
    value: ["Fen Ventures", "ADN.vc", "Kuiper VC", "Galicia Ventures"],
    source:
      "https://dfsud.com/america/argentina-lebane-cierra-ronda-de-inversion-de-us-4-millones-y-consolida",
  },
  plannedExpansion: {
    value: "USD 5M adicionales",
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
} as const;

export const team = {
  employeesAug2026: {
    value: 75,
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
  targetEndOf2026: {
    value: 150,
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
  founders: {
    value: ["Bruno Lerer", "Lucas Glustman", "Diego Sarro", "Matías Podrojsky", "Diego Cabrosi"],
    source: "https://www.startupjournal.io/article/lebane-levanta-4M",
  },
} as const;

/** Módulos en el orden en que los usa un cliente (sección product-map). */
export const productMap: Array<{ id: string; label: string; oneLiner: string }> = [
  {
    id: "comercial",
    label: "Comercial y Contratos",
    oneLiner: "Venta de unidades, boletos, ajuste por CAC/IPC.",
  },
  {
    id: "cobranzas",
    label: "Cobranzas",
    oneLiner: "Cuentas corrientes de compradores, envío de cuotas ajustadas, recibos.",
  },
  {
    id: "compras",
    label: "Compras y Órdenes",
    oneLiner: "Requisición, cotización, aprobación, pago.",
  },
  {
    id: "presupuesto",
    label: "Control presupuestal",
    oneLiner: "Presupuesto vs. comprometido vs. pagado, certificaciones.",
  },
  { id: "tesoreria", label: "Tesorería", oneLiner: "Flujo de fondos por obra." },
  {
    id: "contabilidad",
    label: "Contabilidad",
    oneLiner: "Asientos automáticos, impuestos, reportes.",
  },
  {
    id: "payments",
    label: "Payments",
    oneLiner: "Cada comprador con su CVU; el cobro entra identificado y se concilia solo.",
  },
];
export const productMapSource = "https://www.lebane.app/ar/producto";
export const aiLayer = {
  name: "Lena",
  formerName: "Lebyx",
  oneLiner:
    "Agentes por WhatsApp: carga de documentos, consultas, y en desarrollo cobranzas, compras, auditoría.",
  source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
};

/** Estrategia declarada por los founders (sección thesis / why-lebane-can). */
export const strategy = {
  threeStages: {
    value: [
      "Centralizar la información operativa de cada obra",
      "Incorporar el movimiento real del dinero en el sistema",
      "Usar esos datos para perfiles crediticios y financiamiento",
    ],
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
  pspLicense: {
    value: "Licencia PSP junto con Banco Industrial",
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
  bankGap: {
    value:
      "Cada proyecto es un fideicomiso o razón social nueva; la banca no puede evaluar el riesgo.",
    source:
      "https://mercado.com.ar/negocios/lebane-invirtio-us-4-millones-y-sumo-pagos-integrados-para-constructoras",
    note: "Paráfrasis de declaraciones de Lucas Glustman.",
  },
  borrowers: {
    value: ["desarrolladores", "constructores", "compradores"],
    source: "https://www.cbinsights.com/company/lebane",
  },
  fundWithMarket: {
    value: "Próximo paso: fondo de financiamiento de obras con actores del mercado",
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
} as const;

/** Cifras de dolor que Lebane usa en su comunicación. */
export const painStats = {
  budgetDeviation: {
    value: "35% a 50%",
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
  operationalInefficiency: {
    value: "10% a 15%",
    source: "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/",
  },
  churn: {
    value: "< 1%",
    source: "https://adn.vc/%F0%9F%A7%AC-adn-vc-newsletter-014/",
    note: "Según ADN.vc, inversor.",
  },
} as const;

/** Sección why-lebane-can: las dos vistas, sin cifras. */
export const twoViews = {
  bank: {
    title: "Lo que ve el banco",
    items: ["Planillas sueltas", "Un fideicomiso por obra", "Sin historial", "Balances viejos"],
    source: strategy.bankGap.source,
  },
  lebane: {
    title: "Lo que ve Lebane",
    items: [
      "Presupuesto",
      "Comprometido",
      "Pagado",
      "Avance certificado",
      "Ventas y cuotas",
      "Mora",
      "Dinero real (CVU)",
    ],
    source: productMapSource,
  },
} as const;

/** Sección thesis: comparables públicos del playbook. */
export const thesis = {
  sentences: [
    {
      key: "erp",
      text: "El ERP es la puerta.",
      keyword: "puerta",
      floor: "La obra entera, cargada en un solo lugar.",
    },
    {
      key: "payments",
      text: "Payments es el puente.",
      keyword: "puente",
      floor: "El dinero real pasa por adentro.",
    },
    {
      key: "credit",
      text: "El crédito es el negocio.",
      keyword: "negocio",
      floor: "Con datos y flujo, se puede prestar.",
    },
  ],
  comparables: "Toast, Square, Shopify y Mercado Crédito hicieron lo mismo en sus rubros.",
} as const;

/** MAQUETA DEL CASO: datos inventados, verosímiles. Mostrar "datos de ejemplo". */
export const scoreCardExample = {
  illustrative: true as const,
  projectName: "Torre Ejemplo · 48 unidades",
  indicators: [
    {
      id: "budget",
      label: "Desvío presupuestario",
      value: "+6%",
      score: 78,
      hint: "vs. presupuesto original",
    },
    { id: "progress", label: "Comprometido vs. avance físico", value: "62% / 58%", score: 71 },
    {
      id: "sales",
      label: "Velocidad de ventas",
      value: "3,1 u/mes",
      score: 84,
      hint: "concentración baja",
    },
    {
      id: "collections",
      label: "Cobranza en término",
      value: "91%",
      score: 88,
      hint: "mora real 4%, mora por proceso 5%",
    },
    { id: "suppliers", label: "Pago a proveedores", value: "7 días prom.", score: 80 },
  ],
  totalScore: 81,
  advance: {
    scheduledNext90Days: 148_000_000, // ARS
    maxAdvancePct: 0.4,
    maxAdvance: 59_200_000,
    repayment: "Se descuenta automáticamente de los ingresos por CVU",
  },
  successMetrics: [
    "Take-up",
    "Pérdida esperada vs. observada",
    "Días de caja ganados",
    "Activación de Payments",
  ],
  notToBuild: [
    "Scoring externo",
    "Originación fuera de la plataforma",
    "Financiar obra antes de 12 meses de datos",
  ],
};

/**
 * Pruebas de Iván. Los slugs están verificados contra el repo. FIJI no tiene
 * página en el sitio: enlaza a la app. Banana apunta a /about, donde se cuenta.
 */
export const proofs = [
  {
    id: "banana",
    title: "Banana Software",
    number: "60% → 90%",
    line: "Predictibilidad de sprints tras sacar del roadmap una de cada cinco funcionalidades.",
    proves: "Sé priorizar y decir que no.",
    href: "/about",
    hrefLabel: "Leer",
    // TODO(Iván): en /about figura "una de cada cinco", no el salto 60% → 90%.
    // Si no querés publicar esa cifra, dejá `number` en "1 de 5".
    source: "/about",
  },
  {
    id: "fiji",
    title: "FIJI · Prizmstack",
    number: "Datos → precio",
    line: "Motor que traduce métricas de operación inmobiliaria en valuación financiera.",
    proves:
      "Ya convierto datos operativos en un número financiero. Mismo vertical, del lado del inversor.",
    href: "https://app.fijiapp.com/",
    hrefLabel: "Abrir FIJI",
    source: "https://app.fijiapp.com/",
  },
  {
    id: "bot",
    title: "Bot Asesor de Seguros",
    number: "64%",
    line: "De las consultas repetidas resueltas sin tocar el modelo, con umbral elegido por curva ROC.",
    proves: "Sé llevar un agente a producción y medirlo.",
    /** Referencia inline, no un segundo CTA: la política de mora del caso. */
    note: {
      before: "La política de mora del caso ya la escribí en ",
      label: "La prima que no llega",
      href: "/projects/cobranza-seguros",
    },
    href: "/projects/insurance-advisor-bot",
    hrefLabel: "Ver el caso",
    source: "/projects/insurance-advisor-bot",
  },
];

/** Lista única de fuentes externas, para el pie de la página. */
export function allSources(): string[] {
  const urls = new Set<string>();
  const add = (s: string) => {
    if (s.startsWith("http")) urls.add(s);
  };
  Object.values(company).forEach((v) => typeof v === "object" && add(v.source));
  timeline.forEach((m) => add(m.source));
  Object.values(funding).forEach((v) => add(v.source));
  Object.values(team).forEach((v) => add(v.source));
  add(productMapSource);
  add(aiLayer.source);
  Object.values(strategy).forEach((v) => add(v.source));
  Object.values(painStats).forEach((v) => add(v.source));
  return [...urls];
}
