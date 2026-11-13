import type { SVGProps } from "react";

/**
 * Inline icons. Figma vectors were exported from the design file (node ids in docs/asset-manifest.md), optimised with
 * SVGO and recoloured to currentColor so they inherit the text colour. A few UI glyphs the design does not include
 * (menu, close, globe, external, chevron-right) are drawn in the same 1.5px stroke style.
 * Industry icons (industry-*) come from the _D exports in design-src; difference-1..6 from the "The adamas difference" exports.
 */
const ICONS = {
  "facebook": { viewBox: "0 0 16 16", html: "<path fill=\"currentColor\" d=\"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.481 8h.863l.115-1.078H8.48l.002-.539c0-.28.026-.431.43-.431h.54V4.874h-.864c-1.036 0-1.402.523-1.402 1.402v.646H6.54V8h.646v3.127H8.48z\"/>" },
  "linkedin": { viewBox: "0 0 16 16", html: "<path fill=\"currentColor\" d=\"M4.867.6C5.867.2 6.933 0 8 0s2.133.2 3.133.6 1.867 1 2.534 1.733 1.266 1.534 1.733 2.534.6 2 .6 3.133-.2 2.133-.6 3.133-1 1.867-1.733 2.534-1.534 1.266-2.534 1.733S9.067 16 8 16s-2.133-.2-3.133-.6-1.867-1-2.534-1.733S1.067 12.133.6 11.133 0 9.067 0 8s.2-2.133.6-3.133S1.6 3 2.333 2.333 3.867 1.067 4.867.6m-.2 4.733c.4 0 .733-.133 1-.333.266-.2.333-.533.333-.867a.95.95 0 0 0-.4-.8C5.333 3.133 5.067 3 4.667 3s-.734.133-.934.333-.4.467-.4.8c0 .334.134.6.334.867s.6.333 1 .333m1 6.667V6.333h-2V12zM13 12V9q0-1.4-.6-2.2c-.4-.533-1-.8-1.733-.8-.4 0-.734.133-1 .333-.267.2-.534.534-.6.867L9 6.333H7l.067 1.334V12h2V9c0-.4.066-.733.266-1s.4-.333.734-.333.6.133.733.333.267.533.267 1v3z\" opacity=\".8\"/>" },
  "twitter": { viewBox: "0 0 16 16", html: "<path fill=\"currentColor\" d=\"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.31-2.128a2.8 2.8 0 0 1-.809.222 1.4 1.4 0 0 0 .62-.78 2.8 2.8 0 0 1-.894.343 1.408 1.408 0 0 0-2.4 1.284 4 4 0 0 1-2.9-1.471 1.406 1.406 0 0 0 .435 1.88 1.4 1.4 0 0 1-.638-.177v.018c0 .682.485 1.25 1.13 1.38a1.4 1.4 0 0 1-.636.024c.179.56.699.967 1.315.978a2.82 2.82 0 0 1-2.085.583 4 4 0 0 0 2.159.632c2.589 0 4.005-2.145 4.005-4.005q0-.091-.005-.182a2.9 2.9 0 0 0 .703-.729\" opacity=\".8\"/>" },
  "youtube": { viewBox: "0 0 16 16", html: "<path fill=\"currentColor\" d=\"M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m.032 4.533c-2.164 0-3.829.25-3.833.25h.083c-.416 0-.75.25-.875.625v.042c0 .042 0 .084-.04.125-.042.417-.168 1.292-.168 2.291 0 1 .126 1.876.167 2.292 0 .042 0 .084.041.125v.042a.9.9 0 0 0 .875.625H4.2c.012.002 1.633.25 3.833.25 2.167 0 3.834-.25 3.834-.25h-.084a.9.9 0 0 0 .875-.625v-.042c0-.041 0-.083.042-.125.042-.416.167-1.292.167-2.292s-.083-1.874-.167-2.29c0-.042 0-.084-.042-.126v-.042a.9.9 0 0 0-.875-.625h.084s-1.625-.25-3.834-.25m-.829 1.661a.29.29 0 0 1 .273 0L9.61 7.738a.35.35 0 0 1 .091.228c.045.09 0 .181-.09.226L7.475 9.736c-.046.045-.09.045-.136.045s-.091 0-.137-.045a.25.25 0 0 1-.136-.227V6.422a.25.25 0 0 1 .136-.228\" opacity=\".8\"/>" },
  "arrow": { viewBox: "0 0 16 16", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.133\" d=\"M3.332 8h9.333M8.668 4l4 4-4 4\"/>" },
  "chevron-down": { viewBox: "0 0 10 6", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m1 1 4 4 4-4\"/>" },
  "phone": { viewBox: "0 0 12 12", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M7.132 3.067a2.27 2.27 0 0 1 1.792 1.792zm0-1.815a4.084 4.084 0 0 1 3.607 3.603zm3.153 7.224v1.361a.91.91 0 0 1-.989.908A9 9 0 0 1 5.38 9.35a8.85 8.85 0 0 1-2.722-2.72 9 9 0 0 1-1.394-3.934.91.91 0 0 1 .903-.99H3.53a.91.91 0 0 1 .907.78q.087.657.318 1.276a.91.91 0 0 1-.204.957l-.577.577a7.26 7.26 0 0 0 2.723 2.722l.576-.576a.91.91 0 0 1 .958-.204c.411.154.84.26 1.275.318.456.064.792.46.78.92\"/>" },
  "mail-small": { viewBox: "0 0 13 11", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.011\" d=\"M1.704.505h9.592c.66 0 1.199.54 1.199 1.2v7.193c0 .66-.54 1.199-1.2 1.199h-9.59c-.66 0-1.2-.54-1.2-1.2V1.705c0-.659.54-1.199 1.2-1.199\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.011\" d=\"M12.495 1.704 6.5 5.901.505 1.704\"/>" },
  "mail": { viewBox: "0 0 22 18", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 1h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m21 3-10 7L1 3\"/>" },
  "user": { viewBox: "0 0 18 20", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M17 19v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"5\" r=\"4\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"/>" },
  "global-delivery": { viewBox: "0 0 20 20", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.417\" d=\"M17.5 10a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.417\" d=\"M2.5 10h5.626m0 0h3.748m-3.748 0C8.103 6.978 8.728 3.984 10 2.5c1.272 1.484 1.897 4.478 1.874 7.5m-3.748 0c.021 2.918.646 5.863 1.874 7.5 1.228-1.637 1.853-4.582 1.874-7.5m0 0H17.5\"/>" },
  "senior-led": { viewBox: "0 0 20 20", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.417\" d=\"M10.833 6.667a3.333 3.333 0 1 1-6.667 0 3.333 3.333 0 0 1 6.667 0M1.666 17.5a5.833 5.833 0 0 1 11.667 0\"/>" },
  "quality": { viewBox: "0 0 20 20", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.417\" d=\"M10 18.333S16.668 15 16.668 9.167v-5l-6.666-2.5-6.667 2.5v5c0 5.833 6.667 9.166 6.667 9.166\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.417\" d=\"m7.5 10 1.667 1.667L12.5 7.5\"/>" },
  "thumbs-up": { viewBox: "0 0 23 23", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.029\" d=\"m6.257 10.451 4.194-9.437a3.146 3.146 0 0 1 3.146 3.146v4.194h5.935a2.097 2.097 0 0 1 2.097 2.412l-1.447 9.437a2.1 2.1 0 0 1-2.097 1.782H6.257m0-11.534v11.534m0-11.534H3.111a2.097 2.097 0 0 0-2.097 2.098v7.34c0 1.158.94 2.096 2.097 2.096h3.146\"/>" },
  "shield": { viewBox: "0 0 18 22", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.002\" d=\"M9 20.999s7.999-4 7.999-10V4.002l-8-3-7.998 3V11C1 16.999 9 20.999 9 20.999\"/>" },
  menu: { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"1.75\" d=\"M3 6h18M3 12h18M3 18h18\"/>" },
  close: { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"1.75\" d=\"m5 5 14 14M19 5 5 19\"/>" },
  globe: { viewBox: "0 0 16 16", html: "<circle cx=\"8\" cy=\"8\" r=\"6.5\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path stroke=\"currentColor\" stroke-width=\"1.2\" d=\"M1.5 8h13M8 1.5c-2 2.2-2 10.8 0 13M8 1.5c2 2.2 2 10.8 0 13\"/>" },
  external: { viewBox: "0 0 12 12", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.2\" d=\"M3.5 8.5l5-5M4 3.5h4.5V8\"/>" },
  "chevron-right": { viewBox: "0 0 18 18", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m7 4.5 4.5 4.5L7 13.5\"/>" },
  "industry-healthcare": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1.1-1.1-1.1a5.515 5.515 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M5.5 12h3L10 9l2.5 6 1.5-3h4\"/>" },
  "industry-financial-services": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.2\" d=\"M3 9h2m0 0h4M5 9v11M9 9h6M9 9v11m6-11h4m-4 0v11m4-11h2m-2 0v11M5 20H3m2 0h4m0 0h6m0 0h4m0 0h2M2 7l10-5 10 5z\"/>" },
  "industry-retail": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0m11 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M1 2h3l1.324 5m0 0L7.6 15.6a2 2 0 0 0 2 1.4h9.8a2 2 0 0 0 2-1.6L23 7zm0 0H5\"/>" },
  "industry-education": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"m2 9 10-6 10 6-10 6z\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M6 11.5V16c3.5 3 8.5 3 12 0v-4.5M22 9v6\"/>" },
  "industry-technology": { viewBox: "0 0 24 24", html: "<g stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" clip-path=\"url(#a)\"><path d=\"M8.5 7h7A1.5 1.5 0 0 1 17 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 15.5v-7A1.5 1.5 0 0 1 8.5 7\"/><path d=\"M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3m-13-5h4v4h-4z\"/></g>" },
  "industry-manufacturing": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M3 4v17h19M5 17l5-6 4 3 6-8 2 2\"/>" },
  "industry-government": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M3 22h2m0 0h14M5 22V9m14 13h2m-2 0V9M5 9h14M5 9H3l9-6 9 6h-2M9 12v6m6-6v6\"/>" },
  "industry-energy": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M13 2 4 14h7l-1 8L20 9h-7z\"/>" },
  "industry-legal": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M12 3v3m0 0v15m0-15H5m7 0h7m-7 15H8m4 0h4M3 6l-3 7h6zm18 0-3 7h6z\"/>" },
  "industry-software-development": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"m8 8-5 4 5 4m8-8 5 4-5 4M14 5l-4 14\"/>" },
  "industry-marketing-agencies": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"m3 11 18-7v14L3 12z\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M5 13v5a2 2 0 0 0 2 2h3l-2-6m13-5a3 3 0 0 1 0 4\"/>" },
  "industry-startups": { viewBox: "0 0 24 24", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M4 16c-2 1-2 5-2 5s4 0 5-2l3-4-2-2zm5-3 5 5c4-2 7-7 8-16-9 1-14 4-16 8z\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M17 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0\"/>" },
  "difference-1": { viewBox: "0 0 56 56", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M11.42 20.21 28 11l16.579 9.21-16.58 9.211z\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M11.42 27.58 28 36.79l16.579-9.21\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M11.42 34.948 28 44.158l16.579-9.21\"/>" },
  "difference-2": { viewBox: "0 0 56 56", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M16.844 37.995h20.43a6.58 6.58 0 0 0 4.64-1.645 6.17 6.17 0 0 0 2.08-4.34 6.13 6.13 0 0 0-1.7-4.49 6.55 6.55 0 0 0-4.482-2.014 10.12 10.12 0 0 0-3.524-5.244 10.7 10.7 0 0 0-6.033-2.247 10.75 10.75 0 0 0-6.248 1.604 10.22 10.22 0 0 0-4.088 4.847 7.32 7.32 0 0 0-4.064 2.214 6.9 6.9 0 0 0-1.834 4.151 6.85 6.85 0 0 0 1.156 4.374 7.23 7.23 0 0 0 3.667 2.79\"/>" },
  "difference-3": { viewBox: "0 0 56 56", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"m28 15.106 9.947 3.741V26.8c0 7.25-4.263 12.16-9.947 15.201-5.684-3.04-9.947-7.951-9.947-15.201v-7.952z\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"m23.21 27.05 3.317 3.16 6.631-7\"/>" },
  "difference-4": { viewBox: "0 0 56 56", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"m21.369 21-8.843 7 8.843 7m13.263-14 8.842 7-8.842 7m-3.316-17.684-6.631 21.368\"/>" },
  "difference-5": { viewBox: "0 0 56 56", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M29 20.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M15 37c.75-6.486 4.25-10 9.5-10s8.75 3.514 9.5 10m-1-20c1.142.25 2.156.828 2.881 1.643S37 20.465 37 21.5s-.394 2.041-1.119 2.857C35.156 25.172 34.142 25.75 33 26m4 3c2.955 1.29 4.545 4.129 5 8\"/>" },
  "difference-6": { viewBox: "0 0 56 56", html: "<path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M41 28c0 7.18-5.82 13-13 13s-13-5.82-13-13 5.82-13 13-13 13 5.82 13 13\"/><path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 28h5.688m0 0h14.625m-14.626 0q0-5.688 7.313-13 7.313 7.312 7.313 13m-14.626 0q0 5.688 7.313 13 7.313-7.312 7.313-13m0 0H41m-24-7h22M17 34h22\"/>" },
  calendar: { viewBox: "0 0 16 16", html: "<rect x=\"2\" y=\"3\" width=\"12\" height=\"11\" rx=\"1.5\" stroke=\"currentColor\" stroke-width=\"1.3\"/><path stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" d=\"M2 6.5h12M5.5 1.5v3M10.5 1.5v3\"/>" },
  layers: { viewBox: "0 0 16 16", html: "<path stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linejoin=\"round\" d=\"M8 2 2 5.5 8 9l6-3.5zM2 8.5 8 12l6-3.5M2 11.5 8 15l6-3.5\"/>" },
  chart: { viewBox: "0 0 16 16", html: "<path stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" d=\"M2 14h12M4 11V7M8 11V4M12 11V6\"/>" },
  check: { viewBox: "0 0 16 16", html: "<path stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m3 8.5 3 3 7-7\"/>" },
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Rendered size in px (width; height follows the viewBox ratio). */
  size?: number;
  /** Accessible label; without one the icon is decorative (aria-hidden). */
  label?: string;
}

export function Icon({ name, size = 16, label, className, ...rest }: IconProps) {
  const icon = ICONS[name];
  const [, , vw, vh] = icon.viewBox.split(" ").map(Number);
  const height = Math.round((size * vh) / vw * 100) / 100;
  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={height}
      fill="none"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.html }}
      {...rest}
    />
  );
}
