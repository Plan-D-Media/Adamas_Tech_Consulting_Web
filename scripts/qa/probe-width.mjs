import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
await page.goto(`${base}/about`, { waitUntil: "load" });
await page.waitForTimeout(1200);
const rows = await page.evaluate(() =>
  [...document.querySelectorAll("[data-compare]")].map((s) => {
    const inner = s.querySelector(".container-about, .container-site");
    const r = inner?.getBoundingClientRect();
    const cs = inner ? getComputedStyle(inner) : null;
    return {
      id: s.getAttribute("data-compare"),
      cls: inner ? (inner.classList.contains("container-about") ? "about" : "site") : "none",
      left: r ? Math.round(r.left) : null,
      width: r ? Math.round(r.width) : null,
      pad: cs ? cs.paddingLeft : null,
      max: cs ? cs.maxWidth : null,
      h: Math.round(s.getBoundingClientRect().height),
    };
  }),
);
for (const r of rows) console.log(`${String(r.id).padEnd(18)} ${r.cls.padEnd(6)} left=${String(r.left).padStart(4)} w=${String(r.width).padStart(5)} pad=${r.pad} max=${r.max} secH=${r.h}`);
await browser.close();
