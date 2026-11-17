/**
 * QA forms pass (audit part 4): homepage contact form and event registration.
 * Validation, phone selector, consent, honeypot, double submit, duplicate registration, Unicode and HTML input,
 * very long input, no-JavaScript submission, database rows (local PostgreSQL via Prisma), closed registration,
 * the .ics file, and finally the rate limit (last, because it blocks further submissions for 10 minutes).
 * Test rows are tagged with "qa-audit" in the email so they can be identified; they are removed at the end.
 *
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 npx tsx scripts/qa/forms.mts <baseUrl> <label>
 * Output: docs/qa/evidence/<label>/forms/forms.md and screenshots
 */
import { chromium, type Page } from "playwright";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const label = process.argv[3] ?? "public";
const outDir = path.join("docs", "qa", "evidence", label, "forms");
fs.mkdirSync(outDir, { recursive: true });
const db = new PrismaClient();
const run = Date.now().toString(36);
const EVENT = "house-of-lords-2026";
const lines: string[] = [`# Forms ${label} (${base}) ${new Date().toISOString()}`, ""];
const log = (s: string) => {
  lines.push(s);
  console.log(s);
};
const check = (name: string, ok: boolean, detail = "") => log(`- ${ok ? "PASS" : "FAIL"}: ${name}${detail ? ` (${detail})` : ""}`);
const mail = (n: string) => `qa-audit-${run}-${n}@example.com`;
const shot = (page: Page, name: string) => page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: false }).catch(() => {});

const XSS = `<img src=x onerror="window.__xss=1"><script>window.__xss=1</script>"'&lt;b&gt;`;
const UNICODE = "नमस्ते दुनिया مرحبا بالعالم 🚀 Ünïcødé";

