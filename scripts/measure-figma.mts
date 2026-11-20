/**
 * Pixel measurements against the Figma Home Page (236:1395) for the sections under review (brief section 11).
 * Usage: tsx scripts/measure-figma.mts [baseUrl] [path] [label]   (defaults: http://localhost:3100, /figma-fixture, round6)
 *
 * Renders the page at 1920px, reads the bounding box of each listed element and prints it next to the Figma node's
 * box (x absolute in the 1920 frame, y relative to the section band so cumulative drift does not hide local
 * differences). Deltas above 2px are flagged. Output: screenshots/<label>/measure-<route>.txt
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const route = process.argv[3] ?? "/figma-fixture";
const label = process.argv[4] ?? "round6";

interface Entry {
  sec: string;
  name: string;
  sel: string;
  nth?: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

const E: Entry[] = [
  // Header (Group 21303), page coordinates.
  { sec: "page", name: "top bar phone", sel: '.site-header .topbar a[href^="tel:"]', x: 352, y: 17, w: 179, h: 16 },
  { sec: "page", name: "top bar email", sel: '.site-header .topbar a[href^="mailto:"]', x: 555, y: 17, w: 253, h: 16 },
  { sec: "page", name: "social icon 1", sel: '.site-header .topbar ul[aria-label="Social media"] svg', nth: 0, x: 1474, y: 17, w: 16, h: 16 },
  { sec: "page", name: "social icon 4", sel: '.site-header .topbar ul[aria-label="Social media"] svg', nth: 3, x: 1552, y: 17, w: 16, h: 16 },
  { sec: "page", name: "glass bar", sel: ".site-header .headerbar", x: 352, y: 48, w: 1216, h: 70 },
  { sec: "page", name: "logo", sel: ".site-header .headerbar img", nth: 0, x: 363, y: 54, w: 205, h: 60 },
  { sec: "page", name: "nav About", sel: '.site-header nav[aria-label="Main"] > ul > li', nth: 0, x: 719, y: 73 },
  { sec: "page", name: "nav Services", sel: '.site-header nav[aria-label="Main"] > ul > li', nth: 1, x: 817, y: 73 },
  { sec: "page", name: "nav Solutions", sel: '.site-header nav[aria-label="Main"] > ul > li', nth: 2, x: 925, y: 73 },
  { sec: "page", name: "nav Case Studies", sel: '.site-header nav[aria-label="Main"] > ul > li', nth: 3, x: 1035, y: 73 },
  { sec: "page", name: "nav Insights", sel: '.site-header nav[aria-label="Main"] > ul > li', nth: 4, x: 1176, y: 73 },
  { sec: "page", name: "region switcher", sel: ".site-header .region-switcher > summary", x: 1275, y: 75, w: 90, h: 16 },
  { sec: "page", name: "header CTA", sel: ".site-header .headerbar a.btn", x: 1383, y: 59, w: 174, h: 48 },
  // Hero (Frame 46 / Frame 47 / Container 236:1405), page coordinates (the hero starts at 0 under the header).
  { sec: "hero", name: "eyebrow pill", sel: "[data-compare=hero] .rounded-pill", x: 703, y: 218, w: 516, h: 40 },
  { sec: "hero", name: "h1", sel: "[data-compare=hero] h1", x: 521, y: 277, w: 879, h: 146 },
  { sec: "hero", name: "body", sel: "[data-compare=hero] h1 + p", x: 521, y: 442, w: 879, h: 52 },
  { sec: "hero", name: "button 1", sel: "[data-compare=hero] a.btn", nth: 0, x: 781, y: 538, w: 174, h: 56 },
  { sec: "hero", name: "button 2", sel: "[data-compare=hero] a.btn", nth: 1, x: 967, y: 538, w: 174, h: 56 },
  { sec: "hero", name: "card track", sel: "[data-compare=hero] [aria-roledescription=carousel]", x: 344, y: 642, w: 1240, h: 227 },
  { sec: "hero", name: "card 1", sel: "[data-compare=hero] [aria-roledescription=slide]", nth: 0, x: 349, y: 647, w: 401, h: 217 },
  { sec: "hero", name: "card 2", sel: "[data-compare=hero] [aria-roledescription=slide]", nth: 1, x: 774, y: 647, w: 381, h: 217 },
  { sec: "hero", name: "card 3", sel: "[data-compare=hero] [aria-roledescription=slide]", nth: 2, x: 1179, y: 647, w: 401, h: 217 },
  { sec: "hero", name: "claim 1", sel: "[data-compare=hero] ul[aria-label=Commitments] > li", nth: 0, x: 343, y: 894, w: 211, h: 28 },
  { sec: "hero", name: "claim 2", sel: "[data-compare=hero] ul[aria-label=Commitments] > li", nth: 1, x: 650, y: 894, w: 145, h: 28 },
  { sec: "hero", name: "prev button", sel: '[data-compare=hero] [role=group][aria-label$="controls"] > button', nth: 0, x: 1284, y: 887, w: 42, h: 42 },
  { sec: "hero", name: "counter", sel: '[data-compare=hero] [role=group][aria-label$="controls"] > p', x: 1340, y: 896, w: 48, h: 24 },
  { sec: "hero", name: "next button", sel: '[data-compare=hero] [role=group][aria-label$="controls"] > button', nth: -1, x: 1530, y: 887, w: 42, h: 42 },
  // Our Services (Frame 12459), relative to 2997.
  { sec: "services", name: "eyebrow", sel: "[data-compare=services] [data-reveal] > div > p", nth: 0, x: 300, y: 103, w: 218, h: 15 },
  { sec: "services", name: "h2", sel: "#services-heading", x: 300, y: 137, w: 719, h: 99 },
  { sec: "services", name: "intro", sel: "#services-heading + p", x: 300, y: 253, w: 650, h: 49 },
  { sec: "services", name: "tab list", sel: "[role=tablist]", x: 300, y: 339, w: 1215, h: 79 },
  { sec: "services", name: "tab 1", sel: "[role=tab]", nth: 0, x: 300, y: 339, w: 405, h: 77 },
  { sec: "services", name: "tab 2", sel: "[role=tab]", nth: 1, x: 705, y: 339, w: 405, h: 77 },
  { sec: "services", name: "tab 3", sel: "[role=tab]", nth: 2, x: 1110, y: 339, w: 405, h: 77 },
  { sec: "services", name: "image card", sel: "[data-compare=services] [data-active] > div > div", nth: 0, x: 300, y: 462, w: 551, h: 556 },
  { sec: "services", name: "image 01", sel: "[data-compare=services] [data-active] span[aria-hidden]", nth: 0, x: 783, y: 479, w: 18, h: 17 },
  { sec: "services", name: "image caption", sel: "[data-compare=services] [data-active] p", nth: 0, x: 325, y: 946, w: 590, h: 31 },
  { sec: "services", name: "paragraph 1", sel: "[data-compare=services] [data-active] p", nth: 1, x: 882, y: 494, w: 672, h: 110 },
  { sec: "services", name: "paragraph 2", sel: "[data-compare=services] [data-active] p", nth: 2, x: 882, y: 604, w: 672, h: 96 },
  { sec: "services", name: "link list", sel: "[data-compare=services] [data-active] ul", x: 882, y: 738, w: 661, h: 199 },
  { sec: "services", name: "link 1", sel: "[data-compare=services] [data-active] ul > li", nth: 0, x: 882, y: 738, w: 294, h: 57 },
  { sec: "services", name: "link 2", sel: "[data-compare=services] [data-active] ul > li", nth: 1, x: 1246, y: 738, w: 297, h: 57 },
  { sec: "services", name: "link 3", sel: "[data-compare=services] [data-active] ul > li", nth: 2, x: 882, y: 795, w: 294, h: 85 },
  { sec: "services", name: "link 5", sel: "[data-compare=services] [data-active] ul > li", nth: 4, x: 882, y: 880, w: 294, h: 57 },
  { sec: "services", name: "explore button", sel: "[data-compare=services] [data-active] ul + a", x: 882, y: 969, w: 237, h: 51 },
  // Client Outcomes (Frame 12460), relative to 5100.
  { sec: "outcomes", name: "eyebrow", sel: "[data-compare=outcomes] [data-reveal] > div > p", nth: 0, x: 300, y: 101, w: 282, h: 15 },
  { sec: "outcomes", name: "h2", sel: "#outcomes-heading", x: 300, y: 128, w: 690, h: 118 },
  { sec: "outcomes", name: "IMPACT", sel: '[data-compare=outcomes] p[aria-hidden="true"]', nth: 0, x: 1184, y: 45, w: 446, h: 195 },
  { sec: "outcomes", name: "feature card", sel: "[data-compare=outcomes] article", nth: 0, x: 300, y: 275, w: 1043, h: 550 },
  { sec: "outcomes", name: "feature label", sel: "[data-compare=outcomes] article p", nth: 0, x: 338, y: 321, w: 200, h: 14 },
  { sec: "outcomes", name: "feature title", sel: "[data-compare=outcomes] article h3", nth: 0, x: 338, y: 353, w: 405, h: 110 },
  { sec: "outcomes", name: "metric row", sel: "[data-compare=outcomes] article .border-t", x: 338, y: 635, w: 404, h: 102 },
  { sec: "outcomes", name: "metric value", sel: "[data-compare=outcomes] article .border-t > p", nth: 0, x: 338, y: 656, w: 116, h: 81 },
  { sec: "outcomes", name: "metric label", sel: "[data-compare=outcomes] article .border-t > p", nth: 1, x: 468, y: 682, w: 100, h: 30 },
  { sec: "outcomes", name: "feature button", sel: "[data-compare=outcomes] article a", nth: 0, x: 338, y: 737, w: 167, h: 42 },
  { sec: "outcomes", name: "card 1", sel: "[data-compare=outcomes] ul article", nth: 0, x: 1202, y: 312, w: 418, h: 230 },
  { sec: "outcomes", name: "card 2", sel: "[data-compare=outcomes] ul article", nth: 1, x: 1202, y: 558, w: 418, h: 230 },
  { sec: "outcomes", name: "card 1 label", sel: "[data-compare=outcomes] ul article p", nth: 0, x: 1230, y: 340, w: 187, h: 14 },
  { sec: "outcomes", name: "card 1 title", sel: "[data-compare=outcomes] ul article h3", nth: 0, x: 1230, y: 367, w: 362, h: 50 },
  { sec: "outcomes", name: "card 1 text", sel: "[data-compare=outcomes] ul article h3 + p", nth: 0, x: 1230, y: 425, w: 362, h: 46 },
  { sec: "outcomes", name: "card 1 link", sel: "[data-compare=outcomes] ul article a", nth: 0, x: 1229, y: 491, w: 142, h: 15 },
  // Our Presence (254:5205 + Frame 12461), relative to 10822.
  { sec: "presence", name: "map band", sel: "[data-compare=presence] > div", nth: 0, x: 0, y: 0, w: 1920, h: 937 },
  { sec: "presence", name: "eyebrow", sel: "[data-compare=presence] [data-reveal] > div > p", nth: 0, x: 300, y: 86, w: 227, h: 15 },
  { sec: "presence", name: "h2", sel: "#presence-heading", x: 300, y: 131, w: 1130, h: 50 },
  { sec: "presence", name: "card 1", sel: "[data-compare=presence] li", nth: 0, x: 300, y: 796, w: 249, h: 271 },
  { sec: "presence", name: "card 2", sel: "[data-compare=presence] li", nth: 1, x: 566, y: 796, w: 250, h: 271 },
  { sec: "presence", name: "card 5", sel: "[data-compare=presence] li", nth: 4, x: 1365, y: 796, w: 249, h: 271 },
  { sec: "presence", name: "card 1 label", sel: "[data-compare=presence] li article p", nth: 0, x: 324, y: 820, w: 166, h: 15 },
  { sec: "presence", name: "card 1 city", sel: "[data-compare=presence] li article h3", nth: 0, x: 324, y: 847, w: 98, h: 29 },
  { sec: "presence", name: "card 1 address", sel: "[data-compare=presence] li article address", nth: 0, x: 324, y: 888, w: 182, h: 69 },
  { sec: "presence", name: "card 2 phone", sel: '[data-compare=presence] li a[href^="tel:"]', nth: 0, x: 590, y: 973, w: 140, h: 20 },
  // Contact (Rectangle 4511), relative to 11960.
  { sec: "contact", name: "card", sel: "[data-compare=contact] [data-reveal]", x: 300, y: 40, w: 1320, h: 631 },
  { sec: "contact", name: "photo", sel: "[data-compare=contact] [data-reveal] > div", nth: 0, x: 305, y: 45, w: 785, h: 621 },
  { sec: "contact", name: "eyebrow", sel: "[data-compare=contact] [data-reveal] p", nth: 0, x: 1138, y: 74, w: 345, h: 55 },
  { sec: "contact", name: "heading", sel: "#contact-heading", x: 1138, y: 122, w: 333, h: 68 },
  { sec: "contact", name: "name field", sel: "[data-compare=contact] input[name=name]", x: 1138, y: 216, w: 421, h: 52 },
  { sec: "contact", name: "email field", sel: "[data-compare=contact] input[name=email]", x: 1138, y: 288, w: 421, h: 52 },
  { sec: "contact", name: "phone field", sel: "[data-compare=contact] input[name=phone]", x: 1138, y: 360, w: 421, h: 52 },
  { sec: "contact", name: "message field", sel: "[data-compare=contact] textarea[name=message]", x: 1138, y: 432, w: 421, h: 111 },
  { sec: "contact", name: "submit", sel: "[data-compare=contact] button[type=submit]", x: 1139, y: 578, w: 168, h: 43 },
];

const browser = await chromium.launch();
const lines: string[] = [];
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}${route}`, { waitUntil: "load" });
  await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} *{transition:none!important;animation:none!important} nextjs-portal{display:none!important}" });
  // Wait for hydration first: setting the attributes earlier makes React report a test-only mismatch (dev overlay).
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
  await page.waitForTimeout(500);
  const boxes = (await page.evaluate(
    `(() => {
      const E = ${JSON.stringify(E)};
      const out = [];
      const secTop = (sec) => {
        if (sec === "page") return 0;
        const el = document.querySelector('[data-compare="' + sec + '"]');
        return el ? el.getBoundingClientRect().top + window.scrollY : NaN;
      };
      for (const e of E) {
        const list = Array.from(document.querySelectorAll(e.sel));
        const el = e.nth === undefined ? list[0] : e.nth < 0 ? list[list.length + e.nth] : list[e.nth];
        if (!el) { out.push({ name: e.name, sec: e.sec, missing: true }); continue; }
        const r = el.getBoundingClientRect();
        out.push({ name: e.name, sec: e.sec, x: r.left, y: r.top + window.scrollY - secTop(e.sec), w: r.width, h: r.height });
      }
      return out;
    })()`,
  )) as { name: string; sec: string; missing?: boolean; x: number; y: number; w: number; h: number }[];
  const pad = (s: string | number, n: number) => String(s).padStart(n);
  let section = "";
  let flagged = 0;
  for (let i = 0; i < E.length; i++) {
    const e = E[i];
    const b = boxes[i];
    if (e.sec !== section) {
      section = e.sec;
      lines.push("", `== ${section}`, `${"element".padEnd(18)}  ${"ours x,y,w,h".padEnd(28)}  ${"figma x,y,w,h".padEnd(28)}  delta x,y,w,h`);
    }
    if (b.missing) {
      lines.push(`${e.name.padEnd(18)}  MISSING (${e.sel})`);
      continue;
    }
    const ours = [b.x, b.y, b.w, b.h].map((v) => Math.round(v));
    const fig = [e.x, e.y, e.w ?? NaN, e.h ?? NaN];
    const d = ours.map((v, k) => (Number.isNaN(fig[k]) ? NaN : v - fig[k]));
    const flag = d.some((v) => !Number.isNaN(v) && Math.abs(v) > 2) ? " *" : "";
    if (flag) flagged++;
    const fmt = (arr: number[]) => arr.map((v) => (Number.isNaN(v) ? "-" : pad(v, 5))).join(" ");
    lines.push(`${e.name.padEnd(18)}  ${fmt(ours).padEnd(28)}  ${fmt(fig).padEnd(28)}  ${fmt(d)}${flag}`);
  }
  lines.push("", `${flagged} of ${E.length} measurements differ by more than 2px.`);
  await ctx.close();
} finally {
  await browser.close();
}
const outDir = path.join("screenshots", label);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `measure-${route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root"}.txt`), lines.join("\n") + "\n");
console.log(lines.join("\n"));
