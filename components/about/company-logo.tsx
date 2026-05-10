import Image from "next/image";

interface CompanyLogoProps {
  src: string;
  alt: string;
  size?: number;
}

/**
 * Logo cuadrado redondeado de una empresa o institución.
 *
 * Usa object-cover para que el logo llene el cuadrado sin distorsión.
 * El border sutil ayuda a separarlo del fondo cuando es claro.
 */
export function CompanyLogo({ src, alt, size = 48 }: CompanyLogoProps) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-lg border border-border"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
