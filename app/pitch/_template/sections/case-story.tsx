"use client";

import { useState } from "react";
import type { Pitch } from "@/pitches/types";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useGsapSection } from "../lib/use-gsap-section";
import { GAUGE_LENGTH, ScoreCard } from "./score-card";

interface CaseStoryProps {
  steps: Pitch["case"]["steps"];
  card: Pitch["case"]["card"];
}

/**
 * El relato del caso, al estilo "texto que baja, gráfico que se queda": la
 * maqueta es sticky a la derecha y cada paso del texto la maneja. Con el
 * primer paso la maqueta espera vacía; con el segundo se llenan los
 * indicadores y sube el score; con el tercero se abre solo el desplegable (el
 * botón sigue siendo real). En mobile la maqueta va debajo del texto y se
 * llena con el scroll, sin abrirse sola.
 */
export function CaseStory({ steps, card }: CaseStoryProps) {
  const [open, setOpen] = useState(false);

  const ref = useGsapSection<HTMLDivElement>(
    ({ root, q, isDesktop }) => {
      const stepEls = q(".step") as HTMLElement[];
      const cardEl = root.querySelector<HTMLElement>(".score-card");
      const total = root.querySelector<HTMLElement>(".score-total");
      const gauge = root.querySelector<SVGCircleElement>(".gauge-fill");
      if (!cardEl || !total || stepEls.length < 3) return;

      const original = total.textContent ?? "";
      const proxy = { n: 0 };
      // El tween del contador recién escribe al avanzar: sin esto el score
      // muestra el valor final mientras las barras todavía están vacías.
      total.textContent = "0";
      const fill = gsap.timeline({
        scrollTrigger: isDesktop
          ? { trigger: stepEls[1], start: "top 70%", end: "bottom 50%", scrub: 0.5 }
          : { trigger: cardEl, start: "top 85%", end: "center 45%", scrub: 0.5 },
      });
      fill.from(q(".bar-fill"), {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.2,
        duration: 0.8,
        ease: "none",
      });
      if (gauge)
        fill.from(gauge, { strokeDashoffset: GAUGE_LENGTH, duration: 1.6, ease: "none" }, 0);
      fill.to(
        proxy,
        {
          n: card.totalScore,
          duration: 1.6,
          ease: "none",
          onUpdate: () => {
            total.textContent = String(Math.round(proxy.n));
          },
        },
        0,
      );

      if (isDesktop) {
        // El paso activo se lee; los otros esperan en gris.
        gsap.set(stepEls, { opacity: 0.35 });
        stepEls.forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => gsap.to(step, { opacity: self.isActive ? 1 : 0.35, duration: 0.3 }),
          });
        });
        // La maqueta espera en gris hasta que llega el segundo paso.
        gsap.set(cardEl, { opacity: 0.45 });
        ScrollTrigger.create({
          trigger: stepEls[1],
          start: "top 75%",
          onEnter: () => gsap.to(cardEl, { opacity: 1, duration: 0.4 }),
          onLeaveBack: () => gsap.to(cardEl, { opacity: 0.45, duration: 0.4 }),
        });
        // El tercer paso abre el desplegable solo; volver atrás lo cierra.
        ScrollTrigger.create({
          trigger: stepEls[2],
          start: "top 60%",
          onEnter: () => setOpen(true),
          onLeaveBack: () => setOpen(false),
        });
      }

      return () => {
        total.textContent = original;
      };
    },
    [steps, card],
  );

  return (
    <div ref={ref} className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1fr_1.1fr] md:gap-14">
      <div className="space-y-10 md:space-y-[38vh] md:pt-[10vh] md:pb-[20vh]">
        {steps.map((step) => (
          <div key={step.id} className="step">
            <h3 className="font-mono text-xs tracking-widest text-(--pitch-accent) uppercase">
              {step.eyebrow}
            </h3>
            <p className="mt-3 text-lg leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="md:sticky md:top-[10vh] md:self-start">
        <ScoreCard card={card} open={open} onToggle={() => setOpen((v) => !v)} />
      </div>
    </div>
  );
}
