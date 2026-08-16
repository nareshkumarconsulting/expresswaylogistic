import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { PageAeo } from "@/components/organisms/page-aeo";
import { siteConfig } from "@/config/site";
import { ENTITY_STATEMENT } from "@/constants/entity";
import { CONTACT_PAGE_FAQS } from "@/constants/faqs";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Contact ExpressWay Logistic | PAN India Freight Forwarding",
  description:
    "Contact ExpressWay Logistic in Noida for PAN India freight forwarding to worldwide destinations — phone, email, quote and appointment.",
  path: "/contact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Contact"
        title="Talk to"
        accent="ExpressWay Logistic"
        description="Headquarters in Noida. Commercial coverage is PAN India to worldwide destinations."
        image="/images/operations-center.jpg"
        secondaryCta={{ href: "/appointment", label: "Book an Appointment" }}
        breadcrumbs={crumbs}
        panel={
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
              Reach the desk
            </p>
            <ul className="space-y-4 text-sm text-white/85">
              <li>
                <a href={siteConfig.contact.phoneHref} className="hover:text-accent">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="leading-relaxed">{siteConfig.contact.address}</li>
            </ul>
          </div>
        }
      />

      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock text={ENTITY_STATEMENT} />
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href={siteConfig.contact.phoneHref}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <Phone className="mb-4 size-5 text-accent" />
              <p className="text-sm font-semibold text-slate-900">Phone</p>
              <p className="mt-1 text-sm text-slate-600">{siteConfig.contact.phone}</p>
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <Mail className="mb-4 size-5 text-accent" />
              <p className="text-sm font-semibold text-slate-900">Email</p>
              <p className="mt-1 text-sm text-slate-600">{siteConfig.contact.email}</p>
            </a>
            <div className="rounded-2xl border border-border bg-card p-6">
              <MapPin className="mb-4 size-5 text-accent" />
              <p className="text-sm font-semibold text-slate-900">Office (Noida)</p>
              <p className="mt-1 text-sm text-slate-600">{siteConfig.contact.address}</p>
            </div>
          </div>
          <ArticlePanel title="Coverage">
            <p className="leading-relaxed text-slate-600">
              Serving customers across India through a nationwide logistics network,
              connecting Indian origins with worldwide destinations.{" "}
              <Link href="/pan-india-logistics" className="font-semibold text-primary hover:text-accent">
                PAN India logistics
              </Link>
              .
            </p>
          </ArticlePanel>
        </div>
      </section>

      <PageAeo answers={CONTACT_PAGE_FAQS} faqs={CONTACT_PAGE_FAQS} breadcrumbs={crumbs} />
      <QuoteCtaBand />
    </div>
  );
}
