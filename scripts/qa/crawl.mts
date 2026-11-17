/**
 * QA crawl (audit part 1): every sitemap URL plus the utility routes, in Chromium at 1280x800.
 * Per page: HTTP status, security headers, title/description/canonical/hreflang/OG, JSON-LD validity, H1 count and
 * heading order, landmarks, skip link, broken images and empty alt, external-link rel, console errors, content scans
 * (Middle East, Lorem, TBD, brackets, draft strings), duplicated paragraphs, region phone/email, horizontal overflow.
 * Then: every internal link found (status + hops), the redirect table (hops, final status), region routing on "/",
 * /ae/ 301, legacy cookie, and the security probes (revalidate, figma-fixture, unknown route, stack traces).
 *
 * Only this site is requested. Links to other sites (the product websites: solutions have no pages here since
 * 17 Nov 2026, and the social profiles) are reported through "external links with bad rel/target" only, so a slow
 * or failing third-party site can never fail the crawl.
 *
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/crawl.mts <baseUrl> <label>
 * Output: docs/qa/evidence/<label>/crawl.json and crawl.md
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "public";
const outDir = path.join("docs", "qa", "evidence", label);
fs.mkdirSync(outDir, { recursive: true });

const DRAFT_STRINGS = ["100% Satisfied", "Zero Risk", "30%", "500+", "Draft"];
const CONTENT_FLAGS: [string, RegExp][] = [
  ["Middle East", /Middle East/],
  ["Lorem", /Lorem/i],
  ["TBD", /\bTBD\b/],
  ["bracket placeholder", /\[[^\]]{2,60}\]/],
  ["to be confirmed", /to be confirmed/i],
  ["Whats's Next", /Whats's/],
];
const US_SPELLINGS = /\b(organization|organizations|optimize|optimized|optimization|modernization|customize|customized|color|colors|center|centers|analyze|analyzed|behavior|behaviors|catalog|program(?!me)s?|license(?!d)|favor|labor)\b/gi;
const REGION_CONTACT: Record<string, { phone: string; email: string }> = {
  "/in/": { phone: "+91-6296680677", email: "marketing@adamastech.in" },
  "/uk/": { phone: "+44 7768 706988", email: "marketing@adamastech.in" },
  "/gcc/": { phone: "+971 4 705 6001", email: "marketing@adamastech.in" },
};
const SECURITY_HEADERS = ["content-security-policy", "x-content-type-options", "referrer-policy", "x-frame-options", "strict-transport-security", "permissions-policy"];

interface PageResult {
  url: string;
  status: number | null;
  headers: Record<string, string | undefined>;
  title: string;
  description: string | null;
  canonical: string | null;
  hreflang: { lang: string; href: string }[];
  og: Record<string, string>;
  jsonLd: { ok: boolean; types: string[]; error?: string }[];
  h1Count: number;
  headingOrder: string[];
  headingSkips: string[];
  landmarks: Record<string, number>;
  skipLink: boolean;
  brokenImages: string[];
  emptyAltImages: number;
  imagesWithoutDimensions: number;
  externalLinksBadRel: string[];
  internalLinks: string[];
  consoleErrors: string[];
  consoleWarnings: string[];
  pageErrors: string[];
  contentFlags: Record<string, string[]>;
  draftStrings: Record<string, number>;
  usSpellings: string[];
  duplicateParagraphs: string[];
  regionContact?: { phoneOk: boolean; emailOk: boolean; foundPhones: string[]; foundEmails: string[] };
  overflowPx: number;
  textLength: number;
  domNodes: number;
}

/** fetch with three attempts (the dev laptop occasionally resets keep-alive sockets under load). */
async function rfetch(url: string, init?: RequestInit): Promise<Response> {
  let last: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch(url, { ...init, headers: { connection: "close", ...(init?.headers as Record<string, string> | undefined) } });
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw last;
}
async function fetchText(url: string) {
  const r = await rfetch(url, { redirect: "manual" });
  return { status: r.status, text: await r.text(), headers: r.headers };
}

