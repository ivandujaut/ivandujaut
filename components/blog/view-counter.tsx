"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { ViewKind } from "@/lib/views";

interface ViewCounterProps {
  kind: ViewKind;
  slug: string;
  initialViews: number;
  trackView?: boolean;
}

export function ViewCounter({ kind, slug, initialViews, trackView = true }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const t = useTranslations("blog.views");

  useEffect(() => {
    if (!trackView || typeof window === "undefined") return;

    const sessionKey = `viewed:${kind}:${slug}`;
    if (sessionStorage.getItem(sessionKey)) return;

    let cancelled = false;

    async function track() {
      try {
        const res = await fetch(`/api/views/${kind}/${slug}`, { method: "POST" });
        if (!res.ok) return;

        const data = (await res.json()) as { views?: unknown };
        const value = typeof data.views === "number" ? data.views : null;

        if (!cancelled && value !== null) {
          setViews(value);
          sessionStorage.setItem(sessionKey, "1");
        }
      } catch (error) {
        console.error("ViewCounter track error:", error);
      }
    }

    track();
    return () => {
      cancelled = true;
    };
  }, [kind, slug, trackView]);

  return (
    <span className="font-mono text-xs text-muted-foreground">
      {views.toLocaleString()} {views === 1 ? t("singular") : t("plural")}
    </span>
  );
}
