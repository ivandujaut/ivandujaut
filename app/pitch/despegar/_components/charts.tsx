import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Gráficos de la página, sin librería: barras en HTML (se adaptan solas al
 * ancho) y líneas en SVG. Las animaciones las pone `Reveal` buscando las
 * clases `.chart`, `.bar-fill`, `.col-fill` y `.line-path`. Cada gráfico lleva
 * `aria-label` con lo que muestra.
 */

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });
export const fmt = (n: number) => nf.format(n);

function Frame({
  title,
  label,
  children,
  footer,
  className,
}: {
  title: string;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn("chart reveal rounded-xl bg-(--surface) p-5 md:p-7", className)}
      aria-label={label}
    >
      <figcaption className="text-sm font-medium text-(--ink)">{title}</figcaption>
      <div className="mt-5">{children}</div>
      {footer ? (
        <div className="mt-4 text-xs leading-relaxed text-(--ink-dim)">{footer}</div>
      ) : null}
    </figure>
  );
}

export interface BarRow {
  label: string;
  value: number;
  highlight?: boolean;
}

/** Barras horizontales: una fila por categoría, valor al final de la barra. */
export function HBars({
  title,
  rows,
  unit,
  footer,
  max,
  tone = "seen",
}: {
  title: string;
  rows: readonly BarRow[];
  unit: string;
  footer?: ReactNode;
  max?: number;
  tone?: "seen" | "paid" | "ink";
}) {
  const top = max ?? Math.max(...rows.map((r) => r.value));
  const label = `${title}: ${rows.map((r) => `${r.label} ${fmt(r.value)}${unit}`).join(", ")}`;
  return (
    <Frame title={title} label={label} footer={footer}>
      <ul className="grid gap-3">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span
                className={cn(row.highlight ? "font-semibold text-(--ink)" : "text-(--ink-dim)")}
              >
                {row.label}
              </span>
              <span
                className={cn(
                  "mono shrink-0",
                  row.highlight ? "font-semibold text-(--paid-ink)" : "text-(--ink-dim)",
                )}
              >
                {fmt(row.value)}
                {unit}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-(--surface-deep)">
              <div
                className={cn(
                  "bar-fill h-full rounded-full",
                  row.highlight
                    ? "bg-(--paid)"
                    : tone === "paid"
                      ? "bg-(--paid)/70"
                      : tone === "ink"
                        ? "bg-(--ink)/45"
                        : "bg-(--seen)",
                )}
                style={{ width: `${Math.max(2, (row.value / top) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Columnas verticales con el valor arriba. La última se puede resaltar. */
export function Columns({
  title,
  points,
  unit,
  footer,
  highlightLast,
}: {
  title: string;
  points: readonly { label: string; value: number }[];
  unit: string;
  footer?: ReactNode;
  highlightLast?: boolean;
}) {
  const top = Math.max(...points.map((p) => p.value));
  const label = `${title}: ${points.map((p) => `${p.label} ${fmt(p.value)}${unit}`).join(", ")}`;
  return (
    <Frame title={title} label={label} footer={footer}>
      <div className="flex h-56 items-end gap-2 md:gap-4">
        {points.map((p, i) => {
          const last = highlightLast && i === points.length - 1;
          return (
            <div
              key={p.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span
                className={cn(
                  "mono text-xs",
                  last ? "font-semibold text-(--seen-ink)" : "text-(--ink-dim)",
                )}
              >
                {fmt(p.value)}
                {unit}
              </span>
              <div
                className={cn(
                  "col-fill w-full rounded-t-md",
                  last ? "bg-(--seen)" : "bg-(--seen)/35",
                )}
                style={{ height: `${(p.value / top) * 100}%` }}
              />
              <span className="mono text-[0.7rem] text-(--ink-dim)">{p.label}</span>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/** Posición de un rótulo en HTML sobre el área del gráfico, en porcentajes. */
function align(i: number, n: number) {
  if (i === 0) return "translate-x-0";
  if (i === n - 1) return "-translate-x-full";
  return "-translate-x-1/2";
}

/**
 * Línea simple: el trazo es un SVG estirado (el grosor no escala) y los
 * rótulos van en HTML encima, así la letra tiene el mismo tamaño en el
 * celular y en la pantalla grande. Rotula el primero, el pico y el último.
 */
export function Line({
  title,
  points,
  footer,
  callout,
  unit = "",
}: {
  title: string;
  points: readonly { label: string; value: number }[];
  footer?: ReactNode;
  callout?: string;
  unit?: string;
}) {
  const values = points.map((p) => p.value);
  const lo = Math.min(...values) * 0.97;
  const hi = Math.max(...values) * 1.02;
  const n = points.length;
  const x = (i: number) => 2 + (i / (n - 1)) * 96;
  const y = (v: number) => 10 + (1 - (v - lo) / (hi - lo)) * 80;
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`)
    .join(" ");
  const peak = values.indexOf(Math.max(...values));
  const marked = [0, peak, n - 1].filter((v, i, arr) => arr.indexOf(v) === i);
  const label = `${title}: ${points.map((p) => `${p.label} ${fmt(p.value)}${unit}`).join(", ")}`;

  return (
    <Frame title={title} label={label} footer={footer}>
      {callout ? (
        <p className="mono mb-3 text-sm font-semibold text-(--paid-ink)">{callout}</p>
      ) : null}
      <div className="relative h-52 border-b border-(--rule)" aria-hidden>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <path
            d={d}
            className="line-path"
            fill="none"
            stroke="var(--seen)"
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        {points.map((p, i) => (
          <span
            key={p.label}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
              marked.includes(i) ? "size-2.5" : "size-1.5",
              i === n - 1 ? "bg-(--paid)" : "bg-(--seen)",
            )}
            style={{ left: `${x(i)}%`, top: `${y(p.value)}%` }}
          />
        ))}
        {marked.map((i) => (
          <span
            key={`v-${i}`}
            className={cn("mono absolute -translate-y-[160%] text-xs text-(--ink)", align(i, n))}
            style={{ left: `${x(i)}%`, top: `${y(points[i].value)}%` }}
          >
            {fmt(points[i].value)}
            {unit}
          </span>
        ))}
      </div>
      <div className="relative mt-2 h-4" aria-hidden>
        {marked.map((i) => (
          <span
            key={`l-${i}`}
            className={cn("mono absolute top-0 text-[0.7rem] text-(--ink-dim)", align(i, n))}
            style={{ left: `${x(i)}%` }}
          >
            {points[i].label}
          </span>
        ))}
      </div>
    </Frame>
  );
}

