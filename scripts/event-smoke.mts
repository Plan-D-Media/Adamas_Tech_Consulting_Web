/**
 * Event registration smoke test: submits the form on the event page (with and without JavaScript), expects the
 * confirmation panel, the duplicate-email answer on a second submission, and the row in the database.
 * Usage: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright MSYS_NO_PATHCONV=1 tsx scripts/event-smoke.mts [baseUrl] [slug]
 */
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const slug = process.argv[3] ?? "house-of-lords-2026";
const email = `smoke-${Date.now()}@example.invalid`;
const db = new PrismaClient();
const browser = await chromium.launch();
const out: string[] = [];
try {
  for (const js of [true, false]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: js });
    const page = await ctx.newPage();
    await page.goto(`${base}/insights/events/${slug}`, { waitUntil: "load" });
    await page.fill("input[name=name]", "Smoke Test");
    await page.fill("input[name=email]", js ? email : `nojs-${email}`);
    await page.fill("input[name=company]", "QA");
    await page.check("input[name=consent]");
    await page.click("button[type=submit]");
    await page.waitForTimeout(js ? 2500 : 4000);
    const text = await page.locator("#register, [role=status]").first().innerText().catch(() => "");
    const ok = /Registration received|Thank you/i.test(await page.content());
    out.push(`${js ? "with JS" : "no JS"}: ${ok ? "confirmation shown" : "NO confirmation"} (${text.slice(0, 80).replace(/\s+/g, " ")})`);
    await ctx.close();
  }
  // Duplicate: same email again.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/insights/events/${slug}`, { waitUntil: "load" });
  await page.fill("input[name=name]", "Smoke Test");
  await page.fill("input[name=email]", email);
  await page.check("input[name=consent]");
  await page.click("button[type=submit]");
  await page.waitForTimeout(2500);
  out.push(`duplicate: ${/already registered/i.test(await page.content()) ? "answered as duplicate" : "NOT detected"}`);
  await ctx.close();
  const rows = await db.eventRegistration.findMany({ where: { email: { in: [email, `nojs-${email}`] } }, select: { email: true, mailedAt: true, consent: true } });
  out.push(`database rows: ${rows.length} (${rows.map((r) => `${r.email} mailed=${r.mailedAt ? "yes" : "no"} consent=${r.consent}`).join("; ")})`);
  await db.eventRegistration.deleteMany({ where: { email: { in: [email, `nojs-${email}`] } } });
  out.push("test rows removed");
} finally {
  await browser.close();
  await db.$disconnect();
}
console.log(out.join("\n"));
