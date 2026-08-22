import { z } from "zod";
import {
  CONTAINER_SIZES,
  CONTAINER_TYPES,
  PRODUCT_TYPES,
} from "@/features/contact/schemas";

export const BOOKING_BASES = [
  "po_received",
  "email_ok",
  "payment_received",
  "verbal_ok",
] as const;

export type BookingBasis = (typeof BOOKING_BASES)[number];

export const BOOKING_BASIS_LABELS: Record<BookingBasis, string> = {
  po_received: "PO received",
  email_ok: "Email confirmation",
  payment_received: "Payment received",
  verbal_ok: "Verbal OK",
};

export const FREIGHT_MODES = [
  "Air Freight",
  "Ocean Freight",
  "Road Freight",
] as const;

export type ShipmentFreightMode = (typeof FREIGHT_MODES)[number];

export const createShipmentSchema = z
  .object({
    clientCompany: z.string().min(2, "Company name is required"),
    contactName: z.string().min(2, "Contact name is required"),
    contactEmail: z.string().email("Enter a valid email"),
    contactPhone: z
      .string()
      .optional()
      .refine(
        (v) => !v || /^[+]?[\d\s-]{8,20}$/.test(v),
        "Enter a valid phone number",
      ),
    bookingBasis: z.enum(BOOKING_BASES),
    assignedTo: z.string().optional(),
    origin: z.string().min(2, "Origin is required"),
    destination: z.string().min(2, "Destination is required"),
    freightMode: z.enum(FREIGHT_MODES),
    pickupLocation: z.string().optional(),
    deliveryLocation: z.string().optional(),
    cargoReadyDate: z.string().min(1, "Cargo ready date is required"),
    targetDeliveryDate: z.string().optional(),
    productType: z.enum(PRODUCT_TYPES),
    totalPackages: z.coerce.number().int().min(1).optional(),
    approxWeight: z.string().optional(),
    containerSize: z.enum(CONTAINER_SIZES).optional(),
    containerType: z.enum(CONTAINER_TYPES).optional(),
    valueInr: z.coerce.number().min(0).optional(),
    carrierName: z.string().optional(),
    carrierRef: z.string().optional(),
    forwarderId: z.string().uuid().optional().or(z.literal("")),
    estimatedEta: z.string().optional(),
    internalNotes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasWeight = Boolean(data.approxWeight?.trim());
    const hasPackages = data.totalPackages != null && data.totalPackages > 0;
    if (!hasWeight && !hasPackages) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter packages or approximate weight",
        path: ["approxWeight"],
      });
    }
    if (
      data.freightMode === "Ocean Freight" &&
      data.containerSize &&
      !data.containerType
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a container type",
        path: ["containerType"],
      });
    }
  });

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;

export const updateShipmentSchema = z
  .object({
    status: z.enum([
      "Processing",
      "In Transit",
      "Customs Hold",
      "Delivered",
      "Delayed",
    ]),
    carrierName: z.string().optional(),
    carrierRef: z.string().optional(),
    estimatedEta: z.string().optional(),
    internalNotes: z.string().optional(),
    assignedTo: z.string().optional(),
  })
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "Provide at least one field to update",
  });

export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;

export const SHIPMENT_WIZARD_STEPS = [
  { id: "client", label: "Client" },
  { id: "lane", label: "Lane" },
  { id: "cargo", label: "Cargo" },
  { id: "booking", label: "Booking" },
] as const;

export type ShipmentWizardStepId = (typeof SHIPMENT_WIZARD_STEPS)[number]["id"];

export const SHIPMENT_STEP_FIELDS: Record<
  ShipmentWizardStepId,
  (keyof CreateShipmentInput)[]
> = {
  client: [
    "clientCompany",
    "contactName",
    "contactEmail",
    "contactPhone",
    "bookingBasis",
    "assignedTo",
  ],
  lane: [
    "origin",
    "destination",
    "freightMode",
    "pickupLocation",
    "deliveryLocation",
    "cargoReadyDate",
    "targetDeliveryDate",
  ],
  cargo: [
    "productType",
    "totalPackages",
    "approxWeight",
    "containerSize",
    "containerType",
    "valueInr",
    "internalNotes",
  ],
  booking: [
    "carrierName",
    "carrierRef",
    "forwarderId",
    "estimatedEta",
  ],
};

export function createDefaultShipmentValues(): CreateShipmentInput {
  return {
    clientCompany: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    bookingBasis: "email_ok",
    assignedTo: "",
    origin: "",
    destination: "",
    freightMode: "Ocean Freight",
    pickupLocation: "",
    deliveryLocation: "",
    cargoReadyDate: "",
    targetDeliveryDate: "",
    productType: "other",
    totalPackages: undefined,
    approxWeight: "",
    containerSize: undefined,
    containerType: undefined,
    valueInr: undefined,
    carrierName: "",
    carrierRef: "",
    forwarderId: "",
    estimatedEta: "",
    internalNotes: "",
  };
}
