/* eslint-disable @next/next/no-img-element */
import { Logo, Footer, Background, Tag, getTokens, type OgTheme } from "./shared";

interface ProjectTemplateProps {
  title: string;
  description?: string;
  stack?: string[];
  status?: "shipped" | "in-progress" | "archived" | "concept";
  coverUrl?: string;
  locale?: "es" | "en";
  theme?: OgTheme;
}

/**
 * Template OG para proyectos.
 *
 * Layout split (horizontal):
 *   - Left side (55%): logo + status + título + descripción + stack + CTA + footer
 *   - Right side (45%): cover image (si existe) o gradient sutil
 *
 * Si no hay coverUrl, el texto ocupa el ancho completo.
 */
export function ProjectTemplate({
  title,
  description,
  stack = [],
  status,
  coverUrl,
  locale = "es",
  theme = "light",
}: ProjectTemplateProps) {
  const tokens = getTokens(theme);
  // Status label según locale
  const statusLabels = {
    shipped: { es: "EN VIVO", en: "LIVE" },
    "in-progress": { es: "EN PROCESO", en: "WIP" },
    archived: { es: "ARCHIVADO", en: "ARCHIVED" },
    concept: { es: "CONCEPTO", en: "CONCEPT" },
  };

  // Project label según locale
  const projectLabel = locale === "es" ? "PROYECTO" : "PROJECT";

  // CTA según locale
  const ctaLabel = locale === "es" ? "Ver proyecto" : "View project";

  // Limitar stack a máximo 4 items para no saturar
  const visibleStack = stack.slice(0, 4);

  // Color del dot según status
  const statusColor =
    status === "shipped"
      ? tokens.accent
      : status === "in-progress"
        ? "#f59e0b"
        : status === "concept"
          ? "#3b82f6"
          : tokens.fgSubtle;

  return (
    <Background theme={theme}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        {/* LEFT SIDE: contenido (55%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: coverUrl ? "55%" : "100%",
            padding: "56px 64px",
          }}
        >
          {/* Top zone: Logo + Project label + Status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Logo theme={theme} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 18,
                color: tokens.fgMuted,
                fontFamily: "JetBrainsMono",
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              <span>{projectLabel}</span>
              {status && (
                <>
                  <span style={{ color: tokens.fgSubtle }}>·</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        background: statusColor,
                      }}
                    />
                    <span>{statusLabels[status][locale]}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Spacer flexible */}
          <div style={{ display: "flex", flex: 1, minHeight: 32 }} />

          {/* Content zone: título + descripción */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Título */}
            <h1
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: tokens.fg,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                margin: 0,
                fontFamily: "Inter",
              }}
            >
              {title}
            </h1>

            {/* Descripción */}
            {description && (
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: tokens.fgMuted,
                  lineHeight: 1.4,
                  margin: 0,
                  fontFamily: "Inter",
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Stack + CTA zone */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginTop: 32,
            }}
          >
            {/* Stack pills */}
            {visibleStack.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {visibleStack.map((tech) => (
                  <Tag key={tech} label={tech} theme={theme} />
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 24px",
                borderRadius: 12,
                background: tokens.fg,
                color: tokens.bg,
                fontSize: 18,
                fontWeight: 600,
                fontFamily: "Inter",
                alignSelf: "flex-start",
              }}
            >
              {ctaLabel}
            </div>
          </div>

          {/* Spacer flexible */}
          <div style={{ display: "flex", flex: 1, minHeight: 32 }} />

          {/* Bottom zone: Footer */}
          <Footer theme={theme} />
        </div>

        {/* RIGHT SIDE: cover image (45%) */}
        {coverUrl && (
          <div
            style={{
              display: "flex",
              width: "45%",
              height: "100%",
              padding: "56px 56px 56px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              {/* Capa verde (al fondo, desplazada abajo-derecha) */}
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  top: 16,
                  left: 16,
                  width: "100%",
                  height: "100%",
                  background: tokens.accent,
                  borderRadius: 12,
                }}
              />
              {/* Imagen (encima) */}
              <img
                src={coverUrl}
                alt=""
                width={540}
                height={566}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 12,
                  position: "relative",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Background>
  );
}
