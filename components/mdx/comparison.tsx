import type { ReactNode } from "react";

interface ComparisonProps {
  before: ReactNode;
  after: ReactNode;
  /** Optional third panel; activates triptych layout when present. */
  concept?: ReactNode;
  beforeLabel?: string;
  conceptLabel?: string;
  afterLabel?: string;
  /**
   * Layout mode.
   * - `side-by-side` (default): 2 cols on desktop, stacked on mobile.
   * - `stacked`: always vertical.
   * - `triptych`: 3 cols Before/Concept/After. Requires `concept` prop.
   */
  mode?: "side-by-side" | "stacked" | "triptych";
}

/**
 * Before/After (and optional Concept) comparison.
 *
 * Slots accept ReactNode, so they can be `<Figure>`, code blocks, plain text,
 * or any combination. The triptych mode is the Linear-redesign pattern: three
 * static panels with labels above, no slider, no toggle.
 *
 * @example side-by-side
 * <Comparison
 *   beforeLabel="v1 — 340kb"
 *   afterLabel="v2 — 42kb"
 *   before={<Figure src="/v1.png" alt="Bundle v1" />}
 *   after={<Figure src="/v2.png" alt="Bundle v2" />}
 * />
 *
 * @example triptych
 * <Comparison
 *   mode="triptych"
 *   beforeLabel="Before"
 *   conceptLabel="Concept"
 *   afterLabel="After"
 *   before={<Figure src="./before.png" alt="..." />}
 *   concept={<Figure src="./concept.png" alt="..." />}
 *   after={<Figure src="./after.png" alt="..." />}
 * />
 */
export function Comparison({
  before,
  after,
  concept,
  beforeLabel = "Before",
  conceptLabel = "Concept",
  afterLabel = "After",
  mode = "side-by-side",
}: ComparisonProps) {
  const isTriptych = mode === "triptych" && concept !== undefined;
  const gridClass = isTriptych
    ? "grid-cols-1 md:grid-cols-3"
    : mode === "side-by-side"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1";

  const labelClass = "mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground";
  const panelClass = "[&>figure]:my-0";

  return (
    <div className={`my-8 grid gap-4 ${gridClass}`}>
      <div>
        <p className={labelClass}>{beforeLabel}</p>
        <div className={panelClass}>{before}</div>
      </div>
      {isTriptych && (
        <div>
          <p className={labelClass}>{conceptLabel}</p>
          <div className={panelClass}>{concept}</div>
        </div>
      )}
      <div>
        <p className={labelClass}>{afterLabel}</p>
        <div className={panelClass}>{after}</div>
      </div>
    </div>
  );
}
