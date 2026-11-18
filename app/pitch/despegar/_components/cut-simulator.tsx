"use client";

import { useId, useState } from "react";
import { caseStudy, labels } from "../despegar.data";
import { ExampleBadge } from "./ui";

type Verdict = "ship" | "iterate" | "kill";
type ReasonKey = keyof typeof caseStudy.simulator.reasons;

const sim = caseStudy.simulator;

/**
 * Las reglas de `caseStudy.cut`, en el orden en que se aplican: primero lo que
 * apaga (cualquiera de los tres frenos alcanza), después lo que lanza (tienen
 * que cumplirse todas) y, si no pasa ninguna de las dos, se itera.
 * Revenue neto total = (1 + conversión) × (1 + revenue por orden) − 1: es la
 * forma de ver si lo absorbido se come lo que se gana.
 */
function decide(c: number, interval: boolean, r: number, q: number) {
  const total = ((1 + c / 100) * (1 + r / 100) - 1) * 100;
  let verdict: Verdict;
  let reason: ReasonKey;
  if (c <= -1) [verdict, reason] = ["kill", "killConversion"];
  else if (r < -2) [verdict, reason] = ["kill", "killRevenue"];
  else if (q >= 2) [verdict, reason] = ["kill", "killAirline"];
  else if (c >= 2 && interval && r >= -1 && total > 0) [verdict, reason] = ["ship", "ship"];
  else if (c >= 2 && !interval) [verdict, reason] = ["iterate", "iterateInterval"];
  else if (c < 2) [verdict, reason] = ["iterate", "iterateSmall"];
  else if (r < -1) [verdict, reason] = ["iterate", "iterateRevenue"];
  else [verdict, reason] = ["iterate", "iterateTotal"];
  return { verdict, reason, total };
}

const number = (v: number) =>
  Math.abs(v).toLocaleString("es-AR", { maximumFractionDigits: 1, minimumFractionDigits: 0 });

/** Con signo, con el menos tipográfico que usa el resto de la página. */
function signed(v: number) {
  const rounded = Math.round(v * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${number(rounded)}%`;
}

const times = (v: number) => `×${v.toLocaleString("es-AR", { minimumFractionDigits: 1 })}`;

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
}

function Range({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
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
        <label htmlFor={id} className="text-sm leading-snug text-(--ink-dim)">
          {label}
        </label>
        <output htmlFor={id} className="text-lg font-semibold tabular">
          {display}
        </output>
      </div>
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

/** El criterio de corte, con un resultado inventado que se puede mover. */
export function CutSimulator() {
  const [c, setC] = useState(sim.conversion.initial);
  const [interval, setIntervalOk] = useState(true);
  const [r, setR] = useState(sim.revenue.initial);
  const [q, setQ] = useState(sim.airline.initial);
  const name = useId();

  const { verdict, reason, total } = decide(c, interval, r, q);
  const why = fill(sim.reasons[reason], {
    c: signed(c),
    ca: `${number(c)}%`,
    r: signed(r),
    ra: `${number(r)}%`,
    q: times(q),
    t: signed(total),
    ta: `${number(total)}%`,
  });

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl leading-relaxed">{sim.intro}</p>
          <ExampleBadge>{sim.example}</ExampleBadge>
        </div>

        <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
          <Range
            label={sim.conversion.label}
            display={signed(c)}
            value={c}
            min={sim.conversion.min}
            max={sim.conversion.max}
            step={sim.conversion.step}
            onChange={setC}
          />
          <fieldset>
            <legend className="text-sm leading-snug text-(--ink-dim)">{sim.interval.label}</legend>
            <div className="cut-toggle mt-2">
              {[
                { value: true, text: sim.interval.yes },
                { value: false, text: sim.interval.no },
              ].map((o) => (
                <label key={o.text}>
                  <input
                    type="radio"
                    name={name}
                    checked={interval === o.value}
                    onChange={() => setIntervalOk(o.value)}
                  />
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <Range
            label={sim.revenue.label}
            display={signed(r)}
            value={r}
            min={sim.revenue.min}
            max={sim.revenue.max}
            step={sim.revenue.step}
            onChange={setR}
          />
          <Range
            label={sim.airline.label}
            display={times(q)}
            value={q}
            min={sim.airline.min}
            max={sim.airline.max}
            step={sim.airline.step}
            onChange={setQ}
          />
        </div>

        <div className="mt-7 border-t border-(--rule) pt-5" aria-live="polite">
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
      </div>
    </div>
  );
}
