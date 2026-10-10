import { ScrollTrigger, gsap } from "../../_template/lib/gsap";

const DIM = 0.32;

interface Story {
  tl: gsap.core.Timeline;
  /** Enciende el paso `index` (y apaga el resto) en ese punto de la timeline. */
  activate: (index: number, at: string | number) => void;
}

/**
 * La timeline de una escena con pasos.
 *
 * Escritorio: el tramo se fija (`pin`) durante `pinScreens` pantallas de
 * scroll y la timeline corre con `scrub`, como las secciones de Lebane. Los
 * pasos los enciende la propia timeline, así el texto activo y el dibujo
 * avanzan juntos.
 *
 * Celular: sin pin. La timeline corre mientras los pasos pasan por debajo de
 * la escena, y cada paso se enciende al cruzar el tercio inferior.
 */
export function storyTimeline(root: HTMLElement, isDesktop: boolean, pinScreens = 2.6): Story {
  const steps = gsap.utils.toArray<HTMLElement>(".story-step", root);

  if (isDesktop) {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        pin: true,
        scrub: 0.6,
        start: "top top",
        end: () => `+=${window.innerHeight * pinScreens}`,
        invalidateOnRefresh: true,
        // Declarar la prioridad hace que ScrollTrigger ordene todo por posición
        // en cada refresh. Sin esto, los bloques que vienen debajo del tramo
        // fijo (que React monta antes que el pin) no sumarían el espacio del pin.
        refreshPriority: 0,
      },
    });
    tl.set(steps.slice(1), { opacity: DIM }, 0);
    const activate = (index: number, at: string | number) => {
      steps.forEach((step, j) => {
        tl.to(step, { opacity: j === index ? 1 : DIM, duration: 0.2 }, at);
      });
    };
    return { tl, activate };
  }

  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 66%",
      end: "bottom 66%",
      toggleClass: { targets: step, className: "is-active" },
    });
  });
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root.querySelector(".story-steps"),
      start: "top 62%",
      end: "bottom 75%",
      scrub: 0.5,
    },
  });
  return { tl, activate: () => undefined };
}

/** Dibuja un path con `pathLength="1"` de 0 a 1. */
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
    { strokeDasharray: "1 2", strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration },
    at,
  );
}
