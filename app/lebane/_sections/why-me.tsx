"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { gsap } from "../_lib/gsap";
import { useGsapSection } from "../_lib/use-gsap-section";
import { Section, SectionHeading } from "../_lib/section";
import { proofs } from "../lebane.data";

function Anchor({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * Tres tarjetas con la misma anatomía: kicker, cifra en un renglón, qué es,
 * qué prueba, y un solo CTA. En desktop cada fila interna es una fila de
 * subgrid, así los cuatro bloques quedan alineados entre tarjetas aunque
 * el texto de una sea más largo. Giran sobre el eje Y al entrar; en mobile,
 * apiladas, cada una gira con el scroll.
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
            className="card relative grid grid-rows-[auto_auto_auto_1fr_auto] gap-y-4 overflow-hidden rounded-2xl border border-(--lebane-line) bg-card/60 p-6 md:row-span-5 md:grid-rows-subgrid md:p-7"
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
            <p className="font-serif text-3xl leading-none font-semibold whitespace-nowrap md:text-4xl">
              {p.number}
            </p>
            <p className="text-sm leading-relaxed text-(--lebane-ink-dim)">{p.line}</p>
            <p className="text-base leading-snug font-medium">
              {p.proves}
              {p.note ? (
                <span className="mt-2 block text-sm font-normal text-(--lebane-ink-dim)">
                  {p.note.before}
                  <Anchor
                    href={p.note.href}
                    className="underline decoration-(--lebane-line) underline-offset-4 hover:text-foreground"
                  >
                    {p.note.label}
                  </Anchor>
                  .
                </span>
              ) : null}
            </p>
            <div className="pt-2">
              <Anchor
                href={p.href}
                className="inline-flex items-center gap-1.5 text-sm text-(--lebane-accent) underline-offset-4 hover:underline"
              >
                {p.hrefLabel}
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} aria-hidden />
              </Anchor>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
