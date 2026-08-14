import { BellRing, CircleDollarSign, FileText, Truck } from "lucide-react";
import type { EmailCategory } from "@/types";

export const CATEGORY_UI: Record<
  EmailCategory,
  {
    label: string;
    short: string;
    icon: typeof Truck;
    wrap: string;
    tint: string;
  }
> = {
  shipment: {
    label: "Shipments",
    short: "Shipments",
    icon: Truck,
    wrap: "bg-sky-100 text-sky-700",
    tint: "text-sky-600",
  },
  quotation: {
    label: "Quotations",
    short: "Quotes",
    icon: CircleDollarSign,
    wrap: "bg-amber-100 text-amber-700",
    tint: "text-amber-600",
  },
  alert: {
    label: "Alerts",
    short: "Alerts",
    icon: BellRing,
    wrap: "bg-red-100 text-red-700",
    tint: "text-red-600",
  },
  general: {
    label: "General",
    short: "General",
    icon: FileText,
    wrap: "bg-violet-100 text-violet-700",
    tint: "text-violet-600",
  },
};
