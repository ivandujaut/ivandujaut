"use client";

import { rules as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cite, Tramo, TramoHeading } from "../_components/tramo";

const THREAD_GAP = 25;
const THREAD_TOP = 22;
const ORIGIN_Y = THREAD_TOP + ((data.threads.length - 1) * THREAD_GAP) / 2;

function formatCounter(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * 02 · Lo difícil. La cinta llega y se deshilacha en hilos, uno por
 * jurisdicción: la complejidad no es calcular, es que cada lugar tiene su
 * regla. Misiones se enciende cuando aparece el dato de la UIA; es un ejemplo,
 * no el tema de la página.
 */
export function Rules() {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    const counters = q(".rules-counter");
    counters.forEach((el) => {
      const target = Number((el as HTMLElement).dataset.value);
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 88%", end: "top 55%", scrub: 0.4 },
        onUpdate: () => {
          el.textContent = formatCounter(state.value);
        },
      });
    });

    const threads = q(".rules-thread");
    gsap.fromTo(
      threads,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: q(".rules-scene")[0],
          start: "top 80%",
          end: "center 50%",
          scrub: 0.5,
        },
      },
    );
    gsap.from(q(".rules-thread-label"), {
      opacity: 0,
      stagger: 0.04,
      scrollTrigger: {
        trigger: q(".rules-scene")[0],
        start: "top 65%",
        end: "center 45%",
        scrub: 0.5,
      },
    });

    gsap.from(q(".rules-highlight"), {
      opacity: 0,
      scrollTrigger: {
        trigger: q(".rules-anecdote")[0],
        start: "top 80%",
        end: "top 55%",
        scrub: 0.4,
      },
    });

    return () => {
      counters.forEach((el) => {
        el.textContent = formatCounter(Number((el as HTMLElement).dataset.value));
      });
    };
  });

  return (
    <Tramo id="reglas">
      <div ref={ref}>
        <TramoHeading index={data.index} eyebrow={data.eyebrow}>
          {data.heading}
        </TramoHeading>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center">
          <div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
              {data.counters.map((counter) => (
                <div key={counter.label} className="border-t border-(--rule) pt-4">
                  <dt className="num text-4xl text-(--ink) md:text-5xl">
                    <span className="rules-counter" data-value={counter.value}>
                      {formatCounter(counter.value)}
                    </span>
                    {counter.suffix}
                  </dt>
                  <dd className="mt-1 text-sm text-(--ink-dim)">
                    {counter.label}
                    <Cite id={counter.source} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-(--ink-dim)">{data.countersNote}</p>
          </div>

          <figure className="rules-scene scene -ml-16 md:ml-0">
            <svg
              viewBox={`0 0 400 ${THREAD_TOP * 2 + (data.threads.length - 1) * THREAD_GAP}`}
              className="h-auto w-full"
              role="img"
              aria-label="Una cinta que se separa en hilos, uno por jurisdicción: provincias argentinas, estados de Brasil, ciudades de Colombia y estados de México."
            >
              {data.threads.map((name, i) => {
                const y = THREAD_TOP + i * THREAD_GAP;
                const isHighlight = name === data.highlightThread;
                return (
                  <g key={name}>
                    <path
                      className="rules-thread"
                      d={`M0 ${ORIGIN_Y} C110 ${ORIGIN_Y} 150 ${y} 250 ${y}`}
                      pathLength={1}
                      stroke="var(--flow)"
                      strokeOpacity={0.55}
                      strokeWidth={1.6}
                      fill="none"
                    />
                    {isHighlight ? (
                      <path
                        className="rules-highlight"
                        d={`M0 ${ORIGIN_Y} C110 ${ORIGIN_Y} 150 ${y} 250 ${y}`}
                        stroke="var(--trapped)"
                        strokeWidth={4}
                        strokeLinecap="round"
                        fill="none"
                      />
                    ) : null}
                    <text
                      className={
                        isHighlight ? "rules-thread-label t-trapped" : "rules-thread-label t-dim"
                      }
                      x="258"
                      y={y + 4}
                      fontSize="13"
                      fontWeight={isHighlight ? 600 : 400}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
              <rect x="0" y={ORIGIN_Y - 8} width="10" height="16" rx="2" fill="var(--flow)" />
            </svg>
          </figure>
        </div>

        <div className="rules-anecdote mt-16 max-w-2xl border-l-4 border-(--trapped) pl-5 md:mt-20">
          <p className="text-lg leading-relaxed md:text-xl">
            <span className="font-semibold">{data.anecdote.lead}</span> {data.anecdote.text}
            {data.anecdote.sources.map((id, i) => (
              <Cite key={id} id={id} label={i === 0 ? "UIA" : "fallo"} />
            ))}
          </p>
        </div>

        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{data.close}</p>
      </div>
    </Tramo>
  );
}
