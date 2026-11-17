// Reproduce the "HTML in a field is escaped where it is shown back" failure and report what the page does.
// usage: node scripts/qa/probe-escaping.mjs [base]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ baseURL: base, viewport: { width: 1440, height: 900 } });

page.on("console", (m) => console.log(`  [console ${m.type()}] ${m.text().slice(0, 160)}`));
page.on("pageerror", (e) => console.log(`  [pageerror] ${String(e).slice(0, 200)}`));
page.on("requestfailed", (r) => console.log(`  [requestfailed] ${r.method()} ${r.url().slice(0, 90)} ${r.failure()?.errorText}`));
page.on("response", (r) => {
  if (r.request().method() === "POST") console.log(`  [POST] ${r.status()} ${r.url().slice(0, 90)}`);
});

const payload = `<img src=x onerror="document.title='pwned'">`;

for (const [label, name] of [
  ["plain text name", "Plain Person"],
  ["HTML payload name", payload],
]) {
  console.log(`===== ${label} =====`);
  await page.goto("/in/");
  const f = page.locator('[data-compare="contact"] form');
  await f.locator('input[name="name"]').fill(name);
  await f.locator('input[name="email"]').fill("bad");
  await f.locator('textarea[name="message"]').fill("x");
  await f.locator('button[type="submit"]').click();
  await page.waitForTimeout(2500);
  const count = await f.locator("[role='status']").count();
  console.log("  role=status elements:", count);
  if (count) console.log("  banner text:", (await f.locator("[role='status']").first().innerText()).slice(0, 80));
  console.log("  name value kept:", JSON.stringify((await f.locator('input[name="name"]').inputValue()).slice(0, 50)));
  console.log("  field errors shown:", await f.locator("p.mt-1").count());
  console.log("  page title:", await page.title());
  console.log("  url:", page.url());
}

await browser.close();
