"use client";

import { useEffect } from "react";
import { type AnalyticsEvent, track } from "@/lib/analytics";
import type { ContentLocale, ViewKind } from "@/lib/views";

interface ReadTrackerProps {
  kind: ViewKind;
  /** Idioma de la pieza. Va en cada ping: los slugs se repiten entre idiomas. */
  locale: ContentLocale;
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
 * Hitos de profundidad, en porcentaje. Son acumulativos: llegar al 75% emite
 * también los anteriores que falten, así la curva se lee como "cuántos
 * alcanzaron al menos X" y no hace falta sumar nada al graficarla.
 */
const HITOS = [25, 50, 75, 100] as const;

/** El `<Abstract>` de los casos. Los posts no lo tienen y ahí no se emite nada. */
const ABSTRACT_SELECTOR = ".paper-abstract";

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
export function ReadTracker({
  kind,
  locale,
  slug,
  targetSelector,
  readingMinutes,
}: ReadTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // El idioma es un parámetro y no se toma del closure: la continuidad se le
    // acredita a la primera pieza de la sesión, que puede estar en otro idioma
    // que esta.
    const post = (
      endpoint: string,
      sessionKey: string,
      l: string,
      event: AnalyticsEvent,
      props: Record<string, unknown>,
    ) => {
      if (sessionStorage.getItem(sessionKey)) return;
      // El valor es la marca de tiempo, no un 1: las claves `read:` se comparan
      // después entre sí para saber cuál fue la primera pieza de la sesión.
      sessionStorage.setItem(sessionKey, String(Date.now()));
      // El mismo hecho va a los dos lados: al contador propio, que responde
      // "cuánto", y a PostHog, que responde "de dónde vino y qué hizo después".
      // Sale de acá y no de un pageview de PostHog para que la definición de
      // lectura siga siendo la de este archivo, que es más exigente.
      track(event, props);
      fetch(`/api/${endpoint}?l=${l}`, { method: "POST", keepalive: true }).catch((error) => {
        // Si falla, se borra la marca para que un reintento en la próxima
        // navegación pueda contar. Perder un ping es preferible a inflar.
        sessionStorage.removeItem(sessionKey);
        console.error(`ReadTracker ${endpoint} error:`, error);
      });
    };

    /**
     * Al terminar una pieza, mira si en esta sesión ya se había terminado otra.
     * Si la hay, le acredita la continuidad a la **más vieja**: la que enganchó
     * al lector, no la que está leyendo ahora.
     */
    const marcarContinuidad = () => {
      let primeraClave: string | null = null;
      let primeraMarca = Infinity;
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (!k?.startsWith("read:") || k === `read:${kind}:${locale}:${slug}`) continue;
        const t = Number(sessionStorage.getItem(k));
        if (Number.isFinite(t) && t < primeraMarca) {
          primeraMarca = t;
          primeraClave = k;
        }
      }
      if (!primeraClave) return;
      const [, primeroKind, primeroLocale, primeroSlug] = primeraClave.split(":");
      post(
        `continued/${primeroKind}/${primeroSlug}`,
        `continued:${primeroKind}:${primeroLocale}:${primeroSlug}`,
        primeroLocale,
        "content_continued",
        // Las dos piezas: la que enganchó y la que se acaba de terminar. Sin la
        // segunda no se puede saber qué camino hace la gente entre casos.
        {
          kind: primeroKind,
          locale: primeroLocale,
          slug: primeroSlug,
          next_kind: kind,
          next_locale: locale,
          next_slug: slug,
        },
      );
    };

    post(`views/${kind}/${slug}`, `viewed:${kind}:${locale}:${slug}`, locale, "content_viewed", {
      kind,
      locale,
      slug,
    });

    const target = document.querySelector(targetSelector);
    if (!target) return;

    const minSeconds = Math.max(
      MIN_SECONDS_FLOOR,
      Math.round((readingMinutes ?? 0) * 60 * MIN_TIME_RATIO),
    );

    let visibleMs = 0;
    let ultimoTick = performance.now();
    let leido = false;
    let profundidadMax = 0;
    let salidaEmitida = false;

