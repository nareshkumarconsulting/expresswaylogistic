export type GeoPoint = {
  lat: number;
  lng: number;
  label: string;
};

/** Common origin/destination hubs for estimated route maps. */
const LOCATION_COORDS: readonly GeoPoint[] = [
  { label: "Mumbai", lat: 18.9388, lng: 72.8354 },
  { label: "Nhava Sheva", lat: 18.95, lng: 72.95 },
  { label: "JNPA", lat: 18.95, lng: 72.95 },
  { label: "Mundra", lat: 22.8397, lng: 69.7245 },
  { label: "Chennai", lat: 13.0827, lng: 80.2707 },
  { label: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { label: "Delhi", lat: 28.6139, lng: 77.209 },
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
  { label: "Rotterdam", lat: 51.9244, lng: 4.4777 },
  { label: "Hamburg", lat: 53.5511, lng: 9.9937 },
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

/** Resolve a free-text origin/destination to known coordinates. */
export function resolveLocation(place: string): GeoPoint | null {
  const normalized = normalizePlace(place);
  if (!normalized) return null;

  let best: GeoPoint | null = null;
  let bestScore = 0;

  for (const entry of LOCATION_COORDS) {
    const label = normalizePlace(entry.label);
    if (normalized === label) return entry;
    if (normalized.includes(label) || label.includes(normalized)) {
      const score = label.length;
      if (score > bestScore) {
        best = entry;
        bestScore = score;
      }
    }
  }

  return best;
}
