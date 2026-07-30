import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ExperienceItem } from "@/components/about/experience-item";
import { EducationItem } from "@/components/about/education-item";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Download } from "@/components/animate-ui/icons/download";
import { CalendlyIcon } from "@/components/icons/calendly-icon";
import { buildDefaultOgUrl } from "@/lib/og";
import { buildStaticAlternates, localePath, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { personSchema } from "@/lib/jsonld";
import { ObfuscatedEmailTrigger } from "@/components/common/obfuscated-email-trigger";
import { ShareLinkButton } from "@/components/common/share-link-button";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isEs = locale === "es";

  const title = isEs
    ? "Acerca de mí · Iván Dujaut, Product Engineer"
    : "About · Iván Dujaut, Product Engineer";
  const description = isEs
    ? "Product Engineer con 4 años en Next.js y TypeScript. Argentina, remoto con EE.UU. y LATAM. Techstars W24 alumni. Bioingeniero ITBA. Mirá mi experiencia y contactame."
    : "Product Engineer with 4 years in Next.js and TypeScript. Argentina, remote with US and LATAM teams. Techstars W24 alumni. ITBA bioengineer. See my experience and get in touch.";

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
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ObfuscatedEmailTrigger
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
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            <CalendlyIcon size={14} aria-hidden />
            <span>{t("intro.ctas.calendly")}</span>
          </a>
          <AnimateIcon animateOnHover asChild>
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
              stack="Next.js, TypeScript, PostgreSQL, Supabase, Vercel"
            >
              {locale === "es" ? (
                <>
                  <p>
                    Desarrollo de <strong>FIJI</strong>, una plataforma de valuación para negocios
                    inmobiliarios. Lidero la migración desde no-code (Bubble) a Next.js, y construyo
                    el motor de simulaciones de valor que conecta métricas operativas con
                    valuaciones financieras.
                  </p>
                  <p>
                    Trabajo en la intersección ingeniería-producto: flujos de usuario, dashboards,
                    marketplace y herramientas internas de administración.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Building <strong>FIJI</strong>, a valuation platform for real estate businesses.
                    Leading the migration from no-code (Bubble) to Next.js, and building the value
                    simulation engine that connects operational metrics with financial valuations.
                  </p>
                  <p>
                    Working at the engineering-product intersection: user flows, dashboards,
                    marketplace and internal admin tools.
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
                  secuencial. También participo en planificación y actualización del programa
                  académico. Enseñar me obliga a entender los conceptos a un nivel más profundo.
                </p>
              ) : (
                <p>
                  Teaching <strong>Digital Techniques I</strong> to 4th-year Electronics students.
                  Topics include Boolean algebra, Karnaugh maps, combinational and sequential logic.
                  I also participate in academic program planning. Teaching forces me to understand
                  concepts at a deeper level.
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
              stack="Next.js, TypeScript, Node.js, ExpressJS, Tailwind CSS, shadcn/ui, MaterialUI, Stripe, PayPal, Figma, JIRA"
            >
              {locale === "es" ? (
                <>
                  <p>
                    Mi experiencia más larga, y donde realmente aprendí a construir producto. Crecí
                    desde Trainee hasta Product Engineer en 4 años, pasando por desarrollo
                    individual, liderazgo de proyectos y, finalmente, decisiones de producto y
                    priorización.
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
                  <p>
                    Como <strong>Junior</strong> (Ene 2023 – Jun 2024), implementé Next.js,
                    Tailwind, shadcn y MaterialUI por primera vez en la empresa.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    My longest experience, and where I really learned to build product. Grew from
                    Trainee to Product Engineer over 4 years, going through individual contribution,
                    project leadership, and finally product and prioritization decisions.
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
                  <p>
                    As <strong>Junior</strong> (Jan 2023 – Jun 2024), I introduced Next.js,
                    Tailwind, shadcn and MaterialUI for the first time at the company.
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
              stack="Next.js, TypeScript, AWS"
            >
              {locale === "es" ? (
                <>
                  <p>
                    Producto fintech 0→1 para simplificar la gestión impositiva de freelancers en
                    Argentina. Participé del <strong>batch Techstars W24</strong> (Stellar &
                    MoneyGram Accelerator) en Nueva York como parte del equipo fundador.
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>~100 usuarios early adopters en fase de validación</li>
                    <li>
                      Mejoras de onboarding que <strong>incrementaron el engagement ~40%</strong>
                    </li>
                    <li>Colaboración directa con founders en decisiones de roadmap</li>
                    <li>
                      Operación en entorno Techstars: validación rápida, iteración semanal,
                      escalabilidad
                    </li>
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
                    <li>~100 early adopters in validation phase</li>
                    <li>
                      Onboarding improvements that <strong>increased engagement ~40%</strong>
                    </li>
                    <li>Direct collaboration with founders on roadmap decisions</li>
                    <li>
                      Techstars environment operation: fast validation, weekly iteration,
                      scalability
                    </li>
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
              stack="Microsoft Dynamics NAV, ERP, KPIs"
              stackLabel={locale === "es" ? "Herramientas" : "Tools"}
            >
              {locale === "es" ? (
                <>
                  <p>
                    Mi primer rol full-time, antes de pasarme a software. Planificaba mantenimientos
                    preventivos a nivel nacional usando <strong>Microsoft Dynamics NAV</strong>:
                    Service Requests, Sales Orders, Service Orders, gestión de recursos y KPIs
                    digitales.
                  </p>
                  <p>
                    Una experiencia corta pero formativa: aprendí cómo se piensa la operación de una
                    empresa grande, cómo se diseñan procesos y cómo se mide la performance con
                    métricas reales. Esa lente operativa la sigo aplicando hoy en producto.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    My first full-time role, before moving into software. Planned preventive
                    maintenance at a national level using <strong>Microsoft Dynamics NAV</strong>:
                    Service Requests, Sales Orders, Service Orders, resource management and digital
                    KPIs.
                  </p>
                  <p>
                    A short but formative experience: I learned how a large company thinks about
                    operations, how processes are designed, and how performance is measured with
                    real metrics. That operational lens still informs how I think about product
                    today.
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
                    una necesidad real de la institución: poder anticipar outcomes clínicos en
                    pacientes oncológicos a partir de datos históricos. Trabajé con datos clínicos
                    reales, modelos predictivos y análisis estadístico aplicado a oncología.
                  </p>
                  <p>
                    El ITBA me dio una base cuantitativa sólida que después se tradujo naturalmente
                    en cómo abordo problemas de software: con foco en métricas, modelado y
                    trade-offs explícitos.
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
                    <strong>Hospital Italiano de Buenos Aires</strong>. The research addressed a
                    real institutional need: predicting clinical outcomes in oncology patients from
                    historical data. I worked with real clinical data, predictive models and
                    statistical analysis applied to oncology.
                  </p>
                  <p>
                    ITBA gave me a solid quantitative foundation that translated naturally into how
                    I approach software problems: metrics-focused, model-driven, with explicit
                    trade-offs.
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
                  ? "Formación técnica en electrónica analógica, digital y comunicaciones. La base donde empecé a entender sistemas y resolución de problemas con herramientas concretas."
                  : "Technical training in analog electronics, digital electronics and communications. The foundation where I started understanding systems and problem solving with concrete tools."}
              </p>
            </EducationItem>
          </div>
        </section>

        {/* Herramientas */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.tools")}
          </h2>

          <p className="text-sm leading-relaxed text-foreground">{t("tools.intro")}</p>

          <dl className="mt-6 space-y-3">
            <ToolCategory
              label={t("tools.categories.frontend.label")}
              items={t("tools.categories.frontend.items")}
            />
            <ToolCategory
              label={t("tools.categories.backend.label")}
              items={t("tools.categories.backend.items")}
            />
            <ToolCategory
              label={t("tools.categories.payments.label")}
              items={t("tools.categories.payments.items")}
            />
            <ToolCategory
              label={t("tools.categories.productDesign.label")}
              items={t("tools.categories.productDesign.items")}
            />
            <ToolCategory
              label={t("tools.categories.infrastructure.label")}
              items={t("tools.categories.infrastructure.items")}
            />
            <ToolCategory
              label={t("tools.categories.data.label")}
              items={t("tools.categories.data.items")}
            />
          </dl>
        </section>

        {/* Idiomas */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.languages")}
          </h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>{t("languages.spanish")}</strong> ·{" "}
              <span className="text-muted-foreground">{t("languages.spanishLevel")}</span>
            </p>
            <p>
              <strong>{t("languages.english")}</strong> ·{" "}
              <span className="text-muted-foreground">{t("languages.englishDescription")}</span>
            </p>
          </div>
        </section>

        {/* Contacto */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t("sections.contact")}
          </h2>
          <p className="text-sm leading-relaxed">
            {t.rich("contact.intro", {
              email: (chunks) => (
                <ObfuscatedEmailTrigger
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
function ToolCategory({ label, items }: { label: string; items: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{items}</dd>
    </div>
  );
}
