import { competition, sources, voice } from "../despegar.data";
import { HBars, PairedBars } from "../_components/charts";
import { Cite, Cites, Tramo, TramoHeading } from "../_components/ui";

/** 05 · Lo que dicen: método primero, después dónde se rompe y contra quién. */
export function Voice() {
  return (
    <Tramo id="voz" deep>
      <TramoHeading index="04" eyebrow={voice.eyebrow}>
        {voice.heading}
      </TramoHeading>

      <ol className="mt-10 grid max-w-3xl gap-3">
        {voice.method.map((step, i) => (
          <li key={i} className="reveal flex gap-4 leading-relaxed">
            <span className="font-semibold text-(--seen-ink) tabular">{i + 1}.</span>
            <span>{step}</span>
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
        <div className="reveal md:pt-4">
          <p className="text-7xl font-semibold tracking-tight text-(--paid-ink) tabular md:text-8xl">
            {voice.promise.value}
          </p>
          <p className="mt-4 text-lg leading-relaxed">{voice.promise.text}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
        <PairedBars
          title={voice.vsAirline.title}
          groups={voice.vsAirline.groups}
          rows={voice.vsAirline.rows}
          footer={voice.vsAirline.note}
        />
        <ul className="grid gap-8 md:pt-4">
          {voice.quotes.map((q) => (
            <li key={q.text} className="reveal">
              <blockquote className="relative pl-5 text-xl leading-snug md:text-2xl">
                <span aria-hidden className="absolute left-0 text-(--paid-ink)">
                  “
                </span>
                {q.text}”
              </blockquote>
              <p className="mt-2 pl-5 text-sm">
                <a
                  href={sources[voice.quotesSource]}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={voice.quotesLinkTitle}
                  className="text-(--ink-dim) underline decoration-dotted underline-offset-2 transition-colors hover:text-(--ink)"
                >
                  {q.meta}
                </a>
              </p>
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
      <TramoHeading index="B" eyebrow={competition.eyebrow}>
        {competition.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
        {competition.lede}
      </p>

      <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {competition.items.map((item) => (
          <li key={item.line} className="reveal flex flex-col border-t border-(--ink) pt-4">
            <p className="text-sm font-medium text-(--ink-dim)">{item.company}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-(--seen-ink) tabular">
              {item.number}
            </p>
            <p className="mt-3 leading-relaxed">
              {item.line}
              <Cite id={item.source} />
            </p>
          </li>
        ))}
      </ul>

      <div className="reveal mt-12 max-w-3xl">
        <h3 className="text-xl font-semibold md:text-2xl">{competition.threat.title}</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-(--ink-dim)">
          {competition.threat.text}
          <Cites ids={competition.threat.sources} />
        </p>
      </div>
    </Tramo>
  );
}
