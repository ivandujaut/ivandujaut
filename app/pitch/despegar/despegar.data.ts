/**
 * Pieza para Despegar (proceso de noviembre 2026, Associate Product Owner II,
 * Product Growth). Todo el texto y todos los números de la página viven acá;
 * cada cifra real tiene su fuente en `sources` y en el BRIEF
 * (`data/despegar/BRIEF.md`, fuera del repo).
 *
 * Tres tipos de número, y la página los muestra distinto:
 * - `dato`: sale de una fuente pública (`source`).
 * - `inferencia`: cuenta propia sobre datos públicos; lleva la cuenta en `how`.
 * - `ilustrativo`: inventado para la maqueta (tablero, mock del checkout); la
 *   página lo rotula "datos de ejemplo" y nunca lo mezcla con los otros dos.
 *
 * La gramática visual de toda la página: el mismo vuelo leído dos veces. Lo
 * que ves (el precio del listado) y lo que pagás (el del último paso). La
 * tesis vive en la distancia entre las dos.
 */

export type SourceId =
  | "f20"
  | "q4_24"
  | "q1_24"
  | "q3_24"
  | "q4_23"
  | "prosusFy26"
  | "prosusHy26"
  | "iprofCeo"
  | "despegarHome"
  | "beneficios"
  | "cronistaClub"
  | "iproupPagos"
  | "economistaCuotas"
  | "playStore"
  | "sofiaVenta"
  | "bookingQ3"
  | "expediaQ3"
  | "airbnbQ3"
  | "brasilturis"
  | "indecEti"
  | "indecSerie"
  | "bcraCuotas"
  | "reviewsMethod"
  | "appStoreReviews";

export const sources: Record<SourceId, string> = {
  f20: "https://www.sec.gov/Archives/edgar/data/1703141/000162828025020808/desp-20241231.htm",
  q4_24: "https://www.sec.gov/Archives/edgar/data/1703141/000110465925040374/tm2513219d1_6k.htm",
  q1_24: "https://www.sec.gov/Archives/edgar/data/1703141/000110465924062523/tm2414724d1_6k.htm",
  q3_24: "https://www.sec.gov/Archives/edgar/data/1703141/000110465924118887/tm2428398d1_6k.htm",
  q4_23: "https://www.sec.gov/Archives/edgar/data/1703141/000110465924034492/tm248866d1_6k.htm",
  prosusFy26:
    "https://www.prosus.com/~/media/Files/P/prosus-corp-v2/results-reports-and-events-archive/annual-report/2026/prosus-financial-results-fy26-booklet.pdf",
  prosusHy26:
    "https://www.naspers.com/~/media/Files/N/Naspers-Corp-V2/results-reports-and-events-archive/latest-results/hy-2026/hy2026-results-presentation.pdf",
  iprofCeo:
    "https://www.iprofesional.com/negocios/439283-despegar-nombro-un-nuevo-ceo-para-el-comienzo-de-una-etapa-de-crecimiento-acelerado",
  despegarHome: "https://www.despegar.com.ar/",
  beneficios: "https://www.despegar.com.ar/beneficios",
  cronistaClub:
    "https://www.cronista.com/negocios/una-agencia-de-viajes-lanza-su-propio-programa-de-millas-que-rinde-como-una-caja-de-ahorro-en-dolares",
  iproupPagos:
    "https://www.iproup.com/coffee-break/70637-despegar-revela-como-pagan-ahora-sus-viajes-los-argentinos",
  economistaCuotas:
    "https://eleconomista.com.ar/actualidad/despegar-lanza-cuotas-dolares-viajar-2026-como-esquiva-prohibicion-bcra-n89976",
  playStore: "https://play.google.com/store/apps/details?id=com.gm.despegar&hl=es-419&gl=ar",
  sofiaVenta:
    "https://mercadoeconsumo.com.br/01/09/2026/tecnologia/com-assistente-sofia-decolar-faz-primeira-venda-100-por-ia-com-pagamento-via-pix/",
  bookingQ3:
    "https://s25.q4cdn.com/383369491/files/content_files/Q3_26-Prepared-Remarks-for-Website.pdf",
  expediaQ3:
    "https://s202.q4cdn.com/757635260/files/content_files/EXPE-USQ_Transcript_2026-11-04.pdf",
  airbnbQ3:
    "https://www.morningstar.com/news/pr-newswire/20261105sf78241/airbnb-announces-third-quarter-2026-results",
  brasilturis:
    "https://brasilturis.com.br/2026/11/10/venda-direta-deve-superar-otas-na-america-latina-em-2027/",
  indecEti: "https://www.indec.gob.ar/uploads/informesdeprensa/eti_10_26EACC4AA4BC.pdf",
  indecSerie: "https://www.indec.gob.ar/ftp/cuadros/economia/series_eti_via_aerea.xlsx",
  bcraCuotas: "https://www.bcra.gob.ar/Pdfs/Texord/t-polcre.pdf",
  /** Reseñas públicas de App Store AR y Google Play; método en el pie de la sección. */
  reviewsMethod: "https://apps.apple.com/ar/app/despegar-vuelos-y-hoteles/id511479725",
  /** Lista de reseñas de la app en App Store Argentina. Apple no da un link por reseña. */
  appStoreReviews:
    "https://apps.apple.com/ar/app/despegar-vuelos-y-hoteles/id511479725?see-all=reviews",
};

