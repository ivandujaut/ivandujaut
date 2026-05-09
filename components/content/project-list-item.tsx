import { Link } from "@/i18n/navigation";

interface ProjectListItemProps {
  slug: string;
  title: string;
  tagline: string;
  year: number;
  stack: string[];
  status: "shipped" | "in-progress" | "archived" | "concept";
}

const statusLabels: Record<ProjectListItemProps["status"], string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  archived: "Archived",
  concept: "Concept",
};

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
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-medium">{title}</h3>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">{year}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono">{statusLabels[status]}</span>
          <span aria-hidden>·</span>
          <span className="font-mono">{stack.slice(0, 3).join(" · ")}</span>
          {stack.length > 3 && <span className="font-mono">+{stack.length - 3}</span>}
        </div>
      </article>
    </Link>
  );
}
