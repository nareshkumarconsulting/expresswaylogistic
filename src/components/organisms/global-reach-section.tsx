import Link from "next/link";
import { ArrowRight, Globe2, Plane, Ship } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { GLOBAL_REACH_STATS } from "@/constants/content";
import { getFeaturedRoutes } from "@/constants/geography";
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
      className="h-full w-full max-w-md"
    >
      <circle
        cx="200"
        cy="160"
        r="120"
        stroke="#00A3FF"
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      <circle
        cx="200"
        cy="160"
        r="80"
        stroke="#00A3FF"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <circle
        cx="200"
        cy="160"
        r="40"
        stroke="#00A3FF"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <circle cx="200" cy="160" r="6" fill="hsl(var(--accent))" />
      <path
        d="M200 160 L280 100 M200 160 L320 180 M200 160 L260 240 M200 160 L140 220 M200 160 L90 140"
        stroke="#00A3FF"
        strokeOpacity="0.55"
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
  return (
    <section
      id="global-reach"
      className="relative overflow-hidden bg-surface py-section"
    >
      <div className="container-page relative">
        <div className="mb-10 grid items-center gap-8 lg:mb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              Global Reach
            </p>
            <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
            <h2 className="text-h2 text-slate-900">
              India to Worldwide Shipping Corridors
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
              PAN India origins. Worldwide destinations. We book ocean and air
              on commercially used corridors with customs-ready documentation at
              every handoff.
            </p>

            <ul className="mt-6 grid max-w-md grid-cols-3 gap-2">
              {GLOBAL_REACH_STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="rounded-xl border border-border bg-card px-3 py-3 text-center"
                >
                  <p className="text-sm font-semibold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-slate-500">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative hidden min-h-[240px] items-center justify-center lg:flex">
            <Globe2
              className="absolute top-2 right-6 size-14 text-[#00A3FF]/20"
              aria-hidden
            />
            <RouteMapGraphic />
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getFeaturedRoutes().map((route) => (
            <li key={route.slug}>
              <Link href={`/shipping-routes/${route.slug}`} className="block h-full">
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5",
                  "transition-colors duration-300 hover:border-accent hover:bg-accent/[0.06]",
                  "hover:shadow-[0_0_0_1px_hsl(var(--accent)),0_12px_40px_-12px_hsl(var(--accent)/0.35)]",
                )}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />

                <div className="relative mb-4 flex items-center gap-2">
                  {(["ocean", "air"] as const).map((mode) => {
                    const Icon = modeIcon[mode];
                    return (
                      <span
                        key={mode}
                        className="flex size-10 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-primary transition group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"
                        title={mode === "air" ? "Air freight" : "Ocean freight"}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                    );
                  })}
                </div>

                <h3 className="relative text-base font-semibold text-slate-900">
                  India <span className="text-slate-400">→</span> {route.destination}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                  Ocean and air freight from origins across India. Transit is
                  indicative and varies by carrier and conditions.
                </p>
              </article>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/10 text-primary">
              <Globe2 className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                India-origin lanes, worldwide delivery
              </p>
              <p className="text-xs text-slate-500">
                Tell us origin, destination, and cargo — we&apos;ll map the
                mode and transit.
              </p>
            </div>
          </div>
          <Button asChild rounded="md" className="shadow-accent-glow">
            <Link href="/shipping-routes">
              View all routes
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
