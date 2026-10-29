import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { measure } from "../lacaja.data";
import { Tramo, TramoHeading } from "../_components/ui";

/** 05 · Cómo se mide: cuatro métricas por segmento, el corte fijado antes y qué no haría. */
export function Measure() {
  return (
    <Tramo id="medicion">
      <TramoHeading index={measure.index} eyebrow={measure.eyebrow}>
        {measure.heading}
      </TramoHeading>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {measure.metrics.map((m, i) => (
          <li key={m.name} className="reveal rounded-xl border border-(--rule) bg-(--surface) p-5">
            <p className="mono text-xs text-(--ink-muted)">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 font-serif text-xl leading-snug">{m.name}</p>
            <p className="mt-2 text-sm">{m.def}</p>
            <p className="mt-3 text-sm text-(--ink-dim)">{m.why}</p>
          </li>
        ))}
      </ol>
      <p className="reveal mt-5 max-w-3xl text-(--ink-dim)">{measure.segmentsLine}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="reveal rounded-xl border-[1.5px] border-(--blue) p-5 md:p-6">
          <p className="label text-(--blue)">{measure.cut.title}</p>
          <p className="mt-3 text-lg leading-relaxed">{measure.cut.text}</p>
          <p className="mt-4 text-sm text-(--ink-dim)">{measure.baseline}</p>
        </div>
        <div className="reveal p-1 md:p-2">
          <p className="label text-(--ink-muted)">{measure.notDo.title}</p>
          <ul className="mt-4 space-y-3">
            {measure.notDo.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className="mt-1 shrink-0 text-(--ink-muted)"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Tramo>
  );
}
