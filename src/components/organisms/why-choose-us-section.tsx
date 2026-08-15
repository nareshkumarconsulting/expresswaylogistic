import { TRUST_SIGNALS } from "@/constants/content";
import { cn } from "@/lib/utils";

export function WhyChooseUsSection() {
  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden bg-surface py-section"
    >
      <div className="container-page relative">
        <div className="mb-10 max-w-2xl lg:mb-12">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            Why Choose ExpressWay Logistic
          </p>
          <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
          <h2 className="text-h2 text-slate-900">
            The Logistics{" "}
            <span className="text-primary">Advantage</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            32 years in international cargo — rates, documentation, and
            clearance handled as one NVOCC partner.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_SIGNALS.map((signal) => {
            const Icon = signal.icon;
            return (
              <li key={signal.title}>
                <div
                  className={cn(
                    "group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5",
                    "transition-colors duration-300 hover:border-accent hover:bg-accent/[0.06]",
                    "hover:shadow-[0_0_0_1px_hsl(var(--accent)),0_12px_40px_-12px_hsl(var(--accent)/0.35)]",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-primary transition group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="relative min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {signal.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {signal.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
