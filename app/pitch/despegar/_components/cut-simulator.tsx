"use client";

import { useId, useState } from "react";
import { caseStudy, labels } from "../despegar.data";
import { ExampleBadge } from "./ui";

type Verdict = "ship" | "iterate" | "kill";
type ReasonKey = keyof typeof caseStudy.simulator.reasons;
type Result = { c: number; interval: boolean; r: number; q: number };

const sim = caseStudy.simulator;

/**
 * Las reglas de `caseStudy.cut`, en el orden en que se aplican: primero lo que
 * apaga (cualquiera de los tres frenos alcanza), después lo que lanza (tienen
 * que cumplirse todas) y, si no pasa ninguna de las dos, se itera.
 * `q` es cuánto cambia el clic desde el listado, en %: una caída de 5% o más
 * apaga. Revenue total = (1 + conversión) × (1 + revenue por orden) − 1: es la
 * forma de ver si lo que deja cada compra se come lo que se gana.
 */
function decide({ c, interval, r, q }: Result) {
  const total = ((1 + c / 100) * (1 + r / 100) - 1) * 100;
  let verdict: Verdict;
  let reason: ReasonKey;
  if (c <= -1) [verdict, reason] = ["kill", "killConversion"];
  else if (r < -2) [verdict, reason] = ["kill", "killRevenue"];
  else if (q <= -5) [verdict, reason] = ["kill", "killListing"];
  else if (c >= 2 && interval && r >= -1 && total > 0) [verdict, reason] = ["ship", "ship"];
  else if (c >= 2 && !interval) [verdict, reason] = ["iterate", "iterateInterval"];
  else if (c < 2) [verdict, reason] = ["iterate", "iterateSmall"];
  else if (r < -1) [verdict, reason] = ["iterate", "iterateRevenue"];
  else [verdict, reason] = ["iterate", "iterateTotal"];
  return { verdict, reason, total };
}

const number = (v: number) =>
  Math.abs(Math.round(v * 10) / 10).toLocaleString("es-AR", { maximumFractionDigits: 1 });

