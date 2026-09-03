import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  ref?: Ref<HTMLElement>;
  className?: string;
  children: ReactNode;
}

/** Cada sección tiene `id` estable para deep-links y el mismo ancho de lectura. */
export function Section({ id, ref, className, children }: SectionProps) {
  return (
    <section
      id={id}
      ref={ref}
      className={cn("mx-auto w-full max-w-5xl scroll-mt-8 px-6 py-24 md:py-32", className)}
    >
      {children}
    </section>
  );
}

interface HeadingProps {
  /** "01", "02"... Se imprime enorme y casi invisible detrás del título. */
  index?: string;
  eyebrow: string;
  children: ReactNode;
  className?: string;
}

export function SectionHeading({ index, eyebrow, children, className }: HeadingProps) {
  return (
    <header className={cn("relative max-w-3xl", className)}>
      {index ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 -left-3 font-serif text-[6rem] leading-none font-semibold text-foreground/[0.05] select-none md:-top-16 md:-left-6 md:text-[9rem]"
        >
          {index}
        </span>
      ) : null}
      <p className="relative font-mono text-xs tracking-widest text-(--lebane-accent) uppercase">
        {index ? (
          <>
            {index} <span aria-hidden>·</span>{" "}
          </>
        ) : null}
        {eyebrow}
      </p>
      <h2 className="relative mt-4 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
        {children}
      </h2>
    </header>
  );
}
