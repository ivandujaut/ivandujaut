import { useTranslations } from "next-intl";
import { CalendlyIcon } from "@/components/icons/calendly-icon";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { Eyebrow } from "@/components/ui/eyebrow";

const ENLACE =
  "underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground";

/**
 * "Actualmente": qué está haciendo hoy y cómo escribirle.
 *
 * El último párrafo cambió el 19/11/2026 y es el que justifica este archivo.
 *
 * Decía "Busco un rol de producto o de análisis: Product Manager, analista de
 * producto o analista de negocio", y tenía dos problemas medidos. Uno, de los
 * tres títulos, "analista de producto" devuelve 2.274 avisos en LinkedIn
 * Argentina, que es el fallback del buscador: el control con un puesto
 * inventado dio 2.434. No tiene mercado propio
 * (`data/perfil/investigacion-titulos-2026-09-19.md`). Dos, nombrar tres
 * títulos cierra la puerta a los avisos que usan un cuarto, que es la misma
 * decisión que se tomó en /about ese día. Los tres puestos con pozo real
 * siguen declarados donde los leen las máquinas, en el `hasOccupation` del
 * `Person` de `lib/jsonld.ts`, y el cargo sigue en el hero y en el `<title>`.
 *
 * Y terminaba en "Escribime o agendá una call", que era texto plano. La home
 * tuvo 130 sesiones en 120 días y no ofrecía ninguna forma clickeable de
 * escribir: el hero sólo tiene "Ver mi trabajo" y "Bajá mi CV", y los seis
 * `contact_click` que registró la página son todos la descarga del CV. Ahora
 * las dos vías son enlaces y se miden con `surface: "home-currently"`, que
 * arranca en cero.
 *
 * Tampoco va más en `text-muted-foreground`. Era el único párrafo que pedía
 * una acción y el único escrito en gris.
 */
export function Currently() {
  const t = useTranslations("home.currently");

  return (
    <section id="home-actualmente" className="reveal">
      <Eyebrow as="h2" className="mb-4">
        {t("title")}
      </Eyebrow>
      <div className="space-y-4 leading-relaxed text-foreground">
        <p>{t("paragraph1")}</p>
        <p className="font-mono text-sm text-muted-foreground">{t("stack")}</p>
        <p>{t("paragraph2")}</p>
        <p>
          {t.rich("paragraph3", {
            mail: (chunks) => (
              <ObfuscatedEmailTrigger
                surface="home-currently"
                userReversed="navituajud"
                domainReversed="moc.liamg"
                className={ENLACE}
              >
                {chunks}
              </ObfuscatedEmailTrigger>
            ),
            call: (chunks) => (
              <a
                href="https://calendly.com/ivan-dujaut/nueva-reunion"
                data-ph="contact_click"
                data-ph-kind="calendly"
                data-ph-surface="home-currently"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 ${ENLACE}`}
              >
                <CalendlyIcon size={13} aria-hidden />
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
