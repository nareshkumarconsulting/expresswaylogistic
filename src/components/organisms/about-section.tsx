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
                className="aspect-[4/5] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-5 left-5 rounded-md bg-brand px-6 py-5 text-white shadow-lg">
              <p className="text-4xl font-bold leading-none tracking-tight text-[#00A3FF]">
                32+
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-white/80">
                Years of
                <br />
                excellence
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              About {siteConfig.name}
            </p>
            <div className="mb-6 h-px w-16 bg-accent" aria-hidden />

            <h2 className="text-h2 mb-6 text-slate-900">
              Neutral NVOCC.{" "}
              <span className="text-primary">Total Reliability.</span>
            </h2>

            <p className="text-lead mb-8 text-slate-600">
              {siteConfig.legalName} is promoted by professionals with 32 years
              in international cargo movement. As a neutral NVOCC, we combine
              professionalism and practical innovation to clear and deliver
              worldwide — with complete logistics, customs, warehousing,
              consolidation, and EXIM guidance for your trade needs.
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
