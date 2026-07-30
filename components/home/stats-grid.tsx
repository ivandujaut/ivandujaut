import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, PencilEdit01Icon, Rocket01Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { ExternalLink } from "@/components/animate-ui/icons/external-link";
import { Link } from "@/i18n/navigation";
import type { AggregatedStats } from "@/lib/stats";

interface StatsGridProps {
  stats: AggregatedStats;
  locale: "es" | "en";
}

const profileUrls = {
  github: "https://github.com/ivandujaut",
  projects: "/projects",
  blog: "/blog",
} as const;

const labels = {
  es: {
    projectsLabel: "Proyectos",
    projectsPublished: "casos publicados",
    projectsShipped: "en producción",
    blogPosts: "posts publicados",
    githubCommits: "commits último año",
    githubStars: "stars",
    githubRepos: "repos",
    fallback: "Próximamente",
  },
  en: {
    projectsLabel: "Projects",
    projectsPublished: "case studies",
    projectsShipped: "shipped",
    blogPosts: "posts published",
    githubCommits: "commits last year",
    githubStars: "stars",
    githubRepos: "repos",
    fallback: "Coming soon",
  },
};

interface StatsCardWrapperProps {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}

const cardClassName =
  "group relative block rounded-lg border border-border p-4 transition-colors hover:bg-muted/40";

const cornerIconClassName =
  "absolute right-3 top-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100";

/**
 * Tarjeta clickeable con una flecha en la esquina que se dibuja al hacer hover
 * sobre la tarjeta entera (no solo sobre el icono, que mide 14px).
 * El glifo distingue destino: `external-link` sale del sitio, `arrow-right` no.
 *
 * Nunca `asChild` desde acá: este es un Server Component y `AnimateIcon` es
 * cliente. Los children que cruzan ese borde no llegan materializados como
 * elemento durante el SSR, y `Slot` lee `children.type` antes de su propio
 * `isValidElement`, así que revienta con "Cannot read properties of undefined
 * (reading 'displayName')". La variante con wrapper (un span) capta el hover
 * igual por burbujeo. En componentes con "use client" `asChild` sí funciona.
 */
function StatsCardWrapper({ href, external = false, children }: StatsCardWrapperProps) {
  if (external) {
    return (
      <AnimateIcon animateOnHover className="block h-full">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cardClassName} h-full`}
        >
          {children}
          <ExternalLink size={14} strokeWidth={1.5} className={cornerIconClassName} aria-hidden />
        </a>
      </AnimateIcon>
    );
  }

  return (
    <AnimateIcon animateOnHover className="block h-full">
      <Link href={href} className={`${cardClassName} h-full`}>
        {children}
        <ArrowRight size={14} strokeWidth={1.5} className={cornerIconClassName} aria-hidden />
      </Link>
    </AnimateIcon>
  );
}

export function StatsGrid({ stats, locale }: StatsGridProps) {
  const t = labels[locale];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Casos de estudio: primero, porque es la métrica que importa para el
          rol al que apunta el sitio. */}
      <StatsCardWrapper href={profileUrls.projects}>
        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Rocket01Icon} size={16} strokeWidth={1.5} />
          <span className="text-xs font-mono uppercase tracking-wider">{t.projectsLabel}</span>
        </div>
        <p className="font-mono text-2xl font-semibold tracking-tight">
          {stats.projects.totalProjects}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{t.projectsPublished}</p>
        {stats.projects.shipped > 0 && (
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">
              {stats.projects.shipped} {t.projectsShipped}
            </span>
          </div>
        )}
      </StatsCardWrapper>

      {/* Blog */}
      <StatsCardWrapper href={profileUrls.blog}>
        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={PencilEdit01Icon} size={16} strokeWidth={1.5} />
          <span className="text-xs font-mono uppercase tracking-wider">Blog</span>
        </div>
        <p className="font-mono text-2xl font-semibold tracking-tight">{stats.blog.totalPosts}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t.blogPosts}</p>
      </StatsCardWrapper>

      {/* GitHub */}
      <StatsCardWrapper href={profileUrls.github} external>
        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.5} />
          <span className="text-xs font-mono uppercase tracking-wider">GitHub</span>
        </div>
        {"error" in stats.github ? (
          <p className="font-mono text-2xl font-semibold tracking-tight text-muted-foreground">
            {t.fallback}
          </p>
        ) : (
          <>
            <p className="font-mono text-2xl font-semibold tracking-tight">
              {stats.github.totalCommits.toLocaleString(locale)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t.githubCommits}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              {/* Un "0 stars" pinta peor que no decir nada. */}
              {stats.github.totalStars > 0 && (
                <>
                  <span className="font-mono">
                    {stats.github.totalStars} {t.githubStars}
                  </span>
                  <span aria-hidden>·</span>
                </>
              )}
              <span className="font-mono">
                {stats.github.publicRepos} {t.githubRepos}
              </span>
            </div>
          </>
        )}
      </StatsCardWrapper>
    </div>
  );
}
