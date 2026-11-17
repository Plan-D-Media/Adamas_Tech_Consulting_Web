/**
 * Visual comparison of /services/cloud-services against design-ref/renders/cloud-services.png (Figma 292:24608),
 * section by section (bands read from design-ref/figma/cloud-services.json top-level children), plus 1440px
 * full-page screenshots of the homepage and the Cloud Services page for the manual review.
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/compare-cloud.mts <baseUrl> <label>
 * Output: docs/qa/evidence/<label>/figma/
 */
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "drafts";
const outDir = path.join("docs", "qa", "evidence", label, "figma");
fs.mkdirSync(outDir, { recursive: true });

// Figma Cloud Services (292:24608) bands in frame pixels.
const SECTIONS: { id: string; name: string; from: number; to: number }[] = [
  { id: "hero", name: "Hero", from: 0, to: 530 },
  { id: "intro", name: "Intro", from: 530, to: 1328 },
  { id: "difference", name: "What makes it different", from: 1328, to: 2251 },
  { id: "expertise", name: "Expertise cards", from: 2251, to: 2921 },
  { id: "platforms", name: "Platform expertise", from: 2921, to: 3688 },
  { id: "industries", name: "Industries", from: 3688, to: 4884 },
  { id: "capabilities", name: "Services & capabilities", from: 4884, to: 6158 },
  { id: "cases", name: "Case studies", from: 6158, to: 7168 },
  { id: "ecosystem", name: "Technology ecosystem", from: 7168, to: 7910 },
  { id: "quality", name: "Quality & trust", from: 7910, to: 8804 },
  { id: "faq", name: "FAQ", from: 8804, to: 9673 },
  { id: "contact", name: "Contact card", from: 9673, to: 10483 },
  { id: "footer", name: "Footer", from: 10483, to: 11313 },
];

async function toPng(buf: Buffer, width: number, height: number) {
  const data = await sharp(buf).resize(width, height, { fit: "fill" }).ensureAlpha().raw().toBuffer();
  const png = new PNG({ width, height });
  data.copy(png.data);
  return png;
}
async function compare(name: string, ours: Buffer, figma: Buffer, maxWidth = 960) {
  const a = await sharp(ours).metadata();
  const b = await sharp(figma).metadata();
  const width = Math.min(maxWidth, a.width ?? maxWidth);
  const height = Math.round((width * (b.height ?? 1)) / (b.width ?? 1));
  const [pa, pb] = await Promise.all([toPng(ours, width, height), toPng(figma, width, height)]);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(pa.data, pb.data, diff.data, width, height, { threshold: 0.2, includeAA: true });
  const pct = (mismatched / (width * height)) * 100;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await sharp({ create: { width: width * 3 + 20, height, channels: 4, background: "#ffffff" } })
    .composite([
      { input: await sharp(figma).resize(width, height, { fit: "fill" }).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(ours).resize(width, height, { fit: "fill" }).png().toBuffer(), left: width + 10, top: 0 },
      { input: PNG.sync.write(diff), left: width * 2 + 20, top: 0 },
    ])
    .png()
    .toFile(path.join(outDir, `cloud-${slug}.png`));
  return { pct, heightOurs: a.height ?? 0, heightFigma: b.height ?? 0 };
}
async function settle(page: Page) {
  await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} .marquee-track{animation:none!important} *{transition:none!important;animation:none!important}" });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

const browser = await chromium.launch();
const results: string[] = [];
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}/services/cloud-services`, { waitUntil: "load" });
  await settle(page);
  const full = await page.screenshot({ fullPage: true });
  fs.writeFileSync(path.join(outDir, "cloud-page-1920.png"), full);
  const figma = fs.readFileSync("design-ref/renders/cloud-services.png");
  const boxes = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("[data-compare], footer")).map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.dataset.compare ?? "footer", top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
    }),
  );
  const pageMeta = await sharp(full).metadata();
  results.push(`Cloud Services page height: ours ${pageMeta.height}px vs Figma 11313px`);
  results.push(`Sections found on the page: ${boxes.map((b) => b.id).join(", ")}`);
  for (const s of SECTIONS) {
    const box = boxes.find((b) => b.id === s.id);
    if (!box || box.height < 10) {
      results.push(`${s.name}: section not found on the page`);
      continue;
    }
    const ours = await sharp(full).extract({ left: 0, top: box.top, width: 1920, height: Math.min(box.height, (pageMeta.height ?? 0) - box.top) }).png().toBuffer();
    const fig = await sharp(figma).extract({ left: 0, top: s.from, width: 1920, height: s.to - s.from }).png().toBuffer();
    const r = await compare(s.name, ours, fig);
    results.push(`${s.name}: ${(100 - r.pct).toFixed(1)}% match (height ${r.heightOurs}px vs Figma ${r.heightFigma}px)`);
  }
  await ctx.close();

  // 1440 full pages for the manual review (no 1440 Figma frame exists; the design is 1920 only).
  const c1440 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const p = await c1440.newPage();
  for (const [route, name] of [["/in/", "home-in-1440"], ["/services/cloud-services", "cloud-1440"], ["/insights/events/house-of-lords-2026", "event-1440"], ["/uk/", "home-uk-1440"], ["/gcc/", "home-gcc-1440"]]) {
    await p.goto(`${base}${route}`, { waitUntil: "load" });
    await settle(p);
    await p.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  }
  // Mega menu at 1440 vs mega-menu-1400 render
  await p.goto(`${base}/in/`, { waitUntil: "load" });
  await settle(p);
  await p.locator('button[data-menu-key="header.services"]').hover();
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(outDir, "mega-menu-1440.png") });
  await c1440.close();
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(outDir, "cloud-results.txt"), results.join("\n") + "\n");
console.log(results.join("\n"));
