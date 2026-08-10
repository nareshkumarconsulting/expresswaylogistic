import type { Metadata } from "next";
import { CalendarPanel } from "@/features/command-center/components/calendar-panel";

export const metadata: Metadata = {
  title: "Calendar | Command Center",
  robots: { index: false, follow: false },
};

export default function CalendarPage() {
  return <CalendarPanel />;
}
