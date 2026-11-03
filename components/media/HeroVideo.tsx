"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";

/**
 * Background video for a hero story. Accepts a self-hosted MP4/WebM (production target, S3/CloudFront)
 * or a Vimeo ID (interim, via the background player). Always decorative: hidden from AT, not focusable.
 * The parent only mounts this when video is allowed (motion OK, no Save-Data, slide active).
 */
export function HeroVideo({ vimeoId, videoUrl, title }: { vimeoId: string | null; videoUrl: string | null; title: string }) {
  const [ready, setReady] = useState(false);


  const fade = cx("transition-opacity duration-1000 ease-(--ease-out-expo)", ready ? "opacity-100" : "opacity-0");

  if (videoUrl) {
    return (
      <video
        className={cx("absolute inset-0 h-full w-full object-cover", fade)}
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setReady(true)}
      />
    );
  }

  if (!vimeoId) return null;

  const src = `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?background=1&muted=1&loop=1&autopause=0&dnt=1&quality=1080p`;
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute inset-0 overflow-hidden", fade)}>
      {/* 16:9 iframe scaled to cover the frame */}
      <iframe
        src={src}
        title={title}
        tabIndex={-1}
        allow="autoplay; fullscreen; picture-in-picture"
        loading="eager"
        onLoad={() => window.setTimeout(() => setReady(true), 900)}
        className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />
    </div>
  );
}
