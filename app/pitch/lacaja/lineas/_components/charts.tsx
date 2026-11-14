import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { billions, percent, signed, type Line } from "../lineas.data";

/**
 * Los tres gráficos de la página, uno por lectura. Son HTML y CSS, sin
 * librería: filas con el nombre, la marca y la cifra escrita al lado, para que
 * cada valor se lea sin depender del color ni del cursor. El azul es La Caja,
 * el gris es el mercado; el rojo sólo marca lo que da negativo.
 */

/** Posición de un valor dentro de un rango, en porcentaje del ancho. */
const at = (value: number, min: number, max: number) => ((value - min) / (max - min)) * 100;

interface FigureProps {
  title: string;
  note?: string;
  legend?: ReactNode;
  children: ReactNode;
}

function Figure({ title, note, legend, children }: FigureProps) {
  return (
    <figure className="rounded-2xl border border-(--rule) bg-(--surface) p-4 md:p-6">
      <figcaption>
        <p className="font-semibold">{title}</p>
        {note ? <p className="mt-1 text-sm text-(--ink-dim)">{note}</p> : null}
        {legend ? (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-(--ink-dim)">
            {legend}
          </div>
        ) : null}
      </figcaption>
      <div className="mt-5">{children}</div>
    </figure>
  );
}

interface RowProps {
  name: ReactNode;
  value: ReactNode;
  hover: string;
  /** Fila de total: va separada por una línea. */
  total?: boolean;
  children: ReactNode;
}

/** Una fila: nombre, marca y cifra. En celular el nombre y la cifra van arriba de la marca. */
function Row({ name, value, hover, total, children }: RowProps) {
  return (
    <div
      title={hover}
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 py-2.5 md:grid-cols-[13rem_minmax(0,1fr)_11rem]",
        total && "mt-1 border-t border-(--rule) pt-3.5",
      )}
    >
      <p className={cn("leading-snug", total ? "font-semibold" : "font-medium")}>{name}</p>
      <div className="order-3 col-span-2 md:order-2 md:col-span-1">{children}</div>
      <div className="order-2 text-right md:order-3">{value}</div>
    </div>
  );
}

interface MoneyRow {
  label: string;
  value: number;
  total: boolean;
}

/** A · Barras sobre un mismo cero: lo que da negativo va a la izquierda, en rojo. */
export function MoneyChart({
  title,
  note,
  rows,
}: {
  title: string;
  note: string;
  rows: MoneyRow[];
}) {
  const min = Math.min(0, ...rows.map((r) => r.value));
  const max = Math.max(0, ...rows.map((r) => r.value));
  const zero = at(0, min, max);
  return (
    <Figure title={title} note={note}>
      {rows.map((row) => {
        const end = at(row.value, min, max);
        const negative = row.value < 0;
        return (
          <Row
            key={row.label}
            name={row.label}
            total={row.total}
            hover={`${row.label}: ${billions(row.value, true)}`}
            value={<span className="mono font-semibold">{billions(row.value, true)}</span>}
          >
            <div className="relative h-6" aria-hidden>
              <span
                className={cn(
                  "absolute inset-y-0",
                  negative ? "rounded-l bg-(--red)" : "rounded-r bg-(--blue)",
                )}
                style={{ left: `${Math.min(zero, end)}%`, width: `${Math.abs(end - zero)}%` }}
              />
              <span
                className="absolute -inset-y-1.5 w-px bg-(--ink-faint)"
                style={{ left: `${zero}%` }}
              />
            </div>
          </Row>
        );
      })}
    </Figure>
  );
}

interface VersusProps {
  title: string;
  legend: { lacaja: string; market: string };
  axis: { loss: string; gain: string };
  previous: string;
  rows: Line[];
}

