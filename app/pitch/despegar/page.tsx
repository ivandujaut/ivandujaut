import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/og";
import { meta, nav } from "./despegar.data";
import { ScrollProgress } from "../_template/lib/scroll-progress";
import { PitchTracker } from "../_template/lib/pitch-tracker";
import { Hero } from "./_sections/hero";
import { AppToday, Bucket, Business } from "./_sections/reading";
import { Competition, Voice } from "./_sections/voice";
import { Case, Thesis } from "./_sections/thesis-case";
import { Close, Dashboard, FirstSteps } from "./_sections/closing";

/**
 * Página privada para Despegar: se muestra en la entrevista y se comparte por
 * link. Sale con `noindex, nofollow`, no está en el sitemap ni en la
 * navegación. La URL corta es `/despegar` (rewrite en `next.config.ts`).
 *
 * Un solo relato en once tramos: cómo gana plata (02), la app (03), el balde
 * que pierde lo que entra (04), dónde se rompe según los usuarios (05) y
 * contra quién (06); la tesis (07) y el caso para empezar (08 a 10). La
 * gramática visual es el mismo vuelo leído dos veces: lo que ves en el
 * listado (violeta) y lo que pagás en el último paso (rojo). Cada tramo se
 * entiende solo, porque en la entrevista se muestran de a uno.
 */
export const metadata: Metadata = {
  // Este segmento tiene layout raíz propio: sin la base, la imagen del link
  // (opengraph-image.tsx) saldría con una URL relativa.
  metadataBase: new URL(getBaseUrl()),
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: meta.title, description: meta.description, url: "/despegar" },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
};

export default function DespegarPage() {
  return (
    <main id="main" className="relative overflow-x-clip">
      <Hero />
      <Business />
      <AppToday />
      <Bucket />
      <Voice />
      <Competition />
      <Thesis />
      <Case />
      <Dashboard />
      <FirstSteps />
      <Close />
      <ScrollProgress sections={nav.map((s) => ({ id: s.id, label: s.label }))} />
      <PitchTracker company="despegar" />
    </main>
  );
}
