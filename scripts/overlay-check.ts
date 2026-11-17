/**
 * Dev-only QA: loads each path in `next dev` (fresh page each) and reports what the Next.js dev overlay shows:
 * its tabs (Issues / Insights counts), message and source location, plus console errors.
 * Usage: npx tsx scripts/overlay-check.ts http://localhost:3000 /in/ /uk/ /case-studies ...
 * (Git Bash: prefix with MSYS_NO_PATHCONV=1 so "/in/" isn't turned into a Windows path.)
 */
import { chromium } from "playwright";

const [base = "http://localhost:3000", ...paths] = process.argv.slice(2);

// A string, not a function: tsx's keepNames helper (__name) doesn't exist in the page.
const READ_OVERLAY = `(() => {
  const r = document.querySelector("nextjs-portal")?.shadowRoot;
  if (!r) return "no overlay";
  const t = (e) => (e?.textContent || "").split(String.fromCharCode(10)).join(" ").trim();
  const tabs = [...r.querySelectorAll(".error-overlay-tab")].map(t).filter(Boolean);
  const msg = [...r.querySelectorAll("[class*=error-overlay] h1, [class*=error-overlay] p")].map(t).filter(Boolean).slice(0, 3);
  if (!tabs.length && !msg.length) return "clean";
  return "OVERLAY [" + tabs.join(" | ") + "] " + msg.join(" | ").slice(0, 500);
})()`;

(async () => {
  const b = await chromium.launch();
  for (const path of paths) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errors: string[] = [];
    p.on("console", (m) => m.type() === "error" && !/vimeo|cloudflare|favicon/i.test(m.text()) && errors.push(m.text().slice(0, 400)));
    p.on("pageerror", (e) => errors.push("PAGEERR " + String(e).slice(0, 400)));
    await p.goto(base + path, { waitUntil: "networkidle", timeout: 180_000 });
    await p.waitForTimeout(6000);
    console.log(`${path} → ${await p.evaluate(READ_OVERLAY)}`);
    for (const e of errors) console.log("   ERR:", e.replace(/\s+/g, " "));
    await p.close();
  }
  await b.close();
})().catch((e) => {
  console.error("FAILED:", String(e).split("\n")[0]);
  process.exit(1);
});
