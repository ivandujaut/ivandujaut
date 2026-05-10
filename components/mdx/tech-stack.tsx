interface TechStackProps {
  items: string[];
  variant?: "default" | "compact";
}

/**
 * Pills de tecnologías para mostrar en posts y casos de estudio.
 *
 * Variant "default": padding más generoso, ideal para destacar al
 * inicio de un caso de estudio.
 * Variant "compact": menos padding, ideal inline en el texto.
 *
 * @example
 * <TechStack items={["Next.js", "TypeScript", "Postgres"]} />
 * <TechStack items={["React", "Vite"]} variant="compact" />
 */
export function TechStack({ items, variant = "default" }: TechStackProps) {
  const padding = variant === "compact" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <ul className="my-4 flex list-none flex-wrap gap-2 p-0">
      {items.map((item) => (
        <li
          key={item}
          className={`${padding} rounded-full border border-border bg-muted/40 font-mono text-muted-foreground`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
