import { Footer } from "@/components/layout/footer";
import { LanguageSuggestionBanner } from "@/components/i18n/language-suggestion-banner";
import { Navbar } from "@/components/layout/navbar";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  // Genera las rutas estáticas para cada locale en build time
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // En Next 15, params es async (Promise)
  const { locale } = await params;

  // Validar que el locale sea uno soportado, si no devolver 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Habilitar renderizado estático con el locale activo
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <SkipToContent />
      <LanguageSuggestionBanner />
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </NextIntlClientProvider>
  );
}
