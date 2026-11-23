"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Cuánto se separa cada tarjeta de la anterior cuando entran juntas. */
const ESCALON = 90;
/** Con más de cinco a la vez, el resto entra con el mismo retraso que la sexta. */
const TOPE = 5;

/**
 * Hace aparecer las tarjetas `.reveal` cuando entran en pantalla, como en
 * moatseek.com: cada una sube y se hace visible con su propia transición, y
 * las que entran en la misma tanda (una fila de la grilla, la lista de la
 * home) se escalonan.
 *
 * Marca con `data-revealed` y no con una clase: React maneja `className`, y
 * en el filtro de casos re-renderiza esas tarjetas al cambiar de mercado. Una
 * clase agregada a mano se perdería en ese re-render; un atributo que React no
 * conoce, no.
 *
 * Una tarjeta que se esconde (el filtro le pone `display: none`) pierde la
 * marca, así que al volver a mostrarse entra animada de nuevo.
 *
 * Vuelve a buscar tarjetas en cada navegación y cuando cambia el contenido de
 * la página, para las que llegan después del primer render.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    (window as Window & { __revealReady?: boolean }).__revealReady = true;
    const html = document.documentElement;
    if (!html.classList.contains("rv")) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        const nuevas: HTMLElement[] = [];
        for (const entrada of entradas) {
          const el = entrada.target as HTMLElement;
          if (entrada.isIntersecting) {
            if (!el.hasAttribute("data-revealed")) nuevas.push(el);
          } else if (entrada.boundingClientRect.height === 0) {
            el.removeAttribute("data-revealed");
          }
        }
        nuevas
          .sort((a, b) => {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            return ra.top - rb.top || ra.left - rb.left;
          })
          .forEach((el, i) => {
            el.style.setProperty("--reveal-delay", `${Math.min(i, TOPE) * ESCALON}ms`);
            el.setAttribute("data-revealed", "");
          });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const vistos = new WeakSet<Element>();
    const buscar = () => {
      for (const el of document.querySelectorAll(".reveal")) {
        if (vistos.has(el)) continue;
        vistos.add(el);
        observer.observe(el);
      }
    };
    buscar();

    let pendiente = 0;
    const mutaciones = new MutationObserver(() => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(buscar);
    });
    mutaciones.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(pendiente);
      mutaciones.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
