import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getResearch } from "@/lib/content";
import { ResearchListItem } from "@/components/content/research-list-item";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";

// TODO: remove this gate when /research has published content. Until then
// the section is fully inaccessible (direct URLs 404). The code below is kept
// intact so re-enabling is a one-line delete.
const RESEARCH_ENABLED = false;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  if (!RESEARCH_ENABLED) return {};
  const { locale } = await params;
  const isEs = locale === "es";
  const typedLocale = locale as "es" | "en";
  const title = isEs ? "Investigación" : "Research";
  const description = isEs
    ? "Papers, ensayos largos y análisis técnicos en formato académico: bioingeniería, métodos cuantitativos y notas sobre cómo se construye software."
    : "Papers, long-form essays and technical analyses written paper-style: bioengineering, quantitative methods and notes on how software gets built.";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, "/research")}`;

  return {
    title,
    description,
    alternates: buildStaticAlternates(typedLocale, "/research"),
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

export default async function ResearchPage({ params }: Props) {
  if (!RESEARCH_ENABLED) notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  const papers = getResearch(locale as "es" | "en");

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24">
      <ResearchHeader />

      <div className="mt-16">
        {papers.length > 0 ? (
          <div className="space-y-1">
            {papers.map((paper) => (
              <ResearchListItem
                key={paper.slug}
                slug={paper.slug}
                title={paper.title}
                tagline={paper.tagline}
                year={paper.year}
                status={paper.status}
                venue={paper.venue}
                tags={paper.tags}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No papers yet.</p>
        )}
      </div>
    </main>
  );
}

function ResearchHeader() {
  const t = useTranslations("research");
  return (
    <>
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 font-serif italic text-muted-foreground">{t("description")}</p>
    </>
  );
}
