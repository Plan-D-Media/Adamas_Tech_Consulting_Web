/**
 * Submits the event registration form N times in a row with JavaScript disabled and reports each result.
 * Pair with a memory sampler on the server process. The rate limit (5 per 10 minutes per connection) means
 * later submissions get the "too many attempts" message, which still exercises the same render path.
 * Usage: tsx scripts/nojs-burst.ts [baseUrl] [count]
 */
import { chromium } from "playwright";

const [base = "http://localhost:3100", n = "10"] = process.argv.slice(2);
const PAGE = "/insights/events/house-of-lords-2026";

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const p = await ctx.newPage();
  for (let i = 1; i <= Number(n); i++) {
    await p.goto(base + PAGE, { waitUntil: "load", timeout: 30_000 });
    await p.fill("#reg-name", `Burst Test ${i}`);
    await p.fill("#reg-email", `burst-${Date.now()}-${i}@example.com`);
    await p.check("#reg-consent");
    const t = Date.now();
    const nav = await Promise.all([
      p.waitForNavigation({ timeout: 20_000 }).catch(() => null),
      p.locator('#register button[type="submit"]').click({ noWaitAfter: true }),
    ]).then(([r]) => r);
    const result = (await p.locator("text=You’re registered").count())
      ? "registered"
      : (await p.locator("text=Too many attempts").count())
        ? "rate-limited"
        : "other";
    console.log(`#${i}: ${nav ? nav.status() : "NO RESPONSE"} in ${Date.now() - t}ms, ${result}`);
  }
  await b.close();
})().catch((e) => {
  console.error("FAILED:", String(e).split("\n")[0]);
  process.exit(1);
});
