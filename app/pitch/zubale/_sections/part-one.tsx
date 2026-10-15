import { challenges, marketplace, problem, products, systems } from "../zubale.data";
import { Cite, Tramo, TramoHeading } from "../_components/ui";

/** 01 · Qué resuelve: el costo de armar y entregar, y la respuesta de Zubale. */
export function Problem() {
  return (
    <Tramo id="problema">
      <TramoHeading index={problem.index} eyebrow={problem.eyebrow}>
        {problem.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg text-(--ink-dim)">{problem.intro}</p>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {problem.stats.map((s) => (
          <div
            key={s.value}
            className="reveal rounded-2xl border border-(--rule) bg-(--surface) p-6"
          >
            <p className="mono text-4xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-3 text-sm text-(--ink-dim)">
              {s.label}
              <Cite id={s.source} label={s.sourceLabel} />
            </p>
          </div>
        ))}
      </div>

      <figure className="reveal mt-12 max-w-3xl">
        <blockquote className="text-xl font-medium md:text-2xl">“{problem.quote.text}”</blockquote>
        <figcaption className="mt-3 text-sm text-(--ink-dim)">
          {problem.quote.author}
          <Cite id={problem.quote.source} />
        </figcaption>
      </figure>

      <p className="reveal mt-12 max-w-2xl rounded-2xl bg-(--person-soft) p-6 text-lg">
        <strong className="font-semibold">{problem.answer.lead}</strong> {problem.answer.text}
        <Cite id={problem.answer.source} />
      </p>
    </Tramo>
  );
}

/** 02 · Qué vende: los productos, el camino y el tamaño. */
export function Products() {
  return (
    <Tramo id="productos" deep>
      <TramoHeading index={products.index} eyebrow={products.eyebrow}>
        {products.heading}
      </TramoHeading>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.items.map((p) => (
          <article
            key={p.id}
            className="reveal flex flex-col rounded-2xl border border-(--rule) bg-(--surface) p-6"
          >
            <p className="mono text-xs tracking-widest text-(--ink-dim) uppercase">{p.role}</p>
            <h3 className="mt-2 text-xl font-semibold">{p.name}</h3>
            <p className="mt-3 text-sm text-(--ink-dim)">
              {p.text}
              <Cite id={p.source} />
            </p>
          </article>
        ))}
      </div>

      <div className="reveal mt-12">
        <h3 className="text-sm font-semibold">
          {products.timeline.title}
          <Cite id={products.timeline.source} />
        </h3>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.timeline.steps.map((s) => (
            <li key={s.year} className="border-t-2 border-(--ink) pt-3">
              <p className="mono text-sm font-semibold">{s.year}</p>
              <p className="mt-1 text-sm text-(--ink-dim)">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="reveal mt-12 grid gap-4 sm:grid-cols-3">
        {products.facts.map((f) => (
          <div key={f.value}>
            <p className="mono text-3xl font-semibold tracking-tight">{f.value}</p>
            <p className="mt-1 text-sm text-(--ink-dim)">
              {f.label}
              <Cite id={f.source} />
            </p>
          </div>
        ))}
      </div>
      <p className="reveal mt-8 max-w-2xl text-sm text-(--ink-dim)">
        {products.clients}
        <Cite id={products.clientsSource} />
      </p>
    </Tramo>
  );
}

/** 04 · Las dos puntas del marketplace. */
export function Marketplace() {
  return (
    <Tramo id="marketplace" deep>
      <TramoHeading index={marketplace.index} eyebrow={marketplace.eyebrow}>
        {marketplace.heading}
      </TramoHeading>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {marketplace.sides.map((side) => (
          <div
            key={side.id}
            className="reveal rounded-2xl border border-(--rule) bg-(--surface) p-6"
          >
            <h3 className="text-xl font-semibold">{side.title}</h3>
            <ul className="mt-6 space-y-6">
              {side.items.map((item) => (
                <li key={item.lead}>
                  <p className="font-semibold">{item.lead}</p>
                  <p className="mt-1 text-sm text-(--ink-dim)">
                    {item.text}
                    <Cite id={item.source} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Tramo>
  );
}

/** 05 · Con qué lo hacen: el mapa de sistemas en el orden del pedido. */
export function Systems() {
  return (
    <Tramo id="sistemas">
      <TramoHeading index={systems.index} eyebrow={systems.eyebrow}>
        {systems.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg text-(--ink-dim)">
        {systems.intro}
        <Cite id="status" label="estado" />
        <Cite id="api" label="API" />
      </p>

      <ol className="reveal mt-12 grid gap-3 md:grid-cols-5">
        {systems.lanes.map((lane, i) => (
          <li key={lane.name} className="rounded-2xl border border-(--rule) bg-(--surface) p-4">
            <p className="mono text-xs text-(--ink-dim)">
              {String(i + 1).padStart(2, "0")} <span aria-hidden>·</span> {lane.name}
            </p>
            <ul className="mono mt-3 space-y-2 text-xs text-(--agent-ink)">
              {lane.items.map((item) => (
                <li key={item} className="rounded-md bg-(--agent-soft) px-2 py-1">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <dl className="reveal mt-8 grid gap-4 md:grid-cols-2">
        {systems.base.map((b) => (
          <div key={b.label} className="border-t border-(--rule) pt-4">
            <dt className="text-sm font-semibold">{b.label}</dt>
            <dd className="mt-1 text-sm text-(--ink-dim)">
              {b.text}
              <Cite id={b.source} />
            </dd>
          </div>
        ))}
      </dl>

      <p className="reveal mt-8 max-w-2xl text-sm text-(--ink-dim)">
        {systems.footnote}
        <Cite id={systems.footnoteSource} />
      </p>
    </Tramo>
  );
}

/** 06 · Los desafíos, cada uno como lo que se ve y la pregunta que haría. */
export function Challenges() {
  return (
    <Tramo id="desafios" deep>
      <TramoHeading index={challenges.index} eyebrow={challenges.eyebrow}>
        {challenges.heading}
      </TramoHeading>

      <ol className="mt-12 space-y-4">
        {challenges.items.map((c, i) => (
          <li
            key={c.id}
            className="reveal grid gap-4 rounded-2xl border border-(--rule) bg-(--surface) p-6 md:grid-cols-[3rem_minmax(0,3fr)_minmax(0,2fr)] md:gap-8"
          >
            <p className="mono text-sm text-(--ink-faint)">{String(i + 1).padStart(2, "0")}</p>
            <p className="text-base">
              {c.seen}
              <Cite id={c.source} />
              {"note" in c && c.note ? (
                <span className="ml-1 text-xs text-(--ink-faint)">({c.note})</span>
              ) : null}
            </p>
            <p className="text-base font-medium text-(--agent-ink)">{c.ask}</p>
          </li>
        ))}
      </ol>
    </Tramo>
  );
}
