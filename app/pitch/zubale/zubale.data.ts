/**
 * Pieza para Zubale (proceso de octubre 2026). Todo el texto y todos
 * los números de la página viven acá; cada cifra real tiene su fuente en
 * `sources` y en la hoja de hechos (`data/zubale/facts.md`, fuera del repo).
 * Las cifras del pedido y del caso son inventadas y la página las rotula como
 * "datos de ejemplo".
 *
 * La página tiene dos partes: cómo funciona Zubale hoy (lectura de fuentes
 * públicas) y una idea para contrastar (hipótesis, no diagnóstico).
 */

export type SourceId =
  | "zubaleHome"
  | "flexifleet"
  | "fos"
  | "consumerConnect"
  | "unidrogas"
  | "api"
  | "status"
  | "bamboo59"
  | "anexo"
  | "techcrunch2023"
  | "sumsub"
  | "toggle"
  | "githubOss"
  | "qiu"
  | "playStore"
  | "zubaleroMx"
  | "jobPost"
  | "mckinsey"
  | "amvo"
  | "expansionTiendas"
  | "expansionSparky"
  | "waPricing"
  | "waRates"
  | "metaAgent"
  | "instaleap"
  | "muse"
  | "dots"
  | "walmartChatgpt"
  | "openaiShift"
  | "inventory"
  | "ucp"
  | "forter"
  | "modo"
  | "oos"
  | "referidosShoppers"
  | "referidosDrivers"
  | "zubaleroCl"
  | "zubaleroBr"
  | "zubaleroBrTerms"
  | "zubaleroArAyuda"
  | "waybackHome2019"
  | "waybackHome2021"
  | "nfxAiAnalyst"
  | "resolve"
  | "arOps"
  | "pedidosya"
  | "mission"
  | "pickChat";

export const sources: Record<SourceId, string> = {
  zubaleHome: "https://www.zubale.com/",
  flexifleet: "https://www.zubale.com/solutions/flexifleet/",
  fos: "https://www.zubale.com/solutions/fulfillment-optimizer-software/",
  consumerConnect: "https://www.zubale.com/solutions/consumer-connect-software/",
  unidrogas: "https://www.zubale.com/mx/caso-de-exito-unidrogas/",
  api: "https://developers.zubale.com/",
  status: "https://status.zubale.com",
  bamboo59: "https://zubale.bamboohr.com/careers/59",
  anexo:
    "https://www.zubale.com/br/wp-content/uploads/2026/05/Anexo-IV.-Diretrizes-Operacionais.pdf",
  techcrunch2023:
    "https://techcrunch.com/2023/11/30/zubale-software-retailers-e-commerce-latin-america/",
  sumsub: "https://sumsub.com/customers/zubale/",
  toggle: "https://togglemag.com/case-studies/marco-herrarte-zubale/",
  githubOss: "https://github.com/zubale-oss",
  qiu: "https://q-the-hacker.com/post/how-we-reduced-memory-usage-in-an-application-built-with-elixir-and-commanded",
  playStore: "https://play.google.com/store/apps/details?id=mx.com.topup&hl=es&gl=mx",
  zubaleroMx: "https://www.zubalero.com/mx/reforma-ley-de-plataformas/",
  jobPost: "https://www.linkedin.com/jobs/view/4475859030/",
  mckinsey:
    "https://www.mckinsey.com/industries/retail/our-insights/achieving-profitable-online-grocery-order-fulfillment",
  amvo: "https://images.produ.com/wp-content/uploads/2026/03/12132700/AMVO_Estudio-de-Venta-Online-2026-Prensa-1_compressed.pdf",
  expansionTiendas:
    "https://expansion.mx/empresas/2026/10/02/walmart-soriana-y-chedraui-cambian-sus-tiendas-para-mejorar-la-experiencia-de-los-clientes-que-les-compran-en-linea",
  expansionSparky:
    "https://expansion.mx/empresas/2026/09/24/walmart-sparky-asistente-compras-inteligencia-artificial",
  waPricing:
    "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages",
  waRates: "https://business.whatsapp.com/products/platform-pricing",
  metaAgent: "https://business.whatsapp.com/blog/introducing-meta-business-agent-ai",
  instaleap:
    "https://www.instacart.com/company/pressreleases/instacart-acquires-instaleap-to-accelerate-global-expansion-of-its-enterprise-platform",
  muse: "https://the-decoder.com/muse-can-shop-write-emails-and-negotiate-prices-for-users-all-through-whatsapp/",
  dots: "https://www.cnbc.com/2026/09/30/openai-follows-meta-into-the-red-hot-market-for-personal-agents.html",
  walmartChatgpt: "https://ppc.land/walmarts-chatgpt-checkout-flopped-heres-what-comes-next/",
  openaiShift:
    "https://www.digitalcommerce360.com/2026/03/06/openai-shifts-checkout-plans-agentic-commerce-strategy/",
  inventory:
    "https://www.pscm.tu-darmstadt.de/forschung_pscm/abgeschlossene_forschungsprojekte_pscm/ecr/index.en.jsp",
  ucp: "https://ucp.dev/",
  forter:
    "https://www.prnewswire.com/news-releases/forter-turns-the-ai-shopping-agent-surge-into-a-secure-revenue-channel-for-merchants-302906333.html",
  modo: "https://www.diegoceredi.com/blog/pagos-agenticos-argentina-mercado-libre-tiendanube",
  oos: "https://www.supermarketnews.com/grocery-operations/online-shoppers-go-elsewhere-when-items-out-of-stock",
  referidosShoppers: "https://www.zubalero.com/mx/referidos-shoppers-zonas-estandar/",
  referidosDrivers: "https://www.zubalero.com/mx/referidos-drivers/",
  zubaleroCl: "https://www.zubalero.com/cl/gracias/",
  zubaleroBr: "https://www.zubalero.com/br/indique-um-zubalero/",
  zubaleroBrTerms: "https://www.zubalero.com/br/termos-e-condicoes/",
  zubaleroArAyuda: "https://www.zubalero.com/ar/ayuda/",
  waybackHome2019: "https://web.archive.org/web/20190423070053/https://www.zubale.com/",
  waybackHome2021: "https://web.archive.org/web/20210412074344/https://www.zubale.com/",
  nfxAiAnalyst: "https://jobs.nfx.com/companies/zubale/jobs/57503740-ai-analyst",
  resolve:
    "https://www.zubalero.com/br/wp-content/uploads/2026/08/ProgramaResolve_Regulamento-Zubaleros_Projeto-Piloto.pdf",
  arOps: "https://ar.linkedin.com/jobs/view/analista-de-operaciones-at-zubale-4479219229",
  pedidosya:
    "https://mercado.com.ar/tendencias/pedidosya-crecio-22-en-ordenes-en-2025-y-gano-peso-en-super-online",
  mission: "https://www.mobiletime.com.br/?p=840349",
  pickChat: "https://instaleap.io/whatsapp-pick-and-chat-2/",
};

