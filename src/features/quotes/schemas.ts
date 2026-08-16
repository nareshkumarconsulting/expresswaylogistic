import { z } from "zod";
import { QUOTE_FORWARDER_REQUEST_STATUSES, QUOTE_REQUEST_STATUSES } from "@/types";

export const quoteUpdateSchema = z.object({
  status: z.enum(QUOTE_REQUEST_STATUSES).optional(),
  internalNotes: z.string().optional(),
  quotedAmount: z.string().optional(),
  currency: z.string().min(1).max(8).optional(),
  additionalCharges: z.number().nullable().optional(),
  discount: z.number().nullable().optional(),
  quoteValidity: z.string().optional(),
  assignedTo: z.string().optional(),
  pickupLocation: z.string().optional(),
  deliveryLocation: z.string().optional(),
  requiredDeliveryDate: z.string().optional(),
  additionalRequirements: z.string().optional(),
  forwarderCost: z.number().nullable().optional(),
  margin: z.number().nullable().optional(),
  actor: z.string().optional(),
});

export const quoteSendSchema = quoteUpdateSchema.extend({
  actor: z.string().optional(),
});

export const sendToForwardersSchema = z.object({
  forwarderIds: z.array(z.string().uuid()).min(1),
  responseDeadline: z.string().optional(),
  actor: z.string().optional(),
});

export const recordForwarderQuoteSchema = z.object({
  forwarderRequestId: z.string().uuid(),
  quotationAmount: z.number().nonnegative(),
  currency: z.string().optional(),
  shippingCharges: z.number().nullable().optional(),
  additionalCharges: z.number().nullable().optional(),
  transitTime: z.string().optional(),
  validity: z.string().optional(),
  carrier: z.string().optional(),
  notes: z.string().optional(),
  actor: z.string().optional(),
});

export const selectForwarderQuoteSchema = z.object({
  forwarderRequestId: z.string().uuid(),
  margin: z.number().nonnegative().optional(),
  additionalCharges: z.number().nullable().optional(),
  finalAmount: z.number().positive().optional(),
  actor: z.string().optional(),
});

export const forwarderUpsertSchema = z.object({
  companyName: z.string().min(2),
  contactPerson: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  serviceTypes: z.array(z.string()).optional(),
  originLocations: z.array(z.string()).optional(),
  destinationLocations: z.array(z.string()).optional(),
  preferredRoutes: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export const forwarderPatchSchema = forwarderUpsertSchema.partial();

export type QuoteUpdateInput = z.infer<typeof quoteUpdateSchema>;
export type ForwarderUpsertInput = z.infer<typeof forwarderUpsertSchema>;

export { QUOTE_FORWARDER_REQUEST_STATUSES };
