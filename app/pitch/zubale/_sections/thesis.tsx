"use client";

import { thesis } from "../zubale.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cites, Tramo } from "../_components/ui";

/**
 * 08 · La idea. La frase grande de la página: arranca apagada y cada palabra
 * se enciende en orden de lectura a medida que la sección cruza la pantalla.
 * Con movimiento reducido se sirve encendida (el HTML ya llega a tinta plena).
 */
export function Thesis() {
  const ref = useGsapSection<HTMLDivElement>(({ root, q }) => {
    gsap.fromTo(
      q(".thesis-word"),
      { opacity: 0.28 },
      {
        opacity: 1,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
      },
    );
  });

  return (
    <Tramo id="tesis">
      <p className="reveal mono text-xs tracking-widest text-(--ink-dim) uppercase">
        {thesis.index} <span aria-hidden>·</span> {thesis.eyebrow}
      </p>
      <div ref={ref}>
        <p className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          {thesis.lines.map((line, li) => (
            <span key={line} className={li === 0 ? "block" : "mt-2 block text-(--person-ink)"}>
              {line.split(" ").map((word, wi) => (
                <span key={`${li}-${wi}`} className="thesis-word">
                  {word}{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
        <p className="mt-6 max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">
          {thesis.coda.split(" ").map((word, wi) => (
            <span key={`coda-${wi}`} className="thesis-word">
              {word}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {thesis.reasons.map((r, i) => (
          <article
            key={r.id}
            className="reveal rounded-2xl border border-(--rule) bg-(--surface) p-6"
          >
            <p className="mono text-sm text-(--ink-faint)">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-lg font-semibold">{r.title}</h3>
            <p className="mt-2 text-sm text-(--ink-dim)">{r.text}</p>
          </article>
        ))}
      </div>

      <p className="reveal mt-8 max-w-3xl text-base text-(--ink-dim)">
        <strong className="font-semibold text-(--ink)">{thesis.scope.lead}</strong>{" "}
        {thesis.scope.text}
        <Cites ids={thesis.scope.sources} />
      </p>
    </Tramo>
  );
}
