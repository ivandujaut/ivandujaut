import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import type { Pitch } from "@/pitches/types";
import { Section } from "../lib/section";

interface CloseProps {
  data: Pitch["close"];
  author: Pitch["author"];
  sources: string[];
}

/** Cierre estático: sin animación a propósito, es donde se toma una decisión. */
export function Close({ data, author, sources }: CloseProps) {
  return (
    <Section id="close" className="pb-16">
      <h2 className="font-serif text-4xl leading-tight font-semibold tracking-tight text-balance md:text-6xl">
        {data.heading}
      </h2>
      <p className="mt-6 max-w-xl text-lg text-(--pitch-ink-dim)">{data.body}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ObfuscatedEmailTrigger
          surface="pitch-close"
          userReversed={author.emailUserReversed}
          domainReversed={author.emailDomainReversed}
          label={data.emailLabel}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} aria-hidden />
          <span>{data.emailLabel}</span>
        </ObfuscatedEmailTrigger>
        <Link
          href={data.siteHref}
          data-ph="contact_click"
          data-ph-kind="site"
          data-ph-surface="pitch-close"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
        >
          <span>{data.siteLabel}</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      </div>

      <footer className="mt-24 border-t border-border pt-8 text-sm text-(--pitch-ink-dim)">
        <p>{data.sourcesLine}</p>
        <details className="mt-3">
          <summary className="cursor-pointer underline-offset-4 hover:underline">
            {data.sourcesToggle.replace("{n}", String(sources.length))}
          </summary>
          <ol className="mt-4 space-y-1.5 font-mono text-xs break-all">
            {sources.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ol>
        </details>
        <p className="mt-6">{data.footnote}</p>
      </footer>
    </Section>
  );
}
