import * as runtime from "react/jsx-runtime";

/**
 * Helper para convertir el código MDX (string que genera Velite) en un
 * componente React renderizable.
 *
 * Velite compila los archivos .mdx a funciones JS que se ejecutan con
 * el runtime de React, en lugar de archivos pre-renderizados. Esto
 * permite que los componentes custom (Callout, Figure, etc.) funcionen.
 */
export function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}
