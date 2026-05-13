import { NextResponse } from "next/server";
import { redis, keyFor } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";
import { check, likesRatelimit } from "@/lib/ratelimit";

async function enforceRatelimit(ipHash: string) {
  const rl = await check(likesRatelimit, ipHash);
  if (rl.allowed) return null;
  return NextResponse.json(EMPTY, {
    status: 429,
    headers: { "Retry-After": String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000))) },
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

interface LikesPayload {
  likes: number;
  liked: boolean;
}

const EMPTY: LikesPayload = { likes: 0, liked: false };

async function readState(slug: string, ipHash: string): Promise<LikesPayload> {
  if (!redis) return EMPTY;

  const baselineKey = keyFor("likes", "total", slug);
  const setKey = keyFor("likes", "set", slug);

  const [baseline, members, liked] = await Promise.all([
    redis.get<number>(baselineKey),
    redis.scard(setKey),
    redis.sismember(setKey, ipHash),
  ]);

  return {
    likes: (baseline ?? 0) + (members ?? 0),
    liked: liked === 1,
  };
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!redis) return NextResponse.json(EMPTY);

  try {
    const ipHash = hashIp(getIpFromRequest(request));
    return NextResponse.json(await readState(slug, ipHash));
  } catch (error) {
    console.error("Failed to get likes:", error);
    return NextResponse.json(EMPTY);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!redis) return NextResponse.json(EMPTY);

  try {
    const ipHash = hashIp(getIpFromRequest(request));
    const blocked = await enforceRatelimit(ipHash);
    if (blocked) return blocked;

    await redis.sadd(keyFor("likes", "set", slug), ipHash);
    return NextResponse.json(await readState(slug, ipHash));
  } catch (error) {
    console.error("Failed to add like:", error);
    return NextResponse.json(EMPTY);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!redis) return NextResponse.json(EMPTY);

  try {
    const ipHash = hashIp(getIpFromRequest(request));
    const blocked = await enforceRatelimit(ipHash);
    if (blocked) return blocked;

    await redis.srem(keyFor("likes", "set", slug), ipHash);
    return NextResponse.json(await readState(slug, ipHash));
  } catch (error) {
    console.error("Failed to remove like:", error);
    return NextResponse.json(EMPTY);
  }
}
