import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

interface AbstractProps {
  children: ReactNode;
  /** Optional override; defaults to the locale-specific label. */
  label?: string;
}

/**
 * Paper-style Abstract block. Renders a centered, italic-serif callout at the
 * top of a project page — the academic "this is what this paper is about" tile.
 *
 * Pairs with the `.paper` class on the parent `<article>`.
 */
export async function Abstract({ children, label }: AbstractProps) {
  const t = await getTranslations("paper");
  const resolvedLabel = label ?? t("abstract");

  return (
    <section
      aria-label={resolvedLabel}
      className="paper-abstract mx-auto mt-0 mb-12 max-w-xl border-b border-border pb-6"
    >
      <p className="mb-2 text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
        {resolvedLabel}
      </p>
      <div className="text-[1.0625rem] leading-7 text-foreground/90 [&_p]:italic [&_p+p]:mt-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
        {children}
      </div>
    </section>
  );
}
