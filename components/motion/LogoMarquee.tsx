"use client";

import Image from "next/image";
import { useState } from "react";
import type { LogoData } from "@/lib/data/home";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

/**
 * Slow, pausable logo marquee. Greyscale until hover/focus. Pauses on hover and focus-within;
 * the explicit button satisfies WCAG 2.2.2. Reduced motion: a static wrapped row (CSS).
 */
export function LogoMarquee({ logos, label, tone = "light" }: { logos: LogoData[]; label: string; tone?: "light" | "dark" }) {
  const [paused, setPaused] = useState(false);
  if (!logos.length) return null;
  const duration = Math.max(28, logos.length * 4.5);

  const row = (hidden: boolean) =>
    logos.map((l, i) => (
      <li key={`${hidden ? "b" : "a"}-${i}`} aria-hidden={hidden || undefined} className={cx("flex h-16 min-w-0 shrink-0 items-center justify-center px-7 motion-reduce:px-3 md:h-20 md:px-10", hidden && "motion-reduce:hidden")}>
        {l.logo ? (
          <Image
            src={l.logo.url}
            alt={hidden ? "" : l.logo.alt || l.name}
            width={l.logo.width ?? 160}
            height={l.logo.height ?? 64}
            sizes="160px"
            unoptimized={l.logo.url.endsWith(".svg")}
            className={cx(
              "h-auto max-h-11 w-auto max-w-[min(9.5rem,100%)] object-contain transition-[filter,opacity] duration-(--duration-base) md:max-h-14",
              "grayscale opacity-70 hover:grayscale-0 hover:opacity-100",
              tone === "dark" && "brightness-0 invert opacity-80 hover:brightness-100 hover:invert-0",
            )}
          />
        ) : (
          <span className="font-semibold text-grey-600">{l.name}</span>
        )}
      </li>
    ));

  return (
    <div className="marquee group relative" data-paused={paused}>
      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none]"
        role="region"
        aria-label={label}
      >
        <ul
          className="marquee-track flex w-max motion-reduce:grid motion-reduce:w-full motion-reduce:grid-cols-3 md:motion-reduce:grid-cols-6"
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
        >
          {row(false)}
          {row(true)}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className={cx(
          "absolute -top-12 right-0 inline-flex size-9 items-center justify-center rounded-full border transition-colors motion-reduce:hidden",
          tone === "dark" ? "border-white/30 text-white hover:border-white" : "border-grey-200 text-navy-950 hover:border-navy-950",
        )}
      >
        <Icon name={paused ? "play" : "pause"} size={14} />
        <span className="sr-only">{paused ? "Play logo carousel" : "Pause logo carousel"}</span>
      </button>
    </div>
  );
}
