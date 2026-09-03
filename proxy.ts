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
  matcher: [
    // Match todas las rutas EXCEPTO:
    // - rutas que arranquen con /api, /trpc, /_next, /_vercel
    // - /stats, que es el tablero privado y vive fuera de `[locale]`: sin esta
    //   exclusión el proxy lo reescribe a /es/stats, que no existe, y la página
    //   da 404 aun con la clave correcta
    // - /lebane, la pieza privada para una entrevista: mismo caso que /stats,
    //   vive fuera de `[locale]` y sin esta exclusión daría 404
    // - /rl, el proxy inverso de PostHog (ver los rewrites de next.config.ts):
    //   mismo problema que /stats, se reescribiría a /es/rl/... y la ingestión
    //   de eventos no llegaría nunca a destino
    // - archivos estáticos (con extensión, ej: favicon.ico)
    "/((?!api|trpc|_next|_vercel|stats|lebane|rl|.*\\..*).*)",
    // Excepción a la regla del punto: el feed es una ruta con locale
    // (`app/[locale]/rss.xml/route.ts`), no un archivo estático. Sin esta
    // entrada `/rss.xml` nunca se reescribe a `/es/rss.xml` y da 404, que es
    // justo la URL que el `<link rel="alternate">` del layout anuncia.
    "/rss.xml",
  ],
};
