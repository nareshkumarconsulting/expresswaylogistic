"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe2, Plane, Ship } from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { GLOBAL_CORRIDORS, GLOBAL_REACH_STATS } from "@/constants/content";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const modeIcon = {
  air: Plane,
  ocean: Ship,
} as const;

function RouteMapGraphic() {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      aria-hidden
      className="h-full w-full max-w-md text-primary/20"
    >
      <circle cx="200" cy="160" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="200" cy="160" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="200" cy="160" r="40" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="160" r="6" fill="hsl(var(--accent))" />
      <path
        d="M200 160 L280 100 M200 160 L320 180 M200 160 L260 240 M200 160 L140 220 M200 160 L90 140"
        stroke="hsl(var(--secondary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 4"
      />
      {[
        { cx: 280, cy: 100, label: "EU" },
        { cx: 320, cy: 180, label: "ME" },
        { cx: 260, cy: 240, label: "SEA" },
        { cx: 140, cy: 220, label: "NA" },
        { cx: 90, cy: 140, label: "AF" },
      ].map((node) => (
        <g key={node.label}>
          <circle cx={node.cx} cy={node.cy} r="5" fill="hsl(var(--primary))" />
          <text
            x={node.cx}
            y={node.cy - 12}
            textAnchor="middle"
            className="fill-primary text-[10px] font-semibold"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function GlobalReachSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="global-reach" className="relative overflow-hidden bg-background py-section">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, hsl(var(--secondary) / 0.12), transparent 50%), radial-gradient(circle at 80% 30%, hsl(var(--accent) / 0.08), transparent 45%)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="eyebrow" className="mb-3">
              Global Reach
            </Typography>
            <Typography variant="h2" className="mb-6 text-foreground">
              Your Cargo,{" "}
              <span className="text-primary">Every Major Corridor</span>
            </Typography>
            <Typography variant="lead" className="mb-8 text-muted-foreground">
              From Noida to ports worldwide — we operate scheduled lanes
              across air and ocean with customs-ready documentation at every
              handoff.
            </Typography>

            <ul className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {GLOBAL_REACH_STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="min-w-0 border border-border bg-surface px-4 py-4"
                >
                  <p className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>

            <Button asChild rounded="none">
              <Link href={siteConfig.cta.primary.href}>
                Plan your route
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative hidden min-h-[280px] items-center justify-center lg:flex"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-60">
              <RouteMapGraphic />
            </div>
            <Globe2
              className="absolute top-4 right-4 size-16 text-secondary/30"
              aria-hidden
            />
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {GLOBAL_CORRIDORS.map((corridor) => (
            <motion.article
              key={`${corridor.origin}-${corridor.destination}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="group border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-2">
                {corridor.modes.map((mode) => {
                  const Icon = modeIcon[mode];
                  return (
                    <span
                      key={mode}
                      className="flex size-8 items-center justify-center bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                      title={mode === "air" ? "Air freight" : "Ocean freight"}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                  );
                })}
                <span className="text-muted-body ml-auto font-medium text-accent">
                  {corridor.transit}
                </span>
              </div>
              <h3 className="text-h4 mb-1 text-foreground">
                {corridor.origin}{" "}
                <span className="text-muted-foreground">→</span>{" "}
                {corridor.destination}
              </h3>
              <p className={cn("text-muted-body text-muted-foreground")}>
                {corridor.highlight}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
