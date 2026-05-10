import { HugeiconsIcon } from "@hugeicons/react";
import { TradeUpIcon, TradeDownIcon, MinusSignIcon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

interface MetricProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

interface MetricGridProps {
  children: ReactNode;
}

/**
 * Grid responsivo de métricas. 1 columna mobile, 3 desktop.
 *
 * @example
 * <MetricGrid>
 *   <Metric label="Usuarios" value="1.2k" change="+15%" trend="up" />
 *   <Metric label="Tiempo de carga" value="180ms" change="-40%" trend="up" />
 *   <Metric label="Bundle size" value="42kb" />
 * </MetricGrid>
 */
export function MetricGrid({ children }: MetricGridProps) {
  return <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</div>;
}

/**
 * Card individual de métrica.
 *
 * El `change` muestra el delta (ej: "+15%" o "-40%").
 * El `trend` define el color: "up" verde, "down" rojo, "neutral" gris.
 *
 * Importante: trend es semántico, no aritmético. Para "tiempo de carga",
 * una baja es buena, así que pasarías trend="up" aunque el change sea
 * "-40%".
 */
export function Metric({ label, value, change, trend = "neutral" }: MetricProps) {
  const trendConfig = {
    up: {
      icon: TradeUpIcon,
      className: "text-emerald-600 dark:text-emerald-400",
    },
    down: {
      icon: TradeDownIcon,
      className: "text-red-600 dark:text-red-400",
    },
    neutral: {
      icon: MinusSignIcon,
      className: "text-muted-foreground",
    },
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">{value}</p>
      {change && (
        <p className={`mt-1 flex items-center gap-1 text-xs ${trendConfig[trend].className}`}>
          <HugeiconsIcon icon={TrendIcon} size={12} strokeWidth={1.5} />
          {change}
        </p>
      )}
    </div>
  );
}
