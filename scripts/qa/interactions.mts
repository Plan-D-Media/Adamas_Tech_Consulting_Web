/**
 * QA interaction pass (audit part 3): mega menus (hover intent, click, tap, Esc, focus-out, single open, flicker),
 * mobile drawer (focus trap, Esc, scroll lock, accordions, close on navigation), region switcher (cookie, label,
 * phone), hero carousel (next/prev/loop/autoplay/pause/keyboard/rapid clicks), stories and solutions sliders,
 * services tabs, industries selector, skip link, tab order and focus visibility, reduced motion, 200% zoom,
 * no-JavaScript rendering, sticky-header anchor, service page tabs/accordion.
 *
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/interactions.mts <baseUrl> <label> [engine]
 * Output: docs/qa/evidence/<label>/interactions/{interactions.md, *.png}
 */
import { chromium, firefox, webkit, type Page, type BrowserContext } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "public";
const engineName = process.argv[4] ?? "chromium";
const outDir = path.join("docs", "qa", "evidence", label, "interactions");
fs.mkdirSync(outDir, { recursive: true });
const type = { chromium, firefox, webkit }[engineName as "chromium"] ?? chromium;

const lines: string[] = [`# Interactions ${label} ${engineName} (${base}) ${new Date().toISOString()}`, ""];
const log = (s: string) => {
  lines.push(s);
  console.log(s);
};
const check = (name: string, ok: boolean, detail = "") => log(`- ${ok ? "PASS" : "FAIL"}: ${name}${detail ? ` (${detail})` : ""}`);
const shot = (page: Page, name: string) => page.screenshot({ path: path.join(outDir, `${engineName}-${name}.png`) }).catch(() => {});

