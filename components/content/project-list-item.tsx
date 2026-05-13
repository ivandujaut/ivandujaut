import { ViewTransition } from "react";
import { Link } from "@/i18n/navigation";
import { StatusBadge, type ProjectStatus } from "@/components/content/status-badge";

interface ProjectListItemProps {
  slug: string;
  title: string;
  tagline: string;
  year: number;
  stack: string[];
  status: ProjectStatus;
}

export function ProjectListItem({
  slug,
  title,
  tagline,
  year,
  stack,
  status,
}: ProjectListItemProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-muted/40"
    >
      <article>
        <StatusBadge status={status} className="mb-2" />
        <div className="flex items-baseline justify-between gap-4">
          <ViewTransition name={`project-title-${slug}`} share="morph">
            <h3 className="text-base font-medium">{title}</h3>
          </ViewTransition>
          <ViewTransition name={`project-year-${slug}`} share="morph">
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{year}</span>
          </ViewTransition>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono">{stack.slice(0, 3).join(" · ")}</span>
          {stack.length > 3 && <span className="font-mono">+{stack.length - 3}</span>}
        </div>
      </article>
    </Link>
  );
}