export const author = {
  name: "Iván Dujaut",
  linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
  emailUserReversed: "navituajud",
  emailDomainReversed: "moc.liamg",
};

export const meta = {
  title: "Zubale, leída desde afuera",
  description:
    "Una lectura de Zubale: cómo funciona hoy y una idea para el momento en que falta un producto en la góndola.",
};

export const nav = [
  { id: "inicio", label: "Inicio" },
  { id: "problema", label: "Qué resuelve" },
  { id: "productos", label: "Qué vende" },
  { id: "pedido", label: "El pedido" },
  { id: "marketplace", label: "Las dos puntas" },
  { id: "sistemas", label: "Con qué lo hacen" },
  { id: "desafios", label: "Desafíos" },
  { id: "viene", label: "Lo que viene" },
  { id: "tesis", label: "La idea" },
  { id: "caso", label: "Un primer paso" },
  { id: "preguntas", label: "Preguntas abiertas" },
  { id: "arranque", label: "Cómo arrancaría" },
  { id: "cierre", label: "Cierre" },
] as const;

/**
 * Rótulos de las dos lecturas que recorren la página. Magenta: lo que pasa en
 * la tienda. Azul: lo que queda escrito para una máquina. Hoy esa máquina es
 * el sistema del súper; en la segunda parte, el agente del comprador. Los
 * dos colores se usan sólo para esto.
 */
export const readers = {
  person: "Lo que ve una persona",
  agent: "Lo que lee una máquina",
};

export const hero = {
  kicker: "Zubale, leída desde afuera",
  title: "Si los agentes de IA hacen el súper,",
  titleAccent: "van a elegir al que no les mienta sobre la góndola.",
  lede: "Soy Iván Dujaut. Quiero trabajar en Zubale resolviendo problemas del negocio: entender qué pasa, decidir qué vale la pena cambiar y lograr que funcione, con datos, producto y procesos. Armé esta página para entender cómo funciona Zubale hoy y traer una idea para discutir.",
  byline: "Octubre de 2026",
  summary: [
    {
      label: "Qué entendí",
      text: "Zubale vuelve variable el costo de armar y entregar cada pedido, con Zubaleros en la tienda y software que los coordina.",
      href: "#pedido",
    },
    {
      label: "Qué propongo",
      text: "Que el faltante en la góndola sea una pregunta con dos botones, que contesta el cliente o su agente.",
      href: "#caso",
    },
    {
      label: "Cómo arrancaría",
      text: "Medir el pedido perfecto, probar la idea en una tienda y, a los 90 días, escalarla o apagarla.",
      href: "#arranque",
    },
  ],
  cue: "Un agente de IA compra por una persona: no recorre la góndola, lee lo que el súper publica. Por eso el mismo pedido aparece dos veces en toda la página: en magenta, lo que pasa en la tienda; en azul, lo que queda escrito para una máquina. Hoy esa máquina es el sistema del súper; mañana, el agente del comprador. La idea de la segunda parte sale de la última fila, la del queso que no está.",
  preview: {
    person: ["Pedido de 6 productos", "Lo arma Lucía en la sucursal"],
    agent: ['"items": 6', '"status": "PICKING_STARTED"'],
    gap: {
      person: "Queso cremoso 400 g: no hay",
      agent: '"QC400": { "available": true }',
      label: "La máquina cree que hay",
    },
  },
};

export const partOne = {
  label: "Primera parte",
  title: "Cómo funciona Zubale hoy",
  note: "Todo sale de fuentes públicas: su sitio, su API, su página de estado, avisos, reseñas y prensa. Lo que es inferencia mía, lo digo.",
};

