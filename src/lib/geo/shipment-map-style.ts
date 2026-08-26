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
