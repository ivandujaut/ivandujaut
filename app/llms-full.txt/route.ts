import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

/**
 * El texto completo de los casos, en un solo archivo.
 *
 * `llms.txt` es el índice: título, URL y bajada de cada pieza. Éste es el
 * cuerpo. La diferencia importa porque un modelo que responde una pregunta con
 * el índice sólo puede decir que el caso existe; con el cuerpo puede citar el
 * número y decir de dónde salió, que es lo único que este sitio tiene para
 * ofrecer que no tenga la fuente original.
 *
 * Va en castellano, que es la versión canónica. Sumar el inglés lo llevaría de
 * 400 KB a 780 KB para decir lo mismo dos veces, y las páginas en inglés se
 * rastrean igual y están listadas en `llms.txt`. Las cifras, los nombres de
 * empresa y los de dataset son los mismos en los dos idiomas.
 *
 * Sólo los casos. El blog está indexado en `llms.txt` con su bajada; son tres
 * piezas de mayo sobre oficio y carrera, y no es por lo que este sitio quiere
 * ser citado.
 *
 * Se lee del disco porque Velite entrega `content` como MDX ya compilado a
 * JavaScript, que no sirve para esto. Como la ruta es estática, el `readFileSync`
 * corre en el build y no en cada visita.
 */
export const dynamic = "force-static";

/**
 * MDX a texto plano.
 *
 * Los componentes propios no se tiran enteros: el `caption` de un `<Figure>`
 * dice qué muestra el gráfico, con qué corte y de qué archivo salió, y eso es
 * exactamente lo que hace verificable a una cifra. Lo que sí se va es `src`,
 * `alt`, `width` y `height`, que describen la imagen y no el dato.
 */
function aTextoPlano(mdx: string): string {
  let texto = mdx;

  // 1. El frontmatter ya viaja como metadatos arriba de cada pieza.
  texto = texto.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");

  // 2. Componentes autocerrados: se rescata el pie y se descarta el resto.
  texto = texto.replace(/<([A-Z][A-Za-z]*)\b[^>]*?\/>/g, (bloque) => {
    const pie = bloque.match(/caption="((?:[^"\\]|\\.)*)"/);
    return pie ? `Figura: ${pie[1].replace(/\\"/g, '"')}\n` : "";
  });

  // 3. Etiquetas de apertura y cierre de componentes con hijos: se va la
  //    etiqueta y se queda el texto que envuelve.
  texto = texto.replace(/<\/?[A-Z][A-Za-z]*\b[^>]*>/g, "");

  // 4. Importaciones y exportaciones sueltas, si alguna pieza llega a tenerlas.
  texto = texto.replace(/^(import|export)\s.*$/gm, "");

  // 5. Un nivel abajo cada encabezado, para que el `##` del título de un caso no
  //    se confunda con el `##` de una sección adentro de ese caso. Sin esto, un
  //    parser que corte por `##` devuelve 178 piezas donde hay 18. Se saltean
  //    los bloques de código, donde un `#` al principio de línea es un
  //    comentario y no un encabezado.
  let dentroDeCodigo = false;
  texto = texto
    .split("\n")
    .map((linea) => {
      if (/^\s*```/.test(linea)) {
        dentroDeCodigo = !dentroDeCodigo;
        return linea;
      }
      if (dentroDeCodigo) return linea;
      return linea.replace(/^(#{1,5}) /, "#$1 ");
    })
    .join("\n");

  // 6. Los huecos que dejaron los pasos anteriores.
  return texto.replace(/\n{3,}/g, "\n\n").trim();
}

function build(): string {
  const casos = getProjects("es");

  const lines: string[] = [
    "# Iván Dujaut · texto completo de los casos",
    "",
    "> Escribo casos sobre salud y seguros: reconstruyo el problema, los actores" +
      " y los datos públicos, y termino en una decisión. Bioingeniero del ITBA.",
    "",
    `Este archivo trae el texto completo de los ${casos.length} casos publicados,` +
      " en castellano, que es la versión canónica. El índice, las traducciones al" +
      ` inglés y las páginas sueltas están en ${SITE_URL}/llms.txt`,
    "",
    "Los casos sobre productos ajenos son análisis independientes, sin afiliación" +
      " con las empresas que analizan. Cada cifra traza a su fuente y cada supuesto" +
      ` se declara como supuesto; las reglas están en ${SITE_URL}/method`,
    "",
    "Si citás algo de acá, el enlace correcto es el de cada caso, que figura" +
      " debajo de su título.",
    "",
  ];

  for (const caso of casos) {
    const ruta = join(process.cwd(), "content", "projects", "es", caso.slug, "index.mdx");
    let cuerpo: string;
    try {
      cuerpo = aTextoPlano(readFileSync(ruta, "utf8"));
    } catch {
      // Una pieza sin archivo en disco se saltea en vez de romper el build: el
      // índice de `llms.txt` la sigue nombrando y la página sigue en el sitemap.
      continue;
    }

    const minutos = caso.metadata?.readingTime;
    lines.push(
      "---",
      "",
      `## ${caso.title}`,
      "",
      `URL: ${SITE_URL}/projects/${caso.slug}`,
      `Publicado: ${caso.date.slice(0, 10)}${minutos ? ` · ${minutos} min de lectura` : ""}`,
      "",
      cuerpo,
      "",
    );
  }

  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
