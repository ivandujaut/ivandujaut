import type { Locale } from "@/i18n/routing";

/**
 * La descripción del perfil. Una sola frase, idéntica en todos lados.
 *
 * Vive acá porque la repetición es deliberada y hasta el 19/11/2026 estaba
 * garantizada a mano: la misma oración copiada en siete archivos (la home, el
 * layout dos veces, /about, el `Person` de `lib/jsonld.ts`, llms.txt y
 * llms-full.txt). Repetirla palabra por palabra es lo que hace que un buscador
 * o un modelo la tome como la descripción del perfil en vez de fabricar una
 * propia, y con siete copias eso dependía de que nadie se olvidara de una.
 *
 * Qué dice y por qué, en orden de decisiones:
 *
 * - Hasta el 19/09/2026 decía "analizo mercados". Iván lo rechazó: no analiza
 *   mercados, agarra un problema, reconstruye contexto y actores, y termina en
 *   una decisión.
 * - El 14/10/2026 pasó a abrir con los dos productos con IA generativa en
 *   producción (Parcialito y el bot de seguros), que es lo que sostiene el
 *   titular "AI Product Manager" del CV.
 * - El 19/11/2026 abrió con los tres puestos nombrados ("product manager,
 *   product owner o analista de negocio"). Duró unas horas: Iván pidió que las
 *   keywords estén sin decir el puesto, para no cerrarse a los avisos que usan
 *   otro título. Ahora lleva el vocabulario de las responsabilidades, que es lo
 *   que esos avisos escriben de verdad.
 *
 * De dónde salen las palabras: de contar en cuántos de los 197 avisos de
 * producto y análisis que Iván guardó el 21/09/2026 aparece cada término
 * (`data/perfil/busqueda-2026-09-21/jobs.json`). Priorización 52%, métricas
 * 46%, roadmap 43%, IA 39%, backlog 34%, retención y adopción 49%, margen 17%,
 * caso de negocio 14%.
 *
 * Las dos frases cubren nueve de esos términos, el 43% del vocabulario
 * ponderado por frecuencia, dentro de los 160 caracteres que muestra Google.
 * Hubo una variante que llegaba al 45% y quedó afuera: ganaba dos puntos
 * escribiendo "Roadmap y backlog priorizados con métricas por segmento,
 * producto con IA, pagos integrados", que es una lista de habilidades y no una
 * oración. Dos puntos no pagan que el que lee vea un volcado de keywords.
 *
 * - El 19/11/2026, más tarde, "construyo el producto con IA" pasó a "con la IA
 *   de copiloto". Lo pidió Iván: la primera decía quién construye y hoy se lee
 *   como que construye sin pensar, que es justo lo que no quiere que se
 *   entienda. La segunda dice que la IA es la herramienta y él decide.
 *
 * Cuesta 12 caracteres y por eso se fue "del dato a la decisión", que era el
 * único lugar donde aparecía "datos" (25%). La cobertura baja de 100% a 92% de
 * los nueve términos que entran en una frase de este largo. Vale la pena igual:
 * la versión completa medía 171 caracteres y Google corta cerca de 160, así que
 * ese 100% se perdía justo en la cola que se trunca.
 *
 * Qué no entró porque no hay con qué respaldarlo: user stories, dashboards,
 * investigación de usuarios, discovery, A/B testing y go-to-market. Suman 122
 * puntos de frecuencia y ninguno tiene evidencia publicada.
 */
export const PROFILE_DESCRIPTION: Record<Locale, string> = {
  es: "Priorizo roadmap y backlog con métricas de retención y margen, y construyo el producto con herramientas de IA. Casos de negocio sobre salud y seguros.",
  en: "I prioritise roadmap and backlog with retention and margin metrics, and build the product with AI tools. Business cases on health and insurance.",
};
