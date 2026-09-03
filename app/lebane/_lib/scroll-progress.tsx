"use client";

import { ScrollTrigger, gsap } from "./gsap";
import { useGsapSection } from "./use-gsap-section";

const SECTIONS: Array<{ id: string; label: string }> = [
  { id: "hero", label: "Inicio" },
  { id: "timeline", label: "Trayectoria" },
  { id: "product-map", label: "Producto" },
  { id: "thesis", label: "Tesis" },
  { id: "why-lebane-can", label: "Por qué Lebane" },
  { id: "case", label: "El caso" },
  { id: "why-me", label: "Por qué yo" },
  { id: "close", label: "Cierre" },
];

/**
 * Dos ayudas de orientación para una página que se lee bajando: una barra de
 * progreso arriba (en todas las pantallas) y un índice de puntos a la derecha
 * (sólo desktop) que marca la sección activa. Ninguna compite con el contenido.
 */
export function ScrollProgress() {
  const ref = useGsapSection<HTMLDivElement>(({ root, q }) => {
    gsap.to(q(".progress"), {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: 0, end: "max", scrub: 0.3 },
    });
    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      const dot = root.querySelector(`[data-dot="${id}"]`);
      if (!section || !dot) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        toggleClass: { targets: dot, className: "is-active" },
      });
    });
  });

  return (
    <div ref={ref}>
      <div
        className="progress fixed top-0 left-0 z-50 h-0.5 w-full origin-left scale-x-0 bg-(--lebane-accent)"
        aria-hidden
      />
      <nav
        aria-label="Secciones"
        className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            title={s.label}
            className="flex size-4 items-center justify-center"
          >
            <span className="nav-dot" data-dot={s.id} />
          </a>
        ))}
      </nav>
    </div>
  );
}
