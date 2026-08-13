import type { Metadata } from "next";
import { EmailIntelligencePanel } from "@/features/command-center/components/email-intelligence-panel";

export const metadata: Metadata = {
  title: "Email Intelligence | Command Center",
  robots: { index: false, follow: false },
};

export default function EmailsPage() {
  return <EmailIntelligencePanel />;
}
