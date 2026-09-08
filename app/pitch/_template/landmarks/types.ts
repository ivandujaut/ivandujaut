export type Pt = { x: number; y: number };

/**
 * Figura de trazo continuo en una caja de 100x100. Arranca en `start` (por
 * donde llega la línea) y termina en `end` (por donde se va), para que el hilo
 * entre, la dibuje y siga de largo. Los `paths` se dibujan en orden.
 */
export interface Landmark {
  paths: string[];
  start: Pt;
  end: Pt;
}

/** Una figura por sección, en el orden de la página (sin la portada). */
export type LandmarkSet = Record<string, Landmark>;
