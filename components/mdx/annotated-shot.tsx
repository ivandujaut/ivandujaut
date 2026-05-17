import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface Annotation {
  /** Region in image-percentage space (0-100). */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Short, opinionated label. Kept under ~80 chars. */
  label: string;
}

interface AnnotatedShotProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  annotations: Annotation[];
  caption?: string;
  fullBleed?: boolean;
}

/**
 * Screenshot with labeled regions drawn over it and a numbered legend below.
 * Pattern observed in Linear's redesign post ("the inverted L-shape that
 * comprises the global chrome"): vector overlay over a screenshot, captioned
 * regions, no red arrows.
 *
 * Coordinates are percentages of the image (0-100), so the annotation tracks
 * the image at any rendered size.
 *
 * @example
 * <AnnotatedShot
 *   src="./dashboard.png"
 *   alt="Dashboard"
 *   caption="The three regions that carry the layout."
 *   annotations={[
 *     { x: 0, y: 0, w: 18, h: 100, label: "Persistent navigation" },
 *     { x: 18, y: 0, w: 82, h: 12, label: "Page header with breadcrumbs" },
 *     { x: 18, y: 12, w: 82, h: 88, label: "Primary workspace" },
 *   ]}
 * />
 */
export async function AnnotatedShot({
  src,
  alt,
  width = 1200,
  height = 800,
  annotations,
  caption,
  fullBleed = false,
}: AnnotatedShotProps) {
  const t = await getTranslations("paper");
  const figureLabel = t("figure");

  const wrapperClass = fullBleed
    ? "my-12 mx-[calc(50%-50vw)] flex w-screen flex-col items-center"
    : "my-8";
  const frameClass = fullBleed
    ? "relative w-full max-w-[1280px] overflow-hidden border-y border-border bg-muted/30"
    : "relative overflow-hidden rounded-lg border border-border bg-muted/30";

  return (
    <figure className={wrapperClass}>
      <div className={frameClass}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
          sizes={fullBleed ? "100vw" : "(max-width: 768px) 100vw, 768px"}
        />
        <div className="pointer-events-none absolute inset-0">
          {annotations.map((a, i) => (
            <div
              key={`${a.x}-${a.y}-${i}`}
              className="absolute rounded-sm border-2 border-foreground/80 bg-foreground/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.6)_inset]"
              style={{
                left: `${a.x}%`,
                top: `${a.y}%`,
                width: `${a.w}%`,
                height: `${a.h}%`,
              }}
            >
              <span
                className="absolute -top-2.5 -left-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground font-mono text-[11px] font-semibold text-background shadow"
                aria-hidden
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption
        data-auto-number
        data-figure-label={figureLabel}
        className={
          fullBleed
            ? "mx-auto mt-3 max-w-2xl px-6 text-sm text-muted-foreground"
            : "mt-3 text-sm text-muted-foreground"
        }
      >
        {caption && <span className="block text-center">{caption}</span>}
        <ol className="mx-auto mt-3 max-w-lg space-y-1 text-left font-sans text-[0.85rem]">
          {annotations.map((a, i) => (
            <li key={`legend-${i}`} className="flex gap-2">
              <span
                aria-hidden
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-semibold text-background"
              >
                {i + 1}
              </span>
              <span>{a.label}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