export const author = {
  name: "Iván Dujaut",
  linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
  emailUserReversed: "navituajud",
  emailDomainReversed: "moc.liamg",
};

export const meta = {
  title: "Despegar, el último paso",
  description:
    "Dónde se pierde hoy la venta en la app de Despegar, una tesis sobre la segunda compra y un experimento para empezar.",
};

export const nav = [
  { id: "inicio", label: "Inicio" },
  { id: "negocio", label: "Cómo gana plata" },
  { id: "app", label: "La app hoy" },
  { id: "balde", label: "El balde" },
  { id: "voz", label: "Lo que dicen" },
  { id: "competencia", label: "Contra quién" },
  { id: "tesis", label: "La tesis" },
  { id: "caso", label: "El caso" },
  { id: "tablero", label: "Cómo lo mediría" },
  { id: "primeros-pasos", label: "Primeros pasos" },
  { id: "cierre", label: "Cierre" },
] as const;

/** Las dos lecturas del mismo vuelo que recorren la página. Un color para cada una. */
export const readings = {
  seen: "Lo que ves",
  paid: "Lo que pagás",
};

// ---------------------------------------------------------------------------
// 01 · Hero
// ---------------------------------------------------------------------------

export const hero = {
  kicker: "Una lectura de la app de Despegar",
  title: "La app de Despegar ya trae a la gente.",
  titleAccent: "Quiero entender por qué no vuelve.",
  lede: "Soy Iván Dujaut. Quiero ayudar a que más gente compre su viaje en la app de Despegar y vuelva a comprar el siguiente. Armé esta página con datos públicos para llegar con una hipótesis y con las preguntas que todavía no puedo contestar desde afuera.",
  byline: "Noviembre de 2026",
  summary: [
    {
      label: "Qué entendí",
      text: "El tráfico sobra y la recompra está plana hace tres años, aunque Pasaporte casi se triplicó.",
      href: "#balde",
    },
    {
      label: "Dónde miraría primero",
      text: "En el último paso de la compra. Que el precio suba al pagar aparece en 22 de 170 reseñas negativas de la app de Despegar y en 2 de 191 de la app de Aerolíneas Argentinas.",
      href: "#voz",
    },
    {
      label: "Qué probaría",
      text: "Si los datos de adentro lo confirman, un experimento de cuatro semanas con el corte escrito antes de empezar.",
      href: "#caso",
    },
  ],
  /**
   * Mock del tablero de partidas: el mismo vuelo en el listado y en el último
   * paso. Ilustrativo, armado con el tipo de diferencia que cuentan las
   * reseñas, no con un precio real.
   */
  board: {
    illustrative: true as const,
    label: "Datos de ejemplo",
    route: "BUE → RIO",
    date: "Sáb 10 ene",
    seen: { step: "Resultados", price: "USD 412" },
    paid: { step: "Paso 4 de 4 · Pagar", price: "USD 486" },
    reason: "El precio cambió por alta demanda",
    timer: "Te quedan 6:12 para comprar",
  },
  cue: "En toda la página, el violeta es el precio que ves en el listado y el rojo, el que pagás en el último paso.",
};

// ---------------------------------------------------------------------------
// 02 · Cómo gana plata
// ---------------------------------------------------------------------------

