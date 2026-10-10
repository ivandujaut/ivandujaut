import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ArrowUpRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { author, close as data, sourceList } from "../brinta.data";
import { Tramo } from "../_components/tramo";

/** Cierre estático: sin animación a propósito, es donde se decide. La cinta termina acá. */
export function Close() {
  const list = sourceList();
  return (
    <Tramo id="cierre" spine="end">
      <h2 className="font-serif text-4xl leading-tight font-semibold tracking-tight text-balance md:text-6xl">
        {data.heading}
      </h2>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-(--ink-dim)">{data.body}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ObfuscatedEmailTrigger
          surface="brinta-close"
          userReversed={author.emailUserReversed}
          domainReversed={author.emailDomainReversed}
          label={data.emailLabel}
          className="inline-flex items-center gap-2 rounded-md bg-(--ink) px-5 py-2.5 text-sm font-medium text-(--paper) transition-opacity hover:opacity-90"
        >
          <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} aria-hidden />
          <span>{data.emailLabel}</span>
        </ObfuscatedEmailTrigger>
        <Link
          href={data.siteHref}
          data-ph="contact_click"
          data-ph-kind="site"
          data-ph-surface="brinta-close"
          className="inline-flex items-center gap-2 rounded-md border border-(--ink-faint) px-5 py-2.5 text-sm transition-colors hover:bg-(--paper-deep)"
        >
          <span>{data.siteLabel}</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      </div>

      <footer className="mt-24 border-t border-(--rule) pt-8 text-sm text-(--ink-dim)">
        <p>{data.sourcesLine}</p>
        <details className="group mt-3">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
            {/* El mismo ícono que los anexos de los casos (`components/mdx/annex.tsx`), no el glifo "▶" del navegador. */}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="shrink-0 transition-transform group-open:rotate-90"
            />
            <span>{data.sourcesToggle.replace("{n}", String(list.length))}</span>
          </summary>
          <ol className="num mt-4 space-y-1.5 text-xs break-all">
            {list.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-(--ink) hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ol>
        </details>
        <p className="mt-6">{data.footnote}</p>
      </footer>
    </Tramo>
  );
}
