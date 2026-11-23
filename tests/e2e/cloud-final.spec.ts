import { expect, test } from "@playwright/test";

/**
 * The finalised Cloud designs (23 November 2026): the clientele marquee, the scroll-velocity testimonial row,
 * the six Cloud sub-service routes, the two published case studies, and the single form recipient.
 *
 * Source designs: design-ref/exports/new-design/{Cloud,Managed Services,Case Study_*}.svg.
 */

const CLOUD = "/services/cloud-services";

const SUB_SERVICES = [
  "/services/cloud-services/migration-modernization",
  "/services/cloud-services/devops-secops",
  "/services/cloud-services/managed-services",
  "/services/cloud-services/ai-ml-ops",
  "/services/cloud-services/cloud-automation",
  "/services/cloud-services/cloud-advisory-consultation",
];

const CASE_STUDIES = ["/case-studies/kubernetes-operations-healthtech", "/case-studies/sap-disaster-recovery-cement"];

/* ── The clientele marquee ──────────────────────────────────────────── */

test.describe("clientele marquee", () => {
  test("scrolls, duplicates the set for the loop, and hides the copy from assistive technology", async ({ page }) => {
    await page.goto(CLOUD);
    const track = page.locator(".logo-marquee");
    await expect(track).toHaveAttribute("data-animate", "true");

    const names = await page.locator(".logo-marquee li:not([aria-hidden]) img").evaluateAll((els) => els.map((e) => (e as HTMLImageElement).alt));
    const clones = await page.locator(".logo-marquee li[aria-hidden='true'] img").count();
    expect(names.length).toBeGreaterThanOrEqual(10);
    // One real set plus one hidden copy, and every clone's alt is empty so each client is announced once.
    expect(clones).toBe(names.length);
    expect(new Set(names).size).toBe(names.length);
    const cloneAlts = await page.locator(".logo-marquee li[aria-hidden='true'] img").evaluateAll((els) => els.map((e) => (e as HTMLImageElement).alt));
    expect(cloneAlts.every((a) => a === "")).toBe(true);

    await expect(track).toHaveCSS("animation-play-state", "running");
  });

  test("pauses on hover and on the pause button", async ({ page }) => {
    await page.goto(CLOUD);
    const track = page.locator(".logo-marquee");
    // The row is moving, so it never satisfies Playwright's stability check; force the hover.
    await track.locator("li").first().hover({ force: true });
    await expect(track).toHaveCSS("animation-play-state", "paused");

    // Move the pointer away, then press the button.
    await page.mouse.move(0, 0);
    await expect(track).toHaveCSS("animation-play-state", "running");
    // The accessible name flips to "Play the client logos" once pressed, so the locator is positional.
    const button = page.locator("[data-compare='cs-clients'] button");
    await expect(button).toHaveAccessibleName("Pause the client logos");
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(button).toHaveAccessibleName("Play the client logos");
    await expect(track).toHaveCSS("animation-play-state", "paused");
  });

  test("reduced motion: a static wrapping row, no duplicate set and no pause button", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(CLOUD);
    const track = page.locator(".logo-marquee");
    await expect(track).not.toHaveAttribute("data-animate", "true");
    await expect(track).toHaveCSS("flex-wrap", "wrap");
    expect(await page.locator(".logo-marquee li[aria-hidden='true']").count()).toBe(0);
    await expect(page.getByRole("button", { name: /the client logos/i })).toHaveCount(0);
  });
});

test.describe("clientele marquee without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every logo is in the HTML, once, as a static row", async ({ page }) => {
    await page.goto(CLOUD);
    const track = page.locator(".logo-marquee");
    await expect(track).not.toHaveAttribute("data-animate", "true");
    expect(await page.locator(".logo-marquee li").count()).toBeGreaterThanOrEqual(10);
    expect(await page.locator(".logo-marquee li[aria-hidden='true']").count()).toBe(0);
    await expect(page.getByRole("button", { name: /the client logos/i })).toHaveCount(0);
  });
});

/* ── The testimonial row ────────────────────────────────────────────── */

