/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

interface PostHeroProps {
  title: string;
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL?: string;
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
 *
 * El cover pasa por `next/image`: es el LCP del post, así que lo queremos
 * optimizado, en modo eager y con el blur de Velite como placeholder. El
 * fallback OG sigue con `<img>` crudo porque su URL se resuelve recién en el
 * cliente (depende del theme) y no hay nada que Next pueda preprocesar.
 */
export function PostHero({ title, cover, heroUrls }: PostHeroProps) {
  const { resolvedTheme } = useTheme();

  if (cover) {
    return (
      <div className="my-8 overflow-hidden rounded-lg border border-border">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 672px"
          loading="eager"
          fetchPriority="high"
          {...(cover.blurDataURL
            ? { placeholder: "blur" as const, blurDataURL: cover.blurDataURL }
            : {})}
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
