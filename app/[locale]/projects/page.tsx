import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEntryProject, getProjects, getProjectsBySubject } from "@/lib/content";
import { ProjectListItem } from "@/components/content/project-list-item";
import {
  ALL_FACET,
  ProjectsFilter,
  type FilteredItem,
  type ProjectsFacet,
} from "@/components/content/projects-filter";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";
import { PageShell } from "@/components/ui/page-shell";

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
    ? "Casos sobre acceso y comercialización en salud en Estados Unidos, seguros en Argentina y pagos en Brasil. Cada uno termina en una decisión, con los datos públicos a la vista."
    : "Cases on access and commercial strategy in US healthcare, insurance in Argentina and payments in Brazil. Each one ends in a decision, with the public data in plain sight.";
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

/**
 * Los mercados del filtro, y qué temas de Velite entran en cada uno.
 *
 * Son tres y no cinco porque pagos, proptech y educación tienen una pieza cada
 * uno: una pestaña que lleva a una sola tarjeta se lee como un estante vacío, no
 * como un mercado del que todavía hay un caso. Cuando alguno llegue a tres
 * piezas se separa.
 *
 * El orden es el de las pestañas, y el primero es el que abre la página.
 */
const FACETS = [
  { id: "salud", topics: ["salud"] },
  { id: "seguros", topics: ["seguros"] },
  { id: "otros", topics: ["fintech", "proptech", "educacion", "web"] },
] as const;

const facetOf = (topic: string) =>
  FACETS.find((facet) => (facet.topics as readonly string[]).includes(topic))?.id ?? "otros";

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as "es" | "en";
  const allProjects = getProjects(typedLocale);
  const entry = getEntryProject(typedLocale);
  const t = await getTranslations({ locale, namespace: "projects.sections" });
  const tReading = await getTranslations({ locale, namespace: "common.reading" });
  // El formateo de los minutos vive acá, que es donde están las traducciones; la
  // tarjeta sólo recibe el texto ya armado.
  const minutos = (count?: number) => (count ? tReading("minutes", { count }) : undefined);
  const tIndex = await getTranslations({ locale, namespace: "projects.index" });
  const tFacets = await getTranslations({ locale, namespace: "projects.facets" });
  const tNotes = await getTranslations({ locale, namespace: "projects.facetNotes" });
  const nota = (id: "salud" | "seguros" | "otros" | "all") =>
    tNotes.rich(id, {
      place: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
    });

  // Los análisis van arriba desde el 11/09/2026. Antes iban los productos
  // propios, con el argumento de que no tenían otra puerta de entrada. Los
  // primeros 24 días de PostHog dijeron lo contrario: el bot recibió 4 clics a
  // su demo, todos de gente que llegó con el link en la mano, y los casos son
  // lo que 20 de 37 sesiones reales vinieron a abrir. En un teléfono, los dos
  // productos empujaban el primer caso 420 px abajo, y los replays del índice
  // mostraban gente recorriendo la lista entera sin elegir nada. Se mide con
  // `card_click` por `surface=index`: la partida es 3 de 21 sesiones.
  //
  // Desde el 18/09/2026 "Analicé" además se subdividía por tema, con un
  // encabezado por mercado. El 18/11/2026 esos encabezados pasaron a ser la
  // fila de pills: eran la misma división, pero sólo visible cuando ya habías
  // scrolleado hasta ella, y con las portadas grandes la página medía 5160 px.
  //
  // El orden dentro de cada mercado sigue siendo por fecha. Es la decisión que
  // más se revisó y la que menos cambió: ordenar por lo que la gente abre
  // suena mejor de lo que es, porque salvo un caso ninguna pieza pasa de 24
  // visitas y un ranking sobre esos números es ruido. La fecha, además, es el
  // mejor argumento del sitio.
  const analyzed = getProjectsBySubject(typedLocale, "external").filter(
    (project) => project.slug !== entry?.slug,
  );
  const built = getProjectsBySubject(typedLocale, "own").filter(
    (project) => project.slug !== entry?.slug,
  );

  const toItem = (project: (typeof analyzed)[number]): FilteredItem => ({
    key: project.slug,
    facet: facetOf(project.topic),
    node: <ProjectCard project={project} locale={typedLocale} minutos={minutos} />,
  });

  const listed = [...analyzed, ...built];
  const facets: ProjectsFacet[] = [
    ...FACETS.map((facet) => ({
      id: facet.id,
      label: tFacets(facet.id),
      note: nota(facet.id),
      count: listed.filter((project) => facetOf(project.topic) === facet.id).length,
    })),
    { id: ALL_FACET, label: tFacets("all"), note: nota("all"), count: listed.length },
  ].filter((facet) => facet.count > 0);

  const sections = [
    { id: "external", title: t("external"), items: analyzed.map(toItem) },
    { id: "own", title: t("own"), items: built.map(toItem) },
  ].filter((section) => section.items.length > 0);

  return (
    <PageShell id="main">
      <ProjectsHeader />

      <div className="mt-16 space-y-14">
        {entry && (
          <section>
            <h2 className="mb-6 text-lg font-semibold tracking-tight">{tIndex("entryTitle")}</h2>
            {/* Fuera del filtro y a lo ancho: es la pieza por la que conviene
                empezar a leer el sitio, no la más nueva de un mercado, así que
                sigue estando cuando el visitante cambia de mercado. */}
            <div className="rise-in">
              <ProjectCard project={entry} locale={typedLocale} minutos={minutos} />
            </div>
          </section>
        )}

        {sections.length > 0 && (
          <ProjectsFilter facets={facets} initialFacet={FACETS[0].id} sections={sections} />
        )}

        {allProjects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
      </div>
    </PageShell>
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
  minutos,
}: {
  project: ReturnType<typeof getProjects>[number];
  locale: "es" | "en";
  minutos: (count?: number) => string | undefined;
}) {
  return (
    <ProjectListItem
      slug={project.slug}
      title={project.title}
      tagline={project.tagline}
      date={project.date}
      locale={locale}
      stack={project.stack}
      readingTime={minutos(project.metadata?.readingTime)}
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
