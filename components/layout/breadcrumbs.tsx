import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { getTranslations } from "next-intl/server";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export async function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const t = await getTranslations("common.breadcrumbs");

  return (
    <nav aria-label={t("label")} className={className}>
      <ol className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={`${idx}-${item.label}`}
              className={
                isLast
                  ? "min-w-0 flex-1 truncate text-foreground"
                  : "flex shrink-0 items-center gap-1.5"
              }
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
              {!isLast && (
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={12}
                  strokeWidth={1.5}
                  className="opacity-60"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
