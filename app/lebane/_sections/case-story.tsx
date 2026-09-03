"use client";

import { useState } from "react";
import { gsap, ScrollTrigger } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { scoreCardExample as data } from "../lebane.data";
import { GAUGE_LENGTH, ScoreCard } from "./score-card";

const STEPS = [
  {
    id: "hipotesis",
    eyebrow: "Hipótesis",
    text: "Buena parte de la tensión de caja de una desarrolladora mediana viene del desfase entre las cuotas que van a entrar y los compromisos que ya vencieron, no de la falta de ventas. Lebane ve las dos puntas.",
  },
  {
    id: "paso-1",
    eyebrow: "Paso 1 · Score de Obra",
    text: "Mostrarle a cada desarrolladora el score de su proyecto, adentro de Lebane, antes de ofrecerle crédito. Usa cinco indicadores que ya están cargados. Así la demanda aparece antes que la oferta y la carga de datos mejora.",
  },
  {
    id: "paso-2",
    eyebrow: "Paso 2 · Adelanto de cobranzas",
    text: "Hasta un porcentaje de las cuotas de los próximos 90 días de compradores con historial en término, que se repaga solo desde los ingresos por CVU. Va primero porque el repago sale del mismo flujo, los datos ya existen, el ticket es chico y el ciclo, corto.",
  },
];

/**
 * El relato del caso, al estilo "texto que baja, gráfico que se queda": la
 * maqueta es sticky a la derecha y cada paso del texto la maneja. Con la
 * hipótesis la maqueta espera vacía; con el paso 1 se llenan los indicadores
 * y sube el score; con el paso 2 se abre solo el adelanto (el botón sigue
 * siendo real). En mobile la maqueta va debajo del texto y se llena con el
 * scroll, sin abrirse sola.
 */
export function CaseStory() {
  const [open, setOpen] = useState(false);

  const ref = useGsapSection<HTMLDivElement>(({ root, q, isDesktop }) => {
    const steps = q(".step") as HTMLElement[];
    const card = root.querySelector<HTMLElement>(".score-card");
    const total = root.querySelector<HTMLElement>(".score-total");
    const gauge = root.querySelector<SVGCircleElement>(".gauge-fill");
    if (!card || !total) return;

    const original = total.textContent ?? "";
    const proxy = { n: 0 };
    // El tween del contador recién escribe al avanzar: sin esto el score
    // muestra el valor final mientras las barras todavía están vacías.
    total.textContent = "0";
    const fill = gsap.timeline({
      scrollTrigger: isDesktop
        ? { trigger: steps[1], start: "top 70%", end: "bottom 50%", scrub: 0.5 }
        : { trigger: card, start: "top 85%", end: "center 45%", scrub: 0.5 },
    });
    fill.from(q(".bar-fill"), {
      scaleX: 0,
      transformOrigin: "left center",
      stagger: 0.2,
      duration: 0.8,
      ease: "none",
    });
    if (gauge) fill.from(gauge, { strokeDashoffset: GAUGE_LENGTH, duration: 1.6, ease: "none" }, 0);
    fill.to(
      proxy,
      {
        n: data.totalScore,
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
      gsap.set(steps, { opacity: 0.35 });
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => gsap.to(step, { opacity: self.isActive ? 1 : 0.35, duration: 0.3 }),
        });
      });
      // La maqueta espera en gris hasta que llega el paso 1.
      gsap.set(card, { opacity: 0.45 });
      ScrollTrigger.create({
        trigger: steps[1],
        start: "top 75%",
        onEnter: () => gsap.to(card, { opacity: 1, duration: 0.4 }),
        onLeaveBack: () => gsap.to(card, { opacity: 0.45, duration: 0.4 }),
      });
      // El paso 2 abre el adelanto solo; volver atrás lo cierra.
      ScrollTrigger.create({
        trigger: steps[2],
        start: "top 60%",
        onEnter: () => setOpen(true),
        onLeaveBack: () => setOpen(false),
      });
    }

    return () => {
      total.textContent = original;
    };
  });

  return (
    <div ref={ref} className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1fr_1.1fr] md:gap-14">
      <div className="space-y-10 md:space-y-[38vh] md:pt-[10vh] md:pb-[20vh]">
        {STEPS.map((step) => (
          <div key={step.id} className="step">
            <h3 className="font-mono text-xs tracking-widest text-(--lebane-accent) uppercase">
              {step.eyebrow}
            </h3>
            <p className="mt-3 text-lg leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="md:sticky md:top-[10vh] md:self-start">
        <ScoreCard open={open} onToggle={() => setOpen((v) => !v)} />
      </div>
    </div>
  );
}
