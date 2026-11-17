import Link from "next/link";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { cn } from "@/lib/utils";
import { author, close, dashboard, firstSteps, labels, sourceList } from "../despegar.data";
import { StackedColumns } from "../_components/charts";
import { ExampleBadge, Tramo, TramoHeading } from "../_components/ui";

const SQL_KEYWORDS =
  /\b(WITH|AS|SELECT|FROM|LEFT|JOIN|USING|WHERE|AND|IN|GROUP|BY|ORDER|MAX|FILTER|BOOL_OR|COUNT|AVG|IS|NOT|NULL|DATE)\b/g;

/** Resaltado mínimo de SQL: comentarios y palabras clave. Sin HTML inyectado. */
function SqlLine({ line }: { line: string }) {
  if (line.trim().startsWith("--")) return <span className="cm">{line}</span>;
  const parts = line.split(SQL_KEYWORDS);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="kw">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

const SERIES_COLORS = ["#a780ff", "#4300d2", "#270570"];

/** 09 · Cómo lo mediría: la maqueta del tablero, rotulada como ejemplo de punta a punta. */
export function Dashboard() {
  const d = dashboard;
  const keys = d.northStar.breakdown.map((label, i) => ({
    key: label.toLowerCase(),
    label,
    color: SERIES_COLORS[i],
  }));
  return (
    <Tramo id="tablero" deep>
      <TramoHeading index="09" eyebrow={d.eyebrow}>
        {d.heading}
      </TramoHeading>
      <div className="reveal mt-6">
        <ExampleBadge>{d.label}</ExampleBadge>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.3fr] md:items-start">
        <div className="reveal">
          <h3 className="text-2xl font-semibold">{d.northStar.name}</h3>
          <p className="mt-3 leading-relaxed text-(--ink-dim)">{d.northStar.why}</p>
        </div>
        <StackedColumns
          className="is-example"
          title={`${d.northStar.name} (${d.northStar.unit})`}
          rows={d.northStar.series.map(({ month, ...rest }) => ({ label: month, ...rest }))}
          keys={keys}
          unit={d.northStar.unit}
        />
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {d.guardrails.map((g) => (
          <li key={g.id} className="reveal is-example flex flex-col rounded-xl bg-(--surface) p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{g.name}</p>
              <span
                className={cn(
                  "mono rounded-sm px-2 py-0.5 text-[0.7rem] uppercase",
                  g.status === "ok"
                    ? "bg-(--ok-soft) text-(--ok)"
                    : "bg-(--watch-soft) text-(--watch)",
                )}
              >
                {labels.status[g.status]}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight tabular">{g.value}</p>
            <p className="mono mt-1 text-xs text-(--ink-dim)">{g.delta}</p>
            <p className="mt-4 text-sm leading-relaxed text-(--ink-dim)">{g.why}</p>
          </li>
        ))}
      </ul>

      <div className="reveal mt-10">
        <h3 className="text-lg font-semibold">{d.sql.title}</h3>
        <p className="mt-1 text-sm text-(--ink-dim)">{d.sql.note}</p>
        <pre className="code-block mono mt-4 overflow-x-auto rounded-xl p-5 text-[0.8rem] leading-relaxed md:text-sm">
          <code>
            {d.sql.code.split("\n").map((line, i) => (
              <span key={i} className="block">
                <SqlLine line={line} />
              </span>
            ))}
          </code>
        </pre>
      </div>
    </Tramo>
  );
}

/** 10 · Primeros pasos: los quick wins ordenados por puntaje y los primeros 90 días. */
export function FirstSteps() {
  const f = firstSteps;
  const top = Math.max(...f.quickWins.map((q) => q.score));
  return (
    <Tramo id="primeros-pasos">
      <TramoHeading index="10" eyebrow={f.eyebrow}>
        {f.heading}
      </TramoHeading>
      <p className="reveal mt-4 max-w-2xl text-sm text-(--ink-dim)">{f.scoringNote}</p>

      <ol className="chart reveal mt-8 grid gap-4">
        {f.quickWins.map((q) => (
          <li key={q.id} className="rounded-xl bg-(--surface) p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-semibold">{q.title}</p>
              <p className="mono text-xs text-(--ink-dim)">
                {labels.effort}: {q.effort} <span aria-hidden>·</span> {labels.score}{" "}
                <span className="font-semibold text-(--seen-ink)">
                  {q.score.toLocaleString("es-AR", { minimumFractionDigits: 1 })}
                </span>
              </p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-(--surface-deep)">
              <div
                className="bar-fill h-full rounded-full bg-(--seen)"
                style={{ width: `${(q.score / top) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-(--ink-dim)">{q.evidence}</p>
          </li>
        ))}
      </ol>

      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {f.plan.map((p) => (
          <li
            key={p.window}
            className="reveal rounded-xl border-t-4 border-(--seen) bg-(--surface) p-6"
          >
            <p className="mono text-xs tracking-wide text-(--seen-ink) uppercase">{p.window}</p>
            <p className="mt-3 leading-relaxed">{p.text}</p>
          </li>
        ))}
      </ol>
    </Tramo>
  );
}

/** 11 · Cierre estático: sin animación de scroll, es donde se decide. */
export function Close() {
  const list = sourceList();
  return (
    <section id="cierre" className="relative bg-(--night) text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-10 md:py-28">
        <h2 className="max-w-4xl text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
          {close.heading}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{close.body}</p>
        <ul className="mt-8 grid max-w-2xl gap-3">
          {close.questions.map((q) => (
            <li key={q} className="flex gap-3 text-lg">
              <span aria-hidden className="mono text-[#b9a1ff]">
                ?
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <ObfuscatedEmailTrigger
            surface="despegar-close"
            userReversed={author.emailUserReversed}
            domainReversed={author.emailDomainReversed}
            label={close.emailLabel}
            className="btn bg-white text-(--night) hover:opacity-90"
          >
            <span>{close.emailLabel}</span>
          </ObfuscatedEmailTrigger>
          <Link
            href={close.siteHref}
            data-ph="contact_click"
            data-ph-kind="site"
            data-ph-surface="despegar-close"
            className="btn border border-white/40 hover:bg-white/10"
          >
            {close.siteLabel}
          </Link>
          <Link
            href={author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-ph="contact_click"
            data-ph-kind="linkedin"
            data-ph-surface="despegar-close"
            className="btn border border-white/40 hover:bg-white/10"
          >
            {labels.linkedin}
          </Link>
        </div>

        <footer className="mt-24 border-t border-white/15 pt-8 text-sm text-white/70">
          <p>{close.sourcesLine}</p>
          <details className="group mt-3">
            <summary className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
              <span
                aria-hidden
                className="mono transition-transform duration-500 group-open:rotate-90"
              >
                ›
              </span>
              <span>{close.sourcesToggle.replace("{n}", String(list.length))}</span>
            </summary>
            <ol className="mono mt-4 space-y-2 text-xs break-all">
              {list.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          <p className="mt-6">{close.footnote}</p>
          <p className="mt-2">{author.name}</p>
        </footer>
      </div>
    </section>
  );
}
