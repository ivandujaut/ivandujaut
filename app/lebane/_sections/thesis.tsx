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
 * La sección que tiene que recordarse. Tres bloques caen y se apilan como un
 * edificio: el ERP es la planta baja (la puerta), Payments el piso del medio
 * (el puente), el crédito el último (el negocio). El DOM va en el orden de la
 * frase y `flex-col-reverse` lo da vuelta sólo en pantalla, así un lector de
 * pantalla oye la tesis en orden. En desktop caen solos; en mobile caen con
 * el scroll.
 */
export function Thesis() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    if (isDesktop) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 55%", toggleActions: "play none none none" },
      });
      q(".floor").forEach((floor, i) => {
        tl.from(floor, { y: -160, opacity: 0, duration: 0.7, ease: "power3.in" }, i * 0.45).to(
          floor,
          { scaleY: 0.94, transformOrigin: "bottom center", duration: 0.09, yoyo: true, repeat: 1 },
          ">",
        );
      });
      tl.from(q(".ground"), { scaleX: 0, transformOrigin: "center", duration: 0.6 }, 0.2);
      tl.from(q(".comparables"), { opacity: 0, y: 10, duration: 0.6 }, ">-0.1");
      return;
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 60%", end: "bottom 90%", scrub: 0.5 },
    });
    tl.from(q(".ground"), { scaleX: 0, transformOrigin: "center", duration: 0.6 }, 0);
    q(".floor").forEach((floor, i) => {
      tl.from(floor, { y: -120, opacity: 0, duration: 0.8, ease: "power2.in" }, 0.3 + i * 0.7);
    });
    tl.from(q(".comparables"), { opacity: 0, y: 10, duration: 0.6 }, ">");
  });

  return (
    <Section id="thesis" ref={ref}>
      <SectionHeading index="03" eyebrow="La tesis">
        {thesis.sentences.map((s) => (
          <span key={s.key} className="block">
            <Highlight text={s.text} keyword={s.keyword} />
          </span>
        ))}
      </SectionHeading>

      <div className="mt-16 md:mt-20">
        <ol className="mx-auto flex max-w-2xl flex-col-reverse gap-2">
          {thesis.sentences.map((s, i) => (
            <li
              key={s.key}
              className="floor flex items-start gap-4 rounded-lg border border-(--lebane-line) bg-card/60 px-5 py-5 md:gap-6 md:px-8 md:py-7"
              style={{ marginInline: `${i * 4}%` }}
            >
              <span className="font-mono text-xs text-(--lebane-accent)">0{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xl font-semibold md:text-3xl">
                  <Highlight text={s.text} keyword={s.keyword} />
                </p>
                <p className="mt-1 text-sm text-(--lebane-ink-dim) md:text-base">{s.floor}</p>
              </div>
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 size-7 shrink-0 text-(--lebane-accent) md:size-9"
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
      </div>

      <p className="comparables mx-auto mt-12 max-w-2xl text-center text-base text-(--lebane-ink-dim) md:text-lg">
        {thesis.comparables}
      </p>
    </Section>
  );
}
