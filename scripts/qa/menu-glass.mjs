#!/usr/bin/env node
/**
 * Verifies the portalled mega-menu panels (round 8): every panel opened over each of the four backdrops the brief
 * names - the dark hero, the partner logo strip, a white section and a photograph - and for each pair it measures,
 * on the real screenshot rather than a simulation:
 *
 *   readability of the page behind   edge energy inside the panel rect with the panel open vs closed. Legible text
 *                                    is high-frequency; blur + 95% white should collapse it. Reported as attenuation.
 *   panel text contrast              the worst-case composited panel background (darkest 32px cell of the blurred
 *                                    panel region, the featured card excluded because it is navy by design) against
 *                                    every text colour actually used in that panel, read from getComputedStyle.
 *
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 node scripts/qa/menu-glass.mjs [baseUrl]
 * Output: docs/qa/evidence/menu/<backdrop>-<panel>.png  plus a Markdown table on stdout.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outDir = path.join("docs", "qa", "evidence", "menu");
fs.mkdirSync(outDir, { recursive: true });

/** The four backdrops. `align` scrolls so that element's top sits just under the header, filling the panel area. */
const BACKDROPS = [
  { key: "dark-hero", route: "/in/", scrollY: 0, note: "homepage dark hero (navy + hero image)" },
  { key: "logo-strip", route: "/in/", align: "[data-compare='partners']", note: "Partners & Certifications logo strip" },
  { key: "white-section", route: "/about", align: "[data-compare='about-approach']", note: "white section" },
  { key: "photograph", route: "/case-studies/sap-treasury-cash-forecasting", align: "[data-compare='case-solution']", note: "photograph / product screenshot band" },
];

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

/** "rgb(r, g, b)" / "rgba(r, g, b, a)" composited over `over`. */
function parseColor(c, over) {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,/]/).map((v) => Number(v.trim()));
  const a = p.length > 3 ? p[3] : 1;
  return [0, 1, 2].map((i) => Math.round(p[i] * a + over[i] * (1 - a)));
}

/** Mean gradient magnitude: a measure of how much legible detail a crop holds. */
async function edgeEnergy(buf, rect) {
  const { data, info } = await sharp(buf).extract(rect).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let sum = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      sum += Math.abs(data[i] - data[i + 1]) + Math.abs(data[i] - data[i + w]);
      n++;
    }
  }
  return n ? sum / n : 0;
}

