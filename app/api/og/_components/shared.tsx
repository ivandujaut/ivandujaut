/**
 * Tipo de theme para las OG images.
 */
export type OgTheme = "light" | "dark";

/**
 * Tokens de diseño para las OG images, separados por theme.
 *
 * Hardcodeamos los valores porque @vercel/og no soporta CSS variables: son la
 * conversión a hex de los tokens oklch de `globals.css`, no una paleta aparte.
 * Si cambia la del sitio, se vuelven a convertir estos.
 *
 * `fgSubtle` es el único que no sale de un token: el sitio no tiene un tercer
 * nivel de texto. Está fijado en el oklch más claro que todavía da AA sobre
 * `bg` a 20px (4.82:1).
 *
 * `accent` es `--casebook`, el único acento de la marca. Antes había un verde
 * y un azul de Tailwind que no existen en ninguna parte del sitio.
 */
export const themes = {
  light: {
    bg: "#fbf9f4",
    bgElevated: "#f1ede6",
    fg: "#1d1712",
    fgMuted: "#6b6159",
    fgSubtle: "#756d65",
    border: "#e2ddd5",
    accent: "#5457cb",
  },
  dark: {
    bg: "#14110c",
    bgElevated: "#1d1a14",
    fg: "#efebe2",
    fgMuted: "#aba398",
    fgSubtle: "#867f76",
    border: "#312d27",
    accent: "#9ba7ff",
  },
} as const;

/**
 * Colores de estado del proyecto.
 *
 * No son tokens de marca: son los mismos que usa `StatusBadge` en el sitio
 * (`components/content/status-badge.tsx`), para que el punto de la tarjeta y la
 * etiqueta de la página digan lo mismo con el mismo color. Son los `500` de
 * Tailwind porque acá se usan como punto, no como texto.
 *
 * El acento de marca (`accent`, el violeta) es otra cosa y no se mezcla: antes
 * "shipped" lo usaba y por eso el verde del punto no coincidía con el verde de
 * la etiqueta.
 */
export const statusColors = {
  shipped: "#10b981",
  "in-progress": "#f59e0b",
  archived: "#71717a",
  concept: "#3b82f6",
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
        fontFamily: "ChivoMono",
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
          fontFamily: "Archivo",
          fontWeight: 600,
        }}
      >
        Iván Dujaut
      </span>
      <span
        style={{
          fontSize: 18,
          color: tokens.fgMuted,
          fontFamily: "Archivo",
          fontWeight: 400,
        }}
      >
        ivandujaut.com
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
        fontFamily: "ChivoMono",
        fontWeight: 400,
      }}
    >
      {label}
    </div>
  );
}
