"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Flowchart01Icon } from "@hugeicons/core-free-icons";

interface EraserEmbedProps {
  /**
   * Full Eraser workspace URL. E.g.:
   * https://app.eraser.io/workspace/Q3fl0Fp1sk8eu23z3301
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
 * Embed a live Eraser diagram. Requires the workspace to be shared with
 * link access ("Anyone with the link can view") — private workspaces render
 * a login wall inside the iframe.
 *
 * Same posture as <FigmaEmbed>: a skeleton overlay while the iframe loads,
 * and the header link always offers the escape hatch to open the workspace
 * in Eraser directly, so the block stays useful even if the embed fails.
 */
export function EraserEmbed({
  url,
  title,
  aspect = "16/9",
  height,
  caption,
  fullBleed = false,
}: EraserEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const embedSrc = `${url}${url.includes("?") ? "&" : "?"}embed=true`;

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
              icon={Flowchart01Icon}
              size={14}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground"
              aria-hidden
            />
            <span className="truncate font-mono text-xs text-muted-foreground">
              eraser.io · {title}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>Open in Eraser</span>
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
                icon={Flowchart01Icon}
                size={28}
                strokeWidth={1.25}
                className="opacity-50 motion-safe:animate-pulse"
              />
              <span className="font-mono text-xs uppercase tracking-wider">Loading Eraser…</span>
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
