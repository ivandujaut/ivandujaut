import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /**
   * Break out of the article column to span the viewport. Use for hero shots
   * and "wow" moments, not for every figure. Keep inset (default) for
   * inline diagrams and step-by-step screenshots.
   */
  fullBleed?: boolean;
  /**
   * Optional max width when fullBleed is on, in pixels. Defaults to 1280
   * so the image doesn't stretch grotesquely on ultrawide displays.
   */
  fullBleedMaxWidth?: number;
}

export async function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 800,
  priority = false,
  fullBleed = false,
  fullBleedMaxWidth = 1280,
}: FigureProps) {
  const t = await getTranslations("paper");
  const figureLabel = t("figure");

  const wrapperClass = fullBleed
    ? "my-12 mx-[calc(50%-50vw)] flex w-screen justify-center"
    : "my-8";
  const imageWrapperClass = fullBleed
    ? "w-full overflow-hidden border-y border-border bg-muted/30"
    : "overflow-hidden rounded-lg border border-border bg-muted/30";

  return (
    <figure className={wrapperClass}>
      <div
        className={imageWrapperClass}
        style={fullBleed ? { maxWidth: `${fullBleedMaxWidth}px` } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-full"
          sizes={fullBleed ? "100vw" : "(max-width: 768px) 100vw, 768px"}
        />
        {caption && fullBleed && (
          <figcaption
            data-auto-number
            data-figure-label={figureLabel}
            className="px-6 py-3 text-center text-sm text-muted-foreground"
          >
            {caption}
          </figcaption>
        )}
      </div>
      {caption && !fullBleed && (
        <figcaption
          data-auto-number
          data-figure-label={figureLabel}
          className="mt-2 text-center text-sm text-muted-foreground"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
