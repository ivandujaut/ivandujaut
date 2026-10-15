/**
 * Pieza para Zubale (Product Engineer, octubre 2026). Todo el texto y todos
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
  | "zubaleAbout"
  | "flexifleet"
  | "fos"
  | "consumerConnect"
  | "unidrogas"
  | "api"
  | "status"
  | "bamboo59"
  | "bamboo60"
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
  | "ifood"
  | "cloudflare"
  | "muse"
  | "dots"
  | "walmartChatgpt"
  | "openaiShift"
  | "inventory"
  | "ucp"
  | "forter"
  | "modo"
  | "oos";

export const sources: Record<SourceId, string> = {
  zubaleHome: "https://www.zubale.com/",
  zubaleAbout: "https://www.zubale.com/about-zubale/",
  flexifleet: "https://www.zubale.com/solutions/flexifleet/",
  fos: "https://www.zubale.com/solutions/fulfillment-optimizer-software/",
  consumerConnect: "https://www.zubale.com/solutions/consumer-connect-software/",
  unidrogas: "https://www.zubale.com/mx/caso-de-exito-unidrogas/",
  api: "https://developers.zubale.com/",
  status: "https://status.zubale.com",
  bamboo59: "https://zubale.bamboohr.com/careers/59",
  bamboo60: "https://zubale.bamboohr.com/careers/60",
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
  ifood: "https://institucional.ifood.com.br/inovacao/compr-ai-compra-de-mercado-pelo-whatsapp/",
  cloudflare:
    "https://www.techtimes.com/articles/317877/20260605/bot-traffic-passes-humans-online-cloudflare-says-agentic-ai-drove-575-share.htm",
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
};

export const author = {
  name: "Iván Dujaut",
  linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
  emailUserReversed: "navituajud",
  emailDomainReversed: "moc.liamg",
};

export const meta = {
  title: "Zubale: la góndola tiene la última palabra",
  description:
    "Cómo funciona Zubale hoy, leída desde afuera, y una idea para contrastar sobre los agentes que van a hacer el súper.",
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
  { id: "puesto", label: "Desde el puesto" },
  { id: "cierre", label: "Cierre" },
] as const;

/** Rótulos de las dos lecturas que recorren la página. */
export const readers = {
  person: "Lo que ve una persona",
  agent: "Lo que lee un agente",
};

export const hero = {
  kicker: "Zubale, leída desde afuera",
  title: "Los agentes van a hacer el súper.",
  titleAccent: "Van a elegir al que no les mienta sobre la góndola.",
  lede: "Esta página tiene dos partes. La primera explica cómo funciona Zubale hoy: qué resuelve, cómo arma un pedido, con qué sistemas y qué desafíos se ven desde afuera. La segunda es una idea para contrastar, con dos preguntas que me gustaría hacerles.",
  byline: "Octubre de 2026",
  cue: "Doce minutos de lectura. A lo largo de la página, el mismo pedido se lee dos veces: como lo ve una persona y como lo lee un agente.",
  preview: {
    person: [
      "Pedido de 6 productos",
      "Lo arma Lucía en la sucursal",
      "Llega entre las 18 y las 20",
    ],
    agent: ['"items": 6', '"status": "TASK_ASSIGNED"', '"window": "18:00/20:00"'],
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
        "deja una canasta online de USD 100 si el súper la arma y la entrega, contra +USD 4 en la tienda (estimación de McKinsey, 2022)",
      source: "mckinsey" as SourceId,
      sourceLabel: "McKinsey",
    },
    {
      value: "45%",
      label:
        "de los reclamos de entrega en México son por pedidos incompletos, antes que dañados o tarde",
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
    text: "La siguiente etapa del ecommerce en los supermercados ya no será solamente una competencia por tener la mejor aplicación, sino por determinar quién puede procesar y entregar cada pedido al menor costo posible.",
    author: "Julián Fernández, Mar Capital, en Expansión",
    source: "expansionTiendas" as SourceId,
  },
  answer: {
    lead: "La respuesta de Zubale.",
    text: "Convertir ese costo fijo en variable: una red de freelancers, los Zubaleros, que arman y entregan los pedidos desde la tienda del súper, con software que asigna, controla y avisa.",
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
      text: "Asignación automática con ruteo, app de armado, una torre de control con métricas en vivo y un modelo que agrupa pedidos por franja. Es el software que usa FlexiFleet, ofrecido también por separado.",
      source: "fos" as SourceId,
    },
    {
      id: "cc",
      name: "Consumer Connect",
      role: "El canal",
      text: "Venta y seguimiento por WhatsApp con IA: catálogo, pago, avisos de estado, chat con el repartidor sin exponer datos y un PIN de entrega.",
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
      { year: "2021", text: "Marketplace de trabajo: picking y entrega para supermercados" },
      { year: "2023", text: "Ecosistema de tres productos; última ronda, USD 25 M" },
      { year: "2026", text: "Siete países, con Argentina desde cero" },
    ],
    source: "techcrunch2023" as SourceId,
  },
  facts: [
    {
      value: "USD 73 M",
      label: "de capital levantado, todo equity",
      source: "techcrunch2023" as SourceId,
    },
    { value: "7", label: "países: MX, BR, CL, CO, PE, CR y AR", source: "zubaleHome" as SourceId },
    {
      value: "+100 M",
      label: "de pedidos completados, según sus avisos",
      source: "bamboo60" as SourceId,
    },
  ],
  clients:
    "Clientes que nombra: Walmart, Cencosud, Chedraui, Colsubsidio y Unidrogas, entre otros. Supermercados grandes, sobre todo.",
  clientsSource: "zubaleHome" as SourceId,
};

