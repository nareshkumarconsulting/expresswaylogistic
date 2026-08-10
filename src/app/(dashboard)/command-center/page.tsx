import type { Metadata } from "next";
import { CommandOverview } from "@/features/command-center/components/command-overview";

export const metadata: Metadata = {
  title: "AI Logistics Command Center",
  description:
    "Real-time shipment operations, exception monitoring, and AI insights for ExpressWay Logistic.",
  robots: { index: false, follow: false },
};

export default function CommandCenterPage() {
  return <CommandOverview />;
}
