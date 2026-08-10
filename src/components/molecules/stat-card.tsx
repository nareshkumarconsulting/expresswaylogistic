import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/typography";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  trend = "neutral",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Typography variant="muted" className="mb-2">
            {label}
          </Typography>
          <p className="text-stat text-foreground">{value}</p>
          {delta ? (
            <p
              className={cn(
                "mt-2 text-xs font-semibold",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {delta}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div className="rounded-md bg-muted p-2.5 text-primary">
            <Icon className="size-5" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}