/** 01 · Qué resuelve */
export const problem = {
  index: "01",
  eyebrow: "Qué resuelve",
  heading: "Vender online es fácil. Armar y entregar cada pedido sin perder plata, no.",
  intro:
    "Un supermercado que vende online tiene que pagarle a alguien para que recorra la góndola, arme la bolsa y la lleve. Ese costo es el que se come el margen.",
  stats: [
    {
      value: "−USD 13",
      label:
        "deja una canasta online de USD 100 si un súper de Norteamérica la arma y la entrega sin cobrar envío, contra +USD 4 en la tienda (McKinsey, 2022)",
      source: "mckinsey" as SourceId,
      sourceLabel: "McKinsey",
    },
    {
      value: "45%",
      label:
        "de los compradores online en México dice que lo que más le molesta de la entrega es que llegue incompleta, más que dañada o tarde",
      source: "amvo" as SourceId,
      sourceLabel: "AMVO 2026",
    },
    {
      value: "1.490",
      label:
        "tiendas usa Walmart México para preparar pedidos On Demand: la sucursal se volvió un pequeño centro logístico",
      source: "expansionTiendas" as SourceId,
      sourceLabel: "Expansión",
    },
  ],
  quote: {
    text: "La siguiente etapa del e-commerce en los supermercados ya no será solamente una competencia por tener la mejor aplicación o generar más ventas digitales, sino por determinar quién puede procesar y entregar cada pedido al menor costo posible.",
    author: "Julián Fernández, Mar Capital, en Expansión",
    source: "expansionTiendas" as SourceId,
  },
  answer: {
    lead: "La respuesta de Zubale.",
    text: "Convertir ese costo fijo en variable: una red de freelancers, los Zubaleros, que arman y entregan los pedidos desde la tienda del súper, con software que los asigna y los controla.",
    source: "flexifleet" as SourceId,
  },
};

/** 02 · Qué vende */
export const products = {
  index: "02",
  eyebrow: "Qué vende",
  heading: "Gente en la tienda, software que la coordina y un canal de WhatsApp.",
  items: [
    {
      id: "flexifleet",
      name: "FlexiFleet",
      role: "El negocio",
      text: "Freelancers que hacen picking, packing y entrega en tiendas, dark stores o centros de distribución. Zubale recluta, capacita, asigna y paga.",
      source: "flexifleet" as SourceId,
    },
    {
      id: "fos",
      name: "Fulfillment Optimizer",
      role: "El motor",
      text: "Asignación automática con ruteo, app de armado, una torre de control con métricas en vivo y un modelo que agrupa pedidos por franja. Es el software que usa FlexiFleet; su sitio lo ofrece también por separado.",
      source: "fos" as SourceId,
    },
    {
      id: "cc",
      name: "Consumer Connect",
      role: "El canal",
      text: "Venta y seguimiento por WhatsApp con IA: catálogo, pago, avisos de estado, chat con el picker o el repartidor sin exponer datos y un PIN de entrega.",
      source: "consumerConnect" as SourceId,
    },
    {
      id: "zwork",
      name: "Zwork",
      role: "Lo nuevo",
      text: "Personal contratado a medida para centros de distribución en México. Aparece en los avisos de 2026 como una de las empresas de Zubale.",
      source: "bamboo59" as SourceId,
    },
  ],
  timeline: {
    title: "Cómo llegó hasta acá",
    steps: [
      { year: "2019", text: "App de tareas para marcas: relevar góndolas, encuestas" },
      {
        year: "2021",
        text: "Marketplace de trabajo: picking y entrega para súper, junto a tareas para marcas",
      },
      { year: "2023", text: "Ecosistema de tres productos; última ronda pública, USD 25 M" },
      { year: "2026", text: "Siete países en su sitio, con Argentina desde cero" },
    ],
    sources: ["waybackHome2019", "waybackHome2021", "techcrunch2023"] as SourceId[],
  },
  facts: [
    {
      value: "USD 73 M",
      label: "de capital de riesgo hasta 2023, sin rondas públicas después",
      source: "techcrunch2023" as SourceId,
    },
    {
      value: "7",
      label: "países en su sitio: MX, BR, CL, CO, PE, CR y Argentina, en apertura",
      source: "zubaleHome" as SourceId,
    },
    {
      value: "+100 M",
      label: "de pedidos completados, según sus avisos de empleo",
      source: "jobPost" as SourceId,
    },
  ],
  clients:
    "Con operación reciente, según sus búsquedas de Zubaleros: Walmart en México y Chile; Carrefour, Assaí y Cencosud en Brasil, donde también arma para apps como 99 y Daki. Supermercados grandes, sobre todo. En Consumer Connect, su caso con nombre es Unidrogas.",
  clientsSources: ["referidosShoppers", "zubaleroCl", "zubaleroBr", "unidrogas"] as SourceId[],
  beyond: {
    lead: "No es sólo súper.",
    text: "También trabaja con farmacias (Unidrogas, en Colombia) y retira en bodegas de tiendas departamentales y de moda para repartir (Coppel y Converse aparecen en una búsqueda de repartidores). Opera en dark stores y centros de distribución, y a veces sólo entrega, sin armar. Por sus búsquedas, el volumen parece estar en el supermercado.",
    sources: ["referidosDrivers", "flexifleet", "unidrogas"] as SourceId[],
  },
};

