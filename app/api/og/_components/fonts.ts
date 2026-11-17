/**
 * Font loader para OG images.
 *
 * Carga las fuentes desde public/fonts/ en lugar de Google Fonts CDN.
 * Esto evita problemas con URLs que cambian entre versiones de Google Fonts
 * y elimina la dependencia de un servicio externo en runtime.
 *
 * Son Archivo y Chivo Mono, las mismas que el sitio. No se puede bajar el .ttf
 * y listo: en `github.com/google/fonts` las dos existen sólo como fuente
 * variable, y satori no interpola el eje de peso, así que un único archivo
 * saldría con todo al peso default (600 en Archivo, 500 en Chivo Mono) y la
 * jerarquía desaparece.
 *
 * Para agregar o regenerar un peso:
 *   1. curl la variable: raw.githubusercontent.com/google/fonts/main/ofl/<fam>/
 *   2. instanciarla al peso fijo con fontTools, que borra la tabla `fvar`:
 *      `instancer.instantiateVariableFont(f, {"wght": 600, "wdth": 100},
 *       inplace=True, updateFontNames=True)`
 *   3. guardar en public/fonts/<Name>-<weight>.ttf y agregar la entrada acá
 *
 * Los OFL.txt de cada familia viajan al lado de los .ttf porque se sirven
 * públicos y la licencia lo pide.
 */
interface FontConfig {
  name: string;
  filename: string;
  weight: 400 | 500 | 600 | 700;
  style?: "normal" | "italic";
}

const FONT_CONFIGS: FontConfig[] = [
  { name: "Archivo", filename: "Archivo-400.ttf", weight: 400 },
  { name: "Archivo", filename: "Archivo-600.ttf", weight: 600 },
  { name: "Archivo", filename: "Archivo-700.ttf", weight: 700 },
  { name: "ChivoMono", filename: "ChivoMono-400.ttf", weight: 400 },
  { name: "ChivoMono", filename: "ChivoMono-500.ttf", weight: 500 },
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
