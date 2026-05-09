import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Link04Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

interface AnchorProps {
  id?: string;
  children: ReactNode;
}

interface MdxLinkProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper para headings que muestra un ícono de "anchor" al hover.
 * Permite copiar la URL con #id de la sección.
 */
export function Anchor({ id, children }: AnchorProps) {
  if (!id) return <>{children}</>;

  return (
    <span className="relative inline-flex items-center">
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <HugeiconsIcon
          icon={Link04Icon}
          size={16}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
      </a>
      {children}
    </span>
  );
}

/**
 * Override del elemento <a> en MDX.
 *
 * Detecta automáticamente:
 *   - Links externos (https://...): abre en nueva tab + ícono visual
 *   - Links internos (/algo o #algo): usa next/link para navegación cliente
 */
export function MdxLink({ href = "#", children, className, ...props }: MdxLinkProps) {
  const isExternal = href.startsWith("http");
  const isAnchor = href.startsWith("#");

  const baseClass =
    "underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} inline-flex items-center gap-0.5 ${className ?? ""}`}
        {...props}
      >
        {children}
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={12}
          strokeWidth={1.5}
          className="opacity-60"
        />
      </a>
    );
  }

  if (isAnchor) {
    return (
      <a href={href} className={`${baseClass} ${className ?? ""}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseClass} ${className ?? ""}`} {...props}>
      {children}
    </Link>
  );
}
