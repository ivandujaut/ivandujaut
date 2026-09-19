import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/home/hero";
import { Currently } from "@/components/home/currently";
import { PublishedWork } from "@/components/home/published-work";
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
  // El título es lo que filtra una búsqueda de reclutador. Hasta el 18/09/2026
  // decía "Product Engineer", que es el puesto actual y ninguno de los roles
  // que Iván busca; el puesto sigue nombrado donde es cierto, en /about.
  const seoTitle = isEs
    ? "Iván Dujaut · Product Strategy y Decision Analytics"
    : "Iván Dujaut · Product Strategy and Decision Analytics";
  // El remate anterior era "y escribo el código", y era la última frase del
  // resultado de búsqueda para quien busca el nombre. El código es la palanca,
  // no el oficio: lo que distingue el perfil son los análisis publicados.
  const description = isEs
    ? "Escribo casos sobre salud y seguros: reconstruyo el problema, los actores y los datos públicos, y termino en una decisión. Bioingeniero del ITBA."
    : "I write cases about health and insurance: I rebuild the problem, the players and the public data, and end in a decision. Bioengineer from ITBA.";

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

  return (
    // El padding extra de arriba (`pt-28 lg:pt-40`) existía para que el
    // abanico del badge no se metiera abajo del navbar sticky. Sin badge, ese
    // aire es un hueco.
    <main id="main" className="mx-auto max-w-2xl px-6 py-24">
      <JsonLd data={personSchema(locale as "es" | "en")} />
      <Hero />

      {/* La obra antes que la biografía. Hasta el 18/09/2026 el orden era
          "Actualmente" (dónde trabajo hoy) y después los casos, o sea el CV
          primero y la prueba después; es el mismo orden que /about ya había
          dado vuelta. Y detrás de los casos venían dos bloques que jugaban en
          contra: las estadísticas, donde un tercio del espacio eran commits y
          repos de GitHub (ruido para un perfil de producto y análisis), y
          "Escritos recientes", tres posts de mayo sobre el propio proceso,
          que era lo último que leía el que llegaba al final. El blog sigue en
          el nav; lo que se saca es su lugar de cierre de la home. */}
      <div className="mt-16 space-y-16">
        <PublishedWork locale={locale as "es" | "en"} />

        <Currently />
      </div>
    </main>
  );
}
