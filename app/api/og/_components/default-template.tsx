import { Background, getTokens, type OgTheme } from "./shared";

interface DefaultTemplateProps {
  title?: string;
  description?: string;
  locale?: "es" | "en";
  theme?: OgTheme;
}

/**
 * Template OG default (home, about, páginas sin contexto específico).
 *
 * Layout centrado, minimalista, sin imagen:
 *   - Logo "ivandujaut" arriba a la izquierda
 *   - Nombre + role centrado
 *   - Footer con dominio abajo
 *
 * Se usa cuando no hay un post o proyecto específico.
 */
export function DefaultTemplate({
  title = "Iván Dujaut",
  description,
  locale = "es",
  theme = "light",
}: DefaultTemplateProps) {
  const tokens = getTokens(theme);
  // Default description según locale
  const defaultDescription =
    locale === "es"
      ? "Product Engineer · Bioingeniero ITBA"
      : "Product Engineer · Bioengineer ITBA";

  const finalDescription = description ?? defaultDescription;

  return (
    <Background theme={theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "64px 80px",
        }}
      >
        {/* Top: Logo */}
        <span
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: tokens.fg,
            fontFamily: "JetBrainsMono",
            letterSpacing: "-0.02em",
          }}
        >
          ivandujaut
        </span>

        {/* Spacer flexible */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Center content: título + descripción */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Decorative accent line (verde sutil) */}
          <div
            style={{
              display: "flex",
              width: 64,
              height: 4,
              background: tokens.accent,
              borderRadius: 2,
            }}
          />

          {/* Título grande */}
          <h1
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: tokens.fg,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              margin: 0,
              fontFamily: "Inter",
            }}
          >
            {title}
          </h1>

          {/* Descripción */}
          <p
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: tokens.fgMuted,
              lineHeight: 1.4,
              margin: 0,
              fontFamily: "Inter",
              maxWidth: 800,
            }}
          >
            {finalDescription}
          </p>
        </div>

        {/* Spacer flexible */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Bottom: dominio */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 20,
              color: tokens.fgMuted,
              fontFamily: "JetBrainsMono",
              fontWeight: 500,
            }}
          >
            ivandujaut.com
          </span>
          <span
            style={{
              fontSize: 20,
              color: tokens.fgSubtle,
              fontFamily: "JetBrainsMono",
              fontWeight: 400,
            }}
          >
            {locale === "es" ? "Portfolio" : "Portfolio"}
          </span>
        </div>
      </div>
    </Background>
  );
}
