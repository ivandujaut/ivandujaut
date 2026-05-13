import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { TranslateIcon } from "@hugeicons/core-free-icons";

type Locale = "es" | "en";

interface TranslationMissingPageProps {
  /** El locale activo que NO tiene el contenido. */
  requestedLocale: Locale;
  /** El locale donde sí existe el contenido. */
  availableLocale: Locale;
  /** Path absoluto al contenido disponible, ya con prefijo del locale. */
  availableHref: string;
  /** Path al listado de la sección, en el locale activo. */
  backHref: string;
}

export async function TranslationMissingPage({
  requestedLocale,
  availableLocale,
  availableHref,
  backHref,
}: TranslationMissingPageProps) {
  const t = await getTranslations({
    locale: requestedLocale,
    namespace: "common.translationMissing",
  });

  const localeName = t(`languages.${requestedLocale}`);
  const otherName = t(`languages.${availableLocale}`);

  return (
    <main
      id="main"
      className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-24"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
        <HugeiconsIcon icon={TranslateIcon} size={18} strokeWidth={1.5} aria-hidden />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {t("description", { locale: localeName, other: otherName })}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={availableHref}
          locale={availableLocale}
          className="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          {t("actions.readInOther", { other: otherName })}
        </Link>
        <Link
          href={backHref}
          className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
        >
          {t("actions.backToList")}
        </Link>
      </div>
    </main>
  );
}
