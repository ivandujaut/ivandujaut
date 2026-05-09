import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Middleware base de next-intl (maneja routing por locale)
const intlMiddleware = createMiddleware(routing);

// Nombres de las cookies que vamos a usar
const PREFERENCE_COOKIE = "language-preference";
const SUGGESTION_COOKIE = "language-suggestion";

/**
 * Parsea el header Accept-Language del browser y devuelve el primer
 * locale soportado que el usuario prefiera.
 *
 * Ejemplo: "en-US,en;q=0.9,es;q=0.8" con locales ["es", "en"]
 *   → "en" (porque "en" es el primero en preferencia que soportamos)
 */
function detectBrowserLocale(acceptLanguage: string | null): "es" | "en" | null {
  if (!acceptLanguage) return null;

  // Parsear el header: separar por coma, extraer códigos de idioma
  const browserLocales = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase().split("-")[0]);

  // Buscar el primero que soportamos
  for (const lang of browserLocales) {
    if (routing.locales.includes(lang as "es" | "en")) {
      return lang as "es" | "en";
    }
  }

  return null;
}

/**
 * Determina el locale actual basándose en la URL.
 *
 * Como usamos modo "as-needed":
 *   "/" → "es" (default sin prefijo)
 *   "/en/algo" → "en"
 *   "/blog/post" → "es" (default sin prefijo)
 */
function getCurrentLocale(pathname: string): "es" | "en" {
  if (pathname.startsWith("/en/") || pathname === "/en") {
    return "en";
  }
  return "es";
}

export default function middleware(request: NextRequest) {
  // 1. Dejar que next-intl maneje el routing primero
  const response = intlMiddleware(request);

  // 2. Si el usuario ya tiene una preferencia guardada, no hacemos nada extra
  const userPreference = request.cookies.get(PREFERENCE_COOKIE)?.value;
  if (userPreference) {
    return response;
  }

  // 3. Detectar idioma del browser
  const acceptLanguage = request.headers.get("accept-language");
  const browserLocale = detectBrowserLocale(acceptLanguage);

  // 4. Determinar locale actual de la URL
  const currentLocale = getCurrentLocale(request.nextUrl.pathname);

  // 5. Si el browser prefiere otro idioma que el actual, setear cookie de sugerencia
  if (browserLocale && browserLocale !== currentLocale) {
    response.cookies.set(SUGGESTION_COOKIE, browserLocale, {
      maxAge: 60 * 60 * 24, // 1 día (se reevalúa cada día)
      sameSite: "lax",
      httpOnly: false, // necesario para que el cliente pueda leerla
    });
  } else {
    // Si no hay sugerencia que hacer, limpiar la cookie por si existía
    response.cookies.delete(SUGGESTION_COOKIE);
  }

  return response;
}

export const config = {
  // Match todas las rutas EXCEPTO:
  // - rutas que arranquen con /api, /trpc, /_next, /_vercel
  // - archivos estáticos (con extensión, ej: favicon.ico)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
