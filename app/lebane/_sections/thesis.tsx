"use client";

import type { ReactNode } from "react";
import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { Section, SectionHeading } from "../_lib/section";
import { thesis } from "../lebane.data";

/** Íconos de trazo fino, uno por piso: puerta, puente, monedas. */
const ICONS: Record<string, ReactNode> = {
  erp: (
    <>
      <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
      <path d="M3 21h18" />
      <circle cx="14.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  payments: (
    <>
      <path d="M2 18h20" />
      <path d="M4 18V11q8-9 16 0v7" />
      <path d="M8 18v-5M12 18v-7M16 18v-5" />
    </>
  ),
  credit: (
    <>
      <circle cx="9" cy="12" r="6" />
      <path d="M13 6.4a6 6 0 1 1 0 11.2" />
      <path d="M9 9.5v5M7.5 11h3" />
    </>
  ),
};

function Highlight({ text, keyword }: { text: string; keyword: string }) {
  const i = text.indexOf(keyword);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em className="text-(--lebane-accent)">{keyword}</em>
      {text.slice(i + keyword.length)}
    </>
  );
}

/**
 * La sección que tiene que recordarse, contada con el scroll: la pantalla se
 * fija y cada tramo de scroll hace caer un piso del edificio mientras se
 * enciende la línea de la tesis que le corresponde. Planta baja el ERP (la
 * puerta), primer piso Payments (el puente), arriba el crédito (el negocio).
 * El DOM va en el orden de la frase y `flex-col-reverse` lo da vuelta sólo en
 * pantalla, así un lector de pantalla oye la tesis en orden. En mobile no hay
 * pin, pero la secuencia sigue atada al dedo.
 */
export function Thesis() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const lines = q(".thesis-line");
    const floors = q(".floor");
    const tl = gsap.timeline({
      scrollTrigger: isDesktop
        ? {
            trigger: root,
            pin: true,
            scrub: 0.6,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.4}`,
            invalidateOnRefresh: true,
          }
        : { trigger: root, start: "top 55%", end: "bottom 95%", scrub: 0.5 },
    });
    // Arranca con la primera línea encendida y las otras en espera.
    tl.set(lines.slice(1), { opacity: 0.3 }, 0);
    tl.from(q(".ground"), { scaleX: 0, transformOrigin: "center", duration: 0.6 }, 0);
    floors.forEach((floor, i) => {
      const at = 0.4 + i * 1.3;
      tl.from(floor, { y: -140, opacity: 0, duration: 1, ease: "power2.in" }, at);
      if (i > 0) tl.to(lines[i], { opacity: 1, duration: 0.4 }, at + 0.6);
    });
    tl.from(q(".comparables"), { opacity: 0, y: 10, duration: 0.6 }, ">");
    tl.to({}, { duration: 0.4 });
  });

  return (
    <Section
      id="thesis"
      ref={ref}
      className="md:flex md:min-h-svh md:flex-col md:justify-center md:py-16"
    >
      <div className="md:grid md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12">
        <SectionHeading index="03" eyebrow="La tesis">
          {thesis.sentences.map((s) => (
            <span key={s.key} className="thesis-line block">
              <Highlight text={s.text} keyword={s.keyword} />
            </span>
          ))}
        </SectionHeading>

        <div className="mt-16 md:mt-0">
          <ol className="mx-auto flex max-w-2xl flex-col-reverse gap-2">
            {thesis.sentences.map((s, i) => (
              <li
                key={s.key}
                className="floor flex items-start gap-4 rounded-lg border border-(--lebane-line) bg-card/60 px-5 py-5 md:gap-5 md:px-7 md:py-6"
                style={{ marginInline: `${i * 4}%` }}
              >
                <span className="font-mono text-xs text-(--lebane-accent)">0{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl font-semibold md:text-2xl">
                    <Highlight text={s.text} keyword={s.keyword} />
                  </p>
                  <p className="mt-1 text-sm text-(--lebane-ink-dim) md:text-base">{s.floor}</p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 size-7 shrink-0 text-(--lebane-accent) md:size-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {ICONS[s.key]}
                </svg>
              </li>
            ))}
          </ol>
          <div className="ground mx-auto mt-2 h-0.5 max-w-2xl bg-(--lebane-accent)" aria-hidden />
          <p className="comparables mx-auto mt-8 max-w-2xl text-center text-base text-(--lebane-ink-dim) md:text-lg">
            {thesis.comparables}
          </p>
        </div>
      </div>
    </Section>
  );
}
