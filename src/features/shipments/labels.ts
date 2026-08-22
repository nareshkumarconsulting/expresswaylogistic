import type { ShipmentStatus } from "@/types";

export function statusBadgeVariant(
  status: ShipmentStatus,
): "success" | "warning" | "secondary" | "muted" {
  switch (status) {
    case "Delivered":
      return "success";
    case "Customs Hold":
    case "Delayed":
      return "warning";
    case "In Transit":
      return "secondary";
    default:
      return "muted";
  }
}

export function riskScoreFromStatus(status: ShipmentStatus): number {
  switch (status) {
    case "Customs Hold":
      return 70;
    case "Delayed":
      return 60;
    case "In Transit":
      return 25;
    case "Delivered":
      return 5;
    default:
      return 15;
  }
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
