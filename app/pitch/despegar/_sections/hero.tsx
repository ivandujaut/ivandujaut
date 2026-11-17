import { hero } from "../despegar.data";
import { DepartureBoard } from "../_components/board";
import { Reveal } from "../_components/reveal";

/** Portada: la tesis en dos frases, quién soy en una, y el tablero del mismo vuelo. */
export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-(--surface-deep)">
      <Reveal className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pt-20 pb-20 md:grid-cols-[1.15fr_1fr] md:items-center md:px-10 md:pt-28 md:pb-28">
        <div>
          <p className="reveal text-sm font-medium text-(--seen-ink)">{hero.kicker}</p>
          <h1 className="reveal mt-5 text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
            {hero.title} {hero.titleAccent}
          </h1>
          <p className="reveal mt-7 max-w-xl text-lg leading-relaxed text-(--ink-dim)">
            {hero.lede}
          </p>
          <p className="reveal mt-4 text-sm text-(--ink-dim)">{hero.byline}</p>
        </div>

        <div className="grid gap-4">
          <DepartureBoard />
          <p className="reveal text-sm leading-relaxed text-(--ink-dim)">{hero.cue}</p>
        </div>

        <ul className="grid gap-6 border-t border-(--rule) pt-8 md:col-span-2 md:grid-cols-3 md:gap-10">
          {hero.summary.map((item) => (
            <li key={item.label} className="reveal">
              <a href={item.href} className="group block">
                <p className="font-semibold text-(--ink) underline-offset-4 group-hover:underline">
                  {item.label}
                </p>
                <p className="mt-2 leading-relaxed text-(--ink-dim)">{item.text}</p>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
