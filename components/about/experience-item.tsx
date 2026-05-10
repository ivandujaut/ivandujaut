import { CompanyLogo } from "./company-logo";

interface ExperienceItemProps {
  logoSrc: string;
  logoAlt: string;
  dateRange: string;
  title: string;
  company: string;
  location?: string;
  parallel?: string;
  stack?: string;
  stackLabel?: string;
  children: React.ReactNode;
}

export function ExperienceItem({
  logoSrc,
  logoAlt,
  dateRange,
  title,
  company,
  location,
  parallel,
  stack,
  stackLabel = "Stack",
  children,
}: ExperienceItemProps) {
  return (
    <article className="flex gap-4">
      <CompanyLogo src={logoSrc} alt={logoAlt} size={48} />

      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs text-muted-foreground">{dateRange}</div>

        <h3 className="mt-1 text-base font-semibold">
          {title} · <span className="font-normal">{company}</span>
        </h3>

        {(location || parallel) && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
            {location && <span>{location}</span>}
            {location && parallel && <span aria-hidden>·</span>}
            {parallel && <span className="italic">{parallel}</span>}
          </div>
        )}

        <div className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">{children}</div>

        {stack && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {stackLabel}: {stack}
          </p>
        )}
      </div>
    </article>
  );
}
