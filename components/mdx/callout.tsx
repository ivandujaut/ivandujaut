import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Idea01Icon,
} from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger" | "success" | "insight";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const config: Record<
  CalloutType,
  {
    icon: typeof InformationCircleIcon;
    className: string;
    iconClass: string;
  }
> = {
  info: {
    icon: InformationCircleIcon,
    className: "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: Alert02Icon,
    className: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    icon: AlertCircleIcon,
    className: "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30",
    iconClass: "text-red-600 dark:text-red-400",
  },
  success: {
    icon: CheckmarkCircle02Icon,
    className: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  insight: {
    icon: Idea01Icon,
    className: "border-violet-200 bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/30",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon, className, iconClass } = config[type];

  return (
    <aside
      data-callout-type={type}
      role="note"
      className={`my-6 flex gap-3 rounded-lg border px-4 py-3 ${className}`}
    >
      <HugeiconsIcon
        icon={icon}
        size={20}
        strokeWidth={1.5}
        className={`mt-0.5 shrink-0 ${iconClass}`}
      />
      <div className="flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </aside>
  );
}
