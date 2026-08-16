import type { Metadata } from "next";
import { CommandSidebar } from "@/features/command-center/components/command-sidebar";
import { CommandTopbar } from "@/features/command-center/components/command-topbar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <CommandSidebar />
      <div className="md:ml-64">
        <CommandTopbar />
        <main id="main-content" className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
