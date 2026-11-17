import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { labels, readings, sources, type SourceId } from "../despegar.data";
import { Reveal } from "./reveal";

interface TramoProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Fondo lavanda, para separar tramos sin líneas. */
  deep?: boolean;
  /** Fondo violeta noche, para los dos tramos que cambian el ritmo. */
  night?: boolean;
}

/** Un tramo de la página: mismo contenedor y mismo aire para todos. */
export function Tramo({ id, children, className, deep, night }: TramoProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-4",
        deep && "bg-(--surface-deep)",
        night && "bg-(--night) text-white",
        className,
      )}
    >
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 md:px-10 md:py-28">{children}</Reveal>
    </section>
  );
}

interface HeadingProps {
  index: string;
  eyebrow: string;
  children: ReactNode;
  night?: boolean;
  className?: string;
}

/** Título de tramo: número, rótulo y el título en una línea de lectura cómoda. */
export function TramoHeading({ index, eyebrow, children, night, className }: HeadingProps) {
  return (
    <header className={cn("reveal max-w-3xl", className)}>
      <p
        className={cn("text-sm font-medium tabular", night ? "text-white/70" : "text-(--seen-ink)")}
      >
        {index} <span aria-hidden>·</span> {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
        {children}
      </h2>
    </header>
  );
}

/** Marca de fuente: un rótulo chico que lleva al documento original. */
export function Cite({ id, label, night }: { id: SourceId; label?: string; night?: boolean }) {
  return (
    <a
      href={sources[id]}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mono ml-1 align-baseline text-xs underline decoration-dotted underline-offset-2 transition-colors",
        night ? "text-white/60 hover:text-white" : "text-(--ink-dim) hover:text-(--ink)",
      )}
    >
      {label ?? labels.source}
    </a>
  );
}

/** Varias fuentes seguidas: "fuente 1 fuente 2". */
export function Cites({ ids, night }: { ids: SourceId[]; night?: boolean }) {
  return (
    <>
      {ids.map((id, i) => (
        <Cite
          key={id}
          id={id}
          night={night}
          label={ids.length > 1 ? `${labels.source} ${i + 1}` : undefined}
        />
      ))}
    </>
  );
}

/** Rótulo de lo inventado para la maqueta. Siempre visible, siempre punteado. */
export function ExampleBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-sm border border-dashed border-(--ink-faint) px-2 py-0.5 text-xs text-(--ink-dim)">
      {children}
    </span>
  );
}

/** Rótulo de cuenta propia: el número sale de datos públicos, la cuenta es mía. */
export function InferenceBadge() {
  return (
    <span className="inline-block text-xs font-medium text-(--seen-ink)">{labels.inference}</span>
  );
}

/** Las dos lecturas del mismo vuelo: un punto del color de su acento y el nombre. */
export function ReadingLabel({ which, className }: { which: "seen" | "paid"; className?: string }) {
  return (
    <p
      className={cn(
        "mono flex items-center gap-2 text-xs tracking-wide uppercase",
        which === "seen" ? "text-(--seen-ink)" : "text-(--paid-ink)",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-2 rounded-full",
          which === "seen" ? "bg-(--seen)" : "bg-(--paid)",
        )}
      />
      {readings[which]}
    </p>
  );
}

/** Texto en párrafo con ancho de lectura. */
export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)", className)}>
      {children}
    </p>
  );
}
