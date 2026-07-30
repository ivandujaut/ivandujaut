import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, LinkedinIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Download } from "@/components/animate-ui/icons/download";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { ImagesBadge } from "@/components/ui/images-badge";
import { getPreviewProject } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { localePath } from "@/lib/seo";

const socialLinks = [
  {
    href: "https://github.com/ivandujaut",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/ivan-dujaut/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
];

export function Hero({ locale }: { locale: "es" | "en" }) {
  const t = useTranslations("home.hero");
  const previewProject = getPreviewProject(locale);
  const badgeText = previewProject ? t("badge", { title: previewProject.title }) : "";
  const badgeHref = previewProject ? localePath(locale, `/projects/${previewProject.slug}`) : "";

  return (
    <section>
      {previewProject?.preview && (
        // El abanico se abre hacia arriba y hacia los costados desde la carpeta,
        // que arranca pegada al borde izquierdo de la columna. En tamaño LARGE
        // el borde izquierdo del abanico cae 96px a la izquierda de ese borde,
        // así que hace falta un viewport de ~816px para que no se corte fuera
        // de pantalla.
        //
        // Abajo de `lg` no hay lugar para un abanico legible: con la carpeta a
        // 24px del borde, lo más ancho que entra son previews de ~64px, y a ese
        // tamaño un gráfico de barras es una mancha. Así que ahí el badge no
        // revela nada y es un link común de un solo tap. Prefiero no prometer
        // una interacción que no devuelve información; el texto y las imágenes
        // asomando ya cuentan que hay un caso nuevo con material visual.
        //
        // Son dos instancias y no una con props calculadas por JS para que la
        // decisión la tome CSS: sin hook de media query no hay parpadeo en la
        // primera pintura ni desajuste de hidratación.
        <div className="mb-10">
          <ImagesBadge
            className="lg:hidden"
            text={badgeText}
            href={badgeHref}
            images={previewProject.preview}
            revealOnInteraction={false}
          />
          <ImagesBadge
            className="hidden lg:inline-flex"
            text={badgeText}
            href={badgeHref}
            images={previewProject.preview}
            folderSize={{ width: 48, height: 36 }}
            teaserImageSize={{ width: 40, height: 28 }}
            hoverImageSize={{ width: 140, height: 108 }}
            hoverTranslateY={-110}
            hoverSpread={50}
          />
        </div>
      )}

      <h1 className="text-4xl font-semibold tracking-tight">{t("name")}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground">
        <span>{t("role")}</span>
        <span aria-hidden>·</span>
        <span>{t("location")}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          {t("available")}
        </span>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-foreground">{t("tagline")}</p>

      <p className="mt-2 font-mono text-sm text-muted-foreground">{t("credentials")}</p>

      {/* Arriba del pliegue tiene que haber algo para hacer, no solo algo para
          leer. El destino primario es el trabajo; el CV es la salida rápida
          para quien vino a evaluar un perfil. */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {/* Sin `asChild`: `AnimateIcon` haría `motion.create()` sobre el `Link`
            de next-intl y eso rompe. El span envolvente capta el hover igual. */}
        <AnimateIcon animateOnHover className="inline-flex">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <span>{t("ctas.work")}</span>
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </Link>
        </AnimateIcon>
        <AnimateIcon animateOnHover asChild>
          <a
            href="/cv-ivan-dujaut.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden />
            <span>{t("ctas.cv")}</span>
          </a>
        </AnimateIcon>
      </div>

      <div className="mt-6 flex items-center gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={link.icon} size={20} strokeWidth={1.5} />
          </a>
        ))}
        <ObfuscatedEmailTrigger
          userReversed="navituajud"
          domainReversed="moc.liamg"
          label="Email"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={Mail01Icon} size={20} strokeWidth={1.5} />
        </ObfuscatedEmailTrigger>
      </div>
    </section>
  );
}
