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
 * La decisión es dejarlos entrar a todos, y es deliberada. El objetivo de este
 * sitio no es proteger el texto, es que cuando alguien pregunte algo que un caso
 * contesta, el modelo tenga el número y sepa de dónde salió. El costo es real y
 * conviene decirlo: el texto entra a corpus de entrenamiento sin ninguna
 * garantía de atribución.
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
  "CCBot",
  "meta-externalagent",
  "Bytespider",
];

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
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
