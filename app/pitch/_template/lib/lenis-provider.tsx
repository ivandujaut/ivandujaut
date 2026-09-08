"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { REDUCED_MOTION_QUERY, ScrollTrigger, gsap } from "./gsap";

/**
 * Scroll suave con Lenis, sincronizado con el reloj de GSAP para que
 * ScrollTrigger lea la misma posición que el usuario ve.
 *
 * Con `prefers-reduced-motion: reduce` no se instancia: el scroll queda nativo
 * y las secciones tampoco animan (ver `useGsapSection`).
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Las fuentes cambian el alto de las secciones; ScrollTrigger tiene que
    // recalcular sus posiciones cuando terminan de cargar.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
