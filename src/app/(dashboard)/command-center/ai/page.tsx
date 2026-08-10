import type { Metadata } from "next";
import { AiCopilotPanel } from "@/features/command-center/components/ai-copilot-panel";

export const metadata: Metadata = {
  title: "AI Copilot | Command Center",
  robots: { index: false, follow: false },
};

export default function AiPage() {
  return <AiCopilotPanel />;
}
