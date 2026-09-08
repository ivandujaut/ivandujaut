import type { Illustration } from "./types";

/**
 * Plano de obra: dos edificios terminados, uno en columnas y una grúa torre
 * (mástil reticulado, torreta, pluma y contrapluma con contrapeso, tirantes y
 * carro). El piso encendido de la torre es un guiño al módulo de pagos.
 */
function ObraSkyline() {
  return (
    <svg
      data-illustration
      viewBox="0 0 360 170"
      className="w-full max-w-xs justify-self-start text-(--pitch-accent) md:max-w-sm md:justify-self-end"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* edificio bajo, terminado */}
      <path className="sky" d="M10 150 V70 H70 V150" />
      <path className="sky" d="M10 90 H70 M10 110 H70 M10 130 H70" opacity="0.5" />
      {/* torre, con un piso encendido */}
      <path className="sky" d="M86 150 V26 H160 V150" />
      <path
        className="sky"
        d="M86 46 H160 M86 66 H160 M86 86 H160 M86 106 H160 M86 126 H160"
        opacity="0.5"
      />
      <rect
        className="sky-fill"
        x="86"
        y="86"
        width="74"
        height="20"
        fill="currentColor"
        opacity="0.22"
        stroke="none"
      />
      {/* obra en curso: columnas y una losa */}
      <path className="sky" d="M184 150 V96 M210 150 V96 M236 150 V96 M262 150 V96 M178 96 H268" />
      <path className="sky" d="M184 123 H262" opacity="0.5" />
      {/* grúa torre: mástil reticulado */}
      <path className="sky" d="M290 150 V44 M300 150 V44" />
      <path
        className="sky"
        d="M290 136 L300 122 L290 108 L300 94 L290 80 L300 66 L290 52"
        opacity="0.6"
      />
      {/* cabina y torreta en punta */}
      <path className="sky" d="M286 44 H304 V36 H286 Z M290 36 L295 18 L300 36" />
      {/* pluma y contrapluma, con contrapeso */}
      <path className="sky" d="M234 44 H356 M240 49 H350" />
      <path
        className="sky"
        d="M246 44 L252 49 L258 44 L264 49 L270 44 L276 49 L282 44 M308 44 L314 49 L320 44 L326 49 L332 44 L338 49 L344 44"
        opacity="0.6"
      />
      <path className="sky" d="M238 49 V60 H254 V49" />
      {/* tirantes desde la punta */}
      <path className="sky" d="M295 18 L350 44 M295 18 L240 44" opacity="0.7" />
      {/* carro. El cable no está acá: lo dibuja el hilo conductor. */}
      <path className="sky" d="M330 49 H340 V53 H330 Z" />
      {/* suelo */}
      <path className="sky" d="M0 150 H360" />
    </svg>
  );
}

export const obra: Illustration = {
  Component: ObraSkyline,
  // El cable nace en el carro (x 335, y 53) y baja hasta poco antes del suelo.
  // El skyline dibuja sus trazos escalonados desde que carga y el carro es de
  // los últimos: el cable sale justo después.
  thread: { viewBox: [360, 170], x: 335, from: 53, to: 118, cableAt: 2.6, cableDuration: 1.1 },
};
