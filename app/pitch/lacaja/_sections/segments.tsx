"use client";

import { cn } from "@/lib/utils";
import { segments, tickets } from "../lacaja.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cites, TicketCard, TramoHeading } from "../_components/ui";

/**
 * 03 · No todo se cierra igual. Las seis solicitudes de la portada vuelven
 * apiladas, todavía en espera, y se reparten en las tres columnas: ahí cada
 * una toma su destino (azul, borde azul o rojo punteado).
 *
 * Escritorio con alto suficiente: el tramo se fija y el scroll reparte la
 * pila. Celular o pantallas bajas: sin pin; cada columna entra al cruzar la
 * pantalla, ya con los destinos puestos.
 */
export function Segments() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const cards = q(".seg-ticket") as HTMLElement[];
    const anchor = q(".seg-pile")[0] as HTMLElement | undefined;
    const canPin = isDesktop && window.innerHeight >= 760 && anchor;

    if (!canPin) {
      q(".seg-col").forEach((col) => {
        gsap.from(col, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: { trigger: col, start: "top 85%", once: true },
        });
      });
      return;
    }

    // Distancia de cada tarjeta a la pila, sin contar el desplazamiento que
    // ya tenga: así sobrevive a un refresh con la timeline a mitad de camino.
    const offset = (el: HTMLElement, axis: "x" | "y") => {
      const a = anchor.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const current = Number(gsap.getProperty(el, axis)) || 0;
      return axis === "x"
        ? a.left + a.width / 2 - (r.left - current + r.width / 2)
        : a.top - (r.top - current);
    };

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: root,
        pin: true,
        scrub: 0.6,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.6}`,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      },
    });

    // El texto de cada columna entra cuando ya aterrizaron sus tarjetas.
    tl.from(q(".seg-copy"), { opacity: 0, y: 16, duration: 0.3, stagger: 0.12 }, 1.35);
    cards.forEach((card, i) => {
      const at = 0.35 + i * 0.12;
      tl.fromTo(
        card,
        {
          x: () => offset(card, "x"),
          y: () => offset(card, "y") + i * 6,
          rotation: (i % 2 ? 1 : -1) * (2 + i),
        },
        { x: 0, y: 0, rotation: 0, duration: 0.6, immediateRender: true },
        at,
      );
      const wait = card.querySelector(".t-wait");
      const done = card.querySelector(".t-done");
      if (wait && done) {
        tl.fromTo(
          wait,
          { opacity: 1 },
          { opacity: 0, duration: 0.25, immediateRender: true },
          at + 0.45,
        );
        tl.fromTo(
          done,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, immediateRender: true },
          at + 0.45,
        );
      }
    });
    tl.to({}, { duration: 0.5 });
  });

  return (
    <section ref={ref} id="segmentos" className="relative md:min-h-svh">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center px-4 py-20 md:min-h-svh md:px-10 md:py-12">
        <TramoHeading index={segments.index} eyebrow={segments.eyebrow}>
          {segments.heading}
        </TramoHeading>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{segments.intro}</p>

        <div className="relative mt-10">
          {/* Punto de donde salen las tarjetas: arriba, al centro de las columnas. */}
          <span
            aria-hidden
            className="seg-pile pointer-events-none absolute top-0 left-1/2 h-0 w-64 -translate-x-1/2"
          />
          <div className="grid gap-6 md:grid-cols-3 md:gap-5">
            {segments.columns.map((col) => (
              <div key={col.treatment} className="seg-col flex flex-col">
                <ul className="space-y-2">
                  {tickets
                    .filter((t) => t.treatment === col.treatment)
                    .map((t) => (
                      <li key={t.id} className="seg-ticket relative z-10">
                        <TicketCard ticket={t} />
                      </li>
                    ))}
                </ul>
                <div className="seg-copy mt-5">
                  <p
                    className={cn(
                      "label",
                      col.treatment === "pregunta" ? "text-(--red)" : "text-(--blue)",
                    )}
                  >
                    {col.label}
                  </p>
                  <p className="mt-2 font-semibold">{col.when}</p>
                  <p className="mt-2 text-sm leading-relaxed text-(--ink-dim)">
                    {col.fact}
                    <Cites ids={col.sources} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-(--ink-muted)">
          {segments.footnote}
        </p>
      </div>
    </section>
  );
}
