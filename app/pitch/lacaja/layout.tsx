import "../../globals.css";
import "./lacaja.css";
import { Chivo_Mono, Libre_Caslon_Text, Libre_Franklin } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import type { ReactNode } from "react";
import { LenisProvider } from "../_template/lib/lenis-provider";

/**
 * Pieza para La Caja: hecha a medida, no sale de la plantilla de `pitches/`.
 * Es su propio layout raíz (como Brinta y Zubale) porque cambia el tema
 * entero. Tres letras de fundiciones argentinas: Libre Caslon (títulos y
 * cifras grandes) y Libre Franklin (texto), de Impallari Type, y Chivo Mono
 * (las solicitudes de la bandeja), de Omnibus-Type.
 */

const franklin = Libre_Franklin({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const caslon = Libre_Caslon_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const chivoMono = Chivo_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function LaCajaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="lacaja" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${franklin.variable} ${caslon.variable} ${chivoMono.variable} min-h-svh font-sans antialiased`}
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
