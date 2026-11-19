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
 * - El 19/11/2026 pasó a abrir con los tres puestos. Iván lo pidió para que un
 *   recruiter lo encuentre: la descripción es el fragmento que muestra Google y
 *   no tenía una sola palabra de rol. Van adelante y no al final porque Google
 *   corta alrededor de los 160 caracteres, y una keyword en la cola se pierde
 *   justo cuando se la trunca.
 *
 * Los tres títulos salen de contar avisos, no de intuición: en
 * `data/perfil/investigacion-titulos-2026-09-19.md`, en Argentina y a 30 días,
 * Product Manager tenía 109 avisos, Business Analyst 89 y Product Owner 49.
 * "Analista de Producto", "Product Analyst" y "Product Specialist" devolvían el
 * fallback de LinkedIn (~2.100, indistinguible de buscar un puesto inventado),
 * así que no entran aunque suenen más precisos.
 */
export const PROFILE_DESCRIPTION: Record<Locale, string> = {
  es: "Product manager, product owner o analista de negocio. Dos productos con IA generativa en producción y casos sobre salud y seguros que terminan en una decisión.",
  en: "Product manager, product owner or business analyst. Two generative AI products in production, and cases on health and insurance that end in a decision.",
};
