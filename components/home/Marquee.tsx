"use client";

import { useState } from "react";

interface Item {
  name: string;
  src: string;
  width: number;
  height: number;
}

/**
 * Partner logo marquee (Figma "Master" 236:2628): logos 200x105, 131px apart, scrolling continuously. The list is
 * duplicated for a seamless loop; the pause button (36px, Figma 236:2624) stops it, and so do hover, focus and
 * reduced motion (globals.css). Without JavaScript the row simply scrolls horizontally.
 */
export function Marquee({ items }: { items: Item[] }) {
  const [paused, setPaused] = useState(false);
  const loop = [...items, ...items];
  return (
    <div className="mt-4 lg:mt-[16px]">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Play the partner logos" : "Pause the partner logos"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-grey-200 text-navy-900 transition-colors duration-(--duration-fast) hover:bg-tint-100"
        >
          {paused ? (
            <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
              <path d="M4 2.5l7 4.5-7 4.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
              <path d="M4 3h2v8H4zM8 3h2v8H8z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
      <div className="marquee scrollbar-none mt-[25px] overflow-x-auto" data-paused={paused || undefined} aria-label="Partners and certifications">
        <ul className="marquee-track flex w-max items-center gap-[131px]" style={{ "--marquee-duration": `${Math.max(24, items.length * 6)}s` } as React.CSSProperties} role="list">
          {loop.map((l, i) => (
            <li key={`${l.name}-${i}`} className="shrink-0" aria-hidden={i >= items.length || undefined}>
              <img src={l.src} alt={i < items.length ? l.name : ""} width={200} height={105} className="h-[105px] w-[200px] object-contain grayscale transition-[filter] duration-(--duration-base) hover:grayscale-0" loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
