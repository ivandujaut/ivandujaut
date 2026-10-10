"use client";

import { author, hero } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";

/**
 * Portada. La cinta nace acá: una moneda en el carril y la cinta que baja
 * hasta el borde del tramo, donde la retoma el siguiente. La entrada corre al
 * cargar (no con el scroll) porque es lo primero que se ve.
 */
export function Hero() {
  const ref = useGsapSection<HTMLElement>(({ q }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q(".hero-line"), { yPercent: 105, duration: 0.9, stagger: 0.12 })
      .from(q(".hero-fade"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, "-=0.4")
      .from(q(".hero-coin"), { scale: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.2")
      .from(q(".hero-ribbon"), { scaleY: 0, duration: 1.1, ease: "power2.inOut" }, "-=0.1");
  });

  return (
    <section ref={ref} id="inicio" className="relative">
      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col pt-20 pr-5 pb-0 pl-16 md:pt-28 md:pr-10 md:pl-28">
        <p className="hero-fade num text-xs tracking-widest text-(--trapped-ink) uppercase">
          {hero.kicker}
        </p>

        <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.02] font-semibold tracking-tight md:text-[5.2rem]">
          <span className="block overflow-hidden pb-1">
            <span className="hero-line block">{hero.title}</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="hero-line block text-(--trapped-ink) italic">{hero.titleAccent}</span>
          </span>
        </h1>

        <p className="hero-fade mt-8 max-w-xl text-lg leading-relaxed text-(--ink-dim) md:text-xl">
          {hero.lede}
        </p>

        <p className="hero-fade mt-6 text-sm text-(--ink-dim)">
          <a
            href={author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-ph="contact_click"
            data-ph-kind="linkedin"
            data-ph-surface="brinta-hero"
            className="font-medium text-(--ink) underline decoration-(--ink-faint) underline-offset-4 hover:decoration-(--ink)"
          >
            {author.name}
          </a>{" "}
          <span aria-hidden>·</span> {hero.byline}
        </p>

        {/*
          Arranque de la cinta. El carril queda 2rem (celular) o 3.5rem
          (escritorio) a la izquierda del texto: es la mitad del padding del
          tramo. La cinta baja desde la moneda hasta el borde de la portada,
          donde la retoma el tramo siguiente.
        */}
        <div className="relative mt-auto pt-16">
          <div
            aria-hidden
            className="hero-ribbon absolute top-[4.6rem] bottom-0 -left-8 origin-top -translate-x-1/2 bg-(--flow) md:-left-14"
            style={{ width: "var(--spine-width)" }}
          />
          <div
            aria-hidden
            className="hero-coin absolute top-[4.6rem] -left-8 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-(--flow) bg-(--paper) md:-left-14 md:size-8"
          />
          <div className="hero-fade flex items-center gap-3 text-sm text-(--ink-dim)">
            <span className="num text-base text-(--ink)">{hero.ribbonLabel}</span>
          </div>
          <p className="hero-fade mt-3 max-w-sm text-sm text-(--ink-dim)">{hero.cue}</p>
          <div aria-hidden className="h-24 md:h-32" />
        </div>
      </div>
    </section>
  );
}
