import { SiteChrome } from "@/components/nav/SiteChrome";

/** Global inner pages: one British-English version, header region resolved from the visitor's cookie in the browser. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteChrome region={null}>{children}</SiteChrome>;
}
