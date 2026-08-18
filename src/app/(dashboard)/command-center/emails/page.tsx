import { Suspense } from "react";
import type { Metadata } from "next";
import { Spinner } from "@/components/atoms/spinner";
import { EmailIntelligencePanel } from "@/features/command-center/components/email-intelligence-panel";

export const metadata: Metadata = {
  title: "Email Intelligence | Command Center",
  robots: { index: false, follow: false },
};

export default function EmailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner label="Loading emails" />
        </div>
      }
    >
      <EmailIntelligencePanel />
    </Suspense>
  );
}
