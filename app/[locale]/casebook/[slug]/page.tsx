import { ViewTransition } from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { useMDXComponent } from "@/lib/mdx";
import {
  findCasebookCaseInAnyLocale,
  findTranslatedCasebookCaseInLocale,
  getCasebook,
  getCasebookCaseBySlug,
  getCasebookTranslations,
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

export function generateStaticParams() {
  const allCases = [...getCasebook("es"), ...getCasebook("en")];
  return allCases.map((item) => ({
    locale: item.locale,
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const typedLocale = locale as "es" | "en";
  const item = getCasebookCaseBySlug(typedLocale, slug);

  if (!item) return {};

  const translations = getCasebookTranslations(item);
  const isEs = typedLocale === "es";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, `/casebook/${item.slug}`)}`;

  return {
    title: item.title,
    description: item.description,
    // Un borrador se ve en desarrollo para poder editarlo, pero no entra al
    // índice de Google: el caso todavía no pasó por la revisión de Iván.
    ...(item.draft ? { robots: { index: false, follow: false } } : {}),
    alternates: buildContentAlternates({
      current: { locale: typedLocale, slug: item.slug },
      translations: translations.map((t) => ({ locale: t.locale, slug: t.slug })),
      basePath: "/casebook",
    }),
    openGraph: {
      title: item.title,
      description: item.description,
      type: "article",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
    },
  };
}

export default async function CasebookDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as "es" | "en";
  const item = getCasebookCaseBySlug(typedLocale, slug);

  if (!item) {
    const cross = findCasebookCaseInAnyLocale(slug);
    if (!cross) notFound();

    const translated = findTranslatedCasebookCaseInLocale(cross.translationKey, typedLocale);
    if (translated) {
      redirect(localePath(typedLocale, `/casebook/${translated.slug}`));
    }

    return (
      <TranslationMissingPage
        requestedLocale={typedLocale}
        availableLocale={cross.locale as "es" | "en"}
        availableHref={`/casebook/${cross.slug}`}
        backHref="/casebook"
      />
    );
  }

  const t = await getTranslations({ locale: typedLocale, namespace: "common.navigation" });
  const tCasebook = await getTranslations({ locale: typedLocale, namespace: "casebook" });
  const tPaper = await getTranslations({ locale: typedLocale, namespace: "paper" });
  const tA11y = await getTranslations({ locale: typedLocale, namespace: "common.a11y" });
  const tocLabel = tPaper("contents");
  const homePath = localePath(typedLocale, "/");
  const casebookIndexPath = localePath(typedLocale, "/casebook");
  const casePath = localePath(typedLocale, `/casebook/${item.slug}`);

  const breadcrumbItems = [
    { label: t("home"), href: homePath },
    { label: t("casebook"), href: casebookIndexPath },
    { label: item.title },
  ];

  const jsonLd = breadcrumbSchema([
    { name: t("home"), path: homePath },
    { name: t("casebook"), path: casebookIndexPath },
    { name: item.title, path: casePath },
  ]);

  return (
    <main id="main">
      <PaperToc containerSelector="#casebook-article" label={tocLabel} />
      <article id="casebook-article" className="paper relative mx-auto max-w-2xl px-6 py-24">
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <header className="mb-12">
          <ViewTransition name={`casebook-title-${item.slug}`} share="morph">
            <h1 className="text-4xl font-semibold tracking-tight">{item.title}</h1>
          </ViewTransition>
          <p className="mt-3 text-lg italic text-muted-foreground">{item.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted-foreground">
            <ViewTransition name={`casebook-level-${item.slug}`} share="morph">
              <span>{tCasebook("level", { level: item.level })}</span>
            </ViewTransition>
            <span aria-hidden>·</span>
            <span className="uppercase tracking-wider">{tCasebook(`kind.${item.kind}`)}</span>
            <span aria-hidden>·</span>
            <span>{tCasebook(`help.${item.help}`)}</span>
            <ShareLinkButton
              url={`${SITE_URL}${casePath}`}
              title={item.title}
              className="ml-auto"
            />
          </div>

          {/*
            De dónde sale el planteo, arriba y no al pie: un casebook que
            publica casos de entrevista tiene que decir en la primera pantalla
            cuáles son propios y cuáles adaptan uno ajeno.
          */}
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium">{tCasebook(`origin.${item.origin.kind}`)}.</span>{" "}
            {item.origin.url ? (
              <a
                href={item.origin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {item.origin.note}
                <span className="sr-only"> ({tA11y("opensInNewTab")})</span>
              </a>
            ) : (
              item.origin.note
            )}
          </p>

          <div className="mt-8">
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {tCasebook("concepts")}
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {item.concepts.map((concept) => (
                <li
                  key={concept}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {concept}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <hr className="mb-12 border-border" />

        <div className="prose-content">
          <MDXContent code={item.content} />
        </div>

        <footer className="mt-16 border-t border-border pt-8">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {tCasebook("sourcesLabel")}
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {item.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {source.name}
                  <span className="sr-only"> ({tA11y("opensInNewTab")})</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ShareLinkButton url={`${SITE_URL}${casePath}`} title={item.title} alwaysShowLabel />
          </div>
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
