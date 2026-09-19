import "../globals.css";
import { Geist_Mono, Figtree } from "next/font/google";
import type { ReactNode } from "react";

/**
 * Layout raíz del tablero privado.
 *
 * `/stats` vive fuera de `[locale]` (está excluido del matcher del proxy), así
 * que desde que el `<html>` del sitio se mudó a `app/[locale]/layout.tsx` esta
 * rama necesita el suyo. Next admite varios layouts raíz mientras no haya un
 * `app/layout.tsx` arriba de todo.
 *
 * Trae lo mínimo: los tokens de `globals.css` y las dos familias que la tabla
 * usa. Sin tema claro/oscuro, sin analítica y sin serif: es una pantalla
 * privada de lectura, y todo lo que se agregue acá lo paga una página que mira
 * una sola persona.
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

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${figTree.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
