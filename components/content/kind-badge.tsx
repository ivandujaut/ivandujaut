import { useTranslations } from "next-intl";

export type ProjectKind = "build" | "case-study" | "design";

interface KindBadgeProps {
  kind: ProjectKind;
  className?: string;
}

const styles: Record<ProjectKind, string> = {
  build: "bg-teal-500/10 text-teal-700 ring-teal-500/20 dark:text-teal-400",
  "case-study": "bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-400",
  design: "bg-pink-500/10 text-pink-700 ring-pink-500/20 dark:text-pink-400",
};

/**
 * Qué tipo de trabajo es el proyecto: producto construido, caso de mejora
 * sobre un producto ajeno, o diseño. Complementa a StatusBadge, que marca
 * el ciclo de vida (shipped, en progreso, archivado).
 */
export function KindBadge({ kind, className }: KindBadgeProps) {
  const t = useTranslations("projects.kind");

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ring-inset ${styles[kind]} ${className ?? ""}`.trim()}
    >
      {t(kind)}
    </span>
  );
}
