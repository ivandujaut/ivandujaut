import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, GithubIcon } from "@hugeicons/core-free-icons";
import { Link } from "@/i18n/navigation";
import { buildDefaultOgUrl } from "@/lib/og";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const REPO_URL = "https://github.com/ivandujaut/ivandujaut";

/**
 * Orden de las secciones. Vive acá y no en las traducciones porque es una
 * decisión de la página (el recorrido de una cifra, de la fuente al lector),
 * no una cadena traducible: primero de dónde sale el número, después cómo se
 * registra, cómo se verifica, y recién al final qué se hace con él.
 */
const SECTIONS = ["sources", "facts", "code", "archive", "audit", "decision", "limits"] as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";
  const typedLocale = locale as "es" | "en";

  const title = isEs ? "Método · Iván Dujaut" : "Method · Iván Dujaut";
  const description = isEs
    ? "Cómo se produce cada análisis del sitio: los tres niveles de fuente, la hoja de hechos, los cálculos como código, el archivo de las páginas citadas y la revisión cifra por cifra."
    : "How every analysis on this site is produced: the three levels of source, the fact sheet, calculations as code, archived pages, and the figure-by-figure check.";

  const ogImageUrl = buildDefaultOgUrl({ title, description, locale: typedLocale });
  const pageUrl = `${SITE_URL}${localePath(typedLocale, "/method")}`;

  return {
    title: { absolute: title },
    description,
    alternates: buildStaticAlternates(typedLocale, "/method"),
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function MethodPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MethodContent />;
}

function MethodContent() {
  const t = useTranslations("method");
  const tA11y = useTranslations("common.a11y");

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-foreground">{t("intro")}</p>

      <div className="mt-16 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="text-lg font-semibold tracking-tight">
              {t(`sections.${section}.title`)}
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {t(`sections.${section}.body`)}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          {t("projectsCta")}
        </Link>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("repoCta")} (${tA11y("opensInNewTab")})`}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          <HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.5} aria-hidden />
          <span>{t("repoCta")}</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} aria-hidden />
        </a>
      </div>
    </main>
  );
}
