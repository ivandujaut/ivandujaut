"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface ViewCounterProps {
  slug: string;
  trackView?: boolean;
}

export function ViewCounter({ slug, trackView = true }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const t = useTranslations("blog.views");

  useEffect(() => {
    let cancelled = false;

    async function fetchAndIncrement() {
      const sessionKey = `viewed:${slug}`;

      try {
        const alreadyTracked =
          typeof window !== "undefined" ? sessionStorage.getItem(sessionKey) : null;

        const url = `/api/views/${slug}`;
        const method = trackView && !alreadyTracked ? "POST" : "GET";

        const res = await fetch(url, { method });

        if (!res.ok) {
          throw new Error(`Failed to fetch views: ${res.status}`);
        }

        const data = await res.json();

        // Defensa: si por alguna razón llega algo raro, fallback a 0
        const viewsValue = typeof data.views === "number" ? data.views : 0;

        if (!cancelled) {
          setViews(viewsValue);

          if (trackView && !alreadyTracked && typeof window !== "undefined") {
            sessionStorage.setItem(sessionKey, "1");
          }
        }
      } catch (error) {
        console.error("ViewCounter error:", error);
        if (!cancelled) {
          setViews(0);
        }
      }
    }

    fetchAndIncrement();

    return () => {
      cancelled = true;
    };
  }, [slug, trackView]);

  if (views === null) {
    return <span className="font-mono text-xs text-muted-foreground">— {t("plural")}</span>;
  }

  return (
    <span className="font-mono text-xs text-muted-foreground">
      {views.toLocaleString()} {views === 1 ? t("singular") : t("plural")}
    </span>
  );
}
