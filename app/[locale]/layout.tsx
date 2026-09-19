import "../globals.css";
import { Geist_Mono, Figtree, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { Footer } from "@/components/layout/footer";
import { LanguageSuggestionBanner } from "@/components/i18n/language-suggestion-banner";
import { Navbar } from "@/components/layout/navbar";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { SITE_URL, localePath } from "@/lib/seo";
import type { Metadata, Viewport } from "next";

/**
 * Layout raíz del sitio: el que renderiza `<html>` y `<body>`.
 *
 * Hasta el 18/09/2026 había un `app/layout.tsx` arriba de éste que hacía
 * `await getLocale()` para el `lang`. Ese layout corre antes que el
 * `setRequestLocale` de acá abajo, así que next-intl no tenía locale cacheado y
 * lo resolvía leyendo `headers()`. Con esa API dinámica en el árbol, **todas**
 * las páginas del sitio se renderizaban en cada visita: un caso salía de
 * producción con `cache-control: private, no-cache, no-store` y
 * `x-vercel-cache: MISS`, contra el `PRERENDER` de /llms.txt.
 *
 * Con el `<html>` acá adentro el locale sale de `params` y no hay nada que leer
 * del request. La otra mitad del arreglo son los tres `not-found.tsx` del
 * segmento, que pasaron a componentes de cliente por el mismo motivo.
 *
 * Las ramas que no cuelgan de `[locale]` (`/stats`, `/pitch/[company]`) tienen
 * su propio layout raíz, que es lo que Next permite mientras no haya un
 * `app/layout.tsx` arriba de todo.
 */

const figTree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  // Genera las rutas estáticas para cada locale en build time
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // La metadata de marca vivía en el layout de arriba. Baja acá entera porque
  // este archivo pasó a ser la raíz; cada página la pisa con la suya.
  const base: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Iván Dujaut",
      template: "%s · Iván Dujaut",
    },
    description:
      "Analizo mercados y productos con datos públicos: salud en Estados Unidos, seguros y pagos en Argentina y Brasil. Cada cifra trazada a su fuente.",
    authors: [{ name: "Iván Dujaut", url: baseUrl }],
    creator: "Iván Dujaut",
    openGraph: {
      title: "Iván Dujaut",
      description:
        "Analizo mercados y productos con datos públicos: salud en Estados Unidos, seguros y pagos en Argentina y Brasil.",
      url: baseUrl,
      siteName: "Iván Dujaut",
      images: [
        {
          url: `${baseUrl}/api/og?title=Iván+Dujaut&subtitle=Portfolio`,
          width: 1200,
          height: 630,
          alt: "Iván Dujaut",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Iván Dujaut",
      images: [`${baseUrl}/api/og?title=Iván+Dujaut&subtitle=Portfolio`],
    },
  };

  if (!hasLocale(routing.locales, locale)) return base;

  // Red de contención para páginas que no definan `alternates`. Hoy no hay
  // ninguna: las 8 lo definen y Next reemplaza el objeto completo, así que el
  // feed llega al `<head>` por `buildStaticAlternates` /
  // `buildContentAlternates` en `lib/seo.ts`, no por acá.
  return {
    ...base,
    alternates: {
      types: {
        "application/rss+xml": `${SITE_URL}${localePath(locale, "/rss.xml")}`,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // En Next 15, params es async (Promise)
  const { locale } = await params;

  // Un locale inválido no se frena acá con `notFound()`, y es deliberado: este
  // layout es la raíz, y si tira no queda ningún boundary arriba donde
  // renderizar el 404. El 404 lo tiran las páginas, que ya validan el locale
  // (`/algo.php` entra como locale porque el matcher del proxy deja pasar las
  // rutas con punto), y ahí sí lo atrapa `app/[locale]/not-found.tsx` adentro
  // de este layout. Acá sólo se elige un idioma razonable para el documento.
  const idioma = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  // Habilitar renderizado estático con el locale activo
  setRequestLocale(idioma);

  return (
    <html lang={idioma} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${figTree.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <SkipToContent />
            <LanguageSuggestionBanner />
            <Navbar />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <PostHogProvider />
        <ClickTracker />
      </body>
    </html>
  );
}
