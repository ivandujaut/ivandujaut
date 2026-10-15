import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { readers, sources, type SourceId } from "../zubale.data";
import { Reveal } from "./reveal";

interface TramoProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Fondo levemente más oscuro, para separar tramos sin líneas. */
  deep?: boolean;
}

/**
 * Un tramo de la página: mismo contenedor y mismo aire para todos. El
 * contenido marcado con `.reveal` entra con el scroll (ver `Reveal`).
 */
export function Tramo({ id, children, className, deep }: TramoProps) {
  return (
    <section id={id} className={cn("relative", deep && "bg-(--surface-deep)", className)}>
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-20 md:px-10 md:py-24">{children}</Reveal>
    </section>
  );
}

interface HeadingProps {
  index: string;
  eyebrow: string;
  children: ReactNode;
  /** Título más chico, para tramos fijos que tienen que entrar en una pantalla. */
  compact?: boolean;
  className?: string;
}

/** Título de tramo: número, rótulo y el título en una línea de lectura cómoda. */
export function TramoHeading({ index, eyebrow, children, compact, className }: HeadingProps) {
  return (
    <header className={cn("reveal max-w-3xl", className)}>
      <p className="mono text-xs tracking-widest text-(--ink-dim) uppercase">
        {index} <span aria-hidden>·</span> {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight",
          compact ? "md:text-4xl" : "md:text-5xl",
        )}
      >
        {children}
      </h2>
    </header>
  );
}

/** Marca de fuente: un rótulo chico que lleva al documento original. */
export function Cite({ id, label }: { id: SourceId; label?: string }) {
  return (
    <a
      href={sources[id]}
      target="_blank"
      rel="noopener noreferrer"
      className="mono ml-1 align-baseline text-xs text-(--ink-faint) underline decoration-dotted underline-offset-2 transition-colors hover:text-(--ink)"
    >
      {label ?? "fuente"}
    </a>
  );
}

/** Varias fuentes seguidas: "fuente 1 fuente 2". */
export function Cites({ ids }: { ids: SourceId[] }) {
  return (
    <>
      {ids.map((id, i) => (
        <Cite key={id} id={id} label={ids.length > 1 ? `fuente ${i + 1}` : undefined} />
      ))}
    </>
  );
}

export function ExampleBadge({ children }: { children: ReactNode }) {
  return (
    <span className="mono inline-block rounded-sm border border-dashed border-(--ink-faint) px-2 py-0.5 text-xs tracking-wide text-(--ink-dim) uppercase">
      {children}
    </span>
  );
}

/**
 * Rótulo de cada lector: un punto del color de su acento y el nombre. `label`
 * nombra al lector concreto de un tramo (el sistema del súper, el agente del
 * comprador) sin cambiar el color, que es lo que sostiene la gramática.
 */
export function ReaderLabel({
  who,
  label,
  className,
}: {
  who: "person" | "agent";
  label?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-xs font-medium tracking-wide uppercase",
        who === "person" ? "text-(--person-ink)" : "mono text-(--agent-ink)",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-2 rounded-full",
          who === "person" ? "bg-(--person)" : "bg-(--agent)",
        )}
      />
      {label ?? readers[who]}
    </p>
  );
}

/** Separador entre las dos partes de la página. */
export function PartDivider({
  label,
  title,
  note,
}: {
  label: string;
  title: string;
  note: string;
}) {
  return (
    <section className="relative bg-(--navy) text-white">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-16 md:px-10 md:py-20">
        <p className="reveal mono text-xs tracking-widest text-(--mint) uppercase">{label}</p>
        <h2 className="reveal mt-3 text-4xl font-semibold tracking-tight md:text-6xl">{title}</h2>
        <p className="reveal mt-6 max-w-2xl text-lg text-white/75">{note}</p>
      </Reveal>
    </section>
  );
}
