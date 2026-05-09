import Image from "next/image";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 800,
  priority = false,
}: FigureProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
