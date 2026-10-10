import "../../globals.css";
import "./brinta.css";
import { Geist_Mono, Figtree, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import type { ReactNode } from "react";
import { LenisProvider } from "../_template/lib/lenis-provider";

/**
 * Pieza para Brinta: hecha a medida, no sale de la plantilla de `pitches/`.
 * Es su propio layout raíz (como `[company]`) porque cambia el tema entero:
 * papel claro en lugar del fondo oscuro de las otras piezas. Comparte con
 * ellas sólo lo que no se ve: fuentes, tokens base, Lenis y la medición.
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

export default function BrintaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="brinta" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${figTree.variable} ${geistMono.variable} ${sourceSerif.variable} min-h-svh font-sans antialiased`}
      >
        <LenisProvider>{children}</LenisProvider>
        <Analytics />
        <SpeedInsights />
        <PostHogProvider />
        <ClickTracker />
      </body>
    </html>
  );
}
