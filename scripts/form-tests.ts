/**
 * Page sanity (390/1440: horizontal overflow, h1 count, placeholder brackets, console errors) and form behaviour tests.
 * Usage: BASE=http://localhost:3100 tsx scripts/form-tests.ts [pages|forms|nojs|all]
 */
import { chromium, type Page } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const stamp = Date.now();
const log = (...a: unknown[]) => console.log(...a);

/** Scroll a control into view and let Lenis settle before clicking (Lenis smooths scrolls, so an instant click would land early). */
async function settleClick(p: Page, selector: string) {
  await p.locator(selector).first().evaluate((el) => el.scrollIntoView({ block: "center" }));
  await p.waitForTimeout(1200);
  await p.click(selector);
}

async function errorsOf(p: Page) {
  const errs: string[] = [];
  p.on("console", (m) => m.type() === "error" && !/vimeo|cloudflare/i.test(m.text()) && errs.push(m.text().slice(0, 400)));
  p.on("pageerror", (e) => errs.push("PAGEERR " + String(e).slice(0, 400)));
  return errs;
}

(async () => {
  const b = await chromium.launch();
  const mode = process.argv[2] ?? "all";

  // Overflow + console check on every page at 390 and 1440
  if (mode === "all" || mode === "pages") {
    for (const w of [390, 1440]) {
      for (const path of (process.env.PAGES ?? "/in/,/uk/,/ae/,/services,/services/ai-services,/services/ai-services/computer-vision,/solutions,/solutions/arivoo,/solutions/face-recognition,/solutions/ai-product-a,/case-studies,/case-studies/face-recognition,/insights,/insights/events,/insights/events/house-of-lords-2026,/insights/blog,/about,/about/team,/about/careers,/credentials,/contact,/search,/thank-you,/privacy-policy,/cookie-policy,/terms-of-use").split(",")) {
        const ctx = await b.newContext({ viewport: { width: w, height: 844 } });
        const p = await ctx.newPage();
        const errs = await errorsOf(p);
        await p.goto(BASE + path, { waitUntil: "networkidle", timeout: 120000 });
        await p.waitForTimeout(1500);
        const o = await p.evaluate(() => {
          const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
          const wide = [...document.querySelectorAll("main *")].filter((el) => el.getBoundingClientRect().right > cw + 1).slice(0, 5).map((el) => el.tagName + "." + String((el as HTMLElement).className).slice(0, 60));
          return { sw, cw, wide, h1: document.querySelectorAll("h1").length, brackets: /\[Placeholder\]/.test(document.body.innerText) };
        });
        log(`${path} @${w}: scrollW=${o.sw} clientW=${o.cw} h1=${o.h1} brackets=${o.brackets} errors=${errs.length}`, errs.join(" | "), o.sw > o.cw ? o.wide : "");
        await ctx.close();
      }
    }
  }

  if (mode === "all" || mode === "forms") {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errs = await errorsOf(p);
    const url = BASE + "/insights/events/house-of-lords-2026";
    await p.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    await p.waitForTimeout(1500);

    // 1. Invalid (empty)
    await settleClick(p, "text=Register my place");
    await p.waitForSelector("#reg-name-error", { timeout: 30000 });
    log("invalid:", await p.locator("#reg-status").innerText(), "| name aria-invalid:", await p.getAttribute("#reg-name", "aria-invalid"), "| describedby:", await p.getAttribute("#reg-name", "aria-describedby"), "| focused:", await p.evaluate(() => document.activeElement?.id));
    log("errors:", (await p.locator("[id$=-error]").allInnerTexts()).join(" / "));

    // 2. Bad email keeps values
    await p.fill("#reg-name", "Test Person");
    await p.fill("#reg-email", "not-an-email");
    await p.check("#reg-consent");
    await settleClick(p, "text=Register my place");
    await p.waitForTimeout(2500);
    log("bad email:", await p.locator("#reg-email-error").innerText().catch(() => "none"), "| name kept:", await p.inputValue("#reg-name"));

    // 3. Valid
    const email = `qa+${stamp}@example.com`;
    await p.fill("#reg-email", email);
    if (!(await p.isChecked("#reg-consent"))) await p.check("#reg-consent");
    await p.fill("#reg-company", "QA Ltd");
    await settleClick(p, "text=Register my place");
    await p.waitForSelector("text=You’re registered", { timeout: 30000 });
    log("valid: success panel shown for", email);

    // 4. Duplicate
    await p.goto(url, { waitUntil: "networkidle" });
    await p.fill("#reg-name", "Test Person");
    await p.fill("#reg-email", email.toUpperCase());
    await p.check("#reg-consent");
    await settleClick(p, "text=Register my place");
    await p.waitForTimeout(3000);
    log("duplicate:", await p.locator("#reg-status").innerText());

    // 5. Honeypot
    const hpEmail = `bot+${stamp}@example.com`;
    await p.goto(url, { waitUntil: "networkidle" });
    await p.fill("#reg-name", "Bot");
    await p.fill("#reg-email", hpEmail);
    await p.check("#reg-consent");
    await p.evaluate(() => ((document.querySelector('input[name="company_website"]') as HTMLInputElement).value = "http://spam"));
    await settleClick(p, "text=Register my place");
    await p.waitForTimeout(3000);
    log("honeypot shows success:", await p.locator("text=You’re registered").count());
    // Same email again without honeypot: should succeed (nothing was stored)
    await p.goto(url, { waitUntil: "networkidle" });
    await p.fill("#reg-name", "Bot Check");
    await p.fill("#reg-email", hpEmail);
    await p.check("#reg-consent");
    await settleClick(p, "text=Register my place");
    await p.waitForTimeout(3000);
    log("honeypot not stored (real submit succeeds):", await p.locator("text=You’re registered").count());

    // Newsletter on blog
    await p.goto(BASE + "/insights/blog", { waitUntil: "networkidle" });
    await settleClick(p, "button:has-text('Subscribe')");
    await p.waitForTimeout(2500);
    log("newsletter invalid:", (await p.locator("[id$=-error]").allInnerTexts()).join(" / "));
    const nEmail = `news+${stamp}@example.com`;
    await p.fill("input[name=email]", nEmail);
    await p.check("input[name=consent]");
    await settleClick(p, "button:has-text('Subscribe')");
    await p.waitForTimeout(3000);
    log("newsletter valid:", await p.locator("[role=status]").innerText().catch(() => "none"));
    await p.goto(BASE + "/insights/blog", { waitUntil: "networkidle" });
    await p.fill("input[name=email]", nEmail);
    await p.check("input[name=consent]");
    await settleClick(p, "button:has-text('Subscribe')");
    await p.waitForTimeout(3000);
    log("newsletter duplicate:", await p.locator("[role=status]").innerText().catch(() => "none"));
    log("console errors during forms:", errs.length, errs.join(" | "));
    await ctx.close();
  }

  // No-JS registration
  if (mode === "all" || mode === "contact") {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errs = await errorsOf(p);
    await p.goto(BASE + "/contact", { waitUntil: "networkidle", timeout: 120000 });
    await p.waitForTimeout(1500);
    await settleClick(p, "#contact-name >> xpath=ancestor::form >> button[type=submit]");
    await p.waitForTimeout(2500);
    log("contact invalid:", await p.locator("#contact-status").innerText(), "| name aria-invalid:", await p.getAttribute("#contact-name", "aria-invalid"));
    await p.fill("#contact-name", "Contact QA");
    await p.fill("#contact-email", `contact+${stamp}@example.com`);
    await p.fill("#contact-country", "United Kingdom");
    await p.fill("#contact-message", "Testing the contact form with JavaScript on.");
    await p.check("#contact-consent");
    await Promise.all([p.waitForURL(/thank-you/, { timeout: 30000 }).catch(() => null), settleClick(p, "#contact-name >> xpath=ancestor::form >> button[type=submit]")]);
    log("contact valid → ", p.url(), "| h1:", (await p.locator("h1").first().innerText()).trim());
    log("console errors during contact:", errs.length, errs.join(" | "));
    await ctx.close();
  }

  if (mode === "all" || mode === "nojs") {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(BASE + "/insights/events/house-of-lords-2026", { waitUntil: "load", timeout: 120000 });
    await settleClick(p, "text=Register my place");
    await p.waitForLoadState("load");
    log("nojs empty (native validation blocks submit?) url:", p.url());
    await p.fill("#reg-name", "No JS");
    await p.fill("#reg-email", `nojs+${stamp}@example.com`);
    await p.check("#reg-consent");
    await Promise.all([p.waitForNavigation({ timeout: 60000 }).catch(() => null), p.click("text=Register my place")]);
    log("nojs valid:", await p.locator("text=You’re registered").count());
    await ctx.close();
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
