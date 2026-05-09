import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match todas las rutas EXCEPTO:
  // - rutas que arranquen con /api, /trpc, /_next, /_vercel
  // - archivos estáticos (con extensión, ej: favicon.ico)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