async function followChain(url: string, max = 6) {
  const hops: { url: string; status: number; location?: string }[] = [];
  let current = url;
  for (let i = 0; i < max; i++) {
    const r = await rfetch(current, { redirect: "manual" });
    const loc = r.headers.get("location") ?? undefined;
    hops.push({ url: current, status: r.status, location: loc });
    if (r.status >= 300 && r.status < 400 && loc) {
      current = new URL(loc, current).toString();
    } else break;
  }
  return hops;
}

const sitemapRes = await fetchText(`${base}/sitemap.xml`);
const sitemapUrls = [...sitemapRes.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapOrigin = sitemapUrls[0] ? new URL(sitemapUrls[0]).origin : base;
const routes = Array.from(new Set(sitemapUrls.map((u) => u.replace(sitemapOrigin, "") || "/")));
// "/solutions" has no page any more: it is probed so the evidence records its 301 to the homepage section.
const extraRoutes = ["/search", "/thank-you", "/insights/events/house-of-lords-2026", "/solutions", "/no-such-page-qa", "/services/cloud-services/no-such-service", "/figma-fixture"];
for (const r of extraRoutes) if (!routes.includes(r)) routes.push(r);

const results: PageResult[] = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });

for (const route of routes) {
  const page = await ctx.newPage();
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
    if (m.type() === "warning") consoleWarnings.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 300)));
  let status: number | null = null;
  let headers: Record<string, string | undefined> = {};
  try {
    const resp = await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 60_000 });
    status = resp?.status() ?? null;
    const h = resp?.headers() ?? {};
    headers = Object.fromEntries(SECURITY_HEADERS.map((k) => [k, h[k]]));
    headers["x-powered-by"] = h["x-powered-by"];
    headers["cache-control"] = h["cache-control"];
    headers["x-robots-tag"] = h["x-robots-tag"];
    await page.waitForTimeout(1500);
    // Scroll through so lazy images load and every client component mounts.
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 700) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
  } catch (e) {
    pageErrors.push(`NAVIGATION FAILED: ${String(e).split("\n")[0]}`);
  }

  const data = (await page.evaluate(`(() => {
    const q = (s) => Array.from(document.querySelectorAll(s));
    const txt = document.body ? document.body.innerText : "";
    const meta = (n) => { const el = document.querySelector('meta[name="' + n + '"]'); return el ? el.getAttribute("content") : null; };
    const og = {};
    q('meta[property^="og:"], meta[name^="twitter:"]').forEach((m) => { og[m.getAttribute("property") || m.getAttribute("name")] = m.getAttribute("content") || ""; });
    const canon = document.querySelector('link[rel="canonical"]');
    const hreflang = q('link[rel="alternate"][hreflang]').map((l) => ({ lang: l.getAttribute("hreflang"), href: l.getAttribute("href") }));
    const jsonLd = q('script[type="application/ld+json"]').map((s) => {
      try { const j = JSON.parse(s.textContent || ""); const arr = Array.isArray(j) ? j : (j["@graph"] || [j]); return { ok: true, types: arr.map((x) => x["@type"]).flat() }; }
      catch (e) { return { ok: false, types: [], error: String(e) }; }
    });
    const headings = q("h1,h2,h3,h4,h5,h6").filter((h) => h.offsetParent !== null || getComputedStyle(h).position === "fixed");
    const headingOrder = headings.map((h) => h.tagName + ": " + (h.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 60));
    const skips = [];
    let prev = 0;
    for (const h of headings) { const lv = Number(h.tagName[1]); if (prev && lv > prev + 1) skips.push("H" + prev + " -> " + h.tagName + " (" + (h.textContent || "").trim().slice(0, 40) + ")"); prev = lv; }
    const landmarks = { main: q("main").length, header: q("header").length, footer: q("footer").length, nav: q("nav").length, h1: q("h1").length };
    const skipLink = !!document.querySelector('a[href="#main"], a[href="#content"]');
    const imgs = q("img");
    const brokenImages = imgs.filter((i) => i.complete && i.naturalWidth === 0 && !i.closest("noscript")).map((i) => (i.getAttribute("src") || "").slice(0, 120));
    const emptyAltImages = imgs.filter((i) => !i.hasAttribute("alt")).length;
    const imagesWithoutDimensions = imgs.filter((i) => !i.getAttribute("width") && !i.getAttribute("height") && getComputedStyle(i).position !== "absolute").length;
    const links = q("a[href]");
    const externalLinksBadRel = links.filter((a) => /^https?:/.test(a.getAttribute("href") || "") && !a.href.startsWith(location.origin)).filter((a) => a.target !== "_blank" || !/noopener/.test(a.rel)).map((a) => a.getAttribute("href") + " [target=" + a.target + " rel=" + a.rel + "]").slice(0, 30);
    const internal = Array.from(new Set(links.map((a) => a.getAttribute("href") || "").filter((h) => h.startsWith("/") && !h.startsWith("//")).map((h) => h.split("#")[0]).filter(Boolean)));
    const ps = q("p, li").map((p) => (p.textContent || "").trim().replace(/\\s+/g, " ")).filter((t) => t.length > 70);
    const seen = new Map(); const dups = [];
    for (const t of ps) { seen.set(t, (seen.get(t) || 0) + 1); }
    for (const [t, n] of seen) if (n > 1) dups.push(n + "x " + t.slice(0, 90));
    const phones = Array.from(new Set(q('a[href^="tel:"]').map((a) => (a.textContent || "").trim().replace(/^Call Us\\s*/, ""))));
    const emails = Array.from(new Set(q('a[href^="mailto:"]').map((a) => (a.textContent || "").trim())));
    const overflowPx = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return { title: document.title, description: meta("description"), canonical: canon ? canon.getAttribute("href") : null, hreflang, og, jsonLd, h1Count: landmarks.h1, headingOrder, headingSkips: skips, landmarks, skipLink, brokenImages, emptyAltImages, imagesWithoutDimensions, externalLinksBadRel, internalLinks: internal, duplicateParagraphs: dups, phones, emails, overflowPx, txt, domNodes: document.getElementsByTagName("*").length };
  })()`)) as Record<string, unknown>;

  const txt = (data.txt as string) ?? "";
  const contentFlags: Record<string, string[]> = {};
  for (const [name, re] of CONTENT_FLAGS) {
    const hits = [...txt.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))].map((m) => {
      const i = m.index ?? 0;
      return txt.slice(Math.max(0, i - 40), i + 60).replace(/\s+/g, " ");
    });
    if (hits.length) contentFlags[name] = hits.slice(0, 8);
  }
  const draftStrings: Record<string, number> = {};
  for (const s of DRAFT_STRINGS) {
    const n = txt.split(s).length - 1;
    if (n) draftStrings[s] = n;
  }
  const usSpellings = Array.from(new Set([...txt.matchAll(US_SPELLINGS)].map((m) => m[0]))).slice(0, 20);
  const phones = data.phones as string[];
  const emails = data.emails as string[];
  const expect = REGION_CONTACT[route];
  const regionContact = expect
    ? { phoneOk: phones.some((p) => p.replace(/\s|-/g, "") === expect.phone.replace(/\s|-/g, "")), emailOk: emails.includes(expect.email), foundPhones: phones, foundEmails: emails }
    : undefined;

  results.push({
    url: route,
    status,
    headers,
    title: data.title as string,
    description: data.description as string | null,
    canonical: data.canonical as string | null,
    hreflang: data.hreflang as PageResult["hreflang"],
    og: data.og as Record<string, string>,
    jsonLd: data.jsonLd as PageResult["jsonLd"],
    h1Count: data.h1Count as number,
    headingOrder: data.headingOrder as string[],
    headingSkips: data.headingSkips as string[],
    landmarks: data.landmarks as Record<string, number>,
    skipLink: data.skipLink as boolean,
    brokenImages: data.brokenImages as string[],
    emptyAltImages: data.emptyAltImages as number,
    imagesWithoutDimensions: data.imagesWithoutDimensions as number,
    externalLinksBadRel: data.externalLinksBadRel as string[],
    internalLinks: data.internalLinks as string[],
    consoleErrors,
    consoleWarnings,
    pageErrors,
    contentFlags,
    draftStrings,
    usSpellings,
    duplicateParagraphs: data.duplicateParagraphs as string[],
    regionContact,
    overflowPx: data.overflowPx as number,
    textLength: txt.length,
    domNodes: data.domNodes as number,
  });
  console.log(`${route}: ${status} h1=${data.h1Count} dom=${data.domNodes} errors=${consoleErrors.length + pageErrors.length} flags=${Object.keys(contentFlags).join(",") || "-"} drafts=${JSON.stringify(draftStrings)}`);
  await page.close();
}
await ctx.close();
await browser.close();

