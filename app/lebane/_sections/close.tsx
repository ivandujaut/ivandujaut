import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { allSources } from "../lebane.data";
import { Section } from "../_lib/section";

/** Cierre estático: sin animación a propósito, es donde se toma una decisión. */
export function Close() {
  const sources = allSources();

  return (
    <Section id="close" className="pb-16">
      <h2 className="font-serif text-4xl leading-tight font-semibold tracking-tight text-balance md:text-6xl">
        Me gustaría construir esto adentro.
      </h2>
      <p className="mt-6 max-w-xl text-lg text-(--lebane-ink-dim)">
        Si el caso tiene sentido, lo discutimos con el equipo. Si no lo tiene, también quiero saber
        por qué.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ObfuscatedEmailTrigger
          surface="lebane-close"
          userReversed="navituajud"
          domainReversed="moc.liamg"
          label="Escribime"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.5} aria-hidden />
          <span>Escribime</span>
        </ObfuscatedEmailTrigger>
        <Link
          href="/"
          data-ph="contact_click"
          data-ph-kind="site"
          data-ph-surface="lebane-close"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
        >
          <span>Ver mi trabajo publicado</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      </div>

      <footer className="mt-24 border-t border-border pt-8 text-sm text-(--lebane-ink-dim)">
        <p>Fuentes: cada dato de esta página tiene su origen en el código.</p>
        <details className="mt-3">
          <summary className="cursor-pointer underline-offset-4 hover:underline">
            Ver las {sources.length} fuentes públicas
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
        <p className="mt-6">
          Las cifras del caso (score de obra y adelanto) son datos de ejemplo. Página sin marca ni
          material de Lebane.
        </p>
      </footer>
    </Section>
  );
}
