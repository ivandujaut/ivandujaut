"use client";

import { ask, tickets } from "../lacaja.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { TicketCard, TramoHeading } from "../_components/ui";

/**
 * 06 · Lo que queda en la bandeja. Las seis solicitudes ya tienen destino y
 * se apagan; quedan tres tarjetas que no se pueden cerrar desde afuera: los
 * datos de adentro, que son las preguntas para la charla. Corre una vez al
 * entrar; sin animación se ve el estado final.
 */
export function Ask() {
  const ref = useGsapSection<HTMLElement>(({ q }) => {
    const tray = q(".ask-tray")[0];
    if (!tray) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: tray, start: "top 75%", once: true },
    });
    tl.fromTo(
      q(".ask-ticket"),
      { opacity: 1 },
      { opacity: 0.4, duration: 0.6, stagger: 0.08, ease: "power2.out" },
    ).from(
      q(".ask-question"),
      { opacity: 0, y: 24, duration: 0.7, stagger: 0.15, ease: "power4.out" },
      "-=0.2",
    );
  });

  return (
    <section ref={ref} id="pedido" className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-10 md:py-24">
        <TramoHeading index={ask.index} eyebrow={ask.eyebrow}>
          {ask.heading}
        </TramoHeading>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{ask.intro}</p>

        <div className="ask-tray mt-10 rounded-xl border border-(--rule) bg-(--surface-deep) p-3 md:p-4">
          <ul aria-hidden className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {tickets.map((t) => (
              <li key={t.id} className="ask-ticket opacity-40">
                <TicketCard ticket={t} show="done" compact className="h-full" />
              </li>
            ))}
          </ul>
          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            {ask.questions.map((question) => (
              <li
                key={question}
                className="ask-question flex flex-col rounded-md border-[1.5px] border-dashed border-(--red) bg-(--surface) p-5"
              >
                <p className="label text-(--red)">{ask.label}</p>
                <p className="mt-3 font-serif text-2xl leading-snug">{question}</p>
                <p
                  aria-hidden
                  className="mt-auto pt-4 font-serif text-5xl leading-none text-(--red)"
                >
                  ?
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="font-serif text-2xl leading-snug">{ask.formula.title}</p>
            <p className="mt-3 leading-relaxed text-(--ink-dim)">{ask.formula.text}</p>
          </div>
          <p className="leading-relaxed text-(--ink-dim) md:pt-1">{ask.risk}</p>
        </div>
      </div>
    </section>
  );
}
