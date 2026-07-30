import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type Locale = "es" | "en";

export function localePath(locale: Locale, pathWithoutLocale: string): string {
  const clean = pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`;
  if (locale === "en") {
    return clean === "/" ? "/en" : `/en${clean}`;
  }
  return clean;
}

/**
 * Descubrimiento del feed RSS para lectores y crawlers.
 *
 * Va acá y no solo en el layout de `[locale]` porque Next reemplaza el objeto
 * `alternates` entero cuando una página define el suyo: no lo mergea campo por
 * campo. Como las 8 páginas del sitio definen `alternates` (canonical +
 * hreflang), el `types` del layout se perdía en todas y el
 * `<link rel="alternate" type="application/rss+xml">` no llegaba nunca al
 * `<head>`. Incluyéndolo en los dos builders, cualquier página que los use lo
 * hereda sin tener que acordarse.
 */
function feedTypes(locale: Locale): NonNullable<Metadata["alternates"]>["types"] {
  return {
    "application/rss+xml": `${SITE_URL}${localePath(locale, "/rss.xml")}`,
  };
}

export function buildStaticAlternates(
  locale: Locale,
  pathWithoutLocale: string,
): NonNullable<Metadata["alternates"]> {
  const esPath = localePath("es", pathWithoutLocale);
  const enPath = localePath("en", pathWithoutLocale);
  return {
    canonical: locale === "en" ? enPath : esPath,
    languages: {
      es: esPath,
      en: enPath,
      "x-default": esPath,
    },
    types: feedTypes(locale),
  };
}

type ContentItem = { locale: Locale; slug: string };

export function buildContentAlternates({
  current,
  translations,
  basePath,
}: {
  current: ContentItem;
  translations: ContentItem[];
  basePath: "/blog" | "/projects" | "/research";
}): NonNullable<Metadata["alternates"]> {
  const byLocale = new Map<Locale, string>();
  for (const item of [current, ...translations]) {
    byLocale.set(item.locale, localePath(item.locale, `${basePath}/${item.slug}`));
  }
  const languages: Record<string, string> = {};
  const es = byLocale.get("es");
  const en = byLocale.get("en");
  if (es) languages.es = es;
  if (en) languages.en = en;
  languages["x-default"] = es ?? en ?? localePath(current.locale, `${basePath}/${current.slug}`);

  return {
    canonical: localePath(current.locale, `${basePath}/${current.slug}`),
    languages,
    types: feedTypes(current.locale),
  };
}