export const business = {
  eyebrow: "Cómo gana plata",
  heading: "Una comisión por viaje, en una región que paga en cuotas y en dólares",
  body: "Despegar cobra una comisión o un margen sobre lo que vende (vuelos, hoteles, paquetes, autos, actividades, asistencia) y además financia. De cada dólar que pasa por la plataforma se queda con unos 14 centavos.",
  kpis: [
    {
      label: "Transacciones 2024",
      value: "9,72 M",
      kind: "dato" as const,
      source: "f20" as SourceId,
    },
    {
      label: "Gross bookings 2024",
      value: "USD 5.453 M",
      kind: "dato" as const,
      source: "f20" as SourceId,
    },
    {
      label: "Revenue 2024",
      value: "USD 774 M",
      kind: "dato" as const,
      source: "q4_24" as SourceId,
    },
    { label: "Take rate 2024", value: "14,2%", kind: "dato" as const, source: "q4_24" as SourceId },
  ],
  countries: {
    title: "Transacciones 2024 por país",
    rows: [
      { label: "Brasil", value: 49 },
      { label: "México", value: 16 },
      { label: "Argentina", value: 13 },
      { label: "Otros", value: 22 },
    ],
    unit: "%",
    source: "f20" as SourceId,
  },
  timeline: [
    {
      date: "Dic 2024",
      label: "Prosus acuerda la compra a USD 19,50 por acción",
      source: "prosusHy26" as SourceId,
    },
    {
      date: "May 2025",
      label: "Cierra la compra; Despegar sale de la bolsa",
      source: "prosusFy26" as SourceId,
    },
    {
      date: "Abr-sep 2025",
      label:
        'El margen aEBITDA cae de ~23% a 13%: "limited pricing power and a shift to lower margin categories"',
      source: "prosusHy26" as SourceId,
    },
    {
      date: "Abr 2026",
      label: "Gonzalo García Estebarena, nuevo CEO",
      source: "iprofCeo" as SourceId,
    },
    {
      date: "Jun 2026",
      label: "FY26: órdenes +44%, gross bookings +29%, SOFIA explica 3% de las ventas",
      source: "prosusFy26" as SourceId,
    },
  ],
  plan: {
    quote:
      "Ganar clientes con aéreo a precio competitivo y convertirlos a no-aéreo, de mayor margen.",
    attribution: "Plan declarado por Prosus para Despegar (resumen propio del FY26)",
    source: "prosusFy26" as SourceId,
  },
  market: {
    title: "Desde febrero de 2026 salen cada mes menos argentinos en avión",
    note: "Turistas residentes que salen del país por avión, tendencia-ciclo, miles por mes. Desde mayo de 2026 la variación interanual es negativa.",
    source: "indecSerie" as SourceId,
    /** INDEC, serie tendencia-ciclo (miles). */
    series: [
      { month: "2025-01", value: 381.3 },
      { month: "2025-04", value: 403.0 },
      { month: "2025-07", value: 407.0 },
      { month: "2025-10", value: 418.3 },
      { month: "2026-01", value: 431.5 },
      { month: "2026-02", value: 431.6 },
      { month: "2026-04", value: 423.2 },
      { month: "2026-06", value: 409.5 },
      { month: "2026-08", value: 396.8 },
      { month: "2026-09", value: 392.1 },
    ],
    callout: "−9% de febrero a septiembre de 2026",
  },
};

// ---------------------------------------------------------------------------
// 03 · La app hoy
// ---------------------------------------------------------------------------

export const app = {
  eyebrow: "La app hoy",
  heading: "La app pasó de un tercio a más de la mitad de las ventas en dos años",
  chart: {
    title: "Transacciones hechas en la app, % del total",
    unit: "%",
    note: 'Desde 2023 Despegar reporta "app transactions"; antes reportaba mobile (web + app) y no son comparables. Es la última serie pública: Despegar dejó de reportar al salir de la bolsa.',
    points: [
      { quarter: "1T23", value: 36.1, source: "q1_24" as SourceId },
      { quarter: "3T23", value: 40.1, source: "q3_24" as SourceId },
      { quarter: "4T23", value: 45.3, source: "q4_23" as SourceId },
      { quarter: "1T24", value: 48.9, source: "q1_24" as SourceId },
      { quarter: "3T24", value: 50.5, source: "q3_24" as SourceId },
      { quarter: "4T24", value: 53.6, source: "q4_24" as SourceId },
    ],
  },
  facts: [
    {
      label: "Visitas desde el celular (app + web), 2024",
      value: "80%",
      kind: "dato" as const,
      source: "f20" as SourceId,
    },
    {
      label: "Transacciones desde el celular (app + web), 2024",
      value: "61%",
      kind: "dato" as const,
      source: "f20" as SourceId,
    },
    {
      label: "Calificaciones en App Store Argentina",
      value: "230 mil",
      kind: "dato" as const,
      note: "Booking: 165 mil",
      source: "reviewsMethod" as SourceId,
    },
    {
      label: "Descargas en Google Play",
      value: "10 M+",
      kind: "dato" as const,
      source: "playStore" as SourceId,
    },
  ],
};

/**
 * El viaje de una compra: el mismo vuelo de la portada recorre el embudo. Cada
 * parada tiene su cuadro (una imagen fija del avión) y su dato. Los cuadros
 * cambian con el scroll sólo con CSS (`view-timeline` por parada y
 * `timeline-scope` en el contenedor); sin soporte o con movimiento reducido,
 * cada parada muestra su cuadro al lado del texto.
 *
 * Ilustraciones generadas con Gemini (`scripts/covers/prompts/despegar-vuelo-N.txt`),
 * recortadas a 16:9 sin la marca de agua. En el escenario animado se usan las
 * escenas vacías (`fondo-N`) y el avión recortado (`avion`), que el CSS mueve
 * de forma continua entre paradas. Los cuadros completos (`cuadro-N`) quedan
 * para el respaldo sin movimiento.
 */
