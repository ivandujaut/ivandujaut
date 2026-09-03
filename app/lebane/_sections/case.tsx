import { Section, SectionHeading } from "../_lib/section";
import { scoreCardExample as data } from "../lebane.data";
import { ScoreCard } from "./score-card";

/**
 * El caso: texto a la izquierda (hipótesis y dos pasos), maqueta a la derecha.
 * En mobile la maqueta va a ancho completo debajo del texto, sin pin.
 */
export function Case() {
  return (
    <Section id="case">
      <SectionHeading index="05" eyebrow="Un caso para empezar">
        Score de Obra y adelanto de cobranzas
      </SectionHeading>

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1fr_1.1fr] md:gap-14">
        <div className="space-y-10">
          <div>
            <h3 className="font-mono text-xs tracking-widest text-(--lebane-accent) uppercase">
              Hipótesis
            </h3>
            <p className="mt-3 text-lg leading-relaxed">
              Buena parte de la tensión de caja de una desarrolladora mediana no es falta de ventas.
              Es el desfase entre cuotas que van a entrar y compromisos que ya vencieron. Lebane ve
              las dos puntas.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs tracking-widest text-(--lebane-accent) uppercase">
              Paso 1 · Score de Obra
            </h3>
            <p className="mt-3 leading-relaxed text-(--lebane-ink-dim)">
              Mostrarle a cada desarrolladora el score de su proyecto, adentro de Lebane, antes de
              ofrecerle crédito. Cinco indicadores que ya están cargados. Crea la demanda antes que
              la oferta, y mejora la calidad de la carga.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs tracking-widest text-(--lebane-accent) uppercase">
              Paso 2 · Adelanto de cobranzas
            </h3>
            <p className="mt-3 leading-relaxed text-(--lebane-ink-dim)">
              Hasta un porcentaje de las cuotas de los próximos 90 días de compradores con historial
              en término, repagado solo desde los ingresos por CVU. Va primero porque el repago está
              embebido, los datos ya existen, el ticket es chico y el ciclo, corto.
            </p>
          </div>
        </div>

        <div className="md:sticky md:top-8 md:self-start">
          <ScoreCard />
        </div>
      </div>

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
