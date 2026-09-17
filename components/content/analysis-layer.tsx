import { getTranslations } from "next-intl/server";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Link } from "@/i18n/navigation";

interface LayerLink {
  slug: string;
  title: string;
  readingMinutes?: number;
}

/**
 * Al pie del pitch, la puerta al análisis completo.
 *
 * Va una sola vez y al final, no como link al respaldo de cada cifra: el test de
 * dos capas mide si quien terminó la versión corta quiere más, y un link en el
 * medio sacaría al lector antes de terminarla. Se mide con `card_click`
 * (`surface=pitch-cta`).
 */
export async function AnalysisCta({
  locale,
  from,
  analysis,
}: {
  locale: "es" | "en";
  from: string;
  analysis: LayerLink;
}) {
  const t = await getTranslations({ locale, namespace: "projects.layers" });
  const tReading = await getTranslations({ locale, namespace: "common.reading" });

  return (
    <aside className="mt-16 rounded-lg border border-border p-6">
      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
        {t("analysisLabel")}
        {analysis.readingMinutes !== undefined && (
          <> · {tReading("minutes", { count: analysis.readingMinutes })}</>
        )}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight">{t("analysisTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("analysisBody")}</p>
      {/* Sin `asChild`: rompe con el `Link` de next-intl (ver stats-grid.tsx). */}
      <AnimateIcon animateOnHover className="mt-5 inline-block">
        <Link
          href={`/projects/${analysis.slug}`}
          data-ph="card_click"
          data-ph-slug={analysis.slug}
          data-ph-surface="pitch-cta"
          data-ph-from={from}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <span>{t("analysisCta")}</span>
          <ArrowRight size={14} strokeWidth={1.5} aria-hidden animation="pointing" />
        </Link>
      </AnimateIcon>
    </aside>
  );
}

/**
 * Arriba del análisis, la vuelta al pitch. Quien llega desde Google o desde un
 * link directo aterriza en la versión larga sin saber que hay una corta.
 * Se mide con `card_click` (`surface=analysis-back`).
 */
export async function ParentNote({
  locale,
  from,
  parent,
}: {
  locale: "es" | "en";
  from: string;
  parent: LayerLink & { readingMinutes: number };
}) {
  const t = await getTranslations({ locale, namespace: "projects.layers" });

  return (
    <p className="mt-6 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      {t.rich("parentNote", {
        title: parent.title,
        minutes: parent.readingMinutes,
        link: (chunks) => (
          <Link
            href={`/projects/${parent.slug}`}
            data-ph="card_click"
            data-ph-slug={parent.slug}
            data-ph-surface="analysis-back"
            data-ph-from={from}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}
