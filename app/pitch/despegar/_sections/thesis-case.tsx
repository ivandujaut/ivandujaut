import { cn } from "@/lib/utils";
import { caseStudy, labels, thesis } from "../despegar.data";
import { ExampleBadge, Tramo, TramoHeading } from "../_components/ui";

/** Pinta la palabra clave de la frase con el color de su lectura. */
function Keyworded({
  text,
  keyword,
  tone,
}: {
  text: string;
  keyword: string;
  tone: "seen" | "paid";
}) {
  const i = text.indexOf(keyword);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className={tone === "seen" ? "text-[#b9a1ff]" : "text-[#ff8a7a]"}>{keyword}</span>
      {text.slice(i + keyword.length)}
    </>
  );
}

/** 07 · La tesis: tres frases, una por paso, cada una con su piso. */
export function Thesis() {
  return (
    <Tramo id="tesis" night>
      <p className="reveal mono text-xs tracking-widest text-white/70 uppercase">
        07 <span aria-hidden>·</span> {thesis.eyebrow}
      </p>
      <ol className="mt-10 grid gap-10 md:gap-14">
        {thesis.sentences.map((s) => (
          <li key={s.key} className="reveal max-w-4xl">
            <p className="text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
              <Keyworded
                text={s.text}
                keyword={s.keyword}
                tone={s.key === "confianza" ? "paid" : "seen"}
              />
            </p>
            <p className="mt-3 max-w-2xl text-lg text-white/70">{s.floor}</p>
          </li>
        ))}
      </ol>
    </Tramo>
  );
}

/** 08 · El caso: objetivo, piezas, experimento, segmentos, corte, y qué no construir. */
export function Case() {
  const c = caseStudy;
  const cuts = [
    { key: "ship", label: labels.cut.ship, text: c.cut.ship, cls: "border-(--ok) bg-(--ok-soft)" },
    {
      key: "iterate",
      label: labels.cut.iterate,
      text: c.cut.iterate,
      cls: "border-(--watch) bg-(--watch-soft)",
    },
    {
      key: "kill",
      label: labels.cut.kill,
      text: c.cut.kill,
      cls: "border-(--paid) bg-(--paid-soft)",
    },
  ];
  return (
    <Tramo id="caso">
      <TramoHeading index="08" eyebrow={c.eyebrow}>
        {c.heading}
      </TramoHeading>

      <p className="reveal mt-8 max-w-3xl rounded-xl bg-(--seen-soft) p-6 text-xl leading-snug font-medium text-(--ink) md:text-2xl">
        {c.objective}
      </p>
      <p className="reveal mt-6 max-w-3xl text-lg leading-relaxed text-(--ink-dim)">{c.problem}</p>

      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {c.pieces.map((p) => (
          <li key={p.id} className="reveal rounded-xl bg-(--surface) p-6">
            <p className="mono text-xs tracking-wide text-(--seen-ink) uppercase">{p.eyebrow}</p>
            <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 leading-relaxed text-(--ink-dim)">{p.text}</p>
          </li>
        ))}
      </ol>

      <div className="reveal mt-6 rounded-xl border border-(--rule) bg-(--surface) p-6">
        <h3 className="text-lg font-semibold">{c.ai.title}</h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {c.ai.items.map((t) => (
            <li key={t} className="leading-relaxed text-(--ink-dim)">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <h3 className="reveal mt-16 text-2xl font-semibold md:text-3xl">{c.experiment.title}</h3>
      <dl className="mt-6 grid gap-px overflow-hidden rounded-xl bg-(--rule)">
        {c.experiment.rows.map((r) => (
          <div
            key={r.label}
            className="reveal grid gap-1 bg-(--surface) p-5 md:grid-cols-[14rem_1fr] md:gap-6"
          >
            <dt className="mono text-xs tracking-wide text-(--seen-ink) uppercase md:pt-1">
              {r.label}
            </dt>
            <dd className="leading-relaxed">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="reveal mt-3 text-sm text-(--ink-dim)">{c.experiment.assumptionsNote}</p>

      <h3 className="reveal mt-16 text-2xl font-semibold md:text-3xl">{c.segments.title}</h3>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {c.segments.rows.map((s) => (
          <li key={s.segment} className="reveal rounded-xl bg-(--surface) p-6">
            <p className="text-lg font-semibold">{s.segment}</p>
            <p className="mono mt-4 text-xs tracking-wide text-(--ink-dim) uppercase">
              {labels.segmentWhy}
            </p>
            <p className="mt-1 leading-relaxed text-(--ink-dim)">{s.why}</p>
            <p className="mono mt-4 text-xs tracking-wide text-(--seen-ink) uppercase">
              {labels.segmentCut}
            </p>
            <p className="mt-1 leading-relaxed">{s.cut}</p>
          </li>
        ))}
      </ul>

      <h3 className="reveal mt-16 text-2xl font-semibold md:text-3xl">{c.cut.title}</h3>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {cuts.map((cut) => (
          <li key={cut.key} className={cn("reveal rounded-xl border-t-4 p-6", cut.cls)}>
            <p className="mono text-xs tracking-wide uppercase">{cut.label}</p>
            <p className="mt-3 leading-relaxed">{cut.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="reveal is-example rounded-xl bg-(--surface) p-6">
          <ExampleBadge>{c.impact.label}</ExampleBadge>
          <p className="mt-4 leading-relaxed">{c.impact.text}</p>
        </div>
        <div className="reveal rounded-xl bg-(--surface) p-6">
          <h3 className="text-lg font-semibold">{c.notToBuild.title}</h3>
          <ul className="mt-3 grid gap-3">
            {c.notToBuild.items.map((t) => (
              <li key={t} className="flex gap-3 leading-relaxed text-(--ink-dim)">
                <span aria-hidden className="mono text-(--paid-ink)">
                  ×
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="reveal mt-12 max-w-3xl border-l-4 border-(--seen) pl-6 text-xl leading-snug font-medium md:text-2xl">
        {c.firstQuestion}
      </p>
    </Tramo>
  );
}
