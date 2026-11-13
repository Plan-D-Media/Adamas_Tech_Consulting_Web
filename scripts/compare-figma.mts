/**
 * Visual comparison against the Figma renders (brief section 11).
 * Usage: tsx scripts/compare-figma.mts [baseUrl] [path] [label]   (defaults: http://localhost:3100, /in/, round5)
 *
 * 1. Screenshots the page at 1920px (reduced motion, reveals forced, sliders at rest) and compares each section's
 *    box with the matching band of design-ref/renders/home.png (Figma y-ranges below), both resized to the same
 *    size, using pixelmatch. Reports the mismatch percentage per section and writes side-by-side + diff images to
 *    screenshots/<label>/compare/.
 * 2. Compares the header band and the open Services mega menu with design-ref/renders/mega-menu.png.
 */
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const route = process.argv[3] ?? "/in/";
const label = process.argv[4] ?? "round5";
const outDir = path.join("screenshots", label, "compare");
fs.mkdirSync(outDir, { recursive: true });

// Figma Home Page (236:1395) section bands in frame pixels.
const SECTIONS: { id: string; name: string; from: number; to: number }[] = [
  { id: "hero", name: "Hero", from: 0, to: 961 },
  { id: "stories", name: "Top Stories", from: 961, to: 1813 },
  { id: "partners", name: "Partners & Certifications", from: 1813, to: 2217 },
  { id: "about", name: "About Adamas", from: 2217, to: 2997 },
  { id: "services", name: "Our Services", from: 2997, to: 4121 },
  { id: "solutions", name: "Products & Solutions", from: 4121, to: 5100 },
  { id: "outcomes", name: "Client Outcomes", from: 5100, to: 6035 },
  { id: "industries", name: "Industries", from: 6035, to: 7035 },
  { id: "difference", name: "Why Organisations Choose Adamas", from: 7035, to: 8048 },
  { id: "events", name: "Events & Insights", from: 8048, to: 8997 },
  { id: "perspectives", name: "Latest Perspectives", from: 8997, to: 9990 },
  { id: "tech", name: "Tech Excellence", from: 9990, to: 10825 },
  { id: "presence", name: "Our Presence", from: 10822, to: 11960 },
  { id: "contact", name: "Contact form", from: 11960, to: 12736 },
  { id: "footer", name: "Footer", from: 12736, to: 13566 },
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
  // Compare at the Figma band's aspect ratio; ours is squeezed to it so layout differences show as mismatch.
  const height = Math.round((width * (b.height ?? 1)) / (b.width ?? 1));
  const [pa, pb] = await Promise.all([toPng(ours, width, height), toPng(figma, width, height)]);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(pa.data, pb.data, diff.data, width, height, { threshold: 0.2, includeAA: true });
  const pct = (mismatched / (width * height)) * 100;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const side = await sharp({ create: { width: width * 3 + 20, height, channels: 4, background: "#ffffff" } })
    .composite([
      { input: await sharp(figma).resize(width, height, { fit: "fill" }).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(ours).resize(width, height, { fit: "fill" }).png().toBuffer(), left: width + 10, top: 0 },
      { input: PNG.sync.write(diff), left: width * 2 + 20, top: 0 },
    ])
    .png()
    .toFile(path.join(outDir, `${slug}.png`));
  void side;
  return { pct, heightOurs: a.height ?? 0, heightFigma: b.height ?? 0 };
}

async function settle(page: Page) {
  await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} .marquee-track{animation:none!important} *{transition:none!important;animation:none!important}" });
  await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
  await page.waitForTimeout(400);
}

const browser = await chromium.launch();
const results: string[] = [];
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}${route}`, { waitUntil: "load" });
  await settle(page);
  // Lazy images: scroll through once.
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const full = await page.screenshot({ fullPage: true });
  fs.writeFileSync(path.join(outDir, "page-1920.png"), full);
  const figma = fs.readFileSync("design-ref/renders/home.png");

  const boxes = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("[data-compare]")).map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.dataset.compare!, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
    }),
  );
  const pageMeta = await sharp(full).metadata();
  results.push(`Page height: ours ${pageMeta.height}px vs Figma 13566px`);
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

  // Header + open Services mega menu vs the Mega Menu frame (1920x961).
  const m = await ctx.newPage();
  await m.setViewportSize({ width: 1920, height: 961 });
  await m.goto(`${base}${route}`, { waitUntil: "load" });
  await settle(m);
  await m.locator('button[data-menu-key="header.services"]').hover();
  await m.waitForTimeout(500);
  const menuShot = await m.screenshot();
  fs.writeFileSync(path.join(outDir, "mega-menu-ours.png"), menuShot);
  const menuFigma = fs.readFileSync("design-ref/renders/mega-menu.png");
  const header = await compare("Header band", await sharp(menuShot).extract({ left: 0, top: 0, width: 1920, height: 130 }).png().toBuffer(), await sharp(menuFigma).extract({ left: 0, top: 0, width: 1920, height: 130 }).png().toBuffer(), 1200);
  results.push(`Header: ${(100 - header.pct).toFixed(1)}% match`);
  const panel = await compare("Mega menu (Services)", await sharp(menuShot).extract({ left: 300, top: 160, width: 1320, height: 650 }).png().toBuffer(), await sharp(menuFigma).extract({ left: 300, top: 160, width: 1320, height: 650 }).png().toBuffer(), 1200);
  results.push(`Mega menu (Services): ${(100 - panel.pct).toFixed(1)}% match`);
  await ctx.close();
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(outDir, "results.txt"), results.join("\n") + "\n");
console.log(results.join("\n"));
