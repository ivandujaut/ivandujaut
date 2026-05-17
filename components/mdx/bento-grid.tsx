import Image from "next/image";

interface BentoItem {
  src: string;
  alt: string;
  /** Column span on `md:` and up, 1-12. Default 4 (3 items per row). */
  span?: 3 | 4 | 6 | 8 | 9 | 12;
  /** Row span on `md:` and up, 1-3. Default 1. */
  rows?: 1 | 2 | 3;
  /** Cell aspect ratio. Default "4/3". Set "1/1" for square, "16/9" for wide. */
  aspect?: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface BentoGridProps {
  items: BentoItem[];
  /** Break out of the article column. Default false. */
  fullBleed?: boolean;
  /** Gap between cells. Default "1rem". */
  gap?: string;
}

const SPAN_CLASS: Record<NonNullable<BentoItem["span"]>, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  6: "md:col-span-6",
  8: "md:col-span-8",
  9: "md:col-span-9",
  12: "md:col-span-12",
};

const ROWS_CLASS: Record<NonNullable<BentoItem["rows"]>, string> = {
  1: "md:row-span-1",
  2: "md:row-span-2",
  3: "md:row-span-3",
};

/**
 * Asymmetric photo grid in the style of Apple / Linear bento sections.
 * Items live on a 12-column grid and span variable widths and heights,
 * so the same component can mix landscape shots, square thumbs, and
 * tall portraits without forcing a uniform crop.
 *
 * On mobile every item stacks to full width. On `md:` and up, the
 * `span` and `rows` props on each item take effect.
 *
 * @example mixed photo essay
 * <BentoGrid items={[
 *   { src: "/photos/hero.jpg", alt: "Studio", span: 8, aspect: "16/9" },
 *   { src: "/photos/detail-1.jpg", alt: "Detail", span: 4, aspect: "1/1" },
 *   { src: "/photos/wide-shot.jpg", alt: "Wide", span: 12, aspect: "21/9" },
 *   { src: "/photos/portrait.jpg", alt: "Portrait", span: 4, rows: 2, aspect: "3/4" },
 *   { src: "/photos/sq-1.jpg", alt: "Square", span: 4, aspect: "1/1" },
 *   { src: "/photos/sq-2.jpg", alt: "Square", span: 4, aspect: "1/1" },
 * ]} />
 */
export function BentoGrid({ items, fullBleed = false, gap = "1rem" }: BentoGridProps) {
  const wrapperClass = fullBleed ? "my-12 mx-[calc(50%-50vw)] w-screen px-6" : "my-8";

  return (
    <div className={wrapperClass}>
      <ul
        className="mx-auto grid w-full max-w-[1280px] list-none grid-cols-1 auto-rows-[minmax(0,auto)] pl-0! md:grid-cols-12 md:auto-rows-fr [&>li]:mb-0! [&>li]:list-none [&>li]:before:hidden"
        style={{ gap }}
      >
        {items.map((item, i) => {
          const span = item.span ?? 4;
          const rows = item.rows ?? 1;
          const aspect = item.aspect ?? "4/3";

          return (
            <li
              key={`${item.src}-${i}`}
              className={`group ${SPAN_CLASS[span]} ${ROWS_CLASS[rows]}`}
            >
              <figure className="m-0 h-full">
                <div
                  className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-muted/30"
                  style={{ aspectRatio: aspect }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-2 text-xs text-muted-foreground">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
