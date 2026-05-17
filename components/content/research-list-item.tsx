import { Link } from "@/i18n/navigation";

type ResearchStatus = "draft" | "preprint" | "published" | "archived";

interface ResearchListItemProps {
  slug: string;
  title: string;
  tagline: string;
  year: number;
  status: ResearchStatus;
  venue?: string;
  tags?: string[];
}

const statusStyles: Record<ResearchStatus, string> = {
  draft: "text-muted-foreground",
  preprint: "text-amber-700 dark:text-amber-400",
  published: "text-emerald-700 dark:text-emerald-400",
  archived: "text-muted-foreground",
};

export function ResearchListItem({
  slug,
  title,
  tagline,
  year,
  status,
  venue,
  tags,
}: ResearchListItemProps) {
  return (
    <Link
      href={`/research/${slug}`}
      className="group -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-muted/40"
    >
      <article>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-lg font-semibold leading-snug">{title}</h3>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">{year}</span>
        </div>
        <p className="mt-1 font-serif text-sm italic text-muted-foreground">{tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className={statusStyles[status]}>{status}</span>
          {venue && (
            <>
              <span aria-hidden>·</span>
              <span>{venue}</span>
            </>
          )}
          {tags && tags.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{tags.slice(0, 3).join(" · ")}</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
