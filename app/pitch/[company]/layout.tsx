import "../../globals.css";
import "../_template/pitch.css";
import { Geist_Mono, Figtree, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import type { ReactNode } from "react";
import { LenisProvider } from "../_template/lib/lenis-provider";

/**
 * Piezas privadas por empresa: viven fuera de `[locale]` a propósito (sin
 * navbar, sin footer, sin banner de idioma) y excluidas del proxy de next-intl
 * como `/stats`. Siempre oscuras: el `dark` del wrapper pisa el tema del
 * sistema usando los mismos tokens que el resto del sitio.
 *
 * Desde el 18/09/2026 es también el layout **raíz** de esta rama: el `<html>`
 * del sitio se mudó a `app/[locale]/layout.tsx` para que las páginas vuelvan a
 * ser estáticas, y sin un `app/layout.tsx` arriba cada rama necesita el suyo.
 *
 * Por eso bajan acá las fuentes, los tokens de `globals.css` y, sobre todo, la
 * medición: estas páginas tienen `data-ph="contact_click"` en el cierre, y sin
 * `PostHogProvider` y `ClickTracker` esos clics se perderían en silencio, que
 * es justo lo que estas piezas existen para contar.
 */

const figTree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export default function PitchLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${figTree.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}
      >
        <div className="pitch dark min-h-svh bg-background text-foreground">
          <LenisProvider>{children}</LenisProvider>
        </div>
        <Analytics />
        <SpeedInsights />
        <PostHogProvider />
        <ClickTracker />
      </body>
    </html>
  );
}
