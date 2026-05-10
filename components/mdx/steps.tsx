import type { ReactNode } from "react";

interface StepsProps {
  children: ReactNode;
}

/**
 * Lista numerada con peso visual fuerte. Cada `### Título` adentro se
 * convierte en un step con su número en círculo a la izquierda.
 *
 * Implementación con CSS counters: el counter se incrementa por cada h3
 * descendiente directo. La línea vertical conectora viene del border-left
 * del container.
 *
 * @example
 * <Steps>
 *   ### Instalar dependencias
 *   Corré `npm install` en la raíz del proyecto.
 *
 *   ### Configurar entorno
 *   Copiá `.env.example` a `.env.local`.
 *
 *   ### Iniciar dev server
 *   `npm run dev` y abrí localhost:3000.
 * </Steps>
 */
export function Steps({ children }: StepsProps) {
  return (
    <div
      className="
          my-8 ml-4 border-l border-border pl-10
          [counter-reset:step]
          [&>h3]:relative
          [&>h3]:mt-12
          [&>h3]:[counter-increment:step]
          first:[&>h3]:mt-0
          [&>h3+p]:mt-2
          [&>h3]:before:absolute
          [&>h3]:before:left-[calc(-2.5rem-0.875rem)]
          [&>h3]:before:top-0
          [&>h3]:before:flex
          [&>h3]:before:h-7
          [&>h3]:before:w-7
          [&>h3]:before:items-center
          [&>h3]:before:justify-center
          [&>h3]:before:rounded-full
          [&>h3]:before:border
          [&>h3]:before:border-border
          [&>h3]:before:bg-background
          [&>h3]:before:font-mono
          [&>h3]:before:text-xs
          [&>h3]:before:font-semibold
          [&>h3]:before:[content:counter(step)]
        "
    >
      {children}
    </div>
  );
}
