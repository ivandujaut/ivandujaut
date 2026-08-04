import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/**
 * Ruta atrapatodo. No renderiza nada: existe para que una URL que no matchea
 * ninguna ruta real caiga igual *adentro* del segmento `[locale]`.
 *
 * Sin esto, `/ruta-inventada` no matcheaba nada y Next respondía su 404 por
 * defecto: en inglés, sin navbar ni footer y sin el tema del sitio.
 * `app/[locale]/not-found.tsx` no llegaba a renderizarse nunca, porque el ruteo
 * fallaba antes de entrar al segmento que lo contiene.
 *
 * Llamando `notFound()` desde acá adentro, el boundary que resuelve es el del
 * segmento y la respuesta sale con la página 404 traducida. Esta rama no tiene
 * `loading.tsx`, así que nada streamea y el status es un 404 real (el porqué
 * está en `projects/[slug]/layout.tsx`).
 *
 * Va con corchetes simples y no `[[...rest]]`: la variante opcional también
 * matchearía la home y la taparía.
 */
export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale } = await params;
  // El boundary usa `useTranslations` y necesita el locale resuelto.
  setRequestLocale(locale);

  notFound();
}
