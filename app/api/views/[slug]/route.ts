import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/views/:slug
 * Devuelve el contador actual de views para un post.
 */
export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!redis) {
    return NextResponse.json({ views: 0 });
  }

  try {
    const views = (await redis.get<number>(`views:${slug}`)) ?? 0;
    return NextResponse.json({ views });
  } catch (error) {
    console.error("Failed to get views:", error);
    return NextResponse.json({ views: 0 });
  }
}

/**
 * POST /api/views/:slug
 * Incrementa el contador de views para un post.
 */
export async function POST(_: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!redis) {
    return NextResponse.json({ views: 0 });
  }

  try {
    const views = await redis.incr(`views:${slug}`);
    return NextResponse.json({ views });
  } catch (error) {
    console.error("Failed to increment views:", error);
    return NextResponse.json({ views: 0 });
  }
}
