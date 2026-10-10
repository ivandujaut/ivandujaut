import type { ReactNode } from "react";

interface StoryLayoutProps {
  scene: ReactNode;
  steps: Array<{ id: string; content: ReactNode }>;
}

/**
 * Escena fija + pasos que pasan al costado (escritorio) o por debajo (celular).
 *
 * En celular la escena tiene que ser hija directa del contenedor que también
 * tiene los pasos: `sticky` se queda pegada sólo dentro de su padre. En
 * escritorio es una celda de grilla que se estira al alto de los pasos, y el
 * `sticky` va en el hijo de adentro.
 */
export function StoryLayout({ scene, steps }: StoryLayoutProps) {
  return (
    <div className="story relative mt-10 md:mt-14 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
      <div className="sticky top-0 z-10 -mr-5 -ml-16 bg-(--paper) px-4 pt-4 pb-2 md:static md:order-2 md:mx-0 md:bg-transparent md:p-0">
        <div className="md:sticky md:top-[14svh]">{scene}</div>
      </div>
      <ol className="story-steps relative md:order-1">
        {steps.map((step) => (
          <li
            key={step.id}
            data-step={step.id}
            className="story-step flex min-h-[62svh] items-center py-8 md:min-h-[72svh]"
          >
            <div className="max-w-md text-lg leading-relaxed md:text-xl">{step.content}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