test.describe("testimonial rows", () => {
  test("the row moves, and pausing it on hover holds it still", async ({ page }) => {
    await page.goto(CLOUD);
    const track = page.locator("[data-compare='cs-testimonials'] ul.w-max");
    await track.scrollIntoViewIfNeeded();
    await expect(track).toBeVisible();

    const read = () => track.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
    const a = await read();
    await expect.poll(read, { timeout: 4000 }).not.toBe(a);

    // Hovering a card freezes it.
    await track.locator("figure").first().hover({ force: true });
    const frozen = await read();
    await page.waitForTimeout(600);
    expect(Math.abs((await read()) - frozen)).toBeLessThan(2);
  });

  test("reduced motion: a static grid, no duplicate cards", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(CLOUD);
    const section = page.locator("[data-compare='cs-testimonials']");
    await expect(section.locator("ul.w-max")).toHaveCount(0);
    expect(await section.locator("[aria-hidden='true'] figure").count()).toBe(0);
    expect(await section.locator("figure").count()).toBeGreaterThanOrEqual(3);
  });
});

test.describe("testimonial rows without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("a static grid, every quote readable", async ({ page }) => {
    await page.goto(CLOUD);
    const section = page.locator("[data-compare='cs-testimonials']");
    await expect(section.locator("ul.w-max")).toHaveCount(0);
    const cards = section.locator("figure");
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
    for (const el of await cards.all()) await expect(el).toBeVisible();
  });
});

/* ── Routes ─────────────────────────────────────────────────────────── */

test("all six Cloud sub-service routes render the new template", async ({ page }) => {
  for (const path of SUB_SERVICES) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toBeVisible();
    // The template's own markers: the AWS partner badge in the hero and the shared case-study band.
    await expect(page.locator("[data-compare='sub-hero']"), path).toBeVisible();
    await expect(page.locator("[data-compare='sub-cases']"), path).toBeVisible();
    // No page ever shows another page's related card pointing at itself.
    expect(await page.locator(`[data-compare='sub-related'] a[href='${path}']`).count(), path).toBe(0);
  }
});

test("the two published case studies render their own layout and are on the listing", async ({ page }) => {
  for (const path of CASE_STUDIES) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("[data-compare='case-hero'] h1"), path).toBeVisible();
    await expect(page.getByRole("heading", { name: "Business Outcomes" }), path).toBeVisible();
    await expect(page.getByRole("heading", { name: /AWS & Technology Stack/ }), path).toBeVisible();
  }

  // The listing paginates at nine cards. In the public build these two are the only published case studies and
  // sit on page 1; in the drafts build all twenty render and they sort last, so every page is scanned.
  const listed = new Set<string>();
  for (let p = 1; p <= 3; p += 1) {
    await page.goto(p === 1 ? "/case-studies" : `/case-studies?page=${p}`);
    for (const href of await page.locator("main a[href^='/case-studies/']").evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
      if (href) listed.add(href.split("?")[0].split("#")[0]);
    }
  }
  for (const path of CASE_STUDIES) expect([...listed], path).toContain(path);
});

/* ── One recipient for every form ───────────────────────────────────── */

test("every lead form resolves to MAIL_TO_ENQUIRIES and nothing else", async () => {
  const { readFileSync, readdirSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");

  const files: string[] = [];
  (function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry.startsWith(".next")) continue;
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(entry)) files.push(p);
    }
  })("lib");
  (function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(entry)) files.push(p);
    }
  })("app");

  // Every `to:` on a sendMail call is either enquiriesInbox() (the organiser/notification copy) or the
  // submitter's own address (the registration confirmation). A literal address would be a routing bug.
  const offenders: string[] = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/\bto:\s*([^,\n]+)/g)) {
      const value = m[1].trim();
      // `to: string;` in the MailMessage interface is a type, not a recipient.
      if (/^(string|string \| null)[;,]?$/.test(value)) continue;
      if (value.startsWith("enquiriesInbox()") || value.startsWith("d.email") || value.startsWith("msg.to")) continue;
      offenders.push(`${f}: to: ${value}`);
    }
  }
  expect(offenders).toEqual([]);

  // And the one place the inbox is defined reads the environment variable.
  const forms = readFileSync("lib/forms.ts", "utf8");
  expect(forms).toContain("process.env.MAIL_TO_ENQUIRIES");
});
