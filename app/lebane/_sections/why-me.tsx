"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { Section, SectionHeading } from "../_lib/section";
import { proofs } from "../lebane.data";

/** Tres tarjetas que giran sobre el eje Y al entrar. En mobile, apiladas. */
export function WhyMe() {
  const ref = useGsapSection<HTMLElement>(({ root, q }) => {
    gsap.from(q(".card"), {
      rotateY: -60,
      opacity: 0,
      transformOrigin: "left center",
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: { trigger: root, start: "top 65%", toggleActions: "play none none none" },
    });
  });

  return (
    <Section id="why-me" ref={ref}>
      <SectionHeading eyebrow="06 · Por qué yo">
        Tres cosas que ya hice y que este caso necesita
      </SectionHeading>

      <ol className="mt-14 grid gap-5 [perspective:1400px] md:mt-20 md:grid-cols-3">
        {proofs.map((p) => (
          <li
            key={p.id}
            className="card flex flex-col rounded-2xl border border-(--lebane-line) bg-card/60 p-6 md:p-7"
          >
            <p className="font-mono text-xs tracking-widest text-(--lebane-ink-dim) uppercase">
              {p.title}
            </p>
            <p className="mt-5 font-serif text-3xl leading-tight font-semibold text-balance md:text-4xl">
              {p.number}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-(--lebane-ink-dim)">{p.line}</p>
            <p className="mt-4 text-base leading-snug font-medium">{p.proves}</p>
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <Link
                href={p.href}
                className="inline-flex items-center gap-1.5 text-sm text-(--lebane-accent) underline-offset-4 hover:underline"
              >
                {p.hrefLabel}
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} aria-hidden />
              </Link>
              {p.secondary ? (
                <Link
                  href={p.secondary.href}
                  className="inline-flex items-center gap-1.5 text-sm text-(--lebane-ink-dim) underline-offset-4 hover:underline"
                >
                  {p.secondary.label}
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
