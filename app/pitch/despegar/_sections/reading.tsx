import { app, bucket, business, labels } from "../despegar.data";
import { BarsAndLine, Columns, HBars, Line } from "../_components/charts";
import { FlightJourney } from "../_components/flight-journey";
import { Cite, InferenceBadge, Lede, Tramo, TramoHeading } from "../_components/ui";

/** "2026-09" → "sep 26". */
function shortMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${labels.monthsShort[Number(m) - 1]} ${y.slice(2)}`;
}

/** Anexo A · Cómo gana plata: el modelo, el cambio de dueño y el mercado que ya no empuja. */
export function Business() {
  return (
    <Tramo id="negocio">
      <TramoHeading index="A" eyebrow={business.eyebrow}>
        {business.heading}
      </TramoHeading>
      <Lede>{business.body}</Lede>

      <dl className="mt-10 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {business.kpis.map((k) => (
          <div key={k.label} className="reveal flex flex-col rounded-lg bg-(--surface) p-5">
            <dt className="text-sm text-(--ink-dim)">{k.label}</dt>
            <dd className="mt-2 text-xl font-semibold tracking-tight whitespace-nowrap tabular md:text-3xl">
              {k.value}
            </dd>
            <dd className="mt-auto pt-3 leading-none [&>a]:ml-0">
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
              <p className="text-sm font-medium text-(--seen-ink)">{m.date}</p>
              <p className="mt-1 leading-relaxed">
                {m.label}
                <Cite id={m.source} />
              </p>
            </li>
          ))}
        </ol>
        <blockquote className="reveal self-start">
          <p className="relative pl-5 text-2xl leading-snug font-medium md:text-3xl">
            <span aria-hidden className="absolute left-0 text-(--seen-ink)">
              “
            </span>
            {business.plan.quote}”
          </p>
          <footer className="mt-4 pl-5 text-sm text-(--ink-dim)">
            {business.plan.attribution}
            <Cite id={business.plan.source} />
          </footer>
        </blockquote>
      </div>
    </Tramo>
  );
}

/** 02 · La app hoy: la curva del share y el viaje de una compra por el embudo. */
export function AppToday() {
  return (
    <Tramo id="app" deep>
      <TramoHeading index="02" eyebrow={app.eyebrow}>
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
            <div key={f.label} className="reveal flex flex-col rounded-lg bg-(--surface) p-4">
              <dd className="text-xl font-semibold tracking-tight whitespace-nowrap tabular md:text-2xl">
                {f.value}
              </dd>
              <dt className="mt-1 text-sm leading-snug text-(--ink-dim)">{f.label}</dt>
              {"note" in f && f.note ? (
                <dd className="mono mt-2 text-xs text-(--ink-dim)">{f.note}</dd>
              ) : null}
              <dd className="mt-auto pt-3 leading-none [&>a]:ml-0">
                <Cite id={f.source} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <FlightJourney />
    </Tramo>
  );
}

/** 03 · El balde: lo que crece (Pasaporte) contra lo que no (la vuelta). */
export function Bucket() {
  return (
    <Tramo id="balde">
      <TramoHeading index="03" eyebrow={bucket.eyebrow}>
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

      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {bucket.accounts.map((a) => (
          <li key={a.id} className="reveal flex flex-col border-t border-(--ink) pt-4">
            <InferenceBadge />
            <h3 className="mt-2 text-lg leading-snug font-semibold">{a.title}</h3>
            <p className="mt-2 leading-relaxed text-(--ink-dim)">{a.text}</p>
            <details className="group mt-auto pt-4">
              <summary className="inline-flex items-center gap-2 text-sm text-(--seen-ink)">
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