// ── Internal links: every href found on any page ─────────────────────────
const allLinks = Array.from(new Set(results.flatMap((r) => r.internalLinks)));
const linkResults: { href: string; hops: { url: string; status: number; location?: string }[] }[] = [];
for (const href of allLinks) {
  const hops = await followChain(`${base}${href}`);
  linkResults.push({ href, hops });
}
const badLinks = linkResults.filter((l) => {
  const last = l.hops[l.hops.length - 1];
  return last.status >= 400 || l.hops.length > 2;
});

// ── Redirect table ───────────────────────────────────────────────────────
const redirectTable = JSON.parse(fs.readFileSync("lib/generated/redirects.json", "utf8")) as Record<string, [string, number]>;
const redirectResults: { from: string; expectedTo: string; hops: { url: string; status: number; location?: string }[]; oneHop: boolean; final: number }[] = [];
for (const [from, [to]] of Object.entries(redirectTable)) {
  const hops = await followChain(`${base}${from}/`); // WordPress URLs carried a trailing slash
  const final = hops[hops.length - 1].status;
  // One hop = first response is a redirect to a URL that itself returns 200.
  const oneHop = hops.length === 2 && hops[1].status === 200;
  redirectResults.push({ from, expectedTo: to, hops, oneHop, final });
}
// Also the bare form without trailing slash for a sample.
const redirectNoSlash = await followChain(`${base}/about-us`);