export const journey = {
  eyebrow: "El viaje de una compra",
  heading: "Un mismo vuelo, de la búsqueda a la vuelta",
  intro:
    "Lo que se sabe desde afuera de cada etapa, en el orden en que la vive alguien que compra.",
  placeholder: false,
  /** El avión recortado: una sola imagen que el CSS mueve sobre los fondos. */
  plane: { src: "/despegar/vuelo/avion.webp", width: 837, height: 273 },
  stops: [
    {
      id: "busqueda",
      step: "Búsqueda",
      frame: {
        src: "/despegar/vuelo/cuadro-1.webp",
        alt: "El avión en la puerta de embarque, todavía en tierra",
      },
      background: "/despegar/vuelo/fondo-1.webp",
      title: "El 80% de las visitas ya llega desde el celular",
      text: "En 2024 el celular (app y web) trajo el 80% de las visitas y el 61% de las transacciones. Tráfico hay de sobra.",
      source: "f20" as SourceId,
    },
    {
      id: "resultados",
      step: "Resultados",
      frame: { src: "/despegar/vuelo/cuadro-2.webp", alt: "El avión despegando sobre la pista" },
      background: "/despegar/vuelo/fondo-2.webp",
      title: "La app ya hace más de la mitad de las ventas",
      text: "53,6% de las transacciones en el cuarto trimestre de 2024, contra 36,1% en el primero de 2023.",
      source: "q4_24" as SourceId,
    },
    {
      id: "ultimo-paso",
      step: "Último paso",
      frame: {
        src: "/despegar/vuelo/cuadro-3.webp",
        alt: "El avión en crucero, con nubes que se oscurecen adelante",
      },
      background: "/despegar/vuelo/fondo-3.webp",
      title: "En el último paso, el precio cambia",
      text: "Que el precio suba al pagar aparece en 22 de 170 reseñas negativas de Despegar y en 2 de 191 de la app de Aerolíneas Argentinas.",
      flip: { seen: "USD 412", paid: "USD 486", label: "Datos de ejemplo" },
      source: "reviewsMethod" as SourceId,
    },
    {
      id: "vuelta",
      step: "La vuelta",
      frame: {
        src: "/despegar/vuelo/cuadro-4.webp",
        alt: "El avión en aproximación hacia una pista lejana y a medio iluminar",
      },
      background: "/despegar/vuelo/fondo-4.webp",
      title: "Y la vuelta casi no se mueve",
      text: "51,4% de los clientes de 2024 ya había comprado antes (49,6% en 2022), mientras Pasaporte pasó de 12 a 32,5 millones de socios.",
      source: "f20" as SourceId,
    },
  ],
};

// ---------------------------------------------------------------------------
// 04 · El balde
// ---------------------------------------------------------------------------

export const bucket = {
  eyebrow: "El balde",
  heading: "Pasaporte casi se triplicó. La recompra se movió 1,8 puntos.",
  chart: {
    title: "Socios de Pasaporte y clientes que ya habían comprado",
    source: "f20" as SourceId,
    years: [
      { year: "2022", members: 12.1, repeatPct: 49.6, customers: 3.9 },
      { year: "2023", members: 23.0, repeatPct: 50.4, customers: 4.6 },
      { year: "2024", members: 32.5, repeatPct: 51.4, customers: 4.8 },
    ],
    membersLabel: "Socios de Pasaporte (M)",
    repeatLabel: "Clientes con compra previa (%)",
  },
  accounts: [
    {
      id: "entra-sale",
      title: "El balde pierde casi lo que entra",
      text: "En 2024 entraron unos 2,3 M clientes nuevos y la base creció 0,2 M.",
      how: "4,8 M clientes × (1 − 51,4% con compra previa) = 2,33 M nuevos; 4,8 M − 4,6 M = 0,2 M de crecimiento. Como mucho, 54% de los clientes de 2023 volvió en 2024.",
      kind: "inferencia" as const,
      source: "f20" as SourceId,
    },
    {
      id: "primera-paga",
      title: "La primera compra apenas paga la adquisición",
      text: "Traer un cliente nuevo cuesta del orden de lo que ese cliente deja en un año.",
      how: "Marketing y ventas USD 250,7 M ÷ 2,33 M nuevos ≈ USD 107 por cliente nuevo (techo: ese gasto también paga marca y retención). Revenue 2024 ÷ clientes ≈ USD 161 por cliente por año.",
      kind: "inferencia" as const,
      source: "f20" as SourceId,
    },
    {
      id: "incentivo",
      title: "Más incentivo no movió la vuelta",
      text: "Socios ×2,7 y canjes ×2,8 en dos años; la recompra, +1,8 puntos.",
      how: "Canje de puntos: 4,4% → 12,3% de las transacciones (2022-2024). Si lo que faltara fuera incentivo, ya se habría movido.",
      kind: "inferencia" as const,
      source: "f20" as SourceId,
    },
  ],
  takeaway:
    "Si la ganancia está en la segunda compra y más puntos no la mueven, hay que buscar qué hace que alguien no vuelva. Las reseñas apuntan al último paso de la compra.",
};

// ---------------------------------------------------------------------------
// 05 · Lo que dicen
// ---------------------------------------------------------------------------