/** 03 · El pedido de punta a punta (el corazón de la primera parte) */
export const order = {
  index: "03",
  eyebrow: "El pedido de punta a punta",
  heading: "Un pedido, siete pasos, dos lecturas.",
  intro:
    "A la izquierda, lo que pasa en el mundo. A la derecha, los estados que la API de Zubale le avisa al súper. Son los nombres reales de su documentación.",
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
      agent: ["Order Handler · Marketplace", "TASK_ASSIGNED"],
    },
    {
      id: "arma",
      person: "El Zubalero recorre la góndola con la app y escanea cada producto.",
      agent: ["PICKING_STARTED", "PRODUCT_SCANNED"],
    },
    {
      id: "falta",
      person: "Si algo falta, llama por teléfono al cliente para acordar un reemplazo.",
      agent: ["CALLED_CUSTOMER"],
      highlight: true,
    },
    {
      id: "caja",
      person: "Pasa por caja, empaca y sale, o se lo da a un repartidor.",
      agent: ["AT_CASHIER", "PICKED_OUT"],
    },
    {
      id: "entrega",
      person:
        "Lo entrega con un PIN y una prueba de entrega. El cliente recibe avisos por WhatsApp en cada paso.",
      agent: ["ENROUTE_TO_DROPOFF", "AT_DROPOFF", "DELIVERED"],
    },
    {
      id: "cobra",
      person: "La entrega se califica y el Zubalero cobra.",
      agent: ["Orders Submissions Grading", "Users Payouts"],
    },
  ],
  footnote:
    "Estados de la API v3 y componentes de la página de estado de Zubale. El paso 4 es el que retoma la segunda parte.",
  sources: ["api", "status"] as SourceId[],
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
          text: "Prueba de vida y documento antes de la primera tarea. Según el proveedor, el fraude bajó 90% y la verificación tarda 32 segundos.",
          source: "sumsub" as SourceId,
        },
        {
          lead: "Turnos y asignación.",
          text: "Reserva de turnos con días de anticipación y asignación según los requisitos de cada operación.",
          source: "flexifleet" as SourceId,
        },
        {
          lead: "Cumplimiento distinto en cada país.",
          text: "En México, alta en el seguro social antes de tomar tareas y una retención de 2,775% por tarea, por la reforma de plataformas.",
          source: "zubaleroMx" as SourceId,
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
          source: "api" as SourceId,
        },
        {
          lead: "Reglas en la tienda.",
          text: "El contrato pide al súper baños, agua y lugar para comer, y un punto focal que resuelve dudas pero no da órdenes: la conducta la gestiona Zubale.",
          source: "anexo" as SourceId,
        },
        {
          lead: "El cliente final, por WhatsApp.",
          text: "Seis avisos de estado del pedido. En su caso con Unidrogas (más de 700 droguerías en Colombia), Zubale dice que el canal creció 6 veces en cinco semanas.",
          source: "unidrogas" as SourceId,
        },
      ],
    },
  ],
};

