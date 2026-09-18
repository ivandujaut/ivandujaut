import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEntryProject, getProjects, getProjectsBySubject } from "@/lib/content";
import { ProjectListItem } from "@/components/content/project-list-item";
import { FeedLink } from "@/components/common/feed-link";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";
  const typedLocale = locale as "es" | "en";
  const title = isEs ? "Proyectos" : "Projects";
  // La descripción anterior hablaba de proptech, fintech y herramientas internas
  // construidas con Next.js: quedó de la primera versión del sitio y describía
  // un portfolio de desarrollo. Catorce de los dieciséis casos publicados son
  // análisis de mercado con datos públicos, y siete de los ocho más recientes
  // son del mercado de salud de Estados Unidos.
  const description = isEs
    ? "Decisiones de negocio contestadas con datos públicos: acceso y comercialización en salud en Estados Unidos, seguros en Argentina y pagos en Brasil. Cada cifra traza a su fuente."
    : "Business decisions answered with public data: access and commercial strategy in US healthcare, insurance in Argentina and payments in Brazil. Every figure traces back to its source.";
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

  const typedLocale = locale as "es" | "en";
  const allProjects = getProjects(typedLocale);
  const entry = getEntryProject(typedLocale);
  const t = await getTranslations({ locale, namespace: "projects.sections" });
  const tTopics = await getTranslations({ locale, namespace: "projects.topics" });
  const tIndex = await getTranslations({ locale, namespace: "projects.index" });

  // Los análisis van arriba desde el 11/09/2026. Antes iban los productos
  // propios, con el argumento de que no tenían otra puerta de entrada. Los
  // primeros 24 días de PostHog dijeron lo contrario: el bot recibió 4 clics a
  // su demo, todos de gente que llegó con el link en la mano, y los casos son
  // lo que 20 de 37 sesiones reales vinieron a abrir. En un teléfono, los dos
  // productos empujaban el primer caso 420 px abajo, y los replays del índice
  // mostraban gente recorriendo la lista entera sin elegir nada. Se mide con
  // `card_click` por `surface=index`: la partida es 3 de 21 sesiones.
  //
  // Desde el 18/09/2026 "Analicé" además se subdivide por tema. Catorce
  // titulares seguidos, todos con el mismo badge y el mismo año, no son una
  // lista que se elige: son una lista que se recorre. El orden de los
  // subgrupos lo decide la pieza más nueva de cada uno, así que el tema en el
  // que Iván está trabajando queda arriba sin que nadie lo acomode a mano.
  const analyzed = getProjectsBySubject(typedLocale, "external").filter(
    (project) => project.slug !== entry?.slug,
  );
  const built = getProjectsBySubject(typedLocale, "own").filter(
    (project) => project.slug !== entry?.slug,
  );

  const byTopic = new Map<string, typeof analyzed>();
  for (const project of analyzed) {
    byTopic.set(project.topic, [...(byTopic.get(project.topic) ?? []), project]);
  }

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24">
      <ProjectsHeader />

      <div className="mt-16 space-y-14">
        {entry && (
          <section>
            <h2 className="mb-6 text-lg font-semibold tracking-tight">{tIndex("entryTitle")}</h2>
            <div className="divide-y divide-border/60">
              <ProjectCard project={entry} locale={typedLocale} />
            </div>
          </section>
        )}

        {analyzed.length > 0 && (
          <section>
            {/* El encabezado tiene que ganarle al primer vistazo: antes era
                mono/xs/muted y se leía como una etiqueta de sistema, no
                como la división que organiza la página. */}
            <h2 className="mb-6 text-lg font-semibold tracking-tight">{t("external")}</h2>
            <div className="space-y-10">
              {[...byTopic.entries()].map(([topic, projectsInTopic]) => (
                <div key={topic}>
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {tTopics(topic)}
                  </h3>
                  <div className="divide-y divide-border/60">
                    {projectsInTopic.map((project) => (
                      <ProjectCard key={project.slug} project={project} locale={typedLocale} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {built.length > 0 && (
          <section>
            <h2 className="mb-6 text-lg font-semibold tracking-tight">{t("own")}</h2>
            <div className="divide-y divide-border/60">
              {built.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={typedLocale} />
              ))}
            </div>
          </section>
        )}

        {allProjects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
      </div>

      <FeedLink
        locale={typedLocale}
        surface="index"
        className="mt-14 border-t border-border pt-8"
      />
    </main>
  );
}

/**
 * La tarjeta del listado. Vive acá y no en `ProjectListItem` porque lo único
 * que agrega es el mapeo de la portada de Velite a props planas, y ese mapeo
 * se repetía en cada uno de los tres grupos.
 */
function ProjectCard({
  project,
  locale,
}: {
  project: ReturnType<typeof getProjects>[number];
  locale: "es" | "en";
}) {
  return (
    <ProjectListItem
      slug={project.slug}
      title={project.title}
      tagline={project.tagline}
      date={project.date}
      locale={locale}
      stack={project.stack}
      status={project.status}
      kind={project.kind}
      variant="list"
      surface="index"
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