// ── Region routing ───────────────────────────────────────────────────────
async function rootRedirect(headers: Record<string, string>) {
  const r = await rfetch(`${base}/`, { redirect: "manual", headers });
  return { status: r.status, location: r.headers.get("location"), vary: r.headers.get("vary"), cacheControl: r.headers.get("cache-control") };
}
const countries = ["IN", "GB", "IE", "AE", "SA", "QA", "KW", "BH", "OM", "US", "FR", "none"];
const regionRouting: Record<string, unknown> = {};
for (const c of countries) regionRouting[`country ${c}`] = await rootRedirect(c === "none" ? {} : { "x-vercel-ip-country": c });
regionRouting["cookie in + country GB"] = await rootRedirect({ cookie: "region=in", "x-vercel-ip-country": "GB" });
regionRouting["cookie gcc"] = await rootRedirect({ cookie: "region=gcc" });
regionRouting["legacy cookie ae"] = await rootRedirect({ cookie: "region=ae" });
regionRouting["bad cookie xx + country IN"] = await rootRedirect({ cookie: "region=xx", "x-vercel-ip-country": "IN" });
regionRouting["cloudfront header AE"] = await rootRedirect({ "cloudfront-viewer-country": "AE" });
regionRouting["query preserved"] = await rfetch(`${base}/?utm=1`, { redirect: "manual", headers: { "x-vercel-ip-country": "IN" } }).then((r) => ({ status: r.status, location: r.headers.get("location") }));
regionRouting["/ae/"] = await followChain(`${base}/ae/`);
regionRouting["/ae"] = await followChain(`${base}/ae`);
regionRouting["/ae/anything"] = await followChain(`${base}/ae/anything?x=1`);
regionRouting["/in (no slash)"] = await followChain(`${base}/in`);
regionRouting["/in/ (slash)"] = await followChain(`${base}/in/`);
regionRouting["/IN/ (upper)"] = await followChain(`${base}/IN/`);
regionRouting["/services/ (trailing slash)"] = await followChain(`${base}/services/`);
regionRouting["/contact/"] = await followChain(`${base}/contact/`);
regionRouting["/in/extra"] = await followChain(`${base}/in/extra`);
regionRouting["/xx/"] = await followChain(`${base}/xx/`);

