import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/home/hero";
import { Currently } from "@/components/home/currently";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { StatsGrid } from "@/components/home/stats-grid";
import { RecentPosts } from "@/components/home/recent-posts";
import { getAllStats } from "@/lib/stats";
import { buildDefaultOgUrl } from "@/lib/og";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { personSchema } from "@/lib/jsonld";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  // Mismo motivo que abajo, y mismo patrón que `app/[locale]/layout.tsx`: sin
  // esto una sonda con punto genera la metadata de la home para su propio 404.
  if (!hasLocale(routing.locales, locale)) return {};

  const isEs = locale === "es";
  const typedLocale = locale as "es" | "en";

  const ogTitle = "Iván Dujaut";
  const seoTitle = isEs
    ? "Iván Dujaut · Product Engineer & Bioingeniero"
    : "Iván Dujaut · Product Engineer & Bioengineer";
  const description = isEs
    ? "Product Engineer y Bioingeniero del ITBA. Construyo producto end-to-end con Next.js, TypeScript y foco en métricas. De startups en Techstars a proptech."
    : "Product Engineer and Bioengineer from ITBA. I build end-to-end product with Next.js, TypeScript and a metrics-first lens. From Techstars startups to proptech.";

  const ogImageUrl = buildDefaultOgUrl({
    title: ogTitle,
    description,
    locale: typedLocale,
  });

  const pageUrl = `${SITE_URL}${localePath(typedLocale, "/")}`;

  return {
    title: { absolute: seoTitle },
    description,
    alternates: buildStaticAlternates(typedLocale, "/"),
    openGraph: {
      title: ogTitle,
      description,
      type: "website",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  // El layout ya valida el locale, pero su `notFound()` no frena a esta página:
  // layout y page renderizan en paralelo. Una URL de un solo segmento que el
  // proxy no reescribe (`/foo.php` y demás sondas de bots, excluidas del matcher
  // por tener punto) entra acá con `locale = "foo.php"`, y `StatsGrid` explota
  // buscando sus etiquetas en un idioma que no existe. La respuesta ya era 404,
  // pero cada sonda dejaba una excepción en los logs.
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const stats = await getAllStats(locale as "es" | "en");
  const tSections = await getTranslations({ locale, namespace: "home.sections" });

  return (
    // Más padding arriba que el `py-24` original: el abanico del badge sube
    // desde arriba del h1 y con 24 se metía abajo del navbar sticky. En `lg`
    // el abanico es el grande y sube ~114px, así que ahí hace falta más aire.
    <main id="main" className="mx-auto max-w-2xl px-6 pt-28 pb-24 lg:pt-40">
      <JsonLd data={personSchema(locale as "es" | "en")} />
      <Hero locale={locale as "es" | "en"} />

      <div className="mt-16 space-y-16">
        <Currently />

        <FeaturedProjects locale={locale as "es" | "en"} />

        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {tSections("stats")}
          </h2>
          <StatsGrid stats={stats} locale={locale as "es" | "en"} />
        </section>

        <RecentPosts locale={locale as "es" | "en"} />
      </div>
    </main>
  );
}
