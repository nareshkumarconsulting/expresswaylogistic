"use client";

import { INDUSTRIES } from "@/constants/content";
import { Typography } from "@/components/atoms/typography";

export function IndustriesSection() {
  const items = [...INDUSTRIES, ...INDUSTRIES];

  return (
    <section id="industries" className="overflow-hidden border-y border-border bg-background py-section-sm">
      <div className="container-page mb-12 text-center">
        <Typography variant="eyebrow" className="mb-3">
          Industries We Serve
        </Typography>
        <Typography variant="h2" className="text-foreground">
          Tailored Supply Chain Solutions
        </Typography>
      </div>

      <div className="group relative flex overflow-x-hidden">
        <div className="animate-marquee flex items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
          {items.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <div
                key={`${industry.name}-${index}`}
                className="mx-4 flex min-w-[200px] flex-col items-center justify-center border border-slate-100 bg-slate-50 px-8 py-6 transition-all hover:border-accent hover:shadow-md"
              >
                <Icon className="mb-4 size-10 text-primary" aria-hidden />
                <span className="font-semibold text-slate-800">
                  {industry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
