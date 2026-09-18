import { getTranslations } from "next-intl/server";
import { RssIcon } from "@/components/icons/rss-icon";
import { localePath, SITE_URL } from "@/lib/seo";

interface FeedLinkProps {
  locale: "es" | "en";
  /** Dónde se muestra. Va a PostHog como `surface` de `feed_click`. */
  surface: "index" | "blog" | "case-close";
  className?: string;
}

/**
 * La oferta del feed, para el que quiere enterarse de un caso nuevo sin pasar
 * por LinkedIn.
 *
 * El feed existía desde siempre, cruza los casos y el blog desde que se
 * arregló, y no se ofrecía en ninguna parte: estaba declarado en el `<head>`
 * (que sólo ven los lectores de feeds y los rastreadores) y nada más. Sin
 * cookies ni lista de correo, era el único modo de volver que no fuera una red
 * social, y era invisible.
 *
 * El link muestra la dirección y no un "Suscribite", porque lo que hay que
 * hacer con un feed es copiar la dirección y pegarla en un lector. Un botón
 * que dice "suscribite" y abre una pantalla de XML es una trampa.
 */
export async function FeedLink({ locale, surface, className }: FeedLinkProps) {
  const t = await getTranslations({ locale, namespace: "common.feed" });
  const path = localePath(locale, "/rss.xml");
  const shown = `${SITE_URL.replace(/^https?:\/\//, "")}${path}`;

  return (
    <p className={`text-sm text-muted-foreground ${className ?? ""}`}>
      <span>{t("body")} </span>
      <a
        href={path}
        data-ph="feed_click"
        data-ph-surface={surface}
        data-ph-locale={locale}
        className="inline-flex items-center gap-1.5 font-mono text-sm underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
      >
        <RssIcon size={14} aria-hidden />
        <span>{shown}</span>
      </a>
    </p>
  );
}
