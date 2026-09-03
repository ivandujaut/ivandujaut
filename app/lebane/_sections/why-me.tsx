"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { Section, SectionHeading } from "../_lib/section";
import { proofs } from "../lebane.data";

function ProofLink({ href, children, dim }: { href: string; children: string; dim?: boolean }) {
  const cls = `inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline ${
    dim ? "text-(--lebane-ink-dim)" : "text-(--lebane-accent)"
  }`;
  const icon = <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} aria-hidden />;
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {icon}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {icon}
    </Link>
  );
}

/**
 * Tres tarjetas que giran sobre el eje Y al entrar. En desktop se disparan
 * juntas; en mobile, apiladas, cada una gira con el scroll.
 */
export function WhyMe() {
  const ref = useGsapSection<HTMLElement>(({ root, q, isDesktop }) => {
    const cards = q(".card");
    if (isDesktop) {
      gsap.from(cards, {
        rotateY: -60,
        opacity: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: { trigger: root, start: "top 65%", toggleActions: "play none none none" },
      });
      return;
    }
    cards.forEach((card) => {
      gsap.from(card, {
        rotateY: -50,
        opacity: 0,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: card, start: "top 95%", end: "top 55%", scrub: 0.4 },
      });
    });
  });

  return (
    <Section id="why-me" ref={ref}>
      <SectionHeading index="06" eyebrow="Por qué yo">
        Tres cosas que ya hice y que este caso necesita
      </SectionHeading>

      <ol className="mt-14 grid gap-5 [perspective:1400px] md:mt-20 md:grid-cols-3">
        {proofs.map((p, i) => (
          <li
            key={p.id}
            className="card relative flex flex-col overflow-hidden rounded-2xl border border-(--lebane-line) bg-card/60 p-6 md:p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-4 -right-2 font-serif text-[6rem] leading-none font-semibold text-foreground/[0.05] select-none"
            >
              {i + 1}
            </span>
            <p className="font-mono text-xs tracking-widest text-(--lebane-ink-dim) uppercase">
              {p.title}
            </p>
            <p className="mt-5 font-serif text-3xl leading-tight font-semibold text-balance md:text-4xl">
              {p.number}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-(--lebane-ink-dim)">{p.line}</p>
            <p className="mt-4 text-base leading-snug font-medium">{p.proves}</p>
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <ProofLink href={p.href}>{p.hrefLabel}</ProofLink>
              {p.secondary ? (
                <ProofLink href={p.secondary.href} dim>
                  {p.secondary.label}
                </ProofLink>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
