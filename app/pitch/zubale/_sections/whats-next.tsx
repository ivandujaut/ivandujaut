"use client";

import { next } from "../zubale.data";
import { ScrollTrigger } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cites, ReaderLabel, Tramo, TramoHeading } from "../_components/ui";

/**
 * 07 · Lo que viene. Los pasos pasan a la izquierda; a la derecha, pegada, la
 * escena de las dos lecturas: la góndola que ve el Zubalero (magenta) y el
 * catálogo que lee el agente del comprador (azul). En "stock" la góndola se
 * vacía y el catálogo sigue diciendo que hay: ahí se separan las dos lecturas.
 * En "zubalero" aparece quien sí lo vio, y queda la pregunta de si eso le
 * llega al agente. El estado lo pone el scroll en `data-stage`; las
 * transiciones son CSS (ver `zubale.css`).
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

  const { person, agent } = next.scene;

  return (
    <Tramo id="viene">
      <TramoHeading index={next.index} eyebrow={next.eyebrow}>
        {next.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg text-(--ink-dim)">{next.intro}</p>

      <div ref={ref} className="mt-12 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
        <div className="sticky top-0 z-10 -mx-4 bg-(--bg) px-4 pt-4 pb-4 md:static md:order-2 md:mx-0 md:p-0">
          <div className="next-scene grid grid-cols-2 gap-3 md:sticky md:top-24" data-stage="muse">
            <div className="relative rounded-2xl border border-(--rule) bg-(--surface) p-3 md:p-4">
              <ReaderLabel who="person" label={person.reader} className="hidden md:flex" />
              <ReaderLabel who="person" label={person.readerShort} className="md:hidden" />
              <p className="mt-4 hidden text-xs text-(--ink-dim) md:block">{person.label}</p>
              <div className="relative mt-2 h-20 rounded-lg border border-dashed border-(--ink-faint) md:h-32">
                <div className="shelf-item absolute inset-2 flex items-center justify-center rounded-md bg-(--person-soft) p-2 text-center text-sm font-medium">
                  {person.item}
                </div>
                <div className="shelf-empty absolute inset-x-0 top-0 bottom-8 flex items-center justify-center text-sm font-semibold text-(--risk) md:bottom-0">
                  {person.state}
                </div>
                <p className="shelf-marked absolute inset-x-1.5 bottom-1.5 rounded-md bg-(--person-soft) px-2 py-1 text-center text-xs font-medium text-(--person-ink)">
                  <span className="md:hidden">{person.markedShort}</span>
                  <span className="hidden md:inline">{person.marked}</span>
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl border border-(--rule) bg-(--surface) p-3 md:p-4">
              <ReaderLabel who="agent" label={agent.reader} className="hidden md:flex" />
              <ReaderLabel who="agent" label={agent.readerShort} className="md:hidden" />
              <p className="mono mt-4 hidden text-xs text-(--ink-dim) md:block">{agent.label}</p>
              <ul className="mono mt-2 space-y-1.5 text-xs break-words text-(--agent-ink) md:space-y-2">
                {agent.lines.map((line) => (
                  <li key={line} className="rounded-md bg-(--agent-soft) px-2 py-1">
                    {line}
                  </li>
                ))}
              </ul>
              {/* El aviso y la pregunta comparten lugar: en "zubalero" la
                  pregunta reemplaza al aviso. La pregunta va en el flujo
                  porque es la más larga y define el alto. */}
              <div className="scene-slot relative mt-2 md:mt-3">
                <p className="agent-question rounded-md border border-dashed border-(--ink-faint) px-2 py-1 text-xs font-medium">
                  {agent.question}
                </p>
                <p className="mismatch absolute inset-x-0 top-0 rounded-md bg-(--risk-soft) px-2 py-1 text-xs font-medium text-(--risk)">
                  {agent.mismatch}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ol className="md:order-1">
          {next.steps.map((step) => (
            <li
              key={step.id}
              data-stage={step.id}
              className="next-step flex min-h-[38svh] items-center py-6 md:min-h-[45svh]"
            >
              <p className="max-w-md text-lg">
                {step.text}
                <Cites ids={step.sources} />
              </p>
            </li>
          ))}
        </ol>
      </div>

      <p className="reveal mt-8 max-w-2xl rounded-2xl bg-(--surface-deep) p-6 text-base">
        <strong className="font-semibold">{next.latam.lead}</strong> {next.latam.text}
        <Cites ids={next.latam.sources} />
      </p>
    </Tramo>
  );
}
