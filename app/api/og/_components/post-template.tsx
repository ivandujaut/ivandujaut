/* eslint-disable @next/next/no-img-element */
import { Logo, Footer, Background, Tag, getTokens, type OgTheme } from "./shared";

interface PostTemplateProps {
  title: string;
  description?: string;
  date?: string;
  readingTime?: string;
  tags?: string[];
  coverUrl?: string;
  locale?: "es" | "en";
  theme?: OgTheme;
}

/**
 * Template OG para posts de blog.
 *
 * Layout split (horizontal):
 *   - Left side (55%): logo + meta + título + descripción + tags + CTA + footer
 *   - Right side (45%): cover image (si existe)
 *
 * Si no hay coverUrl, el texto ocupa el ancho completo.
 *
 * Estructura vertical del lado izquierdo (5 zonas con espacios controlados):
 *   1. Logo (top)
 *   2. Meta line (fecha + reading time)
 *   3. Título + descripción + tags (grupo)
 *   4. CTA button (con separación)
 *   5. Footer (bottom)
 */
export function PostTemplate({
  title,
  description,
  date,
  readingTime,
  tags = [],
  coverUrl,
  locale = "es",
  theme = "light",
}: PostTemplateProps) {
  const tokens = getTokens(theme);
  // Construir línea de meta: "11 de mayo de 2026 · 10 min de lectura"
  const readingTimeLabel = locale === "es" ? "de lectura" : "read";
  const metaParts: string[] = [];
  if (date) metaParts.push(date);
  if (readingTime) metaParts.push(`${readingTime} ${readingTimeLabel}`);
  const metaLine = metaParts.join(" · ");

  // CTA según locale
  const ctaLabel = locale === "es" ? "Leer artículo" : "Read article";

  // Limitar tags a máximo 3 para no saturar el diseño
  const visibleTags = tags.slice(0, 3);

  return (
    <Background theme={theme}>
      {/* Layout split: left content, right image */}
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
          {/* Top zone: Logo + Meta */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Logo theme={theme} />
            {metaLine && (
              <span
                style={{
                  fontSize: 18,
                  color: tokens.fgMuted,
                  fontFamily: "JetBrainsMono",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {metaLine}
              </span>
            )}
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
                fontSize: 52,
                fontWeight: 700,
                color: tokens.fg,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
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

          {/* Tags + CTA zone (con separación visual del título) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginTop: 32,
            }}
          >
            {/* Tags */}
            {visibleTags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                {visibleTags.map((tag) => (
                  <Tag key={tag} label={tag} theme={theme} />
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

          {/* Spacer flexible para empujar el footer al fondo */}
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
            {/* Container exterior: hace de "capa verde" de fondo */}
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
              {/* Imagen (encima, en posición original) */}
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