const browser = await type.launch();
const errors: string[] = [];
function wire(page: Page) {
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()} ${m.text().slice(0, 200)}`));
  page.on("pageerror", (e) => errors.push(`${page.url()} PAGEERR ${String(e).slice(0, 200)}`));
}
async function settle(page: Page) {
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
}
const expanded = (page: Page, key: string) => page.getAttribute(`button[data-menu-key="${key}"]`, "aria-expanded");
const openCount = (page: Page) => page.locator('button[data-menu-key][aria-expanded="true"]').count();

try {
  // ── 1. Mega menus at 1440 ─────────────────────────────────────────────
  {
    log("## Mega menus (1440x900, mouse)");
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await settle(page);
    const keys = await page.$$eval("button[data-menu-key]", (els) => els.map((e) => e.getAttribute("data-menu-key")!));
    check("four mega-menu triggers", keys.length === 4, keys.join(", "));
    const caseStudies = await page.locator('header nav[aria-label="Main"] a:visible', { hasText: "Case Studies" }).count();
    check("Case Studies is a plain link", caseStudies === 1, String(caseStudies));
    for (const key of keys) {
      const trigger = page.locator(`button[data-menu-key="${key}"]`);
      const box = (await trigger.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(60);
      const early = await expanded(page, key);
      await page.waitForTimeout(260);
      const late = await expanded(page, key);
      check(`${key}: hover intent (closed at 60ms, open by 320ms)`, early === "false" && late === "true", `${early} -> ${late}`);
      const panel = page.locator(`#${(await trigger.getAttribute("aria-controls"))!.replace(/([^\w-])/g, "\\$1")}`);
      check(`${key}: panel present and labelled`, (await panel.count()) === 1 && (await panel.getAttribute("aria-labelledby")) === (await trigger.getAttribute("id")));
      const links = await panel.locator("a").count();
      check(`${key}: panel has links`, links > 0, `${links} links`);
      await shot(page, `menu-${key.replace(/\W+/g, "-")}`);
      // Cross the 45px gap into the panel without closing.
      const pb = (await panel.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height + 20, { steps: 4 });
      await page.mouse.move(pb.x + 40, pb.y + 40, { steps: 6 });
      await page.waitForTimeout(260);
      check(`${key}: pointer crossing the gap keeps it open`, (await expanded(page, key)) === "true");
      // Leave: still open shortly after, closed after the 200ms close delay.
      await page.mouse.move(10, 600, { steps: 3 });
      await page.waitForTimeout(80);
      const soon = await expanded(page, key);
      await page.waitForTimeout(320);
      const after = await expanded(page, key);
      check(`${key}: close delay (open at 80ms, closed by 400ms)`, soon === "true" && after === "false", `${soon} -> ${after}`);
    }
    // Only one open at a time: hover A then quickly B.
    const a = page.locator(`button[data-menu-key="${keys[0]}"]`);
    const b = page.locator(`button[data-menu-key="${keys[1]}"]`);
    await a.hover();
    await page.waitForTimeout(300);
    await b.hover();
    await page.waitForTimeout(300);
    check("only one menu open after moving from one trigger to the next", (await openCount(page)) === 1 && (await expanded(page, keys[1])) === "true");
    // Flicker: sweep the pointer back and forth across the trigger row and sample.
    let toggles = 0;
    let last = await expanded(page, keys[1]);
    const bb = (await b.boundingBox())!;
    for (let i = 0; i < 20; i++) {
      await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height + (i % 2 ? 30 : -5), { steps: 2 });
      await page.waitForTimeout(25);
      const now = await expanded(page, keys[1]);
      if (now !== last) toggles++;
      last = now;
    }
    check("no flicker while the pointer crosses the trigger edge", toggles <= 1, `${toggles} state changes in 20 samples`);
    await page.mouse.move(10, 700);
    await page.waitForTimeout(400);
    // Click toggles.
    await a.click();
    await page.waitForTimeout(100);
    check("click opens immediately", (await expanded(page, keys[0])) === "true");
    await a.click();
    await page.waitForTimeout(100);
    check("second click closes", (await expanded(page, keys[0])) === "false");
    // Keyboard: Enter opens, Esc closes and returns focus.
    await a.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(150);
    check("Enter opens", (await expanded(page, keys[0])) === "true");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(80);
    const focusedInPanel = await page.evaluate(() => !!document.activeElement?.closest('[role="group"]'));
    check("Tab moves focus into the panel", focusedInPanel);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
    const focusBack = await page.evaluate((k) => document.activeElement?.getAttribute("data-menu-key") === k, keys[0]);
    check("Esc closes and returns focus to the trigger", (await expanded(page, keys[0])) === "false" && focusBack);
    await page.keyboard.press("Space");
    await page.waitForTimeout(150);
    check("Space opens", (await expanded(page, keys[0])) === "true");
    // Focus-out: Shift+Tab back out of the nav.
    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(80);
    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(200);
    check("menu closes when focus leaves the nav", (await openCount(page)) === 0, `active: ${await page.evaluate(() => document.activeElement?.tagName + " " + (document.activeElement as HTMLElement)?.innerText?.slice(0, 20))}`);
    // Tab all the way through an open panel: closes after the last link.
    await b.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(150);
    let steps = 0;
    while ((await openCount(page)) > 0 && steps < 80) {
      await page.keyboard.press("Tab");
      steps++;
      await page.waitForTimeout(15);
    }
    check("tabbing through the whole panel eventually closes it", (await openCount(page)) === 0, `${steps} tabs`);
    // External link rel inside menus.
    const ext = await page.$$eval('header nav a[target="_blank"]', (els) => els.map((e) => `${e.getAttribute("href")} rel=${e.getAttribute("rel")}`));
    check("external menu links have rel noopener", ext.every((e) => /noopener/.test(e)), ext.join("; ") || "none");
    // Insights featured card date
    await ctx.close();
  }

  // ── 2. Tap at 1280 (touch) ────────────────────────────────────────────
  {
    log(""); log("## Mega menus with touch (1280x800, hasTouch)");
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/uk/`, { waitUntil: "load" });
    await settle(page);
    const key = await page.getAttribute("button[data-menu-key]", "data-menu-key");
    await page.locator(`button[data-menu-key="${key}"]`).tap();
    await page.waitForTimeout(200);
    check("tap opens the menu", (await expanded(page, key!)) === "true");
    await page.locator(`button[data-menu-key="${key}"]`).tap();
    await page.waitForTimeout(200);
    check("second tap closes the menu", (await expanded(page, key!)) === "false");
    await ctx.close();
  }

  // ── 3. Mobile drawer at 390 ───────────────────────────────────────────
  {
    log(""); log("## Mobile drawer (390x844, touch)");
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engineName === "chromium" });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await settle(page);
    const summary = page.locator(".nav-drawer > summary");
    check("hamburger visible", await summary.isVisible());
    check("hamburger has an accessible name", !!(await summary.getAttribute("aria-label")));
    await summary.click();
    await page.waitForTimeout(300);
    const open = await page.evaluate(() => document.querySelector(".nav-drawer")?.hasAttribute("open"));
    check("drawer opens", !!open);
    await shot(page, "drawer-open");
    check("body scroll locked", (await page.evaluate(() => getComputedStyle(document.body).overflow)) === "hidden");
    const focusInside = await page.evaluate(() => !!document.activeElement?.closest("[data-drawer]"));
    check("focus moves into the drawer", focusInside);
    const regionLinks = await page.locator("[data-drawer] a[href^='/in/'], [data-drawer] a[href^='/uk/'], [data-drawer] a[href^='/gcc/']").count();
    check("drawer has the three region links", regionLinks === 3, String(regionLinks));
    check("drawer has the Talk to an expert button", (await page.locator("[data-drawer] a[href='/contact']").count()) >= 1);
    // Accordion
    const acc = page.locator("[data-drawer] details > summary").first();
    await acc.click();
    await page.waitForTimeout(200);
    check("accordion opens", await page.evaluate(() => !!document.querySelector("[data-drawer] details[open]")));
    const subLinks = await page.locator("[data-drawer] details[open] a").count();
    check("accordion shows links", subLinks > 0, `${subLinks}`);
    // Focus trap: tab 80 times, focus must stay in header/drawer.
    let escaped = 0;
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => !!document.activeElement?.closest(".nav-drawer"));
      if (!inside) escaped++;
    }
    check("focus trapped inside the drawer (80 tabs)", escaped === 0, `${escaped} escapes`);
    let escapedBack = 0;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Shift+Tab");
      const inside = await page.evaluate(() => !!document.activeElement?.closest(".nav-drawer"));
      if (!inside) escapedBack++;
    }
    check("focus trapped backwards (30 shift-tabs)", escapedBack === 0, `${escapedBack} escapes`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    check("Esc closes the drawer", !(await page.evaluate(() => document.querySelector(".nav-drawer")?.hasAttribute("open"))));
    check("Esc returns focus to the hamburger", !!(await page.evaluate(() => document.activeElement?.matches(".nav-drawer > summary"))));
    check("body scroll restored", (await page.evaluate(() => getComputedStyle(document.body).overflow)) !== "hidden");
    // Close on navigation
    await summary.click();
    await page.waitForTimeout(200);
    await page.locator("[data-drawer] a[href='/contact']").first().click();
    await page.waitForURL(/\/contact/, { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(600);
    check("drawer closes after navigating", !(await page.evaluate(() => document.querySelector(".nav-drawer")?.hasAttribute("open"))), page.url());
    check("body scroll restored after navigation", (await page.evaluate(() => getComputedStyle(document.body).overflow)) !== "hidden");
    // Region switcher in drawer
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await settle(page);
    await summary.click();
    await page.waitForTimeout(200);
    await page.locator("[data-drawer] a[href='/gcc/']").click();
    await page.waitForURL(/\/gcc\//, { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(500);
    const cookie = (await ctx.cookies()).find((c) => c.name === "region");
    check("drawer region link sets the cookie", cookie?.value === "gcc", JSON.stringify(cookie));
    await ctx.close();
  }

  // ── 4. Region switcher (desktop) ─────────────────────────────────────
  {
    log(""); log("## Region switcher (1440)");
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await settle(page);
    const sw = page.locator("header .region-switcher").first();
    const summary = sw.locator("summary");
    check("switcher labelled India on /in/", /India/.test((await summary.innerText()) ?? ""), await summary.innerText());
    check("top bar phone is the India number", /\+91/.test(await page.locator("header .topbar").first().innerText()));
    await summary.click();
    await page.waitForTimeout(150);
    check("switcher opens", await sw.locator("ul").isVisible());
    const order = await sw.locator("ul a").allInnerTexts();
    check("switcher order India, UK & Ireland, GCC", order.map((s) => s.trim()).join(" | ") === "India | UK & Ireland | GCC", order.join(" | "));
    check("no 'Middle East' in switcher", !order.some((s) => /Middle East/.test(s)));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    check("Esc closes the switcher", !(await sw.locator("ul").isVisible()));
    await summary.click();
    await page.mouse.click(700, 600);
    await page.waitForTimeout(100);
    check("outside click closes the switcher", !(await sw.locator("ul").isVisible()));
    await summary.click();
    const t0 = Date.now();
    await sw.locator("ul a[href='/uk/']").click();
    await page.waitForURL(/\/uk\//, { timeout: 20_000 });
    const dt = Date.now() - t0;
    await page.waitForTimeout(400);
    const cookie = (await ctx.cookies()).find((c) => c.name === "region");
    check("switching to UK sets region=uk cookie", cookie?.value === "uk", JSON.stringify({ ...cookie, expires: cookie?.expires }));
    check("switch is fast (client navigation)", dt < 2500, `${dt}ms`);
    check("switcher now labelled UK & Ireland", /UK/.test(await page.locator("header .region-switcher summary").first().innerText()));
    const dom = await page.evaluate(() => ({ headers: document.querySelectorAll("header").length, mains: document.querySelectorAll("main").length, h1: document.querySelectorAll("h1").length, mainIds: document.querySelectorAll("#main").length, firstMainVisible: (() => { const m = document.getElementById("main"); return !!m && m.getBoundingClientRect().height > 0; })() }));
    check("after the region switch the DOM holds one header, one main and one h1", dom.headers === 1 && dom.mains === 1 && dom.h1 === 1, JSON.stringify(dom));
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    const skipOk = await page.evaluate(() => { const el = document.activeElement as HTMLElement | null; return !!el && el.id === "main" && el.getBoundingClientRect().height > 0; });
    check("skip link still reaches the visible main after a client-side region switch", skipOk);
    check("top bar phone changed to the UK number", /\+44/.test(await page.locator("header .topbar").first().innerText()), await page.locator("header .topbar").first().innerText());
    check("h1 lang attribute follows the region", (await page.getAttribute("main > div > div[lang], main [lang]", "lang")) === "en-GB", String(await page.getAttribute("main [lang]", "lang")));
    // Cookie drives / afterwards
    const r = await page.request.get(`${base}/`, { maxRedirects: 0 });
    check("bare / now redirects to /uk/ from the cookie", r.status() === 307 && /\/uk\/$/.test(r.headers()["location"] ?? ""), `${r.status()} ${r.headers()["location"]}`);
    // Inner page: logo and switcher reflect the cookie after hydration
    await page.goto(`${base}/about`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const logoHref = await page.getAttribute("header a[aria-label*='homepage']", "href");
    check("logo on an inner page links to the cookie region", logoHref === "/uk/", String(logoHref));
    check("inner page switcher labelled UK & Ireland", /UK/.test(await page.locator("header .region-switcher summary").first().innerText()));
    // Footer switcher
    const fsw = page.locator("footer .region-switcher");
    await fsw.locator("summary").scrollIntoViewIfNeeded();
    await fsw.locator("summary").click();
    await page.waitForTimeout(150);
    check("footer switcher opens", await fsw.locator("ul").isVisible());
    await fsw.locator("ul a[href='/gcc/']").click();
    await page.waitForURL(/\/gcc\//, { timeout: 20_000 });
    check("footer switcher navigates to /gcc/", /\/gcc\//.test(page.url()));
    check("GCC label never says Middle East", !/Middle East/.test(await page.content()));
    await ctx.close();
  }

  // ── 5. Hero carousel, sliders, tabs, industries ───────────────────────
  {
    log(""); log("## Homepage components (1440, mouse)");
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await settle(page);
    const hero = page.locator('[role="region"][aria-roledescription="carousel"]');
    const counter = page.locator('[role="group"][aria-label="highlights controls"] p');
    const slides = await hero.locator('[role="group"][aria-roledescription="slide"]').count();
    check("hero carousel has slides", slides > 0, `${slides}`);
    const text0 = await counter.innerText();
    await page.locator('button[aria-label="Next highlights"]').click();
    await page.waitForTimeout(700);
    const text1 = await counter.innerText();
    check("hero next advances the counter", text0 !== text1, `${text0} -> ${text1}`);
    await page.locator('button[aria-label="Previous highlights"]').click();
    await page.waitForTimeout(700);
    check("hero prev returns", (await counter.innerText()) === text0);
    await page.locator('button[aria-label="Previous highlights"]').click();
    await page.waitForTimeout(700);
    check("hero prev from first wraps to last", (await counter.innerText()).startsWith(String(slides).padStart(2, "0")), await counter.innerText());
    for (let i = 0; i < 12; i++) await page.locator('button[aria-label="Next highlights"]').click({ delay: 10 });
    await page.waitForTimeout(900);
    const afterRapid = await counter.innerText();
    check("hero survives 12 rapid clicks (counter valid)", /^0[1-9] \/ 0\d$/.test(afterRapid.trim()), afterRapid);
    // keyboard
    await hero.focus();
    const before = await counter.innerText();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(700);
    check("hero ArrowRight advances", (await counter.innerText()) !== before);
    // Autoplay: move the mouse away (hover pauses), wait 7.6s
    await page.mouse.move(5, 5);
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    const pauseBtn = page.locator('button[aria-label^="Pause highlights"], button[aria-label^="Play highlights"]');
    check("hero has a pause control", (await pauseBtn.count()) === 1);
    const idx0 = await counter.innerText();
    await page.waitForTimeout(7800);
    const idx1 = await counter.innerText();
    check("hero auto-advances within 7.8s", idx0 !== idx1, `${idx0} -> ${idx1}`);
    await pauseBtn.click();
    await page.mouse.move(5, 5);
    const idx2 = await counter.innerText();
    await page.waitForTimeout(7800);
    check("pause stops the auto-advance", (await counter.innerText()) === idx2 && (await pauseBtn.getAttribute("aria-pressed")) === "true");
    await pauseBtn.click();
    // Progress bar count = slides
    check("progress bars match slide count", (await page.locator('[role="group"][aria-label="highlights controls"] span.w-\\[34px\\]').count()) === slides);

    // Top stories
    const stories = page.locator('[aria-label="Stories"]');
    await stories.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const sCounter = page.locator('[role="group"][aria-label="stories controls"] p');
    const s0 = await sCounter.innerText();
    await page.locator('button[aria-label="Next stories"]').click();
    await page.waitForTimeout(800);
    check("stories next advances", (await sCounter.innerText()) !== s0, `${s0} -> ${await sCounter.innerText()}`);
    const total = Number(s0.split("/")[1]);
    for (let i = 0; i < total + 2; i++) {
      await page.locator('button[aria-label="Next stories"]').click();
      await page.waitForTimeout(650);
    }
    check("stories loop past the last slide without breaking", /^0\d \/ 0\d$/.test((await sCounter.innerText()).trim()), await sCounter.innerText());
    for (let i = 0; i < 8; i++) await page.locator('button[aria-label="Previous stories"]').click({ delay: 5 });
    await page.waitForTimeout(900);
    check("stories survive rapid prev clicks", /^0\d \/ 0\d$/.test((await sCounter.innerText()).trim()), await sCounter.innerText());
    const clones = await stories.locator("article[aria-hidden='true']").count();
    check("story clones are aria-hidden and unfocusable", clones === 2 && (await stories.locator("article[aria-hidden='true'] a[tabindex='-1']").count()) === 2, `${clones} clones`);
    // Swipe via wheel on the track
    const sb = (await stories.boundingBox())!;
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2);
    await page.mouse.wheel(600, 0);
    await page.waitForTimeout(900);
    log(`- INFO: stories after horizontal wheel: ${await sCounter.innerText()}`);

    // Solutions
    const sol = page.locator('[aria-label="Products and solutions"]');
    await sol.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const solCounter = page.locator('[role="group"][aria-label="solutions controls"] p');
    const so0 = await solCounter.innerText();
    await page.locator('button[aria-label="Next solutions"]').click();
    await page.waitForTimeout(800);
    check("solutions next advances", (await solCounter.innerText()) !== so0, `${so0} -> ${await solCounter.innerText()}`);
    for (let i = 0; i < 15; i++) await page.locator('button[aria-label="Next solutions"]').click({ delay: 5 });
    await page.waitForTimeout(900);
    const soEnd = await solCounter.innerText();
    check("solutions stop at the last card", soEnd.replace(/\s/g, "").split("/")[0] === soEnd.replace(/\s/g, "").split("/")[1], soEnd);
    for (let i = 0; i < 15; i++) await page.locator('button[aria-label="Previous solutions"]').click({ delay: 5 });
    await page.waitForTimeout(900);
    check("solutions return to the first card", (await solCounter.innerText()).trim().startsWith("01"), await solCounter.innerText());
    const solCards = await sol.locator("article").count();
    const solExt = await sol.locator('article a[target="_blank"]').evaluateAll((els) => els.every((e) => /noopener/.test(e.getAttribute("rel") ?? "")));
    check("solution external links have noopener", solExt, `${solCards} cards`);

    // Services tabs
    const tabs = page.locator('[role="tablist"][aria-label="Service pillars"] [role="tab"]');
    await tabs.first().scrollIntoViewIfNeeded();
    const tabCount = await tabs.count();
    check("three service tabs", tabCount === 3, `${tabCount}`);
    await tabs.nth(1).click();
    await page.waitForTimeout(400);
    check("clicking tab 2 selects it", (await tabs.nth(1).getAttribute("aria-selected")) === "true");
    const visiblePanels = await page.locator('[data-tabs] [role="tabpanel"]:visible').count();
    check("exactly one visible service panel", visiblePanels === 1, `${visiblePanels}`);
    const panelLabel = await page.locator('[data-tabs] [role="tabpanel"]:visible').getAttribute("aria-labelledby");
    check("visible panel is labelled by the selected tab", panelLabel === (await tabs.nth(1).getAttribute("id")));
    await tabs.nth(1).focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    check("ArrowRight moves to tab 3", (await tabs.nth(2).getAttribute("aria-selected")) === "true");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    check("ArrowRight wraps to tab 1", (await tabs.nth(0).getAttribute("aria-selected")) === "true");
    await page.keyboard.press("End");
    await page.waitForTimeout(300);
    check("End selects the last tab", (await tabs.nth(2).getAttribute("aria-selected")) === "true");
    const tabImgOk = await page.locator('[data-tabs] [role="tabpanel"]:visible img').first().evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0).catch(() => false);
    check("active tab panel image loaded", tabImgOk);

    // Industries
    const ind = page.locator('nav[aria-label="Industries"] a');
    await ind.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const indCount = await ind.count();
    check("industries side menu populated", indCount >= 7, `${indCount}`);
    await ind.nth(3).click();
    await page.waitForTimeout(800);
    check("side menu selects industry 4", (await ind.nth(3).getAttribute("aria-current")) === "true");
    const url = page.url();
    check("industry click does not change the URL hash", !url.includes("#"), url);
    const trackLeft = await page.locator('[aria-label="Industry details"]').evaluate((el) => el.scrollLeft);
    check("industry rail scrolled to the selected card", trackLeft > 100, `${trackLeft}px`);
    await page.locator('button[aria-label="Next industry"]').click();
    await page.waitForTimeout(700);
    check("industry next moves selection to 5", (await ind.nth(4).getAttribute("aria-current")) === "true");
    for (let i = 0; i < indCount + 3; i++) await page.locator('button[aria-label="Next industry"]').click({ delay: 5, force: true }).catch(() => {});
    await page.waitForTimeout(900);
    check("industry next disabled at the end", await page.locator('button[aria-label="Next industry"]').isDisabled());
    check("industry last item selected", (await ind.nth(indCount - 1).getAttribute("aria-current")) === "true");
    for (let i = 0; i < indCount + 3; i++) await page.locator('button[aria-label="Previous industry"]').click({ delay: 5, force: true }).catch(() => {});
    await page.waitForTimeout(900);
    check("industry prev disabled at the start", await page.locator('button[aria-label="Previous industry"]').isDisabled());
    const exploreHrefs = await page.locator('[aria-label="Industry details"] a').evaluateAll((els) => Array.from(new Set(els.map((e) => e.getAttribute("href")))));
    log(`- INFO: Explore Industry targets: ${exploreHrefs.join(", ")}`);

    // Difference diagram + map present
    check("Why Adamas diagram renders six cards", (await page.locator('[data-compare="difference"] li, [data-compare="difference"] article').count()) >= 6, String(await page.locator('[data-compare="difference"] li, [data-compare="difference"] article').count()));
    const mapBg = await page.locator('[data-compare="presence"] > div').first().evaluate((el) => getComputedStyle(el).backgroundImage);
    const mapOk = /presence-map/.test(mapBg) && (await page.evaluate(async (bg) => { const m = /url("?([^")]+)"?)/.exec(bg); if (!m) return false; const r = await fetch(m[1]); return r.ok; }, mapBg));
    check("presence map artwork loads (CSS background)", mapOk, mapBg.slice(0, 80));
    const nearest = await page.locator('[data-compare="presence"]').innerText();
    check("India homepage highlights the nearest office", /nearest office/i.test(nearest), nearest.match(/[^\n]*nearest office[^\n]*/i)?.[0]);
    await ctx.close();
  }

  // ── 6. Touch: sliders, tabs, industries, diagram at 390 ───────────────
  {
    log(""); log("## Touch screen components (390x844)");
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engineName === "chromium" });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/gcc/`, { waitUntil: "load" });
    await settle(page);
    const hero = page.locator('[role="region"][aria-roledescription="carousel"]');
    const hb = (await hero.boundingBox())!;
    const counter = page.locator('[role="group"][aria-label="highlights controls"] p');
    const c0 = await counter.innerText();
    // swipe left
    await page.touchscreen.tap(hb.x + hb.width - 10, hb.y + 100).catch(() => {});
    await page.evaluate(() => {
      const el = document.querySelector('[role="region"][aria-roledescription="carousel"]') as HTMLElement;
      el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    });
    await page.waitForTimeout(900);
    check("hero track scroll (swipe) updates the counter", (await counter.innerText()) !== c0, `${c0} -> ${await counter.innerText()}`);
    const tabs = page.locator('[role="tablist"][aria-label="Service pillars"] [role="tab"]');
    await tabs.nth(2).scrollIntoViewIfNeeded();
    await tabs.nth(2).tap();
    await page.waitForTimeout(400);
    check("tap selects service tab 3", (await tabs.nth(2).getAttribute("aria-selected")) === "true");
    const ind = page.locator('nav[aria-label="Industries"] a');
    await ind.nth(2).scrollIntoViewIfNeeded();
    await ind.nth(2).tap();
    await page.waitForTimeout(800);
    check("tap selects industry 3 on touch", (await ind.nth(2).getAttribute("aria-current")) === "true");
    const indTrack = page.locator('[aria-label="Industry details"]');
    await indTrack.evaluate((el) => el.scrollBy({ left: el.clientWidth, behavior: "smooth" }));
    await page.waitForTimeout(900);
    check("industry rail swipe updates the side menu", (await ind.nth(3).getAttribute("aria-current")) === "true");
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check("no horizontal page overflow after interactions at 390", ov <= 0, `${ov}px`);
    const switcherVisible = await page.locator("header .region-switcher summary").isVisible();
    log(`- INFO: header region switcher visible at 390: ${switcherVisible} (expected hidden; lives in the drawer)`);
    const ctaVisible = await page.locator("header a[href='/contact']").first().isVisible().catch(() => false);
    log(`- INFO: header CTA visible at 390: ${ctaVisible} (design note: moves into the drawer under 640px)`);
    await shot(page, "gcc-390-top");
    await ctx.close();
  }

  // ── 7. Keyboard: skip link, tab order, focus visibility ───────────────
  {
    log(""); log("## Keyboard pass (1280)");
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/services/cloud-services`, { waitUntil: "load" });
    await settle(page);
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => ({ text: (document.activeElement as HTMLElement)?.innerText, href: document.activeElement?.getAttribute("href"), visible: (() => { const r = document.activeElement!.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top >= 0; })() }));
    check("first Tab lands on the skip link and it becomes visible", first.href === "#main" && first.visible, JSON.stringify(first));
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    const onMain = await page.evaluate(() => document.activeElement?.id === "main" || location.hash === "#main");
    check("skip link moves focus to main", onMain);
    // Tab order through the header
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await settle(page);
    const order: string[] = [];
    let noRing = 0;
    const noRingList: string[] = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return { d: "BODY", ring: true };
        const s = getComputedStyle(el);
        const ring = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
        const r = el.getBoundingClientRect();
        return { d: `${el.tagName.toLowerCase()}${el.getAttribute("aria-label") ? "[" + el.getAttribute("aria-label") + "]" : ""} "${(el.innerText || el.getAttribute("alt") || "").trim().replace(/\s+/g, " ").slice(0, 28)}"`, ring, hidden: r.width === 0 || r.height === 0 || s.visibility === "hidden" || parseFloat(s.opacity) === 0 };
      });
      order.push(info.d + (info.hidden ? " (HIDDEN!)" : ""));
      if (!info.ring && info.d !== "BODY") {
        noRing++;
        noRingList.push(info.d);
      }
    }
    log(`- INFO: first 40 tab stops: ${order.join(" -> ")}`);
    check("every tab stop shows a focus indicator (outline or box-shadow)", noRing === 0, noRingList.join("; "));
    check("no tab stop is invisible", !order.some((o) => o.includes("HIDDEN!")));
    // Is the hidden pre-reveal state blocking focus? Reload without forcing reveals and tab deep.
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await page.waitForTimeout(500);
    let invisibleFocus = 0;
    for (let i = 0; i < 120; i++) {
      await page.keyboard.press("Tab");
      const op = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return 1;
        let e: HTMLElement | null = el;
        let min = 1;
        while (e) {
          min = Math.min(min, parseFloat(getComputedStyle(e).opacity));
          e = e.parentElement;
        }
        return min;
      });
      if (op < 0.1) invisibleFocus++;
    }
    check("tabbing never lands on an element hidden by the reveal pre-state (120 tabs)", invisibleFocus === 0, `${invisibleFocus} invisible stops`);
    // Focus traps: Tab 300 times from the top, we must reach the footer.
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await settle(page);
    let reachedFooter = false;
    for (let i = 0; i < 300 && !reachedFooter; i++) {
      await page.keyboard.press("Tab");
      reachedFooter = await page.evaluate(() => !!document.activeElement?.closest("footer"));
    }
    check("no focus trap: tabbing reaches the footer", reachedFooter);
    await ctx.close();
  }

  // ── 8. Reduced motion and zoom ────────────────────────────────────────
  {
    log(""); log("## prefers-reduced-motion and 200% zoom");
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/in/`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const hiddenReveals = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter((el) => parseFloat(getComputedStyle(el).opacity) < 1).length);
    check("reduced motion: no element left hidden by the reveal", hiddenReveals === 0, `${hiddenReveals}`);
    const marquee = await page.evaluate(() => { const t = document.querySelector(".marquee-track"); return t ? getComputedStyle(t).animationPlayState + "/" + getComputedStyle(t).animationName : "none"; });
    check("reduced motion: partner marquee not animating", /paused|none/.test(marquee), marquee);
    const pulse = await page.evaluate(() => { const t = document.querySelector(".difference-pulse, .difference-ring"); return t ? getComputedStyle(t).animationName + "/" + getComputedStyle(t).animationPlayState : "none"; });
    check("reduced motion: diagram pulse off", /none|paused/.test(pulse), pulse);
    const counter = page.locator('[role="group"][aria-label="highlights controls"] p');
    const c0 = await counter.innerText();
    await page.mouse.move(2, 2);
    await page.waitForTimeout(8000);
    check("reduced motion: hero does not auto-advance", (await counter.innerText()) === c0);
    const pauseState = await page.locator('button[aria-label^="Pause highlights"], button[aria-label^="Play highlights"]').count();
    log(`- INFO: pause control rendered under reduced motion: ${pauseState}`);
    await ctx.close();
    // 200% zoom = 1280 window at 2x -> 640 CSS px wide
    const zctx = await browser.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
    const zp = await zctx.newPage();
    wire(zp);
    for (const route of ["/in/", "/services/cloud-services", "/insights/events/house-of-lords-2026"]) {
      await zp.goto(`${base}${route}`, { waitUntil: "load" });
      await zp.waitForTimeout(800);
      await zp.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
      const ov = await zp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`200% zoom ${route}: no horizontal overflow`, ov <= 0, `${ov}px`);
    }
    await shot(zp, "zoom-200-event");
    await zctx.close();
  }

  // ── 9. Sticky header and anchors; service page tabs and accordion ─────
  {
    log(""); log("## Service page: sticky header anchor, tabs, accordion, FAQ");
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    wire(page);
    await page.goto(`${base}/services/cloud-services#capabilities`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const pos = await page.evaluate(() => {
      const t = document.getElementById("capabilities");
      const h = document.querySelector("header");
      return { top: t?.getBoundingClientRect().top ?? -1, headerBottom: h?.getBoundingClientRect().bottom ?? 0, scrollY: window.scrollY };
    });
    check("#capabilities anchor is not hidden under the sticky header", pos.top >= pos.headerBottom - 2, JSON.stringify(pos));
    const tabs = page.locator('[role="tablist"][aria-label="Services"] [role="tab"]');
    const n = await tabs.count();
    check("capabilities tabs present", n > 1, `${n}`);
    await tabs.nth(1).click();
    await page.waitForTimeout(300);
    check("capabilities tab 2 selected", (await tabs.nth(1).getAttribute("aria-selected")) === "true");
    check("exactly one capabilities panel visible", (await page.locator('#capabilities [role="tabpanel"]:visible').count()) === 1);
    await tabs.nth(1).focus();
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(200);
    check("ArrowDown moves to tab 3", (await tabs.nth(2).getAttribute("aria-selected")) === "true");
    const details = page.locator('details[name="service-platforms"]');
    const dn = await details.count();
    check("platform accordion present, first open", dn > 1 && (await details.first().getAttribute("open")) !== null, `${dn}`);
    await details.nth(1).locator("summary").click();
    await page.waitForTimeout(300);
    const openCount = await page.locator('details[name="service-platforms"][open]').count();
    check("accordion keeps one row open (name attribute)", openCount === 1, `${openCount} open`);
    const faq = page.locator('[data-compare="faq"] details');
    check("FAQ rows present", (await faq.count()) > 0, `${await faq.count()}`);
    await faq.nth(1).locator("summary").click();
    await page.waitForTimeout(200);
    check("FAQ row 2 opens", (await faq.nth(1).getAttribute("open")) !== null);
    const sticky = await page.evaluate(() => { window.scrollTo(0, 600); return new Promise<{ pos: string; scrolled: boolean }>((r) => setTimeout(() => { const h = document.querySelector("header")!; r({ pos: getComputedStyle(h).position, scrolled: h.hasAttribute("data-scrolled") }); }, 300)); });
    check("header is sticky and marks the scrolled state", sticky.pos === "sticky" && sticky.scrolled, JSON.stringify(sticky));
    await shot(page, "cloud-sticky-scrolled");
    await ctx.close();
  }

  // ── 10. No JavaScript ─────────────────────────────────────────────────
  {
    log("");
    log("## No JavaScript (1440)");
    const ctx: BrowserContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    for (const route of ["/in/", "/uk/", "/gcc/", "/services/cloud-services", "/services/cloud-services/migration-modernization", "/insights/events/house-of-lords-2026", "/about", "/case-studies"]) {
      await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 60_000 });
      const r = (await page.evaluate(`(() => {
        const visible = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity) > 0 && b.height > 0; };
        const sections = Array.from(document.querySelectorAll("[data-compare]"));
        const hiddenSections = sections.filter((s) => !visible(s)).map((s) => s.dataset.compare);
        const hiddenReveals = Array.from(document.querySelectorAll("[data-reveal]")).filter((el) => !visible(el)).length;
        const tabPanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
        const hiddenPanels = tabPanels.filter((p) => !visible(p)).length;
        const navLinks = document.querySelectorAll("header nav a[href]").length;
        const forms = document.querySelectorAll("form").length;
        const h1 = document.querySelectorAll("h1").length;
        const text = document.body.innerText.length;
        return { sections: sections.length, hiddenSections, hiddenReveals, tabPanels: tabPanels.length, hiddenPanels, navLinks, forms, h1, text };
      })()`)) as Record<string, unknown>;
      const ok = (r.hiddenSections as string[]).length === 0 && r.hiddenReveals === 0 && r.hiddenPanels === 0 && (r.text as number) > 500;
      check(`no-JS ${route}: all content visible`, ok, JSON.stringify(r));
    }
    // Drawer and switcher without JS at 390
    const m = await ctx.newPage();
    await m.setViewportSize({ width: 390, height: 844 });
    await m.goto(`${base}/in/`, { waitUntil: "load" });
    await m.locator(".nav-drawer > summary").click();
    await m.waitForTimeout(200);
    check("no-JS: drawer opens (details)", !!(await m.evaluate(() => document.querySelector(".nav-drawer")?.hasAttribute("open"))));
    const links = await m.locator("[data-drawer] a[href]").count();
    check("no-JS: drawer links present", links > 10, `${links}`);
    await m.locator("[data-drawer] details > summary").first().click();
    await m.waitForTimeout(200);
    check("no-JS: drawer accordion opens", await m.evaluate(() => !!document.querySelector("[data-drawer] details[open]")));
    await shot(m, "nojs-drawer-390");
    const d = await ctx.newPage();
    await d.setViewportSize({ width: 1440, height: 900 });
    await d.goto(`${base}/in/`, { waitUntil: "load" });
    await d.locator("header .region-switcher summary").first().click();
    await d.waitForTimeout(200);
    check("no-JS: region switcher opens", await d.locator("header .region-switcher ul").first().isVisible());
    await d.locator("header .region-switcher ul a[href='/uk/']").first().click();
    await d.waitForURL(/\/uk\//, { timeout: 20_000 });
    check("no-JS: region switch navigates", /\/uk\//.test(d.url()));
    check("no-JS: UK page shows the UK phone", /\+44/.test(await d.locator(".topbar").innerText()));
    const megaNoJs = await d.locator("header nav[aria-label='Main'] a[href]").count();
    log(`- INFO: no-JS header nav links reachable without the mega menu: ${megaNoJs} (menus need JS; the drawer and footer carry the full tree)`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

lines.push("", "## Console errors during the pass", "", ...(errors.length ? errors.map((e) => `- ${e}`) : ["none"]));
fs.writeFileSync(path.join(outDir, `interactions-${engineName}.md`), lines.join("\n") + "\n");
console.log(`\nWrote ${path.join(outDir, `interactions-${engineName}.md`)}; FAIL count ${lines.filter((l) => l.startsWith("- FAIL")).length}`);
