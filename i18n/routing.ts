import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Idiomas soportados
  locales: ["es", "en"],

  // Idioma por default
  defaultLocale: "es",

  // Modo A: el default sin prefijo, otros con prefijo
  // / → español
  // /en → inglés
  localePrefix: "as-needed",
  // Desactivamos la detección automática de locale del browser.
  // En su lugar, mostramos un banner de sugerencia (manejado client-side
  // por `LanguageSuggestionBanner`).
  localeDetection: false,
  // Desactivamos la cookie `NEXT_LOCALE`: cada `Set-Cookie` fuerza a Vercel
  // a marcar la respuesta como `cache-control: private`, lo que rompe el
  // caching al edge. El locale ya está codificado en la URL (`/` vs `/en`),
  // así que la cookie es redundante.
  localeCookie: false,
});

// Tipo helper para usar en componentes
export type Locale = (typeof routing.locales)[number];
