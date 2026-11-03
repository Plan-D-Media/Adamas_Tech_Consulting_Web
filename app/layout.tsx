import type { Metadata, Viewport } from "next";
import { Archivo, Figtree } from "next/font/google";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Interactions } from "@/components/motion/Interactions";
import Script from "next/script";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const blockIndexing = process.env.BLOCK_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AdamasTech Consulting", template: "%s | AdamasTech Consulting" },
  robots: blockIndexing ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#071c36",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body>
        {/* Adds the `js` class to <html> (a hook for scripts and styles). The CSS that hides pre-reveal states does not
            wait for it: it is gated on `@media (scripting: enabled)` (globals.css), which applies from first paint,
            whereas Next runs inline beforeInteractive scripts from its bootstrap. With JS off, everything stays visible. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        <MotionProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <SmoothScroll />
        <Interactions />
      </body>
    </html>
  );
}
