import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { proofs } from "../lacaja.data";
import { Tramo, TramoHeading } from "../_components/ui";

/** 07 · Por qué yo: tres trabajos hechos, cada uno con su cifra y lo que prueba. */
export function Proofs() {
  return (
    <Tramo id="yo" deep>
      <TramoHeading index={proofs.index} eyebrow={proofs.eyebrow}>
        {proofs.heading}
      </TramoHeading>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {proofs.items.map((item) => (
          <li
            key={item.id}
            className="reveal flex flex-col rounded-xl border border-(--rule) bg-(--surface) p-5 md:p-6"
          >
            <p className="font-serif text-4xl leading-none text-(--blue)">{item.number}</p>
            <p className="mt-4 text-lg font-semibold">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-(--ink-dim)">{item.line}</p>
            <p className="mt-4 border-t border-(--rule) pt-4 text-sm font-semibold">
              {item.proves}
            </p>
            <Link
              href={item.href}
              data-ph="proof_click"
              data-ph-surface="lacaja-proofs"
              data-ph-kind={item.id}
              className="label mt-auto inline-flex items-center gap-1 pt-5 text-(--red) underline-offset-4 hover:underline"
            >
              {item.hrefLabel}
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Tramo>
  );
}
