/** Prints console errors for one page (QA). Usage: npx tsx scripts/console-check.ts http://localhost:3000/in/ [width] */
import { chromium } from "playwright";

const [url = "http://localhost:3000/in/", w = "1440"] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: Number(w), height: 900 } });
  p.on("console", (m) => m.type() === "error" && !/vimeo|cloudflare/i.test(m.text()) && console.log("ERR:", m.text().slice(0, 20000), "\n"));
  p.on("pageerror", (e) => console.log("PAGEERR:", String(e).slice(0, 900), "\n"));
  await p.route(/player\.vimeo\.com/, (r) => r.abort());
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  await b.close();
})();
