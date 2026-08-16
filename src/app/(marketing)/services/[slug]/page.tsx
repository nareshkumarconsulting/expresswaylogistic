import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import { ServiceCard } from "@/components/molecules/service-card";
import { ServiceHero } from "@/features/services/components/service-hero";
import { siteConfig } from "@/config/site";
import {
  getServiceById,
  getServiceIds,
  SERVICES,
} from "@/constants/services";
import { getServiceFaqs } from "@/constants/faqs";
import { PageAeo } from "@/components/organisms/page-aeo";
import { serviceSchema } from "@/lib/schema";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getServiceIds().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) {
    return { title: "Service not found" };
  }

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.id}` },
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.description,
      url: `${siteConfig.url}/services/${service.id}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) notFound();

  const related = SERVICES.filter((item) => item.id !== service.id).slice(0, 3);
  const serviceFaqs = getServiceFaqs(service.title);

  return (
    <div className="bg-surface">
      <ServiceHero serviceId={service.id} />

      <section className="relative z-10 -mt-6 pb-[var(--space-section)] md:-mt-8">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12">
            <article className="border border-border bg-card p-6 shadow-sm md:p-8 lg:col-span-8">
              <Typography as="h2" variant="h3" className="mb-4 text-foreground">
                How this service works
              </Typography>
              <Typography
                variant="muted"
                className="mb-8 text-base leading-relaxed text-muted-foreground"
              >
                {service.details}
              </Typography>

              <Typography as="h3" variant="h4" className="mb-4 text-foreground">
                What’s included
              </Typography>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border border-border bg-surface p-4"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span className="text-sm font-medium leading-relaxed text-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <aside className="space-y-6 lg:col-span-4">
              <div className="border border-border bg-card p-6 shadow-sm">
                <Typography as="h2" variant="h4" className="mb-2 text-foreground">
                  Need this service?
                </Typography>
                <Typography
                  variant="muted"
                  className="mb-5 text-sm text-muted-foreground"
                >
                  Share cargo details and our team responds within 2 hours with
                  competitive options.
                </Typography>
                <div className="flex flex-col gap-3">
                  <Button asChild rounded="none">
                    <Link href={siteConfig.cta.primary.href}>
                      Get a Quote
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" rounded="none">
                    <Link href="/appointment">Book an Appointment</Link>
                  </Button>
                </div>
              </div>

              <div className="border border-border bg-card p-6 shadow-sm">
                <Typography
                  as="h2"
                  variant="h4"
                  className="mb-4 text-foreground"
                >
                  Talk to sales
                </Typography>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={siteConfig.contact.phoneHref}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="mt-16">
            <Typography as="h2" variant="h3" className="mb-6 text-foreground">
              Related services
            </Typography>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <ServiceCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  href={item.href}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <PageAeo
        answers={serviceFaqs.slice(0, 3)}
        faqs={serviceFaqs}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: service.href },
        ]}
        extraJsonLd={[serviceSchema(service)]}
        answerTitle={`About ${service.title}`}
        answerDescription="What this service covers, how it is booked from India, and how cost is quoted — plus typical export documents."
      />
    </div>
  );
}
