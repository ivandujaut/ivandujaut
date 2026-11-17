import { hero } from "../despegar.data";
import { DepartureBoard } from "../_components/board";
import { Reveal } from "../_components/reveal";

/** Portada: la tesis en dos frases, quién soy en una, y el tablero del mismo vuelo. */
export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-(--lavender) to-transparent"
      />
      <Reveal className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pt-20 pb-20 md:grid-cols-[1.15fr_1fr] md:items-center md:px-10 md:pt-28 md:pb-28">
        <div>
          <p className="reveal mono text-xs tracking-widest text-(--seen-ink) uppercase">
            {hero.kicker}
          </p>
          <h1 className="reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
            {hero.title} <span className="font-normal text-(--ink-dim)">{hero.titleAccent}</span>
          </h1>
          <p className="reveal mt-7 max-w-xl text-lg leading-relaxed text-(--ink-dim)">
            {hero.lede}
          </p>
          <p className="reveal mono mt-4 text-xs text-(--ink-dim)">{hero.byline}</p>
        </div>

        <div className="grid gap-4">
          <DepartureBoard />
          <p className="reveal text-sm leading-relaxed text-(--ink-dim)">{hero.cue}</p>
        </div>

        <ol className="grid gap-3 md:col-span-2 md:grid-cols-3 md:gap-5">
          {hero.summary.map((item, i) => (
            <li key={item.label} className="reveal">
              <a
                href={item.href}
                className="group block h-full rounded-xl border border-(--rule) bg-(--surface) p-5 transition-colors hover:border-(--seen)"
              >
                <p className="mono text-xs tracking-wide text-(--seen-ink) uppercase">
                  {String(i + 1).padStart(2, "0")} <span aria-hidden>·</span> {item.label}
                </p>
                <p className="mt-3 leading-relaxed text-(--ink)">{item.text}</p>
                <span
                  aria-hidden
                  className="mono mt-3 inline-block text-(--seen-ink) transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
