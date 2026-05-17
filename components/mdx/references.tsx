import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

/**
 * Bibliography-style block placed at the end of a paper-mode article.
 * Entries are declared with `<Reference id="..."/>` children and numbered
 * automatically by the underlying ordered list.
 */
export async function References({ children }: { children: ReactNode }) {
  const t = await getTranslations("paper");
  return (
    <section
      aria-labelledby="paper-references-heading"
      className="paper-references mt-16 border-t border-border pt-8"
    >
      <h2
        id="paper-references-heading"
        className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
      >
        {t("references")}
      </h2>
      <ol className="space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground marker:font-mono marker:text-foreground">
        {children}
      </ol>
    </section>
  );
}

interface ReferenceProps {
  id: string;
  /** Author or authors, e.g. "Vaswani et al." */
  authors?: string;
  /** Publication year. */
  year?: string | number;
  /** Title of the work. */
  title?: string;
  /** Venue (journal, conference, publisher). */
  venue?: string;
  /** URL or DOI. */
  url?: string;
  /** Free-form override — used as-is when provided. */
  children?: ReactNode;
}

/**
 * A single entry in the `<References>` list. When `children` is provided it
 * is rendered as-is; otherwise the entry is composed from the structured
 * props (authors, year, title, venue, url) into an APA-ish line.
 */
export function Reference({ id, authors, year, title, venue, url, children }: ReferenceProps) {
  return (
    <li id={`ref-${id}`} className="scroll-mt-20">
      {children ? (
        children
      ) : (
        <span>
          {authors && <span className="text-foreground">{authors}</span>}
          {year && <span> ({year})</span>}
          {(authors || year) && (title || venue || url) && <span>. </span>}
          {title && <span className="italic">{title}</span>}
          {venue && <span>. {venue}</span>}
          {url && (
            <>
              {" "}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2"
              >
                {url}
              </a>
            </>
          )}
        </span>
      )}
    </li>
  );
}

interface CiteProps {
  /** Reference id, must match the `id` of a `<Reference>`. */
  to: string;
  /** The bracketed number to show — the author keeps it consistent with the
   *  order inside `<References>`. */
  n: number | string;
}

/**
 * Inline citation, renders as a small bracketed superscript number linking to
 * the corresponding entry in the bibliography (e.g. `[3]`).
 */
export function Cite({ to, n }: CiteProps) {
  return (
    <sup className="paper-cite font-mono text-[0.7em]">
      <a
        href={`#ref-${to}`}
        className="text-foreground/70 no-underline hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        [{n}]
      </a>
    </sup>
  );
}
