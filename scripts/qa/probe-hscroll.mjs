import { chromium } from "playwright";
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch();
for (const [route, width] of [["/about", 1024], ["/about", 1023], ["/about", 1100]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${base}${route}`, { waitUntil: "load" });
  await page.waitForTimeout(700);
  const r = await page.evaluate(() => {
    window.scrollTo(400, 0);
    const x = window.scrollX;
    window.scrollTo(0, 0);
    return { x, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bodyClip: getComputedStyle(document.body).overflowX };
  });
  console.log(`${route} @${width}: scrollX after scrollTo(400) = ${r.x} (0 = cannot scroll sideways) | scrollWidth ${r.sw} clientWidth ${r.cw} | body overflow-x: ${r.bodyClip}`);
  await page.close();
}
await browser.close();
