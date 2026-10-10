"use client";

import { sees as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cite, Tramo, TramoHeading } from "../_components/tramo";

/**
 * 04 · Por qué Brinta puede. La cinta pasa por un anillo en cada punto donde
 * la plata se parte, y cada anillo es un recurso de la API de Brinta. El
 * anillo se llena cuando el punto cruza el centro de la pantalla.
 */
export function Sees() {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    q(".sees-node").forEach((node) => {
      const scope = (selector: string) => node.querySelectorAll(selector);
      gsap
        .timeline({
          scrollTrigger: { trigger: node, start: "top 88%", end: "top 66%", scrub: 0.4 },
        })
        .from(scope(".sees-dot"), { scale: 0, ease: "none" }, 0)
        .from(scope(".sees-body"), { opacity: 0.15, x: -10, ease: "none" }, 0);
    });
    gsap.from(q(".sees-asset"), {
      opacity: 0,
      y: 14,
      scrollTrigger: { trigger: q(".sees-asset")[0], start: "top 95%", end: "top 75%", scrub: 0.4 },
    });
  });

  return (
    <Tramo id="brinta">
      <div ref={ref}>
        <TramoHeading index={data.index} eyebrow={data.eyebrow}>
          {data.heading}
        </TramoHeading>

        <ol className="mt-12 space-y-10 md:mt-16 md:space-y-12">
          {data.nodes.map((node) => (
            <li key={node.id} className="sees-node relative">
              {/* El anillo va sobre el carril de la cinta (ver el comentario de la portada). */}
              <span
                aria-hidden
                className="absolute top-1 -left-8 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-(--flow) bg-(--paper) md:-left-14 md:size-9"
              >
                <span className="sees-dot size-3 rounded-full bg-(--trapped) md:size-4" />
              </span>
              <div className="sees-body max-w-2xl">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-xl font-semibold md:text-2xl">{node.name}</span>
                  <code className="num rounded-sm bg-(--paper-deep) px-1.5 py-0.5 text-xs text-(--ink-dim) md:text-sm">
                    {node.endpoint}
                  </code>
                </p>
                <p className="mt-2 text-base leading-relaxed text-(--ink-dim) md:text-lg">
                  {node.text}
                  <Cite id={node.source} label="docs" />
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="sees-asset mt-16 max-w-2xl md:mt-20">
          <p className="font-serif text-2xl leading-snug text-balance md:text-3xl">{data.asset}</p>
          <p className="mt-6 text-base leading-relaxed text-(--ink-dim) md:text-lg">
            {data.vertex}
            <Cite id={data.vertexSource} label="10-Q" />
          </p>
        </div>
      </div>
    </Tramo>
  );
}
