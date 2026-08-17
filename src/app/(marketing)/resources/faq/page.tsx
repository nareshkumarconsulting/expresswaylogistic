import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswers } from "@/components/organisms/direct-answers";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { JsonLd } from "@/components/molecules/json-ld";
import { FAQ_ITEMS } from "@/constants/faqs";
import { faqPageSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Freight Forwarding FAQ | ExpressWay Logistic",
  description:
    "Answers on ExpressWay Logistic services, PAN India coverage, documents, quotes, tracking and Neutral Logistics Provider freight.",
  path: "/resources/faq",
});

export default function ResourcesFaqPage() {
  return (
    <div className="bg-surface">
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />
      <PageHero
        eyebrow="FAQ"
        title="Freight forwarding"
        accent="questions"
        description="Visible answers. Schema matches this page."
        image="/images/operations-center.jpg"
        backHref="/resources"
        backLabel="Resources hub"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "FAQ", path: "/resources/faq" },
        ]}
      />
      <DirectAnswers items={FAQ_ITEMS} title="Questions and answers" />
      <QuoteCtaBand />
    </div>
  );
}
