"use client";

import { brazil as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { StoryLayout } from "../_components/story-layout";
import { drawFrom, storyTimeline } from "../_components/story";
import { Cite, Tramo, TramoHeading } from "../_components/tramo";

/**
 * 03 · Lo que viene. Un pago a un proveedor cruza una compuerta: en el mismo
 * momento del pago, una parte se desvía al fisco (split payment). El crédito
 * del comprador se enciende recién cuando esa parte llegó. Al final, la cuenta
 * del período la arma el fisco y, si nadie responde, queda sellada.
 * Sin montos: la alícuota de la CBS 2027 todavía no está fijada.
 */
export function Brazil() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const { tl, activate } = storyTimeline(root, isDesktop);

    tl.addLabel("cbs");
    drawFrom(tl, q(".br-in"), "cbs", 0.6);
    tl.from(
      q(".br-gate, .br-label-pago"),
      { opacity: 0, scaleY: 0.3, svgOrigin: "200 110", duration: 0.4 },
      "cbs+=0.3",
    );

    tl.addLabel("split", "+=0.3");
    activate(1, "split");
    drawFrom(tl, q(".br-out"), "split", 0.5);
    drawFrom(tl, q(".br-tax"), "split+=0.1", 0.7);
    tl.from(q(".br-label-proveedor, .br-label-fisco"), { opacity: 0, duration: 0.3 }, "split+=0.6");

    tl.addLabel("credito", "+=0.3");
    activate(2, "credito");
    tl.from(q(".br-link"), { opacity: 0, duration: 0.4 }, "credito");
    tl.from(q(".br-credit"), { opacity: 0, y: 10, duration: 0.3 }, "credito");
    tl.from(q(".br-credit-lit"), { opacity: 0, duration: 0.3 }, "credito+=0.5");

    tl.addLabel("silencio", "+=0.3");
    activate(3, "silencio");
    tl.from(q(".br-card"), { opacity: 0, y: 14, duration: 0.4 }, "silencio");
    tl.from(
      q(".br-stamp"),
      {
        opacity: 0,
        scale: 1.8,
        rotation: -20,
        svgOrigin: "300 300",
        duration: 0.35,
        ease: "back.out(2)",
      },
      "silencio+=0.5",
    );
    tl.to({}, { duration: 0.5 });
  });

  const scene = (
    <figure className="scene">
      <svg viewBox="0 0 400 360" className="h-auto w-full" role="img" aria-labelledby="br-title">
        <title id="br-title">
          Un pago a un proveedor pasa por una compuerta donde la CBS se separa hacia el fisco; el
          crédito del comprador se habilita cuando esa parte llegó, y la cuenta del período queda
          aceptada por silencio si nadie la revisa.
        </title>

        <path
          className="br-in"
          d="M16 110 H200"
          pathLength={1}
          stroke="var(--flow)"
          strokeWidth="22"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="br-out"
          d="M204 106 H384"
          pathLength={1}
          stroke="var(--flow)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="br-tax"
          d="M204 117 C214 150 240 180 300 180 H384"
          pathLength={1}
          stroke="var(--fisco)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <rect className="br-gate" x="195" y="72" width="10" height="76" rx="3" fill="var(--ink)" />
        <text
          className="br-label-pago"
          x="200"
          y="60"
          fontSize="14"
          textAnchor="middle"
          fontWeight="600"
        >
          {data.labels.pago}
        </text>
        <text className="br-label-proveedor t-dim" x="384" y="84" fontSize="13" textAnchor="end">
          {data.labels.proveedor}
        </text>
        <text className="br-label-fisco t-fisco" x="384" y="204" fontSize="13" textAnchor="end">
          {data.labels.fisco}
        </text>

        {/* El crédito del comprador depende de que la CBS haya llegado. */}
        <path
          className="br-link"
          d="M300 184 C270 230 200 250 168 262"
          stroke="var(--ink-faint)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
        />
        <g className="br-credit">
          <rect
            x="16"
            y="244"
            width="152"
            height="40"
            rx="8"
            fill="none"
            stroke="var(--ink-faint)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <rect
            className="br-credit-lit"
            x="16"
            y="244"
            width="152"
            height="40"
            rx="8"
            fill="var(--fisco-soft)"
            stroke="var(--fisco)"
            strokeWidth="1.5"
          />
          <text x="92" y="269" fontSize="13" textAnchor="middle">
            {data.labels.credito}
          </text>
        </g>

        {/* La cuenta del período y el sello. */}
        <g className="br-card">
          <rect
            x="216"
            y="236"
            width="168"
            height="112"
            rx="6"
            fill="var(--paper-deep)"
            stroke="var(--rule)"
          />
          <text x="230" y="260" fontSize="12" className="t-dim">
            {data.labels.apuracion}
          </text>
          {[280, 298, 316, 334].map((y) => (
            <line
              key={y}
              x1="230"
              x2="370"
              y1={y}
              y2={y}
              stroke="var(--rule)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          ))}
        </g>
        <g className="br-stamp">
          <g transform="rotate(-9 300 300)">
            <rect
              x="228"
              y="276"
              width="144"
              height="44"
              rx="4"
              fill="var(--paper)"
              fillOpacity="0.8"
              stroke="var(--risk)"
              strokeWidth="2.5"
            />
            <text
              x="300"
              y="303"
              fontSize="13"
              textAnchor="middle"
              fontWeight="700"
              className="t-risk"
            >
              {data.labels.stamp}
            </text>
          </g>
        </g>
      </svg>
    </figure>
  );

  return (
    <>
      <Tramo id="brasil" ref={ref} pinned>
        <TramoHeading index={data.index} eyebrow={data.eyebrow} compact>
          {data.heading}
        </TramoHeading>

        <StoryLayout
          scene={scene}
          steps={data.steps.map((step) => ({
            id: step.id,
            content: (
              <>
                <p>
                  {step.text}
                  {"sources" in step && step.sources
                    ? step.sources.map((id, i) => (
                        <Cite key={id} id={id} label={`fuente ${i + 1}`} />
                      ))
                    : null}
                  {"source" in step && step.source ? <Cite id={step.source} /> : null}
                </p>
                {"note" in step && step.note ? (
                  <p className="mt-1 text-sm text-(--ink-dim)">{step.note}</p>
                ) : null}
              </>
            ),
          }))}
          footer={
            <p className="border-t border-(--rule) pt-4 text-sm leading-relaxed text-(--ink-dim)">
              {data.footnote}
              <Cite id={data.footnoteSource} />
            </p>
          }
        />
      </Tramo>
      <CashKinds />
    </>
  );
}

/**
 * Las tres clases de caja, recién cuando las tres ya aparecieron en los
 * dibujos. Cada muestra copia la forma de su dibujo: cinta azul, cinta
 * naranja y el sello rojo.
 */
function CashKinds() {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    gsap.from(q(".kind"), {
      opacity: 0,
      y: 14,
      stagger: 0.12,
      ease: "none",
      scrollTrigger: { trigger: q(".kind")[0], start: "top 95%", end: "top 75%", scrub: 0.4 },
    });
  });

  return (
    <Tramo>
      <div ref={ref}>
        <p className="num text-xs tracking-widest text-(--ink-dim) uppercase">{data.recap.title}</p>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed">{data.recap.lead}</p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {data.recap.items.map((kind) => (
            <li
              key={kind.id}
              className="kind rounded-md border border-(--rule) bg-(--paper-deep) p-5"
            >
              <KindSwatch id={kind.id} />
              <p className="mt-4 text-base leading-snug">
                <span className="font-semibold">{kind.name}.</span>{" "}
                <span className="text-(--ink-dim)">{kind.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Tramo>
  );
}

function KindSwatch({ id }: { id: string }) {
  if (id === "riesgo") {
    return (
      <span
        aria-hidden
        className="inline-block -rotate-6 rounded-sm border-2 border-(--risk) px-2 py-0.5 text-xs font-bold text-(--risk)"
      >
        {data.labels.stamp}
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="block h-3.5 w-16 rounded-full"
      style={{ background: id === "sale" ? "var(--fisco)" : "var(--trapped)" }}
    />
  );
}
