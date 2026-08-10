import { describe, expect, it } from "vitest";
import { cn, formatNumber } from "@/lib/utils";
import { quoteFormSchema, trackingSchema } from "@/features/contact/schemas";
import { findTracking } from "@/services/logistics-data";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatNumber", () => {
  it("formats indian locale numbers", () => {
    expect(formatNumber(5000)).toContain("5");
  });
});

describe("quoteFormSchema", () => {
  it("accepts valid quote payload", () => {
    const result = quoteFormSchema.safeParse({
      name: "Naresh",
      company: "Acme",
      companyAddress: "123 Industrial Area, Mumbai 400001",
      email: "naresh@acme.com",
      origin: "Mumbai",
      destination: "Dubai",
      serviceType: "air",
      productType: "engineering",
      totalPackages: 10,
      approxWeight: "500 kg",
      valueInr: 150000,
      message: "2 pallets electronics",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = quoteFormSchema.safeParse({
      name: "Naresh",
      company: "Acme",
      companyAddress: "123 Industrial Area, Mumbai 400001",
      email: "bad",
      origin: "Mumbai",
      destination: "Dubai",
      serviceType: "air",
      productType: "pharma",
      totalPackages: 5,
      approxWeight: "200 kg",
      valueInr: 50000,
      message: "2 pallets electronics",
    });
    expect(result.success).toBe(false);
  });
});

describe("trackingSchema", () => {
  it("validates tracking ids", () => {
    expect(trackingSchema.safeParse({ trackingId: "EW-10847" }).success).toBe(
      true,
    );
    expect(trackingSchema.safeParse({ trackingId: "!!" }).success).toBe(false);
  });
});

describe("findTracking", () => {
  it("returns shipment timeline for known ids", () => {
    const result = findTracking("EW-10847");
    expect(result?.trackingId).toBe("EW-10847");
    expect(result?.events.length).toBeGreaterThan(0);
  });

  it("returns null for unknown ids", () => {
    expect(findTracking("UNKNOWN")).toBeNull();
  });
});
