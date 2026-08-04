import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { findProjectInAnyLocale, getProjectBySlug } from "@/lib/content";

/**
 * Este layout existe por una sola razón: que un slug inexistente devuelva un
 * **404 de verdad** y no un soft-404.
 *
 * `loading.tsx` abre un boundary de Suspense alrededor del `page`. Cuando el
 * fallback se renderiza, la respuesta empieza a streamear, y con los headers
 * ya enviados el status queda clavado en 200: el `notFound()` del `page` pinta
 * la UI correcta pero llega tarde para cambiar el código HTTP. Next lo
 * documenta en `not-found.js` → Status Codes, y la salida que propone es
 * chequear que el recurso exista *antes* de que arranque el stream.
 *
 * El layout corre por encima del boundary, así que es el último lugar donde
 * todavía se puede responder 404. Por eso el chequeo vive acá y no en `page`.
 *
 * La condición replica a propósito la del `page`: solo 404 cuando el slug no
 * existe en **ningún** idioma. Si existe en el otro, el `page` se encarga
 * (redirige a la traducción o muestra `TranslationMissingPage`), y ninguna de
 * esas dos respuestas es un 404.
 */
export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  // El boundary de not-found usa `useTranslations`, que necesita el locale
  // resuelto: sin esto falla al renderizar bajo static rendering.
  setRequestLocale(locale);

  const typedLocale = locale as "es" | "en";
  if (!getProjectBySlug(typedLocale, slug) && !findProjectInAnyLocale(slug)) {
    notFound();
  }

  return children;
}
