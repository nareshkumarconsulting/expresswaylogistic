import { Suspense } from "react";
import type { Metadata } from "next";
import { Spinner } from "@/components/atoms/spinner";
import { AvaConversationsPanel } from "@/features/command-center/components/ava-conversations-panel";

export const metadata: Metadata = {
  title: "Ava Conversations | Command Center",
  robots: { index: false, follow: false },
};

export default function AvaConversationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner label="Loading Ava conversations" />
        </div>
      }
    >
      <AvaConversationsPanel />
    </Suspense>
  );
}