/** 03 · El pedido de punta a punta (el corazón de la primera parte) */
export const order = {
  index: "03",
  eyebrow: "El pedido de punta a punta",
  heading: "Un pedido, siete pasos, dos lecturas.",
  intro:
    "En cada paso, primero lo que pasa en la tienda y después, en azul, el estado que la API de Zubale le avisa al súper, con sus nombres reales. No hace falta leer los códigos: alcanza con ver que cada paso ya queda escrito para una máquina. Mirá el paso 4.",
  readers: { person: "En la tienda", agent: "Lo que la API le avisa al súper" },
  steps: [
    {
      id: "recibe",
      person: "El súper recibe un pedido online y se lo pasa a Zubale.",
      agent: ["POST /orders/api/pnp_e2e/jobs", "TASK_SCHEDULED"],
    },
    {
      id: "asigna",
      person:
        "Un algoritmo lo asigna a un Zubalero con turno en esa tienda. Si falla, el pedido vuelve a una lista para que alguien lo tome.",
      agent: ["TASK_ASSIGNED"],
    },
    {
      id: "arma",
      person: "El Zubalero recorre la góndola con la app y escanea cada producto.",
      agent: ["PICKING_STARTED", "PRODUCT_SCANNED"],
    },
    {
      id: "falta",
      person:
        "Si algo falta, el Zubalero puede llamar al cliente para acordar un reemplazo, o escribirle si el súper usa Consumer Connect.",
      agent: ["CALLED_CUSTOMER"],
      gap: "qué decidió el cliente: recién en el pedido final",
    },
    {
      id: "caja",
      person: "Pasa por caja, empaca y sale, o se lo da a un repartidor.",
      agent: ["AT_CASHIER", "PICKED_OUT"],
    },
    {
      id: "entrega",
      person:
        "Lo entrega con una prueba de entrega. Si el súper usa Consumer Connect, el cliente recibe un PIN y seis avisos por WhatsApp, del pedido creado a la entrega.",
      agent: ["ENROUTE_TO_DROPOFF", "AT_DROPOFF", "DELIVERED"],
    },
    {
      id: "cobra",
      person: "La entrega se califica y el Zubalero cobra.",
      agent: [],
      internal: "interno: calificación y pago",
    },
  ],
  footnote:
    "Los nombres en azul salen de la documentación pública de la API v3; el PIN, de la página de Consumer Connect; lo interno, de su página de estado. En el paso 4 la API marca el momento de la llamada; qué se ofreció y qué decidió el cliente le llega al súper recién en el pedido final, como un producto reemplazado o quitado. Eso es lo que retoma la segunda parte.",
  sources: ["api", "consumerConnect", "status"] as SourceId[],
};

/** 04 · Las dos puntas del marketplace */
export const marketplace = {
  index: "04",
  eyebrow: "Las dos puntas",
  heading: "Un marketplace con dos clientes: el que trabaja y el que vende.",
  sides: [
    {
      id: "zubalero",
      title: "El lado del Zubalero",
      items: [
        {
          lead: "Alta con verificación de identidad.",
          text: "Prueba de vida y documento antes de la primera tarea: según el proveedor, 32 segundos de mediana y 90% menos fraude. Después vienen la capacitación y el primer turno, que es donde, según las reseñas, se traba el alta.",
          sources: ["sumsub", "playStore"] as SourceId[],
        },
        {
          lead: "Turnos y asignación.",
          text: "El súper reserva turnos con días de anticipación y Zubale manda Zubaleros que cumplen los requisitos de cada operación.",
          sources: ["flexifleet"] as SourceId[],
        },
        {
          lead: "Cumplimiento distinto en cada país.",
          text: "En México, desde la reforma de plataformas de 2025, Zubale da de alta en el seguro social antes de la primera tarea y retiene 2,775% por tarea.",
          sources: ["zubaleroMx"] as SourceId[],
        },
      ],
    },
    {
      id: "super",
      title: "El lado del súper y su cliente",
      items: [
        {
          lead: "Integración por API.",
          text: "Dos tipos de trabajo (sólo entrega, o armado y entrega), consulta de productos por código de barras y confirmación del pedido final. Cencosud tiene su propia integración.",
          sources: ["api"] as SourceId[],
        },
        {
          lead: "El contrato, en Brasil.",
          text: "Zubale cobra por producto pedido, aunque falte en la góndola. El súper pone baños, agua y lugar para comer, y un punto focal que resuelve dudas pero no sanciona: la conducta la gestiona Zubale.",
          sources: ["anexo"] as SourceId[],
        },
        {
          lead: "El cliente final, por WhatsApp.",
          text: "Seis avisos de estado del pedido. En su caso con Unidrogas (más de 700 droguerías en Colombia), Zubale dice que el canal creció 6 veces en cinco semanas.",
          sources: ["api", "unidrogas"] as SourceId[],
        },
      ],
    },
  ],
};

/** 05 · Con qué lo hacen */
export const systems = {
  index: "05",
  eyebrow: "Con qué lo hacen",
  heading: "Un núcleo de eventos con años encima y una capa nueva con IA.",
  intro:
    "En simple: un núcleo con años encima y una capa nueva en TypeScript y Python. Abajo, los nombres que aparecen en su página de estado, su API, su GitHub y sus avisos, en el orden del pedido.",
  lanes: [
    { name: "Entrada", items: ["Orc (integraciones)", "Quest", "API v3"] },
    { name: "Asignación", items: ["Allocator", "Order Handler", "Zoe (manual)", "Marketplace"] },
    { name: "En la tienda", items: ["App del Zubalero", "Reservas de turnos", "Geolocalización"] },
    {
      name: "Después",
      items: ["Calificación de entregas", "Pagos (dLocal y Bitso en México)", "Soporte"],
    },
    {
      name: "Cliente final",
      items: ["Consumer Connect", "WhatsApp", "LLM (OpenAI, según un incidente)"],
    },
  ],
  base: [
    {
      label: "Núcleo",
      text: "Elixir y Java, con Kafka y event sourcing (Commanded). El aviso lo llama sistema legado.",
      sources: ["githubOss", "nfxAiAnalyst"] as SourceId[],
    },
    {
      label: "Lo nuevo",
      text: "TypeScript y Python (NestJS, FastAPI), React y React Native, y LangGraph y ADK para agentes",
      sources: ["jobPost"] as SourceId[],
    },
    {
      label: "Infraestructura",
      text: "Google Cloud, Kubernetes, Redis y Grafana",
      sources: ["status", "jobPost"] as SourceId[],
    },
    {
      label: "IA interna",
      text: "ZARM: modelos aprobados (Gemini), agentes y n8n, con tope de gasto por proyecto y una persona en los flujos de riesgo. Según una nota de perfil, más de 750.000 ejecuciones por mes.",
      sources: ["toggle"] as SourceId[],
    },
  ],
  footnote:
    "Un ingeniero de Zubale contó en 2022 cómo resolvieron la memoria de su servicio de event sourcing: es la familia de problemas que conviene entender antes de tocar el núcleo.",
  footnoteSource: "qiu" as SourceId,
};

