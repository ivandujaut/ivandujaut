import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { CasebookListItem } from "@/components/content/casebook-list-item";
import { getCasebookByLevel } from "@/lib/content";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";
  const typedLocale = locale as "es" | "en";
  const title = "Casebook";
  const description = isEs
    ? "Casos de entrevista de consultoría resueltos paso a paso, con los datos a la vista y la fuente de cada número. Ordenados por dificultad, para leer o para practicar."
    : "Consulting interview cases solved step by step, with the data in view and a source for every number. Ordered by difficulty, to read or to practise.";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, "/casebook")}`;

  return {
    title,
    description,
    alternates: buildStaticAlternates(typedLocale, "/casebook"),
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
    },
  };
}

export default async function CasebookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cases = getCasebookByLevel(locale as "es" | "en");

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24">
      <CasebookHeader />

      <div className="mt-16">
        {cases.length > 0 ? (
          <div className="space-y-1">
            {cases.map((item) => (
              <CasebookListItem
                key={item.slug}
                slug={item.slug}
                title={item.title}
                tagline={item.tagline}
                level={item.level}
                kind={item.kind}
                cover={
                  item.cover
                    ? {
                        src: item.cover.src.src,
                        width: item.cover.src.width,
                        height: item.cover.src.height,
                        blurDataURL: item.cover.src.blurDataURL,
                      }
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <CasebookEmpty />
        )}
      </div>
    </main>
  );
}

function CasebookHeader() {
  const t = useTranslations("casebook");
  return (
    <>
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 font-serif italic text-muted-foreground">{t("description")}</p>
    </>
  );
}

function CasebookEmpty() {
  const t = useTranslations("casebook");
  return <p className="text-muted-foreground">{t("empty")}</p>;
}
