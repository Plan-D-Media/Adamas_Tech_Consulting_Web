/** Event dates are always shown in the event's own time zone, in British English. */

const fmt = (opts: Intl.DateTimeFormatOptions, tz: string) => new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: tz });

export function longDate(iso: string, tz: string) {
  return fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }, tz).format(new Date(iso));
}

export function shortDate(iso: string, tz: string) {
  return fmt({ day: "numeric", month: "short", year: "numeric" }, tz).format(new Date(iso));
}

/** "18:00" */
export function clock(iso: string, tz: string) {
  return fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }, tz).format(new Date(iso));
}

/** Short zone label for a moment, e.g. "GMT" or "BST". */
export function zoneLabel(iso: string, tz: string) {
  const part = fmt({ timeZoneName: "short" }, tz)
    .formatToParts(new Date(iso))
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? "";
}

/** Date block parts for date-forward cards: { day: "26", month: "Nov", year: "2026", weekday: "Thu" }. */
export function dateParts(iso: string, tz: string) {
  const parts = fmt({ day: "2-digit", month: "short", year: "numeric", weekday: "short" }, tz).formatToParts(new Date(iso));
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("day"), month: get("month"), year: get("year"), weekday: get("weekday") };
}

/** "18:00 GMT" or "18:00 – 21:00 GMT" */
export function timeRange(startIso: string, endIso: string | null, tz: string) {
  const zone = zoneLabel(startIso, tz);
  return endIso ? `${clock(startIso, tz)} – ${clock(endIso, tz)} ${zone}` : `${clock(startIso, tz)} ${zone}`;
}

export function mapsUrl(parts: (string | null | undefined)[]) {
  const q = parts.filter(Boolean).join(", ");
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
}
