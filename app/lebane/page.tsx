import type { Metadata } from "next";
import { Hero } from "./_sections/hero";

/**
 * Página privada: se comparte por link después de una entrevista. Sale con
 * `noindex, nofollow`, no está en el sitemap ni en la navegación.
 */
export const metadata: Metadata = {
  title: "Lebane, de pies a cabeza",
  description: "Una lectura del producto, una tesis sobre el negocio y un caso para empezar.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Lebane, de pies a cabeza",
    description: "Una lectura del producto, una tesis sobre el negocio y un caso para empezar.",
  },
};

export default function LebanePage() {
  return (
    <main id="main">
      <Hero />
    </main>
  );
}
