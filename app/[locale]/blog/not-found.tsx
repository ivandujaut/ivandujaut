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
