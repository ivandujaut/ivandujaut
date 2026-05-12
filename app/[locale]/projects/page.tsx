import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getProjects, getFeaturedProjects } from "@/lib/content";
import { ProjectListItem } from "@/components/content/project-list-item";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

// ISR: el listado cambia sólo cuando se publica un proyecto nuevo.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";
  const typedLocale = locale as "es" | "en";
  const title = isEs ? "Proyectos" : "Projects";
  const description = isEs
    ? "Casos de estudio de producto end-to-end: proptech, fintech y herramientas internas construidas con Next.js, TypeScript y stack moderno."
    : "End-to-end product case studies: proptech, fintech and internal tools built with Next.js, TypeScript and a modern stack.";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, "/projects")}`;

  return {
    title,
    description,
    alternates: buildStaticAlternates(typedLocale, "/projects"),
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
    },
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allProjects = getProjects(locale as "es" | "en");
  const featured = getFeaturedProjects(locale as "es" | "en");
  const others = allProjects.filter((p) => !p.featured);

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <ProjectsHeader />

      <div className="mt-16 space-y-12">
        {featured.length > 0 && (
          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {locale === "es" ? "Destacados" : "Featured"}
            </h2>
            <div className="space-y-1">
              {featured.map((project) => (
                <ProjectListItem
                  key={project.slug}
                  slug={project.slug}
                  title={project.title}
                  tagline={project.tagline}
                  year={project.year}
                  stack={project.stack}
                  status={project.status}
                />
              ))}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {locale === "es" ? "Más proyectos" : "More projects"}
            </h2>
            <div className="space-y-1">
              {others.map((project) => (
                <ProjectListItem
                  key={project.slug}
                  slug={project.slug}
                  title={project.title}
                  tagline={project.tagline}
                  year={project.year}
                  stack={project.stack}
                  status={project.status}
                />
              ))}
            </div>
          </section>
        )}

        {allProjects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
      </div>
    </main>
  );
}

function ProjectsHeader() {
  const t = useTranslations("projects");
  return (
    <>
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("description")}</p>
    </>
  );
}
