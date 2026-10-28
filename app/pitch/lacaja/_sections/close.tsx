import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ArrowUpRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { author, close, sourceList } from "../lacaja.data";

/**
 * Cierre estático: sin animación a propósito, es donde se decide. Las fuentes
 * van en carbón, como el pie del sitio de La Caja.
 */
export function Close() {
  const list = sourceList();
  return (
    <section id="cierre" className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-10 md:py-24">
        <h2 className="font-serif text-4xl leading-tight md:text-6xl">{close.heading}</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-(--ink-dim)">{close.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ObfuscatedEmailTrigger
            surface="lacaja-close"
            userReversed={author.emailUserReversed}
            domainReversed={author.emailDomainReversed}
            label={close.emailLabel}
            className="btn bg-(--red) text-white hover:bg-[#a51714]"
          >
            <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.75} aria-hidden />
            <span>{close.emailLabel}</span>
          </ObfuscatedEmailTrigger>
          <Link
            href={close.siteHref}
            data-ph="contact_click"
            data-ph-kind="site"
            data-ph-surface="lacaja-close"
            className="btn border border-(--ink-faint) text-(--ink) hover:bg-(--surface-deep)"
          >
            <span>{close.siteLabel}</span>
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>

      <footer className="bg-(--coal) text-sm text-(--coal-text)">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-10">
          <p className="text-white">{close.sourcesLine}</p>
          <details className="group mt-3">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 underline-offset-4 hover:text-white hover:underline [&::-webkit-details-marker]:hidden">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={1.5}
                aria-hidden
                className="shrink-0 transition-transform group-open:rotate-90"
              />
              <span>{close.sourcesToggle.replace("{n}", String(list.length))}</span>
            </summary>
            <ol className="mono mt-4 space-y-2 text-xs break-all">
              {list.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          <p className="mt-6 max-w-3xl">{close.footnote}</p>
        </div>
      </footer>
    </section>
  );
}
