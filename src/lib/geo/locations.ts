export type GeoPoint = {
  lat: number;
  lng: number;
  label: string;
};

type LocationEntry = GeoPoint & {
  /** Extra match tokens (normalized separately). */
  aliases?: readonly string[];
};

/** Common origin/destination hubs for estimated route maps. */
const LOCATION_COORDS: readonly LocationEntry[] = [
  { label: "Mumbai", lat: 18.9388, lng: 72.8354 },
  { label: "Nhava Sheva", lat: 18.95, lng: 72.95 },
  { label: "JNPA", lat: 18.95, lng: 72.95 },
  { label: "Mundra", lat: 22.8397, lng: 69.7245 },
  { label: "Chennai", lat: 13.0827, lng: 80.2707 },
  { label: "Kolkata", lat: 22.5726, lng: 88.3639 },
  {
    label: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    aliases: ["new delhi", "del", "igi"],
  },
  {
    label: "Dadri",
    lat: 28.5521,
    lng: 77.5544,
    aliases: ["icd dadri", "dadri icd"],
  },
  { label: "Noida", lat: 28.5355, lng: 77.391 },
  { label: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { label: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { label: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { label: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { label: "Cochin", lat: 9.9312, lng: 76.2673 },
  { label: "Kochi", lat: 9.9312, lng: 76.2673 },
  { label: "Dubai", lat: 25.2048, lng: 55.2708 },
  { label: "Jebel Ali", lat: 25.0118, lng: 55.0616 },
  { label: "Abu Dhabi", lat: 24.4539, lng: 54.3773 },
  { label: "Sharjah", lat: 25.3463, lng: 55.4209 },
  { label: "Jeddah", lat: 21.4858, lng: 39.1925 },
  { label: "Riyadh", lat: 24.7136, lng: 46.6753 },
  { label: "Doha", lat: 25.2854, lng: 51.531 },
  { label: "Singapore", lat: 1.3521, lng: 103.8198 },
  { label: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { label: "Shanghai", lat: 31.2304, lng: 121.4737 },
  {
    label: "Taiwan",
    lat: 25.033,
    lng: 121.5654,
    aliases: ["taipei", "kaohsiung", "tw"],
  },
  { label: "Taipei", lat: 25.033, lng: 121.5654 },
  { label: "Kaohsiung", lat: 22.6273, lng: 120.3014 },
  { label: "Rotterdam", lat: 51.9244, lng: 4.4777 },
  { label: "Hamburg", lat: 53.5511, lng: 9.9937 },
  {
    label: "Frankfurt",
    lat: 50.1109,
    lng: 8.6821,
    aliases: ["fra", "frankfurt am main", "frankfurt airport"],
  },
  {
    label: "Germany",
    lat: 50.1109,
    lng: 8.6821,
    aliases: ["de", "deutschland"],
  },
  { label: "Berlin", lat: 52.52, lng: 13.405 },
  { label: "Munich", lat: 48.1351, lng: 11.582 },
  { label: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { label: "Paris", lat: 48.8566, lng: 2.3522 },
  { label: "London", lat: 51.5074, lng: -0.1278 },
  { label: "New York", lat: 40.7128, lng: -74.006 },
  { label: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { label: "Colombo", lat: 6.9271, lng: 79.8612 },
  { label: "Karachi", lat: 24.8607, lng: 67.0011 },
  { label: "Muscat", lat: 23.588, lng: 58.3829 },
  { label: "UAE", lat: 25.2048, lng: 55.2708 },
  { label: "India", lat: 20.5937, lng: 78.9629 },
];

function normalizePlace(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function entryTokens(entry: LocationEntry): string[] {
  const tokens = [normalizePlace(entry.label)];
  for (const alias of entry.aliases ?? []) {
    tokens.push(normalizePlace(alias));
  }
  return tokens.filter(Boolean);
}

/**
 * Prefer exact / token hits over loose substring matches so short country
 * names (e.g. "Germany") and airport codes still resolve.
 */
export function resolveLocation(place: string): GeoPoint | null {
  const normalized = normalizePlace(place);
  if (!normalized) return null;

  let best: GeoPoint | null = null;
  let bestScore = 0;

  for (const entry of LOCATION_COORDS) {
    const tokens = entryTokens(entry);
    for (const token of tokens) {
      if (normalized === token) {
        return { lat: entry.lat, lng: entry.lng, label: entry.label };
      }

      // Word-boundary style: whole token appears in the free-text place.
      const asWord = new RegExp(
        `(^|\\s)${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`,
      );
      if (asWord.test(normalized) || normalized.includes(token)) {
        // Exact-ish containment: longer tokens win (Taipei > Tai).
        const score =
          token.length * 10 +
          (normalized.includes(token) ? 2 : 0) +
          (asWord.test(normalized) ? 5 : 0);
        if (score > bestScore) {
          best = { lat: entry.lat, lng: entry.lng, label: entry.label };
          bestScore = score;
        }
      } else if (token.includes(normalized) && normalized.length >= 4) {
        const score = normalized.length;
        if (score > bestScore) {
          best = { lat: entry.lat, lng: entry.lng, label: entry.label };
          bestScore = score;
        }
      }
    }
  }

  return best;
}
