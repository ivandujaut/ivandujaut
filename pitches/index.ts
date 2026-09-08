import type { Pitch } from "./types";
import { lebane } from "./lebane";

/**
 * Registro de piezas privadas. Para sumar una empresa: copiar `_plantilla.ts`
 * a `<slug>.ts`, completar los TODO y agregarla acá. La URL queda en
 * `/pitch/<slug>` (y se puede acortar con un rewrite en `next.config.ts`,
 * como `/lebane`). Ninguna entra al sitemap ni a la navegación.
 */
export const pitches: Record<string, Pitch> = {
  lebane,
};

export function getPitch(slug: string): Pitch | undefined {
  return pitches[slug];
}

export type { Pitch } from "./types";
export { collectSources } from "./types";
