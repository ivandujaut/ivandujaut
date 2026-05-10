"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";

interface LikeButtonProps {
  slug: string;
}

interface LikesData {
  likes: number;
  userClaps: number;
  maxClaps: number;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [data, setData] = useState<LikesData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const t = useTranslations("blog.like");

  // Fetch inicial
  useEffect(() => {
    let cancelled = false;

    async function fetchLikes() {
      try {
        const res = await fetch(`/api/likes/${slug}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    }

    fetchLikes();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const isMaxed = data ? data.userClaps >= data.maxClaps : false;

  async function handleClick() {
    if (!data || isMaxed) return;

    // Animación
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Optimistic update
    const previous = data;
    setData({
      ...data,
      likes: data.likes + 1,
      userClaps: data.userClaps + 1,
    });

    try {
      const res = await fetch(`/api/likes/${slug}`, { method: "POST" });
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to increment likes:", error);
      setData(previous);
    }
  }

  if (!data) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full border border-border" />
        <span className="font-mono text-sm text-muted-foreground">—</span>
      </div>
    );
  }

  const hasLiked = data.userClaps > 0;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isMaxed}
        aria-label={isMaxed ? t("maxReached") : t("like")}
        className={`
          group relative inline-flex h-12 w-12 items-center justify-center
          rounded-full border border-border
          transition-all duration-200
          hover:border-rose-300 hover:bg-rose-50 dark:hover:border-rose-900 dark:hover:bg-rose-950/30
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
          disabled:cursor-not-allowed disabled:opacity-60
          ${isAnimating ? "scale-125" : "scale-100"}
        `}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={20}
          strokeWidth={1.5}
          className={`
            transition-all duration-200
            ${
              hasLiked
                ? "fill-rose-500 text-rose-500"
                : "text-muted-foreground group-hover:text-rose-500"
            }
          `}
        />
        {/* Badge con cantidad de claps del usuario */}
        {data.userClaps > 0 && (
          <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[10px] font-semibold text-white">
            {data.userClaps}
          </span>
        )}
      </button>

      <div className="flex flex-col">
        <span className="font-mono text-sm text-foreground">
          {data.likes.toLocaleString()} {data.likes === 1 ? t("likeCount") : t("likesCount")}
        </span>
        {isMaxed && <span className="text-xs text-muted-foreground">{t("maxReached")}</span>}
      </div>
    </div>
  );
}
