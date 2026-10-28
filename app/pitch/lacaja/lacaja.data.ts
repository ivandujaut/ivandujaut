/**
 * Pieza para La Caja (Portal Empresas, octubre 2026). Todo el texto y todos los
 * números de la página viven acá; cada cifra real tiene su fuente en `sources`
 * y en la investigación (`data/lacaja/`, fuera del repo). La bandeja, la flota
 * y el formulario del primer paso son datos de ejemplo y la página los rotula
 * así. El texto de "48 horas hábiles" es el que muestra el portal.
 */

export type SourceId =
  | "ssnIndicadores"
  | "ssnBalances"
  | "ssnBoletin"
  | "ssnAnexo"
  | "ssnVehiculos"
  | "portalLanding"
  | "portalTextos"
  | "zurichFaq"
  | "provinciaFaq"
  | "sanCristobalFaq"
  | "prevenet"
  | "sofse"
  | "direccionDigital"
  | "fotosIa";

export const sources: Record<SourceId, string> = {
  ssnIndicadores:
    "https://100seguro.com.ar/wp-content/uploads/2026/06/IF-2026-62674667-ESTUDIOS.pdf",
  ssnBalances: "https://datosabiertos.ssn.gob.ar/dataset/balances",
  ssnBoletin:
    "https://www.argentina.gob.ar/sites/default/files/ssn_202606_prod_trimestral_boletin.xlsx",
  ssnAnexo: "https://www.argentina.gob.ar/sites/default/files/ssn_202606_polizas_siniestros.xlsx",
  ssnVehiculos: "https://datosabiertos.ssn.gob.ar/dataset/vehiculos-expuestos-a-riesgos",
  portalLanding: "https://seguros.lacaja.com.ar/empresas-portal",
  portalTextos: "https://empresas.lacaja.com.ar/assets/i18n/es.json",
  zurichFaq: "https://www.zurich.com.ar/autogestion",
  provinciaFaq: "https://www.provinciaseguros.com.ar/preguntas-frecuentes",
  sanCristobalFaq:
    "https://www.sancristobal.com.ar/institucional/preguntas-frecuentes/consultas-generales",
  prevenet: "https://www.prevencionart.com.ar/prevenet",
  sofse:
    "https://contrataciones-publico.sofse.gob.ar/descarga_licitaciones/QWl5N09QTGFPTG1LREdpb0RoM1dSUT09",
  direccionDigital:
    "https://seguros.lacaja.com.ar/prensa/novedades/creacion-de-una-nueva-direccion-comercial",
  fotosIa:
    "https://mercado.com.ar/negocios/especial-seguros-la-transformacion-digital-en-el-corazon-del-negocio",
};

export const author = {
  name: "Iván Dujaut",
  linkedin: "https://www.linkedin.com/in/ivan-dujaut/",
  emailUserReversed: "navituajud",
  emailDomainReversed: "moc.liamg",
};

export const meta = {
  title: "La Caja: que el trámite se cierre solo",
  description:
    "Una lectura del Portal Empresas de La Caja: qué se resuelve solo, qué espera a una persona, cuánto vale la diferencia y el primer paso para probarlo.",
};

export const nav = [
  { id: "inicio", label: "Inicio" },
  { id: "puerta", label: "Lo que ya está" },
  { id: "cuenta", label: "La cuenta en plata" },
  { id: "segmentos", label: "No todo se cierra igual" },
  { id: "paso", label: "El primer paso" },
  { id: "medicion", label: "Cómo se mide" },
  { id: "pedido", label: "Lo que queda en la bandeja" },
  { id: "yo", label: "Por qué yo" },
  { id: "cierre", label: "Cierre" },
] as const;

/** Qué le pasa a cada solicitud en la propuesta. Es la gramática de color de toda la página. */
export type Treatment = "solo" | "asiste" | "pregunta";

export interface Ticket {
  id: string;
  kind: string;
  detail: string;
  treatment: Treatment;
}

/**
 * La bandeja de una flota en un mes cualquiera: datos de ejemplo. Los tipos de
 * trámite son los que el portal recibe hoy; el reparto en tratamientos es la
 * propuesta del tramo 03.
 */
