import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

interface DiagramProps {
  /** Inline SVG, JSX, or an `<Image>` — whatever the diagram is. */
  children: ReactNode;
  /** Argumentative caption. Says WHY the diagram matters, not what it is. */
  caption?: string;
  /** Break out of the article column for a wide schematic. */
  fullBleed?: boolean;
  /**
   * Padding inside the diagram frame, e.g. "px-6 py-8". Set to "p-0" if the
   * children render their own background. Defaults to a comfortable inset.
   */
  framePadding?: string;
}

/**
 * Schematic diagram with caption. Author renders the diagram itself as
 * inline SVG (or an MDX image) in children — this wrapper handles framing,
 * caption typography, auto-numbering, and dark-mode-friendly background.
 *
 * Auto-numbers as "Figura N:" sharing the same counter as `<Figure>`, so
 * mixing diagrams and screenshots in the same article keeps a single
 * continuous sequence.
 *
 * @example
 * <Diagram caption="Velite turns MDX into typed data at build time.">
 *   <svg viewBox="0 0 400 120" className="h-auto w-full">
 *     <rect x="10" y="40" width="80" height="40" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
 *     <text x="50" y="65" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12">MDX</text>
 *   </svg>
 * </Diagram>
 */
export async function Diagram({
  children,
  caption,
  fullBleed = false,
  framePadding = "px-6 py-8",
}: DiagramProps) {
  const t = await getTranslations("paper");
  const figureLabel = t("figure");

  const wrapperClass = fullBleed
    ? "my-12 mx-[calc(50%-50vw)] flex w-screen justify-center"
    : "my-8";
  const frameClass = `${framePadding} ${
    fullBleed
      ? "w-full max-w-[1280px] border-y border-border bg-muted/30"
      : "rounded-lg border border-border bg-muted/30"
  }`;

  return (
    <figure className={wrapperClass}>
      <div className={frameClass}>{children}</div>
      {caption && (
        <figcaption
          data-auto-number
          data-figure-label={figureLabel}
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
