"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { HandIcon } from "@hugeicons/core-free-icons";
import { platform as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Spine } from "../_components/spine";
import { Cite, Tramo, TramoHeading } from "../_components/tramo";

/** Los estados que vienen se adelantan apagados; los que ya pasaron casi desaparecen,
 * porque quedan cortados contra el borde izquierdo de la ventana. */
const NEXT = 0.35;
const PAST = 0.1;

/**
 * 07 · El día a día. Una declaración recorre sus estados de izquierda a
 * derecha: el tramo se fija en todas las pantallas y el scroll vertical mueve
 * la fila en horizontal. La cinta se dibuja hasta el estado que está en el
 * centro, y los pasos donde los docs de Brinta muestran a una persona llevan
 * una mano.
 *
 * Geometría (ver `.hz-track` en `brinta.css`): cada estado ocupa una columna
 * de ancho `--col` y la fila tiene media pantalla de aire a cada lado, así el
 * primero arranca centrado y el último termina centrado. El recorrido es
 * `ancho de la fila - ancho de la ventana` = 5 columnas, y el estado `i`
 * queda en el centro en `i / 5` de la timeline.
 *
 * Sin animación (o sin JS), la fila es un carrusel nativo con scroll
 * horizontal y snap, con todo visible.
 */
export function Platform() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const viewport = q(".hz-viewport")[0] as HTMLElement;
    const track = q(".hz-track")[0] as HTMLElement;
    const ribbon = q(".hz-ribbon")[0] as HTMLElement;
    const rings = q(".hz-ring") as HTMLElement[];
    const stations = q(".hz-station") as HTMLElement[];
    const last = stations.length - 1;

    viewport.classList.add("is-driven");
    viewport.scrollLeft = 0;

    const travel = () => track.scrollWidth - viewport.clientWidth;
    // Centro del primer anillo, medido desde el borde de la fila: hasta ahí
    // llega la cinta antes de empezar.
    const firstRing = () => stations[0].offsetLeft + rings[0].offsetWidth / 2;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        pin: true,
        scrub: 0.6,
        start: "top top",
        end: () => `+=${travel() * (isDesktop ? 1.15 : 1.35)}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        // Igual que los otros tramos fijos: ordena los triggers por posición.
        refreshPriority: 0,
      },
    });

    tl.fromTo(track, { x: 0 }, { x: () => -travel(), duration: 1 }, 0);
    tl.fromTo(
      ribbon,
      { scaleX: () => firstRing() / ribbon.offsetWidth },
      { scaleX: 1, duration: 1 },
      0,
    );

    stations.forEach((station, i) => {
      const at = i / last;
      const card = station.querySelector(".hz-card");
      const dot = station.querySelector(".hz-dot");
      const hand = station.querySelector(".hz-hand");
      const branch = station.querySelector(".hz-branch");
      if (i > 0) {
        tl.fromTo(card, { opacity: NEXT }, { opacity: 1, duration: 0.08 }, at - 0.08);
        if (dot) tl.from(dot, { scale: 0, duration: 0.06 }, at - 0.06);
        if (hand) {
          tl.from(
            hand,
            { scale: 0, rotation: -25, duration: 0.08, ease: "back.out(2)" },
            at - 0.06,
          );
        }
      }
      if (branch) tl.from(branch, { opacity: 0, y: -8, duration: 0.08 }, at);
      if (i < last) tl.to(card, { opacity: PAST, duration: 0.08 }, at + 0.1);
    });
    // Un respiro al final: el último estado queda quieto antes de soltar el tramo.
    tl.to({}, { duration: 0.12 });

    return () => viewport.classList.remove("is-driven");
  });

  return (
    <>
      <section ref={ref} id="plataforma" className="relative h-svh">
        <div className="relative mx-auto h-full w-full max-w-6xl">
          <Spine animateOn="never" />
          <div className="relative flex h-full flex-col justify-center pt-14 pr-5 pb-8 pl-16 md:pt-10 md:pr-10 md:pb-10 md:pl-28">
            <TramoHeading index={data.index} eyebrow={data.eyebrow} compact>
              {data.heading}
            </TramoHeading>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-(--ink-dim) md:text-lg">
              {data.lead}
              <Cite id={data.leadSources[0]} label="aviso" />
              <Cite id={data.leadSources[1]} label="docs" />
            </p>
            <Legend />

            <div className="relative mt-4 -mr-5 md:mt-6 md:-mr-10">
              {/* La cinta sale del carril de la izquierda y entra en la fila. */}
              <div
                aria-hidden
                className="absolute right-full w-8 -translate-y-1/2 bg-(--flow) md:w-14"
                style={{ top: "var(--ribbon-y)", height: "var(--spine-width)" }}
              />
              <div className="hz-viewport">
                <div className="hz-track">
                  <div aria-hidden className="hz-ribbon" />
                  <ol className="flex">
                    {data.stations.map((station) => (
                      <li key={station.id} className="hz-station">
                        <div className="relative h-(--ring-area)">
                          <span aria-hidden className="hz-ring">
                            {station.hand ? (
                              <span className="hz-hand flex size-full items-center justify-center rounded-full bg-(--trapped) text-(--paper)">
                                <HugeiconsIcon icon={HandIcon} size={17} strokeWidth={1.8} />
                              </span>
                            ) : (
                              <span className="hz-dot size-3.5 rounded-full bg-(--flow)" />
                            )}
                          </span>
                        </div>
                        <div className="hz-card pr-6 md:pr-10">
                          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-lg font-semibold md:text-xl">{station.name}</span>
                            <code className="num rounded-sm bg-(--paper-deep) px-1.5 py-0.5 text-[11px] text-(--ink-dim) md:text-xs">
                              {station.status}
                            </code>
                            <span className="sr-only">
                              {station.hand ? data.legend.hand : data.legend.auto}
                            </span>
                          </p>
                          <p className="mt-2 text-[15px] leading-relaxed text-(--ink-dim) md:text-base">
                            {station.text}
                            <Cite id={station.source} />
                          </p>
                          {"branch" in station && station.branch ? (
                            <p className="hz-branch mt-3 border-l-2 border-(--trapped) pl-3 text-sm leading-snug text-(--trapped-ink)">
                              <a
                                href="#caso"
                                className="underline decoration-(--trapped-soft) underline-offset-4 hover:decoration-(--trapped-ink)"
                              >
                                {station.branch}
                              </a>
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PlatformNotes />
    </>
  );
}

function Legend() {
  return (
    <p
      aria-hidden
      className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-(--ink-dim) md:text-sm"
    >
      <span className="inline-flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full border-2 border-(--flow) bg-(--trapped) text-(--paper)">
          <HugeiconsIcon icon={HandIcon} size={12} strokeWidth={2} />
        </span>
        {data.legend.hand}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full border-2 border-(--flow)">
          <span className="size-2 rounded-full bg-(--flow)" />
        </span>
        {data.legend.auto}
      </span>
    </p>
  );
}

/** Lo que sigue al recorrido: por qué importa, cómo sale una mano, qué miraría y qué no. */
function PlatformNotes() {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    q(".pl-block").forEach((block) => {
      gsap.from(block, {
        opacity: 0,
        y: 18,
        ease: "none",
        scrollTrigger: { trigger: block, start: "top 95%", end: "top 75%", scrub: 0.4 },
      });
    });
  });

  return (
    <Tramo>
      <div ref={ref}>
        <div className="pl-block max-w-2xl">
          <p className="font-serif text-2xl leading-snug text-balance md:text-3xl">{data.why}</p>
          <p className="mt-6 text-base leading-relaxed md:text-lg">
            <span className="font-semibold">{data.design.lead}</span>{" "}
            <span className="text-(--ink-dim)">{data.design.text}</span>
          </p>
        </div>

        <div className="pl-block mt-14 max-w-3xl">
          <h3 className="text-xl font-semibold md:text-2xl">{data.ladder.title}</h3>
          <ol className="mt-5 grid gap-3 md:grid-cols-4">
            {data.ladder.steps.map((step, i) => (
              <li
                key={step}
                className="rounded-md border border-(--rule) bg-(--paper-deep) p-4 text-base leading-snug"
              >
                <span className="num block text-sm text-(--trapped-ink)">{i + 1}</span>
                <span className="mt-1 block">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-base text-(--ink-dim)">{data.ladder.note}</p>
        </div>

        <div className="pl-block mt-14 grid max-w-4xl gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <h3 className="text-xl font-semibold md:text-2xl">{data.metrics.title}</h3>
            <dl className="mt-5 space-y-4">
              {data.metrics.items.map((item) => (
                <div key={item.name}>
                  <dt className="text-base font-medium md:text-lg">{item.name}</dt>
                  <dd className="mt-0.5 text-base text-(--ink-dim)">{item.why}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm text-(--ink-dim)">{data.metrics.baseline}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold md:text-2xl">{data.notDo.title}</h3>
            <ul className="mt-5 space-y-3">
              {data.notDo.items.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed md:text-lg">
                  <span aria-hidden className="num text-(--risk)">
                    ×
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="pl-block mt-14 max-w-2xl border-l-4 border-(--trapped) pl-5 text-lg leading-relaxed">
          {data.caseLink.text}{" "}
          <a
            href={data.caseLink.href}
            className="text-(--trapped-ink) underline underline-offset-4"
          >
            {data.caseLink.label}
          </a>
        </p>
      </div>
    </Tramo>
  );
}
