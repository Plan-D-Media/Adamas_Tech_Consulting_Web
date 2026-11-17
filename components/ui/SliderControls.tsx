"use client";

import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

interface Props {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  /** "dark": hero style (translucent on navy). "light": Top Stories style (white prev, blue next). "outline": Products style (48px outlined). */
  variant?: "dark" | "light" | "outline";
  /** Hero progress bars (34x3) between counter and next button. */
  progress?: boolean;
  /** Auto-advance is on: the active bar fills over `durationMs` and `onProgressEnd` fires when it is full. */
  running?: boolean;
  durationMs?: number;
  onProgressEnd?: () => void;
  /** Freeze the bar where it is (pause button, hover or focus) without resetting it. */
  hold?: boolean;
  /** Pause button state. */
  paused?: boolean;
  onTogglePause?: () => void;
  label: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Prev / counter / next controls from the Figma sliders (42px circles with arrow glyphs, "01 / 03" in Manrope 16).
 * The hero's progress bar is a CSS animation (globals.css `.progress-fill`) keyed on the slide index, so it restarts
 * on every slide, pauses with `animation-play-state` and never re-renders React while it runs (QA BUG-005).
 */
export function SliderControls({ index, total, onPrev, onNext, variant = "light", progress, running = false, durationMs = 7000, onProgressEnd, hold = false, paused, onTogglePause, label, className }: Props) {
  const circle = "inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border transition-colors duration-(--duration-fast) disabled:opacity-40";
  const styles = {
    dark: { prev: "border-white/40 bg-[rgb(33_16_32/0.2)] text-white hover:bg-white/15", next: "border-white/40 bg-[rgb(33_16_32/0.2)] text-white hover:bg-white/15", text: "text-white" },
    light: { prev: "border-transparent bg-white text-black hover:bg-tint-100", next: "border-white/40 bg-[#2468F2] text-white hover:bg-blue-600", text: "text-black" },
    outline: { prev: "h-12 w-12 border-[#B9C7D6] text-navy-900 hover:bg-tint-100", next: "h-12 w-12 border-[#B9C7D6] text-navy-900 hover:bg-tint-100", text: "text-navy-900" },
  }[variant];
  return (
    <div className={cx("flex items-center gap-3.5", className)} role="group" aria-label={`${label} controls`}>
      <button type="button" className={cx(circle, styles.prev)} onClick={onPrev} aria-label={`Previous ${label}`}>
        <Icon name="arrow" size={16} className="rotate-180" />
      </button>
      {/* 56px fits "03 / 03" in Manrope 16 on one line (48px wrapped it, QA BUG-019). */}
      <p className={cx("whitespace-nowrap text-center font-heading text-[1rem] leading-6", variant === "outline" ? "tabular-nums" : "w-14", styles.text)} aria-live="polite">
        {variant === "outline" ? (
          <>
            <span className="font-body text-[0.875rem] font-bold text-navy-900">{pad(index + 1)}</span>
            <span className="font-body text-[0.875rem] font-bold text-grey-500"> / {pad(total)}</span>
          </>
        ) : (
          `${pad(index + 1)} / ${pad(total)}`
        )}
      </p>
      {progress && (
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className="relative block h-[3px] w-[34px] overflow-hidden bg-white/40">
              {i === index && (
                <span
                  key={`${index}-${running ? "run" : "idle"}`}
                  className={cx("absolute inset-0 bg-orange-500", running ? "progress-fill" : "scale-x-0")}
                  style={running ? ({ "--progress-duration": `${durationMs}ms`, animationPlayState: hold ? "paused" : "running" } as React.CSSProperties) : undefined}
                  onAnimationEnd={running ? onProgressEnd : undefined}
                />
              )}
              {i < index && <span className="absolute inset-0 bg-orange-500" />}
            </span>
          ))}
        </div>
      )}
      {onTogglePause && (
        <button type="button" className={cx(circle, styles.prev, "h-9 w-9")} onClick={onTogglePause} aria-pressed={paused} aria-label={paused ? `Play ${label}` : `Pause ${label}`}>
          {paused ? (
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M3 2l7 4-7 4z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
      <button type="button" className={cx(circle, styles.next)} onClick={onNext} aria-label={`Next ${label}`}>
        <Icon name="arrow" size={16} />
      </button>
    </div>
  );
}
