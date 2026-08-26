import L from "leaflet";
import type { FreightMode } from "@/types";

export type ShipmentMapMarkerMode = "air" | "ocean" | "road" | "pin";

export const FREIGHT_MODE_MAP: Record<
  FreightMode,
  {
    key: Exclude<ShipmentMapMarkerMode, "pin">;
    label: string;
    /** Marker / lane color for this mode */
    color: string;
    /** Soft pulse fill */
    pulse: string;
  }
> = {
  "Air Freight": {
    key: "air",
    label: "Air",
    color: "#0B3A66",
    pulse: "#0B3A6673",
  },
  "Ocean Freight": {
    key: "ocean",
    label: "Ocean",
    color: "#E8890C",
    pulse: "#E8890C73",
  },
  "Road Freight": {
    key: "road",
    label: "Road",
    color: "#38BDF8",
    pulse: "#38BDF873",
  },
};

function pinSvg(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${fill}" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/></svg>`;
}

/** North-facing top-down plane — rotate via CSS using geographic bearing. */
function planeSvg(fill: string): string {
  // Fuselage + swept wings + tailplane (nose up / north).
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
  <g fill="${fill}" stroke="#fff" stroke-width="1" stroke-linejoin="round">
    <path d="M11.15 2.4c0-.55.4-.9.85-.9s.85.35.85.9v12.35c0 .4-.3.7-.7.7h-.3c-.4 0-.7-.3-.7-.7V2.4Z"/>
    <path d="M12 7.1 3.4 11.2c-.35.18-.5.55-.35.9.1.25.35.4.6.4H11.2V7.1h.8v4.4h7.55c.25 0 .5-.15.6-.4.15-.35 0-.72-.35-.9L12 7.1Z"/>
    <path d="M12 16.6 8.2 19.1c-.3.2-.4.55-.25.85.1.2.3.35.55.35h7c.25 0 .45-.15.55-.35.15-.3.05-.65-.25-.85L12 16.6Z"/>
    <path d="M11.35 19.9h1.3V21.6c0 .35-.3.65-.65.65s-.65-.3-.65-.65V19.9Z"/>
  </g>
</svg>`;
}

/** Filled ship glyph (ocean cargo). */
function shipSvg(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path fill="${fill}" stroke="#fff" stroke-width="1.25" stroke-linejoin="round" d="M4 10h16l-1.2 2.4A11.5 11.5 0 0 1 20.5 19H3.5a11.5 11.5 0 0 1 1.7-6.6L4 10Z"/><path fill="${fill}" stroke="#fff" stroke-width="1.25" stroke-linejoin="round" d="M8 10V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V10"/><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" d="M12 5V3"/><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" d="M3 20.5c.5.4 1.1.8 2.2.8 2.2 0 2.2-1.6 4.3-1.6s2.2 1.6 4.3 1.6 2.2-1.6 4.3-1.6c1.1 0 1.7.4 2.2.8"/></svg>`;
}

/** Filled truck glyph (road cargo). */
function truckSvg(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path fill="${fill}" stroke="#fff" stroke-width="1.25" stroke-linejoin="round" d="M1.5 16.5V6.5A1.5 1.5 0 0 1 3 5h9.5A1.5 1.5 0 0 1 14 6.5V16.5H1.5Z"/><path fill="${fill}" stroke="#fff" stroke-width="1.25" stroke-linejoin="round" d="M14 9h3.2c.3 0 .6.1.8.3l2.7 3.1c.2.2.3.5.3.8V16.5H14V9Z"/><circle cx="6.5" cy="17.5" r="2" fill="${fill}" stroke="#fff" stroke-width="1.25"/><circle cx="17.5" cy="17.5" r="2" fill="${fill}" stroke="#fff" stroke-width="1.25"/></svg>`;
}

function modeGlyph(mode: ShipmentMapMarkerMode, fill: string): string {
  switch (mode) {
    case "air":
      return planeSvg(fill);
    case "ocean":
      return shipSvg(fill);
    case "road":
      return truckSvg(fill);
    default:
      return pinSvg(fill);
  }
}

function ringStyle(color: string): string {
  return `background:${color};`;
}

export function createShipmentMapMarkerIcon(options: {
  color: string;
  pulseColor?: string;
  animate?: boolean;
  compact?: boolean;
  /** Freight mode glyph — defaults to generic pin. */
  mode?: ShipmentMapMarkerMode;
  /**
   * Geographic bearing in degrees (0 = north, clockwise).
   * Applied to air markers so the nose follows the lane.
   */
  bearing?: number;
}) {
  const {
    color,
    pulseColor = color,
    animate = true,
    compact = false,
    mode = "pin",
    bearing,
  } = options;
  const size = compact ? 40 : 48;
  const centered = mode === "air";
  const anchorY = centered ? size / 2 : compact ? 36 : 42;
  const glyph = modeGlyph(mode, color);
  const ringCss = ringStyle(
    pulseColor.startsWith("#") && pulseColor.length === 7
      ? `${pulseColor}73`
      : pulseColor,
  );
  const rotation =
    mode === "air" && typeof bearing === "number" && Number.isFinite(bearing)
      ? bearing
      : null;
  const pinTransform = centered
    ? rotation != null
      ? `translate(-50%, -50%) rotate(${rotation}deg)`
      : "translate(-50%, -50%)"
    : rotation != null
      ? `translateX(-50%) rotate(${rotation}deg)`
      : "translateX(-50%)";
  const pinStyle = ` style="transform:${pinTransform};transform-origin:center center;"`;

  return L.divIcon({
    className: "",
    html: `<div class="estimated-location-marker${animate ? "" : " estimated-location-marker--static"}${centered ? " estimated-location-marker--centered" : ""}" aria-hidden="true"><div class="estimated-location-marker__rings"><span class="estimated-location-marker__ring" style="${ringCss}"></span><span class="estimated-location-marker__ring estimated-location-marker__ring--delay" style="${ringCss}"></span></div><div class="estimated-location-marker__pin"${pinStyle}>${glyph}</div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, anchorY],
    popupAnchor: [0, centered ? -size / 2 : -anchorY],
  });
}

/**
 * Esri World Street Map — primarily English/Latin labels.
 * (OSM default and some CARTO styles show local scripts, e.g. Urdu.)
 */
export const MAP_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

export const MAP_TILE_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, OpenStreetMap contributors";

/** Unused by Esri URL (no {s}); kept for Leaflet TileLayer compatibility. */
export const MAP_TILE_SUBDOMAINS = "abcd";