    const abstract = document.querySelector(ABSTRACT_SELECTOR);
    const claveProgreso = `progress:${kind}:${locale}:${slug}`;
    const claveAbstract = `abstract:${kind}:${locale}:${slug}`;
    // El hito ya emitido se guarda en la sesión y no en el closure: volver a la
    // misma pieza no debe volver a contar la parte que ya se había recorrido.
    let hitoMax = Number(sessionStorage.getItem(claveProgreso) ?? 0);

    /** Porcentaje del artículo recorrido. Puede pasarse de 100 al final. */
    const profundidadActual = (): number => {
      const rect = target.getBoundingClientRect();
      if (rect.height <= 0) return 0;
      const recorrido = window.scrollY - (rect.top + window.scrollY) + window.innerHeight;
      return Math.max(0, Math.min(100, Math.round((recorrido / rect.height) * 100)));
    };

    const registrarProfundidad = (pct: number) => {
      if (pct > profundidadMax) profundidadMax = pct;
      for (const hito of HITOS) {
        if (pct < hito || hito <= hitoMax) continue;
        hitoMax = hito;
        sessionStorage.setItem(claveProgreso, String(hito));
        track("content_progress", { kind, locale, slug, depth: hito });
      }
    };

    /**
     * El abstract cuenta como pasado cuando su borde inferior sale por arriba
     * de la ventana: el lector lo dejó atrás y está en el cuerpo.
     */
    const revisarAbstract = () => {
      if (!abstract || sessionStorage.getItem(claveAbstract)) return;
      if (abstract.getBoundingClientRect().bottom >= 0) return;
      sessionStorage.setItem(claveAbstract, "1");
      track("content_abstract_passed", { kind, locale, slug });
    };

    /**
     * Se emite una sola vez, al irse sin haber llegado al final. Si llegó al
     * 100% ya lo dijo `content_progress` y este evento sería ruido.
     */
    const registrarSalida = (viaBeacon: boolean) => {
      if (salidaEmitida || profundidadMax >= 100) return;
      salidaEmitida = true;
      track(
        "content_exit",
        {
          kind,
          locale,
          slug,
          depth_max: profundidadMax,
          seconds_visible: Math.round(visibleMs / 1000),
          reached_read: leido,
        },
        viaBeacon ? { transport: "sendBeacon" } : undefined,
      );
    };

    // `pagehide` y no `beforeunload`: este último no dispara en Safari móvil ni
    // en las restauraciones desde la bfcache, que es buena parte del tráfico.
    const alOcultar = () => registrarSalida(true);
    window.addEventListener("pagehide", alOcultar);

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

      // La profundidad se mide en CADA tick, antes de cualquier corte. Si se
      // midiera después del piso de tiempo, quien se va rápido (justo el que
      // interesa para el copy) no dejaría ningún rastro de hasta dónde llegó.
      const pct = profundidadActual();
      registrarProfundidad(pct);
      revisarAbstract();

      // El intervalo sigue vivo después de la lectura: falta ver si llega al
      // 100%. Lo que se apaga es la parte que ya disparó.
      if (leido) return;
      if (visibleMs / 1000 < minSeconds) return;
      if (pct / 100 < SCROLL_THRESHOLD) return;

      // Solo cuenta como continuidad terminar una pieza NUEVA. Sin esta guarda,
      // volver a leer algo ya terminado en la misma sesión le acreditaba el
      // enganche a otra pieza cualquiera, que no fue la que lo produjo.
      //
      // Y va antes de marcar esta como leída, para que su propia clave no
      // compita por ser la primera de la sesión.
      if (!sessionStorage.getItem(`read:${kind}:${locale}:${slug}`)) marcarContinuidad();
      post(`reads/${kind}/${slug}`, `read:${kind}:${locale}:${slug}`, locale, "content_read", {
        kind,
        locale,
        slug,
        // Cuánto tardó en alcanzar el umbral. Permite distinguir al que leyó
        // rápido del que se quedó, sin cambiar la definición de lectura.
        seconds_visible: Math.round(visibleMs / 1000),
        reading_minutes: readingMinutes ?? null,
      });
      leido = true;
    }, SAMPLE_MS);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pagehide", alOcultar);
      // Navegar a otra pieza desmonta el componente sin disparar `pagehide`:
      // sin esto, todo el que se va por un link interno queda sin registrar.
      // La página sigue viva, así que no hace falta el beacon.
      registrarSalida(false);
    };
  }, [kind, locale, slug, targetSelector, readingMinutes]);

  return null;
}
