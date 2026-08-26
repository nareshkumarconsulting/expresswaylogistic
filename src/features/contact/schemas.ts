import { z } from "zod";

export const PRODUCT_TYPES = [
  "leather",
  "garments",
  "pharma",
  "handicrafts",
  "engineering",
  "herbal",
  "personal-effects",
  "project-machinery",
  "second-hand-machinery",
  "bulk-cargo",
  "coastal-cargo",
  "chemicals",
  "other",
] as const;

export const CONTAINER_SIZES = ["20ft", "40ft"] as const;

export const CONTAINER_TYPES = [
  "general-purpose",
  "high-cube",
  "reefer",
  "open-top",
  "flat-rack",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type ContainerSize = (typeof CONTAINER_SIZES)[number];
export type ContainerType = (typeof CONTAINER_TYPES)[number];

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  leather: "Leather Products",
  garments: "Garments & Apparel",
  pharma: "Pharma & Bulk Drugs",
  handicrafts: "Handicrafts",
  engineering: "Engineering Goods",
  herbal: "Herbal & Medicaments",
  "personal-effects": "Personal Effects / Household",
  "project-machinery": "Project Machinery",
  "second-hand-machinery": "Second-hand Machinery",
  "bulk-cargo": "Bulk Cargo",
  "coastal-cargo": "Coastal Cargo",
  chemicals: "Chemicals",
  other: "Other",
};

export const CONTAINER_SIZE_LABELS: Record<ContainerSize, string> = {
  "20ft": "20 feet",
  "40ft": "40 feet",
};

export const CONTAINER_TYPE_LABELS: Record<ContainerType, string> = {
  "general-purpose": "General Purpose",
  "high-cube": "High Cube",
  reefer: "Reefer Container",
  "open-top": "Open Top",
  "flat-rack": "Flat Rack",
};

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company is required"),
  companyAddress: z.string().min(5, "Company address is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[+]?[\d\s-]{8,20}$/.test(v),
      "Enter a valid phone number",
    ),
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  serviceType: z.enum([
    "air",
    "ocean-fcl",
    "ocean-lcl",
    "consolidation",
    "customs",
    "warehousing",
    "door-to-door",
    "project-cargo",
    "cargo-insurance",
    "exim-advisory",
    "packing",
  ]),
  productType: z.enum(PRODUCT_TYPES, {
    message: "Select a product type",
  }),
  totalPackages: z.coerce
    .number({ message: "Enter total packages" })
    .int("Enter a whole number")
    .min(1, "Total packages must be at least 1"),
  approxWeight: z.string().min(1, "Approx weight is required"),
  containerSize: z.enum(CONTAINER_SIZES).optional(),
  containerType: z.enum(CONTAINER_TYPES).optional(),
  valueInr: z.coerce
    .number({ message: "Enter cargo value in INR" })
    .positive("Value must be greater than zero"),
  message: z.string().min(10, "Please provide cargo details (min 10 chars)"),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const trackingSchema = z.object({
  trackingId: z
    .string()
    .min(4, "Enter a valid tracking ID")
    .max(40)
    .regex(
      /^[A-Za-z0-9\-/]+$/,
      "Tracking ID contains invalid characters",
    ),
});

export type TrackingFormValues = z.infer<typeof trackingSchema>;

export const aiQuerySchema = z.object({
  query: z.string().min(3).max(500),
});
