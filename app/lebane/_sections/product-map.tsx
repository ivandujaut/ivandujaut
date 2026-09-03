"use client";

import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { Section, SectionHeading } from "../_lib/section";
import { aiLayer, productMap } from "../lebane.data";

const COLS = productMap.length;
// Centro de la primera y la última columna, en % del ancho de la fila.
const FIRST = (100 / COLS) * 0.5;
const LAST = 100 - FIRST;

/**
 * Desktop: siete nodos en una fila, unidos por una línea que se dibuja de
 * izquierda a derecha; Payments llega último y un arco por debajo vuelve al
 * primer módulo (el cobro conciliado entra otra vez a la obra). Lena envuelve
 * todo con un borde punteado que aparece al final. Mobile: la misma lista en
 * vertical con conectores cortos.
 */
export function ProductMap() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const arc = root.querySelector<SVGPathElement>(".arc");
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: root, start: "top 60%", toggleActions: "play none none none" },
    });

    if (isDesktop) {
      tl.from(q(".rail"), {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "none",
      });
      tl.from(q(".node-dot"), { scale: 0.4, opacity: 0, duration: 0.4, stagger: 0.2 }, 0.1);
      tl.from(q(".node-text"), { opacity: 0, y: 8, duration: 0.4, stagger: 0.2 }, 0.25);
      if (arc) {
        const len = arc.getTotalLength();
        tl.fromTo(
          arc,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" },
          ">-0.2",
        );
        tl.from(q(".arc-label"), { opacity: 0, duration: 0.4 }, ">-0.3");
      }
    } else {
      tl.from(q(".node"), { opacity: 0, y: 12, duration: 0.4, stagger: 0.15 });
      tl.from(
        q(".connector"),
        { scaleY: 0, transformOrigin: "top center", duration: 0.3, stagger: 0.15 },
        0.15,
      );
      tl.from(q(".arc-label"), { opacity: 0, duration: 0.4 }, ">-0.1");
    }
    tl.from(q(".lena"), { opacity: 0, duration: 0.7 }, ">-0.1");
  });

  return (
    <Section id="product-map" ref={ref}>
      <SectionHeading eyebrow="02 · El producto">
        El producto, en el orden en que lo usa un cliente
      </SectionHeading>

      <div className="relative mt-16 px-4 pt-10 pb-8 md:mt-20 md:px-8 md:pt-14 md:pb-10">
        {/* El marco de Lena es un hermano, no el contenedor: si envolviera los
            nodos, su fade final los taparía a todos. */}
        <div
          className="lena pointer-events-none absolute inset-0 rounded-2xl border border-dashed border-(--lebane-accent)/50"
          aria-hidden
        />
        <p className="lena absolute -top-3.5 left-4 rounded-full border border-(--lebane-accent)/50 bg-background px-3 py-1 font-mono text-xs text-(--lebane-accent) md:left-8">
          {aiLayer.name} (antes {aiLayer.formerName}) <span aria-hidden>·</span> agentes por
          WhatsApp sobre todos los módulos
        </p>

        <div className="relative">
          <div
            className="rail absolute top-2 hidden h-px bg-(--lebane-accent) md:block"
            style={{ left: `${FIRST}%`, right: `${FIRST}%` }}
            aria-hidden
          />
          <ol className="flex flex-col md:grid md:grid-cols-7 md:gap-x-3">
            {productMap.map((mod, i) => {
              const isPayments = mod.id === "payments";
              return (
                <li key={mod.id} className="node relative md:text-center">
                  {i > 0 ? (
                    <div
                      className="connector mx-[7px] h-6 w-px bg-(--lebane-accent) md:hidden"
                      aria-hidden
                    />
                  ) : null}
                  <div className="flex items-start gap-4 md:block">
                    <span
                      className={`node-dot mt-0.5 block size-4 shrink-0 rounded-full border-2 md:mx-auto md:mt-0 ${
                        isPayments
                          ? "border-(--lebane-accent) bg-(--lebane-accent)"
                          : "border-(--lebane-accent) bg-background"
                      }`}
                      aria-hidden
                    />
                    <div className="node-text md:mt-4">
                      <p className="text-sm font-semibold md:text-base">
                        <span className="font-mono text-xs text-(--lebane-ink-dim)">{i + 1} </span>
                        {mod.label}
                      </p>
                      <p className="mt-1 text-sm text-(--lebane-ink-dim) md:text-xs">
                        {mod.oneLiner}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <svg
            className="mt-4 hidden h-14 w-full md:block"
            viewBox="0 0 700 56"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              className="arc"
              d={`M${LAST * 7} 0 V32 Q${LAST * 7} 44 ${LAST * 7 - 12} 44 H${FIRST * 7 + 12} Q${FIRST * 7} 44 ${FIRST * 7} 32 V4`}
              fill="none"
              stroke="var(--lebane-accent)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M${FIRST * 7 - 5} 9 L${FIRST * 7} 2 L${FIRST * 7 + 5} 9`}
              fill="none"
              stroke="var(--lebane-accent)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <p className="arc-label mt-6 text-center text-sm text-(--lebane-ink-dim) md:-mt-1">
            Payments cierra el círculo: el cobro entra identificado y vuelve a la obra ya
            conciliado.
          </p>
        </div>
      </div>
    </Section>
  );
}
