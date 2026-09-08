import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collectSources, getPitch, pitches } from "@/pitches";
import { illustrations } from "../_template/illustrations";
import { landmarkSets } from "../_template/landmarks";
import { ScrollProgress } from "../_template/lib/scroll-progress";
import { StoryThread } from "../_template/lib/story-thread";
import { Hero } from "../_template/sections/hero";
import { Timeline } from "../_template/sections/timeline";
import { ProductMap } from "../_template/sections/product-map";
import { Thesis } from "../_template/sections/thesis";
import { Why } from "../_template/sections/why";
import { Case } from "../_template/sections/case";
import { Proofs } from "../_template/sections/proofs";
import { Close } from "../_template/sections/close";

type Props = { params: Promise<{ company: string }> };

export function generateStaticParams() {
  return Object.keys(pitches).map((company) => ({ company }));
}

/**
 * Página privada por empresa: se comparte por link después de una entrevista.
 * Sale con `noindex, nofollow`, no está en el sitemap ni en la navegación.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params;
  const pitch = getPitch(company);
  if (!pitch) return {};
  return {
    title: pitch.meta.title,
    description: pitch.meta.description,
    robots: { index: false, follow: false },
    openGraph: { title: pitch.meta.title, description: pitch.meta.description },
  };
}

export default async function PitchPage({ params }: Props) {
  const { company } = await params;
  const pitch = getPitch(company);
  if (!pitch) notFound();

  const illustration = illustrations[pitch.illustration];
  const Illustration = illustration.Component;
  const sections = [
    { id: "hero", label: "Inicio" },
    { id: "timeline", label: pitch.timeline.eyebrow },
    { id: "product-map", label: pitch.productMap.eyebrow },
    { id: "thesis", label: pitch.thesis.eyebrow },
    { id: "why", label: pitch.why.eyebrow },
    { id: "case", label: pitch.case.eyebrow },
    { id: "proofs", label: pitch.proofs.eyebrow },
    { id: "close", label: "Cierre" },
  ];

  return (
    <main id="main" className="relative">
      <StoryThread
        sectionIds={sections.map((s) => s.id)}
        thread={illustration.thread}
        landmarks={landmarkSets[pitch.landmarks]}
      />
      <Hero
        hero={pitch.hero}
        author={pitch.author}
        illustration={<Illustration />}
        nextId="timeline"
      />
      <Timeline index="01" data={pitch.timeline} />
      <ProductMap index="02" data={pitch.productMap} />
      <Thesis index="03" data={pitch.thesis} />
      <Why index="04" data={pitch.why} />
      <Case index="05" data={pitch.case} />
      <Proofs index="06" data={pitch.proofs} />
      <Close data={pitch.close} author={pitch.author} sources={collectSources(pitch)} />
      <ScrollProgress sections={sections} />
    </main>
  );
}
