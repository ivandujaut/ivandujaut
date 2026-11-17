import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  /**
   * El tag que se renderiza. Por defecto `p`, pero muchos usos son un `div`
   * que envuelve varias piezas, o un `span` dentro de una línea.
   */
  as?: ElementType;
  /** Margen y cualquier ajuste puntual. Se mergea, no pisa. */
  className?: string;
}

/**
 * El rótulo chico en monoespaciada, mayúsculas y espaciado: "CASO DE ESTUDIO",
 * "TRES MINUTOS DE LECTURA", "ÚLTIMO ANÁLISIS".
 *
 * Existe porque estas mismas cinco clases estaban escritas veintiséis veces en
 * trece archivos, y habían derivado a cuatro tamaños distintos: `text-xs` en
 * veintiuno, `text-[11px]` en dos y `text-[0.7rem]` en cuatro. Nadie eligió
 * esos tres tamaños: se fueron copiando con variaciones. Acá hay uno solo.
 *
 * Lo único que cambiaba de verdad entre un uso y otro era el margen, así que
 * eso es lo que queda en `className`.
 */
export function Eyebrow({ children, as: Tag = "p", className }: EyebrowProps) {
  return <Tag className={cn(eyebrowClass, className)}>{children}</Tag>;
}

/**
 * Las mismas clases, para el puñado de lugares que necesitan el string y no el
 * componente: una variable que se arma antes del JSX, o un elemento que ya
 * existe y al que sólo hay que darle esta pinta.
 *
 * Preferir el componente. Esto está para que nadie tenga que volver a escribir
 * las cinco clases a mano cuando el componente no entra.
 */
export const eyebrowClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";
