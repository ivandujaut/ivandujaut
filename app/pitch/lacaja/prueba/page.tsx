import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Cancel01Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { ExampleBadge, Tramo, TramoHeading } from "../_components/ui";
import { RunList } from "./_components/run-list";
import { TouchGrid } from "./_components/touch-grid";
import { closing, flow, intro, limits, meta, outcome, run } from "./prueba.data";

/**
 * Respaldo de la pieza de La Caja: la maqueta del tramo 04, corrida con veinte
 * altas de ejemplo. No está enlazada desde la pieza; es para abrir si en la
 * charla preguntan si el primer paso funciona. Misma privacidad que la pieza:
 * `noindex, nofollow`, fuera del sitemap y de la navegación. URL corta:
 * `/lacaja/prueba` (rewrite en `next.config.ts`).
 */
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: meta.title, description: meta.description },
};

export default function LaCajaRunPage() {
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
        <p className="mt-6">
          <ExampleBadge>{intro.exampleBadge}</ExampleBadge>
        </p>
      </header>

      {/* A · Antes y después: quién toca cada solicitud. */}
      <Tramo id="recorrido" deep>
        <TramoHeading index={flow.index} eyebrow={flow.eyebrow}>
          {flow.heading}
        </TramoHeading>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
          {flow.intro}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Lane
            label={flow.before.label}
            count={flow.before.count}
            steps={flow.before.steps}
            note={flow.before.note}
          >
            <TouchGrid cases={run.cases} mode="before" label={flow.before.count} />
          </Lane>
          <Lane
            label={flow.after.label}
            count={flow.after.count}
            steps={flow.after.steps}
            note={flow.after.note}
            proposed
          >
            <TouchGrid cases={run.cases} mode="after" label={flow.after.count} />
          </Lane>
        </div>

        <ul className="reveal mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--ink-dim)">
          <Legend className="border-(--ticket-line) bg-(--surface) text-(--ink-faint)" icon="user">
            {flow.legend.waiting}
          </Legend>
          <Legend className="border-(--blue) bg-(--blue) text-white" icon="tick">
            {flow.legend.issued}
          </Legend>
          <Legend className="border-(--blue) bg-(--surface) text-(--blue)" icon="user">
            {flow.legend.referred}
          </Legend>
          <Legend
            className="border-(--blue) bg-(--blue) text-white outline-2 outline-offset-2 outline-(--blue)"
            icon="tick"
          >
            {flow.legend.audit}
          </Legend>
        </ul>

        <div className="reveal mt-10 max-w-xl rounded-md border-[1.5px] border-dashed border-(--red) bg-(--surface) p-5">
          <p className="label text-(--red)">{flow.question.label}</p>
          <p className="mt-3 font-serif text-2xl leading-snug">{flow.question.text}</p>
          <p className="mt-3 text-sm leading-relaxed text-(--ink-dim)">{flow.question.why}</p>
        </div>
      </Tramo>

      {/* B · La corrida: los cuatro números y las veinte solicitudes. */}
      <Tramo id="corrida">
        <TramoHeading index={outcome.index} eyebrow={outcome.eyebrow}>
          {outcome.heading}
        </TramoHeading>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
          {outcome.intro}
        </p>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcome.stats.map((stat) => (
            <div
              key={stat.label}
              className="reveal flex flex-col-reverse justify-end rounded-xl border border-(--rule) bg-(--surface) p-5"
            >
              <dt className="mt-2 text-sm text-(--ink-dim)">{stat.label}</dt>
              <dd className="font-serif text-4xl leading-none text-(--blue)">{stat.value}</dd>
            </div>
          ))}
        </dl>
        {outcome.cost ? (
          <p className="reveal mt-5 max-w-3xl text-(--ink-dim)">{outcome.cost}</p>
        ) : null}

        <div className="mt-14">
          <RunList cases={run.cases} rules={run.rules} />
        </div>
      </Tramo>

      {/* C · El control y los límites. */}
      <Tramo id="limites" deep>
        <TramoHeading index={limits.index} eyebrow={limits.eyebrow}>
          {limits.heading}
        </TramoHeading>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="reveal rounded-xl border-[1.5px] border-(--blue) bg-(--surface) p-5 md:p-6">
              <p className="label text-(--blue)">{limits.control.title}</p>
              <p className="mt-3 text-lg leading-relaxed">{limits.control.text}</p>
              <p className="mt-4 text-sm text-(--ink-dim)">{limits.control.note}</p>
            </div>
            <div className="reveal rounded-xl border border-(--rule) bg-(--surface) p-5 md:p-6">
              <p className="label text-(--ink-muted)">{limits.decides.title}</p>
              <p className="mt-3 leading-relaxed">{limits.decides.text}</p>
            </div>
          </div>
          <div className="reveal p-1 md:p-2">
            <p className="label text-(--ink-muted)">{limits.notProven.title}</p>
            <ul className="mt-4 space-y-3">
              {limits.notProven.items.map((item) => (
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
          </div>
        </div>
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

interface LaneProps {
  label: string;
  count: string;
  steps: string[];
  note: string;
  /** El carril de la propuesta lleva el borde azul de lo resuelto. */
  proposed?: boolean;
  children: React.ReactNode;
}

/** Un recorrido: cuántas solicitudes toca una persona, las casillas y los pasos. */
function Lane({ label, count, steps, note, proposed, children }: LaneProps) {
  return (
    <section
      className={
        proposed
          ? "reveal rounded-xl border-[1.5px] border-(--blue) bg-(--surface) p-5 md:p-6"
          : "reveal rounded-xl border border-(--rule) bg-(--surface) p-5 md:p-6"
      }
    >
      <h3 className={proposed ? "label text-(--blue)" : "label text-(--ink-muted)"}>{label}</h3>
      <p className="mt-3 font-serif text-2xl leading-snug">{count}</p>
      <div className="mt-5">{children}</div>
      <ol className="mt-6 space-y-2.5">
        {steps.map((step, i) => (
          <li key={step} className="grid grid-cols-[1.75rem_minmax(0,1fr)] text-sm">
            <span className="mono text-xs leading-5 text-(--ink-muted)">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-(--rule) pt-4 text-sm leading-relaxed text-(--ink-dim)">
        {note}
      </p>
    </section>
  );
}

function Legend({
  className,
  icon,
  children,
}: {
  className: string;
  icon: "tick" | "user";
  children: string;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={`flex size-5 shrink-0 items-center justify-center rounded-sm border-[1.5px] ${className}`}
      >
        <HugeiconsIcon icon={icon === "tick" ? Tick02Icon : UserIcon} size={10} strokeWidth={2.5} />
      </span>
      {children}
    </li>
  );
}
