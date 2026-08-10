import type { Metadata } from "next";
import { Typography } from "@/components/atoms/typography";
import { PageHero } from "@/components/molecules/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`How ${siteConfig.name} collects, uses, and protects information when you use our website and logistics services.`}
      />

      <section className="pb-[var(--space-section)] pt-12 md:pt-16">
        <article className="container-page max-w-3xl space-y-6">
          <Typography variant="body" className="text-muted-foreground">
            {siteConfig.name} collects contact and shipment information solely to
            provide logistics services, quotations, and operational support. We do
            not sell personal data. Data is processed securely and retained only
            as long as necessary for service delivery and legal compliance.
          </Typography>
          <Typography variant="body" className="text-muted-foreground">
            Information you submit through quote forms, tracking lookups, or the
            Command Center is used to respond to your request, operate shipments,
            and improve service reliability. Access is limited to authorized
            operations staff and processors acting on our behalf.
          </Typography>
          <Typography variant="body" className="text-muted-foreground">
            For privacy requests, contact{" "}
            <a
              className="font-semibold text-accent hover:underline"
              href={`mailto:${siteConfig.contact.email}`}
            >
              {siteConfig.contact.email}
            </a>
            .
          </Typography>
        </article>
      </section>
    </div>
  );
}
