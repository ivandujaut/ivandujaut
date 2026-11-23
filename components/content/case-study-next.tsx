import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProjectListItem } from "@/components/content/project-list-item";
import type { ProjectStatus } from "@/components/content/status-badge";
import type { ProjectKind } from "@/components/content/kind-badge";

export interface NextProject {
  slug: string;
  title: string;
  tagline: string;
  date: string;
  kind: ProjectKind;
  status: ProjectStatus;
  /** Para las piezas construidas, que al pie muestran stack y no minutos. */
  stack: string[];
  readingMinutes?: number;
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
  /** `true` si comparte `topic` con el caso que se está leyendo. */
  sameTopic: boolean;
}

/**
 * Qué leer después, al terminar el cuerpo del caso.
 *
 * Vive acá arriba y no en el cierre desde el 18/11/2026. El motivo está
 * medido: de las 254 personas que abrieron `acceso-parte-d` en 120 días, 94
 * cruzaron el hito de lectura y sólo 45 llegaron al 90% del alto, que es donde
 * estaban estas tarjetas. Entre un punto y el otro se perdía la mitad de la
 * mejor audiencia del sitio, y de las 45 que sí llegaron, una clickeó.
 *
 * Son las mismas tarjetas del índice, con portada. Antes eran dos cajas de
 * texto con borde fino, las dos encabezadas por "SOBRE EL MISMO TEMA" y las
 * dos con el badge "CASO DE ESTUDIO": el mismo problema de titulares
 * equivalentes que el índice ya había resuelto, reproducido al pie. La
 * relación se dice una vez, en el encabezado, en vez de dos veces adentro de
 * las tarjetas; lo que distingue a una de otra es la portada y los minutos.
 *
 * Desde el 23/11/2026 va después de "Tu turno" y del bloque de autor, y es la
 * única zona de "seguir leyendo" del final: también lleva "Ver todos los
 * casos", que antes estaba en el cierre. En un caso con análisis completo la
 * tarjeta del análisis sigue arriba, pegada al cuerpo (es la prueba de dos
 * capas); estas tarjetas no compiten con ella porque quedan tres bloques abajo.
 */
export async function CaseStudyNext({
  locale,
  projects,
}: {
  locale: "es" | "en";
  projects: NextProject[];
}) {
  if (projects.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "projects.close" });
  const tReading = await getTranslations({ locale, namespace: "common.reading" });
  const todasDelTema = projects.every((project) => project.sameTopic);

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-6 text-lg font-semibold tracking-tight">
        {todasDelTema ? t("sameTopic") : t("moreLabel")}
      </h2>
      <div
        className={`grid gap-x-5 gap-y-9 ${projects.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {projects.map((project) => (
          <ProjectListItem
            key={project.slug}
            slug={project.slug}
            title={project.title}
            tagline={project.tagline}
            date={project.date}
            locale={locale}
            stack={project.stack}
            readingTime={
              project.readingMinutes
                ? tReading("minutes", { count: project.readingMinutes })
                : undefined
            }
            status={project.status}
            kind={project.kind}
            variant="list"
            surface="next"
            relation={project.sameTopic ? "topic" : "date"}
            cover={project.cover}
          />
        ))}
      </div>

      <Link
        href="/projects"
        className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("allProjects")}
      </Link>
    </section>
  );
}
