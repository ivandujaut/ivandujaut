import type { Metadata } from "next";
import { meta, nav } from "./brinta.data";
import { ScrollProgress } from "../_template/lib/scroll-progress";
import { Hero } from "./_sections/hero";
import { FollowMoney } from "./_sections/follow-money";
import { Rules } from "./_sections/rules";
import { Brazil } from "./_sections/brazil";
import { Sees } from "./_sections/sees";
import { Thesis } from "./_sections/thesis";
import { FirstStep } from "./_sections/first-step";
import { Proofs } from "./_sections/proofs";
import { Close } from "./_sections/close";

/**
 * Página privada para Brinta: se muestra en la entrevista y se comparte por
 * link. Sale con `noindex, nofollow`, no está en el sitemap ni en la
 * navegación. La URL corta es `/brinta` (rewrite en `next.config.ts`).
 */
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: meta.title, description: meta.description },
};

export default function BrintaPage() {
  return (
    <main id="main" className="relative overflow-x-clip">
      <Hero />
      <FollowMoney />
      <Rules />
      <Brazil />
      <Sees />
      <Thesis />
      <FirstStep />
      <Proofs />
      <Close />
      <ScrollProgress sections={nav.map((s) => ({ id: s.id, label: s.label }))} />
    </main>
  );
}
