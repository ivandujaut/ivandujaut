"use client";

import { followMoney as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { StoryLayout } from "../_components/story-layout";
import { drawFrom, storyTimeline } from "../_components/story";
import { Cite, ExampleBadge, Tramo, TramoHeading } from "../_components/tramo";

/**
 * 01 · Seguí la plata. Un cobro de $100.000 cruza la escena; en el punto de
 * la retención se abre una lupa, porque $3.000 al grosor real serían un pelo.
 * Adentro de la lupa la retención se parte en el impuesto que correspondía y
 * el saldo que queda en el fisco, que se junta abajo.
 *
 * Grosores: la cinta grande es el cobro (escala 1); adentro de la lupa la
 * escala es otra, pero las tres cintas guardan proporción entre sí
 * (3.000 : 1.800 : 1.200 = 34 : 20 : 14).
 */
export function FollowMoney() {
  const ref = useGsapSection<HTMLDivElement>(({ root, q }) => {
    const tl = storyTimeline(root);

    tl.addLabel("cobro");
    drawFrom(tl, q(".fm-main"), "cobro");
    tl.from(q(".fm-label-cobro"), { opacity: 0, duration: 0.3 }, "cobro");
    tl.from(q(".fm-label-comercio"), { opacity: 0, duration: 0.3 }, "cobro+=0.7");

    tl.addLabel("retencion", "+=0.3");
    tl.from(q(".fm-notch"), { scale: 0, transformOrigin: "50% 50%", duration: 0.25 }, "retencion");
    tl.from(q(".fm-connector"), { opacity: 0, duration: 0.3 }, "retencion+=0.1");
    tl.from(
      q(".fm-lens"),
      { scale: 0.2, opacity: 0, svgOrigin: "130 230", duration: 0.5 },
      "retencion+=0.3",
    );
    drawFrom(tl, q(".fm-retention"), "retencion+=0.6", 0.5);
    tl.from(
      q(".fm-label-lens, .fm-label-retencion"),
      { opacity: 0, duration: 0.3 },
      "retencion+=0.7",
    );

    tl.addLabel("split", "+=0.3");
    drawFrom(tl, q(".fm-tax"), "split", 0.6);
    drawFrom(tl, q(".fm-trapped"), "split+=0.1", 0.7);
    tl.from(q(".fm-label-tax"), { opacity: 0, duration: 0.3 }, "split+=0.5");
    tl.from(q(".fm-label-trapped"), { opacity: 0, duration: 0.3 }, "split+=0.7");

    tl.addLabel("pool", "+=0.3");
    tl.from(q(".fm-pool-fill"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8 }, "pool");
    tl.from(q(".fm-label-pool"), { opacity: 0, duration: 0.3 }, "pool+=0.4");
    tl.to({}, { duration: 0.3 });

    gsap.from(q(".fm-stat"), {
      opacity: 0,
      y: 16,
      stagger: 0.12,
      scrollTrigger: { trigger: q(".fm-stats")[0], start: "top 85%", end: "top 55%", scrub: 0.4 },
    });
    gsap.from(q(".fm-kind"), {
      opacity: 0,
      x: -12,
      stagger: 0.12,
      scrollTrigger: { trigger: q(".fm-kinds")[0], start: "top 85%", end: "top 55%", scrub: 0.4 },
    });
  });

  const scene = (
    <figure className="scene">
      <svg viewBox="0 0 400 360" className="h-auto w-full" role="img" aria-labelledby="fm-title">
        <title id="fm-title">
          Un cobro de $100.000: $97.000 llegan al comercio, $3.000 se retienen; de esos, $1.800 eran
          el impuesto y $1.200 quedan en el fisco como saldo a favor.
        </title>

        {/* El cobro */}
        <text className="fm-label-cobro num" x="16" y="22" fontSize="15">
          {data.labels.cobro}
        </text>
        <path
          className="fm-main"
          d="M16 44 H384"
          pathLength={1}
          stroke="var(--flow)"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />
        <text className="fm-label-comercio num t-dim" x="384" y="84" fontSize="14" textAnchor="end">
          {data.labels.comercio}
        </text>

        {/* La retención y la lupa */}
        <circle
          className="fm-notch"
          cx="110"
          cy="44"
          r="6"
          fill="var(--paper)"
          stroke="var(--fisco)"
          strokeWidth="3"
        />
        <path
          className="fm-connector"
          d="M110 52 L120 131"
          stroke="var(--ink-faint)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
        />
        <g className="fm-lens">
          <circle
            cx="130"
            cy="230"
            r="98"
            fill="var(--paper-deep)"
            stroke="var(--ink-faint)"
            strokeWidth="1.5"
          />
        </g>
        <text className="fm-label-lens t-dim" x="146" y="118" fontSize="13">
          {data.labels.lens}
        </text>

        <path
          className="fm-retention"
          d="M120 134 C120 175 124 198 130 214"
          pathLength={1}
          stroke="var(--fisco)"
          strokeWidth="34"
          strokeLinecap="butt"
          fill="none"
        />
        <text
          className="fm-label-retencion num t-fisco"
          x="98"
          y="170"
          fontSize="14"
          textAnchor="end"
        >
          <tspan x="98">$3.000</tspan>
          <tspan x="98" dy="17" className="sans">
            retenidos
          </tspan>
        </text>

        {/* El impuesto que correspondía y lo que queda atrapado */}
        <path
          className="fm-tax"
          d="M134 214 C160 238 200 240 252 240"
          pathLength={1}
          stroke="var(--fisco)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="fm-trapped"
          d="M126 218 C122 262 170 300 252 300"
          pathLength={1}
          stroke="var(--trapped)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <text className="fm-label-tax num t-fisco" x="266" y="236" fontSize="14">
          <tspan x="266">$1.800</tspan>
          <tspan x="266" dy="17" className="t-dim sans">
            era el impuesto
          </tspan>
        </text>
        <text className="fm-label-trapped num t-trapped" x="266" y="290" fontSize="14">
          <tspan x="266">$1.200</tspan>
          <tspan x="266" dy="17" className="sans">
            quedan en el fisco
          </tspan>
        </text>

        {/* El saldo a favor que se junta */}
        <rect
          x="262"
          y="318"
          width="96"
          height="30"
          rx="4"
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="1.5"
        />
        <rect
          className="fm-pool-fill"
          x="264"
          y="320"
          width="92"
          height="26"
          rx="3"
          fill="var(--trapped)"
          opacity="0.85"
        />
        <text
          className="fm-label-pool sans"
          x="310"
          y="338"
          fontSize="12"
          textAnchor="middle"
          style={{ fill: "var(--paper)" }}
        >
          {data.labels.pool}
        </text>
      </svg>
      <figcaption className="mt-2 flex justify-end">
        <ExampleBadge>{data.exampleBadge}</ExampleBadge>
      </figcaption>
    </figure>
  );

  return (
    <Tramo id="plata">
      <div ref={ref}>
        <TramoHeading index={data.index} eyebrow={data.eyebrow}>
          {data.heading}
        </TramoHeading>

        <StoryLayout
          scene={scene}
          steps={data.steps.map((step) => ({
            id: step.id,
            content: (
              <p>
                {step.text}
                {"source" in step && step.source ? <Cite id={step.source} /> : null}
              </p>
            ),
          }))}
        />

        <dl className="fm-stats mt-16 grid gap-8 md:mt-24 md:grid-cols-3">
          {data.stats.map((stat) => (
            <div key={stat.value} className="fm-stat border-t border-(--rule) pt-5">
              <dt className="num text-3xl text-(--ink) md:text-4xl">{stat.value}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-(--ink-dim)">
                {stat.label}
                <Cite id={stat.source} label={stat.sourceLabel} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="fm-kinds mt-16 md:mt-20">
          <p className="num text-xs tracking-widest text-(--ink-dim) uppercase">
            {data.kinds.title}
          </p>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {data.kinds.items.map((kind) => (
              <li key={kind.id} className="fm-kind flex gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 h-3 w-8 shrink-0 rounded-full"
                  style={{
                    background:
                      kind.id === "sale"
                        ? "var(--fisco)"
                        : kind.id === "atrapada"
                          ? "var(--trapped)"
                          : "var(--risk)",
                  }}
                />
                <p className="text-base leading-snug">
                  <span className="font-semibold">{kind.name}.</span>{" "}
                  <span className="text-(--ink-dim)">{kind.text}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Tramo>
  );
}
