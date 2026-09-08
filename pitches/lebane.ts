import type { Pitch } from "./types";

/**
 * Pitch para Lebane (entrevista Product Owner, septiembre 2026).
 * Ningún número aparece en la UI si no está acá con su `source`. Las cifras
 * de la maqueta del caso son inventadas y se muestran como "datos de ejemplo".
 */

const ID360 = "https://www.innovaciondigital360.com/i-a/lebane-ia-pagos-creditos-construccion/";
const DFSUD =
  "https://dfsud.com/america/argentina-lebane-cierra-ronda-de-inversion-de-us-4-millones-y-consolida";
const PRODUCTO = "https://www.lebane.app/ar/producto";

export const lebane: Pitch = {
  slug: "lebane",
  company: "Lebane",
  meta: {
    title: "Lebane, de pies a cabeza",
    description: "Una lectura del producto, una tesis sobre el negocio y un caso para empezar.",
  },
  illustration: "obra",
  landmarks: "obra",
  author: {
    name: "Iván Dujaut",
    linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
    emailUserReversed: "navituajud",
    emailDomainReversed: "moc.liamg",
  },
  hero: {
    title: "Leí a Lebane de pies a cabeza.",
    titleAccent: "Esto es lo que vi.",
    readingCue: "Tres minutos de lectura",
  },
  timeline: {
    eyebrow: "Trayectoria",
    heading: "Tres años, cuatro saltos",
    milestones: [
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
        source: ID360,
      },
    ],
  },
  productMap: {
    eyebrow: "El producto",
    heading: "El producto, en el orden en que lo usa un cliente",
    source: PRODUCTO,
    modules: [
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
    ],
    layer: {
      name: "Lena",
      formerName: "Lebyx",
      oneLiner: "agentes por WhatsApp sobre todos los módulos",
      source: ID360,
    },
    closingNote:
      "Payments cierra el círculo. El cobro entra identificado y vuelve a la obra ya conciliado.",
  },
  thesis: {
    eyebrow: "La tesis",
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
    source: ID360,
  },
  why: {
    eyebrow: "Por qué Lebane puede",
    heading: "El banco necesita la historia de la empresa. Lebane tiene la obra en tiempo real.",
    steps: [
      "Cada proyecto es un fideicomiso o una razón social nueva.",
      "La banca no tiene con qué evaluar el riesgo: llegan papeles sueltos.",
      "Lebane ya tiene el libro mayor del proyecto, y ahora el dinero real.",
    ],
    left: {
      title: "Lo que ve el banco",
      items: ["Planillas sueltas", "Un fideicomiso por obra", "Sin historial", "Balances viejos"],
      source:
        "https://mercado.com.ar/negocios/lebane-invirtio-us-4-millones-y-sumo-pagos-integrados-para-constructoras",
    },
    right: {
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
      source: PRODUCTO,
    },
    rightTag: "en tiempo real",
  },
  case: {
    eyebrow: "Un caso para empezar",
    heading: "Score de Obra y adelanto de cobranzas",
    steps: [
      {
        id: "hipotesis",
        eyebrow: "Hipótesis",
        text: "El problema de caja de una desarrolladora mediana suele ser de fechas, no de ventas: las cuotas entran después de que vencen los pagos. Lebane ve las dos puntas.",
      },
      {
        id: "paso-1",
        eyebrow: "Paso 1 · Score de Obra",
        text: "Mostrarle a cada desarrolladora el score de su proyecto, adentro de Lebane, antes de ofrecerle crédito. Usa cinco indicadores que ya están cargados. Así la demanda aparece antes que la oferta y la carga de datos mejora.",
      },
      {
        id: "paso-2",
        eyebrow: "Paso 2 · Adelanto de cobranzas",
        text: "Hasta un porcentaje de las cuotas de los próximos 90 días de compradores con historial en término, que se repaga solo desde los ingresos por CVU. Va primero porque el repago sale del mismo flujo, los datos ya existen, el ticket es chico y el ciclo, corto.",
      },
    ],
    card: {
      illustrative: true,
      kicker: "Score de Obra",
      projectName: "Torre Ejemplo · 48 unidades",
      badge: "datos de ejemplo",
      totalScore: 81,
      totalLabel: "sobre 100",
      totalNote: "Cinco indicadores que la desarrolladora ya carga. Ninguno viene de afuera.",
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
      cta: { open: "Adelantar cobranzas", close: "Cerrar" },
      advance: {
        scheduledLabel: "Cuotas programadas, próximos 90 días",
        scheduledAmount: 148_000_000,
        availableLabel: "Disponible hoy",
        maxAdvancePct: 0.4,
        maxAdvance: 59_200_000,
        eligibility: "Sólo cuotas de compradores con historial en término.",
        repayment: "Se descuenta automáticamente de los ingresos por CVU.",
      },
    },
    measure: {
      title: "Cómo se mide",
      items: [
        "Take-up",
        "Pérdida esperada vs. observada",
        "Días de caja ganados",
        "Activación de Payments",
      ],
    },
    notToBuild: {
      title: "Qué no construir",
      items: [
        "Scoring externo",
        "Originación fuera de la plataforma",
        "Financiar obra antes de 12 meses de datos",
      ],
    },
  },
  proofs: {
    eyebrow: "Por qué yo",
    heading: "Tres cosas que ya hice y que este caso necesita",
    items: [
      {
        id: "banana",
        title: "Banana Software",
        // TODO(Iván): en /about figura "una de cada cinco", no el salto 60% → 90%.
        // Si no querés publicar esa cifra, dejá `number` en "1 de 5".
        number: "60% → 90%",
        line: "Predictibilidad de sprints tras sacar del roadmap una de cada cinco funcionalidades.",
        proves: "Sé priorizar y decir que no.",
        href: "/about",
        hrefLabel: "Leer",
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
        note: {
          before: "La política de mora del caso ya la escribí en ",
          linkText: "La prima que no llega",
          href: "/projects/cobranza-seguros",
          after: ".",
        },
        href: "/projects/insurance-advisor-bot",
        hrefLabel: "Ver el caso",
        source: "/projects/insurance-advisor-bot",
      },
    ],
  },
  close: {
    heading: "Me gustaría construir esto adentro.",
    body: "Si el caso tiene sentido, lo discutimos con el equipo. Si no lo tiene, también quiero saber por qué.",
    emailLabel: "Escribime",
    siteLabel: "Ver mi trabajo publicado",
    siteHref: "/",
    sourcesLine: "Cada dato de esta página tiene su fuente en el código.",
    sourcesToggle: "Ver las {n} fuentes públicas",
    footnote:
      "Las cifras del caso (score de obra y adelanto) son datos de ejemplo. Página sin marca ni material de Lebane.",
  },
  facts: {
    founded: { value: 2023, source: "https://www.startupjournal.io/article/lebane-levanta-4M" },
    hq: {
      value: "Buenos Aires (Saavedra, CABA)",
      source: "https://construi-en-lebane.lovable.app/",
    },
    markets: { value: ["Argentina", "México"], source: "https://www.lebane.app/ar" },
    usersInCountries: {
      value: 6,
      source: ID360,
      note: "Incluye Uruguay, Paraguay, Estados Unidos y España",
    },
    seedRound: { value: "USD 4M", source: DFSUD },
    leads: { value: ["Atlántico", "Zacua Ventures"], source: DFSUD },
    participants: {
      value: ["Fen Ventures", "ADN.vc", "Kuiper VC", "Galicia Ventures"],
      source: DFSUD,
    },
    plannedExpansion: { value: "USD 5M adicionales", source: ID360 },
    employeesAug2026: { value: 75, source: ID360 },
    targetEndOf2026: { value: 150, source: ID360 },
    founders: {
      value: ["Bruno Lerer", "Lucas Glustman", "Diego Sarro", "Matías Podrojsky", "Diego Cabrosi"],
      source: "https://www.startupjournal.io/article/lebane-levanta-4M",
    },
    threeStages: {
      value: [
        "Centralizar la información operativa de cada obra",
        "Incorporar el movimiento real del dinero en el sistema",
        "Usar esos datos para perfiles crediticios y financiamiento",
      ],
      source: ID360,
    },
    pspLicense: { value: "Licencia PSP junto con Banco Industrial", source: ID360 },
    borrowers: {
      value: ["desarrolladores", "constructores", "compradores"],
      source: "https://www.cbinsights.com/company/lebane",
    },
    fundWithMarket: {
      value: "Próximo paso: fondo de financiamiento de obras con actores del mercado",
      source: ID360,
    },
    budgetDeviation: { value: "35% a 50%", source: ID360 },
    operationalInefficiency: { value: "10% a 15%", source: ID360 },
    churn: {
      value: "< 1%",
      source: "https://adn.vc/%F0%9F%A7%AC-adn-vc-newsletter-014/",
      note: "Según ADN.vc, inversor.",
    },
  },
};
