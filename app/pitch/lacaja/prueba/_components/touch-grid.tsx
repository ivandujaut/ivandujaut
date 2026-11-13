import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { RunCase } from "../prueba.data";

interface TouchGridProps {
  cases: RunCase[];
  /** `before`: las veinte esperando. `after`: cada una con el destino que le dio la corrida. */
  mode: "before" | "after";
  label: string;
}

/**
 * Las veinte solicitudes como veinte casillas, en orden de llegada. Usa la
 * gramática de la página: gris lo que espera, azul lleno lo que se cerró solo,
 * borde azul lo que va a una persona. El aro marca las elegidas para el
 * control posterior.
 */
export function TouchGrid({ cases, mode, label }: TouchGridProps) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {cases.map((c) => {
        const issued = mode === "after" && c.decision === "issue";
        const referred = mode === "after" && c.decision === "refer";
        return (
          <li
            key={c.id}
            title={c.id}
            className={cn(
              "flex size-8 items-center justify-center rounded-sm border-[1.5px]",
              mode === "before" && "border-(--ticket-line) bg-(--surface) text-(--ink-faint)",
              issued && "border-(--blue) bg-(--blue) text-white",
              referred && "border-(--blue) bg-(--surface) text-(--blue)",
              issued && c.audit && "outline-2 outline-offset-2 outline-(--blue)",
            )}
          >
            <HugeiconsIcon
              icon={issued ? Tick02Icon : UserIcon}
              size={14}
              strokeWidth={2}
              aria-hidden
            />
            <span className="sr-only">
              {c.id}:{" "}
              {mode === "before"
                ? "espera a una persona"
                : issued
                  ? c.audit
                    ? "cerrada sola, con revisión posterior"
                    : "cerrada sola"
                  : "a una persona"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
