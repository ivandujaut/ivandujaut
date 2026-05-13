import { Link } from "@/i18n/navigation";

export interface NotFoundCta {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

interface NotFoundPageProps {
  title: string;
  description: string;
  ctas: NotFoundCta[];
}

export function NotFoundPage({ title, description, ctas }: NotFoundPageProps) {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-24"
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      {ctas.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {ctas.map((cta) => {
            const isPrimary = (cta.variant ?? "secondary") === "primary";
            return (
              <Link
                key={cta.href}
                href={cta.href}
                className={
                  isPrimary
                    ? "inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    : "inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                }
              >
                {cta.label}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
