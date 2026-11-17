import { ViewTransition } from "react";
import { ListRow } from "@/components/ui/list-row";

interface PostListItemProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  locale: string;
}

export function PostListItem({ slug, title, description, date, locale }: PostListItemProps) {
  return (
    <ListRow href={`/blog/${slug}`} className="py-3">
      <article className="flex items-baseline justify-between gap-4">
        <div className="min-w-0 flex-1">
          <ViewTransition name={`post-title-${slug}`} share="morph">
            <h3 className="truncate text-base font-medium text-foreground transition-colors group-hover:text-foreground">
              {title}
            </h3>
          </ViewTransition>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <ViewTransition name={`post-date-${slug}`} share="morph">
          <time dateTime={date} className="shrink-0 font-mono text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
            })}
          </time>
        </ViewTransition>
      </article>
    </ListRow>
  );
}
