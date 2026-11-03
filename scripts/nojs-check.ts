/**
 * No-JavaScript form check: loads a page with JS disabled, fills a form and submits it like a browser would.
 * Usage: tsx scripts/nojs-check.ts <baseUrl> <path> <field=value>... (checkboxes: field=on)
 * Example: tsx scripts/nojs-check.ts http://localhost:3100 /contact contact-name="Ann Test" contact-email=a@example.com contact-consent=on
 * Prints: whether the form is visible, how long the submission took, the final URL and status.
 */
import { chromium } from "playwright";

const [base = "http://localhost:3100", path = "/insights/events/house-of-lords-2026", ...pairs] = process.argv.slice(2);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "load", timeout: 60_000 });
  const fields = pairs.map((kv) => [kv.slice(0, kv.indexOf("=")), kv.slice(kv.indexOf("=") + 1)] as [string, string]);
  const first = p.locator(`#${fields[0][0]}`);
  console.log("form visible:", await first.isVisible());
  for (const [id, value] of fields) {
    const el = p.locator(`#${id}`);
    if ((await el.getAttribute("type")) === "checkbox") await el.check();
    // No el.evaluate(): it can stall with JavaScript disabled, so detect a <select> by selector instead.
    else if (await p.locator(`select#${id}`).count()) await el.selectOption({ label: value });
    else await el.fill(value.replace("{t}", String(Date.now())));
  }
  const form = first.locator("xpath=ancestor::form");
  const t = Date.now();
  const resp = await Promise.all([
    p.waitForNavigation({ timeout: 25_000 }).catch((e) => `TIMEOUT ${String(e).split("\n")[0]}`),
    form.locator('button[type="submit"]').click({ noWaitAfter: true }),
  ]).then(([r]) => r);
  const took = Date.now() - t;
  console.log(`submit: ${took}ms →`, typeof resp === "string" ? resp : `${resp?.status()} ${p.url()}`);
  if (typeof resp !== "string") console.log("page h1:", (await p.locator("h1").first().textContent())?.trim());
  await b.close();
})().catch((e) => {
  console.error("FAILED:", String(e).split("\n")[0]);
  process.exit(1);
});