/**
 * Dos medidas del mismo año: barras (socios de Pasaporte) y una línea con su
 * propia escala de 0 a 100 (recompra), para que se vea tan plana como es. El
 * contraste entre lo que crece y lo que no es todo el gráfico. Barras en
 * HTML, la línea en un SVG estirado y los rótulos en HTML.
 */
export function BarsAndLine({
  title,
  rows,
  barLabel,
  lineLabel,
  footer,
}: {
  title: string;
  rows: readonly { label: string; bar: number; line: number }[];
  barLabel: string;
  lineLabel: string;
  footer?: ReactNode;
}) {
  const barMax = Math.max(...rows.map((r) => r.bar));
  const n = rows.length;
  const cx = (i: number) => ((i + 0.5) / n) * 100;
  const d = rows
    .map((r, i) => `${i === 0 ? "M" : "L"}${cx(i).toFixed(2)},${(100 - r.line).toFixed(2)}`)
    .join(" ");
  const label = `${title}. ${barLabel}: ${rows.map((r) => `${r.label} ${fmt(r.bar)}`).join(", ")}. ${lineLabel}: ${rows.map((r) => `${r.label} ${fmt(r.line)}%`).join(", ")}.`;

  return (
    <Frame title={title} label={label} footer={footer}>
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-(--ink-dim)">
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block size-2.5 rounded-sm bg-(--seen)/40" />
          {barLabel}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-0.5 w-4 bg-(--paid)" />
          {lineLabel}
        </span>
      </div>
      <div className="relative h-72 border-b border-(--rule) md:h-80" aria-hidden>
        <div className="absolute inset-0 flex items-end">
          {rows.map((r) => (
            <div key={r.label} className="flex h-full flex-1 items-end justify-center">
              <div
                className="col-fill flex w-[62%] max-w-32 items-end justify-center rounded-t-lg bg-(--seen)/35 pb-3 md:w-[45%]"
                style={{ height: `${(r.bar / barMax) * 100}%` }}
              >
                <span className="mono text-xs font-semibold whitespace-nowrap text-(--seen-ink) md:text-base">
                  {fmt(r.bar)} M
                </span>
              </div>
            </div>
          ))}
        </div>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <path
            d={d}
            className="line-path"
            fill="none"
            stroke="var(--paid)"
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        </svg>
        {rows.map((r, i) => (
          <div
            key={`p-${r.label}`}
            className="absolute"
            style={{ left: `${cx(i)}%`, top: `${100 - r.line}%` }}
          >
            <span className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--paid)" />
            <span className="mono absolute bottom-3 -translate-x-1/2 rounded bg-(--surface) px-1.5 text-sm font-semibold whitespace-nowrap text-(--paid-ink) md:text-base">
              {fmt(r.line)}%
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex" aria-hidden>
        {rows.map((r) => (
          <span key={r.label} className="mono flex-1 text-center text-xs text-(--ink-dim)">
            {r.label}
          </span>
        ))}
      </div>
    </Frame>
  );
}

/** Columnas apiladas (métrica norte abierta en partes). Sólo para datos de ejemplo. */
export function StackedColumns({
  title,
  rows,
  keys,
  unit,
  footer,
  className,
}: {
  title: string;
  rows: readonly ({ label: string } & Record<string, number | string>)[];
  keys: readonly { key: string; label: string; color: string }[];
  unit: string;
  footer?: ReactNode;
  className?: string;
}) {
  const totals = rows.map((r) => keys.reduce((s, k) => s + Number(r[k.key]), 0));
  const top = Math.max(...totals);
  const label = `${title}: ${rows.map((r, i) => `${r.label} ${fmt(totals[i])} ${unit}`).join(", ")}`;
  return (
    <Frame title={title} label={label} footer={footer} className={className}>
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-(--ink-dim)">
        {keys.map((k) => (
          <span key={k.key} className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-2.5 rounded-sm"
              style={{ background: k.color }}
            />
            {k.label}
          </span>
        ))}
      </div>
      <div className="flex h-56 items-end gap-3 md:gap-5">
        {rows.map((r, i) => (
          <div key={r.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="mono text-xs text-(--ink-dim)">{fmt(totals[i])}</span>
            <div
              className="col-fill flex w-full flex-col-reverse overflow-hidden rounded-t-md"
              style={{ height: `${(totals[i] / top) * 100}%` }}
            >
              {keys.map((k) => (
                <div
                  key={k.key}
                  style={{
                    height: `${(Number(r[k.key]) / totals[i]) * 100}%`,
                    background: k.color,
                  }}
                />
              ))}
            </div>
            <span className="mono text-[0.7rem] text-(--ink-dim)">{r.label}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}
