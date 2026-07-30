import { resolveTechIcon } from "@/lib/tech-icons";

interface StackListProps {
  items: string[];
  /** Se muestra al final como "+N" cuando la lista viene recortada. */
  overflowCount?: number;
  className?: string;
}

/**
 * Píldoras de tecnología con logo. Solo se usan en el listado de /projects y en
 * el detalle de un caso: son el stack de un proyecto concreto, no un inventario
 * de herramientas.
 *
 * El hover es el patrón de dos niveles de grupo: al entrar el mouse a la lista
 * se desaturan todos los logos (`group-hover/stack:grayscale`) y el que está
 * bajo el cursor vuelve a color (`group-hover/item:grayscale-0`) y crece un
 * poco. El resultado es un spotlight: el mouse apaga el resto en vez de
 * encender uno.
 *
 * El grupo va nombrado (`group/stack`) y no como `group` suelto a propósito:
 * `group-hover:` matchea CUALQUIER ancestro con la clase `group`, y las cards
 * de /projects ya son un `group` (lo usan para el zoom del cover). Sin nombre,
 * pasar el mouse por la card entera apagaba todos los logos.
 *
 * Contraste del fondo (WCAG 1.4.3, texto normal, mínimo 4.5:1) con el texto en
 * `muted-foreground`:
 *   dark  · `bg-muted` sólido      → 5.83:1
 *   light · `bg-muted/40`          → 4.57:1
 * En light el `bg-muted` sólido da 4.34:1 y no llega, por eso el fondo va
 * distinto por tema en vez de un único valor.
 *
 * Lo que no tiene logo va solo con su nombre, sin marcador de relleno. Probé
 * con un monograma de iniciales y el resultado fue "SU" para shadcn/ui y, peor,
 * "RA" para REST APIs y "CC" para CI/CD: decoración que no agrega nada sobre la
 * etiqueta que ya está al lado.
 */
export function StackList({ items, overflowCount = 0, className }: StackListProps) {
  return (
    <ul className={`group/stack flex flex-wrap items-center gap-2 ${className ?? ""}`.trim()}>
      {items.map((item) => {
        const svg = resolveTechIcon(item);

        return (
          <li
            key={item}
            className={`group/item flex items-center gap-2 rounded-full border border-border bg-muted/40 py-1 pr-3 transition-colors dark:bg-muted ${
              svg ? "pl-1.5" : "pl-3"
            }`}
          >
            {svg && (
              <span
                // `grayscale-0!` con important a propósito: compite contra
                // `group-hover/stack:grayscale` con la misma especificidad, así
                // que sin el `!` gana la que Tailwind haya puesto última en la
                // hoja. Ese orden no lo controlamos nosotros.
                className="block size-4 shrink-0 transition-all duration-200 group-hover/stack:grayscale group-hover/item:scale-110 group-hover/item:grayscale-0!"
                // El markup es nuestro y está commiteado (lib/tech-icons.generated.ts),
                // no entra nada del usuario acá.
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )}
            <span className="font-mono text-xs text-muted-foreground transition-colors group-hover/item:text-foreground">
              {item}
            </span>
          </li>
        );
      })}
      {overflowCount > 0 && (
        <li className="font-mono text-xs text-muted-foreground">+{overflowCount}</li>
      )}
    </ul>
  );
}
