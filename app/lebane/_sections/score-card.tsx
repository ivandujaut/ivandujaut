"use client";

import { useState } from "react";
import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { formatArs, formatPct } from "../_lib/format";
import { scoreCardExample as data } from "../lebane.data";

const GAUGE_R = 44;
const GAUGE_LENGTH = 2 * Math.PI * GAUGE_R;

/**
 * Maqueta interactiva del Score de Obra. Los indicadores se llenan con el
 * scroll y el score sube hasta su valor; el botón es estado React de verdad.
 * Todo lo que muestra es de ejemplo y lo dice arriba.
 */
export function ScoreCard() {
  const [open, setOpen] = useState(false);

  const ref = useGsapSection<HTMLDivElement>(({ root, q }) => {
    const total = root.querySelector<HTMLElement>(".score-total");
    const original = total?.textContent ?? "";
    const proxy = { n: 0 };
    const gauge = root.querySelector<SVGCircleElement>(".gauge-fill");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 80%", end: "center 45%", scrub: 0.5 },
    });
    if (gauge) {
      tl.from(gauge, { strokeDashoffset: GAUGE_LENGTH, duration: 1.6, ease: "none" }, 0);
    }
    tl.from(q(".bar-fill"), {
      scaleX: 0,
      transformOrigin: "left center",
      stagger: 0.2,
      duration: 0.8,
      ease: "none",
    });
    if (total) {
      tl.to(
        proxy,
        {
          n: data.totalScore,
          duration: 1.6,
          ease: "none",
          onUpdate: () => {
            total.textContent = String(Math.round(proxy.n));
          },
        },
        0,
      );
    }
    return () => {
      if (total) total.textContent = original;
    };
  });

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-(--lebane-line) bg-card/60 p-5 md:p-7"
      aria-label="Maqueta del Score de Obra, datos de ejemplo"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-(--lebane-ink-dim) uppercase">
            Score de Obra
          </p>
          <p className="mt-1 text-base font-semibold">{data.projectName}</p>
        </div>
        <span className="rounded-full border border-amber-400/50 bg-amber-400/10 px-2.5 py-1 font-mono text-[0.7rem] text-amber-200">
          datos de ejemplo
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
              stroke="var(--lebane-line)"
              strokeWidth="5"
            />
            <circle
              className="gauge-fill"
              cx="50"
              cy="50"
              r={GAUGE_R}
              fill="none"
              stroke="var(--lebane-accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={GAUGE_LENGTH}
              strokeDashoffset={GAUGE_LENGTH * (1 - data.totalScore / 100)}
            />
          </svg>
          <p className="absolute inset-0 flex items-center justify-center font-serif text-4xl leading-none font-semibold tabular-nums">
            <span className="score-total">{data.totalScore}</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-xs text-(--lebane-ink-dim)">sobre 100</p>
          <p className="mt-1 max-w-[16rem] text-sm text-(--lebane-ink-dim)">
            Cinco indicadores que la desarrolladora ya carga. Ninguno viene de afuera.
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-4">
        {data.indicators.map((ind) => (
          <li key={ind.id} className="indicator">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>
                {ind.label}
                {ind.hint ? <span className="text-(--lebane-ink-dim)"> · {ind.hint}</span> : null}
              </span>
              <span className="shrink-0 font-mono text-xs text-(--lebane-ink-dim)">
                {ind.value}
              </span>
            </div>
            <div
              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--lebane-line)"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={ind.score}
              aria-label={ind.label}
            >
              <div
                className="bar-fill h-full rounded-full bg-(--lebane-accent)"
                style={{ width: `${ind.score}%` }}
              />
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="advance-card"
        className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-(--lebane-accent-strong) px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 md:w-auto"
      >
        {open ? "Cerrar" : "Adelantar cobranzas"}
      </button>

      <div
        id="advance-card"
        hidden={!open}
        className="mt-4 rounded-lg border border-(--lebane-accent)/40 bg-(--lebane-accent-soft) p-4 text-sm"
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-(--lebane-ink-dim)">Cuotas programadas, próximos 90 días</dt>
            <dd className="mt-0.5 font-mono text-base tabular-nums">
              {formatArs(data.advance.scheduledNext90Days)}
            </dd>
          </div>
          <div>
            <dt className="text-(--lebane-ink-dim)">
              Disponible hoy (hasta {formatPct(data.advance.maxAdvancePct)})
            </dt>
            <dd className="mt-0.5 font-mono text-base font-semibold text-(--lebane-accent) tabular-nums">
              {formatArs(data.advance.maxAdvance)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-(--lebane-ink-dim)">
          Sólo cuotas de compradores con historial en término. {data.advance.repayment}.
        </p>
      </div>
    </div>
  );
}
