import { caseStudy, labels, thesis } from "../despegar.data";
import { CutSimulator } from "../_components/cut-simulator";
import { Fold } from "../_components/fold";
import { ExampleBadge, Tramo, TramoHeading } from "../_components/ui";

/** 05 · La tesis: tres frases, una por paso, cada una con su piso. */
export function Thesis() {
  return (
    <Tramo id="tesis" night>
      <p className="reveal text-sm font-medium text-white/70 tabular">
        05 <span aria-hidden>·</span> {thesis.eyebrow}
      </p>
      <ol className="mt-10 grid gap-10 md:gap-14">
        {thesis.sentences.map((s) => (
          <li key={s.key} className="reveal max-w-4xl">
            <p className="text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
              {s.text}
            </p>
            <p className="mt-3 max-w-2xl text-lg text-white/70">{s.floor}</p>
          </li>
        ))}
      </ol>
    </Tramo>
  );
}

/** 06 · El caso: objetivo, piezas, experimento, segmentos, corte, y qué no construir. */
export function Case() {
  const c = caseStudy;
  return (
    <Tramo id="caso">
      <TramoHeading index="06" eyebrow={c.eyebrow}>
        {c.heading}
      </TramoHeading>

      <p className="reveal mt-8 max-w-3xl text-xl leading-snug font-medium text-(--ink) md:text-2xl">
        {c.objective}
      </p>
      <p className="reveal mt-6 max-w-3xl text-lg leading-relaxed text-(--ink-dim)">{c.problem}</p>

      <ol className="mt-10 grid gap-8 md:grid-cols-2">
        {c.pieces.map((p, i) => (
          <li key={p.id} className="reveal border-t border-(--ink) pt-4">
            <h3 className="text-lg font-semibold">
              <span className="text-(--seen-ink) tabular">{i + 1}.</span> {p.title}
            </h3>
            <p className="mt-2 leading-relaxed text-(--ink-dim)">{p.text}</p>
          </li>
        ))}
      </ol>

      <div className="reveal mt-14">
        <h3 className="text-lg font-semibold">{c.ai.title}</h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {c.ai.items.map((t) => (
            <li key={t} className="leading-relaxed text-(--ink-dim)">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <Fold
        className="group mt-14 border-y border-(--rule) py-5"
        summaryClassName="flex cursor-pointer items-center gap-3 text-lg font-semibold"
        summary={
          <>
            <span
              aria-hidden
              className="text-(--seen-ink) transition-transform duration-500 group-open:rotate-90"
            >
              ›
            </span>
            {c.design}
          </>
        }
      >
        <h3 className="mt-8 text-2xl font-semibold md:text-3xl">{c.experiment.title}</h3>
        <dl className="mt-6 border-t border-(--rule)">
          {c.experiment.rows.map((r) => (
            <div
              key={r.label}
              className="reveal grid gap-1 border-b border-(--rule) py-4 md:grid-cols-[14rem_1fr] md:gap-6"
            >
              <dt className="font-semibold">{r.label}</dt>
              <dd className="leading-relaxed">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="reveal mt-3 text-sm text-(--ink-dim)">{c.experiment.assumptionsNote}</p>

        <h3 className="reveal mt-16 text-2xl font-semibold md:text-3xl">{c.segments.title}</h3>
        <ul className="mt-6 grid gap-8 md:grid-cols-3">
          {c.segments.rows.map((s) => (
            <li key={s.segment} className="reveal border-t border-(--ink) pt-4">
              <p className="text-lg font-semibold">{s.segment}</p>
              <p className="mt-3 text-sm font-medium text-(--ink-dim)">{labels.segmentWhy}</p>
              <p className="mt-1 leading-relaxed text-(--ink-dim)">{s.why}</p>
              <p className="mt-3 text-sm font-medium text-(--seen-ink)">{labels.segmentCut}</p>
              <p className="mt-1 leading-relaxed">{s.cut}</p>
            </li>
          ))}
        </ul>
      </Fold>

      <h3 className="reveal mt-16 text-2xl font-semibold md:text-3xl">{c.cut.title}</h3>
      <CutSimulator />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="reveal is-example rounded-lg bg-(--surface) p-6">
          <ExampleBadge>{c.impact.label}</ExampleBadge>
          <p className="mt-4 leading-relaxed">{c.impact.text}</p>
        </div>
        <div className="reveal">
          <h3 className="text-lg font-semibold">{c.notToBuild.title}</h3>
          <ul className="mt-3 grid list-disc gap-2 pl-5 leading-relaxed text-(--ink-dim)">
            {c.notToBuild.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="reveal mt-14 max-w-3xl text-xl leading-snug font-medium md:text-2xl">
        {c.firstQuestion}
      </p>
    </Tramo>
  );
}