export const tickets: Ticket[] = [
  {
    id: "SOL-0141",
    kind: "Alta de unidad",
    detail: "Utilitario 0 km, flota de 8",
    treatment: "solo",
  },
  {
    id: "SOL-0142",
    kind: "Nómina de vida colectivo",
    detail: "Excel con 37 altas y 21 bajas, vía broker",
    treatment: "asiste",
  },
  {
    id: "SOL-0143",
    kind: "Baja de unidad",
    detail: "Pick-up vendida, flota de 8",
    treatment: "solo",
  },
  {
    id: "SOL-0144",
    kind: "Nómina de sepelio colectivo",
    detail: "12 altas y 9 bajas",
    treatment: "pregunta",
  },
  {
    id: "SOL-0145",
    kind: "Denuncia de siniestro",
    detail: "Choque de un utilitario en ruta",
    treatment: "asiste",
  },
  {
    id: "SOL-0146",
    kind: "Endoso por correo",
    detail: "Cláusula de no repetición para una planta",
    treatment: "solo",
  },
];

export const stamp = "48 hs hábiles";

/** Cómo termina cada solicitud en la propuesta, en la tarjeta de la bandeja. */
export const treatmentStatus: Record<Treatment, string> = {
  solo: "Cerrada sola",
  asiste: "A una persona, con el caso armado",
  pregunta: "¿Conviene así?",
};

/** La misma etiqueta, corta, para la bandeja chica del tramo 06. */
export const treatmentShort: Record<Treatment, string> = {
  solo: "Cerrada sola",
  asiste: "A una persona",
  pregunta: "¿Conviene así?",
};

export const hero = {
  kicker: "Portal Empresas · una lectura de afuera",
  titleLines: ["El trámite ya entra online.", "Falta que se cierre solo."],
  lede: "Leí el Portal Empresas de La Caja como si me tocara decidir hacia dónde va: qué se resuelve solo, qué espera a una persona y cuánto vale la diferencia. Esto es lo que vi y el primer paso para el que pediría presupuesto.",
  byline: "Octubre de 2026",
  trayLabel: "La bandeja de una flota, un mes cualquiera",
  exampleBadge: "datos de ejemplo",
  cue: "Siete minutos de lectura. La bandeja te acompaña hasta el final.",
};

/** 01 · Lo que ya está. Lo que el portal resuelve solo y lo que termina en solicitud. */
export const door = {
  index: "01",
  eyebrow: "Lo que ya está",
  heading: "Ver ya es autogestión. Cambiar todavía es una solicitud.",
  intro:
    "El portal resuelve solo todo lo que es consultar y descargar. Lo que cambia algo entra online y termina en una bandeja.",
  consults: {
    label: "Se resuelve solo",
    items: [
      "Pólizas, saldos y siniestros",
      "Nómina y vehículos asegurados",
      "Certificados, Mercosur y tarjeta",
      "Endosos y facturas de ARCA",
    ],
  },
  changes: {
    label: "Termina en solicitud",
    items: [
      "Alta y baja de vehículos",
      "Nómina por Excel",
      "Denuncia de siniestro",
      "Otros endosos, por correo",
    ],
  },
  quote:
    "Verificaremos los datos y en caso de ser necesario nos comunicaremos en las próximas 48 horas hábiles.",
  quoteSource: "Texto del portal después de cada alta, baja, nómina o denuncia",
  quoteSources: ["portalTextos", "portalLanding"] as SourceId[],
  market: {
    lead: "Y eso ya es más que el resto del mercado.",
    text: "De nueve aseguradoras patrimoniales que relevé, ninguna declara que la empresa pueda dar altas o bajas por su cuenta: los cambios van al productor, al centro de atención o a un formulario con número de caso. Zurich lo dice así:",
    zurich: "¿Puedo sumar o sacar coberturas de mi póliza de manera online? No.",
    sources: ["zurichFaq", "provinciaFaq", "sanCristobalFaq"] as SourceId[],
    art: "El estándar que la persona de recursos humanos ya usa todos los meses lo pone su ART: PreveNET, de Prevención ART, declara altas y bajas de nómina, certificados y seguimiento en tiempo real.",
    artSource: "prevenet" as SourceId,
    close:
      "La Caja ya tiene la puerta que el resto ni declara. Falta que el trámite se cierre solo.",
  },
};

