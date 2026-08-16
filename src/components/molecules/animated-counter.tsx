"use client";

import { formatNumber } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = "",
  className,
}: AnimatedCounterProps) {
  return (
    <span className={className}>
      {formatNumber(end)}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}
