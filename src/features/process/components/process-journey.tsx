import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Headphones } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { PROCESS_STEPS } from "@/constants/content";
import { EXPORT_DOCUMENT_POINTS } from "@/constants/faqs";
import { processStepId } from "@/features/process/step-id";
import { cn } from "@/lib/utils";

const PROMISES = [
  "Neutral Logistics Provider booking on sea and air",
  "Documentation ready before cargo reaches the port",
  "Import and export customs clearance",
  "24×7 shipment and document status support",
] as const;

export function ProcessJourney() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand py-16 text-white md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="container-page relative z-10">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              The journey
            </p>
            <h2 className="text-h2 text-white">
              Quote to door,{" "}
              <span className="text-[#00A3FF]">without handoffs</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              Follow the same five steps we use on every shipment. You share
              what only you know — we run booking, docs, clearance, and
              delivery.
            </p>
          </div>

          <ol className="relative space-y-8">
            <span
              aria-hidden
              className="absolute top-8 bottom-8 left-[1.85rem] hidden w-px border-l border-dashed border-sky-400/30 md:left-[2.35rem] md:block"
            />

            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === PROCESS_STEPS.length - 1;

              return (
                <li
                  key={step.title}
                  id={processStepId(step.title)}
                  className="scroll-mt-28"
                >
                  <div className="grid items-start gap-5 md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-8">
                    <div className="relative z-10 flex items-center gap-3 md:flex-col md:items-center md:gap-2">
                      <span
                        className={cn(
                          "font-heading text-3xl font-bold tracking-tight",
                          isLast ? "text-accent" : "text-[#00A3FF]",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div
                        className={cn(
                          "relative flex size-[3.75rem] items-center justify-center",
                          isLast &&
                            "shadow-[0_0_28px_-4px_hsl(var(--accent)/0.7)]",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "absolute -inset-1.5 rounded-full border border-dashed",
                            isLast ? "border-accent/70" : "border-[#00A3FF]/45",
                          )}
                        />
                        <span
                          className={cn(
                            "relative flex size-11 items-center justify-center rounded-full text-white",
                            isLast ? "bg-accent" : "bg-[#00A3FF]",
                          )}
                        >
                          <Icon className="size-5" aria-hidden />
                        </span>
                      </div>
                    </div>

                    <article
                      className={cn(
                        "rounded-2xl border bg-[#071e38] p-6 md:p-8",
                        isLast
                          ? "border-accent shadow-[0_0_28px_-10px_hsl(var(--accent)/0.55)]"
                          : "border-sky-400/25",
                      )}
                    >
                      <h3 className="text-xl font-semibold text-white md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                        {step.detail}
                      </p>

                      <div className="mt-6 grid overflow-hidden rounded-xl border border-white/10 sm:grid-cols-2">
                        <div className="border-b border-white/10 p-4 sm:border-r sm:border-b-0">
                          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
                            You provide
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-white/85">
                            {step.youProvide}
                          </p>
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] font-semibold tracking-[0.18em] text-[#00A3FF] uppercase">
                            We handle
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-white/85">
                            {step.weHandle}
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-surface py-section">
        <div className="container-page">
          <div className="mb-6 border border-border bg-card p-7 md:p-9">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              <FileText className="size-4" aria-hidden />
              Export documents from India
            </p>
            <h2 className="text-h3 mb-4 text-foreground">
              What is typically required
            </h2>
            <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Exact filings depend on cargo and destination. These are the
              documents most India export shipments start with — ExpressWay
              prepares clearance paperwork and flags extras for your lane.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {EXPORT_DOCUMENT_POINTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm font-medium text-foreground"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-accent"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-border bg-card p-7 md:p-9">
              <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
                What stays consistent
              </p>
              <h2 className="text-h3 mb-6 text-foreground">
                One desk from first quote to last mile
              </h2>
              <ul className="grid gap-3">
                {PROMISES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium text-foreground"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden bg-brand p-7 text-white md:p-9">
              <div
                className="pointer-events-none absolute -right-10 -bottom-12 size-40 rounded-full bg-accent/25 blur-3xl"
                aria-hidden
              />
              <span className="mb-5 flex size-12 items-center justify-center rounded-full border border-sky-400/40 text-[#00A3FF]">
                <Headphones className="size-5" aria-hidden />
              </span>
              <h2 className="text-h3 mb-3 text-white">
                Ready to start a shipment?
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/70">
                Share origin, destination, and cargo — we come back with
                options.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild rounded="none" className="shadow-accent-glow">
                  <Link href={siteConfig.cta.primary.href}>
                    Request a Quote
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  rounded="none"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/appointment">Book an Appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
