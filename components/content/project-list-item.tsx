import { ViewTransition } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { StatusBadge, type ProjectStatus } from "@/components/content/status-badge";

interface ProjectCover {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProjectListItemProps {
  slug: string;
  title: string;
  tagline: string;
  year: number;
  stack: string[];
  status: ProjectStatus;
  /** "row" (default) is the compact text layout; "card" shows a cover preview on top. */
  variant?: "row" | "card";
  cover?: ProjectCover;
}

export function ProjectListItem({
  slug,
  title,
  tagline,
  year,
  stack,
  status,
  variant = "row",
  cover,
}: ProjectListItemProps) {
  const meta = (
    <>
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
    </>
  );

  if (variant === "card") {
    return (
      <Link
        href={`/projects/${slug}`}
        className="group block overflow-hidden rounded-xl border border-border transition-colors hover:bg-muted/30"
      >
        <article>
          <div className="aspect-2/1 overflow-hidden border-b border-border bg-muted/30">
            {cover ? (
              <Image
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-background">
                <span className="px-6 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {title}
                </span>
              </div>
            )}
          </div>
          <div className="p-4">{meta}</div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${slug}`}
      className="group -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-muted/40"
    >
      <article>{meta}</article>
    </Link>
  );
}