/** 05 · Con qué lo hacen */
export const systems = {
  index: "05",
  eyebrow: "Con qué lo hacen",
  heading: "Un núcleo de eventos que viene de 2020 y una capa nueva con IA.",
  intro:
    "Armado con los nombres que aparecen en su página de estado, su API, su GitHub y sus avisos. El orden es el del pedido.",
  lanes: [
    { name: "Entrada", items: ["Orc (integraciones)", "Quest", "API v3"] },
    { name: "Asignación", items: ["Allocator", "Order Handler", "Zoe (manual)", "Marketplace"] },
    { name: "En la tienda", items: ["App del Zubalero", "Reservas de turnos", "Geolocalización"] },
    { name: "Después", items: ["Calificación de entregas", "Pagos (dLocal, Bitso)", "Soporte"] },
    {
      name: "Cliente final",
      items: ["Consumer Connect", "WhatsApp", "LLM (OpenAI, según un incidente)"],
    },
  ],
  base: [
    {
      label: "Núcleo",
      text: "Elixir y Java, con Kafka y event sourcing (Commanded)",
      source: "githubOss" as SourceId,
    },
    {
      label: "Lo nuevo",
      text: "TypeScript y Python, NestJS, FastAPI, React y React Native",
      source: "jobPost" as SourceId,
    },
    {
      label: "Infraestructura",
      text: "Google Cloud, Kubernetes, Redis, Grafana",
      source: "status" as SourceId,
    },
    {
      label: "IA interna",
      text: "ZARM: modelos aprobados (Gemini), agentes y n8n, con más de 750.000 ejecuciones por mes",
      source: "toggle" as SourceId,
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
      seen: "Las reseñas nuevas de la app de Zubaleros en Google Play bajaron de 4,1 estrellas en 2022 a 2,0 en 2026. Las quejas son por fallas de la app, soporte y altas trabadas, casi nunca por la tarifa.",
      ask: "¿Qué parte del embudo de alta y soporte está en el roadmap?",
      source: "playStore" as SourceId,
      note: "cálculo propio sobre 5.415 reseñas",
    },
    {
      id: "eventos",
      seen: "En 2025 la página de estado registró cinco incidentes graves con la misma forma: un evento corrupto frena una cola y se resuelve reiniciando la base. Desde agosto de 2025 no hay incidentes publicados.",
      ask: "¿Cómo se resolvió? ¿Hoy hay cola de descarte e idempotencia?",
      source: "status" as SourceId,
    },
    {
      id: "whatsapp",
      seen: "Desde el 1 de octubre, WhatsApp cobra cada respuesta de una empresa. En Argentina, USD 0,026 por mensaje; en Colombia, USD 0,0008.",
      ask: "¿Cómo cambió la cuenta de Consumer Connect, y quién paga esos mensajes?",
      source: "waPricing" as SourceId,
    },
    {
      id: "competencia",
      seen: "Instacart compró Instaleap, el rival de software en la región; iFood vende súper por WhatsApp con IA desde 2023; Meta vende su propio agente para empresas.",
      ask: "¿Dónde compite Zubale y dónde no quiere competir?",
      source: "instaleap" as SourceId,
    },
    {
      id: "argentina",
      seen: "Argentina arranca de cero: el portal de Zubaleros todavía pide documentos mexicanos y no hay un cliente local con nombre.",
      ask: "¿Cuál es el primer cliente ancla y qué necesita para el primer pedido?",
      source: "zubaleHome" as SourceId,
    },
  ],
};

/** 07 · Lo que viene: el comprador nuevo */
export const next = {
  index: "07",
  eyebrow: "Lo que viene",
  heading: "Aparece un comprador nuevo, y no mira la góndola.",
  steps: [
    {
      id: "muse",
      text: "En septiembre Meta lanzó Muse, un agente que compra, negocia y gestiona devoluciones por la persona, y que se usa desde WhatsApp. OpenAI respondió con Dots a fin de mes.",
      sources: ["muse", "dots"] as SourceId[],
    },
    {
      id: "trafico",
      text: "En junio, por primera vez, la mayoría de las visitas a la web fueron de máquinas: 57,5% según Cloudflare.",
      sources: ["cloudflare"] as SourceId[],
    },
    {
      id: "walmart",
      text: "La primera lección vino de Walmart: dentro de ChatGPT vendió un tercio que en su sitio. El chat rompía la canasta y mostraba datos de entrega viejos. OpenAI cerró esa compra en marzo.",
      sources: ["walmartChatgpt", "openaiShift"] as SourceId[],
    },
    {
      id: "stock",
      text: "Y en el súper el dato es peor: en un estudio con un millón de productos, cerca de 60% tenía el stock del sistema distinto al de la góndola.",
      sources: ["inventory"] as SourceId[],
    },
  ],
  scene: {
    person: { label: "En la góndola", item: "Queso cremoso 400 g", state: "No hay" },
    agent: { label: "En el catálogo", lines: ['"sku": "QC400"', '"available": true'] },
  },
  latam: {
    lead: "En la región ya empezó.",
    text: "En Argentina, MODO hizo la primera compra dentro de ChatGPT con Frávega, como aprendizaje. En México, Walmart lanzó Sparky, su agente de compras, en septiembre.",
    sources: ["modo", "expansionSparky"] as SourceId[],
  },
};