/** B · Un punto para La Caja y un aro para el mercado, sobre el mismo eje. */
export function VersusChart({ title, legend, axis, previous, rows }: VersusProps) {
  const values = rows.flatMap((r) => [r.technical, r.market.technical]);
  // El eje se abre un poco más allá del valor más extremo, redondeado a decenas.
  const min = Math.floor(Math.min(...values) / 10) * 10 - 5;
  const max = Math.ceil(Math.max(...values) / 10) * 10 + 5;
  const zero = at(0, min, max);
  return (
    <Figure
      title={title}
      legend={
        <>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-full bg-(--blue)" />
            {legend.lacaja}
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="size-3 rounded-full border-2 border-(--ink-muted) bg-(--surface)"
            />
            {legend.market}
          </span>
        </>
      }
    >
      {rows.map((row) => {
        const own = at(row.technical, min, max);
        const market = at(row.market.technical, min, max);
        return (
          <Row
            key={row.id}
            name={row.label}
            hover={`${row.label}: La Caja ${signed(row.technical)}, mercado ${signed(row.market.technical)}, ${previous} ${signed(row.previous.technical)}`}
            value={
              <p className="mono text-sm leading-snug">
                <span className="block text-base font-semibold">{signed(row.technical)}</span>
                <span className="block text-(--ink-muted)">
                  {legend.market.toLowerCase()} {signed(row.market.technical)}
                </span>
                <span className="block text-xs text-(--ink-muted)">
                  {previous} {signed(row.previous.technical)}
                </span>
              </p>
            }
          >
            <div className="relative h-6" aria-hidden>
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-(--rule)" />
              <span
                className="absolute -inset-y-1.5 w-px bg-(--ink-faint)"
                style={{ left: `${zero}%` }}
              />
              <span
                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-(--ink-faint)"
                style={{ left: `${Math.min(own, market)}%`, width: `${Math.abs(own - market)}%` }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-(--ink-muted) bg-(--surface)"
                style={{ left: `${market}%` }}
              />
              <span
                className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--blue) ring-2 ring-(--surface)"
                style={{ left: `${own}%` }}
              />
            </div>
          </Row>
        );
      })}
      {/* El eje dice de qué lado se pierde y de qué lado se gana, sin obligar a leer una escala. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 md:grid-cols-[13rem_minmax(0,1fr)_11rem]">
        <div className="relative col-span-2 h-5 text-xs text-(--ink-muted) md:col-span-1 md:col-start-2">
          <span className="absolute pr-2" style={{ right: `${100 - zero}%` }}>
            ← {axis.loss}
          </span>
          <span className="absolute pl-2" style={{ left: `${zero}%` }}>
            {axis.gain} →
          </span>
        </div>
      </div>
    </Figure>
  );
}

interface StructureProps {
  title: string;
  note: string;
  legend: { lacaja: string; market: string };
  rows: Line[];
}

/** C · Una barra de 0 a 100 por línea, con una marca donde está el mercado. */
export function StructureChart({ title, note, legend, rows }: StructureProps) {
  return (
    <Figure
      title={title}
      note={note}
      legend={
        <>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-3 w-5 rounded-r bg-(--blue)" />
            {legend.lacaja}
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-4 w-0.5 bg-(--ink)" />
            {legend.market}
          </span>
        </>
      }
    >
      {rows.map((row) => (
        <Row
          key={row.id}
          name={row.label}
          hover={`${row.label}: La Caja ${percent(row.operating)}, mercado ${percent(row.market.operating)}`}
          value={
            <p className="mono text-sm leading-snug">
              <span className="block text-base font-semibold">{percent(row.operating)}</span>
              <span className="block text-(--ink-muted)">
                {legend.market.toLowerCase()} {percent(row.market.operating)}
              </span>
            </p>
          }
        >
          <div className="relative h-6 rounded-r bg-(--surface-deep)" aria-hidden>
            <span
              className="absolute inset-y-0 left-0 rounded-r bg-(--blue)"
              style={{ width: `${Math.min(row.operating, 100)}%` }}
            />
            <span
              className="absolute -inset-y-1 w-0.5 -translate-x-1/2 bg-(--ink) outline-2 outline-(--surface)"
              style={{ left: `${Math.min(row.market.operating, 100)}%` }}
            />
          </div>
        </Row>
      ))}
    </Figure>
  );
}