/** 02 · La cuenta en plata. Indicadores SSN a marzo 2026 (nueve meses) y balance en datos abiertos. */
export const money = {
  index: "02",
  eyebrow: "La cuenta en plata",
  heading: "Los siniestros le cuestan lo mismo que al mercado. La estructura le cuesta más.",
  pairs: [
    {
      id: "siniestralidad",
      label: "Siniestralidad",
      lacaja: 54.6,
      mercado: 54.6,
      note: "Igual al mercado.",
    },
    {
      id: "explotacion",
      label: "Gastos de explotación",
      lacaja: 30.3,
      mercado: 19.4,
      note: "10,9 puntos arriba.",
    },
  ],
  pairsLabels: { lacaja: "La Caja", mercado: "Mercado" },
  pairsUnit: "% de las primas",
  stats: [
    {
      value: "$9,8 mil M",
      label:
        "vale cada punto de gasto de explotación en nueve meses (1% de $978,8 mil M de primas)",
    },
    {
      value: "≈ $107 mil M",
      label:
        "es la brecha con el mercado: tres veces la pérdida técnica del período (−$35,1 mil M)",
    },
  ],
  peers: {
    title: "Gastos de explotación entre los líderes de autos",
    rows: [
      { name: "La Caja", value: 30.3, highlight: true },
      { name: "Bernardino Rivadavia", value: 24.1 },
      { name: "La Segunda", value: 22.0 },
      { name: "Mercado", value: 19.4, market: true },
      { name: "San Cristóbal", value: 17.0 },
      { name: "Sancor", value: 16.3 },
      { name: "Mercantil Andina", value: 15.8 },
      { name: "Federación Patronal", value: 10.2 },
    ],
  },
  honest:
    "El portal solo no cierra esa brecha. Pero es la vara con la que se va a juzgar cualquier inversión en autogestión: cuánto de un punto vale cada trámite que se cierra solo.",
  footnote:
    "Indicadores del mercado de la SSN a marzo de 2026 (nueve meses del ejercicio) y balance de La Caja en datos abiertos. La brecha en pesos aplica los puntos de los Indicadores a las primas del balance: es una cuenta aproximada.",
  sources: ["ssnIndicadores", "ssnBalances"] as SourceId[],
};

/** 03 · No todo se cierra igual. Tres tratamientos según lo que deja y lo que cuesta cada cuenta. */
export const segments = {
  index: "03",
  eyebrow: "No todo se cierra igual",
  heading: "Antes de automatizar, cuánto cuesta servir a cada cuenta.",
  intro:
    "Cruzaría por producto y por tamaño de cuenta lo que deja cada una contra lo que cuesta atenderla: solicitudes manuales, llamados, correcciones. Salen tres tratamientos.",
  columns: [
    {
      treatment: "solo" as Treatment,
      label: "Se cierra solo",
      when: "Trámite repetido, datos estructurados, cuenta chica o mediana.",
      fact: "La Caja asegura el 7,7% de los autos y el 9,3% de las pick-ups del país, contra el 3,2% de los camiones: es fuerte en flotas livianas.",
      sources: ["ssnVehiculos"] as SourceId[],
    },
    {
      treatment: "asiste" as Treatment,
      label: "Se asiste mejor",
      when: "Cuenta valiosa o trámite complejo: el portal le arma el caso a la persona que lo atiende.",
      fact: "En vida colectivo, La Caja es quinta del mercado (7,45%) y su prima por certificado es unas 4,5 veces el promedio.",
      sources: ["ssnBoletin", "ssnAnexo"] as SourceId[],
    },
    {
      treatment: "pregunta" as Treatment,
      label: "Se pregunta si conviene así",
      when: "Mucho movimiento y poca prima. Las salidas son automatizarlo, venderlo junto con vida o dejar de ofrecerlo suelto.",
      fact: "Sepelio colectivo es el 0,2% de su producción (323 pólizas), en el ramo donde el mercado rota el 36% de los certificados por trimestre.",
      sources: ["ssnBoletin", "ssnAnexo"] as SourceId[],
    },
  ],
  footnote:
    "La rotación es del mercado: la SSN no publica altas y bajas por compañía. Si las cuentas de La Caja se mueven distinto, el reparto cambia. La comparación de prima por certificado es de orden de magnitud: mezcla un flujo de nueve meses con un stock.",
};

