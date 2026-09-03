import type { Metadata } from "next";
import { Hero } from "./_sections/hero";
import { Timeline } from "./_sections/timeline";
import { ProductMap } from "./_sections/product-map";
import { Thesis } from "./_sections/thesis";
import { WhyLebaneCan } from "./_sections/why-lebane-can";
import { Case } from "./_sections/case";

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
      <Timeline />
      <ProductMap />
      <Thesis />
      <WhyLebaneCan />
      <Case />
    </main>
  );
}
