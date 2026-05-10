import { CompanyLogo } from "./company-logo";

interface EducationItemProps {
  logoSrc: string;
  logoAlt: string;
  institution: string;
  degree: string;
  location?: string;
  children?: React.ReactNode;
}

export function EducationItem({
  logoSrc,
  logoAlt,
  institution,
  degree,
  location,
  children,
}: EducationItemProps) {
  return (
    <article className="flex gap-4">
      <CompanyLogo src={logoSrc} alt={logoAlt} size={48} />

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold">{institution}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{degree}</p>

        {location && <p className="mt-1 font-mono text-xs text-muted-foreground">{location}</p>}

        {children && (
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">{children}</div>
        )}
      </div>
    </article>
  );
}
