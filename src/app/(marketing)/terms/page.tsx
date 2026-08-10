import type { Metadata } from "next";
import { Typography } from "@/components/atoms/typography";
import { PageHero } from "@/components/molecules/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description={`Conditions for using ${siteConfig.name} websites, tracking tools, and the AI Logistics Command Center.`}
      />

      <section className="pb-[var(--space-section)] pt-12 md:pt-16">
        <article className="container-page max-w-3xl space-y-6">
          <Typography variant="body" className="text-muted-foreground">
            By using {siteConfig.name} websites and the AI Logistics Command
            Center, you agree to provide accurate shipment information and comply
            with applicable trade, customs, and transport regulations. Quotes are
            indicative until confirmed in a formal booking.
          </Typography>
          <Typography variant="body" className="text-muted-foreground">
            You are responsible for the accuracy of cargo declarations, party
            details, and documents you submit. We may suspend access to tools if
            misuse, fraud, or regulatory risk is detected. Demo tracking IDs are
            for evaluation only and do not represent live customer shipments.
          </Typography>
          <Typography variant="body" className="text-muted-foreground">
            Questions about these terms:{" "}
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
