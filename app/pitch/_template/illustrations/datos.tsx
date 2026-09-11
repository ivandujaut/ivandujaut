import type { Illustration } from "./types";

/**
 * Un hub de datos clínicos: tres instituciones de salud a la izquierda (con
 * su cruz), líneas que convergen en un nodo central, y a la derecha la tabla
 * ya ordenada, que es lo que sale. El nodo encendido es el guiño a la capa de
 * anonimización: el dato entra identificado y sale sin nombre.
 */
function DatosHub() {
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
      {/* hospital chico */}
      <path className="sky" d="M10 150 V92 H52 V150" />
      <path className="sky" d="M31 104 V118 M24 111 H38" />
      <path className="sky" d="M10 132 H52" opacity="0.5" />
      {/* hospital grande, con su cruz y ventanas */}
      <path className="sky" d="M64 150 V64 H116 V150" />
      <path className="sky" d="M90 76 V92 M82 84 H98" />
      <path className="sky" d="M64 106 H116 M64 122 H116 M64 138 H116" opacity="0.5" />
      {/* laboratorio */}
      <path className="sky" d="M128 150 V100 H166 V150" />
      <path className="sky" d="M147 110 V122 M141 116 H153" />
      <path className="sky" d="M128 134 H166" opacity="0.5" />
      {/* las tres líneas convergen en el nodo */}
      <path className="sky" d="M52 121 C110 121 150 100 178 100" opacity="0.7" />
      <path className="sky" d="M116 86 C140 86 158 96 178 98" opacity="0.7" />
      <path className="sky" d="M166 128 C172 128 174 106 178 103" opacity="0.7" />
      {/* nodo: hexágono con el centro encendido */}
      <path className="sky" d="M200 76 L222 88 V112 L200 124 L178 112 V88 Z" />
      <path
        className="sky-fill"
        d="M200 88 L212 94 V106 L200 112 L188 106 V94 Z"
        fill="currentColor"
        opacity="0.22"
        stroke="none"
      />
      {/* del nodo sale un solo cable hacia la tabla */}
      <path className="sky" d="M222 100 H258" />
      {/* la tabla: filas y columnas, ya ordenadas */}
      <path className="sky" d="M262 74 H350 V126 H262 Z" />
      <path
        className="sky"
        d="M262 92 H350 M262 108 H350 M292 74 V126 M320 74 V126"
        opacity="0.5"
      />
      {/* suelo */}
      <path className="sky" d="M0 150 H360" />
    </svg>
  );
}

export const datos: Illustration = {
  Component: DatosHub,
  // El hilo nace en la punta inferior del nodo (x 200, y 124) y baja hasta
  // poco antes del suelo, después de que el hub terminó de dibujarse.
  thread: { viewBox: [360, 170], x: 200, from: 124, to: 142, cableAt: 2.6, cableDuration: 1.1 },
};
