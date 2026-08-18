"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { Suspense, useEffect } from "react";
import { isAnalyticsEnabled } from "@/lib/analytics";

/**
 * Inicializa PostHog y emite los pageviews.
 *
 * Decisiones que conviene no revertir sin pensarlas:
 *
 * - **Sin cookies.** La persistencia va en `sessionStorage`, igual que ya hace
 *   `ReadTracker` para deduplicar. Sin cookies no hace falta cartel de
 *   consentimiento, que es lo que hoy permite que el sitio no tenga ninguno. El
 *   costo es no reconocer al mismo visitante entre sesiones distintas; el
 *   embudo dentro de una sesión, que es lo que se quiere medir, queda intacto.
 * - **Sin autocapture.** Captura cada clic del DOM con selectores genéricos y
 *   llena el proyecto de ruido en el que después hay que pescar. Los eventos de
 *   este sitio son explícitos y están tipados en `lib/analytics.ts`.
 * - **Sin session replay.** Es la decisión más invasiva de PostHog y consume su
 *   propia cuota. Si algún día se quiere ver cómo lee un caso alguien de una
 *   empresa, se prende a conciencia y con un aviso, no de arranque.
 * - **Pageview manual.** El automático solo dispara en la carga inicial: con el
 *   App Router, navegar entre casos no cuenta ninguno.
 */
function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAnalyticsEnabled() || !pathname) return;
    // La URL se arma a mano porque PostHog toma `window.location` en el momento
    // del capture, y en una navegación del App Router puede ir una render atrás.
    const query = searchParams?.toString();
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      // Proxy en el propio dominio (ver los rewrites de `next.config.ts`): sin
      // esto los bloqueadores se comen buena parte del tráfico técnico, que es
      // justamente el perfil que interesa medir.
      api_host: "/rl",
      // El host real, solo para que los links del toolbar apunten bien.
      ui_host: "https://us.posthog.com",
      persistence: "sessionStorage",
      person_profiles: "identified_only",
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      // Los de abajo vienen prendidos en la configuración REMOTA del
      // proyecto, heredada de un producto anterior, y por eso se descargaban sus
      // módulos en cada carga. Apagarlos acá gana sobre el servidor y evita
      // depender de un ajuste del dashboard que nadie recuerda por qué está.
      //
      // web vitals: se pisa con Speed Insights de Vercel, que ya mide lo mismo
      // mejor. En `posthog-js`, si el cliente manda un booleano, prevalece sobre
      // el flag del servidor (ver el getter `isEnabled` del módulo).
      capture_performance: false,
      // No hay ninguna encuesta y el motor pesa en cada carga.
      disable_surveys: true,
      // Manda un evento por cada clic que no produce efecto. Es ruido que nadie
      // pidió en un proyecto donde cada evento está porque alguien lo decidió.
      capture_dead_clicks: false,
      // Heatmaps SÍ se quiere: es la única forma de ver dónde interactúa la gente
      // dentro de un caso, que es una pregunta que los eventos no contestan.
      // Va explícito en `true` y no heredado del servidor: el resto de la config
      // de captura se decide acá, y este flag no debería ser la excepción que
      // depende de un ajuste del dashboard.
      //
      // Consecuencia conocida: con heatmaps activo, `dead-clicks-autocapture.js`
      // se descarga en cada carga aunque `capture_dead_clicks` esté en false,
      // porque el módulo de heatmaps instancia el suyo propio con el `isEnabled`
      // fijo en `true` (`new an(this.instance, nn, ...)`, con `nn = () => true`).
      // No implica eventos de más: el handler que le pasa (`this.ke(evento,
      // "deadclick")`) alimenta el mapa en vez de emitir `$dead_click`.
      capture_heatmaps: true,
    });
  }, []);

  // `useSearchParams` obliga a un límite de Suspense o toda la página se vuelve
  // dinámica en el build.
  return (
    <Suspense fallback={null}>
      <PostHogPageview />
    </Suspense>
  );
}
