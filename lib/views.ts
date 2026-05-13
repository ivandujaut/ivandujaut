import { unstable_cache } from "next/cache";
import { redis, keyFor } from "@/lib/redis";

export type ViewKind = "blog" | "projects";

export const VIEW_KINDS: ViewKind[] = ["blog", "projects"];

export function isViewKind(value: string): value is ViewKind {
  return (VIEW_KINDS as string[]).includes(value);
}

export function viewsTag(kind: ViewKind, slug: string): string {
  return `views:${kind}:${slug}`;
}

async function readViews(kind: ViewKind, slug: string): Promise<number> {
  if (!redis) return 0;
  try {
    return (await redis.get<number>(keyFor("views", kind, slug))) ?? 0;
  } catch (error) {
    console.error("Failed to read views:", error);
    return 0;
  }
}

export function getCachedViews(kind: ViewKind, slug: string): Promise<number> {
  return unstable_cache(() => readViews(kind, slug), ["views", kind, slug], {
    revalidate: 60,
    tags: [viewsTag(kind, slug)],
  })();
}
