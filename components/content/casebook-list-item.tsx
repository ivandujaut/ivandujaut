import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type Kind = "rentabilidad" | "market-sizing" | "crecimiento" | "entrada-a-mercado" | "otro";

interface CasebookListItemProps {
  slug: string;
  title: string;
  tagline: string;
  level: number;
  kind: Kind;
}

/**
 * La tarjeta del listado muestra cuatro cosas y ninguna más: título,
 * descripción, nivel y tipo de caso. La ayuda recibida y los conceptos que
 * entrena siguen declarados, pero en la ficha del caso: en una lista sirven
 * para elegir sólo si son pocos, y con nueve conceptos por caso la tarjeta se
 * convertía en un muro de etiquetas que tapaba el título.
 */
export function CasebookListItem({ slug, title, tagline, level, kind }: CasebookListItemProps) {
  const t = useTranslations("casebook");

  return (
    <Link
      href={`/casebook/${slug}`}
      className="group -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-muted/40"
    >
      <article>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-lg font-semibold leading-snug">{title}</h3>
          <span className="shrink-0 rounded-full bg-casebook-soft px-2.5 py-0.5 font-mono text-xs text-casebook">
            {t("level", { level })}
          </span>
        </div>
        <p className="mt-1 font-serif text-sm italic text-muted-foreground">{tagline}</p>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t(`kind.${kind}`)}
        </div>
      </article>
    </Link>
  );
}
