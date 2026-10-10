"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { firstStep, type LedgerRow } from "../brinta.data";
import { ExampleBadge } from "./tramo";

type Phase = "ours" | "overlay" | "adjusted" | "silenced";

const data = firstStep.ledger;
const rows: LedgerRow[] = data.rows;

function fmt(n: number, { signed = false } = {}): string {
  const abs = Math.abs(Math.round(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (n < 0) return `−${abs}`;
  if (signed && n > 0) return `+${abs}`;
  return abs;
}

const totalOurs = rows.reduce((sum, r) => sum + r.ours, 0);
const totalFisco = rows.reduce((sum, r) => sum + r.fisco, 0);
const totalFavor = rows
  .filter((r) => r.status === "favor")
  .reduce((sum, r) => sum + (r.fisco - r.ours), 0);
const totalPending = rows
  .filter((r) => r.status === "pendiente")
  .reduce((sum, r) => sum + (r.fisco - r.ours), 0);

/**
 * El libro mayor del caso "Diferencias CBS". Arranca con la cuenta que arma
 * Brinta; al superponer la del fisco se encienden las diferencias, cada una
 * con su motivo. Después hay dos caminos: proponer el ajuste o no hacer nada,
 * y en ese caso cae el sello. Todo con datos de ejemplo.
 *
 * Es interactivo a propósito: en la entrevista se toca, no se describe.
 */
export function Ledger() {
  const [phase, setPhase] = useState<Phase>("ours");
  const revealed = phase !== "ours";

  const go = (next: Phase) => setPhase(next);

  return (
    <div className="relative -mr-5 -ml-12 md:mx-0">
      <div
        className={cn(
          "relative overflow-hidden rounded-md border border-(--rule) bg-(--paper-deep) p-4 md:p-6",
          phase === "silenced" && "border-(--risk)",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="num text-xs tracking-widest text-(--ink-dim) uppercase">
            CBS · {data.period} · {data.currency}
          </p>
          <ExampleBadge>{data.exampleBadge}</ExampleBadge>
        </div>

        <table className="num mt-4 w-full table-fixed border-collapse text-[13px] md:text-sm">
          <colgroup>
            <col />
            <col className="w-[4.2rem] md:w-28" />
            <col className="w-[4.2rem] md:w-28" />
            <col className="w-[4.2rem] md:w-28" />
          </colgroup>
          <thead>
            <tr className="border-b border-(--ink-faint) text-left text-[11px] text-(--ink-dim) md:text-xs">
              <th className="py-2 pr-2 font-normal">{data.columns.doc}</th>
              <th className="py-2 text-right font-normal">
                <span className="md:hidden">Brinta</span>
                <span className="hidden md:inline">{data.columns.ours}</span>
              </th>
              <th className="py-2 text-right font-normal">
                <span className="md:hidden">Fisco</span>
                <span className="hidden md:inline">{data.columns.fisco}</span>
              </th>
              <th className="py-2 text-right font-normal">
                <span className="md:hidden">Dif.</span>
                <span className="hidden md:inline">{data.columns.diff}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const diff = row.fisco - row.ours;
              const flagged = revealed && Boolean(row.reason);
              const tone =
                row.status === "pendiente"
                  ? "bg-(--fisco-soft)"
                  : row.status === "favor"
                    ? "bg-(--trapped-soft)"
                    : "";
              const fixed = phase === "adjusted" && row.status === "favor";
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-(--rule) align-top transition-colors duration-500",
                    flagged && tone,
                  )}
                  style={{ transitionDelay: revealed ? `${i * 70}ms` : "0ms" }}
                >
                  <td className="py-2.5 pr-2">
                    <span className="font-sans font-medium text-(--ink)">{row.doc}</span>
                    <span className="block font-sans text-[11px] text-(--ink-dim) md:text-xs">
                      {row.kind}
                    </span>
                    {flagged ? (
                      <span
                        className={cn(
                          "mt-1 block font-sans text-[11px] leading-snug md:text-xs",
                          row.status === "pendiente" ? "text-(--ink)" : "text-(--trapped-ink)",
                        )}
                      >
                        {fixed ? "Ajuste propuesto: " : null}
                        {row.reason}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2.5 text-right">{fmt(row.ours)}</td>
                  <td
                    className={cn(
                      "py-2.5 text-right transition-opacity duration-500",
                      revealed ? "opacity-100" : "opacity-0",
                    )}
                    style={{ transitionDelay: revealed ? `${i * 70}ms` : "0ms" }}
                  >
                    {fmt(row.fisco)}
                  </td>
                  <td
                    className={cn(
                      "py-2.5 text-right transition-opacity duration-500",
                      revealed ? "opacity-100" : "opacity-0",
                      diff !== 0 &&
                        (row.status === "pendiente" ? "text-(--ink)" : "text-(--trapped-ink)"),
                      diff !== 0 && "font-semibold",
                    )}
                    style={{ transitionDelay: revealed ? `${i * 70 + 120}ms` : "0ms" }}
                  >
                    {diff === 0 ? "0" : fmt(diff, { signed: true })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="double-rule font-semibold">
              <td className="py-3 pr-2 font-sans">{data.totalLabel}</td>
              <td className="py-3 text-right">{fmt(totalOurs)}</td>
              <td
                className={cn(
                  "py-3 text-right transition-opacity duration-500",
                  revealed ? "opacity-100" : "opacity-0",
                )}
              >
                {fmt(totalFisco)}
              </td>
              <td
                className={cn(
                  "py-3 text-right text-(--trapped-ink) transition-opacity duration-500",
                  revealed ? "opacity-100" : "opacity-0",
                )}
              >
                {fmt(totalFisco - totalOurs, { signed: true })}
              </td>
            </tr>
          </tfoot>
        </table>

        <div
          aria-live="polite"
          className="mt-5 min-h-[4.5rem] font-sans text-sm leading-relaxed md:text-base"
        >
          {phase === "ours" ? (
            <p className="text-(--ink-dim)">
              La cuenta que arma Brinta con las facturas que emite y las que captura.
            </p>
          ) : null}
          {phase === "overlay" ? (
            <>
              <p className="font-semibold text-(--risk)">{data.deadline}</p>
              <p className="mt-1">
                <span className="num font-semibold text-(--trapped-ink)">
                  {data.currency} {fmt(totalFavor)}
                </span>{" "}
                <span className="text-(--ink-dim)">{data.summary.favor}</span>
              </p>
              <p>
                <span className="num font-semibold">
                  {data.currency} {fmt(totalPending)}
                </span>{" "}
                <span className="text-(--ink-dim)">{data.summary.pendiente}</span>
              </p>
            </>
          ) : null}
          {phase === "adjusted" ? (
            <p className="font-semibold text-(--ok)">{data.summary.adjusted}</p>
          ) : null}
          {phase === "silenced" ? (
            <p className="font-semibold text-(--risk)">{data.summary.silenced}</p>
          ) : null}
        </div>

        {phase === "silenced" ? (
          <div
            aria-hidden
            className="stamp pointer-events-none rounded-md border-[3px] border-(--risk) bg-(--paper)/85 px-5 py-2 text-center font-sans text-lg font-bold whitespace-nowrap text-(--risk) md:text-2xl"
          >
            {data.summary.stamp}
          </div>
        ) : null}
      </div>

      <div className="mt-4 ml-12 flex flex-wrap gap-3 md:ml-0">
        {phase === "ours" ? (
          <button
            type="button"
            onClick={() => go("overlay")}
            className="rounded-md bg-(--ink) px-4 py-2.5 text-sm font-medium text-(--paper) transition-opacity hover:opacity-90"
          >
            {data.actions.overlay}
          </button>
        ) : null}
        {phase === "overlay" ? (
          <>
            <button
              type="button"
              onClick={() => go("adjusted")}
              className="rounded-md bg-(--ink) px-4 py-2.5 text-sm font-medium text-(--paper) transition-opacity hover:opacity-90"
            >
              {data.actions.adjust}
            </button>
            <button
              type="button"
              onClick={() => go("silenced")}
              className="rounded-md border border-(--ink-faint) px-4 py-2.5 text-sm transition-colors hover:bg-(--paper-deep)"
            >
              {data.actions.ignore}
            </button>
          </>
        ) : null}
        {phase === "adjusted" || phase === "silenced" ? (
          <button
            type="button"
            onClick={() => go("ours")}
            className="rounded-md border border-(--ink-faint) px-4 py-2.5 text-sm transition-colors hover:bg-(--paper-deep)"
          >
            {data.actions.reset}
          </button>
        ) : null}
      </div>
    </div>
  );
}
