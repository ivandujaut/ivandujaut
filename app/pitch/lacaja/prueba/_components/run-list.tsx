"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  MinusSignIcon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Segmented } from "../../_components/alta-mock";
import { outcome, type CheckStatus, type Decision, type Run, type RunCase } from "../prueba.data";

type Filter = "all" | Decision;

const copy = outcome.list;
const statusIcon = { pass: Tick02Icon, fail: Cancel01Icon, skipped: MinusSignIcon } as const;

/**
 * Las veinte solicitudes, una por fila. Cada una se abre para mostrar lo que
 * entró (el correo o la planilla, y el adjunto) y qué dijo cada regla. En la
 * entrevista sirve para elegir una al azar y seguirla de punta a punta.
 */
export function RunList({ cases, rules }: { cases: RunCase[]; rules: Run["rules"] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? cases : cases.filter((c) => c.decision === filter);
  const ruleText = Object.fromEntries(rules.map((r) => [r.id, r.text]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-serif text-2xl leading-snug">{copy.title}</p>
          <p className="mt-1 text-sm text-(--ink-dim)">{copy.hint}</p>
        </div>
        <Segmented<Filter>
          label="Qué solicitudes se muestran"
          value={filter}
          options={[
            { value: "all", label: copy.filters.all },
            { value: "issue", label: copy.filters.issue },
            { value: "refer", label: copy.filters.refer },
          ]}
          onChange={setFilter}
        />
      </div>

      <ul className="mt-5 space-y-2" aria-live="polite">
        {shown.map((c) => (
          <li key={c.id}>
            <details className="group rounded-md border border-(--ticket-line) bg-(--surface)">
              <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 px-3 py-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-4 [&::-webkit-details-marker]:hidden">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden
                  className="mt-1 shrink-0 text-(--ink-muted) transition-transform duration-300 group-open:rotate-90"
                />
                <div className="min-w-0">
                  <p className="mono text-xs text-(--ink-muted)">
                    {c.id} <span aria-hidden>·</span> {copy.channel[c.channel]}
                  </p>
                  <p className="mt-0.5 font-semibold">{c.label}</p>
                  {c.detail ? <p className="mt-1 text-sm text-(--ink-dim)">{c.detail}</p> : null}
                </div>
                <div className="col-start-2 flex flex-wrap items-center gap-1.5 md:col-start-3 md:justify-end">
                  <DecisionChip decision={c.decision} />
                  {c.audit ? <Tag>{copy.audit}</Tag> : null}
                  {c.flagged ? <Tag>{copy.flagged}</Tag> : null}
                  {c.correct && c.reasonCorrect ? null : <Tag alert>{copy.mismatch}</Tag>}
                </div>
              </summary>

              <div className="grid gap-4 border-t border-(--rule) p-3 md:grid-cols-2 md:p-4">
                <div className="min-w-0">
                  <p className="label text-(--ink-muted)">{copy.entered}</p>
                  <Raw>{c.body}</Raw>
                  {c.attachments.length === 0 ? (
                    <p className="mt-3 text-sm text-(--ink-dim)">{copy.noAttachments}</p>
                  ) : (
                    c.attachments.map((a) => (
                      <div key={a.name} className="mt-3">
                        <p className="mono text-xs text-(--ink-muted)">
                          {copy.attachment}: {a.name}
                        </p>
                        {a.text ? <Raw>{a.text}</Raw> : null}
                      </div>
                    ))
                  )}
                </div>

                <div className="min-w-0">
                  <p className="label text-(--ink-muted)">{copy.rules}</p>
                  <ol className="mt-3 space-y-2.5">
                    {c.checks.map((check) => (
                      <CheckRow
                        key={check.id}
                        status={check.status}
                        text={ruleText[check.id] ?? check.id}
                        detail={check.detail}
                      />
                    ))}
                  </ol>
                  <dl className="mt-4 space-y-2 border-t border-(--rule) pt-3 text-sm">
                    {c.vehicle || c.fleet ? (
                      <Row term={copy.read}>{[c.vehicle, c.fleet].filter(Boolean).join(" · ")}</Row>
                    ) : null}
                    {c.nextStep ? <Row term={copy.nextStep}>{c.nextStep}</Row> : null}
                    {c.certificate ? (
                      <Row term={copy.certificate}>
                        <span className="mono">{c.certificate}</span>
                      </Row>
                    ) : null}
                  </dl>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecisionChip({ decision }: { decision: Decision }) {
  const issued = decision === "issue";
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-(--blue) px-2 py-0.5 text-xs font-medium",
        issued ? "bg-(--blue) text-white" : "bg-(--surface) text-(--blue)",
      )}
    >
      <HugeiconsIcon icon={issued ? Tick02Icon : UserIcon} size={12} strokeWidth={2} aria-hidden />
      {copy.decision[decision]}
    </span>
  );
}

function Tag({ children, alert }: { children: string; alert?: boolean }) {
  return (
    <span
      className={cn(
        "mono inline-block rounded-sm border border-dashed px-2 py-0.5 text-xs",
        alert ? "border-(--red) text-(--red)" : "border-(--ink-faint) text-(--ink-muted)",
      )}
    >
      {children}
    </span>
  );
}

function CheckRow({
  status,
  text,
  detail,
}: {
  status: CheckStatus;
  text: string;
  detail: string | null;
}) {
  return (
    <li className={cn("flex items-start gap-2.5 text-sm", status === "skipped" && "opacity-45")}>
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
          status === "pass" && "border-(--blue) bg-(--blue) text-white",
          status === "fail" && "border-(--red) text-(--red)",
          status === "skipped" && "border-(--ink-faint) text-(--ink-muted)",
        )}
      >
        <HugeiconsIcon icon={statusIcon[status]} size={12} strokeWidth={2.5} aria-hidden />
      </span>
      <span>
        <span className="sr-only">{copy.status[status]}: </span>
        <span className={cn(status === "fail" && "text-(--red)")}>{text}</span>
        {detail ? <span className="mt-0.5 block text-(--ink-dim)">{detail}</span> : null}
      </span>
    </li>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
      <dt className="text-(--ink-muted)">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** El correo, la planilla o la factura tal como entraron. */
function Raw({ children }: { children: string }) {
  return (
    <pre
      data-lenis-prevent
      className="mono mt-2 max-h-72 overflow-auto rounded-md bg-(--surface-deep) p-3 text-xs leading-relaxed break-words whitespace-pre-wrap"
    >
      {children}
    </pre>
  );
}
