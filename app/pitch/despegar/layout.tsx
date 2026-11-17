import "../../globals.css";
import "./despegar.css";
import { Chivo_Mono, Rubik } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import type { ReactNode } from "react";
import { LenisProvider } from "../_template/lib/lenis-provider";

/**
 * Pieza para Despegar: hecha a medida, con su propio layout raíz (como Zubale
 * y La Caja) porque cambia el tema entero. Rubik es la tipografía que declara
 * el sistema de diseño de Despegar (eva-core.css); Chivo Mono sólo para los
 * rótulos chicos y los números tabulares del tablero.
 */

const rubik = Rubik({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const chivoMono = Chivo_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function DespegarLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="despegar" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${rubik.variable} ${chivoMono.variable} min-h-svh font-sans antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-(--ink) focus:px-3 focus:py-2 focus:text-sm focus:text-(--surface)"
        >
          Saltar al contenido
        </a>
        <LenisProvider>{children}</LenisProvider>
        <Analytics />
        <SpeedInsights />
        <PostHogProvider />
        <ClickTracker />
      </body>
    </html>
  );
}
