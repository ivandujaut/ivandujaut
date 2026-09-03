"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";

const TITLE = "Leí a Lebane de pies a cabeza. Esto es lo que vi.";

/**
 * Portada. SplitText es de pago: el título se parte a mano en `span` por
 * palabra, cada uno dentro de un envoltorio con `overflow-hidden` para que
 * entren "desde abajo". La animación corre al montar, no con el scroll.
 */
export function Hero() {
  const ref = useGsapSection<HTMLElement>(({ q }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q(".word"), { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.06 })
      .from(q(".sub"), { opacity: 0, y: 12, duration: 0.6 }, "-=0.3")
      .from(q(".rule"), { scaleX: 0, transformOrigin: "left center", duration: 0.8 }, "-=0.4")
      .from(q(".cue"), { opacity: 0, duration: 0.5 }, "-=0.2");
    gsap.to(q(".cue-icon"), {
      y: 6,
      duration: 0.9,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.5,
    });
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 py-24"
    >
      <h1 className="font-serif text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl md:text-7xl">
        {TITLE.split(" ").map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span className="word inline-block">{word}</span>
            {i < TITLE.split(" ").length - 1 ? " " : null}
          </span>
        ))}
      </h1>
      <p className="sub mt-8 font-mono text-sm text-(--lebane-ink-dim) md:text-base">
        Iván Dujaut <span aria-hidden>·</span> Product Owner
      </p>
      <div className="rule mt-10 h-px w-full bg-(--lebane-accent)" aria-hidden />
      <a
        href="#timeline"
        className="cue mt-10 inline-flex w-fit items-center gap-2 text-sm text-(--lebane-ink-dim) transition-colors hover:text-foreground"
      >
        <span className="cue-icon inline-flex">
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.5} aria-hidden />
        </span>
        Tres minutos de lectura
      </a>
    </section>
  );
}
