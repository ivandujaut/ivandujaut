"use client";

import { author, hero, tickets } from "../lacaja.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { ExampleBadge, TicketCard } from "../_components/ui";

/**
 * Portada: la bandeja llena. Las seis solicitudes de un mes de una flota
 * caen una por una y cada una recibe su sello de "48 hs hábiles". La entrada
 * corre al cargar (no con el scroll) porque es lo primero que se ve. Las
 * mismas seis solicitudes vuelven en el tramo 03, ya con destino.
 */
export function Hero() {
  const ref = useGsapSection<HTMLElement>(({ q }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q(".hero-line"), { yPercent: 105, duration: 0.9, stagger: 0.12 })
      .from(q(".hero-fade"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, "-=0.4")
      .from(
        q(".hero-ticket"),
        { opacity: 0, y: -24, duration: 0.5, stagger: 0.14, ease: "power2.out" },
        "-=0.3",
      )
      .from(
        q(".hero-ticket .stamp"),
        { opacity: 0, scale: 1.8, duration: 0.35, stagger: 0.14, ease: "back.out(2.5)" },
        "<0.25",
      );
  });

  return (
    <section ref={ref} id="inicio" className="relative">
      <div className="mx-auto grid min-h-svh w-full max-w-6xl content-center gap-12 px-4 pt-20 pb-16 md:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <p className="hero-fade label text-(--red)">{hero.kicker}</p>
          <h1 className="mt-6 font-serif text-[2.4rem] leading-[1.08] md:text-[4.1rem]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span className="hero-line block">{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-8 max-w-xl text-lg leading-relaxed text-(--ink-dim)">
            {hero.lede}
          </p>
          <p className="hero-fade mt-6 text-sm text-(--ink-dim)">
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-ph="contact_click"
              data-ph-kind="linkedin"
              data-ph-surface="lacaja-hero"
              className="font-semibold text-(--ink) underline decoration-(--ink-faint) underline-offset-4 hover:decoration-(--ink)"
            >
              {author.name}
            </a>{" "}
            <span aria-hidden>·</span> {hero.byline}
          </p>
          <p className="hero-fade mt-10 max-w-sm text-sm text-(--ink-muted)">{hero.cue}</p>
        </div>

        <div className="self-center rounded-xl border border-(--rule) bg-(--surface-deep) p-3 md:p-4">
          <div className="hero-fade flex flex-wrap items-center justify-between gap-2 px-1 pb-3">
            <p className="text-sm font-semibold">{hero.trayLabel}</p>
            <ExampleBadge>{hero.exampleBadge}</ExampleBadge>
          </div>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1 xl:grid-cols-2">
            {tickets.map((t) => (
              <li key={t.id} className="hero-ticket">
                <TicketCard ticket={t} show="wait" className="h-full max-sm:[&_.t-detail]:hidden" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