export const partTwo = {
  label: "Segunda parte",
  title: "Una idea para contrastar",
  note: "Esto es una hipótesis, no un diagnóstico. La armé desde afuera y la quiero ir ajustando con lo que Zubale ve adentro.",
};

/** 08 · La tesis (frase grande que se enciende palabra por palabra) */
export const thesis = {
  index: "08",
  eyebrow: "La idea",
  lines: ["El agente decide dónde comprar.", "La góndola decide si el pedido llega completo."],
  reasons: [
    {
      id: "dato",
      title: "El dato que importa es el menos confiable",
      text: "Está o no está, qué lo reemplaza, cuándo llega. Es lo que un agente necesita y lo que el sistema del súper tiene peor cargado.",
    },
    {
      id: "persona",
      title: "Zubale tiene a la persona que lo ve",
      text: "Gente en la tienda, una app que reporta cada paso y el WhatsApp del cliente, en la marca del súper. Ningún competidor junta las tres.",
    },
    {
      id: "momento",
      title: "El faltante es el momento",
      text: "Es el único punto del pedido donde todavía hace falta una decisión del comprador. Hoy se resuelve con una llamada.",
    },
  ],
};

/** 09 · El caso: falta en góndola (mock interactivo) */
export const caseStudy = {
  index: "09",
  eyebrow: "Un primer paso",
  heading: "Falta en góndola: el reemplazo se decide en el chat, no por teléfono.",
  intro:
    "Tocá el mock. El Zubalero marca un faltante y el cliente decide con un toque. Si compró un agente, contesta el agente, según las preferencias que ya conoce.",
  exampleBadge: "datos de ejemplo",
  mock: {
    store: "Sucursal Vicente López",
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
      'Preferencia guardada: "lácteos: aceptar otra marca si el precio sube menos de 15%"',
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
      today: "Hoy: una llamada, que a veces nadie atiende.",
      labels: {
        time: "Tiempo para decidir",
        messages: "Mensajes cobrados",
        cost: "Costo de mensajería en Argentina",
        perfect: "Pedido perfecto",
      },
    },
    rejected:
      "Se saca del pedido y se ajusta el cobro. El pedido llega incompleto, pero sin sorpresas.",
  },
  why: {
    title: "Por qué este primero",
    items: [
      "Ataca el reclamo número uno del comprador: el pedido incompleto.",
      "Los datos ya existen: el estado de faltante y el WhatsApp del cliente están en Zubale.",
      "Une los dos productos, FlexiFleet y Consumer Connect, en un solo momento.",
      "Sirve hoy con personas y deja lista la puerta para los agentes.",
    ],
  },
  metrics: {
    title: "Cómo lo mediría",
    north:
      "Tasa de pedido perfecto: completo o con un reemplazo aprobado, en la franja y sin reclamo.",
    guards:
      "Sin dejar subir el tiempo de armado, el costo por pedido (con los mensajes) ni los reembolsos.",
    cut: "Lo medimos hasta acá: si el tiempo de armado sube más de lo que baja el pedido incompleto, se apaga.",
  },
  notToBuild: {
    title: "Qué no construiría",
    items: [
      "Un agente conversacional genérico que compita con el de Meta o con iFood.",
      "Un checkout propio para agentes.",
      "Reemplazos automáticos en carne, farmacia o mascotas, donde la gente no acepta cambios.",
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
      why: "Cada mensaje de WhatsApp ya se cobra, cada respuesta de un modelo consume tokens y cada agente que raspa un sitio es más lento y más caro que uno que usa una interfaz estructurada (unas 10 veces, según Forter).",
      whySources: ["waPricing", "forter"] as SourceId[],
      look: [
        "Medir el costo por pedido perfecto, no por mensaje: un mensaje caro que evita un reembolso es barato.",
        "Responder primero con reglas y datos, y llamar al modelo sólo cuando hace falta. En mi bot de seguros, 64% de las dudas conocidas se resuelven sin generar texto.",
        "Darle al agente una interfaz estructurada en vez de una conversación: menos mensajes, menos tokens, menos errores.",
        "Entrar por la puerta gratis: los chats que nacen de un anuncio de WhatsApp tienen 72 horas sin cargo.",
      ],
      inside: "¿Cuántos mensajes y cuánto cuesta hoy, en promedio, un pedido por Consumer Connect?",
    },
    {
      id: "stock",
      question:
        "¿Cómo conectamos el stock que se mide en la góndola con lo que un agente sabe en tiempo real: stock, precio, franja?",
      why: "El protocolo de Google para agentes (UCP) describe la disponibilidad como un sí o un no por producto, y cerca de 60% de los productos tiene el stock del sistema mal cargado. Corregirlo subió las ventas entre 4% y 8% en ese estudio.",
      whySources: ["ucp", "inventory"] as SourceId[],
      look: [
        "Cada faltante que marca un Zubalero es un dato de stock real: devolverlo al catálogo del súper en minutos, no al día siguiente.",
        "Publicar el dato con su frescura: no sólo si hay, sino cuándo se vio y quién lo vio.",
        "Exponer los estados del pedido como los espera un agente: son los mismos que Zubale ya reporta.",
        "El precio es del súper: Zubale no lo define, pero puede avisar cuando lo que cobró la caja no coincide con lo publicado.",
      ],
      inside: "¿Qué pasa hoy con el faltante que marca el Zubalero? ¿Vuelve al stock del súper?",
    },
  ],
};

