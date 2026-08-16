import type { LucideIcon } from "lucide-react";
import {
  Factory,
  Shirt,
  PackageSearch,
  FlaskConical,
  Landmark,
  Hammer,
  Ship,
  Anchor,
  Pill,
  Leaf,
  Home,
  Briefcase,
  MessageSquareText,
  FileText,
  Truck,
  Route,
  PackageCheck,
  DollarSign,
  Network,
  LocateFixed,
  Users,
  PackageOpen,
  Zap,
  Scale,
  Eye,
  ShieldCheck,
  Award,
  Globe2,
  Clock,
  Monitor,
  Headphones,
} from "lucide-react";

export const YEARS_EXPERIENCE = 39;

export const LEADERS = [
  {
    name: "Sunil Kumar",
    title: "CEO & Managing Director",
    image: "/images/consulting-portrait.jpg",
    bio: "Driving vision and growth with 39 years of expertise in global logistics and operations.",
    imageClass: "object-cover object-[50%_28%]",
  },
  {
    name: "Joginder Singh",
    title: "General Manager & Business Development Officer",
    image: "/images/team/joginder-singh.jpg",
    bio: "Leading business development and client relationships with a focus on trust and results.",
    imageClass: "object-cover object-[50%_18%]",
  },
] as const;

export const HERO_HIGHLIGHTS = [
  {
    title: "39+ Years of Experience",
    description: "Trusted international cargo expertise.",
    icon: Award,
  },
  {
    title: "PAN India → Worldwide",
    description:
      "Nationwide origin coverage with global destination connectivity.",
    icon: Globe2,
  },
  {
    title: "End-to-End Logistics",
    description: "From pickup and documentation to final delivery.",
    icon: PackageOpen,
  },
] as const;

export const HERO_FEATURES = [
  {
    title: "On-Time Delivery",
    description: "Reliability you can count on.",
    icon: Clock,
  },
  {
    title: "Customs Expertise",
    description: "Smooth & compliant clearance.",
    icon: Scale,
  },
  {
    title: "Real-Time Tracking",
    description: "Visibility at every step.",
    icon: Monitor,
  },
  {
    title: "24/7 Support",
    description: "We're here, always.",
    icon: Headphones,
  },
] as const;

export const ABOUT_HIGHLIGHTS = [
  "39+ Years Experience",
  "Neutral NVOCC Company",
  "24×7 Shipment & Docs Support",
  "Customs & Port Clearance",
  "Door-to-Door Delivery",
  "EXIM Licence Assistance",
] as const;

