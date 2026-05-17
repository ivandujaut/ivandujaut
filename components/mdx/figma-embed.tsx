"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, BrushIcon } from "@hugeicons/core-free-icons";

interface FigmaEmbedProps {
  /**
   * Full Figma URL (file, prototype, or specific node). E.g.:
   * https://www.figma.com/file/abc/Project?node-id=1%3A2
   * https://www.figma.com/proto/abc/Project?node-id=1%3A2&starting-point-node-id=1%3A2
   */
  url: string;
  title: string;
  /** Aspect ratio for the iframe, default "16/9". */
  aspect?: string;
  /** CSS height. Overrides aspect when set. */
  height?: string;
  caption?: string;
  fullBleed?: boolean;
}

/**
 * Embed a live Figma frame or prototype. Uses the official figma.com/embed
 * endpoint, which requires the file to be shared as "Anyone with the link
 * can view" — fully private files cannot be embedded.
 *
 * While the iframe loads (typically 1-2s), a skeleton overlay communicates
 * "loading" instead of leaving an empty dark rectangle that reads as "broken".
 *
 * Caveat from the case-study benchmark: most engineering blogs export PNG
 * frames instead of embedding the live iframe (load weight + Figma chrome).
 * Reach for `<FrameGrid>` first; use this when interactivity is the point
 * (prototype demos, click-through flows).
 */
export function FigmaEmbed({
  url,
  title,
  aspect = "16/9",
  height,
  caption,
  fullBleed = false,
}: FigmaEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const embedSrc = `https://www.figma.com/embed?embed_host=ivandujaut&url=${encodeURIComponent(url)}`;

  let displayLabel = "figma.com";
  try {
    const u = new URL(url);
    const kind = u.pathname.split("/")[1] ?? "file";
    displayLabel = `figma.com/${kind}`;
  } catch {
    // Keep default on parse error.
  }

  const wrapperClass = fullBleed
    ? "my-12 mx-[calc(50%-50vw)] flex w-screen justify-center"
    : "my-8";
  const frameClass = fullBleed
    ? "w-full max-w-[1280px] overflow-hidden border-y border-border bg-background"
    : "overflow-hidden rounded-lg border border-border bg-background";

  return (
    <figure className={wrapperClass}>
      <div className={frameClass}>
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <HugeiconsIcon
              icon={BrushIcon}
              size={14}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground"
              aria-hidden
            />
            <span className="truncate font-mono text-xs text-muted-foreground">
              {displayLabel} · {title}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>Open in Figma</span>
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} strokeWidth={1.5} aria-hidden />
          </a>
        </div>
        <div className="relative" style={height ? { height } : { aspectRatio: aspect }}>
          {!loaded && (
            <div
              aria-hidden
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/40 text-muted-foreground"
            >
              <HugeiconsIcon
                icon={BrushIcon}
                size={28}
                strokeWidth={1.25}
                className="opacity-50 motion-safe:animate-pulse"
              />
              <span className="font-mono text-xs uppercase tracking-wider">Loading Figma…</span>
            </div>
          )}
          <iframe
            src={embedSrc}
            title={title}
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            className="absolute inset-0 block h-full w-full border-0"
          />
        </div>
      </div>
      {caption && (
        <figcaption
          className={
            fullBleed
              ? "mx-auto mt-3 max-w-2xl px-6 text-center text-sm text-muted-foreground"
              : "mt-2 text-center text-sm text-muted-foreground"
          }
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