export const voice = {
  eyebrow: "Lo que dicen",
  heading: "Qué dicen 800 reseñas de la app, clasificadas con IA",
  method: [
    "Bajé las reseñas públicas de App Store (500 de Argentina, todas, oct-2023 a nov-2026) y de Google Play (300 desde mayo 2025, al azar por estrellas).",
    "Armé un libro de códigos cerrado: 8 etapas del funnel y 21 tipos de problema, cada uno con definición y ejemplo.",
    "Las clasificó un modelo de lenguaje en lotes. Una segunda pasada a ciegas sobre 60 coincidió 93% en etapa y 97% en problema.",
    "Codifiqué 50 a mano para medir cuánto coincide el modelo con una persona: [PENDIENTE, completar con el resultado de Iván].",
  ],
  caveat:
    "Las reseñas no miden el funnel: escribe el que se enojó, y mucho es posventa. Sirven para saber dónde mirar, y para comparar contra pares con el mismo método.",
  stages: {
    title: "Reseñas de 1 y 2 estrellas, App Store Argentina (n=170), por etapa",
    unit: "%",
    rows: [
      { label: "Posventa (cambios, reembolsos, atención)", value: 35 },
      { label: "Checkout y pago", value: 25 },
      { label: "La app (lenta, se cuelga, bugs)", value: 24 },
      { label: "Recompra", value: 4 },
      { label: "Adquisición", value: 4 },
      { label: "Búsqueda y login", value: 3 },
    ],
  },
  promise: {
    value: "28%",
    text: "de las reseñas de 1 y 2 estrellas argentinas (48 de 170) cuentan una promesa que no se cumple al pagar: el precio que sube, el pago que falla, las cuotas que no aparecen o un cargo que no estaba avisado. En la app de Aerolíneas Argentinas, con el mismo método, son 20 de 191.",
  },
  /**
   * Comparación contra la venta directa de la aerolínea, mismo libro de códigos.
   * Despegar: 170 reseñas 1-2★ del App Store AR. Aerolíneas: 191 reseñas 1-2★
   * desde 2024 (37 del App Store AR y 154 de Google Play en español).
   */
  vsAirline: {
    title: "Motivo de la queja, % de las reseñas de 1 y 2 estrellas",
    groups: {
      a: "Despegar (170 reseñas)",
      b: "Aerolíneas Argentinas (191 reseñas)",
    },
    rows: [
      { label: "El precio sube durante la compra", a: 12.9, aCount: 22, b: 1.0, bCount: 2 },
      { label: "Cuotas o promos que no aplican", a: 6.5, aCount: 11, b: 0.5, bCount: 1 },
      { label: "Cargos que no estaban avisados", a: 3.5, aCount: 6, b: 1.6, bCount: 3 },
      { label: "El pago falla", a: 7.6, aCount: 13, b: 7.3, bCount: 14 },
    ],
    note: "Comprando directo, casi nadie se queja de que el precio suba al pagar; los pagos que fallan, en cambio, aparecen igual en las dos apps. En el precio que sube, los intervalos de confianza no se tocan (Despegar 8,7% a 18,8%; Aerolíneas 0,3% a 3,7%). Parte de las quejas de Despegar son de paquetes y hoteles: contando sólo las que nombran un vuelo quedan 8 de 170, una diferencia en la misma dirección pero menos clara.",
  },
  /** Las citas llevan a la lista de reseñas: Apple no publica un link por reseña. */
  quotesSource: "appStoreReviews" as SourceId,
  quotesLinkTitle: "Ver las reseñas de la app en App Store Argentina",
  quotes: [
    {
      text: "Nunca me pasó una cosa así comprando en las aerolíneas directamente.",
      meta: "App Store AR · 1★ · dic 2025",
    },
    {
      text: "Intenté procesar el pago 4 veces y cada vez me subieron más el valor del paquete.",
      meta: "App Store AR · 1★ · jul 2025",
    },
    {
      text: "Dice que hay 6 cuotas con macro y cuando vas a pagar no te da la opción.",
      meta: "App Store AR · 3★ · jun 2025",
    },
  ],
  source: "reviewsMethod" as SourceId,
};

// ---------------------------------------------------------------------------
// 06 · Contra quién
// ---------------------------------------------------------------------------

