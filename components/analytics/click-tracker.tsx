"use client";

import { useEffect } from "react";
import { type AnalyticsEvent, track } from "@/lib/analytics";

/**
 * Un único listener delegado en `document` para todos los clics que se miden.
 *
 * La alternativa era envolver cada link en un componente cliente, y en un sitio
 * de contenido eso significa hidratar decenas de islas para no hacer nada más
 * que un `capture`. Acá el server component solo agrega atributos:
 *
 * ```tsx
 * <a href={project.demo} data-ph="proof_click" data-ph-kind="demo" data-ph-slug={slug}>
 * ```
 *
 * El nombre del evento va en `data-ph` y cada `data-ph-*` restante se manda como
 * propiedad. Se monta una sola vez, en el layout.
 */

/** Eventos que este tracker acepta desde el DOM. */
const CLICK_EVENTS = new Set<string>([
  "proof_click",
  "contact_click",
  "share_click",
] satisfies AnalyticsEvent[]);

export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-ph]");
      if (!el) return;

      const event = el.dataset.ph;
      // Un `data-ph` mal escrito no debe crear un evento fantasma que después
      // aparece en el proyecto como si alguien lo hubiera diseñado.
      if (!event || !CLICK_EVENTS.has(event)) return;

      const properties: Record<string, string> = {};
      for (const [k, v] of Object.entries(el.dataset)) {
        // `ph` es el nombre del evento; `phKind` -> `kind`.
        if (k === "ph" || !k.startsWith("ph") || v === undefined) continue;
        properties[k.slice(2, 3).toLowerCase() + k.slice(3)] = v;
      }
      // El destino sirve para separar, por ejemplo, el repo del bot del de otro
      // caso sin tener que agregar un atributo en cada link.
      if (el instanceof HTMLAnchorElement) properties.href = el.href;

      track(event as AnalyticsEvent, properties);
    };

    // En captura: si algún handler de más adentro corta la propagación, el clic
    // se mide igual.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
