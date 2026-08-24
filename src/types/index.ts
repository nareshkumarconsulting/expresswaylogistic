import type { QuoteWizardPayload } from "@/features/quotes/wizard-payload";

export type ShipmentStatus =
  | "Processing"
  | "In Transit"
  | "Customs Hold"
  | "Delivered"
  | "Delayed";

export const SHIPMENT_STATUSES = [
  "Processing",
  "In Transit",
  "Customs Hold",
  "Delivered",
  "Delayed",
] as const satisfies readonly ShipmentStatus[];

export type FreightMode = "Air Freight" | "Ocean Freight" | "Road Freight";

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  type: FreightMode;
  status: ShipmentStatus;
  eta: string;
  client: string;
  predictedEtaHours?: number;
  riskScore?: number;
}

export interface ManagedShipment extends Shipment {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  bookingBasis: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  cargoReadyDate?: string;
  targetDeliveryDate?: string;
  productType?: string;
  totalPackages?: number;
  approxWeight?: string;
  carrierName?: string;
  carrierRef?: string;
  internalNotes?: string;
  assignedTo?: string;
  estimatedEtaIso?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiInsight {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  summary: string;
  recommendation: string;
  relatedShipmentId?: string;
  createdAt: string;
}

export type ProductType =
  | "leather"
  | "garments"
  | "pharma"
  | "handicrafts"
  | "engineering"
  | "herbal"
  | "personal-effects"
  | "project-machinery"
  | "second-hand-machinery"
  | "bulk-cargo"
  | "coastal-cargo"
  | "chemicals"
  | "other";

export type ContainerSize = "20ft" | "40ft";

export type ContainerType =
  | "general-purpose"
  | "high-cube"
  | "reefer"
  | "open-top"
  | "flat-rack";

export interface ContactQuotePayload {
  name: string;
  company: string;
  companyAddress: string;
  email: string;
  phone?: string;
  origin: string;
  destination: string;
  serviceType: string;
  productType: ProductType;
  totalPackages: number;
  approxWeight: string;
  containerSize?: ContainerSize;
  containerType?: ContainerType;
  valueInr: number;
  message: string;
}

export const QUOTE_REQUEST_STATUSES = [
  "New",
  "Under Review",
  "Sent to Forwarders",
  "Awaiting Forwarder Quotes",
  "Quote Received",
  "Quoted",
  "Quote Ready / Email Failed",
  "Accepted",
  "Rejected",
  "Expired",
] as const;

export type QuoteRequestStatus = (typeof QUOTE_REQUEST_STATUSES)[number];

export type ForwarderStatus = "Active" | "Inactive";

export const QUOTE_FORWARDER_REQUEST_STATUSES = [
  "Pending",
  "Sent",
  "Delivered",
  "Awaiting Response",
  "Quote Received",
  "No Response",
  "Declined",
] as const;

export type QuoteForwarderRequestStatus =
  (typeof QUOTE_FORWARDER_REQUEST_STATUSES)[number];

export type QuoteRequestSource =
  | "contact_form"
  | "quote_wizard"
  | "voice_agent"
  | "email";

export const QUOTE_AI_REVIEW_STATUSES = [
  "needs_review",
  "needs_info",
  "confirmed",
  "dismissed",
] as const;

export type QuoteAiReviewStatus = (typeof QUOTE_AI_REVIEW_STATUSES)[number];

export type QuoteServiceType =
  | "air"
  | "ocean-fcl"
  | "ocean-lcl"
  | "consolidation"
  | "customs"
  | "warehousing"
  | "door-to-door"
  | "project-cargo"
  | "cargo-insurance"
  | "exim-advisory"
  | "packing";

export interface PreviousQuoteSummary {
  id: string;
  quotedAmount?: string;
  submittedAt: string;
  status: QuoteRequestStatus;
}

export interface QuoteActivityEntry {
  id: string;
  quoteRequestId: string;
  action: string;
  message: string;
  actor?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface QuoteForwarderRequest {
  id: string;
  quoteRequestId: string;
  forwarderId: string;
  forwarderName: string;
  forwarderEmail: string;
  status: QuoteForwarderRequestStatus;
  sentAt?: string;
  responseAt?: string;
  responseDeadline?: string;
  quotationAmount?: number;
  currency: string;
  shippingCharges?: number;
  additionalCharges?: number;
  transitTime?: string;
  validity?: string;
  carrier?: string;
  notes?: string;
}

export interface Forwarder {
  id: string;
  companyName: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  serviceTypes: string[];
  originLocations: string[];
  destinationLocations: string[];
  preferredRoutes?: string;
  notes?: string;
  status: ForwarderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  company: string;
  companyAddress?: string;
  email: string;
  phone?: string;
  origin: string;
  destination: string;
  serviceType: QuoteServiceType;
  productType?: ProductType;
  totalPackages?: number;
  approxWeight?: string;
  containerSize?: ContainerSize;
  containerType?: ContainerType;
  valueInr?: number;
  message: string;
  status: QuoteRequestStatus;
  submittedAt: string;
  internalNotes?: string;
  quotedAmount?: string;
  updatedAt?: string;
  originPickup?: boolean;
  destinationDelivery?: boolean;
  wizard?: QuoteWizardPayload;
  pickupLocation?: string;
  deliveryLocation?: string;
  requiredDeliveryDate?: string;
  additionalRequirements?: string;
  currency?: string;
  additionalCharges?: number;
  discount?: number;
  quoteValidity?: string;
  quoteSentAt?: string;
  quoteSentTo?: string;
  quoteSentBy?: string;
  assignedTo?: string;
  forwarderCost?: number;
  margin?: number;
  selectedForwarderId?: string;
  selectedForwarderName?: string;
  isRepeatCustomer?: boolean;
  previousQuotes?: PreviousQuoteSummary[];
  activity?: QuoteActivityEntry[];
  forwarderRequests?: QuoteForwarderRequest[];
  source?: QuoteRequestSource;
  emailIntelligenceId?: string;
  aiReviewStatus?: QuoteAiReviewStatus;
  aiMissingFields?: string[];
  aiCompleteness?: number;
  aiSuggestedReply?: string;
}

export interface AppointmentPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  appointmentType:
    | "freight-planning"
    | "customs-advisory"
    | "project-cargo"
    | "exim-advisory"
    | "packing-consult"
    | "warehouse-visit"
    | "account-onboarding";
  preferredDate: string;
  preferredTime: string;
  meetingMode: "video" | "phone" | "in-person";
  notes?: string;
}

export type CalendarEventKind = "appointment" | "shipment-eta";

export type CalendarEventStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "at-risk"
  | "in-transit";

export interface CalendarEvent {
  id: string;
  title: string;
  kind: CalendarEventKind;
  date: string;
  startTime?: string;
  endTime?: string;
  status: CalendarEventStatus;
  company?: string;
  location?: string;
  meetingMode?: "video" | "phone" | "in-person";
  appointmentType?: AppointmentPayload["appointmentType"];
  relatedId?: string;
  notes?: string;
}

export interface TrackingResult {
  trackingId: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  mode: FreightMode;
  eta: string;
  lastUpdate: string;
  /** ISO created timestamp — used for estimated map progress. */
  createdAt?: string;
  /** ISO ETA — preferred for estimated map progress. */
  estimatedEtaIso?: string;
  predictedEtaHours?: number;
  events: { timestamp: string; location: string; description: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type EmailCategory = "shipment" | "quotation" | "alert" | "general";

export type EmailUrgency = "low" | "medium" | "high" | "critical";

export type EmailIntelligenceStatus = "new" | "read" | "actioned" | "archived";

export interface ShipmentExtract {
  awb?: string;
  trackingNo?: string;
  pickup?: string;
  destination?: string;
  status?: string;
  eta?: string;
}

export interface QuotationExtract {
  quoteNo?: string;
  origin?: string;
  destination?: string;
  carrier?: string;
  price?: string;
  validity?: string;
}

export interface AlertExtract {
  alertType?: string;
  urgency?: EmailUrgency;
  requiredAction?: string;
  deadline?: string;
}

export interface GeneralExtract {
  sender?: string;
  subject?: string;
  date?: string;
  summary?: string;
}

export type EmailExtractedData =
  | ShipmentExtract
  | QuotationExtract
  | AlertExtract
  | GeneralExtract;

export interface EmailIntelligence {
  id: string;
  sourceAccount: string;
  externalMessageId?: string;
  senderEmail: string;
  senderName?: string;
  subject: string;
  receivedAt: string;
  category: EmailCategory;
  confidence?: number;
  summary?: string;
  extractedData: EmailExtractedData;
  status: EmailIntelligenceStatus;
  urgency?: EmailUrgency;
  hasAttachments: boolean;
  attachmentNames: string[];
  processedAt: string;
  createdAt: string;
  updatedAt: string;
  body?: string;
  quoteRequestId?: string;
  quoteSubtype?: string;
  quoteAction?: string;
}

export type ClientEmailStatus = "draft" | "sent" | "failed";

export interface EmailBrandingSettings {
  id: string;
  companyName: string;
  tagline?: string;
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  logoUrl?: string;
  signatureHtml?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ClientEmailMessage {
  id: string;
  quoteRequestId?: string;
  clientName?: string;
  clientCompany?: string;
  toRecipients: string[];
  ccRecipients: string[];
  bccRecipients: string[];
  subject: string;
  bodyText: string;
  bodyHtml: string;
  prompt?: string;
  status: ClientEmailStatus;
  providerMessageId?: string;
  errorMessage?: string;
  sentBy?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientEmailContact {
  email: string;
  name: string;
  company: string;
  phone?: string;
  quoteIds: string[];
  latestQuoteId?: string;
  latestStatus?: QuoteRequestStatus;
}