/** Worst-case composited panel background: darkest 32px cell of the blurred panel, minus the featured card. */
async function worstBackground(buf, panel, exclude) {
  let img = sharp(buf).extract(panel);
  if (exclude) {
    // Paint the featured card white so it cannot win "darkest": it is navy by design, not a backdrop failure.
    const ex = { left: Math.max(0, exclude.left - panel.left), top: Math.max(0, exclude.top - panel.top), width: exclude.width, height: exclude.height };
    ex.width = Math.min(ex.width, panel.width - ex.left);
    ex.height = Math.min(ex.height, panel.height - ex.top);
    if (ex.width > 0 && ex.height > 0) {
      const patch = await sharp({ create: { width: ex.width, height: ex.height, channels: 3, background: "#ffffff" } }).png().toBuffer();
      img = sharp(await img.png().toBuffer()).composite([{ input: patch, left: ex.left, top: ex.top }]);
    }
  }
  const cols = Math.max(4, Math.round(panel.width / 32));
  const rows = Math.max(4, Math.round(panel.height / 32));
  const { data, info } = await sharp(await img.png().toBuffer()).blur(6).resize({ width: cols, height: rows, fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let worst = null;
  for (let i = 0; i < data.length; i += info.channels) {
    const cell = [data[i], data[i + 1], data[i + 2]];
    if (!worst || lum(...cell) < lum(...worst)) worst = cell;
  }
  return worst;
}

const rows = [];
const browser = await chromium.launch();
try {
  for (const bd of BACKDROPS) {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1000 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const res = await page.goto(`${base}${bd.route}`, { waitUntil: "load", timeout: 60000 });
    if (!res || res.status() >= 400) {
      rows.push(`| ${bd.key} | - | route ${bd.route} returned ${res?.status()} | - | - |`);
      await ctx.close();
      continue;
    }
    await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} nextjs-portal{display:none!important}" });
    await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
    // Load lazy images so a photograph backdrop really is a photograph.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);

    if (bd.align) {
      const ok = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const bar = document.querySelector(".headerbar");
        const gap = bar ? bar.getBoundingClientRect().height + 60 : 150;
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - gap);
        return true;
      }, bd.align);
      if (!ok) {
        rows.push(`| ${bd.key} | - | selector ${bd.align} not found on ${bd.route} | - | - |`);
        await ctx.close();
        continue;
      }
      await page.waitForTimeout(700);
    }

    const keys = await page.$$eval("button[data-menu-key]", (els) => els.map((e) => e.getAttribute("data-menu-key")));
    const closedShot = await page.screenshot();

    for (const key of keys) {
      await page.click(`button[data-menu-key="${key}"]`);
      await page.waitForTimeout(500);

      const info = await page.evaluate(() => {
        const host = document.querySelector("[data-menu-panel-host]");
        const panel = host?.querySelector("[role='group']");
        if (!panel) return null;
        const r = panel.getBoundingClientRect();
        const feat = panel.querySelector("a.bg-navy-900, a[class*='bg-navy-900']");
        const fr = feat?.getBoundingClientRect() ?? null;
        const colours = new Map();
        for (const el of panel.querySelectorAll("*")) {
          const t = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (!t) continue;
          if (feat && feat.contains(el)) continue; // the dark card sets its own contrast
          const cs = getComputedStyle(el);
          const size = parseFloat(cs.fontSize);
          const bold = Number(cs.fontWeight) >= 700;
          // WCAG large text: >=24px, or >=18.66px bold.
          const large = size >= 24 || (bold && size >= 18.66);
          const kk = `${cs.color}|${large ? "large" : "normal"}`;
          if (!colours.has(kk)) colours.set(kk, { color: cs.color, large, sample: el.textContent.trim().slice(0, 28) });
        }
        const scrim = document.querySelector(".anim-scrim-in");
        return {
          rect: { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) },
          featured: fr ? { left: Math.round(fr.left), top: Math.round(fr.top), width: Math.round(fr.width), height: Math.round(fr.height) } : null,
          colours: [...colours.values()],
          scrim: !!scrim,
          parentIsBody: host?.parentElement?.tagName === "BODY",
          filter: panel ? getComputedStyle(panel).backdropFilter : null,
        };
      });

      if (!info) {
        rows.push(`| ${bd.key} | ${key} | panel not found | - | - |`);
        await page.keyboard.press("Escape");
        continue;
      }

      const openShot = await page.screenshot();
      const file = path.join(outDir, `${bd.key}-${key.replace(/[^a-z0-9]+/gi, "-")}.png`);
      await sharp(openShot).toFile(file);

      // Clamp the panel rect into the viewport before cropping.
      const r = info.rect;
      const rect = { left: Math.max(0, r.left), top: Math.max(0, r.top), width: Math.min(r.width, 1920 - Math.max(0, r.left)), height: Math.min(r.height, 1000 - Math.max(0, r.top)) };

      // "Is the page behind still readable?" has to be measured on the glass alone: the panel's own links are text
      // too, and the dense Services panel adds more edge energy than the backdrop it hides. Hiding the panel's
      // content leaves the fill, the border and the backdrop-filter untouched, so what remains in the rect is
      // exactly what a visitor can still make out of the page through the glass.
      await page.evaluate(() => {
        const panel = document.querySelector("[data-menu-panel-host] [role='group']");
        for (const child of panel?.children ?? []) child.style.visibility = "hidden";
      });
      await page.waitForTimeout(250);
      const glassShot = await page.screenshot();
      await page.evaluate(() => {
        const panel = document.querySelector("[data-menu-panel-host] [role='group']");
        for (const child of panel?.children ?? []) child.style.visibility = "";
      });

      const before = await edgeEnergy(closedShot, rect);
      const after = await edgeEnergy(glassShot, rect);
      const bg = await worstBackground(openShot, rect, info.featured);
      const lbg = lum(...bg);

      // Worst = smallest margin against its own WCAG requirement (4.5:1 normal, 3:1 large).
      let worst = null;
      for (const c of info.colours) {
        const rgb = parseColor(c.color, bg);
        if (!rgb) continue;
        const cr = ratio(lbg, lum(...rgb));
        const need = c.large ? 3 : 4.5;
        if (!worst || cr / need < worst.cr / worst.need) worst = { cr, need, name: `${c.color}${c.large ? " large" : ""} "${c.sample}"` };
      }

      rows.push(
        `| ${bd.key} | ${key} | ${info.parentIsBody ? "body" : "NOT body"} / ${info.filter && info.filter !== "none" ? "blur on" : "NO BLUR"} / ${info.scrim ? "scrim" : "no scrim"} | edge ${before.toFixed(1)} -> ${after.toFixed(1)} (-${(100 - (after / before) * 100).toFixed(0)}%) | bg rgb(${bg.join(",")}) ${worst ? `worst ${worst.cr.toFixed(2)}:1 (need ${worst.need}) ${worst.cr >= worst.need ? "PASS" : "FAIL"} ${worst.name}` : "no text found"} |`,
      );

      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log("| Backdrop | Panel | Portal / blur / scrim | Behind-panel edge energy | Worst panel text contrast |");
console.log("|---|---|---|---|---|");
for (const r of rows) console.log(r);
console.log("");
console.log(`screenshots: ${outDir}`);
