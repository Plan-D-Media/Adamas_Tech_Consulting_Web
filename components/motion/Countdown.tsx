"use client";

import { useSyncExternalStore } from "react";
import { cx } from "@/lib/cx";

// One shared 1s clock for every countdown on the page.
const listeners = new Set<() => void>();
let timer: number | undefined;
function subscribe(cb: () => void) {
  listeners.add(cb);
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((l) => l()), 1000);
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}
const nowSecond = () => Math.floor(Date.now() / 1000) * 1000;

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

/**
 * Live countdown to an event. Renders a placeholder on the server (no clock there); the date itself is
 * always printed next to it by the parent, so nothing is lost without JS. Not announced live (would be noisy).
 */
export function Countdown({ startsAt, endsAt, tone = "dark", className }: { startsAt: string; endsAt?: string | null; tone?: "light" | "dark"; className?: string }) {
  const now = useSyncExternalStore(subscribe, nowSecond, () => null);

  if (now === null) return <div className={cx("h-[4.5rem]", className)} aria-hidden="true" />;

  const start = new Date(startsAt).getTime();
  const end = endsAt ? new Date(endsAt).getTime() : start + 3 * 3600_000;
  const dark = tone === "dark";

  if (now >= end) return <p className={cx("font-semibold", className)}>This event has taken place.</p>;
  if (now >= start) return <p className={cx("font-semibold text-sky-400", className)}>Happening now</p>;

  const p = parts(start - now);
  const units: [string, number][] = [
    ["Days", p.days],
    ["Hours", p.hours],
    ["Minutes", p.minutes],
    ["Seconds", p.seconds],
  ];
  return (
    <div className={className}>
      <p className="sr-only">
        Starts in {p.days} days, {p.hours} hours and {p.minutes} minutes.
      </p>
      <dl aria-hidden="true" className="flex gap-2 sm:gap-3">
        {units.map(([label, v]) => (
          <div key={label} className={cx("flex min-w-16 flex-col-reverse items-center rounded-btn px-3 py-2.5 sm:min-w-20", dark ? "bg-white/8 ring-1 ring-white/15" : "bg-grey-50 ring-1 ring-grey-200")}>
            <dt className={cx("mt-1 text-[11px] font-semibold uppercase tracking-wider", dark ? "text-on-navy-muted" : "text-grey-600")}>{label}</dt>
            <dd className="font-display text-2xl font-bold tabular-nums [font-stretch:112%] sm:text-3xl">{String(v).padStart(2, "0")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
