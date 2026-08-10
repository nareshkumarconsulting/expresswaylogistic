import type { Metadata } from "next";
import { QuoteHero } from "@/features/quote/components/quote-hero";
import { QuoteWizardForm } from "@/features/quote/components/quote-wizard-form";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request an accurate air or ocean freight quote from ExpressWay Logistic. Share cargo details, route, and contact info — we respond within one business day.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <div className="bg-surface">
      <QuoteHero />

      <section className="relative pb-16 md:pb-20">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/[0.04] to-transparent"
          aria-hidden
        />
        <div className="container-page relative z-10 -mt-10 max-w-5xl md:-mt-14">
          <div className="relative overflow-hidden border border-border/80 bg-card shadow-[var(--ds-shadow-lg)]">
            <div
              className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-accent/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 bg-primary/5 blur-2xl"
              aria-hidden
            />
            <div className="relative border-b border-border/60 bg-surface/50 px-5 py-4 md:px-8 md:py-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Freight quote wizard
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Build your quote request
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Four steps — cargo, route, services, and contact. Our freight
                desk responds within one business day.
              </p>
            </div>
            <QuoteWizardForm />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Prefer to talk it through?{" "}
            <a
              href="/appointment"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Book an appointment
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
