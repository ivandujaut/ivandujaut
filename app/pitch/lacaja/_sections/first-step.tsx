import { firstStep } from "../lacaja.data";
import { AltaMock } from "../_components/alta-mock";
import { Cite, Tramo, TramoHeading } from "../_components/ui";

/** 04 · El primer paso: por qué el alta de vehículo, el mock y por qué La Caja puede. */
export function FirstStep() {
  return (
    <Tramo id="paso" deep>
      <TramoHeading index={firstStep.index} eyebrow={firstStep.eyebrow}>
        {firstStep.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">
        {firstStep.intro} {firstStep.sofse}
        <Cite id={firstStep.sofseSource} />
      </p>

      <div className="reveal mt-10">
        <AltaMock />
      </div>

      <div className="reveal mt-12">
        <p className="label text-(--blue)">{firstStep.canTitle}</p>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {firstStep.can.map((item) => (
            <li key={item.text} className="border-t border-(--rule) pt-4 leading-relaxed">
              {item.text}
              <Cite id={item.source} />
            </li>
          ))}
        </ul>
      </div>
    </Tramo>
  );
}
