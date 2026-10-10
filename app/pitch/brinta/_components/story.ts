import { ScrollTrigger, gsap } from "../../_template/lib/gsap";

/**
 * Marca el paso activo de una escena fija y devuelve la timeline que la escena
 * recorre con el scroll. Cada paso ocupa un tramo igual de la timeline: la
 * escena llama a `tl.addLabel(step.id)` y anima a partir de ahí.
 */
export function storyTimeline(root: HTMLElement): gsap.core.Timeline {
  const steps = gsap.utils.toArray<HTMLElement>(".story-step", root);
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 66%",
      end: "bottom 66%",
      toggleClass: { targets: step, className: "is-active" },
    });
  });

  const list = root.querySelector(".story-steps");
  return gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: list,
      start: "top 62%",
      end: "bottom 75%",
      scrub: 0.5,
    },
  });
}

/** Prepara un path con `pathLength="1"` para dibujarlo de 0 a 1. */
export function drawFrom(
  tl: gsap.core.Timeline,
  targets: Element[] | Element,
  at: string | number,
  duration = 1,
) {
  // Las puntas redondeadas dejan un punto visible aunque el trazo mida cero:
  // la opacidad entra junto con el primer tramo del dibujo.
  tl.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: Math.min(0.05, duration) }, at);
  return tl.fromTo(
    targets,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration },
    at,
  );
}
