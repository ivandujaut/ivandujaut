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
  /**
   * Cruzó un hito de profundidad (25/50/75/100). Existe porque `content_read`
   * es binario: sin estos hitos, el que se va en el título y el que se va en el
   * 70% son el mismo dato, y son problemas de copy opuestos.
   */
  | "content_progress"
  /**
   * Pasó el `<Abstract>` y entró al cuerpo. Aísla la pregunta del gancho (el
   * resumen) de la del desarrollo: sin esto, un abandono temprano no dice cuál
   * de los dos falló.
   */
  | "content_abstract_passed"
  /**
   * Se fue sin terminar, con la profundidad máxima alcanzada. Es lo único que
   * ve al que abandona antes del primer hito, que es justo el grupo invisible.
   */
  | "content_exit"
  /** Clic a una prueba: la demo desplegada, el repo, el Figma. */
  | "proof_click"
  /** Clic a una vía de contacto: mail revelado, Calendly, LinkedIn. */
  | "contact_click"
  /** Compartió una pieza. */
  | "share_click";

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

interface TrackOptions {
  /**
   * `sendBeacon` para lo que se emite mientras la página se está yendo: una
   * request normal se cancela al descargar el documento y el evento se pierde,
   * que es exactamente el caso de `content_exit`.
   */
  transport?: "XHR" | "sendBeacon";
}

/** Emite un evento. Silencioso si PostHog no está configurado. */
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
  options?: TrackOptions,
): void {
  if (!isAnalyticsEnabled()) return;
  posthog.capture(event, properties, options);
}
