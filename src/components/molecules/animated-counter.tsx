"use client";

import { useEffect, useState } from "react";
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
  durationMs = 1800,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : durationMs;

    let startTime: number | null = null;
    let frame = 0;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress =
        duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, durationMs]);

  return (
    <span className={className}>
      {formatNumber(count)}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}
