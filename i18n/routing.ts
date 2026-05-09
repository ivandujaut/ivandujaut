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
  // En su lugar, mostramos un banner de sugerencia (manejado por
  // nuestro middleware + componente LanguageSuggestionBanner).
  localeDetection: false,
});

// Tipo helper para usar en componentes
export type Locale = (typeof routing.locales)[number];
