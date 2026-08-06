import { unstable_cache } from "next/cache";
import { redis, keyFor } from "@/lib/redis";

export type ViewKind = "blog" | "projects";
export type ContentLocale = "es" | "en";

/**
 * Los slugs son idénticos en los dos idiomas (`/projects/pix-brasil` y
 * `/en/projects/pix-brasil`), así que sin el locale en la clave una lectura en
 * inglés incrementaba el mismo contador que una en castellano. Con eso, la
 * pregunta que decide si vale la pena escribir cada caso dos veces (¿alguien
 * lee la versión inglesa?) era imposible de contestar con estos datos.
 *
 * Las claves viejas sin locale siguen en Redis: no se borra nada, deja de
 * leerse. Los contadores nuevos arrancan de cero, separados.
 */
export const CONTENT_LOCALES: ContentLocale[] = ["es", "en"];

export function isContentLocale(value: string): value is ContentLocale {
  return (CONTENT_LOCALES as string[]).includes(value);
}

export const VIEW_KINDS: ViewKind[] = ["blog", "projects"];

export function isViewKind(value: string): value is ViewKind {
  return (VIEW_KINDS as string[]).includes(value);
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 100 && SLUG_PATTERN.test(slug);
}

export function viewsTag(kind: ViewKind, locale: ContentLocale, slug: string): string {
  return `views:${kind}:${locale}:${slug}`;
}

async function readViews(kind: ViewKind, locale: ContentLocale, slug: string): Promise<number> {
  if (!redis) return 0;
  try {
    return (await redis.get<number>(keyFor("views", kind, locale, slug))) ?? 0;
  } catch (error) {
    console.error("Failed to read views:", error);
    return 0;
  }
}

export function getCachedViews(
  kind: ViewKind,
  locale: ContentLocale,
  slug: string,
): Promise<number> {
  return unstable_cache(() => readViews(kind, locale, slug), ["views", kind, locale, slug], {
    revalidate: 60,
    tags: [viewsTag(kind, locale, slug)],
  })();
}
