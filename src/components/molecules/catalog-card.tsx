import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CatalogCard({
  href,
  kicker,
  title,
  description,
  variant = "dark",
}: {
  href: string;
  kicker?: string;
  title: string;
  description: string;
  variant?: "dark" | "light";
}) {
  const dark = variant === "dark";

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-colors duration-300",
        dark
          ? "border-sky-400/20 bg-[#071e38] hover:border-accent/70 hover:bg-accent/[0.08]"
          : "border-border bg-card hover:border-accent hover:bg-accent/[0.06]",
        "hover:shadow-[0_0_0_1px_hsl(var(--accent)),0_12px_40px_-12px_hsl(var(--accent)/0.35)]",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      {kicker ? (
        <p
          className={cn(
            "relative mb-3 text-[10px] font-semibold tracking-[0.18em] uppercase",
            dark ? "text-accent" : "text-accent",
          )}
        >
          {kicker}
        </p>
      ) : null}
      <h3
        className={cn(
          "relative text-lg font-semibold",
          dark ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "relative mt-2 flex-1 text-sm leading-relaxed",
          dark ? "text-white/70" : "text-slate-600",
        )}
      >
        {description}
      </p>
      <span
        className={cn(
          "relative mt-5 inline-flex items-center gap-2 text-sm font-semibold",
          dark ? "text-accent" : "text-primary",
        )}
      >
        View
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function BrandCatalog({
  eyebrow,
  title,
  accent,
  description,
  children,
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-16 md:py-20",
        dark ? "bg-brand text-white" : "bg-surface",
      )}
    >
      {dark ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      ) : null}
      <div className="container-page relative z-10">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            {eyebrow}
          </p>
          <h2 className={cn("text-h2", dark ? "text-white" : "text-slate-900")}>
            {title}
            {accent ? (
              <>
                {" "}
                <span className="text-[#00A3FF]">{accent}</span>
              </>
            ) : null}
          </h2>
          {description ? (
            <p
              className={cn(
                "mt-4 max-w-xl text-sm leading-relaxed",
                dark ? "text-white/70" : "text-slate-600",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
