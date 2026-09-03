import { Section, SectionHeading } from "../_lib/section";
import { scoreCardExample as data } from "../lebane.data";
import { CaseStory } from "./case-story";

/**
 * El caso: el relato por pasos con la maqueta (`CaseStory`), y debajo cómo
 * se mide y qué no construir.
 */
export function Case() {
  return (
    <Section id="case">
      <SectionHeading index="05" eyebrow="Un caso para empezar">
        Score de Obra y adelanto de cobranzas
      </SectionHeading>

      <CaseStory />

      <div className="mt-16 grid gap-10 border-t border-(--lebane-line) pt-10 md:mt-20 md:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs tracking-widest text-(--lebane-ink-dim) uppercase">
            Cómo se mide
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {data.successMetrics.map((m) => (
              <li key={m} className="rounded-md border border-(--lebane-line) px-3 py-2.5 text-sm">
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs tracking-widest text-(--lebane-ink-dim) uppercase">
            Qué no construir
          </h3>
          <ul className="mt-4 space-y-2.5">
            {data.notToBuild.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-2 block h-px w-4 shrink-0 bg-(--lebane-ink-dim)" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
