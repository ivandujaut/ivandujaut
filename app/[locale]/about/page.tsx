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
import { getEntryProject, getProjects, getPublishingCadence } from "@/lib/content";
import { ProjectListItem } from "@/components/content/project-list-item";
import { buildDefaultOgUrl } from "@/lib/og";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { personSchema } from "@/lib/jsonld";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { ShareLinkButton } from "@/components/common/share-link-button";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Cuántas piezas se muestran: la de entrada del índice y las tres más nuevas.
 * Cuatro entran en media pantalla y alcanzan para mostrar de qué se trata; el
 * cuerpo completo vive en `/projects`, que es la página hecha para recorrerlo.
 */
const PIEZAS_EN_ABOUT = 4;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";

  const title = isEs
    ? "Acerca de mí · Iván Dujaut, product strategy y decision analytics"
    : "About · Iván Dujaut, product strategy and decision analytics";
  // La descripción vende el trabajo publicado, no el cargo: es lo que
  // diferencia el perfil y lo que sostiene el resto de la página.
  const description = isEs
    ? "Analizo mercados y productos con datos públicos: salud en Estados Unidos, seguros y pagos en Argentina y Brasil. Bioingeniero del ITBA, Techstars W24."
    : "I analyze markets and products with public data: US healthcare, insurance and payments in Argentina and Brazil. ITBA bioengineer, Techstars W24.";

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

