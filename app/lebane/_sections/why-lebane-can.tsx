"use client";

import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { Section, SectionHeading } from "../_lib/section";
import { twoViews } from "../lebane.data";

const TILTS = [-5, 4, -3, 6];

/**
 * Split: a la izquierda lo que ve el banco (papeles sueltos que se apagan),
 * a la derecha lo que ve Lebane (filas de un libro mayor que se encienden una
 * por una). Va con scrub: el contraste se arma a medida que se baja.
 */
export function WhyLebaneCan() {
  const ref = useGsapSection<HTMLElement>(({ root, q }) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 60%", end: "bottom 90%", scrub: 0.6 },
    });
    tl.to(q(".paper"), { opacity: 0.3, y: 14, stagger: 0.1, duration: 1 }, 0);
    tl.from(q(".row"), { opacity: 0.15, x: -10, stagger: 0.25, duration: 0.6 }, 0.2);
    tl.from(
      q(".row-dot"),
      { backgroundColor: "var(--lebane-line)", stagger: 0.25, duration: 0.3 },
      0.35,
    );
  });

  return (
    <Section id="why-lebane-can" ref={ref}>
      <SectionHeading eyebrow="04 · Por qué Lebane puede">
        El banco necesita la historia de la empresa. Lebane tiene la obra en tiempo real.
      </SectionHeading>
      <p className="mt-6 max-w-2xl text-lg text-(--lebane-ink-dim)">
        Lo dicen los propios fundadores: cada proyecto es un fideicomiso o una razón social nueva, y
        la banca no tiene con qué evaluar el riesgo. La unidad de riesgo correcta es el proyecto, y
        el único libro mayor del proyecto está en Lebane.
      </p>

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
        <div>
          <h3 className="font-mono text-xs tracking-widest text-(--lebane-ink-dim) uppercase">
            {twoViews.bank.title}
          </h3>
          <ul className="mt-6 flex flex-wrap gap-4">
            {twoViews.bank.items.map((item, i) => (
              <li
                key={item}
                className="paper rounded-sm border border-(--lebane-line) bg-muted/50 px-4 py-3 font-serif text-lg"
                style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-widest text-(--lebane-accent) uppercase">
            {twoViews.lebane.title}
          </h3>
          <ol className="mt-6 divide-y divide-(--lebane-line) border-y border-(--lebane-line)">
            {twoViews.lebane.items.map((item, i) => (
              <li key={item} className="row flex items-center gap-4 py-3">
                <span className="row-dot size-2 rounded-full bg-(--lebane-accent)" aria-hidden />
                <span className="font-mono text-xs text-(--lebane-ink-dim)">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base">{item}</span>
                <span className="ml-auto font-mono text-[0.7rem] text-(--lebane-accent)">
                  en tiempo real
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
