import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { redis, keyFor } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";
import { isValidSlug, isViewKind } from "@/lib/views";
import { readsTag } from "@/lib/reads";
import { check, viewsRatelimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ kind: string; slug: string }>;
}

// Misma ventana que las vistas: una lectura de la misma IP sobre la misma
// pieza no vuelve a contar en 24 horas. Sin esto, releer un caso o volver
// desde el índice inflaría el read-through, que es justo la métrica que
// queremos poder creer.
const SEEN_TTL_SECONDS = 60 * 60 * 24;

export async function POST(request: Request, context: RouteContext) {
  const { kind, slug } = await context.params;

  if (!isViewKind(kind) || !isValidSlug(slug)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  if (!redis) {
    return NextResponse.json({ ok: true });
  }

  try {
    const ipHash = hashIp(getIpFromRequest(request));

    // Comparte el bucket de vistas a propósito: son dos pings del mismo lector
    // sobre la misma pieza, y separarlos duplicaría el presupuesto por IP.
    const rl = await check(viewsRatelimit, ipHash);
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000))),
          },
        },
      );
    }

    const seenKey = keyFor("reads", "seen", kind, slug, ipHash);
    const isFirstSeen = await redis.set(seenKey, 1, { nx: true, ex: SEEN_TTL_SECONDS });

    if (isFirstSeen) {
      await redis.incr(keyFor("reads", kind, slug));
      revalidateTag(readsTag(kind, slug), "max");
    }

    // La respuesta no devuelve el número: nadie lo muestra, y no tiene sentido
    // exponer el conteo en un endpoint público.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to increment reads:", error);
    return NextResponse.json({ ok: false });
  }
}
