import L from "leaflet";

function pinSvg(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${fill}" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/></svg>`;
}

function ringStyle(color: string): string {
  return `background:${color};`;
}

export function createShipmentMapMarkerIcon(options: {
  color: string;
  pulseColor?: string;
  animate?: boolean;
  compact?: boolean;
}) {
  const { color, pulseColor = color, animate = true, compact = false } = options;
  const size = compact ? 40 : 48;
  const anchorY = compact ? 36 : 42;
  const pin = pinSvg(color);
  const ringCss = ringStyle(
    pulseColor.startsWith("#")
      ? `${pulseColor}73`
      : pulseColor,
  );

  return L.divIcon({
    className: "",
    html: `<div class="estimated-location-marker${animate ? "" : " estimated-location-marker--static"}" aria-hidden="true"><div class="estimated-location-marker__rings"><span class="estimated-location-marker__ring" style="${ringCss}"></span><span class="estimated-location-marker__ring estimated-location-marker__ring--delay" style="${ringCss}"></span></div><div class="estimated-location-marker__pin">${pin}</div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, anchorY],
    popupAnchor: [0, -anchorY],
  });
}

export const MAP_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
