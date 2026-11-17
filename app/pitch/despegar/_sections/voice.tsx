import { competition, voice } from "../despegar.data";
import { HBars } from "../_components/charts";
import { Cite, Cites, Tramo, TramoHeading } from "../_components/ui";

/** 05 · Lo que dicen: método primero, después dónde se rompe y contra quién. */
export function Voice() {
  return (
    <Tramo id="voz" deep>
      <TramoHeading index="05" eyebrow={voice.eyebrow}>
        {voice.heading}
      </TramoHeading>

      <ol className="mt-10 grid gap-3 md:grid-cols-4">
        {voice.method.map((step, i) => (
          <li key={i} className="reveal rounded-xl bg-(--surface) p-5">
            <p className="mono text-xs text-(--seen-ink)">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 text-sm leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
      <p className="reveal mt-4 max-w-3xl text-sm leading-relaxed text-(--ink-dim)">
        {voice.caveat}
        <Cite id={voice.source} />
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-start">
        <HBars
          title={voice.stages.title}
          rows={voice.stages.rows}
          unit={voice.stages.unit}
          tone="ink"
        />
        <div className="reveal rounded-xl bg-(--night) p-6 text-white md:p-8">
          <p className="text-6xl font-semibold tracking-tight text-[#ff8a7a] tabular md:text-7xl">
            {voice.promise.value}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/85">{voice.promise.text}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
        <HBars
          title={voice.peers.title}
          rows={voice.peers.rows}
          unit={voice.peers.unit}
          footer={voice.peers.note}
        />
        <ul className="grid gap-3">
          {voice.quotes.map((q) => (
            <li
              key={q.text}
              className="reveal rounded-xl border-l-4 border-(--paid) bg-(--surface) p-5"
            >
              <blockquote className="text-lg leading-snug">“{q.text}”</blockquote>
              <p className="mono mt-2 text-xs text-(--ink-dim)">{q.meta}</p>
            </li>
          ))}
        </ul>
      </div>
    </Tramo>
  );
}

/** 06 · Contra quién: lo que los globales publican de sus apps, y el rival que nombran las reseñas. */
export function Competition() {
  return (
    <Tramo id="competencia">
      <TramoHeading index="06" eyebrow={competition.eyebrow}>
        {competition.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
        {competition.lede}
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {competition.items.map((item) => (
          <li key={item.line} className="reveal flex flex-col rounded-xl bg-(--surface) p-6">
            <p className="mono text-xs tracking-wide text-(--ink-dim) uppercase">{item.company}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-(--seen-ink) tabular">
              {item.number}
            </p>
            <p className="mt-3 leading-relaxed">
              {item.line}
              <Cite id={item.source} />
            </p>
          </li>
        ))}
      </ul>

      <div className="reveal mt-10 rounded-xl border border-(--rule) bg-(--surface) p-6 md:p-8">
        <h3 className="text-xl font-semibold md:text-2xl">{competition.threat.title}</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-(--ink-dim)">
          {competition.threat.text}
          <Cites ids={competition.threat.sources} />
        </p>
      </div>
    </Tramo>
  );
}
