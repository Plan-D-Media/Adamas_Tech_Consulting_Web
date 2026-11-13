/**
 * Frosted mega-menu contrast check (designer decision, docs/design-notes.md round 7).
 * Samples what sits behind the panel (x 304-1616, y 163-796 at 1920px) on each route at the top of the page (dark hero)
 * and scrolled onto the light sections, blends it with white at candidate opacities and reports the worst contrast of
 * each text/icon colour used in the panels. Pass: 4.5:1 for text, 3:1 for icons.
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 tsx scripts/glass-contrast.mts [baseUrl] [routes...]
 */
import { chromium } from "playwright";
import sharp from "sharp";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const routes = process.argv.length > 3 ? process.argv.slice(3) : ["/in/", "/uk/", "/gcc/", "/contact"];
const PANEL = { left: 304, top: 163, width: 1312, height: 633 };
const ALPHAS = [0.75, 0.8, 0.85, 0.88, 0.9, 0.92, 0.94];
const TEXT: Record<string, string> = { "navy-900 (links)": "#071c36", "grey-700 (descriptor)": "#3a4b63", "grey-500 (labels)": "#5b6b80", "blue-600 (links)": "#1167d8", "blue-500 (overview)": "#1c85ff", "blue-700 (links alt)": "#0e5ca7", "grey-700 (labels alt)": "#3a4b63" };
const ICON: Record<string, string> = { "chevron navy-900/60": "rgba(7,28,54,0.6)", "external grey-500": "#5b6b80" };

const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (l1: number, l2: number) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
function parse(c: string, over: [number, number, number]): [number, number, number] {
  const m = c.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
  if (m) {
    const a = Number(m[4]);
    return [0, 1, 2].map((i) => Math.round(Number(m[i + 1]) * a + over[i] * (1 - a))) as [number, number, number];
  }
  return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as [number, number, number];
}

const browser = await chromium.launch();
const out: string[] = [];
try {
  for (const route of routes) {
    for (const scrollY of [0, 1400]) {
      const ctx = await browser.newContext({ viewport: { width: 1920, height: 961 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(`${base}${route}`, { waitUntil: "load" });
      await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} *{transition:none!important;animation:none!important} .site-header{visibility:hidden}" });
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(600);
      const shot = await page.screenshot();
      // 20px blur approximates the backdrop filter; then take the darkest and lightest 32px cells.
      const { data, info } = await sharp(shot).extract(PANEL).blur(10).resize({ width: Math.round(PANEL.width / 32), height: Math.round(PANEL.height / 32), fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
      const cells: [number, number, number][] = [];
      for (let i = 0; i < data.length; i += info.channels) cells.push([data[i], data[i + 1], data[i + 2]]);
      const darkest = cells.reduce((a, b) => (lum(...a) < lum(...b) ? a : b));
      out.push(`${route} scrollY=${scrollY}: darkest backdrop rgb(${darkest.join(",")})`);
      for (const a of ALPHAS) {
        const bg = darkest.map((v) => Math.round(255 * a + v * (1 - a))) as [number, number, number];
        const lbg = lum(...bg);
        const fails: string[] = [];
        for (const [name, hex] of Object.entries(TEXT)) {
          const r = ratio(lbg, lum(...parse(hex, bg)));
          if (r < 4.5) fails.push(`${name} ${r.toFixed(2)}`);
        }
        for (const [name, c] of Object.entries(ICON)) {
          const r = ratio(lbg, lum(...parse(c, bg)));
          if (r < 3) fails.push(`${name} ${r.toFixed(2)}`);
        }
        out.push(`  white ${Math.round(a * 100)}%: bg rgb(${bg.join(",")}) ${fails.length ? "FAIL " + fails.join("; ") : "pass"}`);
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log(out.join("\n"));
