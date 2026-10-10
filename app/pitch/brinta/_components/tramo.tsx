import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";
import type { SourceId } from "../brinta.data";
import { sources } from "../brinta.data";
import { Spine, type SpineVariant } from "./spine";

interface TramoProps {
  id?: string;
  ref?: Ref<HTMLElement>;
  children: ReactNode;
  spine?: SpineVariant;
  /**
   * Tramo que se fija en escritorio (pin de GSAP, como en Lebane): ocupa
   * exactamente una pantalla, con el contenido centrado y menos aire, para que
   * los pasos y la escena se vean juntos mientras el scroll los recorre.
   */
  pinned?: boolean;
  /** Tramo que continúa al anterior: sin aire arriba, para que se lea como uno. */
  continues?: boolean;
  className?: string;
}

/**
 * Un tramo de la página. Todos comparten el mismo contenedor y el mismo carril
 * a la izquierda, así la cinta queda a la misma altura de pantalla en todos.
 * Van pegados (sin margen entre tramos) para que la cinta no se corte; el
 * aire va adentro, como padding.
 */
export function Tramo({
  id,
  ref,
  children,
  spine = "run",
  pinned,
  continues,
  className,
}: TramoProps) {
  return (
    <section id={id} ref={ref} className={cn("relative", pinned && "md:h-svh", className)}>
      <div className={cn("relative mx-auto w-full max-w-6xl", pinned && "md:h-full")}>
        <Spine variant={spine} animateOn={pinned ? "mobile" : "always"} />
        <div
          className={cn(
            "relative pr-5 pl-16 md:pr-10 md:pl-28",
            pinned
              ? "py-20 md:flex md:h-full md:flex-col md:justify-center md:py-10"
              : "py-20 md:py-28",
            continues && "pt-0 md:pt-0",
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

interface HeadingProps {
  index: string;
  eyebrow: string;
  children: ReactNode;
  /** Título más chico para los tramos fijos, que tienen que entrar en una pantalla. */
  compact?: boolean;
  className?: string;
}

/** Título de tramo: número de asiento, rótulo y la doble raya de los totales. */
export function TramoHeading({ index, eyebrow, children, compact, className }: HeadingProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <p className="num text-xs tracking-widest text-(--trapped-ink) uppercase">
        {index} <span aria-hidden>·</span> {eyebrow}
      </p>
      <h2
        className={cn(
          "double-rule mt-4 pb-5 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance",
          compact ? "md:pb-4 md:text-[2.25rem]" : "md:text-[2.75rem]",
        )}
      >
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
