import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { redis, keyFor } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";
import { isViewKind, viewsTag } from "@/lib/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ kind: string; slug: string }>;
}

const SEEN_TTL_SECONDS = 60 * 60 * 24;

export async function POST(request: Request, context: RouteContext) {
  const { kind, slug } = await context.params;

  if (!isViewKind(kind)) {
    return NextResponse.json({ views: 0 }, { status: 404 });
  }

  if (!redis) {
    return NextResponse.json({ views: 0 });
  }

  try {
    const ipHash = hashIp(getIpFromRequest(request));
    const counterKey = keyFor("views", kind, slug);
    const seenKey = keyFor("views", "seen", kind, slug, ipHash);

    const isFirstSeen = await redis.set(seenKey, 1, { nx: true, ex: SEEN_TTL_SECONDS });

    const views = isFirstSeen
      ? await redis.incr(counterKey)
      : ((await redis.get<number>(counterKey)) ?? 0);

    if (isFirstSeen) {
      revalidateTag(viewsTag(kind, slug), "max");
    }

    return NextResponse.json({ views });
  } catch (error) {
    console.error("Failed to increment views:", error);
    return NextResponse.json({ views: 0 });
  }
}
