import type { ReactNode } from "react";

interface ThesisProps {
  children: ReactNode;
}

/**
 * Bloque destacado para la tesis central de un caso de estudio.
 *
 * Es el tratamiento opuesto al blockquote (que renderiza en gris e itálica,
 * como cita al margen): tinta primaria, serif y borde de acento, para que la
 * afirmación más importante del texto sea también la más visible. No usa
 * Callout a propósito: esa caja está reservada para avisos y salvedades.
 */
export function Thesis({ children }: ThesisProps) {
  return (
    <blockquote className="my-10 border-l-4 border-foreground pl-6 font-serif text-xl leading-relaxed text-foreground [&_p]:my-0">
      {children}
    </blockquote>
  );
}
