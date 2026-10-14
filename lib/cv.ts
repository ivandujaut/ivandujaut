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
 * `filename` es el nombre con el que se guarda al bajarlo desde `/cv`: el mismo
 * que tienen los PDF exportados de los Google Docs de Iván, que son la fuente.
 * Si el CV cambia, se vuelve a exportar desde ahí y se reemplaza el archivo;
 * nunca se edita el PDF.
 */
export const CV_PDF: Record<Locale, { href: string; filename: string }> = {
  es: { href: "/cv-ivan-dujaut.pdf", filename: "CV_ivan_dujaut_ES.pdf" },
  en: { href: "/cv-ivan-dujaut-en.pdf", filename: "CV_ivan_dujaut.pdf" },
};

/**
 * Los botones del CV no bajan el PDF: abren `/cv` en una pestaña nueva, donde
 * se ve antes de bajarlo. Quien evalúa un perfil quiere mirarlo antes de
 * guardarlo, y una descarga directa en el teléfono termina en la carpeta de
 * descargas sin que se vea nada.
 */
export const CV_PAGE = "/cv";