export const competition = {
  eyebrow: "Contra quién",
  heading: "Lo que los grandes cuentan de sus propias apps",
  lede: "Los globales publican en sus resultados cuánto les rinde cada pieza. Son la mejor vara pública para dimensionar una idea antes de tener los datos de adentro.",
  items: [
    {
      company: "Booking",
      number: "~60%",
      line: 'de las noches ya se reservan en la app ("high-50%").',
      source: "bookingQ3" as SourceId,
    },
    {
      company: "Booking",
      number: "3x",
      line: "más rápido crecen los viajes que suman más de un producto que el total.",
      source: "bookingQ3" as SourceId,
    },
    {
      company: "Expedia",
      number: "2x",
      line: "probabilidad de sumar una actividad en 7 días para quien usa su agente de IA después de comprar.",
      source: "expediaQ3" as SourceId,
    },
    {
      company: "Airbnb",
      number: "66%",
      line: "de las noches por la app, contra 62% un año antes.",
      source: "airbnbQ3" as SourceId,
    },
  ],
  threat: {
    title: "El rival que nombran las reseñas es la aerolínea",
    text: "Phocuswright proyecta que la venta directa supere a las agencias online en Latinoamérica en 2027. La ventaja de Despegar es armar el viaje y financiarlo: con las cuotas bancarias para el exterior prohibidas, Cuotas Despegar en dólares es algo que el banco no puede dar.",
    sources: ["brasilturis", "bcraCuotas", "economistaCuotas"] as SourceId[],
  },
};

// ---------------------------------------------------------------------------
// 07 · Tesis
// ---------------------------------------------------------------------------

