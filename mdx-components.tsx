import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import { Video } from "@/components/mdx/video";
import { Pre } from "@/components/mdx/code-block";
import { Anchor, MdxLink } from "@/components/mdx/links";
import { TechStack } from "./components/mdx/tech-stack";
import { Metric, MetricGrid } from "./components/mdx/metric";
import { Comparison } from "./components/mdx/comparison";
import { Steps } from "./components/mdx/steps";
import { Abstract } from "@/components/mdx/abstract";
import { Thesis } from "@/components/mdx/thesis";
import { Sidenote } from "@/components/mdx/sidenote";
import { Footnote } from "@/components/mdx/footnote";
import { Cite, Reference, References } from "@/components/mdx/references";
import { FrameGrid } from "@/components/mdx/frame-grid";
import { Diagram } from "@/components/mdx/diagram";
import { AnnotatedShot } from "@/components/mdx/annotated-shot";
import { DemoFrame } from "@/components/mdx/demo-frame";
import { FigmaEmbed } from "@/components/mdx/figma-embed";
import { YouTube } from "@/components/mdx/youtube";
import { BentoGrid } from "@/components/mdx/bento-grid";
import { TableCaption } from "@/components/mdx/table-caption";

/**
 * Componentes MDX disponibles en posts y casos de estudio.
 *
 * Esta función la usa Next.js automáticamente cuando renderiza archivos .mdx.
 * Acá registramos:
 *   1. Componentes custom (Callout, Figure, Video, etc.)
 *   2. Overrides de elementos HTML (a, h2, h3, pre, code)
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    // Componentes custom
    Callout,
    Figure,
    Video,

    // Tier 2
    TechStack,
    Metric,
    MetricGrid,
    Comparison,
    Steps,

    // Paper mode (LaTeX-style)
    Abstract,
    Thesis,
    Sidenote,
    Footnote,
    References,
    Reference,
    Cite,
    FrameGrid,
    Diagram,
    AnnotatedShot,
    DemoFrame,
    FigmaEmbed,
    YouTube,
    BentoGrid,
    TableCaption,

    // Overrides de elementos HTML
    a: MdxLink,

    h2: ({ children, id, ...props }) => (
      <h2
        id={id}
        className="group mt-12 scroll-mt-20 text-2xl font-semibold tracking-tight"
        {...props}
      >
        <Anchor id={id}>{children}</Anchor>
      </h2>
    ),

    h3: ({ children, id, ...props }) => (
      <h3
        id={id}
        className="group mt-8 scroll-mt-20 text-xl font-semibold tracking-tight"
        {...props}
      >
        <Anchor id={id}>{children}</Anchor>
      </h3>
    ),

    pre: Pre,

    // Una tabla ancha adentro de una columna de 672px (327px en un teléfono) no
    // desbordaba: se apretaba. Con `w-full` las celdas se apilaban hasta once
    // líneas de alto, que es ilegible, y las tablas de cuatro columnas igual
    // terminaban empujando la página.
    //
    // El envoltorio le da su propio scroll horizontal: el `min-width` de la
    // tabla frena el apriete y el desborde queda contenido acá adentro en vez de
    // mover la página entera. El `TableCaption` va suelto después de la tabla,
    // así que queda fuera del scroll y no se va de vista al desplazarla.
    //
    // `tabIndex` para que la tabla se pueda desplazar con el teclado, que si no
    // queda inalcanzable sin mouse. Sin `role="region"` a propósito: un landmark
    // sin nombre accesible molesta más de lo que ayuda, y el nombre tendría que
    // salir del `TableCaption`, que es opcional y es hermano.
    table: ({ children, ...props }) => (
      <div className="table-scroll my-6" tabIndex={0}>
        <table {...props}>{children}</table>
      </div>
    ),

    code: ({ children, ...props }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props}>
        {children}
      </code>
    ),

    img: ({ src, alt, ...props }) => <Figure src={src as string} alt={alt ?? ""} {...props} />,

    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-6 border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),

    hr: (props) => <hr className="my-12 border-border" {...props} />,
  };
}
