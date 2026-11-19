import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/og";
import { meta, nav } from "./despegar.data";
import { ScrollProgress } from "../_template/lib/scroll-progress";
import { PitchTracker } from "../_template/lib/pitch-tracker";
import { Presenter } from "./_components/presenter";
import { Hero } from "./_sections/hero";
import { AppToday, Bucket, Business } from "./_sections/reading";
import { Competition, Voice } from "./_sections/voice";
import { Case, Thesis } from "./_sections/thesis-case";
import { Appendix } from "./_sections/appendix";
import { Close, Dashboard, FirstSteps } from "./_sections/closing";

/**
 * Página privada para Despegar: se muestra en la entrevista y se comparte por
 * link. Sale con `noindex, nofollow`, no está en el sitemap ni en la
 * navegación. La URL corta es `/despegar` (rewrite en `next.config.ts`).
 *
 * Un solo relato en seis tramos: la app (02), el balde que pierde lo que
 * entra (03), dónde se rompe según los usuarios (04), la tesis (05) y el caso
 * para empezar (06). Lo que respalda pero no es el hilo (cómo gana plata,
 * contra quién, cómo lo mediría y los primeros pasos) va plegado en el anexo,
 * antes del cierre, para que la página se lea en menos tiempo. La
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
      <AppToday />
      <Bucket />
      <Voice />
      <Thesis />
      <Case />
      <Appendix
        sections={{
          negocio: <Business />,
          competencia: <Competition />,
          tablero: <Dashboard />,
          "primeros-pasos": <FirstSteps />,
        }}
      />
      <Close />
      <ScrollProgress sections={nav.map((s) => ({ id: s.id, label: s.label }))} />
      <Presenter />
      <PitchTracker company="despegar" />
    </main>
  );
}
