"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { firstStep, stamp } from "../lacaja.data";
import { ExampleBadge } from "./ui";

type Mode = "hoy" | "propuesto";
type CaseId = "nuevo" | "usado";
type Phase = "idle" | "checking" | "done";

const mock = firstStep.mock;
/** Pausa entre regla y regla, para que se lea que se chequean de a una. */
const RULE_MS = 520;

/**
 * El alta de una unidad, hoy y con la propuesta. A la izquierda el formulario
 * (dos casos de ejemplo); a la derecha qué pasa al enviarlo. Hoy, cualquiera
 * de los dos termina en la bandeja con el texto real del portal. Con la
 * propuesta se chequean tres reglas: el 0 km sale con certificado en el
 * momento y el usado sin fotos va a una persona con el caso armado.
 *
 * Es interactivo a propósito: en la entrevista se toca, no se describe.
 */
export function AltaMock() {
  const [mode, setMode] = useState<Mode>("propuesto");
  const [caseId, setCaseId] = useState<CaseId>("nuevo");
  const [phase, setPhase] = useState<Phase>("idle");
  const [checked, setChecked] = useState(0);

  const rules = mock.rules;
  const failIndex = caseId === "usado" ? rules.findIndex((r) => r.id === mock.failedRule) : -1;
  const lastIndex = failIndex >= 0 ? failIndex : rules.length - 1;

  // Las reglas se encienden de a una; al llegar a la última (o a la que falla) termina.
  useEffect(() => {
    if (phase !== "checking") return;
    const t = window.setTimeout(() => {
      const next = checked + 1;
      setChecked(next);
      if (next > lastIndex) setPhase("done");
    }, RULE_MS);
    return () => window.clearTimeout(t);
  }, [phase, checked, lastIndex]);

  const reset = () => {
    setPhase("idle");
    setChecked(0);
  };
  const choose =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      reset();
    };
  const submit = () => {
    setChecked(0);
    setPhase(mode === "hoy" ? "done" : "checking");
  };

  const fields = mock.cases[caseId].fields;

  return (
    <div className="rounded-2xl border border-(--rule) bg-(--surface) p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Segmented
            label="Cómo se resuelve"
            value={mode}
            options={[
              { value: "hoy", label: mock.modes.hoy },
              { value: "propuesto", label: mock.modes.propuesto },
            ]}
            onChange={choose<Mode>(setMode)}
          />
          <Segmented
            label="Qué unidad se da de alta"
            value={caseId}
            options={[
              { value: "nuevo", label: mock.cases.nuevo.label },
              { value: "usado", label: mock.cases.usado.label },
            ]}
            onChange={choose<CaseId>(setCaseId)}
          />
        </div>
        <ExampleBadge>{mock.exampleBadge}</ExampleBadge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Formulario */}
        <div className="rounded-xl border border-(--rule) p-4">
          <p className="label text-(--ink-muted)">Alta de unidad</p>
          <dl className="mt-3 divide-y divide-(--rule)">
            {fields.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 py-2 text-sm">
                <dt className="text-(--ink-muted)">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={phase !== "idle"}
              className="btn bg-(--red) text-white hover:bg-[#a51714]"
            >
              {mock.submit}
            </button>
            {phase === "done" ? (
              <button
                type="button"
                onClick={reset}
                className="btn border border-(--ink-faint) text-(--ink) hover:bg-(--surface-deep)"
              >
                {mock.reset}
              </button>
            ) : null}
          </div>
        </div>

        {/* Qué pasa */}
        <div
          className="flex min-h-[17rem] flex-col rounded-xl bg-(--surface-deep) p-4"
          aria-live="polite"
        >
          {phase === "idle" ? (
            <p className="m-auto max-w-xs text-center text-sm text-(--ink-muted)">
              {mode === "hoy"
                ? "Enviá el alta para ver qué recibe hoy la empresa."
                : "Enviá el alta para ver las reglas que la cerrarían sola."}
            </p>
          ) : null}

          {mode === "hoy" && phase === "done" ? (
            <div className="case-enter">
              <div className="rounded-md border border-(--ticket-line) bg-(--surface) p-4">
                <p className="text-sm font-semibold">{mock.hoy.title}</p>
                <p className="mt-2 font-serif leading-relaxed italic">«{mock.hoy.text}»</p>
                <p className="mt-3">
                  <span className="stamp">{stamp}</span>
                </p>
              </div>
              <p className="mt-4 text-sm text-(--ink-dim)">{mock.hoy.note}</p>
            </div>
          ) : null}

          {mode === "propuesto" && phase !== "idle" ? (
            <div>
              <ol className="space-y-2">
                {rules.map((rule, i) => {
                  const seen = i < checked;
                  const failed = seen && i === failIndex;
                  return (
                    <li
                      key={rule.id}
                      className={cn(
                        "rule-row flex items-start gap-2.5 text-sm",
                        !seen && "opacity-35",
                        failed && "text-(--red)",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                          !seen && "border-(--ink-faint)",
                          seen && !failed && "border-(--blue) bg-(--blue) text-white",
                          failed && "border-(--red) text-(--red)",
                        )}
                      >
                        {seen ? (
                          <HugeiconsIcon
                            icon={failed ? Cancel01Icon : Tick02Icon}
                            size={12}
                            strokeWidth={2.5}
                            aria-hidden
                          />
                        ) : null}
                      </span>
                      <span>{rule.text}</span>
                    </li>
                  );
                })}
              </ol>

              {phase === "done" && failIndex < 0 ? (
                <div className="case-enter mt-5 rounded-md bg-(--blue) p-4 text-white">
                  <p className="mono flex items-center gap-1.5 text-xs text-(--blue-pale)">
                    <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} aria-hidden />
                    Cerrada sola
                  </p>
                  <p className="mt-1 font-serif text-xl">{mock.closed.title}</p>
                  <p className="mt-2 text-sm text-(--blue-pale)">{mock.closed.text}</p>
                </div>
              ) : null}

              {phase === "done" && failIndex >= 0 ? (
                <div className="case-enter mt-5 rounded-md border-[1.5px] border-(--blue) bg-(--surface) p-4">
                  <p className="mono flex items-center gap-1.5 text-xs text-(--blue)">
                    <HugeiconsIcon icon={UserIcon} size={14} strokeWidth={2} aria-hidden />A una
                    persona
                  </p>
                  <p className="mt-1 font-serif text-xl">{mock.assisted.title}</p>
                  <p className="mt-2 text-sm text-(--ink-dim)">{mock.assisted.text}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}

/** Selector de dos opciones con semántica de radio. */
function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-md bg-(--surface-deep) p-1"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-semibold transition-colors duration-300",
            value === o.value
              ? "bg-(--ink) text-white"
              : "text-(--ink-dim) hover:bg-(--surface) hover:text-(--ink)",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
