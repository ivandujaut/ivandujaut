import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ExperienceItem } from "@/components/about/experience-item";
import { EducationItem } from "@/components/about/education-item";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Download } from "@/components/animate-ui/icons/download";
import { CalendlyIcon } from "@/components/icons/calendly-icon";
import { DuolingoIcon } from "@/components/icons/duolingo-icon";
import { getProjects, getPublishingCadence } from "@/lib/content";
import { ProjectListItem } from "@/components/content/project-list-item";
import { SectionTracker } from "@/components/analytics/section-tracker";
import { CV_PAGE } from "@/lib/cv";
import { buildDefaultOgUrl } from "@/lib/og";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { profilePageSchema } from "@/lib/jsonld";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { ShareLinkButton } from "@/components/common/share-link-button";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageShell } from "@/components/ui/page-shell";
import { PROFILE_DESCRIPTION } from "@/lib/profile";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";

  // Mismo rol que el hero, el `<title>` de la home y el titular de LinkedIn.
  const title = isEs
    ? "Acerca de mí · Iván Dujaut, AI Product Manager"
    : "About · Iván Dujaut, AI Product Manager";
  // La misma frase que la home, el layout, el `Person` de `lib/jsonld.ts` y
  // llms.txt, palabra por palabra: repetirla igual es lo que hace que un
  // buscador o un modelo la tome en vez de fabricar una propia. Vive en
  // `lib/profile.ts`, con el historial de por qué dice lo que dice.
  const description = PROFILE_DESCRIPTION[locale as "es" | "en"];

  const ogImageUrl = buildDefaultOgUrl({
    title,
    description,
    locale: locale as "es" | "en",
  });

  const typedLocale = locale as "es" | "en";
  const pageUrl = `${SITE_URL}${localePath(typedLocale, "/about")}`;

  return {
    // `absolute` evita que el template del root layout ("%s · Iván Dujaut")
    // agregue el nombre por segunda vez: el título ya lo incluye.
    title: { absolute: title },
    description,
    alternates: buildStaticAlternates(typedLocale, "/about"),
    openGraph: {
      title,
      description,
      type: "profile",
      url: pageUrl,
      locale: isEs ? "es_AR" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_AR"],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent locale={locale as "es" | "en"} />;
}

/**
 * Cuántas piezas publicadas se muestran acá. Cuatro y no tres como la home:
 * en una grilla de dos columnas, tres dejan media tarjeta suelta con el hueco
 * al lado, y acá la sección es el argumento de la página, no un anuncio.
 */
/**
 * Cuándo se tocó por última vez el contenido de esta página.
 *
 * Va a mano y no desde la fecha de build a propósito: con la fecha de build,
 * cada despliegue le dice a los motores que la página cambió, y la señal deja
 * de significar nada. Hay que subirla cuando cambie el texto, no cuando
 * cambie el CSS.
 */
const ACTUALIZADA = "2026-11-19";

const ABOUT_LIMIT = 4;

/** Cuántas de esas cuatro se ven en un teléfono. Las otras dos se esconden con CSS. */
const MOBILE_LIMIT = 2;

/** Una fila de la ficha de herramientas: rótulo a la izquierda, lista al lado. */
function ToolCategory({ label, items }: { label: string; items: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <Eyebrow as="dt" className="shrink-0 sm:w-40">
        {label}
      </Eyebrow>
      <dd className="text-sm leading-relaxed">{items}</dd>
    </div>
  );
}

function AboutContent({ locale }: { locale: "es" | "en" }) {
  const t = useTranslations("about");
  const tWork = useTranslations("home.work");
  const tReading = useTranslations("common.reading");
  const minutos = (count?: number) => (count ? tReading("minutes", { count }) : undefined);

  const cadencia = getPublishingCadence(locale);
  const piezas = getProjects(locale).slice(0, ABOUT_LIMIT);

  return (
    <PageShell id="main">
      {/* `ProfilePage` y no un `Person` suelto: es el tipo con el que Google
          dice "esta página trata sobre esta persona". La home sigue emitiendo
          el `Person`, con el mismo `@id`, así que para un motor que cruza
          páginas es la misma entidad. */}
      <JsonLd data={profilePageSchema(locale, ACTUALIZADA)} />
      {/* Tres hitos y no más: el final de la intro, las tarjetas y el
          contacto. Contestan las dos preguntas que la página todavía no puede
          contestar: si el que entra pasa del primer párrafo, y si llega a ver
          la obra. */}
      <SectionTracker page="about" sections="about-quiero,about-trabajo,about-contacto" />
      {/* Intro */}
      <section>
        <div className="flex flex-row items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">{t("intro.greeting")}</h1>
          <ShareLinkButton
            surface="about"
            url={`${SITE_URL}${localePath(locale, "/about")}`}
            title={t("intro.greeting")}
            className="mt-2"
          />
        </div>
        {/* La descripción se reescribió el 19/09/2026 contra los avisos de los
            tres roles que Iván persigue: decision analytics en consultoría
            (ZS), product management de tarjetas (Mastercard) y producto en
            infraestructura de pagos (Pomelo). Los tres piden lo mismo dicho de
            tres maneras: contestar la pregunta de negocio y no narrar el
            procedimiento, decidir qué entra y qué no al roadmap, y medir
            después si rindió.

            Son tres párrafos y cada uno contesta una pregunta, en este orden:
            lo que hizo, lo que hace y lo que quiere. El orden lo pidió Iván el
            18/11/2026 con esas palabras, y es la estructura de la página, no
            una forma de redactar: si un párrafo deja de contestar su pregunta,
            se reescribe o se va.

            Hasta ese día eran cinco párrafos y 383 palabras, y fallaban en las
            tres. Lo que hizo estaba al revés en el tiempo (2026 primero,
            Banana después) y mezclado con los números de cada etapa, que es lo
            que lo hacía leer como un CV en prosa. Lo que hace estaba, pero
            empezaba por el mercado y no por el oficio. Y lo que quiere no
            estaba en ninguna parte: la página cerraba ofreciéndole resolver un
            problema al que lee, y eso sólo vivía en "Actualmente" de la home.

            Por eso los números de Banana (60% al 90%, ~20%) no están acá
            arriba: viven en Experiencia, dos centímetros más abajo. Apilados
            en el primer párrafo tapaban la trayectoria, que es lo único que
            este párrafo tiene que contar.

            Las reglas salieron de iterar con él, y están acá para no volver a
            romperlas:

            - Nada de eslóganes. Una oración con tres cláusulas paralelas y una
              glosa entre paréntesis suena a IA aunque diga algo cierto. El
              criterio se muestra en lo que pasó, no se declara.
            - Nada de aforismos de cierre ("me quedó la costumbre de pedirle un
              número a una decisión"). Los párrafos terminan en un hecho.
            - No son "análisis de mercado" ni "temas que me interesan". El eje
              está en el frontmatter: de los dieciséis casos del índice, siete
              son `salud` y seis `seguros` (el bot cuenta como seguros), y el
              porqué es estructural (la empresa decide por el cliente y esa
              decisión deja rastro público, que es lo único que permite
              reconstruirla desde afuera).
            - Los números van en primera persona del singular. Acá se vende él,
              no el equipo en el que estaba.
            - El cierre no nombra puestos, y los párrafos tampoco. El
              19/11/2026 estuvieron nombrados unas horas ("product manager,
              product owner o analista") y Iván lo revirtió: nombrar tres
              cierra la puerta a los avisos que usan un cuarto título, y el
              que lee ya tiene el cargo en el `<title>` y en el hero.
              En su lugar va el vocabulario con el que esos avisos escriben
              las responsabilidades, que es lo que comparten sin importar cómo
              se llame el puesto: roadmap, backlog, priorizar, requerimientos,
              actores, proceso, métricas por segmento, retención, margen,
              sprints, integraciones, SQL, Python. Salen de contar en cuántos
              de los 197 avisos de producto y análisis guardados el 21/09/2026
              aparece cada uno, no de intuición.
            - Ninguna palabra entra si no hay con qué respaldarla. Quedaron
              afuera user stories, dashboards, investigación de usuarios,
              discovery, A/B testing y go-to-market, que suman 122 puntos de
              frecuencia en esos avisos y no tienen evidencia publicada.
            - Lo que ya está dicho en otro lado no se repite: la trazabilidad
              vive en /method, la logística de trabajo remoto en "Actualmente"
              de la home, y la tesis en Educación, dos secciones más abajo. */}
        <div className="mt-6 space-y-4 leading-relaxed text-foreground">
          <p>{t("intro.paragraph1")}</p>
          {/* Los links van adentro de la frase y no en una lista aparte: la
              afirmación ("estos dos mercados dejan rastro público") y su prueba
              quedan en el mismo lugar, y cada fuente apunta al caso donde se
              usó. Es lo que reemplazó a la lista de dieciséis casos, que era el
              índice repetido. Eran cuatro hasta el 18/11/2026 y quedaron dos,
              una por mercado: es el precio de acortar, y las tarjetas de abajo
              siguen enlazando casos, así que la navegación no se pierde. Las
              cuatro cubrían los dos mercados y los dos
              niveles de fuente del método: el archivo donde la empresa es una
              fila, y lo que la empresa dice de sí misma. */}
          <p>
            {t.rich("intro.paragraph2", {
              pagos: (chunks) => (
                <Link
                  href="/projects/glp1-open-payments"
                  className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  {chunks}
                </Link>
              ),
              balances: (chunks) => (
                <Link
                  href="/projects/seguro-hogar-argentina"
                  className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
          {/* Los `id` son los hitos que mide `SectionTracker`. Si un párrafo
              se parte o se junta, el `id` se queda con el que contesta la
              misma pregunta: es lo que hace comparable la serie entre
              versiones de la página. */}
          <p id="about-quiero">{t("intro.paragraph3")}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <ObfuscatedEmailTrigger
            surface="about-intro"
            userReversed="navituajud"
            domainReversed="moc.liamg"
            label={t("intro.ctas.email")}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            <HugeiconsIcon icon={Mail01Icon} size={14} strokeWidth={1.5} aria-hidden />
            <span>{t("intro.ctas.email")}</span>
          </ObfuscatedEmailTrigger>
          <a
            href="https://calendly.com/ivan-dujaut/nueva-reunion"
            data-ph="contact_click"
            data-ph-kind="calendly"
            data-ph-surface="about-intro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            <CalendlyIcon size={14} aria-hidden />
            <span>{t("intro.ctas.calendly")}</span>
          </a>
          {/* El CV abre su vista previa en una pestaña nueva, igual que en el
              hero, y desde ahí se baja en el idioma de la página.
              Sin `asChild`: esta página es Server Component y `AnimateIcon` es
              cliente; ver el comentario en `components/home/hero.tsx`. */}
          <AnimateIcon animateOnHover className="inline-flex">
            <Link
              href={CV_PAGE}
              target="_blank"
              data-ph="contact_click"
              data-ph-kind="cv"
              data-ph-surface="about-intro"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <Download size={14} strokeWidth={1.5} aria-hidden />
              <span>{t("intro.ctas.cv")}</span>
            </Link>
          </AnimateIcon>
        </div>
      </section>

      <div className="mt-16 space-y-16">
        {/* Trabajo publicado. Se arma desde Velite y no a mano: si se hardcodea,
            queda desactualizado en la primera pieza que se publique. Va antes
            que Experiencia a propósito: la obra es el argumento y el CV es el
            respaldo, no al revés.
            
            Hasta el 19/09/2026 listaba los dieciséis casos con su bajada, o sea
            `/projects` otra vez, en letra más chica y sin fecha ni agrupación
            por mercado: 1.176px en escritorio y 1.836 en un teléfono, dos
            pantallas y cuarto de lista plana. Se recortó a la cadencia y el
            link, y ahí se pasó de largo: el 18/11/2026 la sección medía 104px
            de los 4.001 de la página, un 3%, mientras Experiencia se llevaba
            el 30%. La página decía que la obra es el argumento y mostraba lo
            contrario, en la tercera página más visitada del sitio.

            Van las cuatro piezas más nuevas, con la misma tarjeta del índice y
            con portada. La curaduría es la fecha, como en la home: no hay nada
            que mantener y la sección no queda vieja. Los otros catorce casos
            siguen enlazados desde el índice, la home, el sitemap, el RSS y los
            "siguientes casos" al pie de cada pieza, así que no pierden
            autoridad interna. */}
        <section id="about-trabajo">
          <Eyebrow as="h2" className="mb-6">
            {t("sections.work")}
          </Eyebrow>
          {cadencia && (
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              {tWork.rich("cadence", {
                // El mensaje es el mismo de la home, que envuelve el total en
                // <n> para el contador animado; acá va quieto.
                n: (chunks) => <>{chunks}</>,
                count: cadencia.count,
                days: cadencia.everyDays,
                since: new Date(cadencia.since).toLocaleDateString(locale, {
                  month: "long",
                  year: "numeric",
                }),
              })}
            </p>
          )}
          <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2">
            {piezas.map((pieza, i) => (
              // En un teléfono se ven dos y no cuatro. Cuatro tarjetas apiladas
              // miden 1.741px, y esta sección es una muestra con el link al
              // índice al lado, no un catálogo. Se esconden con CSS, así que
              // los cuatro enlaces siguen en el HTML y las portadas escondidas
              // no se descargan, porque `next/image` las pide recién al entrar
              // en pantalla.
              <div key={pieza.slug} className={i >= MOBILE_LIMIT ? "hidden sm:block" : undefined}>
                <ProjectListItem
                  slug={pieza.slug}
                  title={pieza.title}
                  tagline={pieza.tagline}
                  date={pieza.date}
                  locale={locale}
                  stack={pieza.stack}
                  readingTime={minutos(pieza.metadata?.readingTime)}
                  status={pieza.status}
                  kind={pieza.kind}
                  variant="list"
                  surface="about"
                  cover={
                    pieza.cover
                      ? {
                          src: pieza.cover.src.src,
                          alt: pieza.cover.alt,
                          width: pieza.cover.src.width,
                          height: pieza.cover.src.height,
                          blurDataURL: pieza.cover.src.blurDataURL,
                        }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
          <Link
            href="/projects"
            className="mt-8 inline-flex items-center gap-1 text-sm underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {t("work.all")}
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} aria-hidden />
          </Link>
        </section>

        {/* Experiencia */}
        <section>
          <Eyebrow as="h2" className="mb-8">
            {t("sections.experience")}
          </Eyebrow>

          <div className="space-y-10">
            <ExperienceItem
              logoSrc="/logos/prizmstack.jpeg"
              logoAlt="Prizmstack"
              dateRange={locale === "es" ? "Feb 2026 – Oct 2026" : "Feb 2026 – Oct 2026"}
              title="Product Engineer"
              company="Prizmstack"
              location={locale === "es" ? "Remoto · California" : "Remote · California"}
            >
              {locale === "es" ? (
                <>
                  <p>
                    Lideré la migración de <strong>FIJI</strong> desde no-code (Bubble) a Next.js y
                    armé el motor de simulaciones, que traduce métricas de operación a valuaciones
                    financieras.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I led the migration of <strong>FIJI</strong> from no-code (Bubble) to Next.js
                    and built the simulation engine that turns operating metrics into financial
                    valuations.
                  </p>
                </>
              )}
            </ExperienceItem>

            <ExperienceItem
              logoSrc="/logos/ipsaj.jpeg"
              logoAlt="IPSAJ"
              dateRange={locale === "es" ? "Oct 2024 – Presente" : "Oct 2024 – Present"}
              title={locale === "es" ? "Profesor" : "Teacher"}
              company="Instituto Politécnico San Arnoldo Janssen"
              location={locale === "es" ? "Posadas, Misiones" : "Posadas, Argentina"}
              parallel={locale === "es" ? "en paralelo" : "in parallel"}
            >
              {locale === "es" ? (
                <p>
                  Docente de <strong>Técnicas Digitales I</strong> en 4° año de Electrónica, y
                  participo en la planificación del programa académico.
                </p>
              ) : (
                <p>
                  I teach <strong>Digital Techniques I</strong> to 4th-year Electronics students,
                  and I help plan the academic program.
                </p>
              )}
            </ExperienceItem>

            <ExperienceItem
              logoSrc="/logos/banana-software.jpeg"
              logoAlt="Banana Software"
              dateRange={
                locale === "es" ? "Dic 2021 – Ene 2026 · 4 años" : "Dec 2021 – Jan 2026 · 4 years"
              }
              title="Banana Software"
              company={
                locale === "es" ? "Trainee → Product Engineer" : "Trainee → Product Engineer"
              }
              location={locale === "es" ? "Remoto" : "Remote"}
            >
              {locale === "es" ? (
                <>
                  <p>
                    Conté{" "}
                    <Link
                      href="/blog/from-bioengineering-to-product-engineer"
                      className="underline underline-offset-4"
                    >
                      cómo fue ese recorrido y qué hace el rol en la práctica
                    </Link>
                    . Lideré <strong>4 proyectos de punta a punta</strong> con equipos de 3 o 4
                    personas: plataformas B2C y B2B de hasta <strong>1.500 usuarios activos</strong>
                    , con pagos de Mercado Pago, PayPal y Stripe, y un checkout que subió la tasa de
                    reservas terminadas.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I wrote about{" "}
                    <Link
                      href="/blog/from-bioengineering-to-product-engineer"
                      className="underline underline-offset-4"
                    >
                      how that path went and what the role does in practice
                    </Link>
                    . I led <strong>4 end-to-end projects</strong> with teams of 3 or 4 people: B2C
                    and B2B platforms with up to <strong>1,500 active users</strong>, payments
                    through Mercado Pago, PayPal and Stripe, and a checkout that raised the share of
                    bookings people finished.
                  </p>
                </>
              )}
            </ExperienceItem>

            <ExperienceItem
              logoSrc="/logos/tumo.jpg"
              logoAlt="Tumo"
              dateRange={locale === "es" ? "Ago 2023 – May 2024" : "Aug 2023 – May 2024"}
              title={locale === "es" ? "Frontend Developer" : "Frontend Developer"}
              company="Tumo (Techstars '24)"
              location={locale === "es" ? "Remoto · Nueva York" : "Remote · New York"}
              parallel={locale === "es" ? "paralelo a Banana" : "parallel to Banana"}
            >
              {locale === "es" ? (
                <>
                  <p>
                    Producto fintech 0→1 para simplificar la gestión impositiva de freelancers en
                    Argentina. Entré como parte del equipo fundador y participé del{" "}
                    <strong>batch Techstars W24</strong> (Stellar & MoneyGram Accelerator) en Nueva
                    York. Llegamos a ~100 primeros usuarios en validación, y rehacer el onboarding{" "}
                    <strong>subió la conversión ~40%</strong>.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Fintech product 0→1 to simplify tax management for freelancers in Argentina. I
                    joined as part of the founding team and took part in the{" "}
                    <strong>Techstars W24 batch</strong> (Stellar & MoneyGram Accelerator) in New
                    York. We reached ~100 first users in validation, and rebuilding the onboarding{" "}
                    <strong>raised conversion ~40%</strong>.
                  </p>
                </>
              )}
            </ExperienceItem>

            <ExperienceItem
              logoSrc="/logos/drager.jpeg"
              logoAlt="Dräger"
              dateRange={locale === "es" ? "Oct 2021 – Dic 2021" : "Oct 2021 – Dec 2021"}
              title="Planner Contract Business"
              company="Dräger"
              location={locale === "es" ? "Buenos Aires" : "Buenos Aires"}
              stackLabel={locale === "es" ? "Herramientas" : "Tools"}
            >
              {locale === "es" ? (
                <>
                  <p>
                    Antes de pasarme a software, en el área de ciclo de vida del equipamiento
                    médico, planificaba el servicio técnico de <strong>64 clientes</strong> a nivel
                    nacional sobre <strong>Microsoft Dynamics NAV</strong>, con{" "}
                    <strong>ocho ingenieros de campo a cargo</strong>. El indicador del área, los
                    mantenimientos hechos dentro de su ventana contractual,{" "}
                    <strong>pasó del 78% al 92%</strong> en once semanas.
                  </p>
                  <p>
                    Para llegar ahí armé una planilla de seguimiento en Excel, que mostraba las
                    visitas en riesgo antes de que se vencieran, y rediseñé tres circuitos: el envío
                    de repuestos, que dejó de pasar por la oficina y liberó{" "}
                    <strong>entre 5 y 7,5 horas por semana por ingeniero</strong>; el pedido de
                    repuestos desde el campo para los correctivos urgentes; y una base de equipos
                    fuera de contrato, con el ahorro calculado para cada uno, que el área usó como
                    argumento para renovarlos.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Before moving into software, in medical equipment life cycle management, I
                    planned service for <strong>64 clients</strong> nationwide on{" "}
                    <strong>Microsoft Dynamics NAV</strong>, with{" "}
                    <strong>eight field engineers reporting to me</strong>. The team&apos;s metric,
                    maintenance done inside its contractual window,{" "}
                    <strong>went from 78% to 92%</strong> in eleven weeks.
                  </p>
                  <p>
                    To get there I built a tracking spreadsheet in Excel that showed the visits at
                    risk before they ran out of time, and redesigned three circuits: parts delivery,
                    which stopped going through the office and freed{" "}
                    <strong>5 to 7.5 hours a week per engineer</strong>; parts requests from the
                    field for urgent repairs; and a database of out-of-contract equipment with the
                    saving worked out for each one, which the team used as the argument to renew
                    them.
                  </p>
                </>
              )}
            </ExperienceItem>
          </div>
        </section>

        {/* Educación */}
        <section>
          <Eyebrow as="h2" className="mb-8">
            {t("sections.education")}
          </Eyebrow>

          <div className="space-y-8">
            <EducationItem
              logoSrc="/logos/itba.jpeg"
              logoAlt="ITBA"
              institution="Instituto Tecnológico de Buenos Aires (ITBA)"
              degree={locale === "es" ? "Bioingeniería" : "Biomedical Engineering"}
              location={locale === "es" ? "Buenos Aires" : "Buenos Aires"}
            >
              {locale === "es" ? (
                <>
                  <p>
                    Tesis:{" "}
                    <a
                      href="https://ri.itba.edu.ar/handle/20.500.14769/4269"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group italic underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      Predicción de mortalidad a 2 años y mutación del gen KRAS en metástasis
                      hepática de cáncer colorrectal
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="ml-0.5 inline-block opacity-0 transition-opacity group-hover:opacity-60"
                      />
                    </a>
                    , con el <strong>Hospital Italiano de Buenos Aires</strong>. Entregué un
                    algoritmo que toma un paciente oncológico nuevo y estima su riesgo, con
                    radiómica y aprendizaje automático sobre datos clínicos reales, medido sobre
                    datos que el modelo no había visto. También fui ayudante de Procesamiento de
                    Imágenes Biomédicas y de Biosensores.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Thesis:{" "}
                    <a
                      href="https://ri.itba.edu.ar/handle/20.500.14769/4269"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group italic underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      2-year mortality prediction and KRAS gene mutation in colorectal cancer liver
                      metastasis
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="ml-0.5 inline-block opacity-0 transition-opacity group-hover:opacity-60"
                      />
                    </a>
                    , with <strong>Hospital Italiano de Buenos Aires</strong>. I delivered an
                    algorithm that takes a new oncology patient and estimates their risk, built with
                    radiomics and machine learning on real clinical data and measured on data the
                    model had not seen. I was also a teaching assistant in Biomedical Image
                    Processing and in Biosensors.
                  </p>
                </>
              )}
            </EducationItem>

            <EducationItem
              logoSrc="/logos/ipsaj.jpeg"
              logoAlt="IPSAJ"
              institution="Instituto Politécnico San Arnoldo Janssen (IPSAJ)"
              degree={locale === "es" ? "Técnico Electrónico" : "Electronics Technician"}
              location={locale === "es" ? "Posadas, Misiones" : "Posadas, Argentina"}
            >
              <p>
                {locale === "es"
                  ? "Formación técnica en electrónica analógica, digital y comunicaciones. Hoy doy clases ahí."
                  : "Technical training in analog electronics, digital electronics and communications. I teach there now."}
              </p>
            </EducationItem>
          </div>
        </section>

        {/* Herramientas */}
        {/* Idiomas. Va acá, entre Educación y Herramientas, y no al lado del
            contacto: es una credencial del recorrido, no una forma de
            escribirme. Estuvo unas horas dentro de Contacto el 19/09/2026 por
            un recorte de la página, y no tenía sentido. */}
        <section>
          <Eyebrow as="h2" className="mb-4">
            {t("sections.languages")}
          </Eyebrow>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>{t("languages.spanish")}</strong> ·{" "}
              <span className="text-muted-foreground">{t("languages.spanishLevel")}</span>
            </p>
            <div>
              <p>
                <strong>{t("languages.english")}</strong> ·{" "}
                <span className="text-muted-foreground">{t("languages.englishLevel")}</span>
              </p>
              {/* Sin prosa alrededor a propósito. El certificado dice el nivel y lo
                  respalda; cualquier oración que lo acompañe termina siendo defensa
                  anticipada, y la que había le atribuía al examen una brecha entre
                  escribir y hablar que son 5 puntos sobre 160, el escalón mínimo que
                  reporta Duolingo.

                  El certificado vence en mayo de 2028: al rendir uno nuevo hay que
                  actualizar puntaje y fecha en `languages.englishCertificate`, que es
                  el único lugar donde viven. */}
              <a
                href="https://certs.duolingo.com/pfap9504d5w1ei74"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-2 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-muted"
              >
                <DuolingoIcon size={13} aria-hidden />
                <span>{t("languages.englishCertificate")}</span>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={12}
                  strokeWidth={1.5}
                  className="opacity-0 transition-opacity group-hover:opacity-60"
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </section>

        <section>
          <Eyebrow as="h2" className="mb-4">
            {t("sections.tools")}
          </Eyebrow>

          {/* Tres filas y no seis, con las mismas herramientas adentro. La lista
              se queda porque dice de dónde venís y qué hiciste, que es
              información que la página tiene que dar (decisión de Iván el
              19/09/2026, después de que yo la sacara entera). El orden sí
              cambia: datos y análisis primero, desarrollo al final, que es el
              orden en que este perfil quiere ser leído. */}
          <p className="text-sm leading-relaxed text-foreground">{t("tools.intro")}</p>

          <dl className="mt-6 space-y-3">
            <ToolCategory
              label={t("tools.categories.data.label")}
              items={t("tools.categories.data.items")}
            />
            <ToolCategory
              label={t("tools.categories.productDesign.label")}
              items={t("tools.categories.productDesign.items")}
            />
            <ToolCategory
              label={t("tools.categories.build.label")}
              items={t("tools.categories.build.items")}
            />
          </dl>
        </section>

        {/* Contacto */}
        <section id="about-contacto">
          <Eyebrow as="h2" className="mb-4">
            {t("sections.contact")}
          </Eyebrow>
          <p className="text-sm leading-relaxed">
            {t.rich("contact.intro", {
              email: (chunks) => (
                <ObfuscatedEmailTrigger
                  surface="about-footer"
                  userReversed="navituajud"
                  domainReversed="moc.liamg"
                  className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  {chunks}
                </ObfuscatedEmailTrigger>
              ),
            })}
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            {t("contact.alsoFind")}{" "}
            <a
              href="https://linkedin.com/in/ivan-dujaut"
              data-ph="contact_click"
              data-ph-kind="linkedin"
              data-ph-surface="about-footer"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              LinkedIn
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/ivandujaut"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              GitHub
            </a>
          </p>
        </section>
      </div>
    </PageShell>
  );
}

/**
 * Sin logos a propósito: acá es un inventario de herramientas, no el stack de
 * un proyecto. Los logos quedan reservados para /projects y el detalle de un
 * caso, donde acompañan a un trabajo concreto.
 */
