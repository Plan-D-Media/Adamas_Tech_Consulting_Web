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
    // All sixteen bands of the frame, in order (round 8). Read off the frame with scripts/qa/figma-band.mjs
    // --sections; the gaps between them are the frame's own section spacing.
    sections: {
      "about-hero": [0, 530],
      "about-company": [588, 1094],
      "about-approach": [1192, 1824],
      "about-partners": [1894, 1999],
      "about-commitment": [2089, 3081],
      "about-direction": [3164, 3747],
      "about-progress": [3859, 4664],
      "about-expertise": [4774, 5469],
      "about-journey": [5580, 6330],
      "about-clients": [6440, 6877],
      "about-statement": [6997, 7972],
      "about-life": [8092, 9111],
      "about-cta": [9474, 10052],
      "about-people": [10172, 10770],
      "about-awards": [10886, 11016],
      // Group 21307 is the contact card AND the footer; our DOM splits them, so the band is split too.
      contact: [11119, 11849],
      footer: [11849, 12605],
    },
  },
  "case-detail": {
    route: "/case-studies/sap-treasury-cash-forecasting",
    render: "design-ref/renders/case-study.png",
    frameHeight: 12307,
    sections: {
      // Round 8 correction: the frame has NO facts strip. The band previously mapped to "case-facts" (850-940) is
      // the top edge of the executive-summary panel, so that row reported a meaningless number. The strip is our
      // own addition (industry / focus / service / technology / region) and is on the allowed-differences list, so
      // it is left out of the comparison rather than scored against someone else's band.
      "case-hero": [0, 530],
      "case-strip": [564, 799],
      "case-summary": [833, 1535],
      "case-challenge": [1635, 2210],
      "case-solution": [3957, 6070],
      "case-tech": [7000, 7699],
      "case-results": [8585, 9509],
    },
  },
  // Cloud Services (Figma 292:24608). All twelve bands of the frame, read off with figma-band.mjs --sections.
  // Rebuilt November 2026 to the revamp frame (file IldSD5373EYodtZ2XH17uk, node 8705:3814), drawn at 1440.
  "cloud-v2": {
    route: "/services/cloud-services",
    render: "design-ref/renders/cloud.png",
    frameHeight: 6695,
    width: 1440,
    sections: {
      "cs-hero": [109, 724],
      "cs-clients": [724, 875],
      "cs-stack": [875, 1365],
      "cs-capabilities": [1365, 2204],
      "cs-cases": [2204, 3069],
      "cs-framework": [3069, 3939],
      "cs-credentials": [3939, 5089],
      "cs-industries": [5089, 5822],
      "cs-testimonials": [5822, 6340],
      "cs-credits": [6340, 6695],
    },
  },
  /**
   * The FINALISED designs, 23 November 2026. These four are compared against a render of the supplied SVG, not
   * against a Figma frame: the Figma frames on page 7586:47704 are older drafts (Cloud 6695 vs 8480 tall,
   * Managed Services 5997 vs 7252, Kubernetes 4152 vs 4867). Bands were measured off the render with
   * scripts/qa/detect-bands.mjs plus the slices in design-ref/renders/new-design/slices/.
   *
   * The design includes the site's own header, contact block and footer. The header band is left out (it is
   * chrome, not page content); the contact band is included, because the page renders it.
   */
  "cloud-final": {
    route: "/services/cloud-services",
    render: "design-ref/renders/new-design/Cloud.png",
    frameHeight: 8480,
    width: 1440,
    // The clientele marquee and the testimonial row fall back to a static wrapping row / grid under reduced
    // motion, which is a different layout from the one the design draws.
    reducedMotion: false,
    sections: {
      // Our header overlays the dark hero, so the band starts at the top of the design too.
      "cs-hero": [0, 770],
      "cs-clients": [770, 911],
      "cs-stack": [911, 1405],
      "cs-capabilities": [1405, 2459],
      "cs-cases": [2459, 3306],
      "cs-framework": [3306, 4189],
      "cs-credentials": [4189, 5370],
      "cs-industries": [5370, 6050],
      "cs-testimonials": [6082, 6600],
      "cs-credits": [6600, 6930],
      "cs-contact": [6930, 7690],
    },
  },
  "managed-final": {
    route: "/services/cloud-services/managed-services",
    render: "design-ref/renders/new-design/Managed Services.png",
    frameHeight: 7252,
    width: 1440,
    sections: {
      // Our header overlays the dark hero, so the band starts at the top of the design too.
      "sub-hero": [0, 764],
      "sub-overview": [764, 1390],
      "sub-benefits": [1390, 2031],
      "sub-manage": [2031, 2947],
      "sub-value": [2947, 3900],
      "sub-cases": [3960, 4620],
      "sub-related": [4620, 5330],
      "sub-cta": [5330, 5620],
      "sub-contact": [5620, 6404],
    },
  },
  "case-sap-final": {
    route: "/case-studies/sap-disaster-recovery-cement",
    render: "design-ref/renders/new-design/Case Study_SAP_Cement industry.png",
    frameHeight: 4262,
    width: 1440,
    sections: {
      // This export draws an older page header and a template footer branded "SYNCK"; neither is built, so
      // neither is scored. The hero band starts below that header.
      "case-hero": [167, 681],
      "case-challenge": [1180, 1380],
      "case-solution": [1400, 2060],
      "case-outcomes": [2060, 2490],
      "case-stack": [2690, 3040],
      "case-cta": [3070, 3310],
    },
  },
  "case-kubernetes-final": {
    route: "/case-studies/kubernetes-operations-healthtech",
    render: "design-ref/renders/new-design/Case Study_Kubernetes.png",
    frameHeight: 4867,
    width: 1440,
    sections: {
      "case-hero": [0, 695],
      "case-challenge": [1190, 1390],
      "case-solution": [1420, 2030],
      "case-outcomes": [2030, 2460],
      "case-stack": [2650, 2950],
      "case-cta": [3000, 3230],
      "case-contact": [3290, 4037],
    },
  },
  // The previous design, kept for reference while the revamp rolls out.
  "cloud-services": {
    route: "/services/cloud-services",
    render: "design-ref/renders/cloud-services.png",
    frameHeight: 11313,
    sections: {
      hero: [0, 530],
      intro: [661, 1197],
      difference: [1328, 2251],
      expertise: [2361, 2811],
      platforms: [2921, 3688],
      industries: [3688, 4884],
      capabilities: [4884, 6158],
      cases: [6267, 7011],
      ecosystem: [7168, 7910],
      quality: [7910, 8804],
      faq: [8804, 9673],
      // Group 21307 is the contact card AND the footer; our DOM splits them, so the band is split too.
      contact: [9779, 10509],
      footer: [10509, 11313],
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

// The finalised-design comparisons have their own evidence folder (brief of 23 November 2026).
const outDir = name.endsWith("-final")
  ? path.join("docs", "qa", "evidence", "cloud-final", name)
  : path.join("docs", "qa", "evidence", "inner-pages", "compare", name);
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
    // The November 2026 revamp frames are drawn at 1440; the approved v2 frames are 1920.
  const viewportWidth = page.width ?? 1920;
  // Reduced motion is the default because it freezes entrance animations and makes the shot repeatable. A page
  // whose design includes a marquee or a scroll-velocity row has to be captured WITHOUT it, or the static
  // fallback is what gets compared - which is a different layout. Those pages set reducedMotion: false.
  const ctx = await browser.newContext({
    viewport: { width: viewportWidth, height: 1080 },
    reducedMotion: page.reducedMotion === false ? "no-preference" : "reduce",
    deviceScaleFactor: 1,
  });
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
