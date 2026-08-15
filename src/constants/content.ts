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

export const HERO_HIGHLIGHTS = [
  {
    title: "32+ Years of Experience",
    description: "Trusted international cargo expertise.",
    icon: Award,
  },
  {
    title: "Global Reach",
    description: "Strong network across the world.",
    icon: Globe2,
  },
  {
    title: "End-to-End Solutions",
    description: "From pickup to final delivery.",
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
  "32+ Years Experience",
  "Neutral NVOCC Company",
  "24×7 Shipment & Docs Support",
  "Customs & Port Clearance",
  "Door-to-Door Delivery",
  "EXIM Licence Assistance",
] as const;

export const INDUSTRIES: {
  name: string;
  icon: LucideIcon;
  image?: string;
  description: string;
}[] = [
  {
    name: "Leather Products",
    icon: Briefcase,
    image: "/images/industry-leather.jpg",
    description: "Finished leather, bags, and hides with careful packing.",
  },
  {
    name: "Garments & Apparel",
    icon: Shirt,
    image: "/images/industry-garments.jpg",
    description: "Ready-made garments and textiles on tight sailing dates.",
  },
  {
    name: "Pharma & Bulk Drugs",
    icon: Pill,
    image: "/images/industry-pharma.jpg",
    description: "Temperature-aware handling and compliant documentation.",
  },
  {
    name: "Handicrafts",
    icon: Hammer,
    image: "/images/industry-handicrafts.jpg",
    description: "Fragile artisan cargo packed for export and delivery.",
  },
  {
    name: "Engineering Goods",
    icon: Factory,
    image: "/images/industry-engineering.jpg",
    description: "Components and industrial parts on sea or air.",
  },
  {
    name: "Herbal & Medicaments",
    icon: Leaf,
    image: "/images/industry-herbal.jpg",
    description: "Botanicals and medicaments with customs-ready paperwork.",
  },
  {
    name: "Personal Effects",
    icon: Home,
    image: "/images/industry-personal.jpg",
    description: "Household goods and personal cargo, door to door.",
  },
  {
    name: "Project Machinery",
    icon: Landmark,
    image: "/images/industry-project.jpg",
    description: "Project imports, clearance, and heavy-lift coordination.",
  },
  {
    name: "Second-hand Machinery",
    icon: PackageSearch,
    image: "/images/industry-used-machinery.jpg",
    description: "Used equipment with inspection and port support.",
  },
  {
    name: "Bulk Cargo",
    icon: Ship,
    image: "/images/industry-bulk.jpg",
    description: "Loose and bagged bulk on coastal and deep-sea lanes.",
  },
  {
    name: "Coastal Cargo",
    icon: Anchor,
    image: "/images/industry-coastal.jpg",
    description: "Domestic coastal movement with port-to-port control.",
  },
  {
    name: "Chemicals",
    icon: FlaskConical,
    image: "/images/industry-chemicals.jpg",
    description: "Compliant handling for general and regulated chemicals.",
  },
];
export const PROCESS_STEPS = [
  {
    title: "Request a Quote",
    description:
      "Share origin, destination, and cargo details for competitive sea or air rates.",
    icon: MessageSquareText,
  },
  {
    title: "Booking & Docs",
    description:
      "We book freight, arrange packing if needed, and prepare clearance documentation.",
    icon: FileText,
  },
  {
    title: "Pickup & Dispatch",
    description:
      "Cargo is lifted from your warehouse or factory and moved via ocean or air.",
    icon: Truck,
  },
  {
    title: "Clearance & Updates",
    description:
      "Port and customs clearance with round-the-clock shipment status support.",
    icon: Route,
  },
  {
    title: "Door Delivery",
    description:
      "Cleared cargo delivered to the consignee’s warehouse or factory on time.",
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
    transit: "3–7 days",
    highlight: "Dubai · Jeddah · Doha",
  },
  {
    origin: "India",
    destination: "Europe",
    modes: ["air", "ocean"] as const,
    transit: "5–14 days",
    highlight: "Rotterdam · Hamburg · London",
  },
  {
    origin: "India",
    destination: "North America",
    modes: ["air", "ocean"] as const,
    transit: "7–21 days",
    highlight: "New York · Los Angeles · Toronto",
  },
  {
    origin: "India",
    destination: "Southeast Asia",
    modes: ["air", "ocean"] as const,
    transit: "2–6 days",
    highlight: "Singapore · Bangkok · Jakarta",
  },
] as const;

export const GLOBAL_REACH_STATS = [
  { label: "Company type", value: "NVOCC" },
  { label: "Primary modes", value: "Sea · Air" },
  { label: "Delivery model", value: "Door-to-Door" },
] as const;

/** Profile-backed figures only — avoid unverified shipment / on-time claims. */
export const STATS = [
  { label: "Years Experience", value: 32, suffix: "+" },
  { label: "Core Service Lines", value: 11, suffix: "" },
  { label: "Customer Support", value: 24, suffix: "×7" },
] as const;

export const TESTIMONIALS = [
  {
    text: "ExpressWay handled our garment exports end to end — booking, consolidation, and customs — with clear updates whenever we needed them.",
    author: "Rajesh Kumar",
    company: "Apparel Exporter",
  },
  {
    text: "Their project machinery clearance and documentation support made a complex import straightforward. Professional and responsive throughout.",
    author: "Anita Desai",
    company: "Industrial Importer",
  },
  {
    text: "Competitive ocean rates and reliable door-to-door delivery. A true NVOCC partner that helps us control freight cost.",
    author: "Amit Patel",
    company: "Trading House",
  },
  {
    text: "Leather shipments used to stall on paperwork. ExpressWay keeps the docs and sailing dates aligned so our buyers get cargo on schedule.",
    author: "Priya Sharma",
    company: "Leather Exporter",
  },
  {
    text: "Temperature-aware handling and customs-ready files for our pharma lanes. One desk for air and ocean instead of chasing multiple agents.",
    author: "Vikram Singh",
    company: "Pharma Exporter",
  },
  {
    text: "Fragile handicrafts packed, booked, and delivered without damage claims. Clear status updates from pickup through door delivery.",
    author: "Meera Iyer",
    company: "Handicrafts Exporter",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What does ExpressWay Logistic do?",
    answer:
      "We are a neutral NVOCC and freight forwarder offering ocean and air freight, consolidation, customs clearance, warehousing, project cargo, cargo insurance, packing, and door-to-door delivery — plus EXIM guidance such as licence and drawback assistance.",
  },
  {
    question: "Which cargo types do you specialise in?",
    answer:
      "Exports include leather, garments, handicrafts, pharma, engineering goods, herbal products, and personal effects. Imports include project and second-hand machinery, bulk cargo, coastal cargo, chemicals, and bulk drugs.",
  },
  {
    question: "Can I track my shipment in real time?",
    answer:
      "Yes. Use our public tracking page or the AI Logistics Command Center for live status, ETA updates, and exception alerts. Our team also provides round-the-clock shipment detail support.",
  },
  {
    question: "How quickly can I get a freight quote?",
    answer:
      "Submit the quote form with origin, destination, and cargo details. Our team typically responds within two business hours with competitive sea or air options.",
  },
  {
    question: "Do you help with EXIM licences and drawback?",
    answer:
      "Yes. We assist clients with DEPB / advance licence requirements and drawback claims as part of our EXIM trade advisory support.",
  },
] as const;
