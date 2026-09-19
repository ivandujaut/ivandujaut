import "./globals.css";
import { Figtree } from "next/font/google";
import type { Metadata } from "next";
import esMessages from "@/messages/es.json";

/**
 * 404 de las URLs que no matchean ninguna ruta del sitio.
 *
 * Reemplaza al viejo `app/not-found.tsx`, que resolvía el idioma con
 * `getLocale()` de next-intl. Esa llamada lee `headers()`, y con una API
 * dinámica en el árbol del build ninguna página del sitio podía prerenderizarse
 * (ver el comentario de `app/[locale]/layout.tsx`). Era la última que quedaba.
 *
 * Este archivo es lo que Next pide cuando hay más de un layout raíz: saltea el
 * renderizado normal y devuelve el documento entero, así que no hay layout,
 * ni proveedores, ni `Link` de next-intl. Los textos salen del JSON de
 * castellano y los links son `<a>` comunes.
 *
 * Castellano fijo, y está bien: acá llegan las URLs que nunca entraron al
 * segmento `[locale]` (`/algo.php` y demás sondas de bots, que el matcher del
 * proxy deja pasar por tener punto). Las rutas que sí tienen idioma caen en los
 * `not-found.tsx` del segmento, que siguen traduciéndose.
 */

const figTree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const t = esMessages.common.notFound;

export const metadata: Metadata = {
  title: "Página no encontrada · Iván Dujaut",
  description: t.generic.description,
  robots: { index: false, follow: false },
};

const enlaces = [
  { href: "/", label: t.actions.home, principal: true },
  { href: "/blog", label: t.actions.blog, principal: false },
  { href: "/projects", label: t.actions.projects, principal: false },
];

export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body className={`${figTree.variable} bg-background text-foreground antialiased`}>
        <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center px-6 py-24">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            404
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">{t.generic.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{t.generic.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {enlaces.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                className={
                  enlace.principal
                    ? "inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                    : "inline-flex items-center rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
                }
              >
                {enlace.label}
              </a>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
