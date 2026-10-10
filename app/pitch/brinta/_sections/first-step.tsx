"use client";

import { firstStep as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Ledger } from "../_components/ledger";
import { Cite, Tramo, TramoHeading } from "../_components/tramo";

/**
 * 06 · Un primer paso. El libro mayor interactivo y, abajo, la decisión
 * completa: por qué este primero, cómo se mide por segmento (con el corte
 * fijado antes), qué no construir, qué lo mata y qué sigue.
 */
export function FirstStep() {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    q(".fs-block").forEach((block) => {
      gsap.from(block, {
        opacity: 0,
        y: 18,
        ease: "none",
        scrollTrigger: { trigger: block, start: "top 88%", end: "top 62%", scrub: 0.4 },
      });
    });
  });

  return (
    <Tramo id="caso">
      <div ref={ref}>
        <TramoHeading index={data.index} eyebrow={data.eyebrow}>
          {data.heading}
        </TramoHeading>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{data.who}</p>

        <div className="mt-10 max-w-3xl">
          <Ledger />
        </div>

        <div className="fs-block mt-20 max-w-3xl">
          <h3 className="text-xl font-semibold md:text-2xl">{data.why.title}</h3>
          <ol className="mt-5 space-y-3">
            {data.why.items.map((item, i) => (
              <li key={item} className="flex gap-4 text-base leading-relaxed md:text-lg">
                <span className="num mt-0.5 text-sm text-(--trapped-ink)">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-(--ink-dim)">
            {data.why.pilot}
            {data.why.sources.map((id, i) => (
              <Cite key={id} id={id} label={`fuente ${i + 1}`} />
            ))}
          </p>
        </div>

        <div className="fs-block mt-16">
          <h3 className="text-xl font-semibold md:text-2xl">{data.metrics.title}</h3>
          <p className="mt-3 max-w-2xl text-base text-(--ink-dim)">{data.metrics.baseline}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {data.metrics.segments.map((segment, i) => (
              <article
                key={segment.id}
                className="rounded-md border border-(--rule) bg-(--paper-deep) p-5 md:p-6"
              >
                <p className="num text-xs tracking-widest text-(--ink-dim) uppercase">
                  {data.metrics.head.segment} {i + 1}
                </p>
                <h4 className="mt-1 text-lg font-semibold">{segment.segment}</h4>
                <p className="mt-2 font-serif text-lg italic">{segment.question}</p>
                <dl className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
                  {(
                    [
                      ["leading", data.metrics.head.leading, segment.leading],
                      ["lagging", data.metrics.head.lagging, segment.lagging],
                      ["guardrail", data.metrics.head.guardrail, segment.guardrail],
                    ] as const
                  ).map(([key, label, value]) => (
                    <div key={key} className="grid grid-cols-[5.5rem_1fr] gap-3">
                      <dt className="num text-xs leading-6 text-(--ink-dim) uppercase">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 border-t border-dashed border-(--ink-faint) pt-3 text-sm leading-relaxed">
                  <span className="font-semibold text-(--trapped-ink)">
                    {data.metrics.head.cut}:
                  </span>{" "}
                  {segment.cut}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="fs-block mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold md:text-2xl">{data.notToBuild.title}</h3>
            <ul className="mt-5 space-y-3">
              {data.notToBuild.items.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed md:text-lg">
                  <span aria-hidden className="num text-(--risk)">
                    ×
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold md:text-2xl">{data.kill.title}</h3>
              <p className="mt-4 text-base leading-relaxed md:text-lg">{data.kill.text}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold md:text-2xl">{data.next.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-(--ink-dim) md:text-lg">
                {data.next.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Tramo>
  );
}
