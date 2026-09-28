import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type Help = "guided" | "hints" | "solo";
type Kind = "rentabilidad" | "market-sizing" | "crecimiento" | "entrada-a-mercado" | "otro";

interface CasebookListItemProps {
  slug: string;
  title: string;
  tagline: string;
  level: number;
  help: Help;
  kind: Kind;
  concepts: string[];
}

/**
 * La ayuda se muestra con color, no sólo con texto: es el dato que sostiene la
 * curva de la serie, y en una lista de diez casos la diferencia entre "con
 * guía" y "sin ayuda" tiene que leerse de un vistazo.
 */
const helpStyles: Record<Help, string> = {
  guided: "text-muted-foreground",
  hints: "text-amber-700 dark:text-amber-400",
  solo: "text-emerald-700 dark:text-emerald-400",
};

export function CasebookListItem({
  slug,
  title,
  tagline,
  level,
  help,
  kind,
  concepts,
}: CasebookListItemProps) {
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
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{t(`kind.${kind}`)}</span>
          <span aria-hidden>·</span>
          <span className={helpStyles[help]}>{t(`help.${help}`)}</span>
          {concepts.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span className="normal-case tracking-normal">
                {concepts.slice(0, 3).join(" · ")}
              </span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
