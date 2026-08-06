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
