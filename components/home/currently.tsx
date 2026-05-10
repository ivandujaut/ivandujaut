import { useTranslations } from "next-intl";

export function Currently() {
  const t = useTranslations("home.currently");

  return (
    <section>
      <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {t("title")}
      </h2>
      <div className="space-y-4 text-foreground leading-relaxed">
        <p>{t("paragraph1")}</p>
        <p className="font-mono text-sm text-muted-foreground">{t("stack")}</p>
        <p>{t("paragraph2")}</p>
        <p className="text-muted-foreground">{t("paragraph3")}</p>
      </div>
    </section>
  );
}
