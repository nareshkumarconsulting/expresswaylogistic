import { Suspense } from "react";
import type { Metadata } from "next";
import { Spinner } from "@/components/atoms/spinner";
import { ClientEmailAgentPanel } from "@/features/command-center/components/client-email-agent-panel";

export const metadata: Metadata = {
  title: "Client Email Agent | Command Center",
  robots: { index: false, follow: false },
};

export default function ClientEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner label="Loading email agent" />
        </div>
      }
    >
      <ClientEmailAgentPanel />
    </Suspense>
  );
}
