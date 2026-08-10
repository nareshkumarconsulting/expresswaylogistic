export type ShipmentStatus =
  | "Processing"
  | "In Transit"
  | "Customs Hold"
  | "Delivered"
  | "Delayed";

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

export type QuoteRequestStatus =
  | "New"
  | "In Review"
  | "Quoted"
  | "Won"
  | "Closed";

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
  events: { timestamp: string; location: string; description: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
