/**
 * Projection for public/media/images/world-dots.svg (generated with dotted-map, height 56, grid "vertical").
 * The map spans lat −56…71 and lng −179…179: linear in longitude, Mercator in latitude.
 * Returns percentages so pins can be positioned over the <img>.
 */
const LNG_MIN = -179;
const LNG_MAX = 179;
const LAT_MIN = -56;
const LAT_MAX = 71;

const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const Y_TOP = mercY(LAT_MAX);
const Y_BOTTOM = mercY(LAT_MIN);

export const WORLD_MAP = { src: "images/world-dots.svg", lightSrc: "images/world-dots-light.svg", width: 118, height: 56 } as const;

export function projectToPercent(lat: number, lng: number): { left: number; top: number } {
  const left = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const top = ((Y_TOP - mercY(lat)) / (Y_TOP - Y_BOTTOM)) * 100;
  return { left: Math.min(100, Math.max(0, left)), top: Math.min(100, Math.max(0, top)) };
}
