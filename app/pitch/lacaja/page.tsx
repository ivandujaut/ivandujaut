import type { Metadata } from "next";
import { meta, nav } from "./lacaja.data";
import { ScrollProgress } from "../_template/lib/scroll-progress";
import { Hero } from "./_sections/hero";
import { Door } from "./_sections/door";
import { Money } from "./_sections/money";
import { Segments } from "./_sections/segments";
import { FirstStep } from "./_sections/first-step";
import { Measure } from "./_sections/measure";
import { Ask } from "./_sections/ask";
import { Proofs } from "./_sections/proofs";
import { Close } from "./_sections/close";

/**
 * Página privada para La Caja: se muestra en la entrevista y se comparte por
 * link. Sale con `noindex, nofollow`, no está en el sitemap ni en la
 * navegación. La URL corta es `/lacaja` (rewrite en `next.config.ts`).
 *
 * El hilo es una bandeja: en la portada llegan seis solicitudes de una flota,
 * todas con su "48 hs hábiles"; en el tramo 03 cada una toma su destino; en
 * el 06 quedan sólo las tres preguntas que se contestan adentro. Gris es lo
 * que espera, azul lo resuelto, rojo lo que hay que hacer o preguntar.
 */
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: meta.title, description: meta.description },
};

export default function LaCajaPage() {
  return (
    <main id="main" className="relative overflow-x-clip">
      <Hero />
      <Door />
      <Money />
      <Segments />
      <FirstStep />
      <Measure />
      <Ask />
      <Proofs />
      <Close />
      <ScrollProgress sections={nav.map((s) => ({ id: s.id, label: s.label }))} />
    </main>
  );
}
