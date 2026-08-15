import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { SERVICES } from "@/constants/services";
import { cn } from "@/lib/utils";

const featured = SERVICES.slice(0, 2);
const rest = SERVICES.slice(2);

export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-surface py-section">
      <div
        className="pointer-events-none absolute -top-24 right-0 size-[28rem] rounded-full bg-sky-400/10 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative">
        <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              Our Services
            </p>
            <div className="mb-6 h-px w-16 bg-accent" aria-hidden />
            <h2 className="text-h2 text-slate-900">
              Complete Logistics &amp;{" "}
              <span className="text-primary">EXIM Solutions</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 lg:pb-1">
            Ocean, air, customs, warehousing, and door-to-door — one NVOCC
            partner from origin to destination.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {featured.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group relative overflow-hidden rounded-2xl bg-brand p-8 text-white shadow-[0_24px_60px_-28px_rgba(5,26,48,0.55)] transition hover:-translate-y-0.5"
              >
                <p className="absolute top-5 right-6 font-display text-6xl font-bold text-white/[0.06]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <span className="mb-8 flex size-14 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
                  <Icon className="size-7" aria-hidden />
                </span>
                <h3 className="text-h3 mb-3 pr-16">{service.title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-white/70">
                  {service.description}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Explore
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
                <div
                  className="pointer-events-none absolute -right-8 -bottom-10 size-40 rounded-full bg-accent/20 blur-2xl transition group-hover:bg-accent/30"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((service, index) => {
            const Icon = service.icon;
            return (
              <li key={service.id}>
                <Link
                  href={service.href}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-border/80 bg-background p-6",
                    "transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_40px_-24px_rgba(5,26,48,0.35)]",
                  )}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-primary transition group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                      {String(index + 3).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" rounded="md" className="shadow-accent-glow">
            <Link href="/services">
              View all services
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
