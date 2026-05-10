import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CLAPS_PER_USER = 10;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!redis) {
    return NextResponse.json({ likes: 0, userClaps: 0, maxClaps: MAX_CLAPS_PER_USER });
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

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!redis) {
    return NextResponse.json({ likes: 0, userClaps: 0, maxClaps: MAX_CLAPS_PER_USER });
  }

  try {
    const ip = getIpFromRequest(request);
    const ipHash = hashIp(ip);
    const userKey = `likes:user:${slug}:${ipHash}`;
    const totalKey = `likes:total:${slug}`;

    const currentUserClaps = (await redis.get<number>(userKey)) ?? 0;

    if (currentUserClaps >= MAX_CLAPS_PER_USER) {
      const totalLikes = (await redis.get<number>(totalKey)) ?? 0;
      return NextResponse.json({
        likes: totalLikes,
        userClaps: currentUserClaps,
        maxClaps: MAX_CLAPS_PER_USER,
      });
    }

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
