"use client";

import { useEffect, useSyncExternalStore } from "react";
import { esTraficoPropio, marcarTraficoPropio } from "@/lib/analytics";

/**
 * Excluye el navegador del autor de PostHog.
 *
 * Se monta solo en `/stats`, y solo después de que el servidor validó la clave:
 * llegar hasta acá ya prueba que el navegador es del autor. Pone la marca de
 * `lib/analytics.ts` en `localStorage` y, desde ese momento, `track()` y el
 * pageview del proveedor no emiten nada desde este dispositivo.
 *
 * Corre antes que el `PostHogProvider` del layout: React ejecuta los efectos de
 * los hijos antes que los del padre, así que ni el pageview de esta misma visita
 * llega a salir.
 */

// `localStorage` es el sistema externo; el componente lo lee con
// `useSyncExternalStore` y avisa a los suscriptores cuando escribe la marca.
const oyentes = new Set<() => void>();

function suscribir(cb: () => void) {
  oyentes.add(cb);
  return () => {
    oyentes.delete(cb);
  };
}

type Estado = "pendiente" | "marcado" | "sin-marca";

const leerEstado = (): Estado => (esTraficoPropio() ? "marcado" : "sin-marca");
const estadoServidor = (): Estado => "pendiente";

export function OwnTrafficMarker() {
  const estado = useSyncExternalStore(suscribir, leerEstado, estadoServidor);

  useEffect(() => {
    marcarTraficoPropio();
    oyentes.forEach((cb) => cb());
  }, []);

  if (estado === "pendiente") return null;

  return (
    <p className="mt-4 font-mono text-xs text-muted-foreground">
      {estado === "marcado"
        ? "Este navegador quedó excluido de PostHog. Repetí la visita desde cada dispositivo con el que trabajás."
        : "No se pudo guardar la marca de exclusión (almacenamiento bloqueado): este navegador sigue midiendo."}
    </p>
  );
}
