"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  CalendarDays,
  FileText,
  LogOut,
  Sparkles,
  Mail,
  PenLine,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/command-center", icon: LayoutDashboard },
  { name: "Shipments", href: "/command-center/shipments", icon: Package },
  { name: "Quote Requests", href: "/command-center/quotes", icon: FileText },
  { name: "Forwarders", href: "/command-center/forwarders", icon: Users },
  { name: "Email Intelligence", href: "/command-center/emails", icon: Mail },
  { name: "Client Email Agent", href: "/command-center/client-email", icon: PenLine },
  { name: "Calendar", href: "/command-center/calendar", icon: CalendarDays },
  { name: "Analytics", href: "/command-center/analytics", icon: BarChart3 },
  { name: "AI Copilot", href: "/command-center/ai", icon: Sparkles },
];

export function CommandSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-primary text-white shadow-lg transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <BrandLogo variant="mark" tone="light" size="sm" />
          <button
            type="button"
            className="text-white/80 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4" aria-label="Command Center">
          {navItems.map((item) => {
            const active =
              item.href === "/command-center"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                  active
                    ? "bg-accent text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent font-bold">
              OP
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Operations Team</p>
              <p className="text-xs text-white/60">Admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-5" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
