import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import {
  sources,
  stamp,
  treatmentShort,
  treatmentStatus,
  type SourceId,
  type Ticket,
} from "../lacaja.data";
import { Reveal } from "./reveal";

interface TramoProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Fondo gris de las franjas del sitio de La Caja, para separar tramos sin líneas. */
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
  /** Para los tramos sobre azul. */
  onBlue?: boolean;
  className?: string;
}

/** Título de tramo: número y rótulo en rojo, título en Caslon. */
export function TramoHeading({ index, eyebrow, children, onBlue, className }: HeadingProps) {
  return (
    <header className={cn("reveal max-w-3xl", className)}>
      <p className={cn("label", onBlue ? "text-(--blue-pale)" : "text-(--red)")}>
        {index} <span aria-hidden>·</span> {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl md:leading-[1.1]">
        {children}
      </h2>
    </header>
  );
}

/** Marca de fuente: un rótulo chico que lleva al documento original. */
export function Cite({ id, label, onBlue }: { id: SourceId; label?: string; onBlue?: boolean }) {
  return (
    <a
      href={sources[id]}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mono ml-1 align-baseline text-xs underline decoration-dotted underline-offset-2 transition-colors",
        onBlue ? "text-(--blue-pale) hover:text-white" : "text-(--ink-muted) hover:text-(--ink)",
      )}
    >
      {label ?? "fuente"}
    </a>
  );
}

/** Varias fuentes seguidas: "fuente 1 fuente 2". */
export function Cites({ ids, onBlue }: { ids: SourceId[]; onBlue?: boolean }) {
  return (
    <>
      {ids.map((id, i) => (
        <Cite
          key={id}
          id={id}
          onBlue={onBlue}
          label={ids.length > 1 ? `fuente ${i + 1}` : undefined}
        />
      ))}
    </>
  );
}

export function ExampleBadge({ children }: { children: ReactNode }) {
  return (
    <span className="mono inline-block rounded-sm border border-dashed border-(--ink-faint) px-2 py-0.5 text-[0.6875rem] tracking-wide text-(--ink-muted) uppercase">
      {children}
    </span>
  );
}

const doneIcon = { solo: Tick02Icon, asiste: UserIcon, pregunta: HelpCircleIcon } as const;

interface TicketCardProps {
  ticket: Ticket;
  /**
   * `wait`: sólo la solicitud en espera (portada). `done`: sólo su destino.
   * `both`: las dos capas en la misma celda, para que el tramo 03 pase de una
   * a la otra; sin animación se ve el destino.
   */
  show?: "wait" | "done" | "both";
  /** Sin el detalle y con la etiqueta corta: para la bandeja chica del tramo 06. */
  compact?: boolean;
  className?: string;
}

/**
 * Una solicitud de la bandeja. Gris mientras espera; con destino, toma la
 * gramática de toda la página: azul si se cierra sola, borde azul si va a una
 * persona con el caso armado, borde rojo punteado si es una pregunta.
 */
export function TicketCard({ ticket, show = "both", compact, className }: TicketCardProps) {
  const t = ticket.treatment;
  const wait = (
    <div className="t-layer t-wait rounded-md border border-(--ticket-line) bg-(--surface) px-3 py-2.5">
      <p className="mono text-xs text-(--ink-muted)">{ticket.id}</p>
      <p className="mt-1 text-sm font-semibold">{ticket.kind}</p>
      {compact ? null : <p className="t-detail mt-0.5 text-sm text-(--ink-dim)">{ticket.detail}</p>}
      <p className="mt-2">
        <span className="stamp">{stamp}</span>
      </p>
    </div>
  );
  const done = (
    <div
      className={cn(
        "t-layer t-done rounded-md px-3 py-2.5",
        t === "solo" && "bg-(--blue) text-white",
        t === "asiste" && "border-[1.5px] border-(--blue) bg-(--surface)",
        t === "pregunta" && "border-[1.5px] border-dashed border-(--red) bg-(--surface)",
      )}
    >
      <p className={cn("mono text-xs", t === "solo" ? "text-(--blue-pale)" : "text-(--ink-muted)")}>
        {ticket.id}
      </p>
      <p className="mt-1 text-sm font-semibold">{ticket.kind}</p>
      {compact ? null : (
        <p
          className={cn("mt-0.5 text-sm", t === "solo" ? "text-(--blue-pale)" : "text-(--ink-dim)")}
        >
          {ticket.detail}
        </p>
      )}
      <p
        className={cn(
          "mono mt-2 flex items-center gap-1.5 text-xs font-medium",
          t === "solo" && "text-white",
          t === "asiste" && "text-(--blue)",
          t === "pregunta" && "text-(--red)",
        )}
      >
        <HugeiconsIcon icon={doneIcon[t]} size={14} strokeWidth={2} aria-hidden />
        {compact ? treatmentShort[t] : treatmentStatus[t]}
      </p>
    </div>
  );

  if (show === "wait") {
    return <div className={cn("ticket is-waiting", className)}>{wait}</div>;
  }
  if (show === "done") {
    return <div className={cn("ticket", className)}>{done}</div>;
  }
  return (
    <div className={cn("ticket", className)} data-treatment={t}>
      {wait}
      {done}
    </div>
  );
}
