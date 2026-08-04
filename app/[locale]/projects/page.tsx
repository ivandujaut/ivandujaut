import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects, getProjectsBySubject } from "@/lib/content";
import { ProjectListItem } from "@/components/content/project-list-item";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

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
  const t = await getTranslations({ locale, namespace: "projects.sections" });

  // Los productos propios van arriba, y no por ser lo más nuevo (hoy no lo
  // son). Los análisis tienen otras puertas de entrada: el link del primer
  // comentario en LinkedIn y los destacados de la home. Un producto construido
  // no tiene ninguna, así que el lugar visible es para lo que no llega por
  // otro lado.
  const groups = [
    { key: "own" as const, projects: getProjectsBySubject(locale as "es" | "en", "own") },
    { key: "external" as const, projects: getProjectsBySubject(locale as "es" | "en", "external") },
  ];

  // El `isFirst` marca la imagen LCP, así que es una sola en toda la página.
  let rendered = 0;

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24">
      <ProjectsHeader />

      <div className="mt-16 space-y-14">
        {groups.map(
          (group) =>
            group.projects.length > 0 && (
              <section key={group.key}>
                {/* El encabezado tiene que ganarle al primer vistazo: antes era
                    mono/xs/muted y se leía como una etiqueta de sistema, no
                    como la división que organiza la página. */}
                <h2 className="mb-6 text-lg font-semibold tracking-tight">{t(group.key)}</h2>
                <div className="space-y-8">
                  {group.projects.map((project) => (
                    <ProjectListItem
                      key={project.slug}
                      slug={project.slug}
                      title={project.title}
                      tagline={project.tagline}
                      year={project.year}
                      stack={project.stack}
                      status={project.status}
                      kind={project.kind}
                      variant="card"
                      isFirst={rendered++ === 0}
                      cover={
                        project.cover
                          ? {
                              src: project.cover.src.src,
                              alt: project.cover.alt,
                              width: project.cover.src.width,
                              height: project.cover.src.height,
                              blurDataURL: project.cover.src.blurDataURL,
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            ),
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
