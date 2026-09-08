import type { ReactNode } from "react";
import { LenisProvider } from "../_template/lib/lenis-provider";
import "../_template/pitch.css";

/**
 * Piezas privadas por empresa: viven fuera de `[locale]` a propósito (sin
 * navbar, sin footer, sin banner de idioma) y excluidas del proxy de next-intl
 * como `/stats`. Siempre oscuras: el `dark` del wrapper pisa el tema del
 * sistema usando los mismos tokens que el resto del sitio.
 */
export default function PitchLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pitch dark min-h-svh bg-background text-foreground">
      <LenisProvider>{children}</LenisProvider>
    </div>
  );
}
