# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: region.spec.ts >> legacy redirects >> every row resolves in one hop to a 200 (homepage rows via the geo redirect)
- Location: tests\e2e\region.spec.ts:78:7

# Error details

```
Error: /sap-inter-company-reconciliation-functionalities -> /case-studies/sap-intercompany-reconciliation: 307
/sap-inter-company-reconciliation -> /case-studies/sap-intercompany-reconciliation: 307
/ai-smarter-spaces-traffic-monitoring -> /case-studies/ai-traffic-monitoring: 307
/crowd-movement -> /case-studies/face-recognition: 307
/house-of-lords -> /insights/events/house-of-lords-2026: 307

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 7

- Array []
+ Array [
+   "/sap-inter-company-reconciliation-functionalities -> /case-studies/sap-intercompany-reconciliation: 307",
+   "/sap-inter-company-reconciliation -> /case-studies/sap-intercompany-reconciliation: 307",
+   "/ai-smarter-spaces-traffic-monitoring -> /case-studies/ai-traffic-monitoring: 307",
+   "/crowd-movement -> /case-studies/face-recognition: 307",
+   "/house-of-lords -> /insights/events/house-of-lords-2026: 307",
+ ]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import fs from "node:fs";
  3   | import path from "node:path";
  4   | 
  5   | /** Region routing on bare "/", the /ae/ to /gcc/ move, the region cookie, and the legacy redirect table. */
  6   | 
  7   | const COUNTRY_CASES: [string | null, string][] = [
  8   |   ["IN", "/in/"],
  9   |   ["GB", "/uk/"],
  10  |   ["IE", "/uk/"],
  11  |   ["AE", "/gcc/"],
  12  |   ["SA", "/gcc/"],
  13  |   ["QA", "/gcc/"],
  14  |   ["KW", "/gcc/"],
  15  |   ["BH", "/gcc/"],
  16  |   ["OM", "/gcc/"],
  17  |   ["US", null as unknown as string],
  18  |   [null, null as unknown as string],
  19  | ];
  20  | 
  21  | test.describe("bare / routing", () => {
  22  |   for (const [country, expected] of COUNTRY_CASES) {
  23  |     test(`country ${country ?? "(none)"} -> ${expected ?? "DEFAULT_REGION"}`, async ({ request }) => {
  24  |       const res = await request.get("/", { maxRedirects: 0, headers: country ? { "x-vercel-ip-country": country } : {} });
  25  |       expect(res.status()).toBe(307);
  26  |       const loc = res.headers()["location"];
  27  |       if (expected) expect(loc).toMatch(new RegExp(`${expected.replace(/\//g, "\\/")}$`));
  28  |       else expect(loc).toMatch(/\/(in|uk|gcc)\/$/);
  29  |       expect(res.headers()["cache-control"]).toContain("no-store");
  30  |     });
  31  |   }
  32  | 
  33  |   test("the region cookie beats the country; a legacy ae cookie still works", async ({ request }) => {
  34  |     const r1 = await request.get("/", { maxRedirects: 0, headers: { "x-vercel-ip-country": "IN", cookie: "region=uk" } });
  35  |     expect(r1.headers()["location"]).toMatch(/\/uk\/$/);
  36  |     const r2 = await request.get("/", { maxRedirects: 0, headers: { "x-vercel-ip-country": "IN", cookie: "region=ae" } });
  37  |     expect(r2.headers()["location"]).toMatch(/\/gcc\/$/);
  38  |     const r3 = await request.get("/?x=1", { maxRedirects: 0, headers: { cookie: "region=in" } });
  39  |     expect(r3.headers()["location"]).toMatch(/\/in\/\?x=1$/);
  40  |   });
  41  | 
  42  |   test("/ae/ and anything under it is a single 301 to /gcc/", async ({ request }) => {
  43  |     for (const p of ["/ae", "/ae/", "/ae/anything?x=1"]) {
  44  |       const res = await request.get(p, { maxRedirects: 0 });
  45  |       expect(res.status(), p).toBe(301);
  46  |       expect(res.headers()["location"], p).toMatch(/\/gcc\/(\?x=1)?$/);
  47  |     }
  48  |     const home = await request.get("/gcc/", { maxRedirects: 0 });
  49  |     expect(home.status()).toBe(200);
  50  |   });
  51  | 
  52  |   test("homepages are canonical with a trailing slash; inner pages without", async ({ request }) => {
  53  |     const a = await request.get("/in", { maxRedirects: 0 });
  54  |     expect(a.status()).toBe(308);
  55  |     expect(a.headers()["location"]).toMatch(/\/in\/$/);
  56  |     const b = await request.get("/services/", { maxRedirects: 0 });
  57  |     expect(b.status()).toBe(308);
  58  |     expect(b.headers()["location"]).toMatch(/\/services$/);
  59  |     for (const p of ["/IN/", "/xx/", "/in/extra"]) expect((await request.get(p, { maxRedirects: 0 })).status(), p).toBe(404);
  60  |   });
  61  | 
  62  |   test("the region switcher sets the cookie and swaps the homepage", async ({ page, context }) => {
  63  |     await page.goto("/in/");
  64  |     await page.locator("summary[aria-label^='Region']").click();
  65  |     await page.locator("a[href='/gcc/']").first().click();
  66  |     await expect(page).toHaveURL(/\/gcc\/$/);
  67  |     const cookie = (await context.cookies()).find((c) => c.name === "region");
  68  |     expect(cookie?.value).toBe("gcc");
  69  |     expect(await page.getAttribute("html", "lang")).toMatch(/en-/);
  70  |   });
  71  | });
  72  | 
  73  | test.describe("legacy redirects", () => {
  74  |   const table = JSON.parse(fs.readFileSync(path.join(process.cwd(), "lib/generated/redirects.json"), "utf8")) as Record<string, [string, number]>;
  75  |   /** The old homepage URLs land on "/" on purpose; the second hop is the geo decision (docs/deploy.md). */
  76  |   const toRoot = Object.entries(table).filter(([, [to]]) => to === "/").map(([from]) => from);
  77  | 
  78  |   test("every row resolves in one hop to a 200 (homepage rows via the geo redirect)", async ({ request }) => {
  79  |     const bad: string[] = [];
  80  |     for (const [from, [to, status]] of Object.entries(table)) {
  81  |       const res = await request.get(from, { maxRedirects: 0 });
  82  |       if (res.status() !== (status === 302 ? 302 : 301)) {
  83  |         bad.push(`${from}: ${res.status()} (expected ${status})`);
  84  |         continue;
  85  |       }
  86  |       const loc = res.headers()["location"] ?? "";
  87  |       if (to.startsWith("http")) continue;
  88  |       const target = await request.get(loc, { maxRedirects: 0 });
  89  |       if (toRoot.includes(from)) {
  90  |         if (target.status() !== 307) bad.push(`${from} -> ${loc}: ${target.status()} (expected the geo 307)`);
  91  |       } else if (target.status() !== 200) {
  92  |         bad.push(`${from} -> ${loc}: ${target.status()}`);
  93  |       }
  94  |     }
> 95  |     expect(bad, bad.join("\n")).toEqual([]);
      |                                 ^ Error: /sap-inter-company-reconciliation-functionalities -> /case-studies/sap-intercompany-reconciliation: 307
  96  |   });
  97  | 
  98  |   test("/e-invoicing-uae lands on /gcc/ in one hop (BUG-018)", async ({ request }) => {
  99  |     const res = await request.get("/e-invoicing-uae", { maxRedirects: 0 });
  100 |     expect(res.status()).toBe(301);
  101 |     expect(res.headers()["location"]).toMatch(/\/gcc\/$/);
  102 |   });
  103 | });
  104 | 
```