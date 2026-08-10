import type { Metadata } from "next";
import { QuotesPanel } from "@/features/command-center/components/quotes-panel";

export const metadata: Metadata = {
  title: "Quote Requests | Command Center",
  robots: { index: false, follow: false },
};

export default function QuotesPage() {
  return <QuotesPanel />;
}
