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
  | "share_click"
  /**
   * Clic en la tarjeta de un caso (`slug`) desde una superficie (`surface`:
   * `home`, `index` o `next`, las vecinas al pie de un caso). Existe porque el
   * índice era la fuga principal del sitio (10/09/2026: 3 de 21 sesiones que
   * aterrizaban ahí abrían un caso, y los replays mostraban gente recorriendo
   * la lista entera sin clickear) y un pageview no dice qué tarjeta se eligió
   * ni desde dónde.
   */
  | "card_click";

/**
 * Agentes que no son lectores.
 *
 * - `Claude/`: el navegador embebido de la app de escritorio de Claude. Dispara
 *   cada vez que se abre un link del sitio desde una conversación, que en un
 *   repo donde el sitio se trabaja con un agente es todo el tiempo.
 * - `Shap-User`: un crawler.
 *
 * El 18/08/2026, entre los dos generaron el 43% de los eventos del día (22 de
 * 51). El problema no es solo el volumen: la única sesión de todo ese día que
 * llegó con el `utm_content` de la serie de LinkedIn puesto era la app de
 * Claude, no un lector. Sin este filtro, el primer dato de atribución de la
 * campaña era tráfico propio.
 *
 * Va acá y no en los `test_account_filters` del proyecto porque esos solo se
 * aplican a los insights que tienen el toggle prendido: no limpian el explorador
 * de eventos ni las consultas HogQL, que es donde se hace el análisis. Filtrar
 * en origen además no gasta cuota ni deja los eventos en la base.
 */
const AGENTES_NO_LECTORES = [/Claude\//, /Shap-User/];

function esAgenteLector(): boolean {
  // Durante el render en servidor no hay `navigator`. Devolver `false` es lo
  // correcto igual: todo lo que emite eventos corre en el cliente.
  if (typeof navigator === "undefined") return false;
  // Chrome automatizado (Playwright, Puppeteer, escáneres de links) se declara
  // con `webdriver`. En la primera lectura de PostHog (10/09/2026), 11 de 154
  // sesiones venían de un mismo datacenter en Virginia con UA de Chrome normal,
  // una página cada una y cero segundos: ese tráfico no lo corta el UA, lo
  // corta esto.
  if (navigator.webdriver) return false;
  return !AGENTES_NO_LECTORES.some((agente) => agente.test(navigator.userAgent));
}

/**
 * Marca en `localStorage` que este navegador es del autor.
 *
 * El filtro de agentes de arriba corta la app de escritorio, pero no el Chrome
 * ni el teléfono con los que se trabaja sobre el sitio. En los primeros 24 días
 * de medición (18/08 al 10/09/2026), 82 de 154 sesiones salían de la ciudad del
 * autor y dos escritorios solos sumaban 42: cualquier número del dashboard
 * estaba inflado al doble.
 *
 * Va en `localStorage` y no en una cookie para no arrastrar el cartel de
 * consentimiento que el sitio hoy no necesita. Se pone al visitar `/stats` con
 * la clave correcta, que es algo que solo hace el autor, así que no hay que
 * acordarse de ningún paso manual: el primer vistazo a las estadísticas desde
 * un dispositivo nuevo lo excluye para siempre.
 */
export const CLAVE_TRAFICO_PROPIO = "trafico-propio";

export function esTraficoPropio(): boolean {
  try {
    return localStorage.getItem(CLAVE_TRAFICO_PROPIO) === "1";
  } catch {
    // `localStorage` puede tirar en modo privado o con almacenamiento
    // bloqueado. Sin marca legible, se mide: preferible a perder lectores.
    return false;
  }
}

/** Excluye este navegador de la medición. Idempotente. */
export function marcarTraficoPropio(): boolean {
  try {
    localStorage.setItem(CLAVE_TRAFICO_PROPIO, "1");
    return true;
  } catch {
    return false;
  }
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY) && esAgenteLector() && !esTraficoPropio();
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
