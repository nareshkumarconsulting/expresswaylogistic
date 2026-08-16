import type { Metadata } from "next";
import { ForwardersPanel } from "@/features/command-center/components/forwarders-panel";

export const metadata: Metadata = {
  title: "Forwarders | Command Center",
  robots: { index: false, follow: false },
};

export default function ForwardersPage() {
  return <ForwardersPanel />;
}
