import type { SVGProps } from "react";

interface RssIconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
}

/**
 * Glifo de RSS.
 *
 * Dibujado a mano y no traído de Hugeicons: el set gratuito que usa el sitio no
 * trae ninguno. Es el glifo estándar (el punto y los dos arcos), que es lo que
 * la gente reconoce; inventar otro sería pedirle al lector que adivine.
 */
export function RssIcon({ size = 16, ...rest }: RssIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
