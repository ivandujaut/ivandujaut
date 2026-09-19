"use client";

// Componente de cliente a propósito. Un `not-found` no recibe `params`, así
// que no puede llamar a `setRequestLocale`, y del lado del servidor next-intl
// resuelve el locale leyendo `headers()`: una API dinámica que apagaba el
// renderizado estático de todo el segmento. Acá las traducciones llegan por
// el `NextIntlClientProvider` y no hay request que leer. Sólo se renderiza
// texto y links, así que no se pierde nada.

import { useTranslations } from "next-intl";
import { NotFoundPage } from "@/components/common/not-found-page";

export default function BlogNotFound() {
  const t = useTranslations("common.notFound");

  return (
    <NotFoundPage
      title={t("post.title")}
      description={t("post.description")}
      ctas={[
        { href: "/blog", label: t("actions.blog"), variant: "primary" },
        { href: "/", label: t("actions.home") },
      ]}
    />
  );
}
