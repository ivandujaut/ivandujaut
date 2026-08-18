/**
 * Capa fina sobre PostHog. Existe para que ningún componente importe
 * `posthog-js` directamente: así el proveedor se puede cambiar tocando solo
 * este archivo, y los componentes siguen hablando de eventos de producto.
 *
 * Todo es no-op si falta `NEXT_PUBLIC_POSTHOG_KEY` (desarrollo local, previews
 * sin configurar). Medir de menos es preferible a romper la página por una
 * variable ausente.
 */
import posthog from "posthog-js";

/**
 * Eventos del portfolio. La lista es cerrada a propósito: un string libre en
 * cada llamada termina en `demo_click`, `click_demo` y `demoClicked` midiendo
 * lo mismo, y el embudo deja de cerrar.
 */
export type AnalyticsEvent =
  /** Alguien abrió una pieza. Equivale al contador `views`. */
  | "content_viewed"
  /**
   * Alguien la leyó de verdad: 75% del artículo recorrido MÁS el piso de tiempo
   * con la pestaña visible. La definición vive en `ReadTracker`, no acá, y es
   * deliberadamente más exigente que un pageview.
   */
  | "content_read"
  /** Terminó una segunda pieza en la misma sesión. Se acredita a la primera. */
  | "content_continued"
  /** Clic a una prueba: la demo desplegada, el repo, el Figma. */
  | "proof_click"
  /** Clic a una vía de contacto: mail revelado, Calendly, LinkedIn. */
  | "contact_click"
  /** Compartió una pieza. */
  | "share_click";

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

/** Emite un evento. Silencioso si PostHog no está configurado. */
export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (!isAnalyticsEnabled()) return;
  posthog.capture(event, properties);
}
