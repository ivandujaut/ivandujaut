"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { proofs as data } from "../brinta.data";
import { gsap } from "../../_template/lib/gsap";
import { useGsapSection } from "../../_template/lib/use-gsap-section";
import { Tramo, TramoHeading } from "../_components/tramo";

/** 07 · Por qué yo. Tres pruebas, cada una con lo que demuestra para este camino. */
export function Proofs() {
  const ref = useGsapSection<HTMLDivElement>(({ q }) => {
    gsap.from(q(".pr-card"), {
      opacity: 0,
      y: 22,
      stagger: 0.15,
      ease: "none",
      scrollTrigger: { trigger: q(".pr-list")[0], start: "top 92%", end: "top 65%", scrub: 0.4 },
    });
  });

  return (
    <Tramo id="pruebas">
      <div ref={ref}>
        <TramoHeading index={data.index} eyebrow={data.eyebrow}>
          {data.heading}
        </TramoHeading>

        <ul className="pr-list mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {data.items.map((item) => (
            <li
              key={item.id}
              className="pr-card flex flex-col rounded-md border border-(--rule) bg-(--paper-deep) p-5 md:p-6"
            >
              <p className="num text-xs tracking-widest text-(--ink-dim) uppercase">{item.title}</p>
              <p className="num mt-3 text-2xl text-(--ink) md:text-3xl">{item.number}</p>
              <p className="mt-3 text-base leading-relaxed text-(--ink-dim)">{item.line}</p>
              <p className="mt-4 text-base font-semibold">{item.proves}</p>
              <Link
                href={item.href}
                data-ph="proof_click"
                data-ph-kind={item.id}
                data-ph-surface="brinta-proofs"
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm text-(--trapped-ink) underline-offset-4 hover:underline"
              >
                {item.hrefLabel}
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Tramo>
  );
}
