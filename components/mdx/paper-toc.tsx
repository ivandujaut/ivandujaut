"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
  number: string;
}

interface PaperTocProps {
  /** CSS selector for the container whose headings should be listed. */
  containerSelector?: string;
  /** Heading shown above the list, e.g. "Contents". */
  label: string;
  /**
   * Prefix each entry with a section number (1., 1.1., ...). Right for papers,
   * wrong for case studies, whose headings read as prose rather than sections.
   */
  numbered?: boolean;
}

/**
 * Sticky table of contents with scroll-spy. Listed only on wide viewports
 * (xl and up) so it never crowds the reading column on narrower screens.
 *
 * Reads h2/h3 from the document on mount, then tracks which heading is
 * currently in the viewport via IntersectionObserver to highlight it.
 */
export function PaperToc({
  containerSelector = "#paper-article",
  label,
  numbered = true,
}: PaperTocProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const nodes = container.querySelectorAll<HTMLHeadingElement>(
      "h2[id]:not(#paper-references-heading), h3[id]",
    );
    let section = 0;
    let subsection = 0;
    const list: Heading[] = Array.from(nodes).map((node) => {
      const level = node.tagName === "H2" ? 2 : 3;
      if (level === 2) {
        section += 1;
        subsection = 0;
      } else {
        subsection += 1;
      }
      const number = numbered ? (level === 2 ? `${section}.` : `${section}.${subsection}.`) : "";
      return {
        id: node.id,
        text: node.textContent?.trim() ?? "",
        level,
        number,
      };
    });
    // Reading headings from the DOM is a one-shot subscription to an external
    // source (the rendered article). Setting state from it is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(list);
    if (list.length > 0) setActiveId(list[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      {
        // Band starts just below the sticky nav (scroll-mt-20 = 5rem = 80px)
        // and ends ~half a viewport down, so an anchor-clicked heading lands
        // inside the band and is detected immediately.
        rootMargin: "-80px 0px -50% 0px",
        threshold: 0,
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [containerSelector, numbered]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label={label}
      className="paper-toc pointer-events-auto fixed top-[calc(3.5rem+2rem+0.5rem)] left-[calc(50%-37rem)] z-20 hidden w-56 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-border/40 bg-background/85 p-4 backdrop-blur-md supports-backdrop-filter:bg-background/70 xl:block"
    >
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <ol className="space-y-1.5 text-sm">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${heading.id}`}
                onClick={() => setActiveId(heading.id)}
                title={heading.text}
                className={`block truncate border-l-[3px] py-0.5 pl-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  isActive
                    ? "border-foreground font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {heading.number ? (
                  <span className="mr-1.5 font-mono text-[0.85em] tabular-nums text-muted-foreground">
                    {heading.number}
                  </span>
                ) : null}
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
