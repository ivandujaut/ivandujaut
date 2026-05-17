import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

interface Frame {
  src: string;
  alt: string;
  /** Label above the thumbnail (e.g. the screen name in Figma). */
  label?: string;
  /** Optional URL to open the original frame, demo, or page. */
  href?: string;
  width?: number;
  height?: number;
}

interface FrameGridProps {
  frames: Frame[];
  /** Grid column count. Defaults to 3 (clamps to fewer on narrow viewports). */
  columns?: 2 | 3 | 4;
  /**
   * Break out of the article column to show wider frames. Default is inset.
   * Useful when the grid is the section's headline visual.
   */
  fullBleed?: boolean;
}

/**
 * Grid of related visual frames — Figma exports, design explorations, screen
 * variants, alternate states. Each frame gets a label above and is optionally
 * linkable. Pattern observed at Rauno (`/craft`), Linear redesign explorations,
 * and Vercel Ship "ship-25-explorations".
 *
 * For Figma frames specifically, export to PNG/SVG at ~2x and reference the
 * file path here — nobody embeds the native Figma iframe in practice.
 */
export function FrameGrid({ frames, columns = 3, fullBleed = false }: FrameGridProps) {
  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  const wrapperClass = fullBleed ? "my-12 mx-[calc(50%-50vw)] w-screen px-6" : "my-8";

  return (
    <div className={wrapperClass}>
      <ul
        className={`mx-auto grid w-full max-w-[1280px] list-none grid-cols-1 gap-x-5 gap-y-8 pl-0! [&>li]:mb-0! [&>li]:list-none ${colClass}`}
      >
        {frames.map((frame) => {
          const inner = (
            <>
              {frame.label && (
                <p className="mb-2 flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <span>{frame.label}</span>
                  {frame.href && (
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      size={12}
                      strokeWidth={1.5}
                      className="opacity-60 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  )}
                </p>
              )}
              <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  width={frame.width ?? 800}
                  height={frame.height ?? 500}
                  className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </>
          );

          return (
            <li key={frame.src} className="group">
              {frame.href ? (
                <a
                  href={frame.href}
                  target={frame.href.startsWith("http") ? "_blank" : undefined}
                  rel={frame.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
