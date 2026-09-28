import { HugeiconsIcon } from "@hugeicons/react";
import { BankIcon, Store01Icon, UserIcon } from "@hugeicons/core-free-icons";

/**
 * Íconos para usar *adentro* de un `<svg>` de `<Diagram>`.
 *
 * Existen porque un archivo MDX no puede importar nada: sin esto, un diagrama
 * que quiera un ícono del set del sitio tiene que copiar sus paths a mano, que
 * es lo que se hizo primero en el caso de Visa y quedó a mitad de camino entre
 * un ícono y un garabato.
 *
 * Cada uno se dibuja centrado en el origen, así se ubica con el mismo
 * `translate` que el nodo al que pertenece: `<g transform="translate(120 116)">`
 * pone el círculo y el ícono en el mismo lugar sin cuentas.
 *
 * Son `<svg>` anidados dentro del `<svg>` del diagrama, que es válido y hereda
 * `currentColor`, así que el color lo decide el nodo padre.
 */
interface DiagramIconProps {
  /** Lado del ícono en unidades del `viewBox`, no en píxeles de pantalla. */
  size?: number;
}

function centered(icon: typeof UserIcon, size: number) {
  return (
    <g transform={`translate(${-size / 2} ${-size / 2})`}>
      <HugeiconsIcon icon={icon} size={size} strokeWidth={1.8} aria-hidden />
    </g>
  );
}

export function IconTitular({ size = 40 }: DiagramIconProps) {
  return centered(UserIcon, size);
}

export function IconComercio({ size = 40 }: DiagramIconProps) {
  return centered(Store01Icon, size);
}

export function IconBanco({ size = 40 }: DiagramIconProps) {
  return centered(BankIcon, size);
}
