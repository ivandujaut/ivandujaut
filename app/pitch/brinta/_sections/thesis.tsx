"use client";

import { thesis as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cite, Tramo, TramoHeading } from "../_components/tramo";

/**
 * 05 · La tesis. La oración primero, sola. Después la escalera: la cinta sube
 * tres escalones (el dato, la plata, la caja) y cada escalón se enciende
 * cuando la cinta llega. Abajo, las dos pruebas de que no es una fantasía.
 */
export function Thesis() {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    gsap.from(q(".th-sentence > span"), {
      opacity: 0.12,
      y: 18,
      stagger: 0.25,
      ease: "none",
      scrollTrigger: {
        trigger: q(".th-sentence")[0],
        start: "top 85%",
        end: "top 45%",
        scrub: 0.4,
      },
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: q(".th-ladder")[0],
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.5,
      },
    });
    tl.fromTo(
      q(".th-ribbon"),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 3 },
      0,
    );
    q(".th-rung").forEach((rung, i) => {
      tl.from(rung, { opacity: 0.22, duration: 0.6 }, i * 1 + 0.3);
    });
    q(".th-step").forEach((step, i) => {
      tl.from(step, { fillOpacity: 0, duration: 0.5 }, i * 1 + 0.3);
    });
    tl.from(
      q(".th-coin"),
      { scale: 0, svgOrigin: "330 52", duration: 0.4, ease: "back.out(2)" },
      2.8,
    );

    gsap.from(q(".th-evidence"), {
      opacity: 0,
      y: 16,
      stagger: 0.15,
      scrollTrigger: {
        trigger: q(".th-evidence-list")[0],
        start: "top 85%",
        end: "top 55%",
        scrub: 0.4,
      },
    });
  });

  return (
    <Tramo id="tesis">
      <div ref={ref}>
        <TramoHeading index={data.index} eyebrow={data.eyebrow}>
          <span className="th-sentence block">
            <span className="block">{data.sentence}</span>
            <span className="block text-(--trapped-ink) italic">{data.sentenceAccent}</span>
          </span>
        </TramoHeading>

        <div className="th-ladder mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center">
          <figure className="scene">
            <svg
              viewBox="0 0 360 280"
              className="h-auto w-full max-w-md"
              role="img"
              aria-label="Una cinta que sube tres escalones: el dato, la plata y la caja."
            >
              {[
                { x: 20, y: 200, h: 60, n: "1" },
                { x: 130, y: 140, h: 120, n: "2" },
                { x: 240, y: 80, h: 180, n: "3" },
              ].map((step) => (
                <g key={step.n}>
                  <rect
                    className="th-step"
                    x={step.x}
                    y={step.y}
                    width="100"
                    height={step.h}
                    rx="4"
                    fill="var(--paper-deep)"
                    stroke="var(--rule)"
                  />
                  <text className="num t-dim" x={step.x + 12} y="250" fontSize="14">
                    {step.n}
                  </text>
                </g>
              ))}
              <path
                className="th-ribbon"
                d="M20 186 H110 Q122 186 122 174 V138 Q122 126 134 126 H220 Q232 126 232 114 V78 Q232 66 244 66 H318"
                pathLength={1}
                stroke="var(--flow)"
                strokeWidth="12"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
              <g className="th-coin">
                <circle cx="330" cy="52" r="16" fill="var(--trapped)" />
                <text
                  className="num"
                  x="330"
                  y="57"
                  fontSize="14"
                  textAnchor="middle"
                  style={{ fill: "var(--paper)" }}
                >
                  $
                </text>
              </g>
            </svg>
          </figure>

          <ol className="space-y-8">
            {data.rungs.map((rung, i) => (
              <li key={rung.id} className="th-rung flex gap-4">
                <span className="num mt-1 text-sm text-(--ink-dim)">{i + 1}</span>
                <div>
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-2xl font-semibold">{rung.name}</span>
                    <span
                      className={
                        rung.id === "caja"
                          ? "num text-xs tracking-wide text-(--trapped-ink) uppercase"
                          : "num text-xs tracking-wide text-(--ink-dim) uppercase"
                      }
                    >
                      {rung.tag}
                    </span>
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-(--ink-dim) md:text-lg">
                    {rung.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ul className="th-evidence-list mt-16 grid gap-6 md:mt-20 md:grid-cols-2">
          {data.evidence.map((item) => (
            <li
              key={item.id}
              className="th-evidence rounded-md border border-(--rule) bg-(--paper-deep) p-5 md:p-6"
            >
              <p className="text-base leading-relaxed">
                <span className="font-semibold">{item.lead}</span>{" "}
                <span className="text-(--ink-dim)">{item.text}</span>
                {item.sources.map((id, i) => (
                  <Cite
                    key={id}
                    id={id}
                    label={item.sources.length > 1 ? `fuente ${i + 1}` : "fuente"}
                  />
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Tramo>
  );
}
