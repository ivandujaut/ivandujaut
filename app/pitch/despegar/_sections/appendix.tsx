import type { ReactNode } from "react";
import { appendix } from "../despegar.data";
import { Fold } from "../_components/fold";

type AppendixId = (typeof appendix.items)[number]["id"];

/**
 * Anexo · El respaldo plegado: cómo gana plata, contra quién, cómo lo mediría
 * y los primeros pasos. Cada fila es un `<details>` con la sección entera
 * adentro (la misma que antes estaba suelta), así se abre en la entrevista si
 * alguien pregunta y no alarga la lectura de quien abre el link.
 */
export function Appendix({ sections }: { sections: Record<AppendixId, ReactNode> }) {
  return (
    <section id="anexo" className="relative scroll-mt-4">
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-10 md:px-10 md:pt-28">
        <p className="text-sm font-medium text-(--seen-ink)">{appendix.eyebrow}</p>
        <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
          {appendix.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{appendix.intro}</p>
      </div>

      <div className="border-t border-(--rule)">
        {appendix.items.map((item) => (
          <Fold
            key={item.id}
            openOnHash={item.id}
            className="appendix-item group border-b border-(--rule)"
            summaryClassName="mx-auto flex w-full max-w-6xl cursor-pointer items-baseline gap-4 px-4 py-6 md:px-10"
            summary={
              <>
                <span className="text-lg font-semibold text-(--seen-ink) tabular">
                  {item.letter}
                </span>
                <span className="flex-1">
                  <span className="block text-xl font-semibold">{item.title}</span>
                  <span className="mt-1 block leading-snug text-(--ink-dim)">{item.summary}</span>
                </span>
                <span
                  aria-hidden
                  className="text-xl text-(--seen-ink) transition-transform duration-500 group-open:rotate-90"
                >
                  ›
                </span>
              </>
            }
          >
            {sections[item.id]}
          </Fold>
        ))}
      </div>
      <div className="pb-20 md:pb-28" />
    </section>
  );
}
