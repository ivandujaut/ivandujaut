import type { Pitch } from "@/pitches/types";
import { Section, SectionHeading } from "../lib/section";
import { CaseStory } from "./case-story";

interface CaseProps {
  index: string;
  data: Pitch["case"];
}

/** El caso: el relato por pasos con la maqueta, y debajo cómo se mide y qué no construir. */
export function Case({ index, data }: CaseProps) {
  return (
    <Section id="case">
      <SectionHeading index={index} eyebrow={data.eyebrow}>
        {data.heading}
      </SectionHeading>

      <CaseStory steps={data.steps} card={data.card} />

      <div className="mt-16 grid gap-10 border-t border-(--pitch-line) pt-10 md:mt-20 md:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs tracking-widest text-(--pitch-ink-dim) uppercase">
            {data.measure.title}
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {data.measure.items.map((m) => (
              <li key={m} className="rounded-md border border-(--pitch-line) px-3 py-2.5 text-sm">
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs tracking-widest text-(--pitch-ink-dim) uppercase">
            {data.notToBuild.title}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {data.notToBuild.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-2 block h-px w-4 shrink-0 bg-(--pitch-ink-dim)" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
