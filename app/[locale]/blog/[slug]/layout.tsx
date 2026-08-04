import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { findPostInAnyLocale, getPostBySlug } from "@/lib/content";

/**
 * Mismo motivo que en `projects/[slug]/layout.tsx`: el `loading.tsx` de este
 * segmento hace que la respuesta empiece a streamear, y una vez enviados los
 * headers el `notFound()` del `page` ya no puede bajar el status de 200 a 404.
 * El chequeo tiene que pasar acá arriba, antes del boundary de Suspense.
 *
 * Solo 404 si el slug no existe en ningún idioma: cuando existe en el otro, el
 * `page` redirige a la traducción o muestra `TranslationMissingPage`.
 */
export default async function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as "es" | "en";
  if (!getPostBySlug(typedLocale, slug) && !findPostInAnyLocale(slug)) {
    notFound();
  }

  return children;
}
