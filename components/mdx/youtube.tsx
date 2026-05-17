import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, YoutubeIcon } from "@hugeicons/core-free-icons";

interface YouTubeProps {
  /** YouTube video ID. For URL like youtu.be/XYZ123 the id is XYZ123. */
  id: string;
  title: string;
  /** Aspect ratio, default 16/9. */
  aspect?: string;
  /** Start time in seconds. */
  start?: number;
  /** Show YouTube chrome controls. Default true. */
  controls?: boolean;
  caption?: string;
  fullBleed?: boolean;
  /** When true, hide the URL chip + Open link header. Default false. */
  hideChrome?: boolean;
}

/**
 * Embed a YouTube video via the privacy-enhanced domain
 * `youtube-nocookie.com`, which sets no third-party cookies until the
 * viewer interacts with the player.
 *
 * Works with public and **unlisted** videos. Fully private videos cannot
 * be embedded by external sites — YouTube's access control blocks the
 * iframe. If you need a private demo, host the MP4 yourself and use
 * `<Video>`.
 *
 * @example unlisted demo
 * <YouTube
 *   id="dQw4w9WgXcQ"
 *   title="Workflow composer demo"
 *   caption="End-to-end click-through of the v2 onboarding."
 * />
 */
export function YouTube({
  id,
  title,
  aspect = "16/9",
  start,
  controls = true,
  caption,
  fullBleed = false,
  hideChrome = false,
}: YouTubeProps) {
  const params = new URLSearchParams();
  params.set("rel", "0");
  params.set("modestbranding", "1");
  if (start) params.set("start", String(start));
  if (!controls) params.set("controls", "0");

  const embedSrc = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  const watchUrl = `https://youtu.be/${id}${start ? `?t=${start}` : ""}`;

  const wrapperClass = fullBleed
    ? "my-12 mx-[calc(50%-50vw)] flex w-screen justify-center"
    : "my-8";
  const frameClass = fullBleed
    ? "w-full max-w-[1280px] overflow-hidden border-y border-border bg-black"
    : "overflow-hidden rounded-lg border border-border bg-black";

  return (
    <figure className={wrapperClass}>
      <div className={frameClass}>
        {!hideChrome && (
          <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <HugeiconsIcon
                icon={YoutubeIcon}
                size={14}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground"
                aria-hidden
              />
              <span className="truncate font-mono text-xs text-muted-foreground">
                youtube · {title}
              </span>
            </div>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span>Watch</span>
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} strokeWidth={1.5} aria-hidden />
            </a>
          </div>
        )}
        <iframe
          src={embedSrc}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="block w-full border-0"
          style={{ aspectRatio: aspect }}
        />
      </div>
      {caption && (
        <figcaption
          className={
            fullBleed
              ? "mx-auto mt-3 max-w-2xl px-6 text-center text-sm text-muted-foreground"
              : "mt-2 text-center text-sm text-muted-foreground"
          }
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
