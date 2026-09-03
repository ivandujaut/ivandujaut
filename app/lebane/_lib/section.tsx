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
  eyebrow: string;
  children: ReactNode;
  className?: string;
}

export function SectionHeading({ eyebrow, children, className }: HeadingProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <p className="font-mono text-xs tracking-widest text-(--lebane-accent) uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
        {children}
      </h2>
    </header>
  );
}
