import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  CodeIcon,
  PencilEdit01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { Link } from "@/i18n/navigation";
import type { AggregatedStats } from "@/lib/stats";

interface StatsGridProps {
  stats: AggregatedStats;
  locale: "es" | "en";
}

const profileUrls = {
  github: "https://github.com/ivandujaut",
  leetcode: "https://leetcode.com/u/ivandujaut",
  blog: "/blog",
} as const;

const labels = {
  es: {
    githubCommits: "commits último año",
    githubStars: "stars",
    githubRepos: "repos",
    leetcodeSolved: "problemas resueltos",
    leetcodeRanking: "ranking global",
    blogPosts: "posts publicados",
    fallback: "Próximamente",
  },
  en: {
    githubCommits: "commits last year",
    githubStars: "stars",
    githubRepos: "repos",
    leetcodeSolved: "problems solved",
    leetcodeRanking: "global ranking",
    blogPosts: "posts published",
    fallback: "Coming soon",
  },
};

interface StatsCardWrapperProps {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}

function StatsCardWrapper({ href, external = false, children }: StatsCardWrapperProps) {
  const className =
    "group relative block rounded-lg border border-border p-4 transition-colors hover:bg-muted/40";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={14}
          strokeWidth={1.5}
          className="absolute right-3 top-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        size={14}
        strokeWidth={1.5}
        className="absolute right-3 top-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}

export function StatsGrid({ stats, locale }: StatsGridProps) {
  const t = labels[locale];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              <span className="font-mono">
                {stats.github.totalStars} {t.githubStars}
              </span>
              <span aria-hidden>·</span>
              <span className="font-mono">
                {stats.github.publicRepos} {t.githubRepos}
              </span>
            </div>
          </>
        )}
      </StatsCardWrapper>

      {/* LeetCode */}
      <StatsCardWrapper href={profileUrls.leetcode} external>
        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={CodeIcon} size={16} strokeWidth={1.5} />
          <span className="text-xs font-mono uppercase tracking-wider">LeetCode</span>
        </div>
        {"error" in stats.leetcode ? (
          <p className="font-mono text-2xl font-semibold tracking-tight text-muted-foreground">
            {t.fallback}
          </p>
        ) : (
          <>
            <p className="font-mono text-2xl font-semibold tracking-tight">
              {stats.leetcode.totalSolved}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t.leetcodeSolved}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {stats.leetcode.easySolved}E
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                {stats.leetcode.mediumSolved}M
              </span>
              <span className="font-mono text-red-600 dark:text-red-400">
                {stats.leetcode.hardSolved}H
              </span>
            </div>
          </>
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
    </div>
  );
}
