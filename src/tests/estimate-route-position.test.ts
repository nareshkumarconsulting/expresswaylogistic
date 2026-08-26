import { describe, expect, it } from "vitest";
import { resolveLocation } from "@/lib/geo/locations";
import {
  buildGreatCirclePath,
  estimateProgress,
  estimateRoutePosition,
  initialBearing,
  interpolateGreatCircle,
} from "@/lib/geo/estimate-route-position";

describe("initialBearing", () => {
  it("points roughly northwest from Delhi toward Frankfurt", () => {
    const bearing = initialBearing(
      { lat: 28.6139, lng: 77.209 },
      { lat: 50.1109, lng: 8.6821 },
    );
    // Delhi → Frankfurt is west-northwest (~310°).
    expect(bearing).toBeGreaterThan(280);
    expect(bearing).toBeLessThan(340);
  });
});

describe("resolveLocation", () => {
  it("matches known cities and fuzzy place strings", () => {
    expect(resolveLocation("Mumbai")?.label).toBe("Mumbai");
    expect(resolveLocation("Dubai, UAE")?.label).toBe("Dubai");
    expect(resolveLocation("Nhava Sheva (JNPA)")?.label).toBe("Nhava Sheva");
    expect(resolveLocation("Somewhere Unknown")).toBeNull();
  });

  it("resolves air hubs used on the live network map", () => {
    expect(resolveLocation("Delhi")?.label).toBe("Delhi");
    expect(resolveLocation("Frankfurt")?.label).toBe("Frankfurt");
    expect(resolveLocation("Germany")?.label).toBe("Germany");
    expect(resolveLocation("FRA")?.label).toBe("Frankfurt");
    expect(resolveLocation("DADRI")?.label).toBe("Dadri");
    expect(resolveLocation("TAIWAN")?.label).toBe("Taiwan");
  });
});

describe("estimateRoutePosition air lanes", () => {
  it("maps Delhi → Frankfurt air freight", () => {
    const route = estimateRoutePosition({
      origin: "Delhi",
      destination: "Frankfurt",
      status: "In Transit",
      mode: "Air Freight",
      eta: "2 days",
    });
    expect(route).not.toBeNull();
    expect(route?.origin.label).toBe("Delhi");
    expect(route?.destination.label).toBe("Frankfurt");
  });

  it("maps Delhi → Germany air freight", () => {
    const route = estimateRoutePosition({
      origin: "Delhi",
      destination: "Germany",
      status: "Processing",
      mode: "Air Freight",
      eta: "2 days",
    });
    expect(route).not.toBeNull();
  });
});

describe("interpolateGreatCircle", () => {
  it("returns endpoints at t=0 and t=1", () => {
    const from = { lat: 18.94, lng: 72.84 };
    const to = { lat: 25.2, lng: 55.27 };
    const start = interpolateGreatCircle(from, to, 0);
    expect(start.lat).toBeCloseTo(from.lat, 5);
    expect(start.lng).toBeCloseTo(from.lng, 5);
    const end = interpolateGreatCircle(from, to, 1);
    expect(end.lat).toBeCloseTo(to.lat, 5);
    expect(end.lng).toBeCloseTo(to.lng, 5);
  });

  it("places midpoint between Mumbai and Dubai", () => {
    const mid = interpolateGreatCircle(
      { lat: 18.94, lng: 72.84 },
      { lat: 25.2, lng: 55.27 },
      0.5,
    );
    expect(mid.lng).toBeLessThan(72.84);
    expect(mid.lng).toBeGreaterThan(55.27);
    expect(mid.lat).toBeGreaterThan(18);
    expect(mid.lat).toBeLessThan(26);
  });
});

describe("estimateProgress", () => {
  it("pins processing at origin and delivered at destination", () => {
    expect(
      estimateProgress({
        origin: "Mumbai",
        destination: "Dubai",
        status: "Processing",
        mode: "Ocean Freight",
      }),
    ).toBe(0);
    expect(
      estimateProgress({
        origin: "Mumbai",
        destination: "Dubai",
        status: "Delivered",
        mode: "Ocean Freight",
      }),
    ).toBe(1);
  });

  it("uses remaining ETA days against ocean default transit", () => {
    const progress = estimateProgress({
      origin: "Mumbai",
      destination: "Dubai",
      status: "In Transit",
      mode: "Ocean Freight",
      eta: "5 days",
    });
    // 5 of 7 days remaining → ~29% elapsed
    expect(progress).toBeCloseTo(1 - 120 / 168, 2);
  });

  it("uses createdAt and estimatedEtaIso when available", () => {
    const now = new Date("2026-08-23T12:00:00.000Z");
    const progress = estimateProgress({
      origin: "Mumbai",
      destination: "Dubai",
      status: "In Transit",
      mode: "Ocean Freight",
      createdAt: "2026-08-20T12:00:00.000Z",
      estimatedEtaIso: "2026-08-27T12:00:00.000Z",
      now,
    });
    // 3 of 7 days elapsed
    expect(progress).toBeCloseTo(3 / 7, 2);
  });
});

describe("estimateRoutePosition", () => {
  it("returns map geometry for Mumbai → Dubai ocean transit", () => {
    const route = estimateRoutePosition({
      origin: "Mumbai",
      destination: "Dubai",
      status: "In Transit",
      mode: "Ocean Freight",
      eta: "5 days",
    });
    expect(route).not.toBeNull();
    expect(route!.path.length).toBeGreaterThan(10);
    expect(route!.estimate.lng).toBeLessThan(route!.origin.lng);
    expect(route!.estimate.lng).toBeGreaterThan(route!.destination.lng);
    expect(route!.disclaimer).toMatch(/not live vessel GPS/i);
  });

  it("builds a continuous great-circle path", () => {
    const path = buildGreatCirclePath(
      { lat: 18.94, lng: 72.84 },
      { lat: 25.2, lng: 55.27 },
      8,
    );
    expect(path).toHaveLength(9);
  });
});
