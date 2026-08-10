import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Package,
  PackageSearch,
  ScrollText,
  ShieldCheck,
  UserPlus,
  Warehouse,
} from "lucide-react";
import { z } from "zod";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const APPOINTMENT_TYPES = [
  "freight-planning",
  "customs-advisory",
  "project-cargo",
  "exim-advisory",
  "packing-consult",
  "warehouse-visit",
  "account-onboarding",
] as const;

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const MEETING_MODES = ["video", "phone", "in-person"] as const;

export const appointmentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(8, "Phone is required")
    .refine(
      (v) => /^[+]?[\d\s-]{8,20}$/.test(v),
      "Enter a valid phone number",
    ),
  appointmentType: z.enum(APPOINTMENT_TYPES),
  preferredDate: z
    .string()
    .min(1, "Select a preferred date")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime()) || date < todayStart()) return false;
      const day = date.getDay();
      return day !== 0 && day !== 6;
    }, "Choose a weekday (Mon–Fri)"),
  preferredTime: z.enum(TIME_SLOTS),
  meetingMode: z.enum(MEETING_MODES),
  notes: z.string().max(1000, "Notes must be under 1000 characters").optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
export type AppointmentType = AppointmentFormValues["appointmentType"];
export type PreferredTime = AppointmentFormValues["preferredTime"];
export type MeetingMode = AppointmentFormValues["meetingMode"];

export type MeetingTypeOption = {
  id: AppointmentType;
  title: string;
  duration: string;
  formatHint: string;
  description: string;
  includes: string[];
  icon: LucideIcon;
  accent: string;
};

export const MEETING_TYPES: MeetingTypeOption[] = [
  {
    id: "freight-planning",
    title: "Freight Planning",
    duration: "30 min",
    formatHint: "Video or phone",
    description:
      "Map sea or air options — FCL, LCL, consolidation, or door-to-door — with a forwarding specialist.",
    includes: [
      "Origin–destination mode options",
      "Transit time & competitive rate guidance",
      "Pickup and delivery windows",
      "Special cargo handling needs",
    ],
    icon: PackageSearch,
    accent: "from-sky-500/20 to-transparent",
  },
  {
    id: "customs-advisory",
    title: "Customs Advisory",
    duration: "45 min",
    formatHint: "Video or phone",
    description:
      "Walk import/export paperwork, port clearance, and compliance before cargo moves.",
    includes: [
      "Document checklist for your lane",
      "Duty & compliance pointers",
      "Hold and exception handling",
      "Clearance coordination plan",
    ],
    icon: ShieldCheck,
    accent: "from-amber-500/20 to-transparent",
  },
  {
    id: "project-cargo",
    title: "Project Cargo Consult",
    duration: "45 min",
    formatHint: "Video or phone",
    description:
      "Plan project machinery or project import registration, clearance, and authority coordination.",
    includes: [
      "Project machinery / second-hand scope",
      "Registration & clearance path",
      "Document and authority checklist",
      "Timeline and risk points",
    ],
    icon: ClipboardList,
    accent: "from-indigo-500/20 to-transparent",
  },
  {
    id: "exim-advisory",
    title: "EXIM Licence Advisory",
    duration: "45 min",
    formatHint: "Video or phone",
    description:
      "Get guidance on EXIM challenges including DEPB / advance licence and drawback claims.",
    includes: [
      "Licence requirement overview",
      "Drawback claim assistance path",
      "Document readiness checklist",
      "Next actions for your shipment",
    ],
    icon: ScrollText,
    accent: "from-violet-500/20 to-transparent",
  },
  {
    id: "packing-consult",
    title: "Packing & Household",
    duration: "30 min",
    formatHint: "Video, phone, or visit",
    description:
      "Plan packing for general, hazardous, personal effects, or household goods — including fumigation needs.",
    includes: [
      "Packing scope and materials",
      "Hazardous / household handling",
      "Fumigation requirements",
      "Labeling and barcoding options",
    ],
    icon: Package,
    accent: "from-rose-500/20 to-transparent",
  },
  {
    id: "warehouse-visit",
    title: "Warehouse Visit",
    duration: "60 min",
    formatHint: "Noida facility",
    description:
      "See storage, packing, and dispatch live at our Assotech Business Cresterra office.",
    includes: [
      "Facility walkthrough",
      "Storage & inventory options",
      "Inbound / outbound process",
      "SLA and security overview",
    ],
    icon: Warehouse,
    accent: "from-emerald-500/20 to-transparent",
  },
  {
    id: "account-onboarding",
    title: "Account Onboarding",
    duration: "45 min",
    formatHint: "Any format",
    description:
      "Lock in shipper profile, preferred lanes, and how we will handle your recurring EXIM moves.",
    includes: [
      "Company & billing setup",
      "Preferred modes and partners",
      "Tracking & communication cadence",
      "Dedicated ops contact",
    ],
    icon: UserPlus,
    accent: "from-orange-500/20 to-transparent",
  },
];

export const TIME_SLOT_LABELS: Record<PreferredTime, string> = {
  "09:00": "9:00 AM",
  "10:00": "10:00 AM",
  "11:00": "11:00 AM",
  "12:00": "12:00 PM",
  "14:00": "2:00 PM",
  "15:00": "3:00 PM",
  "16:00": "4:00 PM",
  "17:00": "5:00 PM",
};

export const MEETING_MODE_LABELS: Record<MeetingMode, string> = {
  video: "Video Call",
  phone: "Phone Call",
  "in-person": "In Person (Noida)",
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> =
  Object.fromEntries(MEETING_TYPES.map((t) => [t.id, t.title])) as Record<
    AppointmentType,
    string
  >;

export const MEETING_EXPECTATIONS = [
  {
    code: "ORIGIN",
    title: "Brief the cargo",
    description:
      "Share lane, commodity, weight, and any compliance constraints you already know.",
  },
  {
    code: "TRANSIT",
    title: "Chart the options",
    description:
      "We compare modes, transit windows, and documentation so the path is clear.",
  },
  {
    code: "ARRIVAL",
    title: "Leave with a plan",
    description:
      "Walk away with a quote path, warehouse plan, or onboarding checklist.",
  },
] as const;

export const BOOKING_FAQS = [
  {
    question: "Should I book a meeting or request a quote?",
    answer:
      "Use the quote form when you already know origin, destination, and cargo details. Book a meeting for freight planning, customs guidance, project cargo, EXIM licences, packing advice, a warehouse tour, or new shipper onboarding.",
  },
  {
    question: "What should I prepare before the appointment?",
    answer:
      "Have commodity type, approximate weight/volume, Incoterms if known, and any past shipping pain points ready. For customs or project meetings, bring sample invoices, packing lists, or machinery specs if available.",
  },
  {
    question: "Where are in-person meetings held?",
    answer:
      "In-person appointments and warehouse visits take place at our office at Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135, Noida. We send the exact address and visitor instructions with your confirmation.",
  },
  {
    question: "What timezone are the slots in?",
    answer:
      "Slots are in India Standard Time (IST), aligned with our Noida operations team. Remote video and phone meetings are available for clients across India and abroad.",
  },
  {
    question: "Can I reschedule or cancel?",
    answer:
      "Yes. Reply to your confirmation email or call us at least 24 hours ahead and we will move or cancel the appointment.",
  },
] as const;

/** Next `count` weekdays (Mon–Fri), starting from today if weekday. */
export function getAvailableDates(count = 10): string[] {
  const dates: string[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      const yyyy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, "0");
      const dd = String(cursor.getDate()).padStart(2, "0");
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
