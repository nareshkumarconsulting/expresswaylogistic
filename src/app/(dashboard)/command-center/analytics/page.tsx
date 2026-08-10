import type { Metadata } from "next";
import { AnalyticsPanel } from "@/features/command-center/components/analytics-panel";

export const metadata: Metadata = {
  title: "Analytics | Command Center",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  return <AnalyticsPanel />;
}
