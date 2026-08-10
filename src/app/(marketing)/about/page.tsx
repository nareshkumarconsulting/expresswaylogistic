import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { PageHero } from "@/components/molecules/page-hero";
import { siteConfig } from "@/config/site";
import { ABOUT_HIGHLIGHTS } from "@/constants/content";
import { SERVICES } from "@/constants/services";

export const metadata: Metadata = {
  title: "About Us",
  description: `${siteConfig.legalName} is a neutral NVOCC with 32 years in international cargo movement — customs, warehousing, consolidation, and door-to-door EXIM logistics from Noida.`,
  alternates: { canonical: "/about" },
};

const AIMS = [
  "Complete logistics solutions for import and export",
  "Customs clearance and port documentation",
  "Warehousing, packing, and cargo handling",
  "Shipping, forwarding, and consolidation",
  "Door-to-door delivery to consignees worldwide",
  "EXIM guidance including licence and drawback support",
] as const;

const VALUES = [
  {
    title: "Neutral NVOCC",
    description:
      "We book competitive sea and air options through reputed liner relationships — without locking you into a single carrier.",
    icon: Globe2,
  },
  {
    title: "People who stay with the shipment",
    description:
      "Dedicated staff trained to provide round-the-clock shipment details and documentation assistance when you need answers.",
    icon: Users,
  },
  {
    title: "Cost-saving reliability",
    description:
      "Clear and deliver on time with a practical focus on reducing unnecessary freight and EXIM expense.",
    icon: ShieldCheck,
  },
  {
    title: "Always reachable",
    description:
      "24×7 support for accurate status updates so your cargo decisions are never made in the dark.",
    icon: Clock3,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="About us"
        title="Neutral NVOCC. Total reliability."
        description={`${siteConfig.legalName} — 32 years of international cargo experience, complete EXIM logistics, and a customer-first way of clearing and delivering worldwide.`}
      />

      <section className="relative z-10 -mt-8 bg-background pb-[var(--space-section)] md:-mt-10">
        <div className="container-page">
          <div className="grid items-center gap-12 border border-border bg-card p-6 shadow-sm md:p-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
              <Image
                src="/images/operations-center.jpg"
                alt="ExpressWay Logistic operations"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              <div className="absolute right-0 bottom-0 bg-primary px-6 py-5 text-white">
                <p className="text-stat text-accent">32+</p>
                <p className="text-sm font-medium leading-tight">
                  Years in international
                  <br />
                  cargo movement
                </p>
              </div>
            </div>

            <div>
              <Typography variant="eyebrow" className="mb-3">
                Our story
              </Typography>
              <Typography as="h2" variant="h2" className="mb-5 text-foreground">
                Built by professionals who know EXIM cargo
              </Typography>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  {siteConfig.legalName} has been promoted by professionals with
                  vast experience in international cargo movement for the last
                  32 years.
                </p>
                <p>
                  As a neutral NVOCC company backed by professionalism and
                  practical innovation, ExpressWay Logistic is a commitment to
                  service with a global accent and true customer orientation.
                </p>
                <p>
                  We provide total solutions and guidance for your EXIM trade
                  problems and needs — from freight booking and consolidation to
                  customs, warehousing, project cargo, and door-to-door
                  delivery.
                </p>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {ABOUT_HIGHLIGHTS.map((item) => (
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
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-[var(--space-section)]">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <Typography variant="eyebrow" className="mb-3">
              How we work
            </Typography>
            <Typography as="h2" variant="h2" className="mb-4 text-foreground">
              What sets ExpressWay apart
            </Typography>
            <Typography variant="muted" className="text-base text-muted-foreground">
              Name a destination — we clear and deliver with a focus on
              reliability and cost advantage.
            </Typography>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="border border-border bg-card p-6"
                >
                  <div className="mb-4 flex size-12 items-center justify-center bg-primary text-primary-foreground">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <Typography as="h3" variant="h4" className="mb-2 text-foreground">
                    {value.title}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {value.description}
                  </Typography>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-[var(--space-section)]">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <Typography variant="eyebrow" className="mb-3">
              Our aim
            </Typography>
            <Typography as="h2" variant="h2" className="mb-6 text-foreground">
              Complete logistics for your EXIM needs
            </Typography>
            <ul className="space-y-3">
              {AIMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
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

          <div>
            <Typography variant="eyebrow" className="mb-3">
              Capabilities
            </Typography>
            <Typography as="h2" variant="h2" className="mb-6 text-foreground">
              Services we deliver every day
            </Typography>
            <ul className="grid gap-3 sm:grid-cols-2">
              {SERVICES.slice(0, 8).map((service) => (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    className="block border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" rounded="none" className="mt-6">
              <Link href="/services">
                View all services
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-[var(--space-section)]">
        <div className="container-page">
          <div className="grid gap-8 border border-border bg-card p-6 md:p-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Typography variant="eyebrow" className="mb-3">
                Visit us
              </Typography>
              <Typography as="h2" variant="h2" className="mb-4 text-foreground">
                Noida headquarters
              </Typography>
              <Typography
                variant="muted"
                className="mb-6 max-w-xl text-base text-muted-foreground"
              >
                Meet our team for freight planning, customs advisory, project
                cargo, or warehouse discussions at Assotech Business Cresterra.
              </Typography>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild rounded="none">
                  <Link href="/appointment">
                    Book an Appointment
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" rounded="none">
                  <Link href={siteConfig.cta.primary.href}>Get a Quote</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="flex items-start gap-3 border border-border bg-surface p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-foreground">Address</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>
              <div className="border border-border bg-surface p-4 text-sm">
                <p className="font-semibold text-foreground">Sales</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-1 block text-accent hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="mt-1 block font-medium text-foreground hover:text-accent"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
