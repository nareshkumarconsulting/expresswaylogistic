import { z } from "zod";

export const TRANSPORT_MODES = ["air", "lcl", "fcl"] as const;
export type TransportMode = (typeof TRANSPORT_MODES)[number];

export const TRANSPORT_MODE_LABELS: Record<TransportMode, string> = {
  air: "Air Freight",
  lcl: "Ocean LCL",
  fcl: "Ocean FCL",
};

export const TRANSPORT_MODE_HINTS: Record<TransportMode, string> = {
  air: "Fastest transit for time-sensitive cargo",
  lcl: "Shared container space for smaller volumes",
  fcl: "Dedicated container for larger shipments",
};

export const TRANSPORT_MODE_ACCENTS: Record<TransportMode, string> = {
  air: "from-sky-500/25 to-transparent",
  lcl: "from-blue-600/20 to-transparent",
  fcl: "from-indigo-500/25 to-transparent",
};

export const PACKAGE_TYPES = [
  "pallet",
  "carton",
  "crate",
  "drum",
  "bag",
  "other",
] as const;

export type PackageType = (typeof PACKAGE_TYPES)[number];

export const PACKAGE_TYPE_LABELS: Record<PackageType, string> = {
  pallet: "Pallet",
  carton: "Carton",
  crate: "Crate",
  drum: "Drum",
  bag: "Bag / Sack",
  other: "Other",
};