/** 06 · Los desafíos de hoy, como preguntas */
export const challenges = {
  index: "06",
  eyebrow: "Los desafíos que se ven desde afuera",
  heading: "Cinco cosas que vi y que preguntaría antes de opinar.",
  items: [
    {
      id: "oferta",
      seen: "Las reseñas nuevas de la app de Zubaleros en Google Play bajaron de 4,1 estrellas en 2022 a 2,0 en 2026, y en Brasil cayeron antes y más rápido, desde la segunda mitad de 2024. Las quejas son por fallas de la app, soporte y altas trabadas, casi nunca por la tarifa.",
      ask: "¿Qué está dejando el piloto Resolve+ en Brasil, y qué parte del alta y el soporte está en el roadmap?",
      sources: ["playStore", "resolve"] as SourceId[],
      note: "cálculo propio: tendencia sobre 5.415 reseñas de Google Play; temas sobre 966 negativas desde 2025",
    },
    {
      id: "eventos",
      seen: "En 2025 la página de estado registró cinco incidentes de eventos trabados en una cola. En tres se terminó reiniciando la base y en otro se editó a mano el evento que la frenaba. Desde agosto de 2025 no hay incidentes publicados.",
      ask: "¿Cómo se resolvió? ¿Hoy hay cola de descarte e idempotencia?",
      sources: ["status"] as SourceId[],
    },
    {
      id: "whatsapp",
      seen: "Desde el 1 de octubre, WhatsApp cobra cada respuesta de una empresa. En Colombia, donde está el caso Unidrogas, USD 0,0008 por mensaje; en Argentina, USD 0,026, más de 30 veces más.",
      ask: "¿Cómo cambió la cuenta de Consumer Connect, y quién paga esos mensajes?",
      sources: ["waPricing", "waRates"] as SourceId[],
    },
    {
      id: "competencia",
      seen: "Instacart compró Instaleap, el rival de software más parecido; en Brasil, Mission dice poner pickers en 2.500 supermercados; Meta vende su propio agente para empresas. Y el agregador también es cliente: en Brasil, Zubale arma para 99 y Daki.",
      ask: "¿Dónde compite Zubale y dónde no quiere competir?",
      sources: ["instaleap", "mission", "metaAgent", "zubaleroBr"] as SourceId[],
    },
    {
      id: "argentina",
      seen: "Argentina arranca de cero: no hay un cliente local con nombre, los primeros avisos buscan couriers para Hot Sale y Black Friday, y la ayuda del portal de Zubaleros todavía pide RFC mexicano. Según PedidosYa, más de la mitad del súper online ya pasa por su app.",
      ask: "¿El primer cliente es de reparto o de armado, y entra como alternativa a PedidosYa o al lado?",
      sources: ["arOps", "zubaleroArAyuda", "pedidosya"] as SourceId[],
    },
  ],
};

/** 07 · Lo que viene: el comprador nuevo */
export const next = {
  index: "07",
  eyebrow: "Lo que viene",
  heading: "Aparece un comprador nuevo, y no mira la góndola.",
  intro:
    "Un agente de IA no recorre la tienda: lee el catálogo del súper y compra con eso. Si el catálogo dice que hay y en la góndola no hay, el pedido llega incompleto.",
  steps: [
    {
      id: "muse",
      text: "En septiembre Meta lanzó Muse, un agente que, según Meta, compra y negocia por la persona y se usa desde WhatsApp. Por ahora funciona sólo en Estados Unidos. A fin de mes, OpenAI respondió con Dots, un agente personal más general.",
      sources: ["muse", "dots"] as SourceId[],
    },
    {
      id: "walmart",
      text: "La primera lección vino de Walmart: dentro de ChatGPT, la compra convertía tres veces menos que en su sitio, en parte porque se compraba de a un producto por vez. En marzo OpenAI pasó esa compra a las apps de cada comercio y Walmart metió a su propio asistente adentro del chat.",
      sources: ["walmartChatgpt", "openaiShift"] as SourceId[],
    },
    {
      id: "stock",
      text: "Y en la tienda el dato falla: en un estudio con ocho cadenas minoristas, cerca de 60% de los productos tenía el stock del sistema distinto al real.",
      sources: ["inventory"] as SourceId[],
    },
    {
      id: "zubalero",
      text: "El Zubalero que arma el pedido sí sabe qué hay en la góndola. Marca el faltante en la app y el súper lo recibe en el pedido final. Si eso corrige el catálogo que lee el agente, desde afuera no se ve.",
      sources: ["api"] as SourceId[],
    },
  ],
  scene: {
    person: {
      reader: "Lo que ve el Zubalero",
      readerShort: "El Zubalero",
      label: "En la góndola",
      item: "Queso cremoso 400 g",
      state: "No hay",
      marked: "Lucía lo marcó, 18:42",
      markedShort: "Lo marcó Lucía",
    },
    agent: {
      reader: "Lo que lee el agente",
      readerShort: "El agente",
      label: "En el catálogo",
      lines: ['"sku": "QC400"', '"available": true'],
      mismatch: "El agente cree que hay",
      question: "¿Le llega lo que marcó Lucía?",
    },
  },
  latam: {
    lead: "En la región ya empezó.",
    text: "En México, Walmart, el cliente que más aparece en las búsquedas de Zubaleros, lanzó en septiembre Sparky, un asistente de compras con IA dentro de su app. En Argentina, MODO lanzó la compra dentro de ChatGPT con Frávega como único comercio y, según su CEO, con un objetivo de aprendizaje.",
    sources: ["expansionSparky", "referidosShoppers", "modo"] as SourceId[],
  },
};

