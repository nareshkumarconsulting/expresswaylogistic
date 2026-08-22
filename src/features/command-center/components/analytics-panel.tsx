"use client";

import { StateAlert } from "@/components/molecules/state-alert";

export function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Lane performance and modal volume trends
        </p>
      </div>

      <StateAlert
        variant="info"
        title="Analytics will populate from live data"
        description="Top routes and throughput charts appear once enough shipments are booked and tracked in the system."
      />
    </div>
  );
}
