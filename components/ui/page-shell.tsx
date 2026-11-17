import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const WIDTHS = {
  /** La columna de lectura. Es la de casi todo el sitio. */
  reading: "max-w-2xl",
  /** Un poco más ancha, para lo que no es texto corrido (la vista del CV). */
  wide: "max-w-3xl",
} as const;

interface PageShellProps {
  children: ReactNode;
  /** `main` por defecto; `article` en las páginas que ya viven dentro de un `main`. */
  as?: ElementType;
  /**
   * Destino del salto al contenido. No tiene default a propósito: que un
   * componente inyecte un `id` en el DOM sin que se vea en el call site es
   * justo la clase de magia que después cuesta rastrear.
   */
  id?: string;
  width?: keyof typeof WIDTHS;
  /** Clases propias de la página: `paper`, `case-study`, un padding distinto. */
  className?: string;
}

/**
 * La caja que centra y respira, igual en todas las páginas del sitio.
 *
 * Existe porque `mx-auto max-w-2xl px-6 py-24` estaba escrito catorce veces,
 * una por ruta. Cambiar el ancho de la columna de lectura o el aire de arriba
 * eran catorce ediciones, y alcanzaba con olvidarse de una para que una página
 * quedara distinta sin que nadie lo notara.
 *
 * El ancho va por `width` y no por `className` a propósito: son dos medidas, no
 * cualquier medida. Si aparece una tercera, se agrega acá y se ve en un lugar
 * cuántas hay.
 */
export function PageShell({
  children,
  as: Tag = "main",
  id,
  width = "reading",
  className,
}: PageShellProps) {
  return (
    <Tag id={id} className={cn("mx-auto px-6 py-24", WIDTHS[width], className)}>
      {children}
    </Tag>
  );
}
