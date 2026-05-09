import { Button } from "@/components/ui/button";
import { setRequestLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{t("hero.name")}</h1>
          <p className="mt-3 text-muted-foreground">{t("hero.tagline")}</p>
        </div>
        <ThemeToggle />
      </div>

      <hr className="my-12" />

      <section className="space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Verificación
        </h2>

        <div className="flex flex-wrap gap-2">
          <Button>{t("hero.cta.viewWork")}</Button>
          <Button variant="outline">{t("hero.cta.readBlog")}</Button>
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <p className="text-sm">Texto base. Probá cambiar el tema con el toggle de arriba.</p>
          <p className="text-sm text-muted-foreground">
            Texto muted que debería adaptarse al tema.
          </p>
          <code className="font-mono text-xs bg-muted px-2 py-1 rounded">código inline</code>
        </div>
      </section>
    </main>
  );
}
