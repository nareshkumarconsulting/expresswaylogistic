import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { ServiceCard } from "@/components/molecules/service-card";
import { AboutHero } from "@/features/about/components/about-hero";
import { AboutLeadership } from "@/features/about/components/about-leadership";
import { siteConfig } from "@/config/site";
import { ABOUT_HIGHLIGHTS, INDUSTRIES } from "@/constants/content";
import { SERVICES } from "@/constants/services";

export const metadata: Metadata = {
  title: "About Us",
  description: `${siteConfig.legalName} is a neutral NVOCC with 39 years in international cargo movement — customs, warehousing, consolidation, and door-to-door EXIM logistics from Noida.`,
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
      <AboutHero />

      <section className="relative z-10 -mt-8 bg-background pb-[var(--space-section)] md:-mt-10">
        <div className="container-page">
          <div className="grid items-center gap-12 border border-border bg-card p-6 shadow-lg md:p-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
                <Image
                  src="/images/hero-port.jpg"
                  alt="ExpressWay Logistic cargo operations"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>
              <div className="absolute right-0 bottom-0 bg-primary px-6 py-5 text-white md:-right-4 md:-bottom-4">
                <p className="text-stat text-accent">39+</p>
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
                Built by professionals who{" "}
                <span className="text-primary">know EXIM cargo</span>
              </Typography>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  {siteConfig.legalName} has been promoted by professionals with
                  vast experience in international cargo movement for the last
                  39 years.
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

      <AboutLeadership />

      <section className="relative bg-primary py-section text-primary-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v26h-2V34h-2v26h-2V34h-2v26h-2V34H20v26h-2V34h-2v26h-2V34h-2v26h-2V34H10V8h2v26h2V8h2v26h2V8h2v26h2V8h2v26h2V8H36v26z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container-page relative z-10">
          <div className="mb-12 max-w-2xl">
            <Typography variant="eyebrow" className="mb-3 text-accent">
              How we work
            </Typography>
            <Typography as="h2" variant="h2" className="mb-4 text-white">
              What sets ExpressWay apart
            </Typography>
            <p className="text-base leading-relaxed text-white/70">
              Name a destination — we clear and deliver with a focus on
              reliability and cost advantage.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="group bg-slate-800/50 p-8 backdrop-blur-sm transition-colors hover:bg-primary/40"
                >
                  <div className="mb-5 flex size-12 items-center justify-center bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-100">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/65">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-section">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <Typography variant="eyebrow" className="mb-3">
              Our aim
            </Typography>
            <Typography as="h2" variant="h2" className="mb-4 text-foreground">
              Complete logistics for your EXIM needs
            </Typography>
            <Typography variant="muted" className="text-base text-muted-foreground">
              One partner from booking through clearance, warehousing, and
              door-to-door delivery.
            </Typography>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AIMS.map((item, index) => (
              <li
                key={item}
                className="group relative overflow-hidden border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100" />
                <span className="mb-4 flex size-10 items-center justify-center bg-muted text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold leading-relaxed text-foreground">
                  {item}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-background py-section">
        <div className="container-page">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Typography variant="eyebrow" className="mb-3">
                Capabilities
              </Typography>
              <Typography as="h2" variant="h2" className="mb-4 text-foreground">
                Services we deliver every day
              </Typography>
              <Typography
                variant="muted"
                className="text-base text-muted-foreground"
              >
                Neutral NVOCC ocean and air freight, plus the EXIM services that
                keep cargo moving.
              </Typography>
            </div>
            <Button asChild variant="outline" rounded="none">
              <Link href="/services">
                View all services
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                href={service.href}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-border bg-background py-section-sm">
        <div className="container-page mb-10">
          <Typography variant="eyebrow" className="mb-3">
            Industries we serve
          </Typography>
          <Typography as="h2" variant="h2" className="text-foreground">
            Cargo expertise across trade sectors
          </Typography>
        </div>
        <div className="container-page grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.name}
                className="flex items-center gap-3 border border-border bg-card px-4 py-4"
              >
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="text-sm font-semibold text-foreground">
                  {industry.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-surface py-section">
        <div className="container-page">
          <div className="relative mx-auto flex max-w-5xl flex-col overflow-hidden shadow-2xl md:flex-row">
            <div className="absolute -top-24 -right-24 size-64 rounded-full bg-accent opacity-20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-sky-400 opacity-20 blur-3xl" />

            <div className="relative z-10 flex w-full flex-col justify-center bg-primary p-10 text-white md:w-6/12 md:p-12">
              <Typography variant="eyebrow" className="mb-3 text-accent">
                Visit us
              </Typography>
              <Typography as="h2" variant="h3" className="mb-4 text-white">
                Noida headquarters
              </Typography>
              <p className="mb-8 font-normal leading-relaxed text-slate-300">
                Meet our team for freight planning, customs advisory, project
                cargo, or warehouse discussions at Assotech Business Cresterra.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild rounded="none">
                  <Link href="/appointment">
                    Book an Appointment
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  rounded="none"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href={siteConfig.cta.primary.href}>Get a Quote</Link>
                </Button>
              </div>
            </div>

            <div className="relative z-10 w-full space-y-4 bg-white p-10 md:w-6/12 md:p-12">
              <div className="flex items-start gap-3 border border-border bg-surface p-4">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-accent"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Address
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border border-border bg-surface p-4">
                <Mail
                  className="mt-0.5 size-5 shrink-0 text-accent"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">Sales</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="mt-1 block text-sm text-accent hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 border border-border bg-surface p-4">
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-accent"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">Phone</p>
                  <a
                    href={siteConfig.contact.phoneHref}
                    className="mt-1 block text-sm font-medium text-foreground hover:text-accent"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