export const INDUSTRIES: {
  slug: string;
  name: string;
  icon: LucideIcon;
  image?: string;
  description: string;
  detail: string;
  focus: string;
}[] = [
  {
    slug: "leather-products",
    name: "Leather Products",
    icon: Briefcase,
    image: "/images/industry-leather.jpg",
    description: "Finished leather, bags, and hides with careful packing.",
    detail:
      "Finished leather, bags, and hides need moisture-aware packing so buyers receive cargo in saleable condition — with sailing dates aligned to buyer windows.",
    focus: "Export packing and condition control",
  },
  {
    slug: "garments-apparel",
    name: "Garments & Apparel",
    icon: Shirt,
    image: "/images/industry-garments.jpg",
    description: "Ready-made garments and textiles on tight sailing dates.",
    detail:
      "Ready-made garments and textiles move on tight sailing dates. We book space, keep cartons and docs aligned, and push clearance so seasonal cargo does not miss the vessel.",
    focus: "Sailing-date and consolidation control",
  },
  {
    slug: "pharma-bulk-drugs",
    name: "Pharma & Bulk Drugs",
    icon: Pill,
    image: "/images/industry-pharma.jpg",
    description: "Temperature-aware handling and compliant documentation.",
    detail:
      "Temperature-aware handling and compliant documentation for bulk drugs and finished pharma — so filings and handling match the cargo, not a generic freight template.",
    focus: "Compliant docs and careful handling",
  },
  {
    slug: "handicrafts",
    name: "Handicrafts",
    icon: Hammer,
    image: "/images/industry-handicrafts.jpg",
    description: "Fragile artisan cargo packed for export and delivery.",
    detail:
      "Fragile artisan cargo is packed for export and last-mile delivery, with stacking and handling chosen so pieces arrive intact for the buyer.",
    focus: "Fragile packing and delivery care",
  },
  {
    slug: "engineering-goods",
    name: "Engineering Goods",
    icon: Factory,
    image: "/images/industry-engineering.jpg",
    description: "Components and industrial parts on sea or air.",
    detail:
      "Components and industrial parts move by sea or air depending on lead time. We map the mode, packing, and docs so factory schedules are not waiting on freight.",
    focus: "Mode choice and parts documentation",
  },
  {
    slug: "herbal-medicaments",
    name: "Herbal & Medicaments",
    icon: Leaf,
    image: "/images/industry-herbal.jpg",
    description: "Botanicals and medicaments with customs-ready paperwork.",
    detail:
      "Botanicals and medicaments need customs-ready paperwork and packing that protects product integrity from origin warehouse through destination clearance.",
    focus: "Customs-ready product paperwork",
  },
  {
    slug: "personal-effects",
    name: "Personal Effects",
    icon: Home,
    image: "/images/industry-personal.jpg",
    description: "Household goods and personal cargo, door to door.",
    detail:
      "Household goods and personal cargo, door to door — packing, documentation, and delivery coordinated so families and relocating staff are not chasing the shipment.",
    focus: "Door-to-door household movement",
  },
  {
    slug: "project-machinery",
    name: "Project Machinery",
    icon: Landmark,
    image: "/images/industry-project.jpg",
    description: "Project imports, clearance, and heavy-lift coordination.",
    detail:
      "Project imports, clearance, and delivery coordination — including registration, finalisation, and cancellation with authorities when the project cargo requires it. Specialised lifting is confirmed per shipment.",
    focus: "Project clearance and delivery coordination",
  },
  {
    slug: "second-hand-machinery",
    name: "Second-hand Machinery",
    icon: PackageSearch,
    image: "/images/industry-used-machinery.jpg",
    description: "Used equipment with inspection and port support.",
    detail:
      "Used equipment often needs inspection and extra port support. We handle the paperwork and origin/destination coordination so second-hand machinery does not stall at the berth.",
    focus: "Inspection and used-equipment docs",
  },
  {
    slug: "bulk-cargo",
    name: "Bulk Cargo",
    icon: Ship,
    image: "/images/industry-bulk.jpg",
    description: "Loose and bagged bulk on coastal and deep-sea lanes.",
    detail:
      "Loose and bagged bulk on coastal and deep-sea lanes, with handling and documentation matched to commodity type rather than container-only assumptions.",
    focus: "Bulk handling on sea lanes",
  },
  {
    slug: "coastal-cargo",
    name: "Coastal Cargo",
    icon: Anchor,
    image: "/images/industry-coastal.jpg",
    description: "Domestic coastal movement with port-to-port control.",
    detail:
      "Domestic coastal movement with port-to-port control — useful when cargo stays on the Indian coast and still needs a disciplined booking and documentation desk.",
    focus: "Port-to-port coastal control",
  },
  {
    slug: "chemicals",
    name: "Chemicals",
    icon: FlaskConical,
    image: "/images/industry-chemicals.jpg",
    description: "Compliant handling for general and regulated chemicals.",
    detail:
      "Compliant handling for general and regulated chemicals, with packing, declarations, and carrier acceptance checked before cargo is offered to the line.",
    focus: "Regulated handling and declarations",
  },
];

export function getIndustryBySlug(slug: string) {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}