const browser = await chromium.launch();
const errors: string[] = [];
function wire(page: Page) {
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()} ${m.text().slice(0, 200)}`));
  page.on("pageerror", (e) => errors.push(`${page.url()} PAGEERR ${String(e).slice(0, 200)}`));
}

async function contactPage(width = 1440) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  wire(page);
  await page.goto(`${base}/in/`, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const form = page.locator('[data-compare="contact"] form');
  await form.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
  return { ctx, page, form };
}
async function fillContact(form: ReturnType<typeof Object>, v: Partial<Record<"name" | "email" | "phone" | "message" | "country", string>>, consent = true) {
  const f = form as import("playwright").Locator;
  if (v.name !== undefined) await f.locator('input[name="name"]').fill(v.name);
  if (v.email !== undefined) await f.locator('input[name="email"]').fill(v.email);
  if (v.phone !== undefined) await f.locator('input[name="phone"]').fill(v.phone);
  if (v.country !== undefined) await f.locator('select[name="country"]').selectOption({ value: v.country });
  if (v.message !== undefined) await f.locator('textarea[name="message"]').fill(v.message);
  if (consent) await f.locator('input[name="consent"]').setChecked(true, { force: true, timeout: 8000 }).catch(() => f.locator('input[name="consent"]').evaluate((e: HTMLInputElement) => (e.checked = true)));
}

async function eventPage(width = 1440) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  wire(page);
  await page.goto(`${base}/insights/events/${EVENT}`, { waitUntil: "load" });
  await page.waitForTimeout(1000);
  const form = page.locator("form#register");
  await form.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")));
  return { ctx, page, form };
}
async function fillEvent(form: import("playwright").Locator, v: Partial<Record<"name" | "email" | "company" | "jobTitle" | "phone" | "notes", string>>, consent = true) {
  for (const [k, val] of Object.entries(v)) {
    const sel = k === "notes" ? 'textarea[name="notes"]' : `input[name="${k}"]`;
    await form.locator(sel).fill(val as string);
  }
  if (consent) await form.locator('input[name="consent"]').setChecked(true, { force: true, timeout: 8000 }).catch(() => form.locator('input[name="consent"]').evaluate((e: HTMLInputElement) => (e.checked = true)));
}

const contactRows = (email: string) => db.contactSubmission.findMany({ where: { email: email.toLowerCase() } });
const eventRows = async (email: string) => db.eventRegistration.findMany({ where: { email: email.toLowerCase() } });

try {
  // Baseline: event status and registration flag in the database.
  const ev = await db.event.findUnique({ where: { slug: EVENT }, select: { id: true, status: true, registrationOpen: true, startsAt: true, endsAt: true, title: true } });
  log(`- INFO: event row: ${JSON.stringify(ev)}`);
  check("event exists in the database", !!ev);

  // ── Contact form ──────────────────────────────────────────────────────
  log(""); log("## Contact form (homepage /in/)");
  {
    const { ctx, page, form } = await contactPage();
    check("contact form present on /in/", (await form.count()) === 1);
    check("honeypot field present and hidden", (await form.locator('input[name="company_website"]').count()) === 1 && !(await form.locator('input[name="company_website"]').isVisible()));
    check("honeypot excluded from the tab order", (await form.locator('input[name="company_website"]').getAttribute("tabindex")) === "-1");
    // Empty submit
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);
    const status = await form.locator('[role="status"], [role="alert"]').first().innerText().catch(() => "");
    const invalid = await form.locator("[aria-invalid='true']").count();
    check("empty submit shows a summary message", /problem/i.test(status), status);
    check("empty submit marks fields invalid (name, email, message)", invalid >= 3, `${invalid} aria-invalid`);
    const consentErr = await form.locator("text=/agree to the terms/i").count();
    check("consent error shown when unchecked", consentErr >= 1);
    const describedBy = await form.locator('input[name="email"]').getAttribute("aria-describedby");
    const errText = describedBy ? await page.locator(`#${describedBy.replace(/([^\w-])/g, "\\$1")}`).innerText().catch(() => "") : "";
    check("email error linked through aria-describedby", !!describedBy && /email/i.test(errText), `${describedBy}: ${errText}`);
    await shot(page, "contact-empty-errors");
    // Inline validation on blur
    await form.locator('input[name="email"]').fill("not-an-email");
    await form.locator('input[name="email"]').blur();
    await page.waitForTimeout(200);
    check("inline email validation on blur", /correct format/i.test(await form.innerText()));
    await form.locator('input[name="phone"]').fill("abc");
    await form.locator('input[name="phone"]').blur();
    await page.waitForTimeout(200);
    check("inline phone validation on blur", /digits/i.test(await form.innerText()));
    // Phone selector
    const flagBefore = await form.locator("select[name='country']").inputValue();
    await form.locator("select[name='country']").selectOption({ value: "United Arab Emirates" });
    await page.waitForTimeout(100);
    check("phone country selector defaults to India on /in/ and changes", flagBefore === "India" && (await form.locator("select[name='country']").inputValue()) === "United Arab Emirates", flagBefore);
    check("country select has an accessible name", !!(await form.locator("select[name='country']").getAttribute("aria-label")));
    const options = await form.locator("select[name='country'] option").allInnerTexts();
    check("country list has no 'Middle East'", !options.some((o) => /Middle East/.test(o)));
    log(`- INFO: country options: ${options.join(" | ")}`);
    await ctx.close();
  }
  // Valid submit -> thank-you, row saved with region and sourcePath
  {
    const { ctx, page, form } = await contactPage();
    const email = mail("valid");
    await fillContact(form, { name: "QA Valid Person", email, phone: "+91 98765 43210", country: "India", message: "This is a QA audit test message, please ignore." });
    await form.locator('button[type="submit"]').click();
    await page.waitForURL(/\/thank-you/, { timeout: 30_000 }).catch(() => {});
    check("valid contact submit redirects to /thank-you", /\/thank-you/.test(page.url()), page.url());
    check("thank-you page has one visible heading", (await page.locator("h1:visible").count()) === 1, await page.locator("h1:visible").innerText().catch(() => ""));
    const rows = await contactRows(email);
    check("contact row saved once", rows.length === 1, JSON.stringify(rows.map((r) => ({ region: r.region, sourcePath: r.sourcePath, country: r.country, phone: r.phone, mailedAt: !!r.mailedAt, ipHash: !!r.ipHash }))));
    check("contact row records sourcePath /in/", rows[0]?.sourcePath === "/in/", String(rows[0]?.sourcePath));
    check("contact row mailedAt set (console mailer)", !!rows[0]?.mailedAt);
    await ctx.close();
  }
  // Double submit
  {
    const { ctx, page, form } = await contactPage();
    const email = mail("double");
    await fillContact(form, { name: "QA Double", email, country: "India", message: "Double submit protection test, please ignore." });
    const btn = form.locator('button[type="submit"]');
    await Promise.all([0, 1, 2].map(() => btn.click({ force: true, noWaitAfter: true, timeout: 5000 }).catch(() => {})));
    await page.waitForTimeout(400);
    const disabledDuringPending = await btn.isDisabled().catch(() => true);
    await page.waitForURL(/\/thank-you/, { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const rows = await contactRows(email);
    check("double-click creates one contact row", rows.length === 1, `${rows.length} rows; button disabled while pending: ${disabledDuringPending}`);
    await ctx.close();
  }
  // Honeypot
  {
    const { ctx, page, form } = await contactPage();
    const email = mail("honeypot");
    await fillContact(form, { name: "QA Bot", email, country: "India", message: "Honeypot test, this should not be stored." });
    await form.locator('input[name="company_website"]').evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
    await form.locator('button[type="submit"]').click();
    await page.waitForURL(/\/thank-you/, { timeout: 30_000 }).catch(() => {});
    const rows = await contactRows(email);
    check("honeypot: fake success, nothing stored", /\/thank-you/.test(page.url()) && rows.length === 0, `${page.url()} rows ${rows.length}`);
    await ctx.close();
  }
  // Unicode + HTML in every field, invalid consent first so the values echo back, then check escaping
  {
    const { ctx, page, form } = await contactPage();
    const email = mail("xss");
    await fillContact(form, { name: `${XSS} ${UNICODE}`, email, phone: "123", country: "Other", message: `${XSS} ${UNICODE} message body long enough` }, false);
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    const xss = await page.evaluate(() => (window as unknown as { __xss?: number }).__xss);
    const echoed = await form.locator('input[name="name"]').inputValue();
    check("HTML in fields is not executed after an invalid submit", !xss, `__xss=${xss}`);
    check("values echo back intact (Unicode preserved)", echoed.includes(UNICODE), echoed.slice(0, 60));
    check("phone '123' rejected (too short)", /digits/i.test(await form.innerText()));
    // now complete it
    await form.locator('input[name="phone"]').fill("+971 4 123 4567");
    await form.locator('input[name="consent"]').setChecked(true, { force: true, timeout: 8000 }).catch(() => form.locator('input[name="consent"]').evaluate((e: HTMLInputElement) => (e.checked = true)));
    await form.locator('button[type="submit"]').click();
    await page.waitForURL(/\/thank-you/, { timeout: 30_000 }).catch(() => {});
    const rows = await contactRows(email);
    check("Unicode/HTML submission stored raw (escaping is the renderer's job)", rows.length === 1 && rows[0].name.includes(UNICODE) && rows[0].name.includes("<script>"), rows[0]?.name.slice(0, 80));
    check("country 'Other' accepted", rows[0]?.country === "Other", String(rows[0]?.country));
    await ctx.close();
  }
  // Very long input
  {
    const { ctx, page, form } = await contactPage();
    const email = mail("long");
    await fillContact(form, { name: "N".repeat(121), email, country: "India", message: "M".repeat(5001) });
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    const t = await form.innerText();
    check("name over 120 chars rejected", /120 characters/.test(t));
    check("message over 5,000 chars rejected", /5,000 characters/.test(t));
    check("long input did not navigate away", !/thank-you/.test(page.url()));
    await shot(page, "contact-long-input");
    await ctx.close();
  }
  // No-JS submit
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${base}/uk/`, { waitUntil: "load" });
    const form = page.locator('[data-compare="contact"] form');
    check("no-JS: contact form rendered", (await form.count()) === 1);
    const email = mail("nojs");
    await form.locator('input[name="name"]').fill("QA NoJS");
    await form.locator('input[name="email"]').fill(email);
    await form.locator('select[name="country"]').selectOption({ value: "United Kingdom" });
    await form.locator('textarea[name="message"]').fill("No JavaScript submission test, please ignore.");
    await form.locator('input[name="consent"]').check();
    const t0 = Date.now();
    const [resp] = await Promise.all([page.waitForNavigation({ timeout: 30_000 }).catch((e) => `TIMEOUT ${String(e).split("\n")[0]}`), form.locator('button[type="submit"]').click({ noWaitAfter: true })]);
    const took = Date.now() - t0;
    const rows = await contactRows(email);
    check("no-JS: contact submit lands on /thank-you", typeof resp !== "string" && /\/thank-you/.test(page.url()), `${typeof resp === "string" ? resp : resp?.status()} ${page.url()} in ${took}ms`);
    check("no-JS: contact row saved with sourcePath /uk/ and country UK", rows.length === 1 && rows[0].sourcePath === "/uk/" && rows[0].country === "United Kingdom", JSON.stringify(rows.map((r) => ({ sourcePath: r.sourcePath, country: r.country, region: r.region }))));
    // No-JS invalid submit re-renders with errors
    await page.goto(`${base}/uk/`, { waitUntil: "load" });
    await page.locator('[data-compare="contact"] form input[name="name"]').fill("x");
    await Promise.all([page.waitForNavigation({ timeout: 30_000 }).catch(() => null), page.locator('[data-compare="contact"] form button[type="submit"]').click({ noWaitAfter: true })]);
    await page.waitForTimeout(500);
    const t = await page.locator('[data-compare="contact"] form').innerText().catch(() => "");
    check("no-JS: invalid contact submit re-renders with errors", /problem/i.test(t), t.match(/There (is|are)[^.]*\./)?.[0] ?? t.slice(0, 80));
    await ctx.close();
  }

  // ── Event registration ────────────────────────────────────────────────
  log(""); log(`## Event registration (/insights/events/${EVENT})`);
  {
    const { ctx, page, form } = await eventPage();
    check("registration form present", (await form.count()) === 1);
    check("form labelled by its heading", !!(await form.getAttribute("aria-labelledby")));
    const labelled = await form.locator("input:not([type=hidden]):not([name=company_website]), textarea").evaluateAll((els) => els.every((el) => { const id = el.getAttribute("id"); return (id && document.querySelector(`label[for="${id}"]`)) || el.closest("label"); }));
    check("every visible field has a label", labelled);
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);
    const alert = form.locator('[role="alert"]');
    check("empty registration shows role=alert summary", (await alert.count()) === 1 && /problem/i.test(await alert.innerText()), await alert.innerText().catch(() => ""));
    check("name, email and consent errors", (await form.locator("text=/Enter your full name/").count()) === 1 && (await form.locator("text=/work email/").count()) >= 1 && (await form.locator("text=/confirm you agree/").count()) === 1);
    await fillEvent(form, { name: "A", email: "bad@", phone: "12" });
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);
    const t = await form.innerText();
    check("short name, bad email, bad phone rejected", /full name/.test(t) && /correct format/.test(t) && /digits/.test(t));
    await shot(page, "event-errors");
    await ctx.close();
  }
  // Valid registration
  {
    const { ctx, page, form } = await eventPage();
    const email = mail("event-valid");
    await fillEvent(form, { name: "QA Registrant", email, company: "Plan D QA", jobTitle: "Tester", phone: "+44 7700 900000", notes: "QA audit test registration, please ignore." });
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(3500);
    const success = page.locator('[role="status"]:has-text("Registration received")');
    check("valid registration shows the success panel with first name", (await success.count()) === 1 && /Thank you, QA/.test(await success.innerText()), (await success.innerText().catch(() => "")).slice(0, 80));
    check("success panel offers Add to calendar", (await success.locator("a[href$='/calendar']").count()) === 1);
    const rows = await eventRows(email);
    check("registration row saved", rows.length === 1 && rows[0].consent === true, JSON.stringify(rows.map((r) => ({ company: r.company, jobTitle: r.jobTitle, phone: r.phone, notes: r.notes?.slice(0, 20), consent: r.consent, mailedAt: !!r.mailedAt }))));
    check("registration mailedAt set (console mailer)", !!rows[0]?.mailedAt);
    await shot(page, "event-success");
    // Duplicate
    await page.goto(`${base}/insights/events/${EVENT}`, { waitUntil: "load" });
    await page.waitForTimeout(800);
    const f2 = page.locator("form#register");
    await f2.scrollIntoViewIfNeeded();
    await fillEvent(f2, { name: "QA Registrant Again", email: email.toUpperCase() });
    await f2.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    const dup = await f2.locator('[role="status"], [role="alert"]').first().innerText().catch(() => "");
    check("duplicate email (different case) answered as already registered", /already registered/i.test(dup), dup);
    check("duplicate did not add a row", (await eventRows(email)).length === 1);
    await shot(page, "event-duplicate");
    await ctx.close();
  }
  // Honeypot
  {
    const { ctx, page, form } = await eventPage();
    const email = mail("event-bot");
    await fillEvent(form, { name: "Bot Reg", email });
    await form.locator('input[name="company_website"]').evaluate((el: HTMLInputElement) => (el.value = "spam"));
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(2500);
    check("event honeypot: fake success, nothing stored", (await page.locator('[role="status"]:has-text("Registration received")').count()) === 1 && (await eventRows(email)).length === 0);
    await ctx.close();
  }
  // Double submit
  {
    const { ctx, page, form } = await eventPage();
    const email = mail("event-double");
    await fillEvent(form, { name: "QA Double Reg", email });
    const btn = form.locator('button[type="submit"]');
    await Promise.all([0, 1, 2].map(() => btn.click({ force: true, noWaitAfter: true, timeout: 5000 }).catch(() => {})));
    await page.waitForTimeout(3500);
    check("event double submit creates one row", (await eventRows(email)).length === 1);
    await ctx.close();
  }
  // Unicode / HTML, long input
  {
    const { ctx, page, form } = await eventPage();
    const email = mail("event-xss");
    await fillEvent(form, { name: `${XSS} ${UNICODE}`, email, company: XSS, jobTitle: UNICODE, notes: "N".repeat(1001) }, false);
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    const xss = await page.evaluate(() => (window as unknown as { __xss?: number }).__xss);
    check("event HTML input not executed on error re-render", !xss);
    check("notes over 1000 chars rejected", /1000 characters/.test(await form.innerText()));
    check("job title Unicode echoed back", (await form.locator('input[name="jobTitle"]').inputValue()) === UNICODE);
    await form.locator('textarea[name="notes"]').fill(UNICODE);
    await form.locator('input[name="consent"]').setChecked(true, { force: true, timeout: 8000 }).catch(() => form.locator('input[name="consent"]').evaluate((e: HTMLInputElement) => (e.checked = true)));
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(3500);
    const success = await page.locator('[role="status"]:has-text("Registration received")').innerText().catch(() => "");
    check("Unicode/HTML registration accepted and first name rendered as text", /Thank you/.test(success) && !(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)), success.slice(0, 80));
    const rows = await eventRows(email);
    check("Unicode stored intact", rows.length === 1 && rows[0].jobTitle === UNICODE && rows[0].notes === UNICODE);
    await ctx.close();
  }
  // No-JS registration
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${base}/insights/events/${EVENT}`, { waitUntil: "load" });
    const form = page.locator("form#register");
    check("no-JS: registration form rendered", (await form.count()) === 1);
    const email = mail("event-nojs");
    await form.locator('input[name="name"]').fill("QA NoJS Reg");
    await form.locator('input[name="email"]').fill(email);
    await form.locator('input[name="consent"]').check();
    const t0 = Date.now();
    const [resp] = await Promise.all([page.waitForNavigation({ timeout: 30_000 }).catch((e) => `TIMEOUT ${String(e).split("\n")[0]}`), form.locator('button[type="submit"]').click({ noWaitAfter: true })]);
    const took = Date.now() - t0;
    const body = await page.locator("body").innerText().catch(() => "");
    check("no-JS: registration answers with the success panel", typeof resp !== "string" && /Registration received/.test(body), `${typeof resp === "string" ? resp : resp?.status()} in ${took}ms`);
    check("no-JS: registration row saved", (await eventRows(email)).length === 1);
    await ctx.close();
  }
  // .ics
  {
    const r = await fetch(`${base}/insights/events/${EVENT}/calendar`);
    const ics = await r.text();
    const ct = r.headers.get("content-type") ?? "";
    const cd = r.headers.get("content-disposition") ?? "";
    check(".ics served as text/calendar attachment", r.status === 200 && /text\/calendar/.test(ct) && /attachment/.test(cd), `${r.status} ${ct} ${cd}`);
    const linesIcs = ics.split("\r\n");
    check(".ics uses CRLF line endings", !/[^\r]\n/.test(ics));
    check(".ics has VCALENDAR/VEVENT, UID, DTSTAMP, DTSTART, SUMMARY", ["BEGIN:VCALENDAR", "END:VCALENDAR", "BEGIN:VEVENT", "END:VEVENT"].every((l) => linesIcs.includes(l)) && /^UID:/m.test(ics) && /^DTSTAMP:\d{8}T\d{6}Z/m.test(ics) && /^DTSTART:\d{8}T\d{6}Z/m.test(ics) && /^SUMMARY:/m.test(ics));
    check(".ics lines are 75 octets or fewer", linesIcs.every((l) => Buffer.byteLength(l, "utf8") <= 75), `max ${Math.max(...linesIcs.map((l) => Buffer.byteLength(l, "utf8")))}`);
    check(".ics has no DTEND (no confirmed end time) or a valid one", !/^DTEND:/m.test(ics) || /^DTEND:\d{8}T\d{6}Z/m.test(ics));
    const summary = ics.match(/^SUMMARY:(.*)$/m)?.[1] ?? "";
    check(".ics SUMMARY carries no placeholder brackets", !/\[|\]/.test(summary), summary);
    log(`- INFO: .ics\n\n\`\`\`\n${ics.trim()}\n\`\`\``);
    fs.writeFileSync(path.join(outDir, `${EVENT}.ics`), ics);
    check(".ics 404 for unknown event", (await fetch(`${base}/insights/events/nope/calendar`)).status === 404);
  }
  // Closed registration: flip the local row, submit, restore
  {
    const before = await db.event.findUnique({ where: { slug: EVENT }, select: { registrationOpen: true } });
    await db.event.update({ where: { slug: EVENT }, data: { registrationOpen: false } });
    try {
      const { ctx, page, form } = await eventPage();
      const email = mail("event-closed");
      await fillEvent(form, { name: "QA Closed", email });
      await form.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
      const msg = await form.locator('[role="status"], [role="alert"]').first().innerText().catch(() => "");
      check("closed registration (database) is refused by the action", /closed/i.test(msg) && (await eventRows(email)).length === 0, msg);
      log(`- INFO: the cached page still shows the form open until revalidation (cacheLife hours); the action checks the live row.`);
      await shot(page, "event-closed-action");
      await ctx.close();
    } finally {
      await db.event.update({ where: { slug: EVENT }, data: { registrationOpen: before?.registrationOpen ?? true } });
    }
  }
  // Rate limit (last)
  log(""); log("## Rate limiting (5 per 10 minutes per IP hash)");
  {
    const { ctx, page } = await eventPage();
    let limitedAt = -1;
    for (let i = 0; i < 8; i++) {
      await page.goto(`${base}/insights/events/${EVENT}`, { waitUntil: "load" });
      await page.waitForTimeout(600);
      const form = page.locator("form#register");
      await form.scrollIntoViewIfNeeded();
      await fillEvent(form, { name: `QA Rate ${i}`, email: mail(`rate-${i}`) });
      await form.locator('button[type="submit"]').click();
      await page.waitForTimeout(2500);
      const msg = await page.locator('[role="status"], [role="alert"]').first().innerText().catch(() => "");
      if (/too many attempts/i.test(msg)) {
        limitedAt = i;
        break;
      }
    }
    check("event registration rate limit engages within 8 attempts", limitedAt >= 0, `limited on attempt ${limitedAt + 1} (earlier valid registrations this run also count)`);
    await shot(page, "event-rate-limited");
    await ctx.close();
    const { ctx: c2, page: p2, form } = await contactPage();
    let contactLimited = false;
    for (let i = 0; i < 8 && !contactLimited; i++) {
      await p2.goto(`${base}/in/`, { waitUntil: "load" });
      await p2.waitForTimeout(600);
      const f = p2.locator('[data-compare="contact"] form');
      await f.scrollIntoViewIfNeeded();
      await fillContact(f, { name: `QA Rate ${i}`, email: mail(`crate-${i}`), country: "India", message: "Rate limit test message, please ignore." });
      await f.locator('button[type="submit"]').click();
      await p2.waitForTimeout(2500);
      const msg = await p2.locator('[data-compare="contact"] form [role="status"]').first().innerText().catch(() => "");
      if (/several messages/i.test(msg)) contactLimited = true;
      if (/thank-you/.test(p2.url())) continue;
    }
    check("contact rate limit engages within 8 attempts", contactLimited);
    void form;
    await c2.close();
    // Spoofed X-Forwarded-For bypass probe (only meaningful behind a proxy that overwrites it)
    const spoof = await browser.newContext({ viewport: { width: 1440, height: 900 }, extraHTTPHeaders: { "x-forwarded-for": "203.0.113.9" } });
    const sp = await spoof.newPage();
    await sp.goto(`${base}/insights/events/${EVENT}`, { waitUntil: "load" });
    await sp.waitForTimeout(600);
    const sf = sp.locator("form#register");
    await sf.scrollIntoViewIfNeeded();
    await fillEvent(sf, { name: "QA Spoof", email: mail("spoof") });
    await sf.locator('button[type="submit"]').click();
    await sp.waitForTimeout(3000);
    const spoofMsg = await sp.locator('[role="status"], [role="alert"]').first().innerText().catch(() => "");
    log(`- INFO: with a spoofed X-Forwarded-For the rate limit ${/Registration received/.test(spoofMsg) ? "was bypassed (the app trusts the header; fine behind Vercel/CloudFront, a hole on a bare origin)" : "still applied"}: ${spoofMsg.slice(0, 60)}`);
    await spoof.close();
  }
} finally {
  await browser.close();
  // Clean up test rows and this run's rate-limit windows.
  const c = await db.contactSubmission.deleteMany({ where: { email: { contains: `qa-audit-${run}` } } });
  const e = await db.eventRegistration.deleteMany({ where: { email: { contains: `qa-audit-${run}` } } });
  const rl = await db.rateLimitHit.deleteMany({ where: { OR: [{ key: { startsWith: "contact:" } }, { key: { startsWith: "event-registration:" } }] } });
  log(""); log(`Cleanup: removed ${c.count} contact rows, ${e.count} registrations, ${rl.count} rate-limit windows.`);
  await db.$disconnect();
  lines.push("", "## Console errors during the pass", "", ...(errors.length ? errors.map((x) => `- ${x}`) : ["none"]));
  fs.writeFileSync(path.join(outDir, "forms.md"), lines.join("\n") + "\n");
  console.log(`\nWrote ${path.join(outDir, "forms.md")}; FAIL count ${lines.filter((l) => l.startsWith("- FAIL")).length}`);
}
