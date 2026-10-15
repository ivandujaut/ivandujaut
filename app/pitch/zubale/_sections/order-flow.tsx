"use client";

import { cn } from "@/lib/utils";
import { order } from "../zubale.data";
import { ScrollTrigger, gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cites, ReaderLabel, TramoHeading } from "../_components/ui";

const DIM = 0.3;

/**
 * 03 · El pedido de punta a punta. Cada fila es un paso: a la izquierda lo
 * que pasa en el mundo, a la derecha los estados reales que la API le avisa
 * al súper.
 *
 * Escritorio con alto suficiente: el tramo se fija y el scroll enciende los
 * pasos uno por uno (la vista no se mueve, avanza el pedido).
 * Celular o pantallas bajas: sin pin; cada fila se enciende al cruzar el
 * centro de la pantalla.
 */
export function OrderFlow() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const rows = q(".order-row") as HTMLElement[];
    const marker = q(".order-marker")[0] as HTMLElement | undefined;
    const canPin = isDesktop && window.innerHeight >= 720;

    if (canPin) {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          pin: true,
          scrub: 0.6,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.4}`,
          invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      });
      tl.set(rows.slice(1), { opacity: DIM }, 0);
      if (marker && rows[0]) tl.set(marker, { height: rows[0].offsetHeight }, 0);
      rows.forEach((row, i) => {
        if (i === 0) return;
        const at = i;
        tl.to(rows[i - 1], { opacity: DIM, duration: 0.3 }, at);
        tl.to(row, { opacity: 1, duration: 0.3 }, at);
        if (marker) {
          tl.to(marker, { y: row.offsetTop, height: row.offsetHeight, duration: 0.3 }, at);
        }
      });
      tl.to({}, { duration: 0.6 });
      return;
    }

    rows.forEach((row) => {
      ScrollTrigger.create({
        trigger: row,
        start: "top 60%",
        end: "bottom 60%",
        toggleClass: { targets: row, className: "is-active" },
      });
    });
  });

  return (
    <section ref={ref} id="pedido" className="relative md:min-h-svh">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center px-4 py-20 md:min-h-svh md:px-10 md:py-12">
        <TramoHeading index={order.index} eyebrow={order.eyebrow} compact>
          {order.heading}
        </TramoHeading>
        <p className="mt-4 max-w-2xl text-base text-(--ink-dim)">{order.intro}</p>

        <div className="mt-8 rounded-2xl border border-(--rule) bg-(--surface) p-4 md:p-6">
          <div className="grid grid-cols-2 gap-4 border-b border-(--rule) pb-3 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-8">
            <ReaderLabel who="person" />
            <ReaderLabel who="agent" />
          </div>

          <ol className="relative mt-2">
            <span
              aria-hidden
              className="order-marker absolute top-0 left-0 hidden h-14 w-0.5 rounded-full bg-(--agent) md:block"
            />
            {order.steps.map((step, i) => (
              <li
                key={step.id}
                className={cn(
                  "order-row grid gap-2 border-b border-(--rule) py-3 last:border-b-0 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-8 md:pl-4",
                  step.highlight && "rounded-lg bg-(--person-soft)",
                )}
              >
                <p className="flex gap-3 text-sm md:text-base">
                  <span className="mono shrink-0 text-(--ink-faint)">{i + 1}</span>
                  <span>
                    {step.person}
                    {step.highlight ? (
                      <span className="ml-2 inline-block rounded-sm bg-(--person) px-1.5 py-0.5 text-xs font-medium text-(--surface)">
                        se retoma en la segunda parte
                      </span>
                    ) : null}
                  </span>
                </p>
                <ul className="mono flex flex-wrap content-start gap-2 pl-6 text-xs md:pl-0">
                  {step.agent.map((ev) => (
                    <li
                      key={ev}
                      className="rounded-md bg-(--agent-soft) px-2 py-1 text-(--agent-ink)"
                    >
                      {ev}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-4 max-w-2xl text-xs text-(--ink-dim)">
          {order.footnote}
          <Cites ids={order.sources} />
        </p>
      </div>
    </section>
  );
}
