import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Las rutas que ningún rastreador tiene que recorrer.
 *
 * `/r/`, `/li` y `/tt` son redirecciones para humanos que llegan de un posteo:
 * existen para medir de dónde viene el clic, y su destino ya está en el sitemap.
 * Google las venía rastreando y las informaba como "Página con redirección" en
 * estado de error, que es ruido sobre un sitio donde hay trece páginas sin
 * indexar y conviene ver cuáles importan de verdad.
 *
 * Vive en una constante porque se repite en cada grupo: en robots.txt, un bot
 * que encuentra un grupo con su nombre ignora por completo el grupo `*`. Si
 * este listado quedara sólo en el comodín, los agentes nombrados abajo
 * volverían a rastrear las redirecciones de medición.
 */
const FUERA_DE_ALCANCE = ["/api/", "/r/", "/li", "/tt"];

/**
 * Los rastreadores de las empresas de IA, nombrados uno por uno.
 *
 * Hasta el 2026-09-19 pasaban por el comodín `*`, así que ya tenían permiso.
 * Nombrarlos no cambia lo que pueden hacer: cambia que sea una decisión escrita
 * y no un descuido, y deja el lugar donde revocar a uno si algún día conviene.
 *
 * La decisión es dejar entrar a los que devuelven algo, y es deliberada. El
 * objetivo de este sitio no es proteger el texto, es que cuando alguien pregunte
 * algo que un caso contesta, el modelo tenga el número y sepa de dónde salió. El
 * costo es real y conviene decirlo: el texto entra a corpus de entrenamiento sin
 * ninguna garantía de atribución.
 *
 * `Google-Extended` merece mención aparte porque no es un rastreador: es la
 * señal con la que Google decide si el contenido que ya rastreó puede usarse
 * para Gemini. Sin él, el sitio queda fuera de las respuestas de Gemini aunque
 * Googlebot lo tenga indexado.
 */
const AGENTES_DE_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
];

/**
 * Los que se llevan el texto y no devuelven una cita.
 *
 * Decisión de Iván, 2026-09-19. Los dos raspan para armar corpus, no para
 * contestarle a nadie con un enlace de vuelta, así que no pagan el costo de
 * estar adentro.
 *
 * Necesitan grupo propio con `Disallow: /`. Sacarlos de la lista de arriba no
 * los bloquea: los devuelve al grupo `*`, que permite todo. Es la misma regla de
 * robots.txt que obliga a repetir los `Disallow` en cada grupo, leída al revés.
 *
 * Dos avisos honestos. Bloquear a `CCBot` deja el sitio fuera de Common Crawl,
 * que es la base de la que se sirven muchos otros; es exactamente lo que se
 * quiere acá, pero el efecto es más ancho que un solo rastreador. Y `Bytespider`
 * tiene antecedentes de ignorar robots.txt: esto es un pedido, no una reja.
 */
const AGENTES_BLOQUEADOS = ["CCBot", "Bytespider"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: FUERA_DE_ALCANCE,
      },
      {
        userAgent: AGENTES_DE_IA,
        allow: "/",
        disallow: FUERA_DE_ALCANCE,
      },
      {
        userAgent: AGENTES_BLOQUEADOS,
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
