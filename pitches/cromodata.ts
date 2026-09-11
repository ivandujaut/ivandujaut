import type { Pitch } from "./types";

/**
 * Pitch para Cromodata (hub de datos clínicos de América Latina), septiembre
 * de 2026. Ningún número aparece en la UI si no está acá con su `source`. Las
 * cifras de la maqueta del caso son inventadas y se muestran como "datos de
 * ejemplo". Sin logo, sin colores exactos, sin nombrar empleados.
 */

const IPRO =
  "https://www.iprofesional.com/management/440773-healthtech-argentina-se-asegura-ronda-de-12-millones-de-dolares";
const EMPRE = "https://blog.emprelatam.com/2025/11/05/cromodata-ia-salud-latinoamerica/";
const ECOCUYO =
  "https://ecocuyo.com/nota/149402/una-startup-argentina-creo-el-primer-marketplace-de-datos-de-salud/";
const NEWSROOM =
  "https://www.cromodata.com/newsroom/argentine-digital-health-startup-launches-platform-to-unify-medical-data-and-improve-diagnostics.";
const SITE = "https://www.cromodata.com/";
const PARTNERS = "https://www.cromodata.com/data-partners";
const BUYERS = "https://www.cromodata.com/data-buyers";
const ABOUT = "https://www.cromodata.com/about-us";

