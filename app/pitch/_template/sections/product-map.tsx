"use client";

import type { Pitch } from "@/pitches/types";
import { gsap } from "../lib/gsap";
import { useGsapSection } from "../lib/use-gsap-section";
import { Section, SectionHeading } from "../lib/section";

interface ProductMapProps {
  index: string;
  data: Pitch["productMap"];
}

/**
 * Desktop: los módulos en una fila, unidos por una línea que se dibuja de
 * izquierda a derecha con el scroll, con la pantalla fija; el último llega y
 * un arco por debajo vuelve al primero (cierra el círculo). La capa opcional
 * (un asistente, una IA) envuelve todo con un borde punteado que aparece al
 * final. Mobile: la misma lista en vertical, sin pin, atada al dedo.
 */
export function ProductMap({ index, data }: ProductMapProps) {
  const cols = data.modules.length;
  // Centro de la primera y la última columna, en % del ancho de la fila.
  const first = (100 / cols) * 0.5;
  const last = 100 - first;

  const ref = useGsapSection<HTMLElement>(
    ({ root, q, isDesktop }) => {
      const arc = root.querySelector<SVGPathElement>(".arc");
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: isDesktop
          ? {
              trigger: root,
              pin: true,
              scrub: 0.6,
              start: "top top",
              end: () => `+=${window.innerHeight * 1.8}`,
              invalidateOnRefresh: true,
            }
          : { trigger: root, start: "top 70%", end: "bottom 95%", scrub: 0.5 },
      });

      if (isDesktop) {
        tl.from(q(".rail"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          ease: "none",
        });
        tl.from(q(".node-dot"), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.2 }, 0.1);
        tl.from(q(".node-text"), { opacity: 0, y: 8, duration: 0.4, stagger: 0.2 }, 0.25);
        if (arc) {
          const len = arc.getTotalLength();
          tl.fromTo(
            arc,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" },
            ">-0.2",
          );
          tl.from(q(".arc-label"), { opacity: 0, duration: 0.4 }, ">-0.3");
        }
      } else {
        q(".node").forEach((node, i) => {
          tl.from(node.querySelector(".node-dot"), { scale: 0.4, opacity: 0, duration: 0.4 }, i);
          tl.from(node.querySelector(".node-text"), { opacity: 0, x: -14, duration: 0.5 }, i + 0.1);
          const connector = node.querySelector(".connector");
          if (connector) {
            tl.from(
              connector,
              { scaleY: 0, transformOrigin: "top center", duration: 0.5 },
              i - 0.5,
            );
          }
        });
        tl.from(q(".arc-label"), { opacity: 0, y: 8, duration: 0.5 }, ">-0.2");
      }
      tl.from(q(".layer"), { opacity: 0, duration: 0.7 }, ">-0.1");
      tl.to({}, { duration: 0.4 });
    },
    [data],
  );

  const cx = (pct: number) => pct * 7;

  return (
    <Section
      id="product-map"
      ref={ref}
      className="md:flex md:min-h-svh md:flex-col md:justify-center md:py-16"
    >
      <SectionHeading index={index} eyebrow={data.eyebrow}>
        {data.heading}
      </SectionHeading>

      <div className="relative mt-16 px-4 pt-10 pb-8 md:mt-20 md:px-8 md:pt-14 md:pb-10">
        {data.layer ? (
          <>
            <div
              className="layer pointer-events-none absolute inset-0 rounded-2xl border border-dashed border-(--pitch-accent)/50"
              aria-hidden
            />
            <p className="layer absolute -top-3.5 left-4 rounded-full border border-(--pitch-accent)/50 bg-background px-3 py-1 font-mono text-xs text-(--pitch-accent) md:left-8">
              {data.layer.name}
              {data.layer.formerName ? ` (antes ${data.layer.formerName})` : ""}{" "}
              <span aria-hidden>·</span> {data.layer.oneLiner}
            </p>
          </>
        ) : null}

        <div className="relative">
          <div
            className="rail absolute top-2 hidden h-px bg-(--pitch-accent) md:block"
            style={{ left: `${first}%`, right: `${first}%` }}
            aria-hidden
          />
          <ol
            className="flex flex-col md:grid md:gap-x-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {data.modules.map((mod, i) => {
              const isLast = i === cols - 1;
              return (
                <li key={mod.id} className="node relative md:text-center">
                  {i > 0 ? (
                    <div
                      className="connector mx-[7px] h-6 w-px bg-(--pitch-accent) md:hidden"
                      aria-hidden
                    />
                  ) : null}
                  <div className="flex items-start gap-4 md:block">
                    <span
                      className={`node-dot mt-0.5 block size-4 shrink-0 rounded-full border-2 md:mx-auto md:mt-0 ${
                        isLast
                          ? "border-(--pitch-accent) bg-(--pitch-accent)"
                          : "border-(--pitch-accent) bg-background"
                      }`}
                      aria-hidden
                    />
                    <div className="node-text md:mt-4">
                      <p className="text-sm font-semibold md:text-base">
                        <span className="font-mono text-xs text-(--pitch-ink-dim)">{i + 1} </span>
                        {mod.label}
                      </p>
                      <p className="mt-1 text-sm text-(--pitch-ink-dim) md:text-xs">
                        {mod.oneLiner}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Sin `vector-effect`: el SVG se estira en horizontal y con él el
              trazo se mediría en píxeles de pantalla y quedaría corto. */}
          <svg
            className="mt-4 hidden h-14 w-full md:block"
            viewBox="0 0 700 56"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              className="arc"
              d={`M${cx(last)} 0 V32 Q${cx(last)} 44 ${cx(last) - 12} 44 H${cx(first) + 12} Q${cx(first)} 44 ${cx(first)} 32 V4 M${cx(first) - 5} 9 L${cx(first)} 2 L${cx(first) + 5} 9`}
              fill="none"
              stroke="var(--pitch-accent)"
              strokeWidth="1.25"
            />
          </svg>
          <p className="arc-label mt-6 text-center text-sm text-(--pitch-ink-dim) md:-mt-1">
            {data.closingNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
