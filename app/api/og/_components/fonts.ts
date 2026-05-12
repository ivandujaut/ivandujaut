/**
 * Font loader para OG images.
 *
 * Carga las fuentes desde public/fonts/ en lugar de Google Fonts CDN.
 * Esto evita problemas con URLs que cambian entre versiones de Google Fonts
 * y elimina la dependencia de un servicio externo en runtime.
 *
 * Para agregar una fuente nueva:
 *   1. Descargar el .ttf con curl (ver README de skill o googlefonts CSS)
 *   2. Guardar en public/fonts/<Name>-<weight>.ttf
 *   3. Agregar entrada a FONT_CONFIGS
 */

interface FontConfig {
  name: string;
  filename: string;
  weight: 400 | 500 | 600 | 700;
  style?: "normal" | "italic";
}

const FONT_CONFIGS: FontConfig[] = [
  { name: "Inter", filename: "Inter-400.ttf", weight: 400 },
  { name: "Inter", filename: "Inter-600.ttf", weight: 600 },
  { name: "Inter", filename: "Inter-700.ttf", weight: 700 },
  { name: "JetBrainsMono", filename: "JetBrainsMono-400.ttf", weight: 400 },
  { name: "JetBrainsMono", filename: "JetBrainsMono-500.ttf", weight: 500 },
];

/**
 * Carga todas las fuentes desde public/fonts.
 *
 * Usa fetch sobre la URL pública del propio sitio. Esto funciona tanto
 * en desarrollo (localhost) como en producción (Vercel) sin cambios.
 */
export async function loadFonts(baseUrl: string) {
  const fonts = await Promise.all(
    FONT_CONFIGS.map(async (config) => {
      const url = `${baseUrl}/fonts/${config.filename}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to load font ${config.name} ${config.weight} from ${url}: ${response.status}`,
        );
      }

      const data = await response.arrayBuffer();

      return {
        name: config.name,
        data,
        weight: config.weight,
        style: config.style ?? ("normal" as const),
      };
    }),
  );

  return fonts;
}
