import { useTranslations } from "next-intl";
import { NotFoundPage } from "@/components/common/not-found-page";

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <NotFoundPage
      title={t("generic.title")}
      description={t("generic.description")}
      ctas={[
        { href: "/", label: t("actions.home"), variant: "primary" },
        { href: "/blog", label: t("actions.blog") },
        { href: "/projects", label: t("actions.projects") },
      ]}
    />
  );
}