/** 04 · El primer paso. El mock usa datos de ejemplo; las reglas son la propuesta. */
export const firstStep = {
  index: "04",
  eyebrow: "El primer paso",
  heading: "El alta de un vehículo en una flota liviana.",
  intro:
    "Es el trámite con plazos ya escritos por los clientes grandes y con datos estructurados: patente, chasis, factura, fotos.",
  sofse:
    "Un pliego público de flota pide cotizar una unidad nueva en 24 horas y tener su certificado en otras 24.",
  sofseSource: "sofse" as SourceId,
  mock: {
    exampleBadge: "datos de ejemplo",
    modes: { hoy: "Hoy", propuesto: "Propuesto" },
    cases: {
      nuevo: {
        label: "Utilitario 0 km",
        fields: [
          ["Flota", "8 utilitarios, cobertura terceros completo"],
          ["Unidad", "Utilitario 0 km, patente en trámite"],
          ["Documentación", "Factura de compra adjunta"],
          ["Cobertura pedida", "La misma que el resto de la flota"],
        ],
      },
      usado: {
        label: "Pick-up usada",
        fields: [
          ["Flota", "8 utilitarios, cobertura terceros completo"],
          ["Unidad", "Pick-up 2021, usada"],
          ["Documentación", "Fotos sin cargar"],
          ["Cobertura pedida", "La misma que el resto de la flota"],
        ],
      },
    },
    submit: "Enviar el alta",
    reset: "Probar de nuevo",
    hoy: {
      title: "Solicitud recibida",
      text: "Verificaremos los datos y en caso de ser necesario nos comunicaremos en las próximas 48 horas hábiles.",
      note: "Desde afuera no se ve si esta solicitud se resuelve sola o espera a alguien. Es la primera pregunta.",
    },
    rules: [
      { id: "cobertura", text: "La cobertura pedida es la que ya tiene la flota" },
      { id: "documentacion", text: "Es 0 km con factura, o usado con fotos aprobadas" },
      { id: "datos", text: "Los datos de la unidad coinciden con la documentación" },
    ],
    closed: {
      title: "Certificado emitido",
      text: "En el momento. El certificado, el Mercosur y la tarjeta quedan listos para compartir con el conductor por un enlace.",
    },
    assisted: {
      title: "Va a una persona, con el caso armado",
      text: "Falta la inspección por fotos. El cliente ya recibió el pedido para cargarlas en 72 horas, y quien lo atienda ve qué falta sin volver a preguntar.",
    },
    failedRule: "documentacion",
  },
  canTitle: "Por qué La Caja puede",
  can: [
    {
      text: "Ya revisa altas de autos con IA sobre fotos, según contó en 2024.",
      source: "fotosIa" as SourceId,
    },
    {
      text: "El portal ya pide las fotos del vehículo dentro de las 72 horas.",
      source: "portalTextos" as SourceId,
    },
    {
      text: "Creó en julio de 2026 una dirección con mandato sobre la adopción de la autogestión.",
      source: "direccionDigital" as SourceId,
    },
  ],
};

