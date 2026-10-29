import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { door, stamp } from "../lacaja.data";
import { Cite, Cites, Tramo, TramoHeading } from "../_components/ui";

/**
 * 01 · Lo que ya está. Dos columnas: lo que el portal resuelve solo (consultar
 * y descargar) y lo que entra online pero termina en solicitud. Después, por
 * qué eso ya es más que el mercado y quién pone el estándar.
 */
export function Door() {
  return (
    <Tramo id="puerta" deep>
      <TramoHeading index={door.index} eyebrow={door.eyebrow}>
        {door.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{door.intro}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="reveal rounded-xl border border-(--rule) bg-(--surface) p-5 md:p-6">
          <p className="label text-(--blue)">{door.consults.label}</p>
          <ul className="mt-4 space-y-3">
            {door.consults.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--blue) text-white">
                  <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2.5} aria-hidden />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal rounded-xl border border-(--rule) bg-(--surface) p-5 md:p-6">
          <p className="label text-(--ink-muted)">{door.changes.label}</p>
          <ul className="mt-4 space-y-3">
            {door.changes.items.map((item) => (
              <li
                key={item}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
              >
                <span>{item}</span>
                <span className="stamp">{stamp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figure className="reveal mt-8 max-w-3xl">
        <blockquote className="font-serif text-xl leading-relaxed italic md:text-2xl">
          «{door.quote}»
        </blockquote>
        <figcaption className="mt-3 text-sm text-(--ink-muted)">
          {door.quoteSource}.
          <Cites ids={door.quoteSources} />
        </figcaption>
      </figure>

      <div className="reveal mt-14 grid gap-8 border-t border-(--rule) pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
        <div>
          <p className="font-serif text-2xl leading-snug">{door.market.lead}</p>
          <p className="mt-4 leading-relaxed text-(--ink-dim)">
            {door.market.text} <span className="text-(--ink)">«{door.market.zurich}»</span>
            <Cites ids={door.market.sources} />
          </p>
        </div>
        <div>
          <p className="leading-relaxed text-(--ink-dim)">
            {door.market.art}
            <Cite id={door.market.artSource} />
          </p>
          <p className="mt-4 font-semibold">{door.market.close}</p>
        </div>
      </div>
    </Tramo>
  );
}
