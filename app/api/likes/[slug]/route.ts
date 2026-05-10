import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CLAPS_PER_USER = 10;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/likes/:slug
 * Devuelve total de claps y cuántos ya dio el usuario actual.
 */
export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!redis) {
    return NextResponse.json({ likes: 0, userClaps: 0 });
  }

  try {
    const ip = getIpFromRequest(request);
    const ipHash = hashIp(ip);

    const [totalLikes, userClaps] = await Promise.all([
      redis.get<number>(`likes:total:${slug}`),
      redis.get<number>(`likes:user:${slug}:${ipHash}`),
    ]);

    return NextResponse.json({
      likes: totalLikes ?? 0,
      userClaps: userClaps ?? 0,
      maxClaps: MAX_CLAPS_PER_USER,
    });
  } catch (error) {
    console.error("Failed to get likes:", error);
    return NextResponse.json({
      likes: 0,
      userClaps: 0,
      maxClaps: MAX_CLAPS_PER_USER,
    });
  }
}

/**
 * POST /api/likes/:slug
 * Suma 1 clap. Si el usuario ya alcanzó el máximo, no hace nada.
 */
export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!redis) {
    return NextResponse.json({ likes: 0, userClaps: 0 });
  }

  try {
    const ip = getIpFromRequest(request);
    const ipHash = hashIp(ip);
    const userKey = `likes:user:${slug}:${ipHash}`;
    const totalKey = `likes:total:${slug}`;

    // Verificar cuántos claps ya dio el usuario
    const currentUserClaps = (await redis.get<number>(userKey)) ?? 0;

    if (currentUserClaps >= MAX_CLAPS_PER_USER) {
      // Ya alcanzó el máximo, no incrementar
      const totalLikes = (await redis.get<number>(totalKey)) ?? 0;
      return NextResponse.json({
        likes: totalLikes,
        userClaps: currentUserClaps,
        maxClaps: MAX_CLAPS_PER_USER,
      });
    }

    // Incrementar ambos contadores en paralelo
    const [newUserClaps, newTotalLikes] = await Promise.all([
      redis.incr(userKey),
      redis.incr(totalKey),
    ]);

    return NextResponse.json({
      likes: newTotalLikes,
      userClaps: newUserClaps,
      maxClaps: MAX_CLAPS_PER_USER,
    });
  } catch (error) {
    console.error("Failed to increment likes:", error);
    return NextResponse.json({
      likes: 0,
      userClaps: 0,
      maxClaps: MAX_CLAPS_PER_USER,
    });
  }
}