export const partTwo = {
  label: "Segunda parte",
  title: "Una idea para contrastar",
  note: "Arranca con lo que viene y sigue con la idea. Es una hipótesis, no un diagnóstico, y no espera a los agentes: el primer paso sirve hoy con personas. La armé desde afuera y la quiero ajustar con lo que Zubale ve adentro.",
};

/** 08 · La tesis (frase grande que se enciende palabra por palabra) */
export const thesis = {
  index: "08",
  eyebrow: "La idea",
  lines: [
    "Si los agentes de IA hacen el súper,",
    "van a elegir al que no les mienta sobre la góndola.",
  ],
  coda: "El que ve la góndola es el Zubalero.",
  reasons: [
    {
      id: "dato",
      title: "El dato que importa es el menos confiable",
      text: "Está o no está, qué lo reemplaza, cuándo llega. Es lo que un agente necesita y, en el estudio de ocho cadenas, lo que el sistema tenía peor cargado.",
    },
    {
      id: "persona",
      title: "Zubale tiene a la persona que lo ve",
      text: "Gente en la tienda, una app que reporta cada paso y, donde el súper usa Consumer Connect, el WhatsApp del cliente en la marca del comercio. Entre los competidores que revisé, ninguno junta las tres.",
    },
    {
      id: "momento",
      title: "El faltante es el momento",
      text: "Es el punto del pedido donde todavía hace falta una decisión del comprador. Hoy se resuelve con una llamada o con un chat libre con el picker, y ninguno de los dos deja la decisión escrita de forma que la pueda tomar un agente.",
    },
  ],
  scope: {
    lead: "Por qué el súper primero.",
    text: "Zubale no es sólo súper, pero el súper es el caso más difícil para un agente: canasta grande, perecederos y faltantes frecuentes. Lo que se aprenda ahí sirve para el resto, con reglas propias en cada rubro: en farmacia reemplazar es más delicado y la regla tiene que ser más conservadora.",
    sources: ["oos", "unidrogas"] as SourceId[],
  },
};

