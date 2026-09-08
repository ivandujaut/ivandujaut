"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import type { Pitch } from "@/pitches/types";
import { gsap } from "../lib/gsap";
import { useGsapSection } from "../lib/use-gsap-section";
import { Section, SectionHeading } from "../lib/section";

function ProofLink({ href, children }: { href: string; children: string }) {
  const cls =
    "inline-flex items-center gap-1.5 text-sm text-(--pitch-accent) underline-offset-4 hover:underline";
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

interface ProofsProps {
  index: string;
  data: Pitch["proofs"];
}

/**
 * Tarjetas con la misma anatomía (kicker, cifra en un renglón, qué es, qué
 * prueba, un CTA). En desktop las filas internas son un subgrid, así los
 * bloques quedan a la misma altura entre tarjetas. Giran sobre el eje Y al
 * entrar; en mobile, apiladas, cada una gira con el scroll.
 */
export function Proofs({ index, data }: ProofsProps) {
  const ref = useGsapSection<HTMLElement>(
    ({ root, q, isDesktop }) => {
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
    },
    [data],
  );

  const cols = data.items.length;

  return (
    <Section id="proofs" ref={ref}>
      <SectionHeading index={index} eyebrow={data.eyebrow}>
        {data.heading}
      </SectionHeading>

      <ol
        className="mt-14 grid gap-5 [perspective:1400px] md:mt-20 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
        style={{ "--cols": cols } as CSSProperties}
      >
        {data.items.map((p, i) => (
          <li
            key={p.id}
            className="card relative flex flex-col overflow-hidden rounded-2xl border border-(--pitch-line) bg-card/60 p-6 md:row-span-5 md:grid md:grid-rows-subgrid md:gap-0 md:p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-4 -right-2 font-serif text-[6rem] leading-none font-semibold text-foreground/[0.05] select-none"
            >
              {i + 1}
            </span>
            <p className="font-mono text-xs tracking-widest text-(--pitch-ink-dim) uppercase">
              {p.title}
            </p>
            <p className="mt-5 font-serif text-3xl leading-none font-semibold whitespace-nowrap md:text-4xl">
              {p.number}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-(--pitch-ink-dim)">{p.line}</p>
            <p className="mt-4 text-base leading-snug font-medium">
              {p.proves}
              {p.note ? (
                <span className="mt-2 block text-sm font-normal text-(--pitch-ink-dim)">
                  {p.note.before}
                  <Link
                    href={p.note.href}
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    {p.note.linkText}
                  </Link>
                  {p.note.after}
                </span>
              ) : null}
            </p>
            <div className="mt-auto pt-6 md:self-end">
              <ProofLink href={p.href}>{p.hrefLabel}</ProofLink>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