export const PROCESS_STEPS = [
  {
    title: "Request a Quote",
    description:
      "Share origin, destination, and cargo details for competitive sea or air rates.",
    detail:
      "Tell us the lane, cargo type, volume, and any sailing or delivery window. We return competitive ocean or air options — typically within one business day.",
    youProvide: "Origin, destination, cargo type, and approximate volume",
    weHandle: "Lane mapping, mode advice, and a comparable rate view",
    icon: MessageSquareText,
  },
  {
    title: "Booking & Docs",
    description:
      "We book freight, arrange packing if needed, and prepare clearance documentation.",
    detail:
      "Once you confirm, we book the sailing or flight, arrange packing if needed, and prepare the paperwork so cargo is not waiting on documents at the port.",
    youProvide: "Confirmed cargo details, invoices, and packing lists",
    weHandle: "Freight booking, packing coordination, and clearance docs",
    icon: FileText,
  },
  {
    title: "Pickup & Dispatch",
    description:
      "Cargo is lifted from your warehouse or factory and moved via ocean or air.",
    detail:
      "We lift cargo from your warehouse or factory, move it to the origin port or airport, and hand it to the booked liner or airline on the agreed schedule.",
    youProvide: "Ready cargo and a pickup window at origin",
    weHandle: "Pickup, origin handling, and dispatch on the booked mode",
    icon: Truck,
  },
  {
    title: "Clearance & Updates",
    description:
      "Port and customs clearance with round-the-clock shipment status support.",
    detail:
      "Port and customs clearance is handled with accurate filings. You get shipment status when you need origin, ETA, or document updates — including 24×7 desk support.",
    youProvide: "Any additional licences or authority paperwork required",
    weHandle: "Customs filings, port clearance, and status updates",
    icon: Route,
  },
  {
    title: "Door Delivery",
    description:
      "Cleared cargo delivered to the consignee’s warehouse or factory on time.",
    detail:
      "After clearance, cargo is delivered to the consignee’s warehouse or factory. One team stays with the shipment from quote through the last mile.",
    youProvide: "Delivery address and any site access instructions",
    weHandle: "Final-mile delivery and confirmation at destination",
    icon: PackageCheck,
  },
] as const;

export const TRUST_SIGNALS = [
  {
    title: "Competitive Sea & Air Rates",
    description: "Neutral NVOCC booking so you get cost-effective options.",
    icon: DollarSign,
  },
  {
    title: "Global Liner Network",
    description: "Relationships across reputed lines on major trade lanes.",
    icon: Network,
  },
  {
    title: "Accurate Shipment Details",
    description: "Clear status when you need origin, ETA, or documents.",
    icon: LocateFixed,
  },
  {
    title: "Dedicated EXIM Experts",
    description: "A desk that knows licences, drawback, and clearance.",
    icon: Users,
  },
  {
    title: "Safe Cargo Handling",
    description: "Packing, stacking, and handling matched to the cargo.",
    icon: PackageOpen,
  },
  {
    title: "Fast Documentation",
    description: "Paperwork prepared so cargo does not wait at the port.",
    icon: Zap,
  },
  {
    title: "Customs Compliance",
    description: "Import and export clearance with accurate filings.",
    icon: Scale,
  },
  {
    title: "End-to-End Visibility",
    description: "From pickup through delivery — one chain of updates.",
    icon: Eye,
  },
  {
    title: "Cost-Saving Advantage",
    description: "Consolidation and routing choices that protect margin.",
    icon: ShieldCheck,
  },
] as const;

export const GLOBAL_CORRIDORS = [
  {
    origin: "India",
    destination: "Middle East",
    modes: ["air", "ocean"] as const,
    transit: "Indicative; varies by carrier and conditions",
    highlight: "Dubai · Jeddah · Doha",
    href: "/shipping-routes/india-to-dubai",
  },
  {
    origin: "India",
    destination: "Europe",
    modes: ["air", "ocean"] as const,
    transit: "Indicative; varies by carrier and conditions",
    highlight: "Rotterdam · Hamburg · London",
    href: "/shipping-routes/india-to-netherlands",
  },
  {
    origin: "India",
    destination: "North America",
    modes: ["air", "ocean"] as const,
    transit: "Indicative; varies by carrier and conditions",
    highlight: "New York · Los Angeles · Toronto",
    href: "/shipping-routes/india-to-usa",
  },
  {
    origin: "India",
    destination: "Southeast Asia",
    modes: ["air", "ocean"] as const,
    transit: "Indicative; varies by carrier and conditions",
    highlight: "Singapore · Bangkok · Jakarta",
    href: "/shipping-routes/india-to-singapore",
  },
] as const;

export const GLOBAL_REACH_STATS = [
  { label: "Company type", value: "NVOCC" },
  { label: "Primary modes", value: "Sea · Air" },
  { label: "Delivery model", value: "Door-to-Door" },
] as const;

/** Profile-backed figures only — avoid unverified shipment / on-time claims. */
export const STATS = [
  { label: "Years of Experience", value: YEARS_EXPERIENCE, suffix: "+" },
  { label: "Core Service Capabilities", value: 11, suffix: "" },
  { label: "Shipment & Documentation Support", value: 24, suffix: "/7" },
] as const;

export { FAQ_ITEMS } from "@/constants/faqs";
