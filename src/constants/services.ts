import type { LucideIcon } from "lucide-react";
import {
  Plane,
  Ship,
  FileCheck,
  Warehouse,
  Package,
  Shield,
  Container,
  Boxes,
  ScrollText,
  DoorOpen,
  ClipboardList,
  Network,
  Box,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  highlights: string[];
  icon: LucideIcon;
  href: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "freight-forwarding",
    title: "Freight Forwarding",
    description:
      "PAN India freight forwarding for businesses moving cargo to and from worldwide destinations — pickup, booking, documents, customs and delivery.",
    details:
      "ExpressWay Logistic coordinates origin pickup, freight booking, documentation, customs, port handling, ocean or air movement, destination coordination and door delivery when required. The commercial proposition is PAN India origins to worldwide destinations, not a single-city operation.",
    highlights: [
      "Origin pickup across India through our logistics network",
      "Ocean and air freight booking for import and export",
      "Documentation and customs coordination",
      "Destination handling and door delivery when required",
    ],
    icon: Network,
    href: "/services/freight-forwarding",
  },
  {
    id: "nvocc",
    title: "Neutral Logistics Provider",
    description:
      "Ocean services from India as a Neutral Logistics Provider: FCL, LCL, consolidation, booking and documentation without locking you to a single liner.",
    details:
      "ExpressWay books ocean space with vessel operators and issues house documentation without operating the vessel. As a Neutral Logistics Provider, ExpressWay sources FCL and LCL options so shippers can compare cost and schedule rather than a house-only sailing. We do not publish exclusive carrier lists.",
    highlights: [
      "Neutral booking for inbound and outbound ocean cargo",
      "FCL and LCL options on commercially used trade lanes",
      "Consolidation for less-than-container volumes",
      "Booking and documentation support through to delivery",
    ],
    icon: Ship,
    href: "/services/neutral-logistics-provider",
  },
  {
    id: "ocean-freight",
    title: "Ocean Freight",
    description:
      "Ocean freight services from India to worldwide destinations — FCL, LCL, consolidation, port movement, documentation and customs coordination.",
    details:
      "Ocean freight is the primary mode for cost-efficient commercial cargo. ExpressWay arranges export and import ocean movement, including FCL, LCL and consolidation, with port handling, documentation and customs coordination. Transit depends on carrier, sailing, origin, destination and operational conditions.",
    highlights: [
      "Export and import ocean freight",
      "FCL, LCL and consolidation",
      "Port movement and documentation",
      "Door delivery arranged when the shipment requires it",
    ],
    icon: Ship,
    href: "/services/ocean-freight",
  },
  {
    id: "air-freight",
    title: "Air Freight",
    description:
      "International air freight from India for time-critical import and export cargo, including airport handling, documentation and customs coordination.",
    details:
      "Air freight is used when transit time matters more than ocean cost. ExpressWay arranges import and export air cargo with documentation, airport handling, customs coordination and delivery when required. Suitable for samples, pharma, electronics and urgent commercial cargo.",
    highlights: [
      "Time-critical import and export air cargo",
      "Airport handling and documentation",
      "Customs coordination",
      "Delivery arranged when required",
    ],
    icon: Plane,
    href: "/services/air-freight",
  },
  {
    id: "fcl-shipping",
    title: "FCL Shipping",
    description:
      "Full container load shipping from India: origin pickup, port handling, export documentation, ocean movement, destination clearance and delivery.",
    details:
      "Full container load (FCL) is used when cargo volume, packing control or sailing preference justifies a dedicated container. ExpressWay books FCL, coordinates origin pickup and port handling, and supports documentation, destination clearance and final delivery when those steps are in scope. Container equipment is confirmed per booking — we do not publish a static equipment catalogue as universally available.",
    highlights: [
      "Dedicated container bookings",
      "Origin pickup and port handling",
      "Export and import documentation",
      "Destination clearance and delivery when required",
    ],
    icon: Container,
    href: "/services/fcl-shipping",
  },
  {
    id: "lcl-shipping",
    title: "LCL Shipping",
    description:
      "Less-than-container load shipping from India: shared container space, origin consolidation, documentation and destination deconsolidation.",
    details:
      "Less-than-container load (LCL) lets smaller shipments share container space instead of waiting for a full box. ExpressWay arranges origin consolidation, documentation, ocean movement and destination deconsolidation so SME and multi-SKU exporters can move cargo without FCL volume.",
    highlights: [
      "Shared container space for smaller volumes",
      "Origin consolidation",
      "Documentation aligned to the house shipment",
      "Destination deconsolidation and delivery when required",
    ],
    icon: Box,
    href: "/services/lcl-shipping",
  },
  {
    id: "consolidation",
    title: "Consolidation",
    description:
      "Ocean and air consolidation so smaller shipments share capacity and keep freight spend efficient.",
    details:
      "Consolidation groups multiple shipper lots into shared ocean or air capacity. ExpressWay consolidates cargo so you do not need a full container or a dedicated air pallet when volume is smaller. Pickup and destination handling are coordinated with the consolidated movement.",
    highlights: [
      "Ocean and air consolidation options",
      "Cost-efficient shared-space bookings",
      "Suitable for SME and multi-SKU exporters",
      "Coordinated pickup and destination handling",
    ],
    icon: Boxes,
    href: "/services/consolidation",
  },
  {
    id: "customs-clearance",
    title: "Customs Clearance",
    description:
      "Import and export customs clearance in India with documentation, port clearance and shipment-specific compliance support.",
    details:
      "Customs documentation and requirements vary by commodity, origin, destination and applicable regulations. ExpressWay prepares and processes import and export clearance paperwork, supports port clearance, and coordinates holds so cargo can keep moving. Customers should verify current regulatory requirements for their shipment. This is operational assistance, not universal legal advice.",
    highlights: [
      "Import and export customs clearance",
      "Port clearance at origin and destination",
      "Document accuracy checks for the actual commodity",
      "24×7 shipment detail support when cargo is in process",
    ],
    icon: FileCheck,
    href: "/services/customs-clearance",
  },
  {
    id: "warehousing",
    title: "Warehousing",
    description:
      "Cargo storage, loading and unloading, labeling, barcoding and packing support arranged through our logistics network.",
    details:
      "Warehousing is arranged through our logistics network for staging before sailing or after arrival. Support can include general cargo storage, loading and unloading, labeling, barcoding and packing. This does not imply ExpressWay-owned warehouses in every city.",
    highlights: [
      "Storage arranged through the logistics network",
      "Loading and unloading",
      "Labeling and barcoding",
      "Packing support for outbound moves",
    ],
    icon: Warehouse,
    href: "/services/warehousing",
  },
  {
    id: "door-to-door-logistics",
    title: "Door-to-Door Logistics",
    description:
      "Pickup, origin handling, freight booking, export documentation, customs, ocean or air movement, destination clearance and final delivery.",
    details:
      "Door-to-door covers the chain from shipper pickup across India through origin handling, booking, export documentation, customs, ocean or air movement, destination clearance and final delivery to the consignee. Scope is confirmed per shipment.",
    highlights: [
      "PAN India origin pickup through the logistics network",
      "Origin handling, booking and export documentation",
      "Customs and main-carriage (ocean or air)",
      "Destination clearance and final delivery",
    ],
    icon: DoorOpen,
    href: "/services/door-to-door-logistics",
  },
  {
    id: "project-cargo",
    title: "Project Cargo",
    description:
      "Project machinery and project import handling — documentation, clearance, registration support and delivery coordination.",
    details:
      "Project cargo needs more than a standard booking. ExpressWay supports project machinery and project imports including documentation, clearance, registration with authorities where required, and delivery coordination. Oversized or heavy cargo may need specialised handling partners; capability is confirmed per shipment rather than assumed.",
    highlights: [
      "Project machinery documentation and clearance",
      "Second-hand machinery handling where applicable",
      "Project import registration support when required",
      "Delivery coordination through project closure",
    ],
    icon: ClipboardList,
    href: "/services/project-cargo",
  },
  {
    id: "cargo-insurance",
    title: "Cargo Insurance",
    description:
      "Marine and cargo insurance can be arranged for import and export shipments through appropriate insurance providers.",
    details:
      "ExpressWay is not an insurer. Insurance can be arranged through appropriate insurance providers, subject to policy terms and eligibility. Cover is considered for import and export cargo based on declared value, mode and risk.",
    highlights: [
      "Import and export cargo cover options",
      "Arranged through insurance providers",
      "Subject to policy terms and eligibility",
      "Support on documents typically required for claims",
    ],
    icon: Shield,
    href: "/services/cargo-insurance",
  },
  {
    id: "exim-consultancy",
    title: "EXIM Consultancy",
    description:
      "EXIM advisory for IEC-related assistance, documentation, export and import processes, licence assistance and drawback support where offered.",
    details:
      "ExpressWay guides clients through export and import processes, documentation, IEC-related questions, licence assistance and drawback assistance where that support is actually required for the shipment. Scheme names and government benefits change; we do not treat outdated programme labels as currently applicable without verification.",
    highlights: [
      "EXIM process and documentation guidance",
      "IEC-related assistance",
      "Licence assistance where applicable",
      "Drawback assistance where offered for the shipment",
    ],
    icon: ScrollText,
    href: "/services/exim-consultancy",
  },
  {
    id: "packing-handling",
    title: "Packing & Handling",
    description:
      "Packing and handling for general cargo, personal effects and household goods. Hazardous cargo and fumigation only where legally and operationally supported.",
    details:
      "ExpressWay packs, stacks and handles general cargo and personal effects / household goods. Hazardous cargo is accepted only where legally and operationally supported for that commodity and lane. Fumigation can be arranged when destination rules require certificates.",
    highlights: [
      "General cargo packing and handling",
      "Personal effects and household goods",
      "Hazardous cargo only where supported",
      "Fumigation arranged when required",
    ],
    icon: Package,
    href: "/services/packing-handling",
  },
  {
    id: "freight-booking",
    title: "Freight Booking",
    description:
      "Sea and air freight booking for inbound and outbound cargo — share cargo details and request rates without a public tariff.",
    details:
      "ExpressWay acts as booking agent for inbound and outbound ocean and air cargo. You provide cargo information; we source available options and coordinate documentation around the booking. There is no static public rate list because liner and air rates move with space, fuel and season.",
    highlights: [
      "Inbound and outbound ocean and air booking",
      "Rate request against actual cargo details",
      "Documentation coordination around the booking",
      "Request a quote to start",
    ],
    icon: Container,
    href: "/services/freight-booking",
  },
];

export const SERVICE_COUNT = SERVICES.length;

export const SERVICE_ALIASES: Record<string, string> = {
  nvocc: "nvocc",
  "neutral-logistics-provider": "nvocc",
  "ocean-nvocc": "nvocc",
  customs: "customs-clearance",
  "door-to-door": "door-to-door-logistics",
  "exim-advisory": "exim-consultancy",
};

export const FOOTER_SERVICES = SERVICES.slice(0, 6);

export function resolveServiceId(id: string): string {
  return SERVICE_ALIASES[id] ?? id;
}

export function getServiceById(id: string): ServiceItem | undefined {
  const resolved = resolveServiceId(id);
  return SERVICES.find(
    (service) =>
      service.id === resolved ||
      service.href === `/services/${id}` ||
      service.href === `/services/${resolved}`,
  );
}

export function getServiceIds(): string[] {
  return SERVICES.map((service) => service.href.replace(/^\/services\//, ""));
}