/** 09 · El caso: falta en góndola (mock interactivo) */
export const caseStudy = {
  index: "09",
  eyebrow: "Un primer paso",
  heading:
    "Falta en góndola: el reemplazo como una pregunta con dos botones, que puede contestar una persona o su agente.",
  objective:
    "Que más pedidos lleguen completos o con un reemplazo que el cliente aprobó, sin sumar minutos de armado ni costo por pedido.",
  intro:
    "Zubale dice que Consumer Connect ya ofrece sustituciones cuando algo no hay y chat con el picker, e Instaleap vende algo parecido. Propongo que el faltante en la góndola viaje como una pregunta estructurada, con tiempo límite y una regla por defecto. Probalo abajo: el Zubalero marca el faltante y decide el cliente, o su agente, según una regla que la persona aprobó antes.",
  introSources: ["consumerConnect", "unidrogas", "pickChat"] as SourceId[],
  exampleBadge: "datos de ejemplo",
  mock: {
    store: "Sucursal Centro",
    picker: "Lucía",
    window: "Entrega 18:00 a 20:00",
    items: [
      { id: "leche", name: "Leche descremada 1 L", qty: "×2" },
      { id: "pan", name: "Pan lactal integral", qty: "×1" },
      { id: "yerba", name: "Yerba mate 1 kg", qty: "×1" },
      { id: "tomate", name: "Tomate redondo", qty: "1,2 kg" },
      { id: "queso", name: "Queso cremoso 400 g", qty: "×1", missing: true },
      { id: "detergente", name: "Detergente 750 ml", qty: "×1" },
    ],
    substitute: { name: "Queso cremoso 500 g, otra marca", diff: "+$1.240" },
    modes: { person: "Contesta una persona", agent: "Contesta su agente" },
    actions: {
      mark: "Marcar faltante",
      accept: "Sí, cambialo",
      reject: "No, sacalo",
      reset: "Volver a empezar",
    },
    personMessage:
      "Hola, soy Lucía y estoy armando tu pedido. No hay Queso cremoso 400 g. ¿Te llevo este?",
    agentRequest: [
      '"type": "substitution_request"',
      '"missing": "Queso cremoso 400 g"',
      '"offer": "Queso cremoso 500 g, otra marca"',
      '"price_diff": 1240',
      '"respond_within_s": 120',
    ],
    agentPreference:
      'Regla que la persona aprobó antes: "lácteos: aceptar otra marca si el precio sube menos de 15%". Sin esa regla, el agente le pregunta a la persona.',
    agentResponse: ['"decision": "accept"', '"reason": "within_preference"'],
    results: {
      person: {
        time: "1 min 52 s",
        messages: "2",
        cost: "USD 0,052",
      },
      agent: {
        time: "1,8 s",
        messages: "0",
        cost: "sin mensajes de WhatsApp",
      },
      today: "Hoy, según la API: una llamada, o un chat libre donde el súper usa Consumer Connect.",
      labels: {
        time: "Tiempo para decidir",
        messages: "Mensajes cobrados",
        cost: "Tarifa de Meta en Argentina",
        perfect: "Pedido perfecto",
      },
    },
    rejected:
      "Se saca del pedido y se ajusta el cobro. El pedido llega incompleto, pero sin sorpresas.",
    idle: 'Tocá "Marcar faltante" y mirá cómo le llega la pregunta al cliente. Después cambiá a "Contesta su agente" y repetí: es la misma pregunta, con otro lector.',
    summary:
      "En este ejemplo: hoy, una llamada. Con la pregunta por WhatsApp, 2 mensajes y casi 2 minutos. Con su agente, ningún mensaje de WhatsApp y menos de 2 segundos.",
    written: {
      title: "Lo que queda escrito para una máquina",
      today: { label: "Hoy, en la API", states: ["CALLED_CUSTOMER"] },
      proposed: {
        label: "Con la idea (nombres míos)",
        asking: ["ITEM_MISSING", "SUBSTITUTION_REQUESTED"],
        done: "SUBSTITUTION_DECIDED",
      },
      catalog: {
        before: '"QC400": { "available": true }',
        after: '"QC400": { "available": false }',
      },
    },
  },
  why: {
    title: "Por qué este primero",
    items: [
      { text: "Ataca lo que más le molesta al comprador online en México: el pedido incompleto." },
      {
        text: "Las piezas ya pasan por Zubale: el faltante viaja en el pedido final que le confirma al súper y, donde el súper usa Consumer Connect, el WhatsApp del cliente también.",
      },
      {
        text: "Une FlexiFleet y Consumer Connect en un solo momento, y cuida al Zubalero: en Brasil, cambiar un producto sin autorización es causal de baja.",
        source: "zubaleroBrTerms" as SourceId,
      },
      {
        text: "Sirve hoy sin agentes, con el cliente en WhatsApp. Y cada faltante marcado es un dato de stock real: el primer paso para no mentirle a un agente sobre la góndola.",
      },
    ],
  },
  metrics: {
    title: "Cómo lo mediría",
    north:
      "Tasa de pedido perfecto: completo o con un reemplazo aprobado, en la franja y sin reclamo.",
    segments:
      "Por categoría, tienda y franja, porque el promedio esconde dónde falla. Adelantan: llamadas sin respuesta y tiempo hasta la decisión.",
    guards:
      "Sin dejar subir el tiempo de armado, el costo por pedido (con los mensajes) ni los reembolsos, y sin bajar lo que gana el Zubalero por hora.",
    cut: "Corte fijado antes, sobre la línea de base del primer mes: si en los pedidos con faltante el armado suma más minutos de los que ahorra no llamar, o el pedido perfecto no sube, se apaga. Ojo con el falso éxito: más reemplazos aceptados con más reclamos no es una mejora.",
  },
  notToBuild: {
    title: "Qué no construiría",
    items: [
      "Un agente conversacional genérico que compita con el de Meta o con iFood, ni una charla entre agentes por WhatsApp, que Meta no anunció.",
      "Un modelo propio que elija el reemplazo antes de tener datos de aceptación: al principio lo elige el Zubalero, con foto.",
      "Un checkout propio para agentes.",
      "Reemplazos automáticos en carne, fiambrería, farmacia o mascotas, donde la gente menos los acepta.",
    ],
    source: "oos" as SourceId,
  },
};

/** 10 · Preguntas abiertas para la dirección */
export const questions = {
  index: "10",
  eyebrow: "Preguntas abiertas",
  heading: "Dos preguntas que no puedo contestar desde afuera.",
  intro:
    "Las dejo planteadas para la conversación. Abajo de cada una, por dónde empezaría a mirar.",
  items: [
    {
      id: "costo",
      question:
        "¿Cómo bajamos el costo de atender agentes, para que comprar sea fácil y rápido, y además mejore lo que recibe el cliente?",
      why: "Cada mensaje de WhatsApp ya se cobra, cada respuesta de un modelo consume tokens, y un agente que raspa un sitio tarda unas 10 veces más y gasta unas 5 veces más tokens que uno con una interfaz estructurada, según una prueba de Forter, que vende ese tipo de compra.",
      whySources: ["waPricing", "forter"] as SourceId[],
      look: [
        "Medir el costo por pedido perfecto, no por mensaje: un mensaje caro que evita un reembolso es barato.",
        "Responder primero con reglas y datos, y llamar al modelo sólo cuando hace falta. En la demo de mi bot de seguros, 64% de las dudas conocidas se resuelven sin generar texto.",
        "Ver quién gana con cada reemplazo: en Brasil Zubale cobra por producto pedido aunque falte, así que la venta que se salva es del súper. Eso ordena quién paga los mensajes.",
      ],
      inside: "¿Cuántos mensajes y cuánto cuesta hoy, en promedio, un pedido por Consumer Connect?",
    },
    {
      id: "stock",
      question:
        "¿Cómo conectamos el stock que se mide en la góndola con lo que un agente sabe en tiempo real: stock, precio, franja?",
      why: "UCP, el protocolo abierto que impulsan Google, Shopify y otros para que los agentes compren, describe la disponibilidad de cada producto con un estado (hay, sin stock, por encargo). Y en el estudio de ocho cadenas, cerca de 60% de los productos tenía el stock del sistema mal cargado; corregirlo subió las ventas entre 4% y 8%.",
      whySources: ["ucp", "inventory"] as SourceId[],
      look: [
        "Cada faltante que marca un Zubalero ya le llega al súper en el pedido final, y la API ya prevé consultarle al súper el producto de reemplazo con su stock por tienda: usar esos datos para corregir el stock publicado en minutos, empezando por el catálogo que Zubale maneja para Consumer Connect.",
        "Publicar el dato con su frescura: no sólo si hay, sino cuándo se vio y quién lo vio.",
        "Exponer los estados del pedido como los espera un agente. En UCP no vi una forma de pedir un reemplazo: ese hueco está abierto.",
      ],
      inside:
        "El faltante ya viaja en el pedido final: ¿alguien lo usa para corregir el stock? ¿Ya llegan pedidos de Sparky a tiendas con Zubaleros?",
    },
  ],
};

