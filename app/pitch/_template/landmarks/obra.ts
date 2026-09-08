import type { LandmarkSet } from "./types";

/** Cosas de una construcción: la misma familia que el skyline de la portada. */
export const obra: LandmarkSet = {
  // Cuatro saltos: una escalera de obra con cuatro peldaños.
  timeline: {
    paths: ["M22 94 V10", "M22 30 H70 M22 50 H70 M22 70 H70 M22 90 H70", "M70 94 V6"],
    start: { x: 22, y: 94 },
    end: { x: 70, y: 6 },
  },
  // El producto, módulo sobre módulo: una pared de ladrillos.
  "product-map": {
    paths: [
      "M8 92 H92 V72 H8 Z",
      "M8 72 V52 H92 V72 M50 52 V72",
      "M18 52 V32 H82 V52 M30 72 V92 M70 72 V92",
      "M30 32 V52 M70 32 V52 M50 12 H50 M40 32 V14 H60 V32",
    ],
    start: { x: 8, y: 92 },
    end: { x: 60, y: 32 },
  },
  // La tesis: un edificio en obra, con andamio y la puerta en planta baja.
  thesis: {
    paths: [
      "M14 92 V24 H86 V92",
      "M14 46 H86 M14 68 H86",
      "M26 24 V12 H74 V24",
      "M42 92 V76 H58 V92 H92",
    ],
    start: { x: 14, y: 92 },
    end: { x: 92, y: 92 },
  },
  // Por qué puede: el plano de la obra, desenrollado.
  why: {
    paths: [
      "M12 22 H80 V84 H12 Z",
      "M80 22 a8 8 0 0 1 8 8 V78 a8 8 0 0 1 -8 8",
      "M24 40 H68 M24 54 H68 M24 68 H50 M46 40 V68",
    ],
    start: { x: 12, y: 22 },
    end: { x: 46, y: 68 },
  },
  // El caso: un nivel de burbuja; medir antes de prestar.
  case: {
    paths: [
      "M6 62 H94 V78 H6 Z",
      "M38 62 V42 H62 V62",
      "M44 52 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0",
      "M6 70 H94",
    ],
    start: { x: 6, y: 62 },
    end: { x: 94, y: 70 },
  },
  // Por qué yo: el casco.
  proofs: {
    paths: [
      "M12 66 H88",
      "M18 66 C18 30 40 20 50 20 C60 20 82 30 82 66",
      "M50 20 V40 M40 26 V44 M60 26 V44",
      "M8 66 a6 6 0 0 0 6 6 H86 a6 6 0 0 0 6 -6",
    ],
    start: { x: 12, y: 66 },
    end: { x: 92, y: 66 },
  },
  // El cierre: la puerta, abierta.
  close: {
    paths: [
      "M16 92 V12 H84 V92",
      "M28 92 V22 L68 12 V82 Z",
      "M58 48 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
    ],
    start: { x: 16, y: 92 },
    end: { x: 64, y: 48 },
  },
};
