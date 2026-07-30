"use client";

import { useEffect, useRef } from "react";

interface ReadingProgressProps {
  /** Selector del elemento cuyo avance de lectura se mide. */
  targetSelector: string;
  label: string;
}

/**
 * Barra de progreso de lectura, apoyada en el borde inferior del navbar.
 *
 * Escribe directamente en el style del nodo en vez de usar estado: el scroll
 * dispara decenas de eventos por segundo y un `setState` por evento haría
 * re-renderizar el árbol entero para mover 2px. El cálculo se agenda con
 * `requestAnimationFrame` para no leer layout más de una vez por frame.
 */
export function ReadingProgress({ targetSelector, label }: ReadingProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.querySelector(targetSelector);
    const bar = barRef.current;
    if (!target || !bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const { top, height } = target.getBoundingClientRect();
      // Distancia scrolleable dentro del artículo: su alto menos lo que entra
      // en pantalla. Si el artículo es más corto que el viewport no hay nada
      // que medir y dejamos la barra en cero.
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) {
        bar.style.transform = "scaleX(0)";
        return;
      }
      const progress = Math.min(Math.max(-top / scrollable, 0), 1);
      bar.style.transform = `scaleX(${progress})`;
      bar.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetSelector]);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-x-0 top-14 z-30 h-0.5 origin-left bg-foreground/70"
      style={{ transform: "scaleX(0)" }}
      ref={barRef}
    />
  );
}
