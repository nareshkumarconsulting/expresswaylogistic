import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { PROCESS_STEPS } from "@/constants/content";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function ProcessSection() {
  return (
    <section
      id="process"
      className="relative isolate overflow-hidden bg-brand py-16 text-white md:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-0 hidden h-[46%] w-[50%] lg:block"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-port-1280.webp"
          alt=""
          className="size-full object-cover object-[72%_center] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent from-30% via-brand/20 to-brand" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% via-brand/15 to-brand" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,163,255,0.28),transparent_50%)]" />
      </div>

      <div className="container-page relative z-10">
        <div className="mb-12 max-w-2xl lg:mb-14">
          <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            Our Process
          </p>
          <h2 className="text-h2 text-white">
            How We Move <span className="text-[#00A3FF]">Your Cargo</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
            Five clear steps from quote to door delivery — one dedicated team
            handling booking, documents, clearance, and updates.{" "}
            <Link
              href="/process"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              See the full process
            </Link>
          </p>
        </div>

        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === PROCESS_STEPS.length - 1;

            return (
              <li
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                {!isLast ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-[4.85rem] left-[calc(50%+2.1rem)] z-0 hidden h-0.5 lg:block",
                      "w-[calc(100%-1.2rem)]",
                      index === 3 ? "bg-accent" : "bg-[#00A3FF]",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1/2 right-0 size-0 -translate-y-1/2 border-y-[5px] border-y-transparent border-l-[8px]",
                        index === 3
                          ? "border-l-accent"
                          : "border-l-[#00A3FF]",
                      )}
                    />
                  </span>
                ) : null}

                <span
                  className={cn(
                    "mb-2 font-heading text-3xl font-bold tracking-tight",
                    isLast ? "text-accent/90" : "text-[#00A3FF]",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div
                  className={cn(
                    "relative z-10 mb-6 flex size-[4.25rem] items-center justify-center",
                    isLast &&
                      "shadow-[0_0_28px_-4px_hsl(var(--accent)/0.7)]",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -inset-2 rounded-full border border-dashed",
                      isLast ? "border-accent/70" : "border-[#00A3FF]/45",
                    )}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 rounded-full border",
                      isLast ? "border-accent/50" : "border-white/25",
                    )}
                  />
                  <span
                    className={cn(
                      "relative flex size-12 items-center justify-center rounded-full text-white",
                      isLast ? "bg-accent" : "bg-[#00A3FF]",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                </div>

                <article
                  className={cn(
                    "relative flex w-full flex-1 flex-col rounded-xl bg-[#071e38] px-4 py-5",
                    "border",
                    isLast
                      ? "border-accent shadow-[0_0_24px_-8px_hsl(var(--accent)/0.55)]"
                      : "border-sky-400/25",
                  )}
                >
                  <h3 className="text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {step.description}
                  </p>
                </article>

                <span
                  aria-hidden
                  className={cn(
                    "mt-3 hidden h-8 w-px border-l border-dashed sm:block",
                    isLast ? "border-accent/70" : "border-[#00A3FF]/40",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "hidden size-2 rounded-full sm:block",
                    isLast ? "bg-accent" : "bg-[#00A3FF]",
                  )}
                />

                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute bottom-[3px] left-1/2 hidden h-px w-[calc(100%+1.25rem)] border-t border-dashed border-[#00A3FF]/35 lg:block"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-sky-400/25 bg-[#071e38]/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-sky-400/40 text-[#00A3FF]">
              <Headphones className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-base font-semibold text-white">
                Ready to start a shipment?
              </p>
              <p className="mt-0.5 text-sm text-white/60">
                Our experts are ready to move your business forward.
              </p>
            </div>
          </div>
          <Button asChild rounded="md" className="w-full shadow-accent-glow sm:w-auto">
            <Link href={siteConfig.cta.primary.href}>
              Request a Quote
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
