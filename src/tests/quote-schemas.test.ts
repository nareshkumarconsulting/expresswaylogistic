import { describe, expect, it } from "vitest";
import {
  calculateCargoTotals,
  createDefaultQuoteWizardValues,
  createEmptyCargoItem,
  dimensionToCm,
  formatQuoteAddOns,
  quoteWizardSchema,
  type CargoItemValues,
  type QuoteWizardValues,
} from "@/features/quote/schemas";

describe("dimensionToCm", () => {
  it("converts inches to centimeters", () => {
    expect(dimensionToCm(10, "in")).toBeCloseTo(25.4);
  });

  it("converts millimeters to centimeters", () => {
    expect(dimensionToCm(100, "mm")).toBe(10);
  });

  it("converts meters to centimeters", () => {
    expect(dimensionToCm(1.5, "m")).toBe(150);
  });
});

describe("calculateCargoTotals", () => {
  const baseItem: CargoItemValues = {
    description: "Test cargo",
    hsCode: "",
    quantity: 1,
    packageType: "carton",
    dimensionUnit: "cm",
    length: 15,
    width: 12,
    height: 31,
    weightKg: 5,
  };

  it("calculates CBM from centimeters", () => {
    const totals = calculateCargoTotals([baseItem]);
    expect(totals.cbm).toBeCloseTo(0.00558, 5);
    expect(totals.weightKg).toBe(5);
  });

  it("calculates CBM from inches using the same physical size", () => {
    const totals = calculateCargoTotals([
      {
        ...baseItem,
        dimensionUnit: "in",
        length: 15 / 2.54,
        width: 12 / 2.54,
        height: 31 / 2.54,
      },
    ]);
    expect(totals.cbm).toBeCloseTo(0.00558, 5);
  });
});

function validWizardBase(): QuoteWizardValues {
  return {
    ...createDefaultQuoteWizardValues(),
    cargoReadyDate: "2026-09-01",
    cargoItems: [
      {
        ...createEmptyCargoItem(),
        description: "Leather goods",
        length: 100,
        width: 80,
        height: 60,
        weightKg: 25,
      },
    ],
    origin: "Mumbai",
    destination: "Dubai",
    firstName: "Priya",
    lastName: "Sharma",
    company: "Acme Exports",
    email: "priya@acme.com",
    city: "Mumbai",
    address: "Unit 12, Andheri East",
    referralSource: "referral",
  };
}

describe("quoteWizardSchema add-ons", () => {
  it("accepts insurance when value and coverage are provided", () => {
    const result = quoteWizardSchema.safeParse({
      ...validWizardBase(),
      insurance: true,
      insuranceCargoValueInr: 2500000,
      insuranceCoverage: "all-risk",
    });
    expect(result.success).toBe(true);
  });

  it("requires insurance details when insurance is enabled", () => {
    const result = quoteWizardSchema.safeParse({
      ...validWizardBase(),
      insurance: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join("."));
      expect(paths).toContain("insuranceCargoValueInr");
      expect(paths).toContain("insuranceCoverage");
    }
  });

  it("requires project cargo type when project cargo is enabled", () => {
    const result = quoteWizardSchema.safeParse({
      ...validWizardBase(),
      projectCargo: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) =>
          issue.path.includes("projectCargoType"),
        ),
      ).toBe(true);
    }
  });

  it("requires packing scope when packing is enabled", () => {
    const result = quoteWizardSchema.safeParse({
      ...validWizardBase(),
      packingRequired: true,
      fumigationRequired: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) =>
          issue.path.includes("packingScope"),
        ),
      ).toBe(true);
    }
  });

  it("formats add-ons for the live quote sheet", () => {
    const addOns = formatQuoteAddOns({
      ...validWizardBase(),
      insurance: true,
      insuranceCargoValueInr: 100000,
      insuranceCoverage: "warehouse-to-warehouse",
      projectCargo: true,
      projectCargoType: "project-machinery",
      packingRequired: true,
      packingScope: "household",
      fumigationRequired: true,
      customsBrokerage: true,
    });
    expect(addOns.join(" | ")).toContain("Warehouse to warehouse");
    expect(addOns.join(" | ")).toContain("Project machinery");
    expect(addOns.join(" | ")).toContain("Household goods");
    expect(addOns.join(" | ")).toContain("Customs brokerage");
  });
});
