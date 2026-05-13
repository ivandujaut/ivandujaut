import { useTranslations } from "next-intl";

export type ProjectStatus = "shipped" | "in-progress" | "archived" | "concept";

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const styles: Record<ProjectStatus, string> = {
  shipped: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
  "in-progress": "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  archived: "bg-zinc-500/10 text-zinc-700 ring-zinc-500/20 dark:text-zinc-400",
  concept: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-400",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations("projects.status");

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ring-inset ${styles[status]} ${className ?? ""}`.trim()}
    >
      {t(status)}
    </span>
  );
}
