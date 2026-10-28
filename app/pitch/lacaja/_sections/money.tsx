"use client";

import { cn } from "@/lib/utils";
import { money } from "../lacaja.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Cites, TramoHeading } from "../_components/ui";

const fmt = (n: number) => n.toLocaleString("es-AR", { minimumFractionDigits: 1 });

/** Escala común de los dos pares: el valor más alto (54,6) queda cerca del borde. */
const PAIR_MAX = 60;
const PEER_MAX = 34;

/**
 * 02 · La cuenta en plata, sobre el azul del logo. Dos pares de barras (la
 * siniestralidad igual al mercado, la estructura 10,9 puntos arriba), lo que
 * vale un punto en pesos y la posición entre los líderes de autos. Las barras
 * crecen una vez al entrar; sin animación se ven completas.
 */
export function Money() {
  const ref = useGsapSection<HTMLElement>(({ q }) => {
    q(".bar-group").forEach((group) => {
      const bars = group.querySelectorAll(".bar-fill");
      gsap.from(bars, {
        scaleX: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: group, start: "top 80%", once: true },
      });
    });
  });

  return (
    <section ref={ref} id="cuenta" className="relative bg-(--blue) text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-10 md:py-24">
        <TramoHeading index={money.index} eyebrow={money.eyebrow} onBlue>
          {money.heading}
        </TramoHeading>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          {money.pairs.map((pair) => (
            <div key={pair.id} className="bar-group">
              <p className="label text-(--blue-pale)">{pair.label}</p>
              <dl className="mt-4 space-y-3">
                {(["lacaja", "mercado"] as const).map((who) => (
                  <div key={who}>
                    <div className="flex items-baseline justify-between text-sm">
                      <dt className={who === "lacaja" ? "font-semibold" : "text-(--blue-pale)"}>
                        {money.pairsLabels[who]}
                      </dt>
                      <dd className="tabular-nums">{fmt(pair[who])}%</dd>
                    </div>
                    <div className="mt-1.5 h-3 rounded-sm bg-white/10">
                      <div
                        className={cn(
                          "bar-fill h-full origin-left rounded-sm",
                          who === "lacaja" ? "bg-white" : "bg-(--blue-pale)/45",
                        )}
                        style={{ width: `${(pair[who] / PAIR_MAX) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-3 font-serif text-xl">{pair.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-(--blue-pale)">{money.pairsUnit}</p>

        <div className="mt-14 grid gap-8 border-t border-white/15 pt-10 md:grid-cols-2 md:gap-12">
          {money.stats.map((s) => (
            <div key={s.value}>
              <p className="font-serif text-5xl leading-none md:text-6xl">{s.value}</p>
              <p className="mt-3 max-w-sm text-(--blue-pale)">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bar-group mt-14 max-w-3xl">
          <p className="label text-(--blue-pale)">{money.peers.title}</p>
          <ol className="mt-4 space-y-2">
            {money.peers.rows.map((row) => (
              <li
                key={row.name}
                className="grid grid-cols-[8.5rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm md:grid-cols-[11rem_minmax(0,1fr)_3rem]"
              >
                <span
                  className={cn(
                    "truncate",
                    "highlight" in row && row.highlight ? "font-semibold" : "text-(--blue-pale)",
                  )}
                >
                  {row.name}
                </span>
                <span className="h-2.5 rounded-sm">
                  <span
                    className={cn(
                      "bar-fill block h-full origin-left rounded-sm",
                      "highlight" in row && row.highlight && "bg-white",
                      "market" in row && row.market && "border border-dashed border-white/70",
                      !("highlight" in row) && !("market" in row) && "bg-(--blue-pale)/35",
                    )}
                    style={{ width: `${(row.value / PEER_MAX) * 100}%` }}
                  />
                </span>
                <span className="text-right tabular-nums">{fmt(row.value)}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-14 max-w-3xl font-serif text-xl leading-relaxed md:text-2xl">
          {money.honest}
        </p>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-(--blue-pale)">
          {money.footnote}
          <Cites ids={money.sources} onBlue />
        </p>
      </div>
    </section>
  );
}
