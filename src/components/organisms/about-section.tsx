import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { ABOUT_HIGHLIGHTS } from "@/constants/content";
import { siteConfig } from "@/config/site";

export function AboutSection() {
  return (
    <section id="about" className="bg-surface py-section">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/operations-center.jpg"
                alt="ExpressWay Logistic operations center"
                width={1600}
                height={1067}
                className="aspect-[16/10] w-full object-cover object-center lg:aspect-[4/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-3 left-3 rounded-md bg-brand px-4 py-3 text-white shadow-lg sm:bottom-5 sm:left-5 sm:px-6 sm:py-5">
              <p className="text-3xl font-bold leading-none tracking-tight text-[#00A3FF] sm:text-4xl">
                39+
              </p>
              <p className="mt-1.5 text-xs font-medium leading-snug text-white/80 sm:mt-2 sm:text-sm">
                years of international
                <br />
                cargo experience
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              About {siteConfig.name}
            </p>
            <div className="mb-6 h-px w-16 bg-accent" aria-hidden />

            <h2 className="text-h2 mb-6 text-slate-900">
              About ExpressWay Logistic
            </h2>

            <p className="text-lead mb-8 text-slate-600">
              ExpressWay Logistic is an Indian Neutral Logistics Provider and freight
              forwarding company providing PAN India import and export logistics
              to worldwide destinations — ocean freight, air freight, FCL/LCL,
              consolidation, customs clearance, warehousing, project cargo, EXIM
              advisory and door-to-door delivery. Headquarters are in Noida; the
              commercial proposition is PAN India to worldwide.
            </p>

            <ul className="mb-8 grid gap-4 sm:grid-cols-2">
              {ABOUT_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    className="size-5 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span className="font-medium text-slate-800">{item}</span>
                </li>
              ))}
            </ul>

            <Button asChild rounded="md">
              <Link href="/about">
                More about us
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
