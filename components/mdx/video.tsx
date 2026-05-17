import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

interface VideoProps {
  src: string;
  caption?: string;
  poster?: string;
  controls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  /**
   * Break out of the article column for a wide demo clip. Default is inset.
   * Pair with short loops (5-10s), not full demo recordings.
   */
  fullBleed?: boolean;
  /**
   * Optional URL to a live demo of what's shown. Renders a "Try the demo →"
   * link below the caption. Pattern stolen from Vercel Ship's case study —
   * lets the reader stop watching and start playing.
   */
  demoHref?: string;
  demoLabel?: string;
}

export function Video({
  src,
  caption,
  poster,
  controls = false,
  loop = true,
  autoPlay = true,
  fullBleed = false,
  demoHref,
  demoLabel = "Try the demo",
}: VideoProps) {
  const wrapperClass = fullBleed
    ? "my-12 mx-[calc(50%-50vw)] flex w-screen justify-center"
    : "my-8";
  const playerWrapperClass = fullBleed
    ? "w-full max-w-[1280px] overflow-hidden border-y border-border bg-muted/30"
    : "overflow-hidden rounded-lg border border-border bg-muted/30";

  const videoEl = (
    <video
      src={src}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted
      playsInline
      className="h-auto w-full"
    />
  );

  const demoLink = demoHref ? (
    <a
      href={demoHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-medium text-foreground underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground"
    >
      {demoLabel}
      <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} aria-hidden />
    </a>
  ) : null;

  if (fullBleed) {
    return (
      <figure className={wrapperClass}>
        <div className={playerWrapperClass}>
          {videoEl}
          {(caption || demoLink) && (
            <figcaption className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm text-muted-foreground">
              {caption && <span>{caption}</span>}
              {demoLink}
            </figcaption>
          )}
        </div>
      </figure>
    );
  }

  return (
    <figure className={wrapperClass}>
      <div className={playerWrapperClass}>{videoEl}</div>
      {(caption || demoLink) && (
        <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm text-muted-foreground">
          {caption && <span>{caption}</span>}
          {demoLink}
        </figcaption>
      )}
    </figure>
  );
}