/** 11 · Cómo arrancaría: la métrica, el plan de 90 días y las pruebas */
export const plan = {
  index: "11",
  eyebrow: "Cómo arrancaría",
  heading: "Entender, probar y decidir en 90 días.",
  intro:
    "Lo que me interesa es el problema, no la herramienta: decidir qué vale la pena resolver, resolverlo con lo que haga falta y lograr que se use, de la dirección a operaciones. Así encararía los primeros 90 días.",
  north: {
    label: "La métrica que propondría mirar primero",
    value: "Tasa de pedido perfecto",
    text: "Es lo que el súper le vende a su cliente, lo que el cliente reclama cuando falla y lo que un agente podría usar para elegir dónde comprar.",
  },
  phases: [
    {
      id: "30",
      title: "Días 1 a 30",
      subtitle: "Entender y medir",
      items: [
        "Hacer el alta de Zubalero de punta a punta, armar pedidos en un turno y estar con operaciones en Vicente López en el pico de fin de año.",
        "Recorrer el pedido de punta a punta con ingeniería y operaciones, de la integración del súper al pago del Zubalero.",
        "Línea de base: faltantes, tiempo para decidir, llamadas sin respuesta, costo de mensajes.",
        "Una mejora chica y visible para Argentina, como el alta y el cobro con datos locales (DNI, CUIT, CBU) en vez de RFC y CLABE, armada como configuración por país.",
      ],
    },
    {
      id: "60",
      title: "Días 31 a 60",
      subtitle: "Probar una cosa",
      items: [
        "Prototipo de falta en góndola en una tienda de un cliente que ya arma con Zubale (México, Chile o Brasil), fuera de las semanas críticas.",
        "Comparado contra la llamada (test y control), con el corte fijado antes de ver datos.",
        "Costo de mensajes medido de verdad.",
      ],
    },
    {
      id: "90",
      title: "Días 61 a 90",
      subtitle: "Escalar o apagar",
      items: [
        "Si funciona: más tiendas, y el faltante devuelto al stock del súper.",
        "Los estados del pedido en un formato que un agente pueda leer, para el primer súper que lo pida.",
        "Documentado y adoptado por operaciones, no sólo desplegado.",
      ],
    },
  ],
  proofs: {
    title: "Lo que ya hice y sirve acá",
    items: [
      {
        id: "bot",
        title: "Bot asesor por WhatsApp",
        text: "Menús fijos más un modelo de lenguaje, con el costo de cada respuesta medido. El mismo canal y el mismo problema de costo que Consumer Connect, en seguros y en una demo pública.",
        href: "/projects/insurance-advisor-bot",
        hrefLabel: "Ver el caso",
      },
      {
        id: "fiji",
        title: "FIJI, en Prizmstack",
        text: "Un modelo que valuaba inmobiliarias de EE.UU. en planillas de expertos, convertido en una herramienta que da siempre el mismo número: de dos días a menos de diez minutos, 120 dueños usándolo.",
        href: "/about",
        hrefLabel: "Ver recorrido",
      },
      {
        id: "pix",
        title: "Pix Brasil",
        text: "Pagos de Brasil, uno de los mercados grandes de Zubale, leídos con datos abiertos del Banco Central.",
        href: "/projects/pix-brasil",
        hrefLabel: "Leer el caso",
      },
    ],
  },
};

export const close = {
  heading: "Es una lectura de afuera.",
  body: "La quiero contrastar con lo que ven adentro: qué parte de la idea tiene sentido con lo que Zubale realmente resuelve, qué está mal y qué no se puede ver desde acá. Me gustaría seguirla en una conversación; si antes quieren marcarme algo, escribime.",
  emailLabel: "Escribime",
  siteLabel: "Ver mi trabajo publicado",
  siteHref: "/",
  sourcesLine: "Cada dato de esta página tiene su fuente.",
  sourcesToggle: "Ver las {n} fuentes públicas",
  footnote:
    "Las cifras del pedido y del caso son datos de ejemplo. La paleta se toma de la de Zubale; la página no usa su logo ni material propio.",
};

/** Fuentes únicas, para el pie. */
export function sourceList(): string[] {
  return Array.from(new Set(Object.values(sources)));
}