export const cromodata: Pitch = {
  slug: "cromodata",
  company: "Cromodata",
  meta: {
    title: "Cromodata, de pies a cabeza",
    description: "Una lectura del producto, una tesis sobre el negocio y un caso para empezar.",
  },
  illustration: "datos",
  landmarks: "datos",
  author: {
    name: "Iván Dujaut",
    linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
    emailUserReversed: "navituajud",
    emailDomainReversed: "moc.liamg",
  },
  hero: {
    title: "Leí a Cromodata de pies a cabeza.",
    titleAccent: "Esto es lo que vi.",
    readingCue: "Tres minutos de lectura",
  },
  timeline: {
    eyebrow: "Trayectoria",
    heading: "Un año, cuatro saltos",
    milestones: [
      { date: "Ene 2025", label: "Se funda en Argentina", source: IPRO },
      {
        date: "Nueve meses después",
        label: "47 hospitales integrados · 19 millones de imágenes médicas",
        metric: "47",
        count: { value: 47 },
        source: NEWSROOM,
      },
      {
        date: "Oct 2025",
        label:
          "Ronda pre-seed USD 1,2M · 47 hospitales en cinco países · más de 20 millones de registros",
        // Sin `count`: el contador redondea a enteros y "USD 1,2M" no se puede
        // reconstruir. Se muestra fija.
        metric: "USD 1,2M",
        source: IPRO,
      },
      {
        date: "Nov 2025",
        label: "Gana el programa WE 2025 de Endeavor Argentina",
        source: ECOCUYO,
      },
      {
        date: "Dic 2025",
        label:
          "Presenta la plataforma: el primer marketplace de datos de salud desidentificados de la región",
        source: NEWSROOM,
      },
    ],
  },
  productMap: {
    eyebrow: "El producto",
    heading: "El producto, en el orden en que lo usa un hospital",
    source: PARTNERS,
    modules: [
      {
        id: "capa",
        label: "Capa sobre los sistemas del hospital",
        oneLiner:
          "Corre adentro de lo que ya existe, sin infraestructura nueva ni costo de implementación.",
      },
      {
        id: "anonimizacion",
        label: "Anonimización en origen",
        oneLiner: "El dato sale del hospital ya sin nombre; el consentimiento se verifica antes.",
      },
      {
        id: "estandar",
        label: "Estandarización",
        oneLiner:
          "Registros e imágenes pasan a formatos interoperables, alineados a estándares internacionales.",
      },
      {
        id: "cohortes",
        label: "Cohortes para compradores",
        oneLiner:
          "Laboratorios y empresas de IA piden datasets por pregunta: selección de sitios, regulatorio, modelos.",
      },
      {
        id: "entrega",
        label: "Entrega",
        oneLiner: "Datasets estructurados en unas dos semanas.",
      },
      {
        id: "ingreso",
        label: "Ingreso al hospital",
        oneLiner: "Cada uso autorizado del dato se convierte en ingresos para la institución.",
      },
    ],
    layer: {
      name: "Cumplimiento",
      oneLiner: "HIPAA, GDPR e ISO 27001 sobre todos los módulos",
      source: IPRO,
    },
    closingNote:
      "El ingreso cierra el círculo. Cada uso autorizado vuelve al hospital que puso el dato, y el hospital tiene un motivo para cargar mejor.",
  },
  thesis: {
    eyebrow: "La tesis",
    sentences: [
      {
        key: "fuente",
        text: "El hospital es la fuente.",
        keyword: "fuente",
        floor: "47 instituciones conectadas sin infraestructura nueva.",
      },
      {
        key: "estandar",
        text: "El estándar es el producto.",
        keyword: "producto",
        floor: "Lo que se vende no es el dato crudo: es el dato comparable.",
      },
      {
        key: "representatividad",
        text: "La representatividad es el negocio.",
        keyword: "negocio",
        floor: "La región que falta en los datasets globales es la que Cromodata tiene.",
      },
    ],
    comparables:
      "Flatiron Health, Truveta y Datavant hicieron lo mismo en Estados Unidos: la clínica como fuente, el estándar como producto.",
    source: ABOUT,
  },
  why: {
    eyebrow: "Por qué Cromodata puede",
    heading:
      "El comprador global necesita a América Latina en sus datos. Cromodata ya tiene 47 hospitales del lado de adentro.",
    steps: [
      "Un laboratorio o una empresa de IA entrena y valida con datos de Estados Unidos y Europa. La región queda afuera del modelo.",
      "Conseguirlos acá significa negociar hospital por hospital, con consentimientos, formatos y leyes distintas en cada país.",
      "Cromodata ya firmó con 47 hospitales en cinco países, anonimiza en origen y entrega en dos semanas.",
    ],
    left: {
      title: "Lo que ve el comprador",
      items: [
        "Datasets sin la región",
        "Un contrato por hospital",
        "Formatos distintos",
        "Consentimiento incierto",
      ],
      source: ABOUT,
    },
    right: {
      title: "Lo que ve Cromodata",
      items: [
        "47 hospitales",
        "5 países",
        "20M+ registros",
        "19M imágenes",
        "Consentimiento verificado",
        "Entrega en ~2 semanas",
      ],
      source: IPRO,
    },
    rightTag: "en la red",
  },
  case: {
    eyebrow: "Un caso para empezar",
    heading: "Score de Datos y cohorte de prueba",
    steps: [
      {
        id: "hipotesis",
        eyebrow: "Hipótesis",
        text: "El cuello de botella de un marketplace de datos no es la demanda: es el tiempo entre la firma de un hospital y su primer dataset vendible, y la espera del comprador para saber si la cohorte que necesita existe. Cromodata ve las dos puntas.",
      },
      {
        id: "paso-1",
        eyebrow: "Paso 1 · Score de Datos",
        text: "Mostrarle a cada hospital, adentro de la plataforma y antes de vender nada, cuán listo está su dato: cinco indicadores calculados sobre una extracción de muestra. El hospital ve qué le falta para cobrar más, y Cromodata sabe dónde poner el esfuerzo de integración.",
      },
      {
        id: "paso-2",
        eyebrow: "Paso 2 · Cohorte de prueba",
        text: "Que el comprador vea en minutos cuántos registros elegibles hay para su pregunta, sin recibir un solo dato, antes de pedir el dataset. Va primero porque usa lo que ya está estandarizado, no expone a ningún paciente, y convierte la espera de dos semanas en una decisión de compra.",
      },
    ],
    card: {
      illustrative: true,
      kicker: "Score de Datos",
      projectName: "Hospital Ejemplo · 120.000 historias",
      badge: "datos de ejemplo",
      totalScore: 74,
      totalLabel: "sobre 100",
      totalNote:
        "Cinco indicadores que salen de una extracción de muestra. Ninguno requiere trabajo manual del hospital.",
      indicators: [
        {
          id: "completitud",
          label: "Completitud de campos mínimos",
          value: "88%",
          score: 88,
          hint: "diagnóstico, fecha, edad, sexo",
        },
        {
          id: "codificacion",
          label: "Codificación estándar",
          value: "61%",
          score: 61,
          hint: "diagnósticos en CIE-10, estudios en LOINC",
        },
        {
          id: "consentimiento",
          label: "Consentimiento verificable",
          value: "79%",
          score: 79,
        },
        {
          id: "latencia",
          label: "Latencia de actualización",
          value: "9 días",
          score: 70,
          hint: "desde el alta hasta el registro",
        },
        {
          id: "modalidades",
          label: "Cobertura de modalidades",
          value: "3 de 5",
          score: 60,
          hint: "imágenes, laboratorio, historia; falta patología y genómica",
        },
      ],
      cta: { open: "Ver cohorte de prueba", close: "Cerrar" },
      advance: {
        format: "count",
        scheduledLabel: "Historias del período, últimos 24 meses",
        scheduledAmount: 120_000,
        availableLabel: "Elegibles para un dataset hoy",
        maxAdvancePct: 0.58,
        maxAdvance: 69_600,
        eligibility:
          "Sólo registros con consentimiento verificable y los campos mínimos completos.",
        repayment:
          "El comprador ve el conteo, no el dato; el hospital cobra recién con el uso autorizado.",
      },
    },
    measure: {
      title: "Cómo se mide",
      items: [
        "Días de firma a primer dataset",
        "Registros elegibles por hospital",
        "Conteos consultados por comprador",
        "Pedidos que llegan a compra",
      ],
    },
    notToBuild: {
      title: "Qué no construir",
      items: [
        "Un visor clínico para el hospital",
        "Modelos de IA propios sobre los datos",
        "Integraciones a medida antes del score",
      ],
    },
  },
  proofs: {
    eyebrow: "Por qué yo",
    heading: "Tres cosas que ya hice y que este caso necesita",
    items: [
      {
        id: "glp1",
        title: "GLP-1: quién receta",
        number: "1.137.205",
        line: "Pares médico-marca cruzados entre dos bases públicas de salud de Estados Unidos y verificados contra el archivo original, cero diferencias.",
        proves: "Sé trabajar datos de salud a escala y verificar antes de afirmar.",
        href: "/projects/glp1-quien-receta",
        hrefLabel: "Ver el caso",
        source: "/projects/glp1-quien-receta",
      },
      {
        id: "tesis",
        title: "Tesis de bioingeniería · ITBA",
        number: "Radiómica + ML",
        line: "Predije la mortalidad a dos años en pacientes con metástasis hepática de cáncer colorrectal, con imágenes y aprendizaje automático sobre datos de un hospital.",
        proves:
          "Conozco el dato clínico desde adentro: la imagen, la historia y lo que falta en cada una.",
        href: "https://ri.itba.edu.ar/handle/20.500.14769/4269",
        hrefLabel: "Leer la tesis",
        source: "https://ri.itba.edu.ar/handle/20.500.14769/4269",
      },
      {
        id: "banana",
        title: "Banana Software",
        number: "1 de 5",
        line: "Funcionalidades que saqué del roadmap para que los sprints volvieran a ser predecibles.",
        proves:
          "Sé priorizar y decir que no, que es lo que un score de datos le pide a un hospital.",
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
      "Las cifras del caso (score de datos y cohorte de prueba) son datos de ejemplo. Página sin marca ni material de Cromodata.",
  },
  facts: {
    founded: { value: "Enero de 2025", source: IPRO },
    preSeed: { value: "USD 1,2M", source: IPRO, note: "Anunciada el 30/10/2025" },
    leads: { value: ["PharmStars Ventures", "Sancus Capital"], source: EMPRE },
    hospitals: { value: 47, source: IPRO },
    countries: { value: 5, source: IPRO },
    records: { value: "Más de 20 millones de registros anonimizados", source: EMPRE },
    images: { value: "19 millones de imágenes médicas en nueve meses", source: NEWSROOM },
    standards: { value: ["HIPAA", "GDPR", "ISO 27001"], source: IPRO },
    useOfFunds: {
      value:
        "Ampliar la red de hospitales y laboratorios, sumar datos genómicos y de enfermedades raras, infraestructura tecnológica y regulatoria",
      source: IPRO,
    },
    delivery: { value: "Datasets estructurados en unas dos semanas", source: BUYERS },
    partnerModel: {
      value:
        "Capa digital sobre los sistemas del hospital, sin infraestructura ni costo de implementación; ingreso por cada uso autorizado",
      source: PARTNERS,
    },
    buyerUseCases: {
      value: [
        "Selección de sitios para ensayos",
        "Presentaciones regulatorias",
        "Acceso a mercado",
        "Segmentación comercial",
        "Modelos predictivos y de IA",
        "I+D",
      ],
      source: BUYERS,
    },
    valueProposition: {
      value: "Clinical data you can trust. Insights you can act on.",
      source: SITE,
    },
    mission: {
      value:
        "Ampliar el acceso a datos de salud de América Latina para mejores diagnósticos, tratamientos y descubrimientos",
      source: ABOUT,
    },
    endeavor: { value: "Ganadora del programa WE 2025 de Endeavor Argentina", source: ECOCUYO },
    comparables: {
      value: ["Flatiron Health", "Truveta", "Datavant"],
      source: "https://www.truveta.com/",
      note: "Datos clínicos de redes de hospitales y clínicas en Estados Unidos, estandarizados para investigación.",
    },
  },
};
