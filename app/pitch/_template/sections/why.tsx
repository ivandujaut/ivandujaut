"use client";

import type { Pitch } from "@/pitches/types";
import { gsap } from "../lib/gsap";
import { useGsapSection } from "../lib/use-gsap-section";
import { Section, SectionHeading } from "../lib/section";

const TILTS = [-5, 4, -3, 6];

interface WhyProps {
  index: string;
  data: Pitch["why"];
}

/**
 * Scrollytelling en tres pasos con la pantalla fija: primero aparecen los
 * papeles del lado izquierdo (lo que ve el incumbente), después se apagan
 * mientras se enciende fila por fila el lado derecho (lo que ve la empresa),
 * y al final las dos últimas filas quedan resaltadas. En mobile la misma
 * secuencia corre sin pin, atada al scroll.
 */
export function Why({ index, data }: WhyProps) {
  const ref = useGsapSection<HTMLElement>(
    ({ root, q, isDesktop }) => {
      const steps = q(".step");
      const papers = q(".paper");
      const rows = q(".row");
      const dots = q(".row-dot");
      const split = Math.max(1, rows.length - 2);
      const tl = gsap.timeline({
        scrollTrigger: isDesktop
          ? {
              trigger: root,
              pin: true,
              scrub: 0.6,
              start: "top top",
              end: () => `+=${window.innerHeight * 2.6}`,
              invalidateOnRefresh: true,
            }
          : { trigger: root, start: "top 45%", end: "bottom 100%", scrub: 0.5 },
      });
      const activate = (i: number, at: number) => {
        steps.forEach((step, j) => tl.to(step, { opacity: j === i ? 1 : 0.35, duration: 0.3 }, at));
      };

      // Paso 1: los papeles caen sobre la mesa.
      tl.set(steps.slice(1), { opacity: 0.35 }, 0);
      tl.set(rows, { opacity: 0.15 }, 0);
      tl.set(dots, { backgroundColor: "var(--pitch-line)" }, 0);
      tl.from(papers, { opacity: 0, y: -30, stagger: 0.15, duration: 0.6 }, 0.1);

      // Paso 2: se apagan; el lado derecho se enciende fila por fila.
      activate(1, 1.1);
      tl.to(papers, { opacity: 0.25, y: 14, stagger: 0.08, duration: 0.5 }, 1.1);
      tl.to(rows.slice(0, split), { opacity: 1, x: 0, stagger: 0.25, duration: 0.4 }, 1.3);
      tl.to(
        dots.slice(0, split),
        { backgroundColor: "var(--pitch-accent)", stagger: 0.25, duration: 0.2 },
        1.4,
      );

      // Paso 3: lo que sólo la empresa ve.
      activate(2, 2.9);
      tl.to(rows.slice(split), { opacity: 1, stagger: 0.3, duration: 0.4 }, 3);
      tl.to(
        dots.slice(split),
        { backgroundColor: "var(--pitch-accent)", stagger: 0.3, duration: 0.2 },
        3.1,
      );
      tl.to(
        rows.slice(split),
        { backgroundColor: "var(--pitch-accent-soft)", paddingInline: "0.75rem", duration: 0.5 },
        3.6,
      );
      tl.to({}, { duration: 0.5 });
    },
    [data],
  );

  return (
    <Section
      id="why"
      ref={ref}
      className="md:flex md:min-h-svh md:flex-col md:justify-center md:py-16"
    >
      <SectionHeading index={index} eyebrow={data.eyebrow}>
        {data.heading}
      </SectionHeading>

      <div className="relative mt-10 grid gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px bg-(--pitch-line) md:block"
        />
        <div>
          <ol className="space-y-3">
            {data.steps.map((text, i) => (
              <li key={text} className="step flex gap-3 text-base leading-snug md:text-lg">
                <span className="mt-1 font-mono text-xs text-(--pitch-accent)">0{i + 1}</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
          <h3 className="mt-10 font-mono text-xs tracking-widest text-(--pitch-ink-dim) uppercase">
            {data.left.title}
          </h3>
          <ul className="mt-5 flex flex-wrap gap-4">
            {data.left.items.map((item, i) => (
              <li
                key={item}
                className="paper rounded-sm border border-(--pitch-line) bg-muted/50 px-4 py-3 font-serif text-lg"
                style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:self-end">
          <h3 className="font-mono text-xs tracking-widest text-(--pitch-accent) uppercase">
            {data.right.title}
          </h3>
          <ol className="mt-5 divide-y divide-(--pitch-line) border-y border-(--pitch-line)">
            {data.right.items.map((item, i) => (
              <li key={item} className="row flex items-center gap-4 rounded-sm py-3">
                <span
                  className="row-dot size-2 shrink-0 rounded-full bg-(--pitch-accent)"
                  aria-hidden
                />
                <span className="font-mono text-xs text-(--pitch-ink-dim)">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base">{item}</span>
                <span className="ml-auto font-mono text-[0.7rem] text-(--pitch-accent)">
                  {data.rightTag}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
