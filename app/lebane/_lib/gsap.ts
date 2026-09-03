import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Un solo lugar registra el plugin: cada sección importa `gsap` de acá y no
// del paquete, así ninguna se olvida de ScrollTrigger ni lo registra dos veces.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Breakpoint de `md` en Tailwind: por debajo, las secciones pinneadas se degradan. */
export const DESKTOP_QUERY = "(min-width: 768px)";
export const MOBILE_QUERY = "(max-width: 767px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
