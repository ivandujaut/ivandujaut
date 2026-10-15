"use client";

import { author, hero } from "../zubale.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { ExampleBadge, ReaderLabel } from "../_components/ui";

/**
 * Portada. Dice quién escribe y para qué, y enseña la gramática de toda la
 * página: el mismo pedido leído por una persona (coral) y por una máquina
 * (azul). Las dos lecturas coinciden en todo menos en la última fila, la de
 * la góndola, que aparece al final de la entrada: de esa fila trata la página.
 * La entrada corre al cargar porque es lo primero que se ve.
 */
export function Hero() {
  const ref = useGsapSection<HTMLElement>(({ q }) => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(q(".hero-line"), { yPercent: 105, duration: 1, stagger: 0.12 })
      .from(q(".hero-fade"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, "-=0.5")
      .from(q(".hero-seam"), { scaleY: 0, duration: 0.9, ease: "power3.inOut" }, "-=0.4")
      .from(q(".hero-row-p"), { opacity: 0, x: -16, duration: 0.7, stagger: 0.1 }, "-=0.5")
      .from(q(".hero-row-a"), { opacity: 0, x: 16, duration: 0.7, stagger: 0.1 }, "<")
      .from(q(".hero-gap"), { opacity: 0, y: 10, duration: 0.8, stagger: 0.12 }, "+=0.2");
  });

  const { gap } = hero.preview;

  return (
    <section ref={ref} id="inicio" className="relative">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 pt-20 pb-16 md:px-10 md:pt-24">
        <p className="hero-fade mono text-xs tracking-widest text-(--ink-dim) uppercase">
          {hero.kicker}
        </p>

        <h1 className="mt-6 max-w-[760px] font-semibold tracking-tight">
          <span className="block overflow-hidden pb-1">
            <span className="hero-line hero-heading block text-4xl md:text-6xl">{hero.title}</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="hero-line mt-2 block text-2xl text-(--person-ink) md:text-4xl">
              {hero.titleAccent}
            </span>
          </span>
        </h1>

        <p className="hero-fade mt-8 max-w-[680px] text-lg">{hero.lede}</p>

        <p className="hero-fade mt-4 text-sm text-(--ink-dim)">
          <a
            href={author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-ph="contact_click"
            data-ph-kind="linkedin"
            data-ph-surface="zubale-hero"
            className="font-medium text-(--ink) underline decoration-(--ink-faint) underline-offset-4 transition-colors hover:decoration-(--ink)"
          >
            {author.name}
          </a>{" "}
          <span aria-hidden>·</span> {hero.byline}
        </p>

        <ol className="hero-fade mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
          {hero.summary.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                className="group block h-full rounded-xl border border-(--rule) p-4 transition-colors hover:bg-(--surface)"
              >
                <p className="text-xs font-semibold tracking-wide uppercase">
                  {s.label}{" "}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-500 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </p>
                <p className="mt-2 text-sm text-(--ink-dim)">{s.text}</p>
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-12">
          <div className="hero-fade rounded-2xl border border-(--rule) bg-(--surface) p-4 md:p-6">
            <div className="flex justify-end">
              <ExampleBadge>datos de ejemplo</ExampleBadge>
            </div>
            <div className="relative mt-3 grid grid-cols-2 gap-4 md:gap-12">
              <div
                aria-hidden
                className="hero-seam absolute inset-y-0 left-1/2 w-px origin-top bg-(--rule)"
              />
              <div>
                <ReaderLabel who="person" />
                <ul className="mt-4 space-y-3 text-xs md:text-base">
                  {hero.preview.person.map((line) => (
                    <li key={line} className="hero-row-p">
                      {line}
                    </li>
                  ))}
                  <li className="hero-gap font-semibold text-(--risk)">{gap.person}</li>
                </ul>
              </div>
              <div>
                <ReaderLabel who="agent" />
                <ul className="mono mt-4 space-y-3 text-[11px] break-words text-(--agent-ink) md:text-sm">
                  {hero.preview.agent.map((line) => (
                    <li key={line} className="hero-row-a">
                      {line}
                    </li>
                  ))}
                  <li className="hero-gap">
                    {gap.agent}
                    <span className="mt-2 block w-fit rounded-md bg-(--risk-soft) px-2 py-1 font-sans text-xs font-medium text-(--risk)">
                      {gap.label}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="hero-fade mt-4 max-w-2xl text-sm text-(--ink-dim)">{hero.cue}</p>
        </div>
      </div>
    </section>
  );
}
