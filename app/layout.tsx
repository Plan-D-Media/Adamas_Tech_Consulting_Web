import type { Metadata, Viewport } from "next";
import { Figtree, Manrope, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/**
 * Three families carry the approved design (docs/design-tokens.md): Manrope for headings, eyebrows and section
 * copy, Roboto for the nav, hero and card titles, Figtree for descriptors, footer and small text. All three are
 * variable Google fonts, self-hosted by next/font (latin subset, swap). Only Manrope is preloaded: it paints the
 * largest above-the-fold text; the other two load with the first paint of their elements.
 */
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto", display: "swap", preload: false });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap", preload: false });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const blockIndexing = process.env.BLOCK_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AdamasTech Consulting", template: "%s | AdamasTech Consulting" },
  robots: blockIndexing ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#000c33",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Root layout: document shell only. The header and footer live in the two child layouts (app/[region]/layout.tsx
 * and app/(site)/layout.tsx) so the regional homepages can tell the header their region server-side.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${manrope.variable} ${roboto.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body>
        {/* Adds the `js` class to <html> before hydration (a hook for scripts and styles). Pre-reveal styles must gate on
            `@media (scripting: enabled)` rather than this class, so nothing is hidden with JavaScript off. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        {children}
      </body>
    </html>
  );
}
