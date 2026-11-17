#!/usr/bin/env node
/**
 * Per-section visual comparison of a built page against its Figma frame render (brief section 11; the homepage has
 * its own script, scripts/compare-figma.mts, whose bands are hard-coded).
 *
 *   node scripts/qa/compare-figma-page.mjs about http://localhost:3000
 *   node scripts/qa/compare-figma-page.mjs case-detail http://localhost:3000
 *
 * For each `data-compare` section on the page it takes that band of the full-page screenshot at 1920, squeezes it
 * to the aspect of the matching Figma band, and runs pixelmatch over the pair. Side-by-side (Figma | ours | diff)
 * images go to docs/qa/evidence/inner-pages/compare/<page>/.
 *
 * Reading the numbers: the comparison is of layout, not of words. These pages render the client's content from the
 * database while the frame carries the designer's placeholder copy (and, in places, another company's), so a band
 * whose structure matches exactly still reports mismatch wherever the text differs. The figure to watch is whether
 * a section's blocks sit in the same places and are the same size; `docs/design-notes.md` records every deliberate
 * difference.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/** Figma y-bands per page, read off the frame with scripts/qa/crop-render.mjs. */
const PAGES = {
  about: {
    route: "/about",
    render: "design-ref/renders/about-us.png",
    frameHeight: 12605,
    sections: {
      "about-hero": [0, 530],
      "about-company": [588, 1094],
      "about-approach": [1192, 1824],
      "about-expertise": [4774, 5469],
      "about-journey": [5580, 6330],
      "about-credentials": [6440, 6877],
      "about-people": [10172, 10770],
      contact: [11119, 11900],
    },
  },
  "case-detail": {
    route: "/case-studies/sap-treasury-cash-forecasting",
    render: "design-ref/renders/case-study.png",
    frameHeight: 12307,
    sections: {
      // The frame runs the photograph to y 850 and hangs the facts strip off its bottom edge (850-940).
      "case-hero": [0, 850],
      "case-facts": [850, 940],
      "case-summary": [943, 1400],
      "case-challenge": [1635, 2210],
      "case-solution": [3957, 6070],
      "case-tech": [7000, 7699],
      "case-results": [8585, 9509],
    },
  },
  careers: {
    route: "/about/careers",
    render: "design-ref/renders/carrer.png",
    frameHeight: 5955,
    sections: {
      "about-hero": [0, 600],
      "careers-why": [629, 1340],
      "careers-process": [1402, 2093],
      "careers-openings": [2192, 4714],
    },
  },
};

const name = process.argv[2];
const base = (process.argv[3] ?? "http://localhost:3000").replace(/\/$/, "");
const page = PAGES[name];
if (!page) {
  console.error(`Usage: node scripts/qa/compare-figma-page.mjs <${Object.keys(PAGES).join("|")}> [baseUrl]`);
  process.exit(1);
}

const outDir = path.join("docs", "qa", "evidence", "inner-pages", "compare", name);
fs.mkdirSync(outDir, { recursive: true });

async function toPng(buf, width, height) {
  const data = await sharp(buf).resize(width, height, { fit: "fill" }).ensureAlpha().raw().toBuffer();
  const png = new PNG({ width, height });
  data.copy(png.data);
  return png;
}

async function compare(slug, ours, figma, maxWidth = 960) {
  const a = await sharp(ours).metadata();
  const b = await sharp(figma).metadata();
  const width = Math.min(maxWidth, a.width ?? maxWidth);
  const height = Math.round((width * (b.height ?? 1)) / (b.width ?? 1));
  const [pa, pb] = await Promise.all([toPng(ours, width, height), toPng(figma, width, height)]);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(pa.data, pb.data, diff.data, width, height, { threshold: 0.2, includeAA: true });
  await sharp({ create: { width: width * 3 + 20, height, channels: 4, background: "#ffffff" } })
    .composite([
      { input: await sharp(figma).resize(width, height, { fit: "fill" }).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(ours).resize(width, height, { fit: "fill" }).png().toBuffer(), left: width + 10, top: 0 },
      { input: PNG.sync.write(diff), left: width * 2 + 20, top: 0 },
    ])
    .png()
    .toFile(path.join(outDir, `${slug}.png`));
  return { match: 100 - (mismatched / (width * height)) * 100, ourHeight: a.height ?? 0, figmaHeight: b.height ?? 0 };
}

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const tab = await ctx.newPage();
  await tab.goto(`${base}${page.route}`, { waitUntil: "load", timeout: 45000 });
  await tab.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} *{transition:none!important;animation:none!important} nextjs-portal{display:none!important}" });
  await tab.waitForTimeout(1200);
  await tab.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));

  const total = await tab.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 800) {
    await tab.evaluate((yy) => window.scrollTo(0, yy), y);
    await tab.waitForTimeout(60);
  }
  await tab.evaluate(() => window.scrollTo(0, 0));
  await tab.waitForTimeout(600);

  const full = await tab.screenshot({ fullPage: true });
  fs.writeFileSync(path.join(outDir, "page-1920.png"), full);
  const boxes = await tab.evaluate(() =>
    Array.from(document.querySelectorAll("[data-compare]")).map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.dataset.compare, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
    }),
  );

  const figmaFull = fs.readFileSync(page.render);
  const figmaMeta = await sharp(figmaFull).metadata();
  const scale = (figmaMeta.height ?? page.frameHeight) / page.frameHeight;

  const pageMeta = await sharp(full).metadata();
  console.log(`${name}: page height ours ${pageMeta.height}px, Figma frame ${page.frameHeight}px`);
  console.log("");
  console.log("| Section | Match | Our height | Figma band |");
  console.log("|---|---|---|---|");

  for (const [id, [from, to]] of Object.entries(page.sections)) {
    const box = boxes.find((b) => b.id === id);
    if (!box) {
      console.log(`| ${id} | not rendered | - | ${from}-${to} |`);
      continue;
    }
    const ours = await sharp(full).extract({ left: 0, top: box.top, width: pageMeta.width, height: Math.min(box.height, (pageMeta.height ?? 0) - box.top) }).png().toBuffer();
    const band = await sharp(figmaFull)
      .extract({ left: 0, top: Math.round(from * scale), width: figmaMeta.width, height: Math.round((to - from) * scale) })
      .png()
      .toBuffer();
    const r = await compare(id, ours, band);
    console.log(`| ${id} | ${r.match.toFixed(1)}% | ${box.height}px | ${from}-${to} (${to - from}px) |`);
  }
  console.log("");
  console.log(`side-by-side images: ${outDir}`);
} finally {
  await browser.close();
}
