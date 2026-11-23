import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * End-to-end regression suite (tests/e2e). Runs against a production build: `npm run build && npm run test:e2e`.
 * The config starts `next start` on port 3100 unless a server already answers there (E2E_BASE_URL points elsewhere).
 * The server reads .env, so the suite tests whatever PREVIEW_DRAFTS the build was made with; the draft-leak checks
 * only assert when drafts are off (they report the mode otherwise). Set E2E_ALL_BROWSERS=1 to add Firefox and WebKit.
 *
 * Playwright browsers on this machine live in E:/ms-playwright: PLAYWRIGHT_BROWSERS_PATH=E:/ms-playwright npm run test:e2e
 */
function readEnvFile(): Record<string, string> {
  const out: Record<string, string> = {};
  const file = path.join(__dirname, ".env");
  if (!fs.existsSync(file)) return out;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
  }
  return out;
}

const envFile = readEnvFile();
const env = (k: string) => process.env[k] ?? envFile[k];
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const port = Number(new URL(baseURL).port || 80);

// Tell the specs which configuration the server runs (process.env is passed through to the workers).
process.env.E2E_PREVIEW_DRAFTS = env("PREVIEW_DRAFTS") === "true" && env("SITE_ENV") !== "production" ? "true" : "false";
process.env.E2E_DRAFT_BADGES = env("SHOW_DRAFT_BADGES") === "true" ? "true" : "false";
process.env.E2E_PREVIEW_USERNAME = env("PREVIEW_USERNAME") ?? "";
process.env.E2E_PREVIEW_PASSWORD = env("PREVIEW_PASSWORD") ?? "";
process.env.E2E_DATABASE_URL = env("DATABASE_URL") ?? "";

const all = process.env.E2E_ALL_BROWSERS === "1";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "docs/qa/evidence/e2e-report" }]],
  outputDir: "docs/qa/evidence/e2e-results",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    httpCredentials: process.env.E2E_PREVIEW_USERNAME ? { username: process.env.E2E_PREVIEW_USERNAME, password: process.env.E2E_PREVIEW_PASSWORD ?? "" } : undefined,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        // SwiftShader so the homepage's 3D orb has a WebGL context in headless; without it the suite would only
        // ever exercise the poster fallback (components/home/DifferenceOrb.tsx).
        launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
      },
    },
    ...(all
      ? [
          { name: "firefox", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
          { name: "webkit", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
        ]
      : []),
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${port}`,
        url: `${baseURL}/in/`,
        reuseExistingServer: true,
        timeout: 120_000,
        env: { NODE_OPTIONS: "--max-old-space-size=2048" },
      },
});