// ── Security probes ─────────────────────────────────────────────────────
const security: Record<string, unknown> = {};
const headProbe = async (p: string, init?: RequestInit) => {
  let r: Response;
  try {
    r = await rfetch(`${base}${p}`, { redirect: "manual", ...init });
  } catch (e) {
    return { status: null, error: String(e).split("\n")[0] };
  }
  const h: Record<string, string | null> = {};
  for (const k of [...SECURITY_HEADERS, "x-powered-by", "www-authenticate", "content-type", "cache-control"]) h[k] = r.headers.get(k);
  const body = await r.text();
  return { status: r.status, headers: h, bodySnippet: body.slice(0, 200).replace(/\s+/g, " "), bodyLength: body.length, hasStack: /at .+\(.+:\d+:\d+\)|node_modules|\.js:\d+/.test(body) };
};
security["GET /in/"] = await headProbe("/in/");
security["GET /sitemap.xml"] = await headProbe("/sitemap.xml");
security["GET /robots.txt"] = await headProbe("/robots.txt");
security["GET /api/revalidate"] = await headProbe("/api/revalidate");
security["POST /api/revalidate (no secret)"] = await headProbe("/api/revalidate", { method: "POST", body: "{}", headers: { "content-type": "application/json" } });
security["POST /api/revalidate (wrong secret)"] = await headProbe("/api/revalidate", { method: "POST", body: "{}", headers: { "content-type": "application/json", "x-revalidate-secret": "wrong" } });
security["POST /api/revalidate (bad json, no secret)"] = await headProbe("/api/revalidate", { method: "POST", body: "{bad", headers: { "content-type": "application/json" } });
security["GET /figma-fixture"] = await headProbe("/figma-fixture");
security["GET /no-such-page-qa"] = await headProbe("/no-such-page-qa");
security["GET /services/no-such-pillar"] = await headProbe("/services/no-such-pillar");
security["GET /case-studies/%00"] = await headProbe("/case-studies/%00");
security["GET /insights/events/house-of-lords-2026/calendar"] = await headProbe("/insights/events/house-of-lords-2026/calendar");
security["GET /insights/events/nope/calendar"] = await headProbe("/insights/events/nope/calendar");
security["GET /_next/static probe"] = await (async () => {
  const html = (await fetchText(`${base}/in/`).catch(() => ({ text: "" }))).text;
  const m = html.match(/\/_next\/static\/[^"']+\.js/);
  return m ? { asset: m[0], ...(await headProbe(m[0])) } : { asset: null };
})();
security["GET /.env"] = await headProbe("/.env");
security["GET /prisma/schema.prisma"] = await headProbe("/prisma/schema.prisma");
security["GET /media/../package.json"] = await headProbe("/media/..%2Fpackage.json");
// Server action with garbage: POST to a page with Next-Action header set to a bogus id.
security["POST /contact bogus action"] = await headProbe("/contact", { method: "POST", headers: { "next-action": "0000000000000000000000000000000000000000", "content-type": "text/plain;charset=UTF-8" }, body: "[]" });
security["POST /in/ with form body (no action)"] = await headProbe("/in/", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "name=x" });

const out = { base, label, generatedAt: new Date().toISOString(), sitemap: { status: sitemapRes.status, count: sitemapUrls.length, origin: sitemapOrigin, urls: sitemapUrls }, robots: (await fetchText(`${base}/robots.txt`)).text, pages: results, links: linkResults, badLinks, redirects: redirectResults, redirectNoSlash, regionRouting, security };
fs.writeFileSync(path.join(outDir, "crawl.json"), JSON.stringify(out, null, 2));

// ── Markdown summary ─────────────────────────────────────────────────────
const md: string[] = [`# Crawl ${label} (${base}) ${out.generatedAt}`, "", `Sitemap: ${sitemapUrls.length} URLs (origin ${sitemapOrigin}), status ${sitemapRes.status}`, "", "## Pages", "", "| URL | Status | Title | Desc | Canonical | H1 | Skips | JSON-LD | Console err | Page err | Broken img | Flags | Drafts | Overflow | DOM |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
for (const r of results) {
  md.push(`| ${r.url} | ${r.status} | ${r.title.replace(/\|/g, "/").slice(0, 50)} | ${r.description ? "yes" : "NO"} | ${r.canonical ?? "NONE"} | ${r.h1Count} | ${r.headingSkips.length} | ${r.jsonLd.map((j) => (j.ok ? j.types.join("+") : "INVALID")).join(", ") || "none"} | ${r.consoleErrors.length} | ${r.pageErrors.length} | ${r.brokenImages.length} | ${Object.entries(r.contentFlags).map(([k, v]) => `${k}:${v.length}`).join(" ") || "-"} | ${Object.entries(r.draftStrings).map(([k, v]) => `${k}:${v}`).join(" ") || "-"} | ${r.overflowPx} | ${r.domNodes} |`);
}
md.push("", "## Pages: details", "");
for (const r of results) {
  md.push(`### ${r.url} (${r.status})`, "");
  md.push(`- title: ${r.title}`, `- description: ${r.description ?? "NONE"}`, `- canonical: ${r.canonical ?? "NONE"}`, `- hreflang: ${r.hreflang.map((h) => `${h.lang}=${h.href}`).join(", ") || "none"}`, `- og: ${Object.entries(r.og).map(([k, v]) => `${k}=${v.slice(0, 60)}`).join("; ") || "NONE"}`, `- JSON-LD: ${JSON.stringify(r.jsonLd)}`, `- landmarks: ${JSON.stringify(r.landmarks)}, skip link: ${r.skipLink}`, `- heading order: ${r.headingOrder.slice(0, 40).join(" | ")}`, `- heading skips: ${r.headingSkips.join("; ") || "none"}`, `- security headers: ${JSON.stringify(r.headers)}`, `- broken images: ${r.brokenImages.join(", ") || "none"}; img without alt attr: ${r.emptyAltImages}; img without dimensions: ${r.imagesWithoutDimensions}`, `- external links with bad rel/target: ${r.externalLinksBadRel.join("; ") || "none"}`, `- console errors: ${r.consoleErrors.join(" || ") || "none"}`, `- console warnings: ${r.consoleWarnings.slice(0, 5).join(" || ") || "none"}`, `- page errors: ${r.pageErrors.join(" || ") || "none"}`, `- content flags: ${JSON.stringify(r.contentFlags)}`, `- draft strings: ${JSON.stringify(r.draftStrings)}`, `- US spellings: ${r.usSpellings.join(", ") || "none"}`, `- duplicate paragraphs: ${r.duplicateParagraphs.join(" || ") || "none"}`, r.regionContact ? `- region contact: ${JSON.stringify(r.regionContact)}` : "", `- overflow: ${r.overflowPx}px; DOM nodes ${r.domNodes}`, "");
}
md.push("## Internal links with 4xx/5xx or more than one hop", "");
for (const l of badLinks) md.push(`- ${l.href}: ${l.hops.map((h) => `${h.status}${h.location ? " -> " + h.location : ""}`).join(" | ")}`);
if (!badLinks.length) md.push("none");
md.push("", `## Redirect table (${redirectResults.length} rows)`, "", "| From | Expected | Chain | One hop | Final |", "|---|---|---|---|---|");
for (const r of redirectResults) md.push(`| ${r.from} | ${r.expectedTo} | ${r.hops.map((h) => `${h.status}${h.location ? " -> " + h.location.replace(base, "") : ""}`).join(" ; ")} | ${r.oneHop ? "yes" : "NO"} | ${r.final} |`);
md.push("", `No-slash sample /about-us: ${JSON.stringify(redirectNoSlash)}`, "", "## Region routing", "");
for (const [k, v] of Object.entries(regionRouting)) md.push(`- ${k}: ${JSON.stringify(v).replace(new RegExp(base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "")}`);
md.push("", "## Security probes", "");
for (const [k, v] of Object.entries(security)) md.push(`- ${k}: ${JSON.stringify(v)}`);
md.push("", "## robots.txt", "", "```", out.robots.trim(), "```");
fs.writeFileSync(path.join(outDir, "crawl.md"), md.join("\n") + "\n");
console.log(`\nWrote ${path.join(outDir, "crawl.md")}; bad links ${badLinks.length}; redirects not one-hop ${redirectResults.filter((r) => !r.oneHop).length}`);
