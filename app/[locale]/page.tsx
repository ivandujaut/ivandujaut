import { Button } from "@/components/ui/button";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{t("hero.name")}</h1>
      <p className="mt-3 text-muted-foreground">{t("hero.tagline")}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button>{t("hero.cta.viewWork")}</Button>
        <Button variant="outline">{t("hero.cta.readBlog")}</Button>
      </div>
    </main>
  );
}
