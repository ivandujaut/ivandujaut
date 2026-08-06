import { unstable_cache } from "next/cache";
import { redis, keyFor } from "@/lib/redis";
import type { ContentLocale, ViewKind } from "@/lib/views";

/**
 * Lecturas completadas, contra vistas abiertas.
 *
 * Una vista cuenta a quien abre; una lectura cuenta a quien llegó al final.
 * En piezas de nueve a catorce minutos esa diferencia es la pregunta entera:
 * las vistas dicen si la distribución funcionó, `lecturas / vistas` dice si
 * funcionó el texto.
 *
 * Comparte los validadores de `lib/views.ts` (mismo `kind`, mismo slug) y vive
 * en el mismo Redis, en su propio espacio de claves.
 */
export function readsTag(kind: ViewKind, locale: ContentLocale, slug: string): string {
  return `reads:${kind}:${locale}:${slug}`;
}

async function readReads(kind: ViewKind, locale: ContentLocale, slug: string): Promise<number> {
  if (!redis) return 0;
  try {
    return (await redis.get<number>(keyFor("reads", kind, locale, slug))) ?? 0;
  } catch (error) {
    console.error("Failed to read reads:", error);
    return 0;
  }
}

export function getCachedReads(
  kind: ViewKind,
  locale: ContentLocale,
  slug: string,
): Promise<number> {
  return unstable_cache(() => readReads(kind, locale, slug), ["reads", kind, locale, slug], {
    revalidate: 60,
    tags: [readsTag(kind, locale, slug)],
  })();
}

/**
 * Lectores que después de terminar esta pieza siguieron con otra del sitio.
 *
 * Se le atribuye a la **primera** pieza de la sesión, no a la segunda: la
 * pregunta que contesta es cuál enganchó, no cuál se leyó después. Es la
 * versión conductual de "¿le gustó?", y por eso reemplaza al botón de me gusta:
 * un lector que termina dos casos dice más que un toque anónimo, no se puede
 * confundir con cortesía y no compite con escribir un mail.
 */
export function continuedTag(kind: ViewKind, locale: ContentLocale, slug: string): string {
  return `continued:${kind}:${locale}:${slug}`;
}

async function readContinued(kind: ViewKind, locale: ContentLocale, slug: string): Promise<number> {
  if (!redis) return 0;
  try {
    return (await redis.get<number>(keyFor("continued", kind, locale, slug))) ?? 0;
  } catch (error) {
    console.error("Failed to read continued:", error);
    return 0;
  }
}

export function getCachedContinued(
  kind: ViewKind,
  locale: ContentLocale,
  slug: string,
): Promise<number> {
  return unstable_cache(
    () => readContinued(kind, locale, slug),
    ["continued", kind, locale, slug],
    {
      revalidate: 60,
      tags: [continuedTag(kind, locale, slug)],
    },
  )();
}
