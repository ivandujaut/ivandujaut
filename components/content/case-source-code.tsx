import { getTranslations } from "next-intl/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Link } from "@/i18n/navigation";

/** Base de los links a un archivo del repositorio del sitio, que es público. */
const REPO_BLOB = "https://github.com/ivandujaut/ivandujaut/blob/main";

interface CaseSourceCodeProps {
  locale: "es" | "en";
  slug: string;
  /** Rutas desde la raíz del repo, del frontmatter del caso. */
  code: string[];
}

/**
 * Los scripts que producen los números del caso.
 *
 * Hasta el 18/09/2026 los casos hablaban del script en prosa ("el modelo
 * completo está en el script del caso") y no linkeaban a ninguno, con el
 * repositorio público y los scripts adentro. La promesa que sostiene todo el
 * sitio, que cada cifra se puede recalcular, quedaba en palabra del autor.
 *
 * Va al pie, en la ficha técnica, y no arriba: es una garantía para el que ya
 * leyó y quiere verificar, no una razón para empezar a leer.
 */
export async function CaseSourceCode({ locale, slug, code }: CaseSourceCodeProps) {
  if (code.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "projects.code" });
  const tA11y = await getTranslations({ locale, namespace: "common.a11y" });
  const newTabLabel = tA11y("opensInNewTab");

  return (
    <div className="mt-8">
      <h2 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {t("title")}
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{t("body")}</p>
      <ul className="mt-3 space-y-1.5">
        {code.map((path) => (
          <li key={path}>
            <a
              href={`${REPO_BLOB}/${path}`}
              target="_blank"
              rel="noopener noreferrer"
              data-ph="proof_click"
              data-ph-kind="code"
              data-ph-slug={slug}
              data-ph-locale={locale}
              aria-label={`${path} (${newTabLabel})`}
              className="inline-flex items-center gap-1.5 font-mono text-sm underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              <span>{path}</span>
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.5} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted-foreground">
        <Link
          href="/method"
          className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {t("methodLink")}
        </Link>
      </p>
    </div>
  );
}
