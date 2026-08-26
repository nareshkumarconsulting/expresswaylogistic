"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Plus } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useUiStore } from "@/store/ui-store";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function CommandTopbar() {
  const pathname = usePathname();
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const setNewShipmentOpen = useUiStore((s) => s.setNewShipmentOpen);
  const showNewShipment = pathname.startsWith("/command-center/shipments");
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-muted-foreground md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="size-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground md:text-xl">
              {greeting()}, Operations Team
            </h1>
            <p className="text-xs text-muted-foreground md:text-sm">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showNewShipment ? (
            <Button
              className="h-10"
              rounded="none"
              onClick={() => setNewShipmentOpen(true)}
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">New Shipment</span>
              <span className="sm:hidden">New</span>
            </Button>
          ) : null}
          <button
            type="button"
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-accent" />
          </button>
        </div>
      </div>
    </header>
  );
}