/** Con signo, con el menos tipográfico que usa el resto de la página. */
function signed(v: number) {
  const rounded = Math.round(v * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${number(rounded)}%`;
}

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
}

function Range({
  label,
  hint,
  display,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  hint: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="leading-snug font-medium">
          {label}
        </label>
        <output htmlFor={id} className="text-lg font-semibold tabular">
          {display}
        </output>
      </div>
      <p className="mt-0.5 text-sm leading-snug text-(--ink-dim)">{hint}</p>
      <input
        id={id}
        type="range"
        className="cut-range mt-2 w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.round(Number(e.target.value) * 10) / 10)}
      />
    </div>
  );
}

/**
 * El criterio de corte, para probarlo. Se elige un resultado posible del
 * experimento (cuatro escenarios de un clic) y se ve qué decisión sale y por
 * qué; los números se pueden ajustar a mano, plegados, para quien quiera ir
 * más fino. Todo es de ejemplo: las reglas son las de arriba.
 */
export function CutSimulator() {
  const [res, setRes] = useState<Result>(sim.scenarios[0]);
  const set = (patch: Partial<Result>) => setRes((prev) => ({ ...prev, ...patch }));
  const name = useId();

  const { verdict, reason, total } = decide(res);
  const why = fill(sim.reasons[reason], {
    c: signed(res.c),
    ca: `${number(res.c)}%`,
    r: signed(res.r),
    ra: `${number(res.r)}%`,
    rw: fill(
      res.r < 0 ? sim.revenueWords.less : res.r > 0 ? sim.revenueWords.more : sim.revenueWords.same,
      { v: `${number(res.r)}%` },
    ),
    qa: `${number(res.q)}%`,
    t: signed(total),
    ta: `${number(total)}%`,
  });
  const active = sim.scenarios.find(
    (s) => s.c === res.c && s.interval === res.interval && s.r === res.r && s.q === res.q,
  )?.id;

  const cuts: { key: Verdict; text: string }[] = [
    { key: "ship", text: caseStudy.cut.ship },
    { key: "iterate", text: caseStudy.cut.iterate },
    { key: "kill", text: caseStudy.cut.kill },
  ];

  return (
    <div className="cut-sim mt-6 max-w-4xl" data-verdict={verdict}>
      <dl className="border-t border-(--ink)">
        {cuts.map((cut) => (
          <div
            key={cut.key}
            className="cut-row grid gap-1 border-b border-(--rule) py-4 md:grid-cols-[10rem_1fr] md:gap-6"
            data-active={cut.key === verdict}
          >
            <dt className="cut-label flex items-center gap-2 font-semibold">
              <span aria-hidden className="cut-dot" />
              {labels.cut[cut.key]}
            </dt>
            <dd className="leading-relaxed">{cut.text}</dd>
          </div>
        ))}
      </dl>

      <div className="is-example mt-8 rounded-lg bg-(--surface) p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-xl leading-relaxed">{sim.intro}</p>
          <ExampleBadge>{sim.example}</ExampleBadge>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-(--ink-dim)">{sim.scenariosLabel}</legend>
          <div className="cut-toggle cut-scenarios mt-2">
            {sim.scenarios.map((s) => (
              <label key={s.id}>
                <input
                  type="radio"
                  name={`${name}-escenario`}
                  checked={active === s.id}
                  onChange={() => setRes(s)}
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6" aria-live="polite">
          <p className="cut-verdict flex items-center gap-3 text-3xl font-semibold tracking-tight">
            <span aria-hidden className="cut-dot" />
            {labels.cut[verdict]}
          </p>
          <p className="mt-3 max-w-2xl leading-relaxed">
            <span className="font-medium">{sim.why}: </span>
            {why}
          </p>
          <p className="mt-2 text-sm text-(--ink-dim)">
            {sim.total}: <span className="font-semibold text-(--ink) tabular">{signed(total)}</span>{" "}
            ({sim.totalNote})
          </p>
        </div>

        <details className="group mt-6 border-t border-(--rule) pt-4">
          <summary className="inline-flex cursor-pointer items-center gap-2 text-sm text-(--seen-ink)">
            <span aria-hidden className="transition-transform duration-500 group-open:rotate-90">
              ›
            </span>
            {sim.manual}
          </summary>
          <div className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-2">
            <Range
              label={sim.conversion.label}
              hint={sim.conversion.hint}
              display={signed(res.c)}
              value={res.c}
              min={sim.conversion.min}
              max={sim.conversion.max}
              step={sim.conversion.step}
              onChange={(c) => set({ c })}
            />
            <fieldset>
              <legend className="leading-snug font-medium">{sim.interval.label}</legend>
              <p className="mt-0.5 text-sm leading-snug text-(--ink-dim)">{sim.interval.hint}</p>
              <div className="cut-toggle mt-2">
                {[
                  { value: true, text: sim.interval.yes },
                  { value: false, text: sim.interval.no },
                ].map((o) => (
                  <label key={o.text}>
                    <input
                      type="radio"
                      name={`${name}-intervalo`}
                      checked={res.interval === o.value}
                      onChange={() => set({ interval: o.value })}
                    />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Range
              label={sim.revenue.label}
              hint={sim.revenue.hint}
              display={signed(res.r)}
              value={res.r}
              min={sim.revenue.min}
              max={sim.revenue.max}
              step={sim.revenue.step}
              onChange={(r) => set({ r })}
            />
            <Range
              label={sim.listing.label}
              hint={sim.listing.hint}
              display={signed(res.q)}
              value={res.q}
              min={sim.listing.min}
              max={sim.listing.max}
              step={sim.listing.step}
              onChange={(q) => set({ q })}
            />
          </div>
        </details>
      </div>
    </div>
  );
}
