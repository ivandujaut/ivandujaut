"use client";

import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";

export type SpineVariant = "run" | "end";

interface SpineProps {
  variant?: SpineVariant;
  /**
   * `always`: la cinta se dibuja con el scroll en todas las pantallas.
   * `mobile`: sólo en celular. Es para los tramos que se fijan en escritorio:
   * ahí la sección entera queda quieta y la cinta ya está dibujada.
   */
  animateOn?: "always" | "mobile";
}

/**
 * La cinta de plata que baja por el margen de cada tramo. Los tramos van
 * pegados uno al otro, así que los segmentos se leen como una sola cinta.
 *
 * Se dibuja de arriba hacia abajo con el scroll (scrub): la punta va un poco
 * por debajo del centro de la pantalla, como si la plata bajara con el lector.
 * Sin animación queda dibujada entera; una guía punteada marca el recorrido.
 */
export function Spine({ variant = "run", animateOn = "always" }: SpineProps) {
  const ref = useGsapSection<HTMLDivElement>(({ q, isMobile }) => {
    if (animateOn === "mobile" && !isMobile) return;
    gsap.from(q(".spine-ink"), {
      scaleY: 0,
      ease: "none",
      scrollTrigger: {
        trigger: q(".spine-ink")[0],
        start: "top 62%",
        end: "bottom 62%",
        scrub: 0.4,
      },
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-3 flex w-10 justify-center md:left-6 md:w-16"
    >
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-(--ink-faint)"
        style={variant === "end" ? { bottom: "auto", height: "7rem" } : undefined}
      />
      <div
        className="spine-ink absolute top-0 left-1/2 origin-top -translate-x-1/2 bg-(--flow)"
        style={{
          width: "var(--spine-width)",
          height: variant === "end" ? "7rem" : "100%",
          borderRadius: variant === "end" ? "0 0 9999px 9999px" : undefined,
        }}
      />
    </div>
  );
}
