import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Handler base de next-intl (maneja routing por locale).
// next-intl sigue exportando este factory como `createMiddleware`,
// aunque a partir de Next.js 16 la convención del archivo sea `proxy.ts`.
//
// La detección de idioma del browser y la sugerencia se manejan client-side
// en `LanguageSuggestionBanner` para que las respuestas HTML no lleven
// `Set-Cookie` y puedan cachearse en el edge de Vercel.
//
// Nota sobre edge caching: con `localePrefix: "as-needed"` el middleware
// reescribe `/blog/foo` → `/es/blog/foo`, y next-intl en RSC fuerza dynamic
// rendering. En esta combinación Next.js emite `Cache-Control: private,
// no-cache, no-store` que prevalece sobre headers de `next.config.ts`,
// `vercel.json` y middleware. Si en algún momento esto resulta bloqueante
// para Core Web Vitals, la salida es pasar a `localePrefix: "always"`.
export default createMiddleware(routing);

export const config = {
  // Match todas las rutas EXCEPTO:
  // - rutas que arranquen con /api, /trpc, /_next, /_vercel
  // - archivos estáticos (con extensión, ej: favicon.ico)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
