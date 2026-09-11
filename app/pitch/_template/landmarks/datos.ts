import type { LandmarkSet } from "./types";

/** Cosas de un hub de datos clínicos: la misma familia que la portada. */
export const datos: LandmarkSet = {
  // La trayectoria: tres barras que suben y una flecha al final.
  timeline: {
    paths: [
      "M8 92 H92",
      "M14 92 V70 H30 V92",
      "M38 92 V54 H54 V92",
      "M62 92 V34 H78 V92",
      "M82 30 L92 20 M84 20 H92 V28",
    ],
    start: { x: 8, y: 92 },
    end: { x: 92, y: 20 },
  },
  // El producto, capa sobre capa: una base de datos.
  "product-map": {
    paths: [
      "M20 26 a30 8 0 1 0 60 0 a30 8 0 1 0 -60 0",
      "M20 26 V74",
      "M20 50 a30 8 0 0 0 60 0",
      "M20 74 a30 8 0 0 0 60 0",
      "M80 74 V26",
    ],
    start: { x: 20, y: 26 },
    end: { x: 80, y: 26 },
  },
  // La tesis: el hospital, que es la fuente.
  thesis: {
    paths: [
      "M14 92 V30 H86 V92",
      "M14 54 H86 M14 74 H86",
      "M30 30 V22 H70 V30",
      "M42 92 V78 H58 V92",
      "M50 8 V20 M44 14 H56",
    ],
    start: { x: 14, y: 92 },
    end: { x: 56, y: 14 },
  },
  // Por qué puede: el escudo con la tilde, consentimiento y anonimización.
  why: {
    paths: [
      "M50 10 L84 22 V50 C84 72 68 86 50 92 C32 86 16 72 16 50 V22 Z",
      "M34 50 L46 62 L68 38",
    ],
    start: { x: 50, y: 10 },
    end: { x: 68, y: 38 },
  },
  // El caso: el indicador, medir antes de vender.
  case: {
    paths: [
      "M14 70 A36 36 0 0 1 86 70",
      "M22 54 L28 57 M50 34 V41 M78 54 L72 57",
      "M50 70 L70 46",
      "M46 70 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
      "M8 78 H92",
    ],
    start: { x: 14, y: 70 },
    end: { x: 92, y: 78 },
  },
  // Por qué yo: el microscopio.
  proofs: {
    paths: [
      "M20 90 H80",
      "M46 90 V72 C46 62 36 58 36 46 V28 H48 V20 H36",
      "M30 66 H64",
      "M36 46 H56 V58",
    ],
    start: { x: 20, y: 90 },
    end: { x: 56, y: 58 },
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
