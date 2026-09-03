"use client";

import { Fragment } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";

const TITLE_A = "Leí a Lebane de pies a cabeza.";
const TITLE_B = "Esto es lo que vi.";

/**
 * Portada. SplitText es de pago: el título se parte a mano en `span` por
 * palabra, cada uno dentro de un envoltorio con `overflow-hidden` para que
 * entren "desde abajo". A la derecha, un plano de obra (dos edificios, una
 * grúa) se dibuja línea por línea; el piso encendido es el guiño a Payments.
 * Todo corre al montar, no con el scroll.
 */
export function Hero() {
  const ref = useGsapSection<HTMLElement>(({ root, q }) => {
    // Salida: al empezar a bajar, el texto se retira. El plano se queda quieto:
    // el hilo conductor nace de su grúa y tiene que coincidir con él.
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
    tl.from(q(".word"), { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.05 })
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

  // El espacio va fuera del envoltorio `overflow-hidden`: adentro de un
  // inline-block el blanco final se colapsa y las palabras se pegan.
  const words = (text: string, italic: boolean) =>
    text.split(" ").map((word, i) => (
      <Fragment key={`${italic}-${i}`}>
        <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span className={`word inline-block ${italic ? "italic text-(--lebane-accent)" : ""}`}>
            {word}
          </span>
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
          {words(TITLE_A, false)} {words(TITLE_B, true)}
        </h1>
        <svg
          viewBox="0 0 360 170"
          className="skyline w-full max-w-xs justify-self-start text-(--lebane-accent) md:max-w-sm md:justify-self-end"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {/* edificio bajo, terminado */}
          <path className="sky" d="M10 150 V70 H70 V150" />
          <path className="sky" d="M10 90 H70 M10 110 H70 M10 130 H70" opacity="0.5" />
          {/* torre, con un piso encendido */}
          <path className="sky" d="M86 150 V26 H160 V150" />
          <path
            className="sky"
            d="M86 46 H160 M86 66 H160 M86 86 H160 M86 106 H160 M86 126 H160"
            opacity="0.5"
          />
          <rect
            className="sky-fill"
            x="86"
            y="86"
            width="74"
            height="20"
            fill="currentColor"
            opacity="0.22"
            stroke="none"
          />
          {/* obra en curso: columnas y una losa */}
          <path
            className="sky"
            d="M184 150 V96 M210 150 V96 M236 150 V96 M262 150 V96 M178 96 H268"
          />
          <path className="sky" d="M184 123 H262" opacity="0.5" />
          {/* grúa torre: mástil reticulado */}
          <path className="sky" d="M290 150 V44 M300 150 V44" />
          <path
            className="sky"
            d="M290 136 L300 122 L290 108 L300 94 L290 80 L300 66 L290 52"
            opacity="0.6"
          />
          {/* cabina y torreta en punta */}
          <path className="sky" d="M286 44 H304 V36 H286 Z M290 36 L295 18 L300 36" />
          {/* pluma y contrapluma, con contrapeso */}
          <path className="sky" d="M234 44 H356 M240 49 H350" />
          <path
            className="sky"
            d="M246 44 L252 49 L258 44 L264 49 L270 44 L276 49 L282 44 M308 44 L314 49 L320 44 L326 49 L332 44 L338 49 L344 44"
            opacity="0.6"
          />
          <path className="sky" d="M238 49 V60 H254 V49" />
          {/* tirantes desde la punta */}
          <path className="sky" d="M295 18 L350 44 M295 18 L240 44" opacity="0.7" />
          {/* carro, cable y gancho */}
          <path className="sky" d="M330 49 H340 V53 H330 Z M335 53 V110" />
          <path className="sky" d="M335 110 V116 a4 4 0 0 1 -8 0" />
          {/* suelo */}
          <path className="sky" d="M0 150 H360" />
        </svg>
      </div>
      <p className="sub hero-copy mt-8 font-mono text-sm text-(--lebane-ink-dim) md:text-base">
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
