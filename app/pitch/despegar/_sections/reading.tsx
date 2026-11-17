import { cn } from "@/lib/utils";
import { app, bucket, business, labels } from "../despegar.data";
import { BarsAndLine, Columns, HBars, Line } from "../_components/charts";
import { Cite, InferenceBadge, Lede, Tramo, TramoHeading } from "../_components/ui";

/** "2026-09" → "sep 26". */
function shortMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${labels.monthsShort[Number(m) - 1]} ${y.slice(2)}`;
}

/** 02 · Cómo gana plata: el modelo, el cambio de dueño y el mercado que ya no empuja. */
export function Business() {
  return (
    <Tramo id="negocio">
      <TramoHeading index="02" eyebrow={business.eyebrow}>
        {business.heading}
      </TramoHeading>
      <Lede>{business.body}</Lede>

      <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {business.kpis.map((k) => (
          <div key={k.label} className="reveal rounded-xl bg-(--surface) p-5">
            <dt className="text-sm text-(--ink-dim)">{k.label}</dt>
            <dd className="mt-2 text-xl font-semibold tracking-tight tabular md:text-3xl">
              <span className="whitespace-nowrap">{k.value}</span>
              <Cite id={k.source} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <HBars
          title={business.countries.title}
          rows={business.countries.rows}
          unit={business.countries.unit}
          footer={<Cite id={business.countries.source} />}
        />
        <Line
          title={business.market.title}
          points={business.market.series.map((p) => ({
            label: shortMonth(p.month),
            value: p.value,
          }))}
          callout={business.market.callout}
          footer={
            <>
              {business.market.note}
              <Cite id={business.market.source} />
            </>
          }
        />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <ol className="relative grid gap-6 border-l border-(--rule) pl-6">
          {business.timeline.map((m) => (
            <li key={m.date} className="reveal relative">
              <span
                aria-hidden
                className="absolute top-1.5 -left-[1.82rem] size-2.5 rounded-full bg-(--seen)"
              />
              <p className="mono text-xs tracking-wide text-(--seen-ink) uppercase">{m.date}</p>
              <p className="mt-1 leading-relaxed">
                {m.label}
                <Cite id={m.source} />
              </p>
            </li>
          ))}
        </ol>
        <blockquote className="reveal self-start rounded-xl bg-(--night) p-6 text-white md:p-8">
          <p className="text-xl leading-snug font-medium md:text-2xl">{business.plan.quote}</p>
          <footer className="mt-4 text-sm text-white/70">
            {business.plan.attribution}
            <Cite id={business.plan.source} night />
          </footer>
        </blockquote>
      </div>
    </Tramo>
  );
}

/** 03 · La app hoy: la curva del share y el funnel con lo que se sabe desde afuera. */
export function AppToday() {
  const stages = app.funnel.stages;
  return (
    <Tramo id="app" deep>
      <TramoHeading index="03" eyebrow={app.eyebrow}>
        {app.heading}
      </TramoHeading>

      <div className="mt-10 grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <Columns
          title={app.chart.title}
          unit={app.chart.unit}
          points={app.chart.points.map((p) => ({ label: p.quarter, value: p.value }))}
          highlightLast
          footer={
            <>
              {app.chart.note}
              <Cite id={app.chart.points[app.chart.points.length - 1].source} />
            </>
          }
        />
        <dl className="grid grid-cols-2 gap-3">
          {app.facts.map((f) => (
            <div key={f.label} className="reveal rounded-xl bg-(--surface) p-4">
              <dd className="text-xl font-semibold tracking-tight whitespace-nowrap tabular md:text-2xl">
                {f.value}
              </dd>
              <dt className="mt-1 text-sm leading-snug text-(--ink-dim)">
                {f.label}
                <Cite id={f.source} />
              </dt>
              {"note" in f && f.note ? (
                <p className="mono mt-2 text-xs text-(--ink-dim)">{f.note}</p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>

      <h3 className="reveal mt-16 text-xl font-semibold md:text-2xl">{app.funnel.title}</h3>
      <ol className="mt-6 grid gap-3 md:grid-cols-4">
        {stages.map((s, i) => {
          const last = i === stages.length - 1;
          return (
            <li
              key={s.id}
              className={cn(
                "reveal flex flex-col rounded-xl p-5",
                last ? "bg-(--night) text-white" : "bg-(--surface)",
              )}
            >
              <p
                className={cn(
                  "mono text-xs tracking-wide uppercase",
                  last ? "text-white/70" : "text-(--seen-ink)",
                )}
              >
                {String(i + 1).padStart(2, "0")} <span aria-hidden>·</span> {s.label}
              </p>
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  last ? "text-white/80" : "text-(--ink-dim)",
                )}
              >
                {s.known}
              </p>
              <p
                className={cn(
                  "mt-4 border-t pt-3 font-medium",
                  last ? "border-white/20" : "border-(--rule)",
                )}
              >
                {s.reading}
              </p>
            </li>
          );
        })}
      </ol>
    </Tramo>
  );
}

/** 04 · El balde: lo que crece (Pasaporte) contra lo que no (la vuelta). */
export function Bucket() {
  return (
    <Tramo id="balde">
      <TramoHeading index="04" eyebrow={bucket.eyebrow}>
        {bucket.heading}
      </TramoHeading>

      <div className="mt-10">
        <BarsAndLine
          title={bucket.chart.title}
          barLabel={bucket.chart.membersLabel}
          lineLabel={bucket.chart.repeatLabel}
          rows={bucket.chart.years.map((y) => ({
            label: y.year,
            bar: y.members,
            line: y.repeatPct,
          }))}
          footer={<Cite id={bucket.chart.source} />}
        />
      </div>

      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {bucket.accounts.map((a) => (
          <li key={a.id} className="reveal flex flex-col rounded-xl bg-(--surface) p-6">
            <InferenceBadge />
            <h3 className="mt-4 text-lg leading-snug font-semibold">{a.title}</h3>
            <p className="mt-2 leading-relaxed text-(--ink-dim)">{a.text}</p>
            <details className="group mt-auto pt-4">
              <summary className="mono inline-flex items-center gap-2 text-xs text-(--seen-ink)">
                <span
                  aria-hidden
                  className="transition-transform duration-500 group-open:rotate-90"
                >
                  ›
                </span>
                {labels.showMath}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-(--ink-dim)">
                {a.how}
                <Cite id={a.source} />
              </p>
            </details>
          </li>
        ))}
      </ol>

      <p className="reveal mt-12 max-w-3xl text-2xl leading-snug font-medium md:text-3xl">
        {bucket.takeaway}
      </p>
    </Tramo>
  );
}
