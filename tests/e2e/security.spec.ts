import { expect, test } from "@playwright/test";

/** Security headers on every kind of response, the preview challenge, and the probes from the audit. */

const REQUIRED = ["content-security-policy", "x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy"];

test("security headers are set on pages, redirects, static files, media and API routes (BUG-003)", async ({ request }) => {
  const paths = ["/in/", "/ae/", "/e-invoicing-uae", "/services/cloud-services", "/sitemap.xml", "/robots.txt", "/media/brand/logo.webp", "/api/revalidate", "/nope-nope"];
  const missing: string[] = [];
  for (const p of paths) {
    const res = await request.get(p, { maxRedirects: 0 });
    const h = res.headers();
    for (const k of REQUIRED) if (!h[k]) missing.push(`${p}: ${k}`);
    if (h["content-security-policy"] && !h["content-security-policy"].includes("frame-ancestors 'none'")) missing.push(`${p}: frame-ancestors`);
    if (h["x-powered-by"]) missing.push(`${p}: x-powered-by present`);
  }
  expect(missing, missing.join("\n")).toEqual([]);
});

test("a page loads without any CSP violation in the console", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => /Content Security Policy|Refused to/.test(m.text()) && violations.push(m.text()));
  await page.goto("/in/");
  await page.mouse.move(400, 400);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(1500);
  await page.goto("/services/cloud-services");
  await page.waitForTimeout(800);
  expect(violations, violations.join("\n")).toEqual([]);
});

test("the preview challenge protects every route when the credentials are configured (BUG-004)", async ({ playwright, baseURL }) => {
  test.skip(!process.env.E2E_PREVIEW_USERNAME, "PREVIEW_USERNAME is not set for this server");
  const anon = await playwright.request.newContext({ baseURL });
  for (const p of ["/in/", "/_next/static/chunks/nope.js", "/media/brand/logo.webp", "/sitemap.xml", "/insights/events/x/calendar"]) {
    const res = await anon.get(p, { maxRedirects: 0 });
    expect(res.status(), p).toBe(401);
    expect(res.headers()["www-authenticate"], p).toMatch(/^Basic/);
  }
  const wrong = await anon.get("/in/", { headers: { authorization: "Basic " + Buffer.from("nope:nope").toString("base64") } });
  expect(wrong.status()).toBe(401);
  const right = await anon.get("/in/", { headers: { authorization: "Basic " + Buffer.from(`${process.env.E2E_PREVIEW_USERNAME}:${process.env.E2E_PREVIEW_PASSWORD}`).toString("base64") } });
  expect(right.status()).toBe(200);
  await anon.dispose();
});

test("revalidate, fixture and probe URLs are locked down", async ({ request }) => {
  expect((await request.get("/api/revalidate")).status()).toBe(405);
  expect((await request.post("/api/revalidate", { data: {} })).status()).toBe(401);
  expect((await request.post("/api/revalidate", { headers: { "x-revalidate-secret": "wrong" }, data: "{" })).status()).toBe(401);
  expect((await request.get("/figma-fixture", { maxRedirects: 0 })).status()).toBe(404);
  for (const p of ["/.env", "/prisma/schema.prisma", "/.git/config"]) expect((await request.get(p, { maxRedirects: 0 })).status(), p).toBe(404);
  const html = await (await request.get("/nope-nope")).text();
  expect(html).not.toMatch(/at .*\.js:\d+:\d+/);
});

test("no secret reaches the client bundle", async ({ request }) => {
  const html = await (await request.get("/in/")).text();
  const chunks = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map((m) => m[1]).slice(0, 20);
  expect(chunks.length).toBeGreaterThan(0);
  for (const c of chunks) {
    const js = await (await request.get(c)).text();
    expect(js, c).not.toMatch(/postgresql:\/\/|figd_|REVALIDATE_SECRET|PREVIEW_PASSWORD|SMTP_PASS/);
  }
});
