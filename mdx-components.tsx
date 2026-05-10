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