/** 05 · Cómo se mide y cuándo se corta. Sin números públicos: la línea de base se fija adentro. */
export const measure = {
  index: "05",
  eyebrow: "Cómo se mide",
  heading: "Qué miraría, por segmento, y cuándo lo cortaría.",
  metrics: [
    {
      name: "Resolución directa",
      def: "Altas cerradas sin intervención, sobre el total.",
      why: "Dice si el trámite se cierra solo de verdad.",
    },
    {
      name: "Tiempo hasta el certificado",
      def: "Mediana y el 10% más lento.",
      why: "Es lo que mide el cliente, y lo que piden los pliegos.",
    },
    {
      name: "Contactos por cuenta",
      def: "Llamados al 0810, correos y consultas al ejecutivo, por mes.",
      why: "Si el portal cierra pero el llamado llega igual, no se ahorró nada.",
    },
    {
      name: "Correcciones y siniestros en 72 horas",
      def: "De las altas automáticas, contra las manuales.",
      why: "Controla que cerrar solo no suba el riesgo.",
    },
  ],
  segmentsLine:
    "Cada una, separada en dos: pyme directa y grandes cuentas vía broker. El promedio esconde la diferencia.",
  cut: {
    title: "El corte, fijado antes de empezar",
    text: "Si las altas automáticas tienen más correcciones o más siniestros tempranos que las manuales, por encima del umbral que fije Técnica, ese segmento vuelve a solicitud.",
  },
  baseline:
    "No hay números públicos de nada de esto: la línea de base se fija el primer mes, con operaciones.",
  notDo: {
    title: "Qué no haría",
    items: [
      "Una app nueva para empresas.",
      "Un cotizador online de flotas grandes: eso es suscripción.",
      "Una API pública antes de que el alta se cierre sola.",
      "Un bot nuevo: si hace falta conversación, ya está Letizia.",
    ],
  },
};

/** 06 · Lo que queda en la bandeja. Los tres datos que sólo hay adentro. */
export const ask = {
  index: "06",
  eyebrow: "Lo que queda en la bandeja",
  heading: "Para pedir presupuesto faltan tres números. Están adentro.",
  intro: "Todo lo anterior se puede leer desde afuera. Esto no, y son mis preguntas.",
  questions: [
    "¿Cuántas solicitudes de alta entran por mes?",
    "¿Qué parte ya se cierra sin que nadie la toque?",
    "¿Cuánto cuesta una gestión asistida?",
  ],
  label: "Dato de adentro",
  formula: {
    title: "Con esos tres sale el repago del primer paso",
    text: "Altas por mes × la parte que pasaría a cerrarse sola × lo que cuesta una gestión asistida. Contra eso se mide lo que cuesta construirlo.",
  },
  risk: "Si hoy casi todas ya se cierran solas y las 48 horas son un texto prudente, el primer paso es otro. Por eso es la primera pregunta.",
};

export const proofs = {
  index: "07",
  eyebrow: "Por qué yo",
  heading: "Tres cosas que ya hice y que este primer paso necesita",
  items: [
    {
      id: "canal",
      title: "El alta no es la venta",
      number: "12,76%",
      line: "Leí el canal digital de La Caja con datos de la SSN: en automotores se anula el 12,76% del stock por trimestre. Propuse medirlo por la prima que sigue viva a los seis meses, dividida por lo que costó traerla.",
      proves: "Mido un canal por la prima que deja.",
      href: "/projects/canal-digital-seguros",
      hrefLabel: "Leer el caso",
    },
    {
      id: "bot",
      title: "Bot asesor de seguros",
      number: "64%",
      line: "De las dudas conocidas se resuelve sin llamar al modelo de lenguaje, con 97% de acierto. El umbral lo elegí con datos: una respuesta enlatada equivocada es peor que gastar una llamada.",
      proves: "Sé resolver lo repetido con lo barato y derivar el resto con un control de calidad.",
      href: "/projects/insurance-advisor-bot",
      hrefLabel: "Ver el caso",
    },
    {
      id: "fiji",
      title: "FIJI",
      number: "2 días → 10 min",
      line: "La valuación de una inmobiliaria en Estados Unidos vivía en planillas de expertos y tardaba dos días. La reconstruí con ellos como un motor con tests: hoy sale en menos de diez minutos y la usan 120 dueños.",
      proves: "Sé convertir el criterio de un experto en reglas que se cumplen solas.",
      href: "/about",
      hrefLabel: "Ver mi recorrido",
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
    "La bandeja, la flota y el formulario son datos de ejemplo. Los colores son los de la paleta pública de La Caja; la página no usa su logo ni material oficial, y no tengo relación con la compañía.",
};

/** Fuentes únicas en orden de aparición, para el pie. */
export function sourceList(): string[] {
  return Array.from(new Set(Object.values(sources)));
}
