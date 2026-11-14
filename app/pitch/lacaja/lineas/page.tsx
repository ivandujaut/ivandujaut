import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Cite, Tramo, TramoHeading } from "../_components/ui";
import { MoneyChart, StructureChart, VersusChart } from "./_components/charts";
import {
  amount,
  closing,
  intro,
  limits,
  lines,
  meta,
  money,
  percent,
  signed,
  structure,
  table,
  versus,
  type Line,
} from "./lineas.data";

/**
 * Respaldo de la pieza de La Caja: el resultado técnico de cada línea según su
 * balance en la SSN. No está enlazada desde la pieza; es para abrir si la
 * charla llega a qué productos conviene sostener. Misma privacidad que la
 * pieza: `noindex, nofollow`, fuera del sitemap. URL corta: `/lacaja/lineas`
 * (rewrite en `next.config.ts`).
 *
 * Cada tramo es una lectura con su gráfico: se entiende mirando, sin recorrer
 * números. La tabla completa queda plegada al final, como respaldo.
 */
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: meta.title, description: meta.description },
};

const cols = table.columns;

export default function LaCajaLinesPage() {
  return (
    <main id="main" className="relative overflow-x-clip">
      <header className="mx-auto w-full max-w-6xl px-4 pt-10 pb-16 md:px-10 md:pt-14 md:pb-20">
        <Link
          href={intro.backHref}
          className="mono inline-flex items-center gap-1.5 text-xs text-(--ink-muted) underline-offset-4 hover:text-(--ink) hover:underline"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.75} aria-hidden />
          {intro.back}
        </Link>
        <p className="label mt-12 text-(--red)">{intro.kicker}</p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight md:text-6xl md:leading-[1.08]">
          {intro.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{intro.lede}</p>
      </header>

      {/* A · Dónde está la plata. */}
      <Tramo id="plata" deep>
        <TramoHeading index={money.index} eyebrow={money.eyebrow}>
          {money.heading}
        </TramoHeading>
        <div className="reveal mt-10">
          <MoneyChart title={money.chartTitle} note={money.chartNote} rows={money.rows} />
        </div>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
          {money.text}
        </p>
      </Tramo>

      {/* B · Dónde está la pregunta. */}
      <Tramo id="pregunta">
        <TramoHeading index={versus.index} eyebrow={versus.eyebrow}>
          {versus.heading}
        </TramoHeading>
        <div className="reveal mt-10">
          <VersusChart
            title={versus.chartTitle}
            legend={versus.legend}
            axis={versus.axis}
            previous={versus.previous}
            rows={versus.rows}
          />
        </div>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
          {versus.text}
        </p>
      </Tramo>

      {/* C · Por qué puede ser, y la pregunta que queda para adentro. */}
      <Tramo id="estructura" deep>
        <TramoHeading index={structure.index} eyebrow={structure.eyebrow}>
          {structure.heading}
        </TramoHeading>
        <div className="reveal mt-10">
          <StructureChart
            title={structure.chartTitle}
            note={structure.chartNote}
            legend={structure.legend}
            rows={structure.rows}
          />
        </div>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
          {structure.text}
        </p>
        <div className="reveal mt-8 max-w-xl rounded-md border-[1.5px] border-dashed border-(--red) bg-(--surface) p-5">
          <p className="label text-(--red)">{structure.question.label}</p>
          <p className="mt-3 font-serif text-2xl leading-snug">{structure.question.text}</p>
          <p className="mt-3 text-sm leading-relaxed text-(--ink-dim)">{structure.question.why}</p>
        </div>
      </Tramo>

      {/* D · Los límites de la lectura y la tabla completa, plegada. */}
      <Tramo id="limites">
        <TramoHeading index={limits.index} eyebrow={limits.eyebrow}>
          {limits.heading}
        </TramoHeading>
        <ul className="reveal mt-10 grid max-w-4xl gap-x-10 gap-y-3 md:grid-cols-2">
          {limits.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={16}
                strokeWidth={2}
                aria-hidden
                className="mt-1 shrink-0 text-(--ink-muted)"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <details className="group mt-12">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-semibold underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={1.75}
              aria-hidden
              className="shrink-0 transition-transform duration-300 group-open:rotate-90"
            />
            {table.toggle}
          </summary>
          <div
            data-lenis-prevent
            className="mt-5 overflow-x-auto rounded-xl border border-(--rule) bg-(--surface)"
          >
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <thead>
                <tr className="text-left align-bottom text-(--ink-muted)">
                  <Th rowSpan={2}>{cols.line}</Th>
                  <Th rowSpan={2} right>
                    {cols.premiums}
                    <span className="block font-normal normal-case">{cols.premiumsUnit}</span>
                  </Th>
                  <Th rowSpan={2} right>
                    {cols.share}
                  </Th>
                  <Th colSpan={2} group>
                    {cols.operating}
                  </Th>
                  <Th colSpan={4} group>
                    {cols.technical}
                  </Th>
                </tr>
                <tr className="text-(--ink-muted)">
                  <Th right sub>
                    {cols.lacaja}
                  </Th>
                  <Th right sub>
                    {cols.market}
                  </Th>
                  <Th right sub>
                    {cols.lacaja}
                  </Th>
                  <Th right sub>
                    {cols.market}
                  </Th>
                  <Th right sub>
                    {cols.previous}
                  </Th>
                  <Th right sub>
                    {cols.amount}
                  </Th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <TableRow key={line.id} line={line} />
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-[1.5px] border-(--ink-faint) font-semibold">
                  <td className="px-3 py-3">{table.total.label}</td>
                  <Num>{amount(table.total.premiums)}</Num>
                  <Num>100%</Num>
                  <Num>{percent(table.total.operating)}</Num>
                  <td />
                  <Num tone={table.total.technical}>{signed(table.total.technical)}</Num>
                  <td />
                  <td />
                  <Num tone={table.total.technicalAmount}>
                    {table.total.technicalAmount < 0 ? "−" : "+"}
                    {amount(table.total.technicalAmount)}
                  </Num>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-(--ink-muted)">
            {table.footnote}
            <Cite id={table.source} />
          </p>
        </details>
      </Tramo>

      <footer className="bg-(--coal) text-sm text-(--coal-text)">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-10">
          <p className="text-white">{closing.ran}</p>
          <p className="mt-3 max-w-3xl leading-relaxed">{closing.footnote}</p>
          <Link
            href={intro.backHref}
            className="mt-6 inline-flex items-center gap-1.5 underline-offset-4 hover:text-white hover:underline"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} aria-hidden />
            {intro.back}
          </Link>
        </div>
      </footer>
    </main>
  );
}

