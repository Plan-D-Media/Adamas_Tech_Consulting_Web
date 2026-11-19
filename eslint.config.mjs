import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // The QA chain builds each configuration into its own dist dir (NEXT_DIST_DIR); they are build output too.
    ".next-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Unintegrated drop-in brief (three.js orb), not site source and not in the tsconfig program either.
    "handoff/**",
    // QA evidence (Playwright HTML reports, traces) is generated output, not source.
    "docs/qa/evidence/**",
  ]),
]);

export default eslintConfig;
