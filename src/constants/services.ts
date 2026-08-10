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
    id: "ocean-nvocc",
    title: "Ocean Freight & NVOCC",
    description:
      "Neutral NVOCC ocean freight with liner relationships worldwide — FCL, LCL, inbound and outbound booking at competitive rates.",
    details:
      "As a neutral NVOCC, we book and move ocean cargo without preference for a single carrier — so you get competitive FCL and LCL options across reputed liner agencies. Ideal for exporters and importers who want cost control with reliable sailing schedules.",
    highlights: [
      "Neutral NVOCC booking for inbound & outbound",
      "FCL and LCL options on major trade lanes",
      "Liner relationships for competitive sea rates",
      "Documentation support through to delivery",
    ],
    icon: Ship,
    href: "/services/ocean-nvocc",
  },
  {
    id: "air-freight",
    title: "Air Freight",
    description:
      "Worldwide air cargo for time-critical import and export shipments, including L/C cargo handling and documentation support.",
    details:
      "When transit time matters, we arrange worldwide air cargo with accurate paperwork, L/C shipment handling, and coordination through to consignee delivery. Suited for pharma, electronics, samples, and urgent commercial cargo.",
    highlights: [
      "Worldwide import & export air cargo",
      "L/C shipment handling support",
      "Marine / cargo insurance coordination",
      "Fast documentation and status updates",
    ],
    icon: Plane,
    href: "/services/air-freight",
  },
  {
    id: "consolidation",
    title: "Consolidation",
    description:
      "Ocean and air consolidation through reputed lines so you share container space and reduce freight cost.",
    details:
      "Consolidation lets smaller shipments share ocean or air capacity without waiting for a full container. We consolidate through reputed shipping and airlines so you keep freight spend efficient while cargo still moves on schedule.",
    highlights: [
      "Ocean and air consolidation options",
      "Cost-saving shared-space bookings",
      "Suitable for SME and multi-SKU exporters",
      "Coordinated pickup and destination handling",
    ],
    icon: Boxes,
    href: "/services/consolidation",
  },
  {
    id: "customs",
    title: "Customs Clearance",
    description:
      "Import and export customs clearance with accurate documentation, port clearance, and compliance support.",
    details:
      "Clearance delays are expensive. Our team prepares and processes import/export documents, supports port clearance, and helps resolve holds so cargo keeps moving — with round-the-clock shipment detail assistance when needed.",
    highlights: [
      "Import and export customs clearance",
      "Port clearance at origin and destination",
      "Document accuracy and compliance checks",
      "24×7 shipment detail support",
    ],
    icon: FileCheck,
    href: "/services/customs",
  },
  {
    id: "warehousing",
    title: "Warehousing",
    description:
      "General cargo storage with loading and unloading, labeling, barcoding, and packing support.",
    details:
      "Need short-term or staging storage before sailing or after arrival? We provide general cargo warehousing with loading/unloading, labeling, barcoding, and packing so inventory is ready for dispatch or delivery.",
    highlights: [
      "General cargo storage",
      "Loading and unloading",
      "Labeling and barcoding",
      "Packing support for outbound moves",
    ],
    icon: Warehouse,
    href: "/services/warehousing",
  },
  {
    id: "door-to-door",
    title: "Door-to-Door Service",
    description:
      "Factory or warehouse pickup through port clearance, customs, and delivery to the consignee’s door — import or export.",
    details:
      "Door-to-door covers the full chain: lift from shipper warehouse/factory, transport, port clearance at origin and discharge, customs, and delivery to the consignee’s warehouse or factory — for import or export cargo.",
    highlights: [
      "Pickup from factory or warehouse",
      "Origin and destination port clearance",
      "Customs coordination included",
      "Final delivery to consignee door",
    ],
    icon: DoorOpen,
    href: "/services/door-to-door",
  },
  {
    id: "project-cargo",
    title: "Project Cargo",
    description:
      "Project machinery and project import handling — registration, clearance, finalisation, and cancellation with authorities.",
    details:
      "Project cargo needs more than a booking. We support project machinery and project imports including registration with authorities, clearance, finalisation of project import, and cancellation of project registration when the job closes.",
    highlights: [
      "Project machinery clearance",
      "Second-hand machinery handling",
      "Project import registration support",
      "Authority coordination through closure",
    ],
    icon: ClipboardList,
    href: "/services/project-cargo",
  },
  {
    id: "cargo-insurance",
    title: "Cargo Insurance",
    description:
      "Marine and cargo insurance for import and export shipments, arranged through leading insurers in India.",
    details:
      "Protect freight value in transit. We arrange marine and cargo insurance for import and export shipments through leading insurers in India, and help clients avoid unnecessary cost while cargo is covered.",
    highlights: [
      "Import & export cargo cover",
      "All-risk and transit options",
      "Coordination with leading Indian insurers",
      "Support on claims documentation",
    ],
    icon: Shield,
    href: "/services/cargo-insurance",
  },
  {
    id: "exim-advisory",
    title: "EXIM Trade Advisory",
    description:
      "Guidance on EXIM challenges including DEPB / advance licence and drawback claim assistance.",
    details:
      "Trade paperwork should not block growth. We guide clients through EXIM problems and needs, including assistance with DEPB / advance licence requirements and drawback claims as part of complete logistics support.",
    highlights: [
      "EXIM process guidance",
      "DEPB / advance licence assistance",
      "Drawback claim support",
      "Practical documentation checklists",
    ],
    icon: ScrollText,
    href: "/services/exim-advisory",
  },
  {
    id: "packing-handling",
    title: "Packing & Handling",
    description:
      "Packing, stacking, and handling for general, hazardous, and personal effects / household goods — plus fumigation on request.",
    details:
      "From commercial crates to household goods, we pack, stack, and handle general, hazardous, and personal-effects cargo. Fumigation can be arranged where destination regulations require certificates.",
    highlights: [
      "General and hazardous packing",
      "Personal effects / household goods",
      "Stacking and cargo handling",
      "Fumigation on request",
    ],
    icon: Package,
    href: "/services/packing-handling",
  },
  {
    id: "freight-booking",
    title: "Freight Booking",
    description:
      "Sea and air freight booking as your agent for inbound and outbound cargo with cost-saving rate options.",
    details:
      "Act as your booking agent for sea and air — inbound or outbound — with competitive rate options and coordination across packing, transport, and liner relationships worldwide.",
    highlights: [
      "Sea and air booking agency",
      "Inbound and outbound coverage",
      "Competitive rate sourcing",
      "End-to-end booking coordination",
    ],
    icon: Container,
    href: "/services/freight-booking",
  },
];

/** Compact list for footer / nav chrome. */
export const FOOTER_SERVICES = SERVICES.slice(0, 6);

export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICES.find((service) => service.id === id);
}

export function getServiceIds(): string[] {
  return SERVICES.map((service) => service.id);
}
