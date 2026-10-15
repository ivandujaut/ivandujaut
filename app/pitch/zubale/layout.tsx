import "../../globals.css";
import "./zubale.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import type { ReactNode } from "react";
import { LenisProvider } from "../_template/lib/lenis-provider";

/**
 * Pieza para Zubale: hecha a medida, no sale de la plantilla de `pitches/`.
 * Es su propio layout raíz (como Brinta) porque cambia el tema entero. Una
 * sola tipografía, Geist; Geist Mono sólo para lo que lee un agente (estados,
 * campos, datos), que es la mitad visual de la idea.
 */

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function ZubaleLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="zubale" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geist.variable} ${geistMono.variable} min-h-svh font-sans antialiased`}
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