/** 11 · Cómo lo haría desde el puesto */
export const plan = {
  index: "11",
  eyebrow: "Desde el puesto",
  heading: "Cómo lo haría como Product Engineer.",
  north: {
    label: "La métrica que propondría mirar primero",
    value: "Tasa de pedido perfecto",
    text: "Es lo que el súper le vende a su cliente, lo que el cliente reclama cuando falla y lo que un agente va a usar para elegir dónde comprar.",
  },
  phases: [
    {
      id: "30",
      title: "Días 1 a 30",
      subtitle: "Entender y medir",
      items: [
        "Armar pedidos yo en una tienda y acompañar a operaciones en Vicente López.",
        "Recorrer el pedido en el código, de la integración al pago.",
        "Línea de base: faltantes, tiempo para decidir, llamadas sin respuesta, costo de mensajes.",
        "Una mejora chica y visible para Argentina, como el alta con documentos locales.",
      ],
    },
    {
      id: "60",
      title: "Días 31 a 60",
      subtitle: "Probar una cosa",
      items: [
        "Prototipo de falta en góndola en una tienda y un súper.",
        "Comparado contra la llamada, con el corte fijado antes de ver datos.",
        "Costo de mensajes medido de verdad.",
      ],
    },
    {
      id: "90",
      title: "Días 61 a 90",
      subtitle: "Escalar o apagar",
      items: [
        "Si funciona: más tiendas, y el faltante devuelto al stock del súper.",
        "Los estados del pedido en un formato que un agente pueda leer.",
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
        text: "Menús fijos más un modelo de lenguaje, con el costo de cada respuesta medido. Es Consumer Connect a escala chica.",
        href: "/projects/insurance-advisor-bot",
        hrefLabel: "Ver el caso",
      },
      {
        id: "fiji",
        title: "FIJI",
        text: "Un modelo que vivía en planillas de expertos, convertido en un motor con tests: de dos días a menos de diez minutos, 120 dueños usándolo.",
        href: "/about",
        hrefLabel: "Ver recorrido",
      },
      {
        id: "pix",
        title: "Pix Brasil",
        text: "Pagos del segundo mercado de Zubale, leídos con datos abiertos del Banco Central.",
        href: "/projects/pix-brasil",
        hrefLabel: "Leer el caso",
      },
    ],
  },
};

export const close = {
  heading: "Es una lectura de afuera.",
  body: "Me gustaría contrastarla con lo que ven adentro: qué parte de la idea tiene sentido con lo que Zubale realmente resuelve, qué está mal y qué no se puede ver desde acá.",
  emailLabel: "Escribime",
  siteLabel: "Ver mi trabajo publicado",
  siteHref: "/",
  sourcesLine: "Cada dato de esta página tiene su fuente.",
  sourcesToggle: "Ver las {n} fuentes públicas",
  footnote:
    "Las cifras del pedido y del caso son datos de ejemplo. Página sin marca ni material de Zubale.",
};

/** Fuentes únicas, para el pie. */
export function sourceList(): string[] {
  return Array.from(new Set(Object.values(sources)));
}
