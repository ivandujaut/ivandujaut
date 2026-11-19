"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

interface SectionTrackerProps {
  /** Qué página se está midiendo. Va como `page` en el evento. */
  page: string;
  /** Los `id` a observar, separados por coma y en el orden en que aparecen. */
  sections: string;
}

/**
 * Marca por dónde llegó el lector en una página que no es un artículo.
 *
 * `ReadTracker` no sirve acá: pide `kind` y `slug`, escribe en los contadores
 * de Redis y define "lectura" como el 75% del alto más un piso de tiempo. Esa
 * definición tiene sentido en un caso de nueve minutos; en `/about` la
 * pregunta es otra y es más chica: hasta dónde llega el que entra.
 *
 * Se mide por hitos con nombre y no por porcentaje del alto a propósito. Un
 * 50% cambia de significado cada vez que se edita un párrafo, y entonces la
 * serie no se puede comparar entre versiones de la página. Un `id` sigue
 * queriendo decir lo mismo: "llegó a las tarjetas", "llegó al contacto". Eso
 * es lo que deja iterar sobre la estructura y ver si la nueva retiene más.
 *
 * Un hito se emite una sola vez por sesión, y deja de observarse apenas se ve,
 * así que volver a subir y bajar no infla el número.
 */
export function SectionTracker({ page, sections }: SectionTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const ids = sections.split(",").filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          observer.unobserve(entry.target);

          // La marca vive en la sesión y no en el closure: volver a la página
          // en la misma visita no vuelve a contar lo mismo.
          const clave = `seen:${page}:${id}`;
          try {
            if (sessionStorage.getItem(clave)) continue;
            sessionStorage.setItem(clave, "1");
          } catch {
            // Sin sessionStorage se mide igual; se duplica y se vive con eso.
          }

          track("section_seen", { page, section: id });
        }
      },
      // El hito cuenta cuando entra de verdad en pantalla, no cuando asoma un
      // píxel al borde de abajo.
      { rootMargin: "0px 0px -20% 0px" },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [page, sections]);

  return null;
}
