import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { useMDXComponent } from "@/lib/mdx";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { useMDXComponents } from "@/mdx-components";

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

  return {
    title: project.title,
    description: project.description,
  };
}

const statusLabels: Record<string, { es: string; en: string }> = {
  shipped: { es: "Shipped", en: "Shipped" },
  "in-progress": { es: "En progreso", en: "In progress" },
  archived: { es: "Archivado", en: "Archived" },
  concept: { es: "Concepto", en: "Concept" },
};

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProjectBySlug(locale as "es" | "en", slug);
  if (!project) notFound();

  const status = statusLabels[project.status]?.[locale as "es" | "en"] ?? project.status;

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{project.tagline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted-foreground">
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{project.role}</span>
          <span aria-hidden>·</span>
          <span>{status}</span>
        </div>

        {(project.repo || project.demo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <span>{locale === "es" ? "Ver demo" : "Live demo"}</span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <HugeiconsIcon icon={GithubIcon} size={14} strokeWidth={1.5} />
                <span>{locale === "es" ? "Repositorio" : "Repository"}</span>
              </a>
            )}
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Stack
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
    </article>
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
