import type { QuoteRequest } from "@/types";

export const SERVICE_TYPE_LABELS: Record<QuoteRequest["serviceType"], string> = {
  air: "Air Freight",
  "ocean-fcl": "Ocean FCL",
  "ocean-lcl": "Ocean LCL",
  consolidation: "Consolidation",
  customs: "Customs",
  warehousing: "Warehousing",
  "door-to-door": "Door-to-Door",
  "project-cargo": "Project Cargo",
  "cargo-insurance": "Cargo Insurance",
  "exim-advisory": "EXIM Advisory",
  packing: "Packing & Handling",
};

export const STATUS_FILTER_LABELS: Record<QuoteRequest["status"] | "all", string> =
  {
    all: "All",
    New: "New request",
    "Under Review": "In review",
    "Sent to Forwarders": "Quote requested",
    "Awaiting Forwarder Quotes": "Waiting on quote",
    "Quote Received": "Quote received",
    Quoted: "Quote emailed",
    "Quote Ready / Email Failed": "Customer email failed",
    Accepted: "Accepted",
    Rejected: "Rejected",
    Expired: "Expired",
  };

export const STATUS_CHIP_LABELS: Record<QuoteRequest["status"] | "all", string> =
  {
    all: "All",
    New: "New",
    "Under Review": "In review",
    "Sent to Forwarders": "Sent",
    "Awaiting Forwarder Quotes": "Waiting",
    "Quote Received": "Received",
    Quoted: "Emailed",
    "Quote Ready / Email Failed": "Failed",
    Accepted: "Accepted",
    Rejected: "Rejected",
    Expired: "Expired",
  };

export function statusBadgeVariant(
  status: QuoteRequest["status"],
): "secondary" | "warning" | "success" | "accent" | "muted" | "destructive" {
  switch (status) {
    case "New":
      return "secondary";
    case "Under Review":
    case "Sent to Forwarders":
    case "Awaiting Forwarder Quotes":
      return "warning";
    case "Quote Received":
    case "Quoted":
      return "accent";
    case "Accepted":
      return "success";
    case "Quote Ready / Email Failed":
      return "destructive";
    default:
      return "muted";
  }
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