export const thesis = {
  eyebrow: "La tesis",
  sentences: [
    {
      key: "puerta",
      text: "El vuelo barato es la puerta.",
      floor: "Prosus lo dice con otras palabras: ganar con aéreo, convertir a no-aéreo.",
    },
    {
      key: "confianza",
      text: "El precio que se cumple es la confianza.",
      floor: "En Argentina el precio tiene cinco perillas, y encima se mueve en el último paso.",
    },
    {
      key: "negocio",
      text: "La segunda compra es el negocio.",
      floor: "La primera apenas paga lo que costó traer al cliente.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 08 · El caso
// ---------------------------------------------------------------------------

export const caseStudy = {
  eyebrow: "El caso",
  heading: "El precio que ves es el que pagás",
  objective:
    "Que más gente que llega al checkout de la app termine comprando, sin comprar esa conversión con margen. Y que quien compra no tenga motivo para irse a la aerolínea la próxima vez.",
  problem:
    "Si mi lectura de las reseñas es correcta, en el último paso pasan tres cosas: la tarifa se mueve con la tarjeta ya cargada, un pago rechazado obliga a rearmar la compra a otro precio, y las cuotas del listado no existen para la tarjeta del usuario. Comprando directo en la aerolínea, lo primero casi no aparece en las quejas; por eso creo que tiene más que ver con cómo se muestra el precio en Despegar que con la tarifa en sí.",
  pieces: [
    {
      id: "antes",
      title: "Confirmar el precio al elegir el vuelo",
      text: "Revalidar la tarifa con la aerolínea al elegir el vuelo, antes de pedir los datos. Si cambió, avisarlo ahí, cuando el usuario todavía no invirtió diez minutos.",
    },
    {
      id: "contador",
      title: "Sostener el precio mientras corre el contador",
      text: 'Si la app dice "tenés 9 minutos", el precio se sostiene esos 9 minutos, también si el pago se rechaza y prueba otra tarjeta. Si la aerolínea sube la tarifa, Despegar absorbe la diferencia hasta un tope o la compensa en puntos.',
    },
    {
      id: "cuotas",
      title: "Mostrar sólo las cuotas que aplican",
      text: "Con la tarjeta guardada, el listado muestra las cuotas y promos que el usuario de verdad va a poder usar. Va como mejora aparte, para no mezclar efectos en el experimento.",
    },
  ],
  ai: {
    title: "Dónde usaría IA",
    items: [
      "Un modelo de riesgo por itinerario (ruta, anticipación, aerolínea, historial de diferencias entre búsqueda y emisión) decide dónde revalidar antes y dónde garantizar sin riesgo. Controla el costo.",
      'El mismo clasificador de reseñas, corriendo cada semana sobre reseñas y conversaciones con SOFIA y atención, avisa si "la promesa rota al pagar" sube después de un release.',
    ],
  },
  experiment: {
    title: "El experimento",
    rows: [
      {
        label: "Población",
        value:
          "Usuarios de la app en Argentina que eligen un vuelo o paquete y entran al checkout. Por usuario. Fuera: B2B, Travel Sale y Black Friday.",
      },
      { label: "Variante", value: "Piezas 1 y 2 juntas, con tope de absorción por orden." },
      {
        label: "Métrica primaria",
        value: "Conversión de checkout iniciado a orden confirmada, por usuario.",
      },
      {
        label: "Guardarraíles",
        value:
          "Revenue neto por orden (incluye lo absorbido), consultas a la aerolínea por orden, contactos a atención por orden, sesiones sin crash.",
      },
      { label: "Duración", value: "4 semanas completas." },
      {
        label: "Tamaño",
        value:
          "~41 mil usuarios por brazo para ver +3% relativo, con 30% de conversión supuesta. La app argentina hizo ~13 mil transacciones por semana en 2024: alcanza en 2-3 semanas.",
      },
    ],
    assumptionsNote:
      "La conversión del checkout y la tasa de cambios de precio no son públicas: son supuestos, con la cuenta en la planilla. Con los datos reales, el tamaño se rehace solo.",
  },
  segments: {
    title: "Por segmento, con el corte fijado antes",
    rows: [
      {
        segment: "Internacional",
        why: "Donde más se mueve la tarifa y donde está el rival directo.",
        cut: "Se mira primero; si ahí no hay efecto, no lo hay en ningún lado.",
      },
      {
        segment: "Doméstico",
        why: "Duopolio desde que salió Flybondi; menos variación de tarifa.",
        cut: "Efecto esperado menor; no se lanza sólo por este segmento.",
      },
      {
        segment: "Nuevos vs. recurrentes",
        why: "El nuevo es el que más se va a la aerolínea.",
        cut: "Si sólo mejora en recurrentes, se revisa la pieza 1.",
      },
    ],
  },
  cut: {
    title: "Criterio de corte, escrito antes de empezar",
    ship: "Se lanza si la conversión sube +2% relativo o más, con el intervalo fuera de cero, el revenue neto por orden no cae más de 1% y lo absorbido es menor que el revenue que se gana.",
    iterate:
      "Se itera si es neutro: se mira sólo internacional y paquetes. Si ahí tampoco hay efecto, se apaga.",
    kill: "Se apaga si la conversión cae 1% o más, si el revenue neto por orden cae más de 2% o si las consultas a la aerolínea por orden se duplican.",
  },
  impact: {
    illustrative: true as const,
    label: "Escenario de ejemplo, no dato",
    text: "Si 8% de los checkouts sufre un cambio de precio, esos convierten a 15% contra 32% del resto, y se recupera la mitad de la brecha: +0,7 puntos de conversión, unas 16 mil órdenes más por año en la app argentina, ~USD 1,3 M de revenue antes de restar lo absorbido.",
  },
  notToBuild: {
    title: "Qué no construiría",
    items: [
      "Otro descuento exclusivo de la app: no arregla que el precio cambie al pagar.",
      "Una pantalla nueva de alertas de precio: Google y Turismocity ya la dan gratis.",
      "Más puntos para volver: Pasaporte ya casi se triplicó y la vuelta no se movió.",
    ],
  },
  firstQuestion:
    "Lo primero que pediría: en qué porcentaje de los checkouts el precio final es mayor que el del listado, y cómo convierten esas sesiones. Si es menos de 2 o 3%, mi hipótesis se cae, y lo siguiente que miraría es la posventa.",
};

// ---------------------------------------------------------------------------
// 09 · Cómo lo mediría (tablero con datos de ejemplo)
// ---------------------------------------------------------------------------

export const dashboard = {
  eyebrow: "Cómo lo mediría",
  heading: "Una métrica norte y tres que no se pueden romper",
  illustrative: true as const,
  label: "Datos de ejemplo: la estructura es la propuesta, los números son inventados",
  northStar: {
    name: "Compradores mensuales de la app",
    why: 'Junta adquisición, activación y vuelta, y no sube regalando instalaciones que no compran. La parte "recurrentes" dice si el balde dejó de perder.',
    breakdown: ["Nuevos", "Recurrentes", "Reactivados"],
    /** Inventado, sólo para la maqueta del gráfico apilado. */
    series: [
      { month: "Jul", nuevos: 92, recurrentes: 118, reactivados: 31 },
      { month: "Ago", nuevos: 101, recurrentes: 121, reactivados: 33 },
      { month: "Sep", nuevos: 97, recurrentes: 124, reactivados: 30 },
      { month: "Oct", nuevos: 110, recurrentes: 127, reactivados: 35 },
      { month: "Nov", nuevos: 126, recurrentes: 131, reactivados: 39 },
    ],
    unit: "miles",
  },
  guardrails: [
    {
      id: "revenue-orden",
      name: "Revenue neto por orden",
      why: "Ninguna mejora de conversión vale si se compra con descuento. Es lo que mira Prosus.",
      value: "USD 79,4",
      delta: "−0,4%",
      status: "ok" as const,
    },
    {
      id: "contactos",
      name: "Contactos a atención por orden",
      why: "Si sube, la mejora movió el problema a la posventa.",
      value: "0,31",
      delta: "+1,2%",
      status: "watch" as const,
    },
    {
      id: "crash",
      name: "Sesiones sin crash",
      why: '"La app se cuelga" es la queja más frecuente, y las de 1 y 2 estrellas saltaron con las versiones 18.62 a 18.67.',
      value: "99,62%",
      delta: "+0,05 pp",
      status: "ok" as const,
    },
  ],
  sql: {
    title: "La consulta que más me importa",
    note: "Si esta diferencia es chica, la hipótesis se cae.",
    code: `-- Conversión de checkout con y sin cambio de precio después de cargar la tarjeta
WITH checkouts AS (
  SELECT
    c.checkout_id,
    c.user_id,
    c.product_type,
    c.listed_price_usd,
    MAX(p.quoted_price_usd) FILTER (WHERE p.after_payment_data) AS last_quote_usd,
    BOOL_OR(o.order_id IS NOT NULL) AS converted
  FROM checkout_started c
  LEFT JOIN price_quotes p USING (checkout_id)
  LEFT JOIN orders o USING (checkout_id)
  WHERE c.country = 'AR' AND c.platform IN ('ios', 'android')
    AND c.started_at >= DATE '2026-09-01'
  GROUP BY 1, 2, 3, 4
)
SELECT
  product_type,
  last_quote_usd > listed_price_usd AS repriced,
  COUNT(*) AS checkouts,
  AVG(converted::int) AS conversion
FROM checkouts
GROUP BY 1, 2
ORDER BY 1, 2;`,
  },
};

// ---------------------------------------------------------------------------
// 10 · Primeros pasos
// ---------------------------------------------------------------------------

export const firstSteps = {
  eyebrow: "Primeros pasos",
  heading: "Lo chico que haría mientras corre el experimento",
  scoringNote:
    "Puntaje RICE ilustrativo (alcance × impacto × confianza ÷ esfuerzo) para ordenar la conversación, no para decidir solo.",
  quickWins: [
    {
      id: "estabilidad",
      title: "Compuerta de estabilidad en cada release",
      evidence: "La queja más frecuente; pico de 1 y 2 estrellas en las versiones 18.62 a 18.67.",
      score: 4.0,
      effort: "Proceso, ya",
    },
    {
      id: "cuotas",
      title: "Cuotas y promos que se cumplen, con el equipo comercial",
      evidence:
        "Las promos bancarias que negocia comercial se pierden en el último paso; sólo le pasa a Despegar.",
      score: 2.8,
      effort: "Bajo",
    },
    {
      id: "reintento",
      title: "Reintentar el pago sin perder el precio",
      evidence: '"Intenté procesar el pago 4 veces y cada vez me subieron más".',
      score: 2.0,
      effort: "Medio",
    },
    {
      id: "login",
      title: "Mostrar cuánto más barato es si iniciás sesión",
      evidence:
        'Hoy el aviso dice "podrías estar viendo un precio más bajo", sin número. Booking muestra el 10%.',
      score: 1.5,
      effort: "Bajo",
    },
  ],
  plan: [
    {
      window: "Primeros 30 días",
      text: "Medir antes de proponer: tasa de cambios de precio en el checkout por producto, conversión con y sin cambio, y recompra de quien tuvo un problema en la posventa. Sentarme con IT, UX, atención y el equipo comercial de promos bancarias.",
    },
    {
      window: "30 a 60 días",
      text: "Fijar con el equipo la métrica, los guardarraíles y el corte, y lanzar el experimento. Sacar la compuerta de estabilidad y el quick win de cuotas.",
    },
    {
      window: "60 a 90 días",
      text: 'Leer el experimento contra el corte escrito. Lanzarlo, iterarlo en internacional o apagarlo. Si se apaga, el siguiente caso es la posventa proactiva en "Mis viajes".',
    },
  ],
};

// ---------------------------------------------------------------------------
// 11 · Cierre
// ---------------------------------------------------------------------------

export const close = {
  heading: "Esto es lo que vi desde afuera. Adentro hay datos que pueden darlo vuelta.",
  body: "Todo lo de esta página sale de fuentes públicas y de reseñas que cualquiera puede leer. No sé cuánto se mueve de verdad el precio en el checkout ni qué hace después quien lo vive, y eso es lo que más importa. Me gustaría averiguarlo con ustedes.",
  questions: [
    "¿Cómo miden hoy a los compradores que vuelven, y en cuánto tiempo?",
    "¿Dónde termina la app y empieza SOFIA cuando un usuario compra por WhatsApp?",
    "¿Hay un análogo argentino de lo que iFood hace por Decolar en Brasil?",
  ],
  emailLabel: "Escribime",
  siteLabel: "ivandujaut.com",
  siteHref: "https://ivandujaut.com",
  sourcesLine: "Cada número tiene su fuente. Lo que es cuenta propia o de ejemplo, lo dice.",
  sourcesToggle: "Ver las {n} fuentes",
  footnote:
    "Página privada. No usa datos internos de Despegar: si un número no es público, está marcado como inferencia o como dato de ejemplo.",
};

/** Rótulos chicos de la interfaz: así ningún componente tiene texto propio. */
export const labels = {
  source: "fuente",
  inference: "Cuenta propia",
  showMath: "Ver la cuenta",
  cut: { ship: "Lanzar", iterate: "Iterar", kill: "Apagar" },
  segmentWhy: "Por qué",
  segmentCut: "Corte",
  status: { ok: "En rango", watch: "Mirar" },
  score: "Puntaje",
  effort: "Esfuerzo",
  linkedin: "LinkedIn",
  placeholderFrames: "Cuadros provisorios: acá van las imágenes del avión",
  monthsShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};

export function sourceList(): string[] {
  return [...new Set(Object.values(sources))];
}
