"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

interface PitchTrackerProps {
  /** La empresa de la página: `lacaja`, `zubale`, `brinta` o el slug de `/pitch/[company]`. */
  company: string;
  /** Qué página de esa empresa: la principal o un anexo (`lineas`, `prueba`). */
  page?: string;
}

/** Hitos de profundidad, acumulativos como en `ReadTracker`. */
const HITOS = [25, 50, 75, 100] as const;

/** Cada cuánto se muestrea la profundidad y el tiempo visible. */
const SAMPLE_MS = 2000;

/**
 * Mide la lectura de una página de pitch. No dibuja nada.
 *
 * Existe desde el 17/11/2026. Hasta ahí las páginas de pitch sólo dejaban el
 * pageview: saber si alguien de La Caja había llegado al final salía de abrir
 * las grabaciones una por una, y las de Zubale y Brinta ya se habían borrado
 * (PostHog las guarda 30 días). Son las páginas donde aparecen las empresas a
 * las que se les manda el link, así que es la señal que más importa no perder.
 *
 * No reusa `ReadTracker` porque aquél escribe en los contadores propios de los
 * casos (`/api/views`, `/api/reads`) y su definición de lectura depende del
 * `<Abstract>` y del tiempo declarado del caso, que un pitch no tiene.
 *
 * Emite:
 * - `pitch_viewed` al abrir.
 * - `pitch_progress` en 25/50/75/100% del alto del documento.
 * - `pitch_section` la primera vez que cada `<section id>` cruza el centro de
 *   la pantalla, con su posición. Dice en qué parte del argumento se fue cada
 *   uno, que un porcentaje no dice.
 * - `pitch_exit` al irse, con profundidad máxima, segundos con la pestaña
 *   visible y la última sección vista.
 *
 * Todo se marca en `sessionStorage`: recargar o volver a la página en la misma
 * sesión no repite eventos.
 */
export function PitchTracker({ company, page = "main" }: PitchTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const base = { company, page };
    const clave = (s: string) => `pitch:${company}:${page}:${s}`;
    const unaVez = (s: string) => {
      if (sessionStorage.getItem(clave(s))) return false;
      sessionStorage.setItem(clave(s), "1");
      return true;
    };

    if (unaVez("viewed")) track("pitch_viewed", base);

    const secciones = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    let ultimaSeccion: string | null = null;
    const vistas = new Set<string>();

    // Una sección cuenta como vista cuando cruza el centro de la pantalla: el
    // mismo criterio con el que `ScrollProgress` marca el punto activo.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          ultimaSeccion = id;
          vistas.add(id);
          if (unaVez(`section:${id}`)) {
            track("pitch_section", {
              ...base,
              section: id,
              position: secciones.indexOf(entry.target as HTMLElement) + 1,
              total_sections: secciones.length,
            });
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    secciones.forEach((s) => observer.observe(s));

    let visibleMs = 0;
    let ultimoTick = performance.now();
    let profundidadMax = 0;
    let salidaEmitida = false;

    const profundidadActual = (): number => {
      const alto = document.documentElement.scrollHeight;
      if (alto <= 0) return 0;
      return Math.min(100, Math.round(((window.scrollY + window.innerHeight) / alto) * 100));
    };

    const registrarProfundidad = () => {
      const pct = profundidadActual();
      if (pct > profundidadMax) profundidadMax = pct;
      for (const hito of HITOS) {
        if (pct >= hito && unaVez(`progress:${hito}`)) {
          track("pitch_progress", { ...base, depth: hito });
        }
      }
    };

    const registrarSalida = (viaBeacon: boolean) => {
      if (salidaEmitida) return;
      salidaEmitida = true;
      track(
        "pitch_exit",
        {
          ...base,
          depth_max: profundidadMax,
          seconds_visible: Math.round(visibleMs / 1000),
          last_section: ultimaSeccion,
          sections_seen: vistas.size,
          total_sections: secciones.length,
        },
        viaBeacon ? { transport: "sendBeacon" } : undefined,
      );
    };

    // Muestreo y no listener de scroll, por la misma razón que en `ReadTracker`:
    // el tiempo visible no lo anuncia ningún evento. El tope del delta descarta
    // el salto de una pestaña dormida.
    const interval = setInterval(() => {
      const ahora = performance.now();
      const delta = Math.min(ahora - ultimoTick, SAMPLE_MS * 2);
      ultimoTick = ahora;
      if (document.visibilityState !== "visible") return;
      visibleMs += delta;
      registrarProfundidad();
    }, SAMPLE_MS);

    const alOcultar = () => registrarSalida(true);
    window.addEventListener("pagehide", alOcultar);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener("pagehide", alOcultar);
      registrarSalida(false);
    };
  }, [company, page]);

  return null;
}