function AboutContent({ locale }: { locale: "es" | "en" }) {
  const t = useTranslations("about");
  const tWork = useTranslations("home.work");

  // La de entrada primero y después una por mercado, de la más nueva a la más
  // vieja. No son "las cuatro más recientes" a propósito: las siete piezas más
  // nuevas del sitio son todas de salud, y cuatro seguidas del mismo mercado
  // dicen que eso es lo único que hace. Lo que esta página tiene que mostrar es
  // que el método viaja entre industrias, que es el argumento del perfil.
  const entrada = getEntryProject(locale);
  const porFecha = getProjects(locale).filter((pieza) => pieza.slug !== entrada?.slug);
  const mercadosUsados = new Set(entrada ? [entrada.topic] : []);
  const unaPorMercado = porFecha.filter((pieza) => {
    if (mercadosUsados.has(pieza.topic)) return false;
    mercadosUsados.add(pieza.topic);
    return true;
  });
  const destacados = [...(entrada ? [entrada] : []), ...unaPorMercado].slice(0, PIEZAS_EN_ABOUT);
  const cadencia = getPublishingCadence(locale);

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24">
      <JsonLd data={personSchema(locale)} />
      {/* Intro */}
      <section>
        <div className="flex flex-row items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">{t("intro.greeting")}</h1>
          <ShareLinkButton
            url={`${SITE_URL}${localePath(locale, "/about")}`}
            title={t("intro.greeting")}
            className="mt-2"
          />
        </div>
        <div className="mt-6 space-y-4 leading-relaxed text-foreground">
          <p>{t("intro.paragraph1")}</p>
          <p>{t("intro.paragraph2")}</p>
          <p>{t("intro.paragraph3")}</p>
          <p>{t("intro.paragraph4")}</p>
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
          {/* Sin `asChild`: esta página es Server Component y `AnimateIcon` es
              cliente; ver el comentario en `components/home/stats-grid.tsx`. */}
          <AnimateIcon animateOnHover className="inline-flex">
            <a
              href="/cv-ivan-dujaut.pdf"
              download
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <Download size={14} strokeWidth={1.5} aria-hidden />
              <span>{t("intro.ctas.cv")}</span>
            </a>
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
            pantallas y cuarto de lista plana. Ahora van cuatro piezas con la
            misma tarjeta del índice, la cadencia calculada y el link al resto.
            Los casos que salen de acá siguen enlazados desde el índice, la
            home, el sitemap, el RSS y los "siguientes casos" al pie de cada
            pieza, así que no pierden autoridad interna. */}
        <section>
          <h2 className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.work")}
          </h2>
          <div className="space-y-1">
            {destacados.map((pieza) => (
              <ProjectListItem
                key={pieza.slug}
                slug={pieza.slug}
                title={pieza.title}
                tagline={pieza.tagline}
                date={pieza.date}
                stack={pieza.stack}
                showStack={false}
                status={pieza.status}
                kind={pieza.kind}
                locale={locale}
                surface="home"
              />
            ))}
          </div>
          {cadencia && (
            <p className="mt-5 text-sm text-muted-foreground">
              {tWork("cadence", {
                count: cadencia.count,
                days: cadencia.everyDays,
                since: new Date(cadencia.since).toLocaleDateString(locale, {
                  month: "long",
                  year: "numeric",
                }),
              })}
            </p>
          )}
          <Link
            href="/projects"
            className="mt-4 inline-flex items-center gap-1 text-sm underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {t("work.all")}
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} aria-hidden />
          </Link>
        </section>

        {/* Experiencia */}
        <section>
          <h2 className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.experience")}
          </h2>

          <div className="space-y-10">
            <ExperienceItem
              logoSrc="/logos/prizmstack.jpeg"
              logoAlt="Prizmstack"
              dateRange={locale === "es" ? "Feb 2026 – Presente" : "Feb 2026 – Present"}
              title="Product Engineer"
              company="Prizmstack"
              location={locale === "es" ? "Remoto · California" : "Remote · California"}
            >
              {locale === "es" ? (
                <>
                  <p>
                    Construyo <strong>FIJI</strong>, una plataforma de valuación para negocios
                    inmobiliarios. Lidero la migración desde no-code (Bubble) a Next.js y armo el
                    motor de simulaciones, que traduce métricas de operación a valuaciones
                    financieras.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I build <strong>FIJI</strong>, a valuation platform for real estate businesses.
                    I lead the migration from no-code (Bubble) to Next.js and build the simulation
                    engine that turns operating metrics into financial valuations.
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
                  Docente de <strong>Técnicas Digitales I</strong> para estudiantes de 4° año de
                  Electrónica. Enseño álgebra de Boole, mapas de Karnaugh, lógica combinacional y
                  secuencial, y participo en la planificación del programa académico.
                </p>
              ) : (
                <p>
                  I teach <strong>Digital Techniques I</strong> to 4th-year Electronics students:
                  Boolean algebra, Karnaugh maps, combinational and sequential logic. I also help
                  plan the academic program.
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
                    Mi experiencia más larga, y donde aprendí a construir producto. Entré de Trainee
                    y salí de Product Engineer, cuatro años después. Conté{" "}
                    <Link
                      href="/blog/from-bioengineering-to-product-engineer"
                      className="underline underline-offset-4"
                    >
                      cómo fue ese recorrido y qué hace el rol en la práctica
                    </Link>
                    .
                  </p>
                  <p>
                    Como <strong>Product Engineer</strong> (Ago 2025 – Ene 2026), mejoré la{" "}
                    <strong>predictibilidad de sprints del 60% al 90%</strong> modelando esfuerzo
                    real. Eliminé ~20% de funcionalidades de bajo valor priorizando por impacto.
                  </p>
                  <p>
                    Como <strong>Semi Senior</strong> (Jul 2024 – Jul 2025), lideré{" "}
                    <strong>4 proyectos end-to-end</strong> con equipos de 3-4 personas. Plataformas
                    B2C y B2B con hasta <strong>1.500 usuarios activos</strong>. Integré pagos con
                    Mercado Pago, PayPal y Stripe; optimicé checkout B2C aumentando tasa de
                    finalización de reservas.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    My longest experience, and where I learned to build product. I came in as a
                    Trainee and left as a Product Engineer, four years later. I wrote about{" "}
                    <Link
                      href="/blog/from-bioengineering-to-product-engineer"
                      className="underline underline-offset-4"
                    >
                      how that path went and what the role does in practice
                    </Link>
                    .
                  </p>
                  <p>
                    As <strong>Product Engineer</strong> (Aug 2025 – Jan 2026), I improved{" "}
                    <strong>sprint predictability from 60% to 90%</strong> by modeling real effort.
                    Removed ~20% of low-value features by prioritizing by impact.
                  </p>
                  <p>
                    As <strong>Semi Senior</strong> (Jul 2024 – Jul 2025), I led{" "}
                    <strong>4 end-to-end projects</strong> with teams of 3-4 people. B2C and B2B
                    platforms with up to <strong>1,500 active users</strong>. Integrated payments
                    with Mercado Pago, PayPal and Stripe; optimized B2C checkout, increasing booking
                    completion rates.
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
                    Argentina. Participé del <strong>batch Techstars W24</strong> (Stellar &
                    MoneyGram Accelerator) en Nueva York como parte del equipo fundador.
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>~100 primeros usuarios durante la fase de validación</li>
                    <li>
                      Mejoras de onboarding que <strong>incrementaron el engagement ~40%</strong>
                    </li>
                    <li>Decisiones de roadmap discutidas de primera mano con los fundadores</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    Fintech product 0→1 to simplify tax management for freelancers in Argentina.
                    Participated in the <strong>Techstars W24 batch</strong> (Stellar & MoneyGram
                    Accelerator) in New York as part of the founding team.
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>~100 first users during the validation phase</li>
                    <li>
                      Onboarding improvements that <strong>increased engagement ~40%</strong>
                    </li>
                    <li>Roadmap decisions discussed first-hand with the founders</li>
                  </ul>
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
                    Mi primer rol full-time, antes de pasarme a software: planificaba mantenimientos
                    preventivos a nivel nacional sobre <strong>Microsoft Dynamics NAV</strong>. Duró
                    tres meses y me mostró cómo una empresa grande diseña sus procesos y mide su
                    rendimiento.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    My first full-time role, before moving into software: I planned preventive
                    maintenance at a national level on <strong>Microsoft Dynamics NAV</strong>. It
                    lasted three months and showed me how a large company designs its processes and
                    measures its performance.
                  </p>
                </>
              )}
            </ExperienceItem>
          </div>
        </section>

        {/* Educación */}
        <section>
          <h2 className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.education")}
          </h2>

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
                    , desarrollada en conjunto con el{" "}
                    <strong>Hospital Italiano de Buenos Aires</strong>. La investigación partió de
                    una necesidad del hospital: anticipar la evolución clínica de un paciente
                    oncológico a partir de sus datos históricos. Trabajé con datos clínicos reales,
                    modelos predictivos y estadística aplicada a oncología.
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
                    , developed in collaboration with{" "}
                    <strong>Hospital Italiano de Buenos Aires</strong>. The research came from a
                    need the hospital had: predicting how an oncology patient would evolve from
                    their historical data. I worked with real clinical data, predictive models and
                    statistics applied to oncology.
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
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.tools")}
          </h2>

          {/* Sólo la prosa. Hasta el 19/09/2026 abajo iba una matriz de seis
              filas de tecnologías (React, Tailwind, shadcn/ui, MaterialUI,
              Figma, JIRA...), que es la misma señal de desarrollo que sacamos
              de la home: en una página que argumenta criterio de producto y
              análisis, enumerar el stack del frontend corre el foco. Este
              párrafo ya dice lo que importa, que el análisis es Python sobre
              PostgreSQL y la medición PostHog. */}
          <p className="text-sm leading-relaxed text-foreground">{t("tools.intro")}</p>
        </section>

        {/* Cierre: idiomas y contacto juntos. Eran dos secciones con su
            encabezado para 16 palabras cada una, al final de una página que ya
            venía larga. */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.contact")}
          </h2>
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

          <p className="mt-6 text-sm leading-relaxed">
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
    </main>
  );
}

/**
 * Sin logos a propósito: acá es un inventario de herramientas, no el stack de
 * un proyecto. Los logos quedan reservados para /projects y el detalle de un
 * caso, donde acompañan a un trabajo concreto.
 */
