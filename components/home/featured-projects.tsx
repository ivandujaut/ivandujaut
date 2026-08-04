import { Link } from "@/i18n/navigation";
import { ProjectListItem } from "@/components/content/project-list-item";
import { getFeaturedProjects } from "@/lib/content";

interface FeaturedProjectsProps {
  locale: "es" | "en";
}

const labels = {
  es: { title: "Proyectos destacados", viewAll: "Ver todos" },
  en: { title: "Featured projects", viewAll: "View all" },
};

/**
 * Tope de casos en la home. La curaduría la hace el frontmatter (`featured`),
 * pero el corte evita que la home crezca sin querer si se marca uno de más:
 * arriba de tres, el listado deja de leerse y empieza a scrollearse.
 */
const HOME_LIMIT = 3;

export function FeaturedProjects({ locale }: FeaturedProjectsProps) {
  const projects = getFeaturedProjects(locale).slice(0, HOME_LIMIT);

  if (projects.length === 0) return null;

  const t = labels[locale];

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t.title}
        </h2>
        <Link
          href="/projects"
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.viewAll}
        </Link>
      </div>
      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectListItem
            key={project.slug}
            slug={project.slug}
            title={project.title}
            tagline={project.tagline}
            year={project.year}
            stack={project.stack}
            status={project.status}
            kind={project.kind}
          />
        ))}
      </div>
    </section>
  );
}
