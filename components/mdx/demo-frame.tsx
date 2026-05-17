import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

interface DemoFrameProps {
  /** URL of the embedded demo. Must be embeddable (X-Frame-Options not DENY). */
  href: string;
  /** Title shown in the URL chip and as iframe title for a11y. */
  title: string;
  /**
   * CSS height for the iframe. Accepts any CSS length, e.g. "32rem", "60vh".
   * Defaults to a 16:10 desktop aspect.
   */
  height?: string;
  caption?: string;
  fullBleed?: boolean;
  /**
   * Extra sandbox tokens. We always include `allow-same-origin` + `allow-scripts`
   * because most demos won't render without them.
   */
  sandbox?: string;
}

/**
 * Live demo embedded as a sandboxed iframe with a browser-chrome header that
 * shows the URL and offers "Open in new tab". Pattern observed in Vercel
 * Ship's case study: every demo block sits above a sidecar link so the reader
 * can leave the page and play.
 *
 * Caveat: the target site must allow framing (no `X-Frame-Options: DENY` or
 * restrictive CSP). For your own deployments, set headers accordingly.
 *
 * @example
 * <DemoFrame
 *   href="https://demo.example.com"
 *   title="Workflow composer demo"
 *   height="32rem"
 *   caption="Drag a node onto the canvas to compose a workflow."
 * />
 */
export function DemoFrame({
  href,
  title,
  height = "32rem",
  caption,
  fullBleed = false,
  sandbox = "allow-same-origin allow-scripts allow-popups allow-forms",
}: DemoFrameProps) {
  let displayUrl = href;
  try {
    const u = new URL(href);
    displayUrl = `${u.hostname}${u.pathname === "/" ? "" : u.pathname}`;
  } catch {
    // Keep as-is on parse error.
  }

  const wrapperClass = fullBleed
    ? "my-12 mx-[calc(50%-50vw)] flex w-screen justify-center"
    : "my-8";
  const frameClass = fullBleed
    ? "w-full max-w-[1280px] overflow-hidden border-y border-border bg-background"
    : "overflow-hidden rounded-lg border border-border bg-background";

  return (
    <figure className={wrapperClass}>
      <div className={frameClass}>
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span aria-hidden className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            </span>
            <span className="truncate font-mono text-xs text-muted-foreground">{displayUrl}</span>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>Open</span>
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} strokeWidth={1.5} aria-hidden />
          </a>
        </div>
        <iframe
          src={href}
          title={title}
          sandbox={sandbox}
          loading="lazy"
          className="block w-full border-0"
          style={{ height }}
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
