import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { redis, keyFor } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";
import { isContentLocale, isValidSlug, isViewKind, viewsTag } from "@/lib/views";
import { check, viewsRatelimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ kind: string; slug: string }>;
}

const SEEN_TTL_SECONDS = 60 * 60 * 24;

export async function POST(request: Request, context: RouteContext) {
  const { kind, slug } = await context.params;
  // El idioma viaja por query y no por ruta: los slugs son iguales en los dos
  // idiomas, así que sin esto ambas versiones incrementan el mismo contador.
  const locale = new URL(request.url).searchParams.get("l") ?? "";

  if (!isViewKind(kind) || !isValidSlug(slug) || !isContentLocale(locale)) {
    return NextResponse.json({ views: 0 }, { status: 404 });
  }

  if (!redis) {
    return NextResponse.json({ views: 0 });
  }

  try {
    const ipHash = hashIp(getIpFromRequest(request));

    const rl = await check(viewsRatelimit, ipHash);
    if (!rl.allowed) {
      return NextResponse.json(
        { views: 0 },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000))),
          },
        },
      );
    }

    const counterKey = keyFor("views", kind, locale, slug);
    const seenKey = keyFor("views", "seen", kind, locale, slug, ipHash);

    const isFirstSeen = await redis.set(seenKey, 1, { nx: true, ex: SEEN_TTL_SECONDS });

    const views = isFirstSeen
      ? await redis.incr(counterKey)
      : ((await redis.get<number>(counterKey)) ?? 0);

    if (isFirstSeen) {
      revalidateTag(viewsTag(kind, locale, slug), "max");
    }

    return NextResponse.json({ views });
  } catch (error) {
    console.error("Failed to increment views:", error);
    return NextResponse.json({ views: 0 });
  }
}
