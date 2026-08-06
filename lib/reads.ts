import { unstable_cache } from "next/cache";
import { redis, keyFor } from "@/lib/redis";
import type { ViewKind } from "@/lib/views";

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
export function readsTag(kind: ViewKind, slug: string): string {
  return `reads:${kind}:${slug}`;
}

async function readReads(kind: ViewKind, slug: string): Promise<number> {
  if (!redis) return 0;
  try {
    return (await redis.get<number>(keyFor("reads", kind, slug))) ?? 0;
  } catch (error) {
    console.error("Failed to read reads:", error);
    return 0;
  }
}

export function getCachedReads(kind: ViewKind, slug: string): Promise<number> {
  return unstable_cache(() => readReads(kind, slug), ["reads", kind, slug], {
    revalidate: 60,
    tags: [readsTag(kind, slug)],
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
export function continuedTag(kind: ViewKind, slug: string): string {
  return `continued:${kind}:${slug}`;
}

async function readContinued(kind: ViewKind, slug: string): Promise<number> {
  if (!redis) return 0;
  try {
    return (await redis.get<number>(keyFor("continued", kind, slug))) ?? 0;
  } catch (error) {
    console.error("Failed to read continued:", error);
    return 0;
  }
}

export function getCachedContinued(kind: ViewKind, slug: string): Promise<number> {
  return unstable_cache(() => readContinued(kind, slug), ["continued", kind, slug], {
    revalidate: 60,
    tags: [continuedTag(kind, slug)],
  })();
}
