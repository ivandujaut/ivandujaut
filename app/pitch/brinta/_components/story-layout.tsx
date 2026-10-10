import type { ReactNode } from "react";

interface StoryLayoutProps {
  scene: ReactNode;
  steps: Array<{ id: string; content: ReactNode }>;
  /** Nota al pie de los pasos (fuente o aclaración), dentro de la pantalla fija. */
  footer?: ReactNode;
}

/**
 * Escena + pasos.
 *
 * Escritorio: el tramo entero se fija (pin) y los pasos están todos a la
 * vista, uno encendido por vez, al lado de la escena. Es la gramática de
 * Lebane: la vista no se mueve y el scroll sólo avanza la historia.
 *
 * Celular: sin pin. La escena queda pegada arriba (`sticky`) y los pasos pasan
 * por debajo, cerca uno del otro. La escena tiene que ser hija directa del
 * contenedor que también tiene los pasos: `sticky` se queda pegada sólo
 * dentro de su padre.
 */
export function StoryLayout({ scene, steps, footer }: StoryLayoutProps) {
  return (
    <div className="story relative mt-8 md:mt-8 md:grid md:min-h-0 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-12">
      <div className="sticky top-0 z-10 -mr-5 -ml-16 bg-(--paper) px-4 pt-4 pb-2 md:static md:order-2 md:mx-0 md:bg-transparent md:p-0">
        {scene}
      </div>
      <div className="md:order-1">
        <ol className="story-steps relative md:space-y-5">
          {steps.map((step) => (
            <li
              key={step.id}
              data-step={step.id}
              className="story-step flex min-h-[46svh] items-center py-6 md:block md:min-h-0 md:py-0"
            >
              <div className="max-w-md text-lg leading-relaxed md:text-base lg:text-[1.05rem]">
                {step.content}
              </div>
            </li>
          ))}
        </ol>
        {footer ? <div className="mt-6 max-w-md md:mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
