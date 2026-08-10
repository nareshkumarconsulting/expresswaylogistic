import type { Metadata } from "next";
import { ShipmentsTable } from "@/features/command-center/components/shipments-table";

export const metadata: Metadata = {
  title: "Shipments | Command Center",
  robots: { index: false, follow: false },
};

export default function ShipmentsPage() {
  return <ShipmentsTable />;
}
