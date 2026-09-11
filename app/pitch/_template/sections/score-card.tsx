"use client";

import type { Pitch } from "@/pitches/types";
import { formatArs, formatCount, formatPct } from "../lib/format";

export const GAUGE_R = 44;
export const GAUGE_LENGTH = 2 * Math.PI * GAUGE_R;

interface ScoreCardProps {
  card: Pitch["case"]["card"];
  open: boolean;
  onToggle: () => void;
}

/**
 * Maqueta del score. Es presentacional: el llenado de barras y gauge lo
 * maneja `CaseStory` (que sabe en qué paso del relato está el lector), y el
 * botón es estado React de verdad. Todo lo que muestra es de ejemplo y lo
 * dice arriba.
 */
export function ScoreCard({ card, open, onToggle }: ScoreCardProps) {
  const { advance } = card;
  const money = advance.format === "count" ? formatCount : formatArs;
  return (
    <div
      className="score-card rounded-2xl border border-(--pitch-line) bg-card/60 p-5 md:p-7"
      aria-label={`${card.kicker}, ${card.badge}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-(--pitch-ink-dim) uppercase">
            {card.kicker}
          </p>
          <p className="mt-1 text-base font-semibold">{card.projectName}</p>
        </div>
        <span className="rounded-full border border-amber-400/50 bg-amber-400/10 px-2.5 py-1 font-mono text-[0.7rem] text-amber-200">
          {card.badge}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-5">
        <div className="relative size-28 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r={GAUGE_R}
              fill="none"
              stroke="var(--pitch-line)"
              strokeWidth="5"
            />
            <circle
              className="gauge-fill"
              cx="50"
              cy="50"
              r={GAUGE_R}
              fill="none"
              stroke="var(--pitch-accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={GAUGE_LENGTH}
              strokeDashoffset={GAUGE_LENGTH * (1 - card.totalScore / 100)}
            />
          </svg>
          <p className="absolute inset-0 flex items-center justify-center font-serif text-4xl leading-none font-semibold tabular-nums">
            <span className="score-total">{card.totalScore}</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-xs text-(--pitch-ink-dim)">{card.totalLabel}</p>
          <p className="mt-1 max-w-[16rem] text-sm text-(--pitch-ink-dim)">{card.totalNote}</p>
        </div>
      </div>

      <ol className="mt-6 space-y-4">
        {card.indicators.map((ind) => (
          <li key={ind.id} className="indicator">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>
                {ind.label}
                {ind.hint ? <span className="text-(--pitch-ink-dim)"> · {ind.hint}</span> : null}
              </span>
              <span className="shrink-0 font-mono text-xs text-(--pitch-ink-dim)">{ind.value}</span>
            </div>
            <div
              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--pitch-line)"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={ind.score}
              aria-label={ind.label}
            >
              <div
                className="bar-fill h-full rounded-full bg-(--pitch-accent)"
                style={{ width: `${ind.score}%` }}
              />
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="advance-card"
        className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-(--pitch-accent-strong) px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 md:w-auto"
      >
        {open ? card.cta.close : card.cta.open}
      </button>

      <div
        id="advance-card"
        hidden={!open}
        className="mt-4 rounded-lg border border-(--pitch-accent)/40 bg-(--pitch-accent-soft) p-4 text-sm"
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-(--pitch-ink-dim)">{advance.scheduledLabel}</dt>
            <dd className="mt-0.5 font-mono text-base tabular-nums">
              {money(advance.scheduledAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-(--pitch-ink-dim)">
              {advance.availableLabel} (hasta {formatPct(advance.maxAdvancePct)})
            </dt>
            <dd className="mt-0.5 font-mono text-base font-semibold text-(--pitch-accent) tabular-nums">
              {money(advance.maxAdvance)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-(--pitch-ink-dim)">
          {advance.eligibility} {advance.repayment}
        </p>
      </div>
    </div>
  );
}
