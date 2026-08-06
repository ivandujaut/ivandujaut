import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { redis, keyFor } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";
import { isValidSlug, isViewKind } from "@/lib/views";
import { continuedTag } from "@/lib/reads";
import { check, viewsRatelimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ kind: string; slug: string }>;
}

const SEEN_TTL_SECONDS = 60 * 60 * 24;

/**
 * Marca que el lector siguió con otra pieza después de terminar esta.
 *
 * El `kind` y el `slug` que llegan son los de la **primera** pieza de la sesión,
 * no los de la que se está leyendo ahora: se le acredita a la que enganchó.
 */
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

    const seenKey = keyFor("continued", "seen", kind, slug, ipHash);
    const isFirstSeen = await redis.set(seenKey, 1, { nx: true, ex: SEEN_TTL_SECONDS });

    if (isFirstSeen) {
      await redis.incr(keyFor("continued", kind, slug));
      revalidateTag(continuedTag(kind, slug), "max");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to increment continued:", error);
    return NextResponse.json({ ok: false });
  }
}
