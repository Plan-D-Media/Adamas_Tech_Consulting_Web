import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/** Region routing on bare "/", the /ae/ to /gcc/ move, the region cookie, and the legacy redirect table. */

const COUNTRY_CASES: [string | null, string][] = [
  ["IN", "/in/"],
  ["GB", "/uk/"],
  ["IE", "/uk/"],
  ["AE", "/gcc/"],
  ["SA", "/gcc/"],
  ["QA", "/gcc/"],
  ["KW", "/gcc/"],
  ["BH", "/gcc/"],
  ["OM", "/gcc/"],
  ["US", null as unknown as string],
  [null, null as unknown as string],
];

test.describe("bare / routing", () => {
  for (const [country, expected] of COUNTRY_CASES) {
    test(`country ${country ?? "(none)"} -> ${expected ?? "DEFAULT_REGION"}`, async ({ request }) => {
      const res = await request.get("/", { maxRedirects: 0, headers: country ? { "x-vercel-ip-country": country } : {} });
      expect(res.status()).toBe(307);
      const loc = res.headers()["location"];
      if (expected) expect(loc).toMatch(new RegExp(`${expected.replace(/\//g, "\\/")}$`));
      else expect(loc).toMatch(/\/(in|uk|gcc)\/$/);
      expect(res.headers()["cache-control"]).toContain("no-store");
    });
  }

  test("the region cookie beats the country; a legacy ae cookie still works", async ({ request }) => {
    const r1 = await request.get("/", { maxRedirects: 0, headers: { "x-vercel-ip-country": "IN", cookie: "region=uk" } });
    expect(r1.headers()["location"]).toMatch(/\/uk\/$/);
    const r2 = await request.get("/", { maxRedirects: 0, headers: { "x-vercel-ip-country": "IN", cookie: "region=ae" } });
    expect(r2.headers()["location"]).toMatch(/\/gcc\/$/);
    const r3 = await request.get("/?x=1", { maxRedirects: 0, headers: { cookie: "region=in" } });
    expect(r3.headers()["location"]).toMatch(/\/in\/\?x=1$/);
  });

  test("/ae/ and anything under it is a single 301 to /gcc/", async ({ request }) => {
    for (const p of ["/ae", "/ae/", "/ae/anything?x=1"]) {
      const res = await request.get(p, { maxRedirects: 0 });
      expect(res.status(), p).toBe(301);
      expect(res.headers()["location"], p).toMatch(/\/gcc\/(\?x=1)?$/);
    }
    const home = await request.get("/gcc/", { maxRedirects: 0 });
    expect(home.status()).toBe(200);
  });

  test("homepages are canonical with a trailing slash; inner pages without", async ({ request }) => {
    const a = await request.get("/in", { maxRedirects: 0 });
    expect(a.status()).toBe(308);
    expect(a.headers()["location"]).toMatch(/\/in\/$/);
    const b = await request.get("/services/", { maxRedirects: 0 });
    expect(b.status()).toBe(308);
    expect(b.headers()["location"]).toMatch(/\/services$/);
    for (const p of ["/IN/", "/xx/", "/in/extra"]) expect((await request.get(p, { maxRedirects: 0 })).status(), p).toBe(404);
  });

  test("the region switcher sets the cookie and swaps the homepage", async ({ page, context }) => {
    await page.goto("/in/");
    await page.locator("header summary[aria-label^='Region']").click();
    await page.locator("a[href='/gcc/']").first().click();
    await expect(page).toHaveURL(/\/gcc\/$/);
    const cookie = (await context.cookies()).find((c) => c.name === "region");
    expect(cookie?.value).toBe("gcc");
    expect(await page.getAttribute("html", "lang")).toMatch(/en-/);
  });
});

test.describe("legacy redirects", () => {
  const table = JSON.parse(fs.readFileSync(path.join(process.cwd(), "lib/generated/redirects.json"), "utf8")) as Record<string, [string, number]>;
  /** The old homepage URLs land on "/" on purpose; the second hop is the geo decision (docs/deploy.md). */
  const toRoot = Object.entries(table).filter(([, [to]]) => to === "/").map(([from]) => from);

  test("every row resolves in one hop to a 200 (homepage rows via the geo redirect)", async ({ request }) => {
    const bad: string[] = [];
    for (const [from, [to, status]] of Object.entries(table)) {
      const res = await request.get(from, { maxRedirects: 0 });
      if (res.status() !== (status === 302 ? 302 : 301)) {
        bad.push(`${from}: ${res.status()} (expected ${status})`);
        continue;
      }
      const loc = res.headers()["location"] ?? "";
      if (to.startsWith("http")) continue;
      const target = await request.get(loc, { maxRedirects: 0 });
      if (toRoot.includes(from)) {
        if (target.status() !== 307) bad.push(`${from} -> ${loc}: ${target.status()} (expected the geo 307)`);
      } else if (target.status() === 307 && /^\/(case-studies|insights\/events|solutions|services)\/./.test(to)) {
        // A detail page whose row is still unpublished falls back to its listing (lib/data/unpublished.ts); the listing must answer 200.
        const listing = await request.get(target.headers()["location"] ?? "", { maxRedirects: 0 });
        if (listing.status() !== 200) bad.push(`${from} -> ${loc} -> listing: ${listing.status()}`);
      } else if (target.status() !== 200) {
        bad.push(`${from} -> ${loc}: ${target.status()}`);
      }
    }
    expect(bad, bad.join("\n")).toEqual([]);
  });

  test("/e-invoicing-uae lands on /gcc/ in one hop (BUG-018)", async ({ request }) => {
    const res = await request.get("/e-invoicing-uae", { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()["location"]).toMatch(/\/gcc\/$/);
  });
});