export const REFERRAL_SOURCES = [
  "search",
  "referral",
  "social",
  "trade-show",
  "existing-customer",
  "other",
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export const REFERRAL_SOURCE_LABELS: Record<ReferralSource, string> = {
  search: "Search engine",
  referral: "Referral / word of mouth",
  social: "Social media",
  "trade-show": "Trade show / event",
  "existing-customer": "Existing customer",
  other: "Other",
};

export const DIMENSION_UNITS = ["cm", "in", "mm", "m"] as const;
export type DimensionUnit = (typeof DIMENSION_UNITS)[number];

export const DIMENSION_UNIT_LABELS: Record<DimensionUnit, string> = {
  cm: "Centimeters (cm)",
  in: "Inches (in)",
  mm: "Millimeters (mm)",
  m: "Meters (m)",
};

export const DIMENSION_UNIT_SHORT: Record<DimensionUnit, string> = {
  cm: "cm",
  in: "in",
  mm: "mm",
  m: "m",
};

export const INSURANCE_COVERAGES = [
  "all-risk",
  "total-loss",
  "warehouse-to-warehouse",
] as const;

export type InsuranceCoverage = (typeof INSURANCE_COVERAGES)[number];

export const INSURANCE_COVERAGE_LABELS: Record<InsuranceCoverage, string> = {
  "all-risk": "All-risk marine cargo",
  "total-loss": "Total loss only",
  "warehouse-to-warehouse": "Warehouse to warehouse",
};

export const PROJECT_CARGO_TYPES = [
  "project-machinery",
  "second-hand-machinery",
  "project-import",
  "other",
] as const;

export type ProjectCargoType = (typeof PROJECT_CARGO_TYPES)[number];

export const PROJECT_CARGO_TYPE_LABELS: Record<ProjectCargoType, string> = {
  "project-machinery": "Project machinery clearance",
  "second-hand-machinery": "Second-hand machinery",
  "project-import": "Project import registration",
  other: "Other project cargo",
};

export const PACKING_SCOPES = [
  "general",
  "hazardous",
  "personal-effects",
  "household",
] as const;

export type PackingScope = (typeof PACKING_SCOPES)[number];

export const PACKING_SCOPE_LABELS: Record<PackingScope, string> = {
  general: "General cargo packing",
  hazardous: "Hazardous cargo packing",
  "personal-effects": "Personal effects",
  household: "Household goods",
};

/** Incoterms® 2010 — eleven three-letter trade terms (ICC). */
export const INCOTERMS = [
  "EXW",
  "FCA",
  "CPT",
  "CIP",
  "DAT",
  "DAP",
  "DDP",
  "FAS",
  "FOB",
  "CFR",
  "CIF",
] as const;

export type Incoterm = (typeof INCOTERMS)[number];

export const INCOTERM_LABELS: Record<Incoterm, string> = {
  EXW: "Ex Works",
  FCA: "Free Carrier",
  CPT: "Carriage Paid To",
  CIP: "Carriage and Insurance Paid To",
  DAT: "Delivered at Terminal",
  DAP: "Delivered at Place",
  DDP: "Delivered Duty Paid",
  FAS: "Free Alongside Ship",
  FOB: "Free On Board",
  CFR: "Cost and Freight",
  CIF: "Cost Insurance and Freight",
};

export const INCOTERM_HINTS: Partial<Record<Incoterm, string>> = {
  EXW: "Buyer collects from seller's premises",
  FCA: "Seller delivers to carrier at named place",
  CPT: "Seller pays freight to named destination",
  CIP: "Seller pays freight and insurance to destination",
  DAT: "Seller delivers unloaded at terminal",
  DAP: "Seller delivers ready for unloading at place",
  DDP: "Seller delivers cleared for import at place",
  FAS: "Seller delivers alongside vessel at port",
  FOB: "Seller delivers on board vessel at port",
  CFR: "Seller pays cost and freight to port",
  CIF: "Seller pays cost, insurance, and freight to port",
};

export const INCOTERM_GROUPS = [
  {
    id: "any-mode",
    label: "Any mode or modes of transport",
    terms: ["EXW", "FCA", "CPT", "CIP", "DAT", "DAP", "DDP"] as const satisfies readonly Incoterm[],
  },
  {
    id: "sea-inland",
    label: "Sea and inland waterway transport",
    terms: ["FAS", "FOB", "CFR", "CIF"] as const satisfies readonly Incoterm[],
  },
] as const;

/** Convert a single dimension value to centimeters for CBM calculation. */
export function dimensionToCm(value: number, unit: DimensionUnit): number {
  switch (unit) {
    case "cm":
      return value;
    case "in":
      return value * 2.54;
    case "mm":
      return value / 10;
    case "m":
      return value * 100;
  }
}

export const cargoItemSchema = z.object({
  description: z.string().min(2, "Commodity description is required"),
  hsCode: z.string().optional(),
  quantity: z.coerce
    .number({ message: "Enter quantity" })
    .int("Enter a whole number")
    .min(1, "Quantity must be at least 1"),
  packageType: z.enum(PACKAGE_TYPES, {
    message: "Select package type",
  }),
  dimensionUnit: z.enum(DIMENSION_UNITS, {
    message: "Select dimension unit",
  }),
  length: z.coerce
    .number({ message: "Enter length" })
    .positive("Length must be greater than zero"),
  width: z.coerce
    .number({ message: "Enter width" })
    .positive("Width must be greater than zero"),
  height: z.coerce
    .number({ message: "Enter height" })
    .positive("Height must be greater than zero"),
  weightKg: z.coerce
    .number({ message: "Enter weight" })
    .positive("Weight must be greater than zero"),
});

export type CargoItemValues = z.infer<typeof cargoItemSchema>;

export const quoteWizardSchema = z
  .object({
    cargoReadyDate: z.string().min(1, "Cargo ready date is required"),
    transportMode: z.enum(TRANSPORT_MODES, {
      message: "Select a transport mode",
    }),
    cargoItems: z
      .array(cargoItemSchema)
      .min(1, "Add at least one cargo line item"),
    origin: z.string().min(2, "Origin is required"),
    originPickup: z.boolean(),
    destination: z.string().min(2, "Destination is required"),
    destinationDelivery: z.boolean(),
    incoterm: z.enum(INCOTERMS, {
      message: "Select an Incoterms rule",
    }),
    insurance: z.boolean(),
    insuranceCargoValueInr: z.coerce
      .number({ message: "Enter insured cargo value" })
      .positive("Cargo value must be greater than zero")
      .optional(),
    insuranceCoverage: z.enum(INSURANCE_COVERAGES).optional(),
    projectCargo: z.boolean(),
    projectCargoType: z.enum(PROJECT_CARGO_TYPES).optional(),
    projectRegistrationHelp: z.boolean().optional(),
    projectNotes: z
      .string()
      .max(2000, "Maximum 2000 characters")
      .optional(),
    packingRequired: z.boolean(),
    packingScope: z.enum(PACKING_SCOPES).optional(),
    fumigationRequired: z.boolean().optional(),
    labelingBarcoding: z.boolean().optional(),
    packingNotes: z
      .string()
      .max(2000, "Maximum 2000 characters")
      .optional(),
    customsBrokerage: z.boolean(),
    dangerousCargoNotes: z
      .string()
      .max(2000, "Maximum 2000 characters")
      .optional(),
    existingCustomer: z.boolean(),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    company: z.string().min(2, "Company name is required"),
    email: z.string().email("Enter a valid business email"),
    phone: z
      .string()
      .optional()
      .refine(
        (v) => !v || /^[+]?[\d\s-]{8,20}$/.test(v),
        "Enter a valid phone number",
      ),
    country: z.string().min(2, "Country is required"),
    state: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().optional(),
    address: z.string().min(5, "Address is required"),
    referralSource: z.enum(REFERRAL_SOURCES, {
      message: "Tell us how you heard about us",
    }),
    marketingOptIn: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.insurance) {
      if (data.insuranceCargoValueInr == null) {
        ctx.addIssue({
          code: "custom",
          path: ["insuranceCargoValueInr"],
          message: "Enter the cargo value to insure (INR)",
        });
      }
      if (!data.insuranceCoverage) {
        ctx.addIssue({
          code: "custom",
          path: ["insuranceCoverage"],
          message: "Select an insurance coverage type",
        });
      }
    }

    if (data.projectCargo) {
      if (!data.projectCargoType) {
        ctx.addIssue({
          code: "custom",
          path: ["projectCargoType"],
          message: "Select the project cargo type",
        });
      }
    }

    if (data.packingRequired) {
      if (!data.packingScope) {
        ctx.addIssue({
          code: "custom",
          path: ["packingScope"],
          message: "Select the packing scope",
        });
      }
    }
  });

