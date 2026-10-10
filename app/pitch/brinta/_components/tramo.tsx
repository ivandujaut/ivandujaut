import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SourceId } from "../brinta.data";
import { sources } from "../brinta.data";
import { Spine, type SpineVariant } from "./spine";

interface TramoProps {
  id: string;
  children: ReactNode;
  /** `none` para la portada, que dibuja el arranque de la cinta por su cuenta. */
  spine?: SpineVariant | "none";
  className?: string;
}

/**
 * Un tramo de la página. Todos comparten el mismo contenedor y el mismo carril
 * a la izquierda, así la cinta queda a la misma altura de pantalla en todos.
 * Van pegados (sin margen entre tramos) para que la cinta no se corte; el
 * aire va adentro, como padding.
 */
export function Tramo({ id, children, spine = "run", className }: TramoProps) {
  return (
    <section id={id} className={cn("relative", className)}>
      <div className="relative mx-auto w-full max-w-6xl">
        {spine === "none" ? null : <Spine variant={spine} />}
        <div className="relative py-20 pr-5 pl-16 md:py-28 md:pr-10 md:pl-28">{children}</div>
      </div>
    </section>
  );
}

interface HeadingProps {
  index: string;
  eyebrow: string;
  children: ReactNode;
  className?: string;
}

/** Título de tramo: número de asiento, rótulo y la doble raya de los totales. */
export function TramoHeading({ index, eyebrow, children, className }: HeadingProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <p className="num text-xs tracking-widest text-(--trapped-ink) uppercase">
        {index} <span aria-hidden>·</span> {eyebrow}
      </p>
      <h2 className="double-rule mt-4 pb-5 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance md:text-[2.75rem]">
        {children}
      </h2>
    </header>
  );
}

/** Marca de fuente: un número chico que lleva al documento original. */
export function Cite({ id, label }: { id: SourceId; label?: string }) {
  return (
    <a
      href={sources[id]}
      target="_blank"
      rel="noopener noreferrer"
      className="num ml-1 align-baseline text-[0.7em] text-(--ink-faint) underline decoration-dotted underline-offset-2 hover:text-(--ink)"
    >
      {label ?? "fuente"}
    </a>
  );
}

export function ExampleBadge({ children }: { children: ReactNode }) {
  return (
    <span className="num inline-block rounded-sm border border-dashed border-(--ink-faint) px-2 py-0.5 text-[0.7rem] tracking-wide text-(--ink-dim) uppercase">
      {children}
    </span>
  );
}
