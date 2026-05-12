import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlHandler = createMiddleware(routing);

// next-intl en RSC fuerza dynamic rendering (llama `headers()` internamente),
// así que Next.js emite `Cache-Control: private, no-cache, no-store` por
// defecto. Ni `next.config.ts` headers() ni `vercel.json` headers parecen
// sobrescribirlo en esta combinación. El middleware sí puede mutar la
// respuesta final, así que declaramos el cache acá.
//
// Las páginas no contienen info user-specific (counters de views/likes los lee
// el cliente desde /api), así que servir el mismo HTML a todos los usuarios
// del mismo POP es seguro.
const SHORT_EDGE_CACHE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const LONG_EDGE_CACHE = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

// Detail pages (about + blog post + project case study) cambian muy raramente
// → cache largo. El resto (home, listados) puede recibir entradas nuevas
// → cache corto.
const LONG_CACHE_RE = /^\/(en\/)?(about|blog\/.+|projects\/.+)$/;

export default function proxy(request: NextRequest) {
  const response = intlHandler(request);

  const pathname = request.nextUrl.pathname;
  const cacheControl = LONG_CACHE_RE.test(pathname) ? LONG_EDGE_CACHE : SHORT_EDGE_CACHE;
  response.headers.set("Cache-Control", cacheControl);

  return response;
}

export const config = {
  // Match todas las rutas EXCEPTO:
  // - rutas que arranquen con /api, /trpc, /_next, /_vercel
  // - archivos estáticos (con extensión, ej: favicon.ico)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
