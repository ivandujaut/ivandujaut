/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";

interface PostHeroProps {
  title: string;
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  heroUrls?: {
    light: string;
    dark: string;
  };
}

/**
 * Hero image para un post del blog.
 *
 * Si el post tiene `cover` en su frontmatter, usa esa imagen directamente.
 * Si no, usa las URLs OG pre-firmadas en el servidor (light/dark) y selecciona
 * según el theme actual del cliente. La firma se hace server-side para que
 * OG_SECRET nunca llegue al bundle del browser.
 */
export function PostHero({ title, cover, heroUrls }: PostHeroProps) {
  const { resolvedTheme } = useTheme();

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

  if (!heroUrls) return null;

  const theme: "light" | "dark" = resolvedTheme === "dark" ? "dark" : "light";
  const heroUrl = heroUrls[theme];

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
