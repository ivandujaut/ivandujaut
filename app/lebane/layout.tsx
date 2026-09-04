import type { ReactNode } from "react";
import { Source_Serif_4 } from "next/font/google";
import { LenisProvider } from "./_lib/lenis-provider";
import { ScrollProgress } from "./_lib/scroll-progress";
import "./lebane.css";

/**
 * La misma serif del sitio, pero con `display: optional` y sólo para el
 * título de la portada: es el elemento más grande de la página (LCP) y con
 * `swap` Lighthouse cuenta el repintado cuando llega la fuente. Con
 * `optional`, si la fuente no llegó al primer pintado ese visitante ve el
 * respaldo (ajustado en métricas, sin salto) y el LCP queda en el primer
 * pintado. En la segunda visita la fuente ya está en caché.
 */
const heroSerif = Source_Serif_4({
  variable: "--font-serif-optional",
  subsets: ["latin"],
  display: "optional",
  style: ["normal", "italic"],
});

/**
 * Pieza privada para una entrevista: vive fuera de `[locale]` a propósito
 * (sin navbar, sin footer, sin banner de idioma) y excluida del proxy de
 * next-intl como `/stats`. La página es siempre oscura: el `dark` del wrapper
 * pisa el tema del sistema usando los mismos tokens que el resto del sitio.
 */
export default function LebaneLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`lebane dark min-h-svh bg-background text-foreground ${heroSerif.variable}`}>
      <LenisProvider>
        {children}
        <ScrollProgress />
      </LenisProvider>
    </div>
  );
}
