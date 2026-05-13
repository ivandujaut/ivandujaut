"use client";

import type { CSSProperties, ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  style?: CSSProperties;
  onSelect?: () => void;
  children: ReactNode;
}

export function NavLink({
  href,
  className,
  activeClassName,
  style,
  onSelect,
  children,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      style={style}
      aria-current={isActive ? "page" : undefined}
      onClick={onSelect}
      className={`${className ?? ""} ${isActive ? (activeClassName ?? "") : ""}`.trim()}
    >
      {children}
    </Link>
  );
}
