import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Ship } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { siteConfig } from "@/config/site";
import { INDUSTRIES } from "@/constants/content";
import { industryId } from "@/features/industries/industry-id";

const PROMISES = [
  "Same NVOCC desk for every cargo type",
  "Handling and packing matched to the commodity",
  "Documentation prepared for the actual product",
  "Sea, air, coastal, and door-to-door options",
] as const;

export function IndustriesCatalog() {
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
              Cargo we move
            </p>
            <h2 className="text-h2 text-white">
              Built for every industry,{" "}
              <span className="text-[#00A3FF]">not a generic lane</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              Tell us the cargo type — we map the lane, documents, and delivery
              so the shipment is handled the way that commodity actually moves.
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-2">
            {INDUSTRIES.map((industry) => {
              const Icon = industry.icon;
              return (
                <li
                  key={industry.name}
                  id={industryId(industry.name)}
                  className="scroll-mt-28"
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sky-400/20 bg-[#071e38]">
                    <div className="relative h-44 overflow-hidden">
                      {industry.image ? (
                        <Image
                          src={industry.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071e38] via-brand/30 to-brand/20" />
                      <span className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-full border border-white/20 bg-brand/70 text-sky-300 backdrop-blur-sm">
                        <Icon className="size-5" aria-hidden />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-semibold text-white">
                        {industry.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/70">
                        {industry.detail}
                      </p>
                      <p className="mt-5 text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
                        {industry.focus}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-surface py-section">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-border bg-card p-7 md:p-9">
              <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
                How we work across cargo
              </p>
              <h2 className="text-h3 mb-6 text-foreground">
                One desk. Commodity-specific handling.
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
                <Ship className="size-5" aria-hidden />
              </span>
              <h2 className="text-h3 mb-3 text-white">
                Your industry. Our expertise.
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/70">
                Share the cargo type, origin, and destination — we come back
                with a lane and documentation plan.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild rounded="none" className="shadow-accent-glow">
                  <Link href={siteConfig.cta.primary.href}>
                    Get a customized quote
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
