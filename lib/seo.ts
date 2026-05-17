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
  };
}
