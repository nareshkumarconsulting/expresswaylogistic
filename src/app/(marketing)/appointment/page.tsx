import type { Metadata } from "next";
import { AppointmentForm } from "@/features/appointment/components/appointment-form";
import { AppointmentHero } from "@/features/appointment/components/appointment-hero";
import { AppointmentJourney } from "@/features/appointment/components/appointment-journey";
import { PageAeo } from "@/components/organisms/page-aeo";
import { APPOINTMENT_PAGE_FAQS } from "@/constants/faqs";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Meet ExpressWay Logistic specialists in Noida for freight planning, customs advisory, warehouse visits, or shipper account setup.",
  alternates: { canonical: "/appointment" },
};

export default function AppointmentPage() {
  return (
    <div className="bg-surface">
      <AppointmentHero />

      <section id="book" className="relative scroll-mt-24 pb-16 md:pb-20">
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
                Schedule a session
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Book with our ops team
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Four quick steps — freight planning, customs, warehouse visits,
                or account setup.
              </p>
            </div>
            <div className="relative p-5 md:p-8">
              <AppointmentForm />
            </div>
          </div>
        </div>
      </section>

      <AppointmentJourney />
      <PageAeo
        answers={APPOINTMENT_PAGE_FAQS.slice(0, 3)}
        faqs={APPOINTMENT_PAGE_FAQS}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Appointment", path: "/appointment" },
        ]}
        answerTitle="Talk to the Noida freight desk"
        answerDescription="When to book a meeting versus a quote, and which company handles your export shipment."
      />
    </div>
  );
}
