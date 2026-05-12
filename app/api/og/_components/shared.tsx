/**
 * Tipo de theme para las OG images.
 */
export type OgTheme = "light" | "dark";

/**
 * Tokens de diseño para las OG images, separados por theme.
 *
 * Hardcodeamos los valores porque @vercel/og no soporta CSS variables.
 * Estos colores matchean los del sitio (light/dark mode).
 */
export const themes = {
  light: {
    bg: "#fafaf9",
    bgElevated: "#f5f5f4",
    fg: "#0a0a0a",
    fgMuted: "#525252",
    fgSubtle: "#737373",
    border: "#e5e5e5",
    accent: "#22c55e",
  },
  dark: {
    bg: "#0a0a0a",
    bgElevated: "#171717",
    fg: "#fafafa",
    fgMuted: "#a3a3a3",
    fgSubtle: "#737373",
    border: "#262626",
    accent: "#22c55e",
  },
} as const;

/**
 * Obtiene los tokens del theme indicado.
 *
 * Se usa al inicio de cada template para acceder a los colores correctos.
 */
export function getTokens(theme: OgTheme = "light") {
  return themes[theme];
}

/**
 * Logo "ivandujaut" en texto mono.
 *
 * Cambia color según el theme.
 */
export function Logo({ theme = "light" }: { theme?: OgTheme }) {
  const tokens = getTokens(theme);
  return (
    <span
      style={{
        fontSize: 24,
        fontWeight: 500,
        color: tokens.fg,
        fontFamily: "JetBrainsMono",
        letterSpacing: "-0.02em",
      }}
    >
      ivandujaut
    </span>
  );
}

/**
 * Footer común de las OG images.
 *
 * Cambia color según el theme.
 */
export function Footer({ theme = "light" }: { theme?: OgTheme }) {
  const tokens = getTokens(theme);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 22,
          color: tokens.fg,
          fontFamily: "Inter",
          fontWeight: 600,
        }}
      >
        Iván Dujaut
      </span>
      <span
        style={{
          fontSize: 18,
          color: tokens.fgMuted,
          fontFamily: "Inter",
          fontWeight: 400,
        }}
      >
        Product Engineer · ivandujaut.com
      </span>
    </div>
  );
}

/**
 * Container del template con fondo del theme.
 */
interface BackgroundProps {
  children: React.ReactNode;
  theme?: OgTheme;
}

export function Background({ children, theme = "light" }: BackgroundProps) {
  const tokens = getTokens(theme);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: tokens.bg,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Pill de tag, estilo etiqueta con border sutil.
 */
interface TagProps {
  label: string;
  theme?: OgTheme;
}

export function Tag({ label, theme = "light" }: TagProps) {
  const tokens = getTokens(theme);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 100,
        border: `1px solid ${tokens.border}`,
        background: tokens.bgElevated,
        color: tokens.fgMuted,
        fontSize: 18,
        fontFamily: "JetBrainsMono",
        fontWeight: 400,
      }}
    >
      {label}
    </div>
  );
}
