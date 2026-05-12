import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Handler base de next-intl (maneja routing por locale).
// next-intl sigue exportando este factory como `createMiddleware`,
// aunque a partir de Next.js 16 la convención del archivo sea `proxy.ts`.
//
// La detección de idioma del browser y la sugerencia se manejan client-side
// en `LanguageSuggestionBanner` para que las respuestas HTML no lleven
// `Set-Cookie` y puedan cachearse en el edge de Vercel.
export default createMiddleware(routing);

export const config = {
  // Match todas las rutas EXCEPTO:
  // - rutas que arranquen con /api, /trpc, /_next, /_vercel
  // - archivos estáticos (con extensión, ej: favicon.ico)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
