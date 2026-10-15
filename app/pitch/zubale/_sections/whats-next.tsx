"use client";

import { next } from "../zubale.data";
import { ScrollTrigger } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cites, ReaderLabel, Tramo, TramoHeading } from "../_components/ui";

/**
 * 07 · Lo que viene. Los pasos pasan a la izquierda; a la derecha, pegada, la
 * escena de las dos lecturas: la góndola (persona) y el catálogo (agente).
 * En el último paso la góndola se vacía y el catálogo sigue diciendo que hay:
 * ahí se separan las dos lecturas. El estado lo pone el scroll en
 * `data-stage`; las transiciones son CSS (ver `zubale.css`).
 */
export function WhatsNext() {
  const ref = useGsapSection<HTMLDivElement>(({ root, q }) => {
    const scene = root.querySelector<HTMLElement>(".next-scene");
    if (!scene) return;
    q(".next-step").forEach((step) => {
      const stage = (step as HTMLElement).dataset.stage ?? "";
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) scene.dataset.stage = stage;
        },
      });
    });
    return () => {
      delete scene.dataset.stage;
    };
  });

  return (
    <Tramo id="viene">
      <TramoHeading index={next.index} eyebrow={next.eyebrow}>
        {next.heading}
      </TramoHeading>

      <div ref={ref} className="mt-12 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
        <div className="sticky top-0 z-10 -mx-4 bg-(--bg) px-4 pt-4 pb-4 md:static md:order-2 md:mx-0 md:p-0">
          <div className="next-scene grid grid-cols-2 gap-3 md:sticky md:top-24" data-stage="muse">
            <div className="relative rounded-2xl border border-(--rule) bg-(--surface) p-4">
              <ReaderLabel who="person" />
              <p className="mt-4 text-xs text-(--ink-dim)">{next.scene.person.label}</p>
              <div className="relative mt-2 h-24 rounded-lg border border-dashed border-(--ink-faint) md:h-32">
                <div className="shelf-item absolute inset-2 flex items-center justify-center rounded-md bg-(--person-soft) p-2 text-center text-sm font-medium">
                  {next.scene.person.item}
                </div>
                <div className="shelf-empty absolute inset-0 flex items-center justify-center text-sm font-semibold text-(--risk)">
                  {next.scene.person.state}
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl border border-(--rule) bg-(--surface) p-4">
              <ReaderLabel who="agent" />
              <p className="mono mt-4 text-xs text-(--ink-dim)">{next.scene.agent.label}</p>
              <ul className="mono mt-2 space-y-2 text-xs break-words text-(--agent-ink)">
                {next.scene.agent.lines.map((line) => (
                  <li key={line} className="rounded-md bg-(--agent-soft) px-2 py-1">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mismatch mt-3 rounded-md bg-(--risk-soft) px-2 py-1 text-xs font-medium text-(--risk)">
                El agente cree que hay
              </p>
            </div>
          </div>
        </div>

        <ol className="md:order-1">
          {next.steps.map((step) => (
            <li
              key={step.id}
              data-stage={step.id}
              className="next-step flex min-h-[40svh] items-center py-6 md:min-h-[55svh]"
            >
              <p className="max-w-md text-lg">
                {step.text}
                <Cites ids={step.sources} />
              </p>
            </li>
          ))}
        </ol>
      </div>

      <p className="reveal mt-8 max-w-2xl rounded-2xl bg-(--agent-soft) p-6 text-base">
        <strong className="font-semibold">{next.latam.lead}</strong> {next.latam.text}
        <Cites ids={next.latam.sources} />
      </p>
    </Tramo>
  );
}
