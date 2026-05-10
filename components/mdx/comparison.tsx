import type { ReactNode } from "react";

interface ComparisonProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  mode?: "side-by-side" | "stacked";
}

/**
 * Comparación antes/después.
 *
 * Las props `before` y `after` son ReactNode, así que pueden ser imágenes
 * (Figure), código, texto, o cualquier combinación.
 *
 * mode="side-by-side" (default): dos columnas en desktop, apilado en mobile
 * mode="stacked": siempre apilado vertical
 *
 * @example
 * <Comparison
 *   beforeLabel="v1 - 340kb"
 *   afterLabel="v2 - 42kb"
 *   before={<Figure src="/v1.png" alt="Bundle v1" />}
 *   after={<Figure src="/v2.png" alt="Bundle v2" />}
 * />
 */
export function Comparison({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  mode = "side-by-side",
}: ComparisonProps) {
  const gridClass = mode === "side-by-side" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

  return (
    <div className={`my-8 grid gap-4 ${gridClass}`}>
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {beforeLabel}
        </p>
        <div className="[&>figure]:my-0">{before}</div>
      </div>
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {afterLabel}
        </p>
        <div className="[&>figure]:my-0">{after}</div>
      </div>
    </div>
  );
}
