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
} from "lucide-react";

export const ABOUT_HIGHLIGHTS = [
  "32+ Years Experience",
  "Neutral NVOCC Company",
  "24×7 Shipment & Docs Support",
  "Customs & Port Clearance",
  "Door-to-Door Delivery",
  "EXIM Licence Assistance",
] as const;

export const INDUSTRIES: { name: string; icon: LucideIcon }[] = [
  { name: "Leather Products", icon: Briefcase },
  { name: "Garments & Apparel", icon: Shirt },
  { name: "Pharma & Bulk Drugs", icon: Pill },
  { name: "Handicrafts", icon: Hammer },
  { name: "Engineering Goods", icon: Factory },
  { name: "Herbal & Medicaments", icon: Leaf },
  { name: "Personal Effects", icon: Home },
  { name: "Project Machinery", icon: Landmark },
  { name: "Second-hand Machinery", icon: PackageSearch },
  { name: "Bulk Cargo", icon: Ship },
  { name: "Coastal Cargo", icon: Anchor },
  { name: "Chemicals", icon: FlaskConical },
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
  { title: "Competitive Sea & Air Rates", icon: DollarSign },
  { title: "Global Liner Network", icon: Network },
  { title: "Accurate Shipment Details", icon: LocateFixed },
  { title: "Dedicated EXIM Experts", icon: Users },
  { title: "Safe Cargo Handling", icon: PackageOpen },
  { title: "Fast Documentation", icon: Zap },
  { title: "Customs Compliance", icon: Scale },
  { title: "End-to-End Visibility", icon: Eye },
  { title: "Cost-Saving Advantage", icon: ShieldCheck },
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
