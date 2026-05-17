"use client";

import { useState, type ReactNode } from "react";

interface FootnoteProps {
  children: ReactNode;
}

/**
 * Inline expandable footnote. A numbered superscript that opens a short note
 * in place when activated. Uses inline-safe elements only (`<span>` and
 * `<button>`) so it remains valid HTML inside an MDX paragraph — unlike a
 * `<details>` element, which is block-level and triggers hydration errors.
 *
 * Shares the `paper-footnote` CSS counter with `<Sidenote>` so both kinds of
 * notes form a single continuous superscript sequence.
 */
export function Footnote({ children }: FootnoteProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="paper-footnote-wrap" data-paper-footnote>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        data-paper-footnote-marker
        className="paper-footnote-marker align-super text-[0.7em] font-mono text-foreground/70 underline decoration-dotted underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <span className={`paper-footnote-content ${open ? "paper-footnote-content--open" : ""}`}>
        {children}
      </span>
    </span>
  );
}
