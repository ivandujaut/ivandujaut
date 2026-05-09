interface VideoProps {
  src: string;
  caption?: string;
  poster?: string;
  controls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
}

export function Video({
  src,
  caption,
  poster,
  controls = false,
  loop = true,
  autoPlay = true,
}: VideoProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
        <video
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted
          playsInline
          className="h-auto w-full"
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
