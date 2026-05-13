import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const envTag = process.env.REDIS_ENV_TAG ?? "local";

function build(name: string, limit: number, windowSeconds: number): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    analytics: false,
    prefix: `${envTag}:ratelimit:${name}`,
  });
}

export const viewsRatelimit = build("views", 30, 60);
export const likesRatelimit = build("likes", 10, 60);
export const ogRatelimit = build("og", 20, 60);

export interface RatelimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

export async function check(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<RatelimitResult> {
  if (!limiter) return { allowed: true, remaining: Infinity, reset: 0 };
  const { success, remaining, reset } = await limiter.limit(identifier);
  return { allowed: success, remaining, reset };
}
