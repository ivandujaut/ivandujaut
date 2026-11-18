import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ListRowProps extends Omit<ComponentProps<typeof Link>, "className" | "children"> {
  children: ReactNode;
  /**
   * `block` deja que el contenido se acomode solo; `row` alinea en una fila
   * con separación, para las filas que llevan una miniatura al costado;
   * `card` es la tarjeta de una grilla, que no lleva el fondo del hover
   * porque el que responde ahí es la portada.
   */
  layout?: "block" | "row" | "card";
  className?: string;
}

/**
 * Una fila clickeable de un listado: los casos, los posts, el casebook, la
 * investigación y el trabajo publicado de la home.
 *
 * El `-mx-3 px-3` es lo que hace que el fondo del hover sobresalga de la
 * columna de texto en vez de recortarse contra ella. Es la parte que más fácil
 * se copia mal, y estaba escrita siete veces.
 *
 * El `group` se queda acá porque los hijos lo usan (`group-hover:`) y si se
 * perdiera en una fila, el título de esa fila dejaría de responder al hover sin
 * que nada se rompa a la vista.
 */
export function ListRow({ children, layout = "block", className, ...props }: ListRowProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group",
        layout === "card"
          ? "block"
          : "-mx-3 rounded-lg px-3 py-4 transition-colors hover:bg-muted/40",
        layout === "row" && "flex items-center gap-4",
        layout === "block" && "block",
        className,
      )}
    >
      {children}
    </Link>
  );
}
