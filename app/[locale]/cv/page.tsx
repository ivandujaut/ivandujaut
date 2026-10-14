import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Download } from "@/components/animate-ui/icons/download";
import { CvPreview } from "@/components/cv/cv-preview";
import type { Locale } from "@/i18n/routing";
import { CV_PDF } from "@/lib/cv";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Vista previa del CV, en el idioma de la página. Se llega desde los botones
 * del hero y de /about, que la abren en una pestaña nueva: primero se ve, y
 * desde acá se baja.
 *
 * Va con `noindex`. Para un buscador la página es una imagen y un botón, y el
 * texto del CV ya está indexable en el PDF.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    title: { absolute: "CV · Iván Dujaut" },
    description: isEs
      ? "CV de Iván Dujaut, Product Manager, para ver y descargar en PDF."
      : "Iván Dujaut's CV, Product Manager, to view and download as a PDF.",
    robots: { index: false, follow: true },
  };
}

export default async function CvPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CvContent locale={locale as Locale} />;
}

function CvContent({ locale }: { locale: Locale }) {
  const t = useTranslations("cv");
  const pdf = CV_PDF[locale];

  return (
    <main id="main" className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        {/* `kind: "cv-download"` y no `"cv"`: el `"cv"` ya lo manda el botón que
            abrió esta pestaña, y con el mismo nombre cada lector que baja el PDF
            contaría dos veces. Sin `asChild` por el mismo motivo que en el
            hero: esta página es Server Component. */}
        <AnimateIcon animateOnHover className="inline-flex">
          <a
            href={pdf.href}
            download={pdf.filename}
            aria-label={t("download")}
            data-ph="contact_click"
            data-ph-kind="cv-download"
            data-ph-surface="cv-preview"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">{t("download")}</span>
          </a>
        </AnimateIcon>
      </div>

      <CvPreview
        src={pdf.href}
        alt={t("alt")}
        loadingLabel={t("loading")}
        errorLabel={t("error")}
        openPdfLabel={t("openPdf")}
      />
    </main>
  );
}
