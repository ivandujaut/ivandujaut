import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { NotFoundPage } from "@/components/common/not-found-page";

/**
 * 404 de raíz, para las URLs que nunca entran al segmento `[locale]`.
 *
 * El matcher del proxy excluye a propósito las rutas con punto (`/foo.php`,
 * `/algo.json`), así que no se reescriben con locale, no matchean el catch-all
 * y terminaban en el 404 por defecto de Next: en inglés, sin estilos propios y
 * sin ningún link de vuelta al sitio.
 *
 * Este archivo renderiza adentro de `app/layout.tsx`, que ya trae fuentes y
 * tema pero no el `NextIntlClientProvider`. Por eso el provider se monta acá:
 * sin él, el `Link` de next-intl que usa `NotFoundPage` se queda sin locale.
 * Van solo el mensaje y los CTAs, sin navbar ni footer, que viven en el layout
 * del locale y no llegan hasta este nivel.
 */
export default async function RootNotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common.notFound" });

  return (
    <NextIntlClientProvider>
      <NotFoundPage
        title={t("generic.title")}
        description={t("generic.description")}
        ctas={[
          { href: "/", label: t("actions.home"), variant: "primary" },
          { href: "/blog", label: t("actions.blog") },
          { href: "/projects", label: t("actions.projects") },
        ]}
      />
    </NextIntlClientProvider>
  );
}
