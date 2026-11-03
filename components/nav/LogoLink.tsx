"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { mediaUrl } from "@/lib/media";
import { regionFromPath, useRegionCookie } from "./regionClient";

/**
 * Logo → the visitor's regional homepage (current homepage, else region cookie, else "/" which
 * proxy.ts resolves). Over dark surfaces the logo is shown reversed (white).
 */
export function LogoLink({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const pathname = usePathname();
  const cookie = useRegionCookie();
  const region = regionFromPath(pathname) ?? cookie;
  const href = region ? `/${region}/` : "/";

  return (
    // prefetch={true}: per-link prefetch of the (static) homepage, so going home from any page renders straight away.
    <Link href={href} prefetch={true} className={cx("relative block shrink-0", className)}>
      <Image
        src={mediaUrl("brand/logo.webp")}
        alt="AdamasTech Consulting"
        width={236}
        height={69}
        loading="eager"
        fetchPriority="high"
        className={cx(
          "h-10 w-auto transition-[filter] duration-(--duration-base) lg:h-[3.25rem]",
          // TODO(content): replace with the official reversed SVG logo when supplied (CONTENT_TODO: Brand).
          tone === "dark" && "brightness-0 invert",
        )}
      />
    </Link>
  );
}
