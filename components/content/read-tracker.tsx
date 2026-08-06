"use client";

import { useEffect } from "react";
import type { ViewKind } from "@/lib/views";

interface ReadTrackerProps {
  kind: ViewKind;
  slug: string;
  /** Elemento cuyo avance se mide. El mismo que usa `ReadingProgress`. */
  targetSelector: string;
  /** Minutos declarados de lectura, para calcular cuánto tiempo exige contar una lectura. */
  readingMinutes?: number;
}

/** Porcentaje del artículo que hay que recorrer para que cuente como leído. */
const SCROLL_THRESHOLD = 0.75;

/**
 * Piso de permanencia. Sin esto, alguien que aterriza y aprieta End dispara el
 * 75% al instante y cuenta como lectura.
 */
const MIN_SECONDS_FLOOR = 30;

/**
 * Fracción del tiempo declarado que hay que estar en la página. Un caso de
 * nueve minutos exige algo más de dos: no es leerlo entero, pero descarta el
 * scrolleo rápido, que es lo que hay que descartar.
 */
const MIN_TIME_RATIO = 0.25;

/** Cada cuánto se muestrea. Dos segundos alcanzan y no hacen ruido. */
const SAMPLE_MS = 2000;

/**
 * Mide dos cosas distintas y no dibuja nada.
 *
 * - **Vista:** alguien abrió la pieza. Se cuenta al montar.
 * - **Lectura:** alguien recorrió el 75% y estuvo el tiempo mínimo con la
 *   pestaña visible. Se cuenta una sola vez.
 *
 * La división existe porque en piezas largas las vistas no contestan la
 * pregunta que importa. `lecturas / vistas` sí, y por eso el tiempo se acumula
 * solo mientras la pestaña está a la vista: una pestaña abierta y olvidada no
 * es un lector.
 *
 * Ninguno de los dos números se muestra en la página. Se miran en `/stats`.
 */
export function ReadTracker({ kind, slug, targetSelector, readingMinutes }: ReadTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ping = (endpoint: "views" | "reads") => {
      const sessionKey = `${endpoint === "views" ? "viewed" : "read"}:${kind}:${slug}`;
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");
      fetch(`/api/${endpoint}/${kind}/${slug}`, { method: "POST", keepalive: true }).catch(
        (error) => {
          // Si falla, se borra la marca para que un reintento en la próxima
          // navegación pueda contar. Perder un ping es preferible a inflar.
          sessionStorage.removeItem(sessionKey);
          console.error(`ReadTracker ${endpoint} error:`, error);
        },
      );
    };

    ping("views");

    const target = document.querySelector(targetSelector);
    if (!target) return;

    const minSeconds = Math.max(
      MIN_SECONDS_FLOOR,
      Math.round((readingMinutes ?? 0) * 60 * MIN_TIME_RATIO),
    );

    let visibleMs = 0;
    let ultimoTick = performance.now();

    // Un muestreo periódico en vez de escuchar el scroll. Las dos condiciones
    // (haber llegado al 75% y haber estado el tiempo mínimo) se cumplen en
    // momentos distintos, y la segunda no la anuncia ningún evento: con un
    // listener de scroll hace falta además un temporizador para el caso de
    // alguien que llega al final y se queda quieto leyendo, que es justamente
    // el lector que queremos contar.
    //
    // El intervalo solo suma tiempo cuando la pestaña está visible, así que una
    // pestaña abierta y olvidada nunca alcanza el umbral. Se apaga al disparar.
    const interval = setInterval(() => {
      // Tiempo real transcurrido, no `SAMPLE_MS` fijo: el navegador estira los
      // timers de las pestañas de fondo (medido: hasta un tick cada 8 segundos),
      // y contar de a 2000 los volvería mentira. El tope descarta el salto largo
      // de una pestaña que estuvo dormida, que no fue tiempo de lectura.
      const ahora = performance.now();
      const delta = Math.min(ahora - ultimoTick, SAMPLE_MS * 2);
      ultimoTick = ahora;

      if (document.visibilityState !== "visible") return;
      visibleMs += delta;
      if (visibleMs / 1000 < minSeconds) return;

      const rect = target.getBoundingClientRect();
      const recorrido = window.scrollY - (rect.top + window.scrollY) + window.innerHeight;
      if (recorrido / rect.height < SCROLL_THRESHOLD) return;

      ping("reads");
      clearInterval(interval);
    }, SAMPLE_MS);

    return () => clearInterval(interval);
  }, [kind, slug, targetSelector, readingMinutes]);

  return null;
}
