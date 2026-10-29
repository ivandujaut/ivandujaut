import Link from "next/link";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { author, caseStudy, close, plan, questions, sourceList } from "../zubale.data";
import { MissingItemMock } from "../_components/missing-item-mock";
import { Cite, Cites, Tramo, TramoHeading } from "../_components/ui";

/** 09 · Un primer paso: el mock y la decisión (por qué, cómo se mide, qué no). */
export function CaseStudy() {
  return (
    <Tramo id="caso" deep>
      <TramoHeading index={caseStudy.index} eyebrow={caseStudy.eyebrow}>
        {caseStudy.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl rounded-2xl border border-(--rule) bg-(--surface) p-6 text-lg">
        <strong className="font-semibold">Objetivo.</strong> {caseStudy.objective}
      </p>
      <p className="reveal mt-6 max-w-2xl text-lg text-(--ink-dim)">
        {caseStudy.intro}
        <Cites ids={caseStudy.introSources} />
      </p>

      <div className="reveal mt-10">
        <MissingItemMock />
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <div className="reveal rounded-2xl border border-(--rule) bg-(--surface) p-6">
          <h3 className="text-lg font-semibold">{caseStudy.why.title}</h3>
          <ol className="mt-4 space-y-3 text-sm text-(--ink-dim)">
            {caseStudy.why.items.map((item, i) => (
              <li key={item.text} className="flex gap-3">
                <span className="mono text-(--ink-faint)">{i + 1}</span>
                <span>
                  {item.text}
                  {"source" in item && item.source ? <Cite id={item.source} /> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="reveal rounded-2xl border border-(--rule) bg-(--surface) p-6">
          <h3 className="text-lg font-semibold">{caseStudy.metrics.title}</h3>
          <p className="mt-4 text-sm">
            <strong className="font-semibold">Mirar primero:</strong> {caseStudy.metrics.north}
          </p>
          <p className="mt-3 text-sm text-(--ink-dim)">{caseStudy.metrics.segments}</p>
          <p className="mt-3 text-sm text-(--ink-dim)">{caseStudy.metrics.guards}</p>
          <p className="mt-3 rounded-lg bg-(--risk-soft) p-3 text-sm">{caseStudy.metrics.cut}</p>
        </div>
        <div className="reveal rounded-2xl border border-(--rule) bg-(--surface) p-6">
          <h3 className="text-lg font-semibold">{caseStudy.notToBuild.title}</h3>
          <ul className="mt-4 space-y-3 text-sm text-(--ink-dim)">
            {caseStudy.notToBuild.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="text-(--risk)">
                  ×
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-(--ink-dim)">
            Qué aceptan reemplazar los compradores, según 84.51°
            <Cite id={caseStudy.notToBuild.source} />
          </p>
        </div>
      </div>
    </Tramo>
  );
}

/** 10 · Preguntas abiertas: el hueco que se deja para la conversación. */
export function OpenQuestions() {
  return (
    <Tramo id="preguntas">
      <TramoHeading index={questions.index} eyebrow={questions.eyebrow}>
        {questions.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg text-(--ink-dim)">{questions.intro}</p>

      <div className="mt-12 space-y-6">
        {questions.items.map((q, i) => (
          <article
            key={q.id}
            className="reveal rounded-2xl border-2 border-dashed border-(--ink-faint) bg-(--surface) p-6 md:p-10"
          >
            <p className="mono text-sm text-(--ink-dim)">Pregunta {i + 1}</p>
            <h3 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">
              {q.question}
            </h3>
            <p className="mt-6 max-w-3xl text-base text-(--ink-dim)">
              <strong className="font-semibold text-(--ink)">Por qué importa.</strong> {q.why}
              <Cites ids={q.whySources} />
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-10">
              <div>
                <p className="text-sm font-semibold">Por dónde empezaría a mirar</p>
                <ul className="mt-3 space-y-3 text-sm text-(--ink-dim)">
                  {q.look.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-(--ink-faint)"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-(--surface-deep) p-4">
                <p className="text-sm font-semibold">Lo que necesito saber de adentro</p>
                <p className="mt-2 text-sm">{q.inside}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Tramo>
  );
}

/** 11 · Cómo arrancaría: la métrica, el plan y las pruebas. */
export function Plan() {
  return (
    <Tramo id="arranque" deep>
      <TramoHeading index={plan.index} eyebrow={plan.eyebrow}>
        {plan.heading}
      </TramoHeading>
      <p className="reveal mt-6 max-w-2xl text-lg text-(--ink-dim)">{plan.intro}</p>

      <div className="reveal mt-10 max-w-3xl rounded-2xl border border-(--rule) bg-(--surface) p-6">
        <p className="text-xs font-medium tracking-wide text-(--ink-dim) uppercase">
          {plan.north.label}
        </p>
        <p className="mt-2 text-2xl font-semibold">{plan.north.value}</p>
        <p className="mt-2 text-sm text-(--ink-dim)">{plan.north.text}</p>
      </div>

      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {plan.phases.map((phase) => (
          <li
            key={phase.id}
            className="reveal rounded-2xl border border-(--rule) bg-(--surface) p-6"
          >
            <p className="mono text-sm text-(--ink-dim)">{phase.title}</p>
            <h3 className="mt-1 text-lg font-semibold">{phase.subtitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-(--ink-dim)">
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <h3 className="reveal mt-16 text-xl font-semibold">{plan.proofs.title}</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {plan.proofs.items.map((p) => (
          <article
            key={p.id}
            className="reveal flex flex-col rounded-2xl border border-(--rule) bg-(--surface) p-6"
          >
            <h4 className="text-lg font-semibold">{p.title}</h4>
            <p className="mt-2 flex-1 text-sm text-(--ink-dim)">{p.text}</p>
            <Link
              href={p.href}
              data-ph="proof_click"
              data-ph-surface="zubale-proofs"
              className="mt-4 text-sm font-semibold underline decoration-(--ink-faint) underline-offset-4 transition-colors hover:decoration-(--ink)"
            >
              {p.hrefLabel}
            </Link>
          </article>
        ))}
      </div>
    </Tramo>
  );
}

/** Cierre estático: sin animación de scroll, es donde se decide. */
export function Close() {
  const list = sourceList();
  return (
    <section id="cierre" className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-10 md:py-24">
        <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">{close.heading}</h2>
        <p className="mt-6 max-w-2xl text-lg text-(--ink-dim)">{close.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ObfuscatedEmailTrigger
            surface="zubale-close"
            userReversed={author.emailUserReversed}
            domainReversed={author.emailDomainReversed}
            label={close.emailLabel}
            className="btn bg-(--ink) text-(--surface) hover:opacity-90"
          >
            <span>{close.emailLabel}</span>
          </ObfuscatedEmailTrigger>
          <Link
            href={close.siteHref}
            data-ph="contact_click"
            data-ph-kind="site"
            data-ph-surface="zubale-close"
            className="btn border border-(--ink-faint) hover:bg-(--surface-deep)"
          >
            {close.siteLabel}
          </Link>
        </div>

        <footer className="mt-24 border-t border-(--rule) pt-8 text-sm text-(--ink-dim)">
          <p>{close.sourcesLine}</p>
          <details className="group mt-3">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden
                className="mono transition-transform duration-500 group-open:rotate-90"
              >
                ›
              </span>
              <span>{close.sourcesToggle.replace("{n}", String(list.length))}</span>
            </summary>
            <ol className="mono mt-4 space-y-2 text-xs break-all">
              {list.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-(--ink) hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          <p className="mt-6">{close.footnote}</p>
        </footer>
      </div>
    </section>
  );
}
