import { NextResponse } from "next/server";
import { redis, keyFor } from "@/lib/redis";
import { hashIp, getIpFromRequest } from "@/lib/hash";
import { check, likesRatelimit } from "@/lib/ratelimit";
import { isValidSlug, isViewKind, type ViewKind } from "@/lib/views";

type LikeKind = ViewKind;

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
  params: Promise<{ kind: string; slug: string }>;
}

interface LikesPayload {
  likes: number;
  liked: boolean;
}

const EMPTY: LikesPayload = { likes: 0, liked: false };

async function readState(kind: LikeKind, slug: string, ipHash: string): Promise<LikesPayload> {
  if (!redis) return EMPTY;

  const baselineKey = keyFor("likes", kind, "total", slug);
  const setKey = keyFor("likes", kind, "set", slug);

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

async function resolveParams(
  context: RouteContext,
): Promise<{ kind: LikeKind; slug: string } | null> {
  const { kind, slug } = await context.params;
  if (!isViewKind(kind)) return null;
  if (!isValidSlug(slug)) return null;
  return { kind, slug };
}

export async function GET(request: Request, context: RouteContext) {
  const resolved = await resolveParams(context);
  if (!resolved) return NextResponse.json(EMPTY, { status: 404 });
  if (!redis) return NextResponse.json(EMPTY);

  try {
    const ipHash = hashIp(getIpFromRequest(request));
    return NextResponse.json(await readState(resolved.kind, resolved.slug, ipHash));
  } catch (error) {
    console.error("Failed to get likes:", error);
    return NextResponse.json(EMPTY);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const resolved = await resolveParams(context);
  if (!resolved) return NextResponse.json(EMPTY, { status: 404 });
  if (!redis) return NextResponse.json(EMPTY);

  try {
    const ipHash = hashIp(getIpFromRequest(request));
    const blocked = await enforceRatelimit(ipHash);
    if (blocked) return blocked;

    await redis.sadd(keyFor("likes", resolved.kind, "set", resolved.slug), ipHash);
    return NextResponse.json(await readState(resolved.kind, resolved.slug, ipHash));
  } catch (error) {
    console.error("Failed to add like:", error);
    return NextResponse.json(EMPTY);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const resolved = await resolveParams(context);
  if (!resolved) return NextResponse.json(EMPTY, { status: 404 });
  if (!redis) return NextResponse.json(EMPTY);

  try {
    const ipHash = hashIp(getIpFromRequest(request));
    const blocked = await enforceRatelimit(ipHash);
    if (blocked) return blocked;

    await redis.srem(keyFor("likes", resolved.kind, "set", resolved.slug), ipHash);
    return NextResponse.json(await readState(resolved.kind, resolved.slug, ipHash));
  } catch (error) {
    console.error("Failed to remove like:", error);
    return NextResponse.json(EMPTY);
  }
}
