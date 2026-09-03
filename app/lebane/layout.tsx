import type { ReactNode } from "react";
import { LenisProvider } from "./_lib/lenis-provider";
import "./lebane.css";

/**
 * Pieza privada para una entrevista: vive fuera de `[locale]` a propósito
 * (sin navbar, sin footer, sin banner de idioma) y excluida del proxy de
 * next-intl como `/stats`. La página es siempre oscura: el `dark` del wrapper
 * pisa el tema del sistema usando los mismos tokens que el resto del sitio.
 */
export default function LebaneLayout({ children }: { children: ReactNode }) {
  return (
    <div className="lebane dark min-h-svh bg-background text-foreground">
      <LenisProvider>{children}</LenisProvider>
    </div>
  );
}
