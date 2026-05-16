import { ViewTransition } from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { useMDXComponent } from "@/lib/mdx";
import {
  findProjectInAnyLocale,
  findTranslatedProjectInLocale,
  getProjectBySlug,
  getProjects,
  getProjectTranslations,
} from "@/lib/content";
import { TranslationMissingPage } from "@/components/common/translation-missing-page";
import { buildContentAlternates, localePath, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ViewCounter } from "@/components/blog/view-counter";
import { LikeButton } from "@/components/blog/like-button";
import { getCachedViews } from "@/lib/views";
import { StatusBadge } from "@/components/content/status-badge";
import { ShareLinkButton } from "@/components/common/share-link-button";
import { useMDXComponents } from "@/mdx-components";
import { buildCoverUrl, buildProjectOgUrl } from "@/lib/og";
import { PaperToc } from "@/components/mdx/paper-toc";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const allProjects = [...getProjects("es"), ...getProjects("en")];
  return allProjects.map((project) => ({
    locale: project.locale,
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(locale as "es" | "en", slug);

  if (!project) return {};

  const ogImageUrl = buildProjectOgUrl({
    title: project.title,
    description: project.description,
    stack: project.stack,
    status: project.status,
    coverUrl: buildCoverUrl(project.cover?.src.src),
    locale: locale as "es" | "en",
  });

  const translations = getProjectTranslations(project);
  const typedLocale = locale as "es" | "en";
  const isEs = typedLocale === "es";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, `/projects/${project.slug}`)}`;

  return {
    title: project.title,
    description: project.description,
    alternates: buildContentAlternates({
      current: { locale: typedLocale, slug: project.slug },
      translations: translations.map((t) => ({ locale: t.locale, slug: t.slug })),
      basePath: "/projects",
    }),
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as "es" | "en";
  const project = getProjectBySlug(typedLocale, slug);

  if (!project) {
    const cross = findProjectInAnyLocale(slug);
    if (!cross) notFound();

    const translated = findTranslatedProjectInLocale(cross.translationKey, typedLocale);
    if (translated) {
      redirect(localePath(typedLocale, `/projects/${translated.slug}`));
    }

    return (
      <TranslationMissingPage
        requestedLocale={typedLocale}
        availableLocale={cross.locale as "es" | "en"}
        availableHref={`/projects/${cross.slug}`}
        backHref="/projects"
      />
    );
  }

  const t = await getTranslations({ locale: typedLocale, namespace: "common.navigation" });
  const tA11y = await getTranslations({ locale: typedLocale, namespace: "common.a11y" });
  const tProjects = await getTranslations({ locale: typedLocale, namespace: "projects" });
  const tPaper = await getTranslations({ locale: typedLocale, namespace: "paper" });
  const newTabLabel = tA11y("opensInNewTab");
  const demoLabel = tProjects("links.demo");
  const repoLabel = tProjects("links.repo");
  const stackLabel = tProjects("sections.stack");
  const tocLabel = tPaper("contents");
  const homePath = localePath(typedLocale, "/");
  const projectsIndexPath = localePath(typedLocale, "/projects");
  const projectPath = localePath(typedLocale, `/projects/${project.slug}`);

  const breadcrumbItems = [
    { label: t("home"), href: homePath },
    { label: t("projects"), href: projectsIndexPath },
    { label: project.title },
  ];

  const jsonLd = breadcrumbSchema([
    { name: t("home"), path: homePath },
    { name: t("projects"), path: projectsIndexPath },
    { name: project.title, path: projectPath },
  ]);

  const initialViews = await getCachedViews("projects", slug);

  return (
    <main id="main">
      <PaperToc containerSelector="#paper-article" label={tocLabel} />
      <article id="paper-article" className="paper relative mx-auto max-w-2xl px-6 py-24">
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <header className="mb-12">
          <ViewTransition name={`project-title-${project.slug}`} share="morph">
            <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>
          </ViewTransition>
          <p className="mt-3 text-lg text-muted-foreground">{project.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted-foreground">
            <ViewTransition name={`project-year-${project.slug}`} share="morph">
              <span>{project.year}</span>
            </ViewTransition>
            <span aria-hidden>·</span>
            <span>{project.role}</span>
            <span aria-hidden>·</span>
            <StatusBadge status={project.status} />
            <span aria-hidden>·</span>
            <ViewCounter kind="projects" slug={slug} initialViews={initialViews} />
            <ShareLinkButton
              url={`${SITE_URL}${projectPath}`}
              title={project.title}
              className="ml-auto"
            />
          </div>

          {(project.repo || project.demo) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${demoLabel} (${newTabLabel})`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <span>{demoLabel}</span>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${repoLabel} (${newTabLabel})`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  <HugeiconsIcon icon={GithubIcon} size={14} strokeWidth={1.5} aria-hidden />
                  <span>{repoLabel}</span>
                </a>
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {stackLabel}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <hr className="mb-12 border-border" />

        <div className="prose-content">
          <MDXContent code={project.content} />
        </div>

        <footer className="mt-16 flex flex-wrap items-center gap-4 border-t border-border pt-8">
          <LikeButton kind="projects" slug={slug} />
          <ShareLinkButton
            url={`${SITE_URL}${projectPath}`}
            title={project.title}
            alwaysShowLabel
          />
        </footer>
      </article>
    </main>
  );
}

function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  const components = useMDXComponents({});
  // Server Component: corre una vez por request, no hay re-render que pueda
  // reiniciar estado del componente compilado por Velite.
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={components} />;
}
