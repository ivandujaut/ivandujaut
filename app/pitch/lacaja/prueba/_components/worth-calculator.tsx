"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExampleBadge } from "../../_components/ui";
import { worthCopy, type WorthField } from "../prueba.data";
import { worth, type WorthInputs } from "../worth";

type Values = Record<keyof WorthInputs, string>;

const copy = worthCopy;
const fields = copy.groups.flatMap((group) => group.fields);
const empty = Object.fromEntries(fields.map((f) => [f.id, ""])) as Values;
const example = Object.fromEntries(fields.map((f) => [f.id, f.example])) as Values;

const integer = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });
const pesos = (value: number) => `$ ${integer.format(Math.round(Math.abs(value)))}`;

/** Deja sólo lo que el campo admite: dígitos, y una coma decimal en las tasas. */
function sanitize(raw: string, kind: WorthField["kind"]) {
  if (kind !== "rate") return raw.replace(/\D/g, "");
  const [whole, ...rest] = raw
    .replace(/\./g, ",")
    .replace(/[^\d,]/g, "")
    .split(",");
  return rest.length ? `${whole},${rest.join("")}` : whole;
}

const toNumber = (value: string) => Number(value.replace(",", "."));
const shown = (value: string, kind: WorthField["kind"]) =>
  kind === "rate" || value === "" ? value : integer.format(Number(value));

function months(value: number) {
  if (value < 1) return "menos de un mes";
  const whole = Math.ceil(value);
  return whole === 1 ? "un mes" : `${integer.format(whole)} meses`;
}

/**
 * La cuenta de si conviene, para llenar en la charla con los números de quien
 * escucha. Arranca vacía a propósito: ninguno de los nueve datos es público.
 * El botón de ejemplo sólo sirve para ver cómo se mueve.
 */
export function WorthCalculator({ auditEvery }: { auditEvery: number }) {
  const [values, setValues] = useState<Values>(empty);
  const usingExample = fields.every((f) => values[f.id] === f.example);
  const complete = fields.every((f) => values[f.id] !== "");
  const result = complete
    ? worth(
        Object.fromEntries(
          fields.map((f) => [f.id, toNumber(values[f.id])]),
        ) as unknown as WorthInputs,
        auditEvery,
      )
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <div className="rounded-2xl border border-(--rule) bg-(--surface) p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setValues(example)}
            className="btn border border-(--ink-faint) text-(--ink) hover:bg-(--surface-deep)"
          >
            {copy.loadExample}
          </button>
          <button
            type="button"
            onClick={() => setValues(empty)}
            disabled={fields.every((f) => values[f.id] === "")}
            className="btn text-(--ink-dim) hover:bg-(--surface-deep)"
          >
            {copy.clear}
          </button>
        </div>
        {usingExample ? (
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-(--ink-dim)">
            <ExampleBadge>datos de ejemplo</ExampleBadge>
            {copy.exampleNote}
          </p>
        ) : null}

        <div className="mt-6 space-y-8">
          {copy.groups.map((group) => (
            <fieldset key={group.title}>
              <legend className="label text-(--red)">{group.title}</legend>
              <div className="mt-3 divide-y divide-(--rule)">
                {group.fields.map((field) => (
                  <div
                    key={field.id}
                    className="grid gap-x-4 gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start"
                  >
                    <div>
                      <label htmlFor={`worth-${field.id}`} className="font-semibold">
                        {field.label}
                      </label>
                      {field.hint ? (
                        <p
                          id={`worth-${field.id}-hint`}
                          className="mt-0.5 text-sm text-(--ink-dim)"
                        >
                          {field.hint}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 rounded-md border border-(--ink-faint) bg-(--surface) px-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--blue)">
                      {field.kind === "money" ? (
                        <span aria-hidden className="mono text-sm text-(--ink-muted)">
                          $
                        </span>
                      ) : null}
                      <input
                        id={`worth-${field.id}`}
                        inputMode={field.kind === "rate" ? "decimal" : "numeric"}
                        autoComplete="off"
                        aria-describedby={field.hint ? `worth-${field.id}-hint` : undefined}
                        value={shown(values[field.id], field.kind)}
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field.id]: sanitize(event.target.value, field.kind),
                          }))
                        }
                        className="mono w-full min-w-0 bg-transparent py-2 text-right outline-none"
                      />
                      {field.suffix ? (
                        <span aria-hidden className="mono text-sm text-(--ink-muted)">
                          {field.suffix}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-6" aria-live="polite">
        {result === null ? (
          <p className="rounded-2xl border-[1.5px] border-dashed border-(--red) bg-(--surface) p-5 font-serif text-xl leading-snug">
            {copy.empty}
          </p>
        ) : (
          <>
            <div className="rounded-2xl border border-(--rule) bg-(--surface) p-5">
              <p className="label text-(--ink-muted)">{copy.account.title}</p>
              <p className="mt-2 text-sm text-(--ink-dim)">
                {integer.format(Math.round(result.auto))} {copy.account.auto}
              </p>
              <dl className="mono mt-4 space-y-2 text-sm">
                <Line term={copy.account.saving} value={pesos(result.saving)} />
                <Line term={copy.account.control} value={pesos(result.control)} minus />
                <Line
                  term={copy.account.error}
                  value={pesos(result.error)}
                  minus={result.error >= 0}
                />
                <Line term={copy.account.run} value={pesos(result.run)} minus />
                <div className="flex items-baseline justify-between gap-4 border-t border-(--rule) pt-3">
                  <dt className="font-sans text-base font-semibold">{copy.account.net}</dt>
                  <dd
                    className={cn(
                      "font-serif text-2xl",
                      result.net > 0 ? "text-(--blue)" : "text-(--red)",
                    )}
                  >
                    {result.net < 0 ? "− " : ""}
                    {pesos(result.net)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-(--rule) pt-3 text-sm">
                <span className="text-(--ink-muted)">{copy.payback.title}: </span>
                {result.paybackMonths === null ? (
                  <span className="text-(--red)">{copy.payback.never}</span>
                ) : (
                  <span className="font-semibold">{months(result.paybackMonths)}</span>
                )}
              </p>
            </div>

            <div className="rounded-2xl border-[1.5px] border-(--blue) bg-(--surface) p-5">
              <p className="label text-(--blue)">{copy.threshold.title}</p>
              {result.breakEvenPerThousand === null ? (
                <p className="mt-3 leading-relaxed">{copy.threshold.none}</p>
              ) : (
                <>
                  <p className="mt-3 font-serif text-4xl leading-none text-(--blue)">
                    {decimal.format(result.breakEvenPerThousand)}
                    <span className="ml-2 font-sans text-sm text-(--ink-dim)">cada 1.000</span>
                  </p>
                  <p className="mt-3 leading-relaxed">
                    {copy.threshold.text.replace(
                      "{x}",
                      decimal.format(result.breakEvenPerThousand),
                    )}
                  </p>
                  {result.proofSize !== null && result.proofMonths !== null ? (
                    <p className="mt-3 text-sm leading-relaxed text-(--ink-dim)">
                      {copy.threshold.proof
                        .replace("{n}", integer.format(result.proofSize))
                        .replace("{m}", months(result.proofMonths))}{" "}
                      {copy.threshold.shadow}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Line({ term, value, minus }: { term: string; value: string; minus?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-sans text-(--ink-dim)">{term}</dt>
      <dd className="shrink-0">
        {minus ? "− " : ""}
        {value}
      </dd>
    </div>
  );
}
