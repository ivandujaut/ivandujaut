interface TableCaptionProps {
  children: React.ReactNode;
}

/**
 * Pie de tabla, con el mismo tratamiento que el `caption` de `Figure`:
 * `text-sm` en `muted-foreground`, para que se lea como nota y no como cuerpo.
 *
 * Va suelto justo después de la tabla en vez de envolverla. Las tablas se
 * escriben en markdown y meterlas dentro de un componente obliga a lidiar con
 * el parseo de markdown adentro de JSX, que es frágil por indentación. El
 * margen negativo lo pega a la tabla, que trae `my-6` propio.
 *
 * Se usa sobre todo para atribuir: qué parte del cuadro es dato de la fuente y
 * qué parte es cálculo propio.
 *
 * Renderiza un `div` y no un `p` a propósito: `.prose-content p` fuerza
 * `text-foreground` desde `@layer base` con más especificidad que la utilidad,
 * así que dentro de un `p` el texto salía en color de cuerpo en vez de atenuado.
 */
export function TableCaption({ children }: TableCaptionProps) {
  return <div className="-mt-4 text-sm text-muted-foreground">{children}</div>;
}
