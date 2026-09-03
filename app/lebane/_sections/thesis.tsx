"use client";

import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { Section, SectionHeading } from "../_lib/section";
import { thesis } from "../lebane.data";

/**
 * La sección que tiene que recordarse. Tres bloques caen y se apilan como un
 * edificio: el ERP es la planta baja (la puerta), Payments el piso del medio
 * (el puente), el crédito el último (el negocio). El DOM va en el orden de la
 * frase y `flex-col-reverse` lo da vuelta sólo en pantalla, así un lector de
 * pantalla oye la tesis en orden.
 */
export function Thesis() {
  const ref = useGsapSection<HTMLElement>(({ root, q }) => {
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
  });

  return (
    <Section id="thesis" ref={ref}>
      <SectionHeading eyebrow="03 · La tesis">
        {thesis.sentences.map((s) => (
          <span key={s.key} className="block">
            {s.text}
          </span>
        ))}
      </SectionHeading>

      <div className="mt-16 md:mt-20">
        <ol className="mx-auto flex max-w-2xl flex-col-reverse gap-2">
          {thesis.sentences.map((s, i) => (
            <li
              key={s.key}
              className="floor flex items-baseline gap-4 rounded-lg border border-(--lebane-line) bg-card/60 px-5 py-5 md:gap-6 md:px-8 md:py-7"
              style={{ marginInline: `${i * 4}%` }}
            >
              <span className="font-mono text-xs text-(--lebane-accent)">0{i + 1}</span>
              <div>
                <p className="font-serif text-xl font-semibold md:text-3xl">{s.text}</p>
                <p className="mt-1 text-sm text-(--lebane-ink-dim) md:text-base">{s.floor}</p>
              </div>
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
