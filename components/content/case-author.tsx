import { getTranslations } from "next-intl/server";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Download } from "@/components/animate-ui/icons/download";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Link } from "@/i18n/navigation";
import { CV_PAGE } from "@/lib/cv";

/**
 * Quién escribe un caso, en dos lugares: una firma bajo el subtítulo y un bloque
 * apenas termina el cuerpo.
 *
 * Existen desde el 23/11/2026. En los dos meses anteriores, de 224 sesiones que
 * entraron a un caso desde un buscador, 83 lo leyeron entero y ninguna fue a
 * /about ni al CV. El caso no decía quién lo había escrito, y el único bloque
 * con contacto (`CaseStudyClose`) quedaba al fondo, después de la ficha
 * técnica, preguntando qué haría distinto el lector: le habla al que trabaja en
 * la industria, no al que quiere saber quién es el autor. Una visita de Francia
 * que llegó al análisis de Leqembi desde un documento de Word salió a /about a
 * los cinco segundos: tuvo que irse de la página para averiguarlo.
 *
 * El bloque va después del cuerpo (y del CTA al análisis completo, si lo hay) y
 * antes de las tarjetas de otros casos: ese es el punto donde el lector ya leyó
 * y todavía no se fue. No repite los contactos del cierre; ofrece las dos cosas
 * que preceden a escribir: quién es y el CV.
 *
 * Se mide con `author_click` (`surface`: `case-byline` o `case-author`) hacia
 * /about y con `contact_click` (`kind: "cv"`, `surface: "case-author"`) hacia el
 * CV, con el `slug` del caso en los dos.
 */
export async function CaseByline({ locale, slug }: { locale: "es" | "en"; slug: string }) {
  const t = await getTranslations({ locale, namespace: "projects.author" });

  return (
    <p className="mt-4 text-sm text-muted-foreground">
      {t.rich("byline", {
        link: (chunks) => (
          <Link
            href="/about"
            data-ph="author_click"
            data-ph-surface="case-byline"
            data-ph-slug={slug}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}

export async function CaseAuthor({ locale, slug }: { locale: "es" | "en"; slug: string }) {
  const t = await getTranslations({ locale, namespace: "projects.author" });

  return (
    <aside className="mt-16 rounded-lg border border-border p-6">
      <Eyebrow>{t("label")}</Eyebrow>
      <p className="mt-2 text-xl font-semibold tracking-tight">{t("name")}</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{t("role")}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("body")}</p>

      {/* Sin `asChild`: rompe con el `Link` de next-intl (ver hero.tsx). */}
      <div className="mt-5 flex flex-wrap gap-3">
        <AnimateIcon animateOnHover className="inline-flex">
          <Link
            href="/about"
            data-ph="author_click"
            data-ph-surface="case-author"
            data-ph-slug={slug}
            className="inline-flex items-center gap-1.5 rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <span>{t("ctas.about")}</span>
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden animation="pointing" />
          </Link>
        </AnimateIcon>
        <AnimateIcon animateOnHover className="inline-flex">
          <Link
            href={CV_PAGE}
            target="_blank"
            data-ph="contact_click"
            data-ph-kind="cv"
            data-ph-surface="case-author"
            data-ph-slug={slug}
            className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/7 px-4 py-2 text-sm transition-colors hover:bg-foreground/12"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden />
            <span>{t("ctas.cv")}</span>
          </Link>
        </AnimateIcon>
      </div>
    </aside>
  );
}