function TableRow({ line }: { line: Line }) {
  return (
    <tr className={cn("border-t border-(--rule)", line.portal && "bg-(--blue-soft)")}>
      <th scope="row" className="px-3 py-2.5 text-left font-semibold">
        {line.label}
        {line.portal ? (
          <span className="mono ml-2 inline-block rounded-sm border border-(--blue) px-1.5 text-[0.6875rem] font-normal text-(--blue)">
            {line.id === "automotores" ? table.fleetTag : table.portalTag}
          </span>
        ) : null}
      </th>
      <Num>{amount(line.premiums)}</Num>
      <Num>{percent(line.share)}</Num>
      <Num>{percent(line.operating)}</Num>
      <Num muted>{percent(line.market.operating)}</Num>
      <Num tone={line.technical}>{signed(line.technical)}</Num>
      <Num muted>{signed(line.market.technical)}</Num>
      <Num muted>{signed(line.previous.technical)}</Num>
      <Num tone={line.technicalAmount}>
        {line.technicalAmount < 0 ? "−" : "+"}
        {amount(line.technicalAmount)}
      </Num>
    </tr>
  );
}

interface ThProps {
  children: React.ReactNode;
  right?: boolean;
  /** Encabezado que agrupa varias columnas. */
  group?: boolean;
  /** Segunda fila de encabezados. */
  sub?: boolean;
  rowSpan?: number;
  colSpan?: number;
}

function Th({ children, right, group, sub, rowSpan, colSpan }: ThProps) {
  return (
    <th
      scope={group ? "colgroup" : "col"}
      rowSpan={rowSpan}
      colSpan={colSpan}
      className={cn(
        "px-3 text-xs font-semibold",
        sub ? "pt-1 pb-2 font-normal" : "pt-3 pb-2 tracking-wide uppercase",
        right && "text-right",
        group && "border-b border-(--rule) text-center",
      )}
    >
      {children}
    </th>
  );
}

interface NumProps {
  children: React.ReactNode;
  /** Cifras de comparación: van más apagadas que las de La Caja. */
  muted?: boolean;
  /** Si se pasa, pinta en azul lo positivo y en rojo lo negativo. */
  tone?: number;
}

function Num({ children, muted, tone }: NumProps) {
  return (
    <td
      className={cn(
        "mono px-3 py-2.5 text-right whitespace-nowrap",
        muted && "text-(--ink-muted)",
        tone !== undefined && (tone < 0 ? "text-(--red)" : "text-(--blue)"),
      )}
    >
      {children}
    </td>
  );
}
