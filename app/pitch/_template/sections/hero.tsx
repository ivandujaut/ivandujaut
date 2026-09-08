"use client";

import { Fragment, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import type { Pitch } from "@/pitches/types";
import { gsap } from "../lib/gsap";
import { useGsapSection } from "../lib/use-gsap-section";

interface HeroProps {
  hero: Pitch["hero"];
  author: Pitch["author"];
  /** Ilustración de la portada (ver `illustrations/`); el hilo nace de ella. */
  illustration: ReactNode;
  nextId: string;
}

/**
 * Portada. SplitText es de pago: el título se parte a mano en `span` por
 * palabra. A la derecha, la ilustración se dibuja línea por línea (clases
 * `sky` y `sky-fill`). Todo corre al montar, no con el scroll.
 */
export function Hero({ hero, author, illustration, nextId }: HeroProps) {
  const ref = useGsapSection<HTMLElement>(({ root, q }) => {
    // Salida: al empezar a bajar, el texto se retira. La ilustración se queda
    // quieta: el hilo conductor nace de ella y tiene que coincidir.
    gsap.to(q(".hero-copy"), {
      y: -80,
      opacity: 0.1,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });

    const strokes = q(".sky") as SVGPathElement[];
    strokes.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    // Las palabras no arrancan invisibles ni recortadas: el título es el
    // elemento más grande de la portada (LCP) y tiene que estar pintado desde
    // el primer cuadro. Solo suben unos píxeles hasta su lugar.
    tl.from(q(".word"), { y: 22, duration: 0.8, stagger: 0.05 })
      .from(q(".sub"), { opacity: 0, y: 12, duration: 0.6 }, "-=0.3")
      .to(strokes, { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: "power1.inOut" }, 0.3)
      .from(q(".sky-fill"), { opacity: 0, duration: 0.6 }, ">-0.2")
      .from(q(".rule"), { scaleX: 0, transformOrigin: "left center", duration: 0.8 }, "-=0.6")
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

  // El espacio va fuera del `inline-block`: adentro, el blanco final se
  // colapsa y las palabras se pegan.
  const words = (text: string, italic: boolean) =>
    text.split(" ").map((word, i) => (
      <Fragment key={`${italic}-${i}`}>
        <span className={`word inline-block ${italic ? "italic text-(--pitch-accent)" : ""}`}>
          {word}
        </span>{" "}
      </Fragment>
    ));

  return (
    <section
      id="hero"
      ref={ref}
      className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 py-24"
    >
      <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr] md:gap-8">
        <h1 className="hero-copy font-serif text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          {words(hero.title, false)} {words(hero.titleAccent, true)}
        </h1>
        {illustration}
      </div>
      <p className="sub hero-copy mt-8 font-mono text-sm text-(--pitch-ink-dim) md:text-base">
        <a
          href={author.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          data-ph="contact_click"
          data-ph-kind="linkedin"
          data-ph-surface="pitch-hero"
          className="underline decoration-(--pitch-line) underline-offset-4 transition-colors hover:text-foreground hover:decoration-(--pitch-accent)"
        >
          {author.name}
        </a>
      </p>
      <div className="rule mt-10 h-px w-full bg-(--pitch-accent)" aria-hidden />
      <a
        href={`#${nextId}`}
        className="cue mt-10 inline-flex w-fit items-center gap-2 text-sm text-(--pitch-ink-dim) transition-colors hover:text-foreground"
      >
        <span className="cue-icon inline-flex">
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.5} aria-hidden />
        </span>
        {hero.readingCue}
      </a>
    </section>
  );
}
