"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { caseStudy } from "../zubale.data";
import { ExampleBadge, ReaderLabel } from "./ui";

type Mode = "person" | "agent";
type Phase = "idle" | "asking" | "accepted" | "rejected";

const mock = caseStudy.mock;
const missing = mock.items.find((item) => "missing" in item && item.missing);

/**
 * "Falta en góndola". Dos pantallas: la app del Zubalero (izquierda) y quien
 * decide el reemplazo (derecha). Con el interruptor, decide una persona por
 * WhatsApp o su agente por una interfaz estructurada. Abajo, lo que cuesta
 * cada camino. Todo con datos de ejemplo.
 *
 * Es interactivo a propósito: en la entrevista se toca, no se describe.
 */
export function MissingItemMock() {
  const [mode, setMode] = useState<Mode>("person");
  const [phase, setPhase] = useState<Phase>("idle");

  // El agente contesta solo, en un par de segundos, según la preferencia guardada.
  useEffect(() => {
    if (mode !== "agent" || phase !== "asking") return;
    const t = window.setTimeout(() => setPhase("accepted"), 1400);
    return () => window.clearTimeout(t);
  }, [mode, phase]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setPhase("idle");
  };

  const done = phase === "accepted" || phase === "rejected";
  const result = mock.results[mode];

  return (
    <div className="rounded-2xl border border-(--rule) bg-(--surface) p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="radiogroup"
          aria-label="Quién decide el reemplazo"
          className="inline-flex rounded-lg bg-(--surface-deep) p-1"
        >
          {(["person", "agent"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                "btn btn-sm",
                mode === m
                  ? m === "person"
                    ? "bg-(--person) text-(--surface)"
                    : "bg-(--agent) text-(--surface)"
                  : "text-(--ink-dim) hover:bg-(--surface)",
              )}
            >
              {mock.modes[m]}
            </button>
          ))}
        </div>
        <ExampleBadge>{caseStudy.exampleBadge}</ExampleBadge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* App del Zubalero */}
        <div className="rounded-xl border border-(--rule) p-4">
          <p className="text-xs font-medium tracking-wide text-(--ink-dim) uppercase">
            App del Zubalero
          </p>
          <p className="mt-1 text-sm">
            {mock.picker} <span aria-hidden>·</span> {mock.store}
          </p>
          <p className="mono text-xs text-(--ink-dim)">{mock.window}</p>
          <ul className="mt-4 divide-y divide-(--rule) text-sm">
            {mock.items.map((item) => {
              const isMissing = "missing" in item && item.missing;
              const flagged = isMissing && phase !== "idle";
              const replaced = isMissing && phase === "accepted";
              const removed = isMissing && phase === "rejected";
              return (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2">
                  <span
                    className={cn(
                      "flex items-center gap-2",
                      removed && "text-(--ink-faint) line-through",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "inline-block size-2 rounded-full",
                        flagged && !replaced ? "bg-(--risk)" : "bg-(--ok)",
                      )}
                    />
                    {replaced ? mock.substitute.name : item.name}
                  </span>
                  <span className="mono shrink-0 text-xs text-(--ink-dim)">
                    {replaced ? mock.substitute.diff : item.qty}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhase("asking")}
              disabled={phase !== "idle"}
              className="btn bg-(--ink) text-(--surface) hover:opacity-90"
            >
              {mock.actions.mark}
            </button>
            {done ? (
              <button
                type="button"
                onClick={() => setPhase("idle")}
                className="btn border border-(--ink-faint) hover:bg-(--surface-deep)"
              >
                {mock.actions.reset}
              </button>
            ) : null}
          </div>
        </div>

        {/* Quien decide */}
        <div
          className={cn(
            "rounded-xl border p-4",
            mode === "person" ? "border-(--person-soft)" : "border-(--agent-soft)",
          )}
        >
          <ReaderLabel who={mode} />
          {phase === "idle" ? (
            <p className="mt-6 text-sm text-(--ink-dim)">{mock.idle}</p>
          ) : mode === "person" ? (
            <div key="person" className="case-enter mt-4 space-y-3">
              <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-(--person-soft) p-3 text-sm">
                <p>{mock.personMessage}</p>
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-(--surface) p-2">
                  <div
                    aria-hidden
                    className="flex size-12 shrink-0 items-center justify-center rounded-md bg-(--surface-deep) text-xs text-(--ink-dim)"
                  >
                    foto
                  </div>
                  <p className="text-sm">
                    {mock.substitute.name}
                    <span className="mono ml-2 text-xs text-(--ink-dim)">
                      {mock.substitute.diff}
                    </span>
                  </p>
                </div>
              </div>
              {phase === "asking" ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPhase("accepted")}
                    className="btn bg-(--person) text-(--surface) hover:opacity-90"
                  >
                    {mock.actions.accept}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase("rejected")}
                    className="btn border border-(--ink-faint) hover:bg-(--surface-deep)"
                  >
                    {mock.actions.reject}
                  </button>
                </div>
              ) : (
                <p className="case-enter ml-auto w-fit rounded-2xl rounded-tr-sm bg-(--surface-deep) px-3 py-2 text-sm">
                  {phase === "accepted" ? mock.actions.accept : mock.actions.reject}
                </p>
              )}
            </div>
          ) : (
            <div key="agent" className="case-enter mono mt-4 space-y-3 text-xs">
              <div className="rounded-lg bg-(--agent-soft) p-3 text-(--agent-ink)">
                <p className="text-(--ink-dim)">súper, vía Zubale → agente del cliente</p>
                {mock.agentRequest.map((line) => (
                  <p key={line} className="break-words">
                    {line}
                  </p>
                ))}
              </div>
              <p className="font-sans text-xs text-(--ink-dim)">{mock.agentPreference}</p>
              {phase === "asking" ? (
                <p className="text-(--ink-dim)" aria-live="polite">
                  El agente está evaluando…
                </p>
              ) : (
                <div className="case-enter rounded-lg border border-(--agent-soft) p-3 text-(--agent-ink)">
                  <p className="text-(--ink-dim)">agente del cliente → Zubale</p>
                  {mock.agentResponse.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lo que queda escrito: hoy, una llamada; con la idea, la pregunta y
          la decisión, y el catálogo corregido. Es donde las dos lecturas que
          se separaron en el tramo 07 vuelven a coincidir. */}
      <div className="mt-6 rounded-xl border border-(--agent-soft) p-4">
        <ReaderLabel who="agent" label={mock.written.title} />
        <div className="mono mt-3 grid gap-3 text-xs md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6">
          <div>
            <p className="font-sans text-(--ink-dim)">{mock.written.today.label}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {mock.written.today.states.map((s) => (
                <li key={s} className="rounded-md bg-(--surface-deep) px-2 py-1 text-(--ink-dim)">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-sans text-(--ink-dim)">{mock.written.proposed.label}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {[...mock.written.proposed.asking, mock.written.proposed.done].map((s, i) => {
                const lit = i < mock.written.proposed.asking.length ? phase !== "idle" : done;
                return (
                  <li
                    key={s}
                    className={cn(
                      "rounded-md px-2 py-1 transition-colors duration-500",
                      lit
                        ? "bg-(--agent-soft) text-(--agent-ink)"
                        : "border border-dashed border-(--ink-faint) text-(--ink-faint)",
                    )}
                  >
                    {s}
                  </li>
                );
              })}
              <li
                className={cn(
                  "rounded-md px-2 py-1 transition-colors duration-500",
                  phase === "idle"
                    ? "bg-(--risk-soft) text-(--risk)"
                    : "bg-(--agent-soft) text-(--agent-ink)",
                )}
              >
                {phase === "idle" ? mock.written.catalog.before : mock.written.catalog.after}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div aria-live="polite" className="mt-6 border-t border-(--rule) pt-4">
        {done ? (
          phase === "rejected" ? (
            <p className="case-enter text-sm">{mock.rejected}</p>
          ) : (
            <dl className="case-enter grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label={mock.results.labels.time} value={result.time} />
              <Metric label={mock.results.labels.messages} value={result.messages} />
              <Metric label={mock.results.labels.cost} value={result.cost} />
              <Metric label={mock.results.labels.perfect} value="Sí" ok />
            </dl>
          )
        ) : (
          <p className="text-sm text-(--ink-dim)">
            {mock.results.today} En este pedido falta: {missing?.name}.
          </p>
        )}
        <p className="mt-3 text-xs text-(--ink-dim)">{mock.summary}</p>
      </div>
    </div>
  );
}

function Metric({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-(--ink-dim)">{label}</dt>
      <dd className={cn("mono mt-1 text-lg font-semibold", ok && "text-(--ok)")}>{value}</dd>
    </div>
  );
}
