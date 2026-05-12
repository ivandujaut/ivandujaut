import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { Currently } from "@/components/home/currently";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { StatsGrid } from "@/components/home/stats-grid";
import { RecentPosts } from "@/components/home/recent-posts";
import { getAllStats } from "@/lib/stats";
import { buildDefaultOgUrl } from "@/lib/og";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";

  const title = "Iván Dujaut";
  const description = isEs
    ? "Product Engineer · Bioingeniero ITBA"
    : "Product Engineer · Bioengineer ITBA";

  const ogImageUrl = buildDefaultOgUrl({
    title,
    description,
    locale: locale as "es" | "en",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const stats = await getAllStats(locale as "es" | "en");

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Hero />

      <div className="mt-16 space-y-16">
        <Currently />

        <FeaturedProjects locale={locale as "es" | "en"} />

        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Estadísticas" : "Stats"}
          </h2>
          <StatsGrid stats={stats} locale={locale as "es" | "en"} />
        </section>

        <RecentPosts locale={locale as "es" | "en"} />
      </div>
    </main>
  );
}
