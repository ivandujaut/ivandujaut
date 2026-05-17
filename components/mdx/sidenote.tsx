"use client";

import { useState, type ReactNode } from "react";

interface SidenoteProps {
  children: ReactNode;
}

/**
 * Tufte/Distill-style margin note. On wide viewports the note floats into the
 * right margin and is always visible. On narrow viewports the marker becomes
 * a tap target that toggles the note inline below the paragraph.
 *
 * Numbering shares the `paper-footnote` CSS counter with `<Footnote>` so the
 * reader sees a single, continuous superscript sequence across both kinds of
 * notes.
 */
export function Sidenote({ children }: SidenoteProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="paper-sidenote-wrap" data-paper-sidenote>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        data-paper-sidenote-marker
        className="paper-sidenote-marker align-super text-[0.7em] font-mono text-foreground/70 underline decoration-dotted underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:cursor-text lg:no-underline lg:hover:text-foreground/70"
      />
      <span className={`paper-sidenote-content ${open ? "paper-sidenote-content--open" : ""}`}>
        {children}
      </span>
    </span>
  );
}
