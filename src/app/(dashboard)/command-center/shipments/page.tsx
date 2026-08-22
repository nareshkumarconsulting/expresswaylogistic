import { Suspense } from "react";
import type { Metadata } from "next";
import { Spinner } from "@/components/atoms/spinner";
import { ShipmentsTable } from "@/features/command-center/components/shipments-table";

export const metadata: Metadata = {
  title: "Shipments | Command Center",
  robots: { index: false, follow: false },
};

export default function ShipmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner label="Loading shipments" />
        </div>
      }
    >
      <ShipmentsTable />
    </Suspense>
  );
}
