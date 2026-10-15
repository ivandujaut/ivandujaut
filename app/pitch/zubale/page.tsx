import type { Metadata } from "next";
import { meta, nav, partOne, partTwo } from "./zubale.data";
import { ScrollProgress } from "../_template/lib/scroll-progress";
import { PartDivider } from "./_components/ui";
import { Hero } from "./_sections/hero";
import { Challenges, Marketplace, Problem, Products, Systems } from "./_sections/part-one";
import { OrderFlow } from "./_sections/order-flow";
import { WhatsNext } from "./_sections/whats-next";
import { Thesis } from "./_sections/thesis";
import { CaseStudy, Close, OpenQuestions, Plan } from "./_sections/part-two";

/**
 * Página privada para Zubale: se muestra en la entrevista y se comparte por
 * link. Sale con `noindex, nofollow`, no está en el sitemap ni en la
 * navegación. La URL corta es `/zubale` (rewrite en `next.config.ts`).
 *
 * Dos partes: cómo funciona Zubale hoy (tramos 01 a 06) y una idea para
 * contrastar (07 a 11, desde lo que viene). La gramática visual es la misma
 * en toda la página: el pedido como lo ve una persona (magenta) y como queda
 * escrito para una máquina (azul): hoy el sistema del súper, mañana el
 * agente del comprador.
 */
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: meta.title, description: meta.description },
};

export default function ZubalePage() {
  return (
    <main id="main" className="relative overflow-x-clip">
      <Hero />
      <PartDivider {...partOne} />
      <Problem />
      <Products />
      <OrderFlow />
      <Marketplace />
      <Systems />
      <Challenges />
      <PartDivider {...partTwo} />
      <WhatsNext />
      <Thesis />
      <CaseStudy />
      <OpenQuestions />
      <Plan />
      <Close />
      <ScrollProgress sections={nav.map((s) => ({ id: s.id, label: s.label }))} />
    </main>
  );
}
