import type { Pitch } from "./types";

/**
 * Esqueleto para una empresa nueva. Copiar a `<slug>.ts`, completar cada
 * TODO y registrar en `index.ts`. No está en el registro: es sólo la guía.
 *
 * Las reglas del brief de /lebane aplican a todas: ningún número sin fuente,
 * lo inventado para la maqueta marcado como ejemplo, identidad visual propia
 * (sin logo ni colores exactos de la empresa), copy parafraseado, sin nombrar
 * empleados. La página sale `noindex`, fuera del sitemap y de la navegación.
 */
export const plantilla: Pitch = {
  slug: "TODO-slug",
  company: "TODO Empresa",
  meta: {
    title: "TODO Empresa, de pies a cabeza",
    description: "Una lectura del producto, una tesis sobre el negocio y un caso para empezar.",
  },
  // Conjuntos disponibles en app/pitch/_template: "obra" (skyline con grúa y
  // figuras de construcción) y "datos" (hub de datos clínicos: hospitales, nodo
  // y tabla). Para otro rubro, agregar un conjunto nuevo.
  illustration: "obra",
  landmarks: "obra",
  author: {
    name: "Iván Dujaut",
    linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
    emailUserReversed: "navituajud",
    emailDomainReversed: "moc.liamg",
  },
  hero: {
    title: "Leí a TODO Empresa de pies a cabeza.",
    titleAccent: "Esto es lo que vi.",
    readingCue: "Tres minutos de lectura",
  },
  timeline: {
    eyebrow: "Trayectoria",
    heading: "TODO: N años, N saltos",
    milestones: [
      { date: "TODO", label: "TODO", source: "https://TODO" },
      { date: "TODO", label: "TODO", metric: "10", count: { value: 10 }, source: "https://TODO" },
    ],
  },
  productMap: {
    eyebrow: "El producto",
    heading: "El producto, en el orden en que lo usa un cliente",
    source: "https://TODO",
    modules: [{ id: "todo", label: "TODO módulo", oneLiner: "TODO qué hace." }],
    closingNote: "TODO: qué pasa cuando el último módulo cierra el círculo.",
  },
  thesis: {
    eyebrow: "La tesis",
    sentences: [
      { key: "a", text: "TODO frase uno.", keyword: "uno", floor: "TODO qué significa." },
      { key: "b", text: "TODO frase dos.", keyword: "dos", floor: "TODO qué significa." },
      { key: "c", text: "TODO frase tres.", keyword: "tres", floor: "TODO qué significa." },
    ],
    comparables: "TODO: quiénes hicieron lo mismo en sus rubros.",
  },
  why: {
    eyebrow: "Por qué TODO Empresa puede",
    heading: "TODO: qué necesita el incumbente y qué tiene la empresa.",
    steps: ["TODO paso uno.", "TODO paso dos.", "TODO paso tres."],
    left: { title: "Lo que ve el incumbente", items: ["TODO"], source: "https://TODO" },
    right: { title: "Lo que ve TODO Empresa", items: ["TODO"], source: "https://TODO" },
    rightTag: "en tiempo real",
  },
  case: {
    eyebrow: "Un caso para empezar",
    heading: "TODO nombre del caso",
    steps: [
      { id: "hipotesis", eyebrow: "Hipótesis", text: "TODO." },
      { id: "paso-1", eyebrow: "Paso 1 · TODO", text: "TODO." },
      { id: "paso-2", eyebrow: "Paso 2 · TODO", text: "TODO." },
    ],
    card: {
      illustrative: true,
      kicker: "TODO Score",
      projectName: "TODO Ejemplo",
      badge: "datos de ejemplo",
      totalScore: 80,
      totalLabel: "sobre 100",
      totalNote: "TODO qué mide.",
      indicators: [{ id: "a", label: "TODO indicador", value: "TODO", score: 80 }],
      cta: { open: "TODO acción", close: "Cerrar" },
      advance: {
        scheduledLabel: "TODO base",
        scheduledAmount: 100_000_000,
        availableLabel: "Disponible hoy",
        maxAdvancePct: 0.4,
        maxAdvance: 40_000_000,
        eligibility: "TODO quién califica.",
        repayment: "TODO cómo se repaga.",
      },
    },
    measure: { title: "Cómo se mide", items: ["TODO"] },
    notToBuild: { title: "Qué no construir", items: ["TODO"] },
  },
  proofs: {
    eyebrow: "Por qué yo",
    heading: "Tres cosas que ya hice y que este caso necesita",
    items: [
      {
        id: "todo",
        title: "TODO",
        number: "TODO",
        line: "TODO.",
        proves: "TODO.",
        href: "/about",
        hrefLabel: "Leer",
        source: "/about",
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
      "Las cifras del caso son datos de ejemplo. Página sin marca ni material de TODO Empresa.",
  },
};
