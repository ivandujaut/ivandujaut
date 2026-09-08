import type { ComponentType } from "react";

/**
 * De dónde nace el hilo conductor dentro de la ilustración de la portada.
 * Coordenadas en el `viewBox` de la ilustración: `x` es la vertical por la que
 * baja el cable, `from` donde arranca y `to` donde termina al cargar. El hilo
 * lo dibuja `cableAt` segundos después de montar, cuando la ilustración llegó
 * a ese punto, y tarda `cableDuration`.
 */
export interface ThreadStart {
  viewBox: [number, number];
  x: number;
  from: number;
  to: number;
  cableAt: number;
  cableDuration: number;
}

export interface Illustration {
  /**
   * SVG con `data-illustration` en la raíz. Sus trazos llevan la clase `sky`
   * (se dibujan escalonados al cargar) y los rellenos `sky-fill` (aparecen al
   * final). Sin cable ni gancho: eso lo dibuja el hilo.
   */
  Component: ComponentType;
  thread: ThreadStart;
}
