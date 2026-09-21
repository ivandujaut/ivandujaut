import type { Locale } from "@/i18n/routing";

/**
 * El CV se ofrece en el idioma de la página que lo ofrece: quien lee en inglés
 * baja el inglés.
 *
 * Los nombres siguen la convención de las URLs del sitio (`localePrefix:
 * "as-needed"`): el castellano, que es el idioma por defecto, va sin sufijo, y
 * el inglés lleva `-en`. Así `/cv-ivan-dujaut.pdf`, la URL de siempre, sigue
 * funcionando para quien la tenga guardada.
 *
 * Los dos PDF se exportan de los Google Docs de Iván, que son la fuente. Si el
 * CV cambia, se vuelve a exportar desde ahí y se reemplaza el archivo; nunca se
 * edita el PDF.
 */
export const CV_PDF: Record<Locale, string> = {
  es: "/cv-ivan-dujaut.pdf",
  en: "/cv-ivan-dujaut-en.pdf",
};
