/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import { buildPostOgUrl, formatOgDate } from "@/lib/og";

interface PostHeroProps {
  title: string;
  date: string;
  description?: string;
  readingTime?: number;
  tags?: string[];
  locale: "es" | "en";
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

/**
 * Hero image para un post del blog.
 *
 * Si el post tiene `cover` en su frontmatter, usa esa imagen directamente.
 * Si no, genera una dinámicamente usando el endpoint /api/og.
 *
 * En el caso generado, detecta el theme del usuario (light/dark) y pide
 * la imagen correspondiente. La imagen empieza con el theme light por
 * default (SSR) y next-themes actualiza al theme real una vez hidratado
 * el cliente.
 */
export function PostHero({
  title,
  date,
  description,
  readingTime,
  tags,
  locale,
  cover,
}: PostHeroProps) {
  const { resolvedTheme } = useTheme();

  // Si el post tiene cover custom, usar esa imagen directamente.
  if (cover) {
    return (
      <div className="my-8 overflow-hidden rounded-lg border border-border">
        <img
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          className="h-auto w-full"
        />
      </div>
    );
  }

  // Detectar theme. Si resolvedTheme es undefined (SSR antes de hidratar),
  // usar "light" por default.
  const theme: "light" | "dark" = resolvedTheme === "dark" ? "dark" : "light";

  const heroUrl = buildPostOgUrl({
    title,
    description,
    date: formatOgDate(date, locale),
    readingTime,
    tags,
    locale,
    theme,
  });

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-border">
      <img
        src={heroUrl}
        alt={title}
        width={1200}
        height={630}
        className="h-auto w-full"
        suppressHydrationWarning
      />
    </div>
  );
}
