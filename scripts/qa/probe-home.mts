/** Probes for the interaction failures: story clones, reveal + keyboard, autoplay, solutions/industries end states, no-JS hidden panel. */
import { chromium } from "playwright";
import fs from "node:fs";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const out = "docs/qa/evidence/drafts/interactions";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const log = (s: string) => console.log(s);

// 1. Story clones opacity after hydration (normal motion)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(500);
  await page.locator('[aria-label="Stories"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const clones = await page.evaluate(() => Array.from(document.querySelectorAll('[aria-label="Stories"] article')).map((a) => ({ clone: a.getAttribute("aria-hidden") === "true", opacity: getComputedStyle(a).opacity, revealed: a.hasAttribute("data-revealed"), inline: (a as HTMLElement).style.opacity })));
  log(`stories articles: ${JSON.stringify(clones)}`);
  await page.screenshot({ path: `${out}/probe-stories-clones.png` });
  // Scroll to the previous (clone) card and look
  await page.locator('button[aria-label="Previous stories"]').click();
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() => Array.from(document.querySelectorAll('[aria-label="Stories"] article')).map((a) => getComputedStyle(a).opacity));
  log(`stories opacities after prev: ${after.join(",")}`);
  await page.screenshot({ path: `${out}/probe-stories-after-prev.png` });

  // 2. Keyboard into unrevealed content: Tab many times with GSAP loaded, wait, measure opacity
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.mouse.move(600, 400); // wakes GSAP
  await page.waitForTimeout(2500);
  const stops: string[] = [];
  for (let i = 0; i < 90; i++) {
    await page.keyboard.press("Tab");
  }
  await page.waitForTimeout(1500);
  const deep = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    let e: HTMLElement | null = el;
    let min = 1;
    let culprit = "";
    while (e) {
      const o = parseFloat(getComputedStyle(e).opacity);
      if (o < min) {
        min = o;
        culprit = e.tagName + "." + String(e.className).split(" ").slice(0, 2).join(".") + (e.hasAttribute("data-reveal") ? "[data-reveal" + (e.hasAttribute("data-revealed") ? " revealed" : "") + " inline=" + e.style.opacity + "]" : "");
      }
      e = e.parentElement;
    }
    const r = el.getBoundingClientRect();
    return { active: el.tagName + " " + (el.innerText || el.getAttribute("aria-label") || "").slice(0, 30), minOpacity: min, culprit, top: Math.round(r.top), vh: innerHeight };
  });
  log(`after 90 tabs + 1.5s: ${JSON.stringify(deep)}`);
  stops.push(JSON.stringify(deep));
  await page.screenshot({ path: `${out}/probe-keyboard-deep.png` });

  // 3. Autoplay in isolation
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  await page.mouse.move(1400, 850);
  const counter = page.locator('[role="group"][aria-label="highlights controls"] p');
  const c0 = await counter.innerText();
  await page.waitForTimeout(8000);
  const c1 = await counter.innerText();
  log(`autoplay isolated: ${c0} -> ${c1} (pause aria-pressed=${await page.locator('button[aria-label*="highlights"][aria-pressed]').getAttribute("aria-pressed")})`);
  const progress = await page.locator('[role="group"][aria-label="highlights controls"] span.w-\\[34px\\] span').first().evaluate((s) => (s as HTMLElement).style.width).catch(() => "n/a");
  log(`progress bar width now: ${progress}`);

  // 4. Solutions: slow clicks to the end
  const sol = page.locator('[aria-label="Products and solutions"]');
  await sol.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const solCounter = page.locator('[role="group"][aria-label="solutions controls"] p');
  for (let i = 0; i < 12; i++) {
    await page.locator('button[aria-label="Next solutions"]').click();
    await page.waitForTimeout(700);
  }
  const solInfo = await sol.evaluate((el) => ({ scrollLeft: el.scrollLeft, max: el.scrollWidth - el.clientWidth, cards: el.children.length }));
  log(`solutions after 12 slow next clicks: ${await solCounter.innerText()} ${JSON.stringify(solInfo)}`);
  await page.screenshot({ path: `${out}/probe-solutions-end.png` });

  // 5. Industries: click the last side-menu item
  const ind = page.locator('nav[aria-label="Industries"] a');
  const n = await ind.count();
  await ind.nth(n - 1).scrollIntoViewIfNeeded();
  await ind.nth(n - 1).click();
  await page.waitForTimeout(1200);
  const current = await page.evaluate(() => Array.from(document.querySelectorAll('nav[aria-label="Industries"] a')).findIndex((a) => a.getAttribute("aria-current") === "true"));
  const rail = await page.locator('[aria-label="Industry details"]').evaluate((el) => ({ scrollLeft: el.scrollLeft, max: el.scrollWidth - el.clientWidth, cardW: (el.firstElementChild as HTMLElement).getBoundingClientRect().width }));
  log(`industries: clicked item ${n} of ${n}; aria-current on item ${current + 1}; rail ${JSON.stringify(rail)}; next disabled=${await page.locator('button[aria-label="Next industry"]').isDisabled()}`);
  await ind.nth(n - 2).click();
  await page.waitForTimeout(1200);
  const current2 = await page.evaluate(() => Array.from(document.querySelectorAll('nav[aria-label="Industries"] a')).findIndex((a) => a.getAttribute("aria-current") === "true"));
  log(`industries: clicked item ${n - 1}; aria-current on item ${current2 + 1}`);
  await page.screenshot({ path: `${out}/probe-industries-last.png` });

  // 6. Country select focus visibility
  await page.locator('[data-compare="contact"] form select[name="country"]').focus();
  const sel = await page.locator('[data-compare="contact"] form select[name="country"]').evaluate((el) => ({ opacity: getComputedStyle(el).opacity, outline: getComputedStyle(el).outlineStyle, focused: document.activeElement === el }));
  log(`country select focused: ${JSON.stringify(sel)} (opacity 0 means no visible focus indicator)`);
  await page.screenshot({ path: `${out}/probe-country-select-focus.png` });
  await ctx.close();
}

// 7. No-JS: which tab panel is hidden?
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const route of ["/uk/", "/services/cloud-services"]) {
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    const info = await page.evaluate(`(() => Array.from(document.querySelectorAll('[role="tabpanel"]')).map((p) => { const s = getComputedStyle(p); const r = p.getBoundingClientRect(); return { id: p.id, display: s.display, opacity: s.opacity, h: Math.round(r.height), cls: p.className, parent: p.parentElement.className.slice(0, 40) }; }))()`);
    log(`no-JS ${route} tabpanels: ${JSON.stringify(info)}`);
  }
  await ctx.close();
}
await browser.close();
