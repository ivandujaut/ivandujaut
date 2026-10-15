"use client";

import type { ReactNode } from "react";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";

/**
 * Entrada con el scroll para todo lo marcado con `.reveal` adentro: sube,
 * se enfoca y aparece, una vez, con una curva pesada. El HTML llega visible,
 * así que con movimiento reducido (o sin JavaScript) no se oculta nada.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    q(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 48,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.9,
        ease: "power4.out",
        clearProps: "filter",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