export type QuoteWizardValues = z.infer<typeof quoteWizardSchema>;

export function createEmptyCargoItem(): CargoItemValues {
  return {
    description: "",
    hsCode: "",
    quantity: 1,
    packageType: "pallet",
    dimensionUnit: "cm",
    length: 0,
    width: 0,
    height: 0,
    weightKg: 0,
  };
}

export function createDefaultQuoteWizardValues() {
  return {
    cargoReadyDate: "",
    transportMode: "air" as const,
    cargoItems: [createEmptyCargoItem()],
    origin: "",
    originPickup: false,
    destination: "",
    destinationDelivery: false,
    incoterm: undefined as Incoterm | undefined,
    insurance: false,
    insuranceCargoValueInr: undefined as number | undefined,
    insuranceCoverage: undefined as InsuranceCoverage | undefined,
    projectCargo: false,
    projectCargoType: undefined as ProjectCargoType | undefined,
    projectRegistrationHelp: false,
    projectNotes: "",
    packingRequired: false,
    packingScope: undefined as PackingScope | undefined,
    fumigationRequired: false,
    labelingBarcoding: false,
    packingNotes: "",
    customsBrokerage: false,
    dangerousCargoNotes: "",
    existingCustomer: false,
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    postalCode: "",
    address: "",
    referralSource: undefined as ReferralSource | undefined,
    marketingOptIn: false,
  };
}

export function formatQuoteAddOns(values: QuoteWizardValues): string[] {
  const addOns: string[] = [];
  if (values.insurance) {
    const coverage = values.insuranceCoverage
      ? INSURANCE_COVERAGE_LABELS[values.insuranceCoverage]
      : "Insurance";
    const value =
      values.insuranceCargoValueInr != null
        ? ` · ₹${values.insuranceCargoValueInr.toLocaleString("en-IN")}`
        : "";
    addOns.push(`${coverage}${value}`);
  }
  if (values.projectCargo) {
    addOns.push(
      values.projectCargoType
        ? PROJECT_CARGO_TYPE_LABELS[values.projectCargoType]
        : "Project cargo",
    );
  }
  if (values.packingRequired) {
    const scope = values.packingScope
      ? PACKING_SCOPE_LABELS[values.packingScope]
      : "Packing";
    const extras = [
      values.fumigationRequired && "fumigation",
      values.labelingBarcoding && "labeling",
    ].filter(Boolean);
    addOns.push(
      extras.length > 0 ? `${scope} (+${extras.join(", ")})` : scope,
    );
  }
  if (values.customsBrokerage) addOns.push("Customs brokerage");
  return addOns;
}

export function calculateCargoTotals(items: CargoItemValues[]) {
  return items.reduce(
    (acc, item) => {
      const qty = Number(item.quantity) || 0;
      const unit = item.dimensionUnit ?? "cm";
      const l = dimensionToCm(Number(item.length) || 0, unit);
      const w = dimensionToCm(Number(item.width) || 0, unit);
      const h = dimensionToCm(Number(item.height) || 0, unit);
      const weight = Number(item.weightKg) || 0;
      const cbm = (l * w * h) / 1_000_000;
      acc.cbm += cbm * qty;
      acc.weightKg += weight * qty;
      return acc;
    },
    { cbm: 0, weightKg: 0 },
  );
}

export function formatCargoTotals(items: CargoItemValues[]) {
  const { cbm, weightKg } = calculateCargoTotals(items);
  return {
    cbm: cbm.toFixed(3),
    weightKg: weightKg.toFixed(1),
  };
}
