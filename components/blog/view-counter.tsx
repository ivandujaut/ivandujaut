"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  slug: string;
  trackView?: boolean;
}

/**
 * Muestra el contador de views de un post.
 *
 * Si `trackView` es true (default), incrementa el contador al montar.
 * Para evitar contar refresh constantes, usa sessionStorage para
 * trackear si esta sesión ya contabilizó este post.
 */
export function ViewCounter({ slug, trackView = true }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAndIncrement() {
      const sessionKey = `viewed:${slug}`;
      const alreadyTracked = sessionStorage.getItem(sessionKey);

      try {
        if (trackView && !alreadyTracked) {
          // Incrementar y obtener el nuevo valor
          const res = await fetch(`/api/views/${slug}`, { method: "POST" });
          const data = await res.json();
          if (!cancelled) {
            setViews(data.views);
            sessionStorage.setItem(sessionKey, "1");
          }
        } else {
          // Solo leer
          const res = await fetch(`/api/views/${slug}`);
          const data = await res.json();
          if (!cancelled) {
            setViews(data.views);
          }
        }
      } catch (error) {
        console.error("Failed to fetch views:", error);
      }
    }

    fetchAndIncrement();

    return () => {
      cancelled = true;
    };
  }, [slug, trackView]);

  if (views === null) {
    return <span className="font-mono text-xs text-muted-foreground">— views</span>;
  }

  return (
    <span className="font-mono text-xs text-muted-foreground">
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  );
}
