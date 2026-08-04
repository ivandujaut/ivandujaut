import { ViewTransition } from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

// TODO: remove this gate when /research has published content. Until then
// /research/[slug] is fully inaccessible (direct URLs 404).
const RESEARCH_ENABLED = false;
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Pdf01Icon } from "@hugeicons/core-free-icons";
import { useMDXComponent } from "@/lib/mdx";
import {
  findResearchInAnyLocale,
  findTranslatedResearchInLocale,
  getResearch,
  getResearchBySlug,
  getResearchTranslations,
} from "@/lib/content";
import { TranslationMissingPage } from "@/components/common/translation-missing-page";
import { buildContentAlternates, localePath, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShareLinkButton } from "@/components/common/share-link-button";
import { useMDXComponents } from "@/mdx-components";
import { PaperToc } from "@/components/mdx/paper-toc";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Va junto con el `RESEARCH_ENABLED` de arriba: sacar los dos a la vez.
 *
 * Con la sección apagada `generateStaticParams` devuelve una lista vacía, y esa
 * combinación (ruta SSG sin un solo param que prerenderizar) es la que rompía:
 * ante cualquier `/research/<slug>` Next intentaba generar la página en demanda,
 * el render estático tocaba APIs dinámicas y la ruta contestaba **500** en vez
 * del 404 que promete el TODO de arriba.
 *
 * Renderizando en demanda, el `notFound()` de abajo hace lo suyo y la respuesta
 * es un 404 real con la página 404 del sitio, igual que en projects y blog.
 * Mientras no haya papers publicados no se pierde nada: no hay contenido para
 * prerenderizar. Al publicar, esta línea sale y la ruta vuelve a ser estática.
 */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  if (!RESEARCH_ENABLED) return [];
  const allPapers = [...getResearch("es"), ...getResearch("en")];
  return allPapers.map((paper) => ({
    locale: paper.locale,
    slug: paper.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  if (!RESEARCH_ENABLED) return {};
  const { locale, slug } = await params;
  const paper = getResearchBySlug(locale as "es" | "en", slug);

  if (!paper) return {};

  const translations = getResearchTranslations(paper);
  const typedLocale = locale as "es" | "en";
  const isEs = typedLocale === "es";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, `/research/${paper.slug}`)}`;

  return {
    title: paper.title,
    description: paper.description,
    alternates: buildContentAlternates({
      current: { locale: typedLocale, slug: paper.slug },
      translations: translations.map((t) => ({ locale: t.locale, slug: t.slug })),
      basePath: "/research",
    }),
    openGraph: {
      title: paper.title,
      description: paper.description,
      type: "article",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
    },
    twitter: {
      card: "summary_large_image",
      title: paper.title,
      description: paper.description,
    },
  };
}

export default async function ResearchDetailPage({ params }: Props) {
  if (!RESEARCH_ENABLED) notFound();
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as "es" | "en";
  const paper = getResearchBySlug(typedLocale, slug);

  if (!paper) {
    const cross = findResearchInAnyLocale(slug);
    if (!cross) notFound();

    const translated = findTranslatedResearchInLocale(cross.translationKey, typedLocale);
    if (translated) {
      redirect(localePath(typedLocale, `/research/${translated.slug}`));
    }

    return (
      <TranslationMissingPage
        requestedLocale={typedLocale}
        availableLocale={cross.locale as "es" | "en"}
        availableHref={`/research/${cross.slug}`}
        backHref="/research"
      />
    );
  }

  const t = await getTranslations({ locale: typedLocale, namespace: "common.navigation" });
  const tA11y = await getTranslations({ locale: typedLocale, namespace: "common.a11y" });
  const tResearch = await getTranslations({ locale: typedLocale, namespace: "research" });
  const tPaper = await getTranslations({ locale: typedLocale, namespace: "paper" });
  const newTabLabel = tA11y("opensInNewTab");
  const pdfLabel = tResearch("links.pdf");
  const doiLabel = tResearch("links.doi");
  const tocLabel = tPaper("contents");
  const homePath = localePath(typedLocale, "/");
  const researchIndexPath = localePath(typedLocale, "/research");
  const paperPath = localePath(typedLocale, `/research/${paper.slug}`);

  const breadcrumbItems = [
    { label: t("home"), href: homePath },
    { label: t("research"), href: researchIndexPath },
    { label: paper.title },
  ];

  const jsonLd = breadcrumbSchema([
    { name: t("home"), path: homePath },
    { name: t("research"), path: researchIndexPath },
    { name: paper.title, path: paperPath },
  ]);

  return (
    <main id="main">
      <PaperToc containerSelector="#paper-article" label={tocLabel} />
      <article id="paper-article" className="paper relative mx-auto max-w-2xl px-6 py-24">
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <header className="mb-12">
          <ViewTransition name={`research-title-${paper.slug}`} share="morph">
            <h1 className="text-4xl font-semibold tracking-tight">{paper.title}</h1>
          </ViewTransition>
          <p className="mt-3 text-lg italic text-muted-foreground">{paper.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted-foreground">
            <ViewTransition name={`research-year-${paper.slug}`} share="morph">
              <span>{paper.year}</span>
            </ViewTransition>
            <span aria-hidden>·</span>
            <span className="uppercase tracking-wider">{paper.status}</span>
            {paper.venue && (
              <>
                <span aria-hidden>·</span>
                <span>{paper.venue}</span>
              </>
            )}
            <ShareLinkButton
              url={`${SITE_URL}${paperPath}`}
              title={paper.title}
              className="ml-auto"
            />
          </div>

          {(paper.doi || paper.pdf) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {paper.pdf && (
                <a
                  href={paper.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${pdfLabel} (${newTabLabel})`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <HugeiconsIcon icon={Pdf01Icon} size={14} strokeWidth={1.5} aria-hidden />
                  <span>{pdfLabel}</span>
                </a>
              )}
              {paper.doi && (
                <a
                  href={paper.doi.startsWith("http") ? paper.doi : `https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${doiLabel} (${newTabLabel})`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <span>{doiLabel}</span>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </a>
              )}
            </div>
          )}

          {paper.tags && paper.tags.length > 0 && (
            <div className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <hr className="mb-12 border-border" />

        <div className="prose-content">
          <MDXContent code={paper.content} />
        </div>

        <footer className="mt-16 flex flex-wrap items-center gap-4 border-t border-border pt-8">
          <ShareLinkButton url={`${SITE_URL}${paperPath}`} title={paper.title} alwaysShowLabel />
        </footer>
      </article>
    </main>
  );
}

function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  const components = useMDXComponents({});
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={components} />;
}
