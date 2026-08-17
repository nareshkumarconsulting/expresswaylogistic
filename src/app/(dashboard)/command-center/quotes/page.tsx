import { Suspense } from "react";
import type { Metadata } from "next";
import { Spinner } from "@/components/atoms/spinner";
import { QuotesPanel } from "@/features/command-center/components/quotes-panel";

export const metadata: Metadata = {
  title: "Quote Requests | Command Center",
  robots: { index: false, follow: false },
};

export default function QuotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner label="Loading quote requests" />
        </div>
      }
    >
      <QuotesPanel />
    </Suspense>
  );
}
