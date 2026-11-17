"use client";

import type { ReactNode } from "react";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";

/**
 * Entrada con el scroll para todo lo marcado adentro:
 * - `.reveal` sube y aparece;
 * - `.bar-fill` crece de izquierda a derecha y `.col-fill` de abajo hacia
 *   arriba, escalonados dentro de su gráfico (`.chart`);
 * - `.line-path` se dibuja de punta a punta.
 *
 * El HTML llega en su estado final y todo usa `gsap.from`, así que con
 * movimiento reducido (o sin JavaScript) no se oculta nada.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    q(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    q(".chart").forEach((chart) => {
      const bars = chart.querySelectorAll(".bar-fill");
      const cols = chart.querySelectorAll(".col-fill");
      const lines = chart.querySelectorAll<SVGPathElement>(".line-path");
      const trigger = { trigger: chart, start: "top 80%", once: true };

      if (bars.length) {
        gsap.from(bars, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: trigger,
        });
      }
      if (cols.length) {
        gsap.from(cols, {
          scaleY: 0,
          transformOrigin: "center bottom",
          duration: 1,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: trigger,
        });
      }
      lines.forEach((path) => {
        // El trazo tiene grosor fijo en pantalla (non-scaling-stroke), así que
        // se dibuja destapando el SVG de izquierda a derecha, no con dasharray.
        const svg = path.ownerSVGElement;
        if (!svg) return;
        gsap.fromTo(
          svg,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.6,
            ease: "power2.inOut",
            scrollTrigger: trigger,
            clearProps: "clipPath",
          },
        );
      });
    });
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
