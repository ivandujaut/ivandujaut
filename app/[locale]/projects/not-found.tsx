import { useTranslations } from "next-intl";
import { NotFoundPage } from "@/components/common/not-found-page";

export default function ProjectsNotFound() {
  const t = useTranslations("common.notFound");

  return (
    <NotFoundPage
      title={t("project.title")}
      description={t("project.description")}
      ctas={[
        { href: "/projects", label: t("actions.projects"), variant: "primary" },
        { href: "/", label: t("actions.home") },
      ]}
    />
  );
}
