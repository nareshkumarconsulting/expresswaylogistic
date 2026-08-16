import { PROCESS_STEPS } from "@/constants/content";
import { CORE_INTENT_FAQS, PROCESS_PAGE_FAQS } from "@/constants/faqs";
import { ProcessHero } from "@/features/process/components/process-hero";
import { ProcessJourney } from "@/features/process/components/process-journey";
import { PageAeo } from "@/components/organisms/page-aeo";
import { howToProcessSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "How International Freight Forwarding Works | ExpressWay Logistic",
  description:
    "Quote, booking and documents, pickup, customs clearance and door delivery — how ExpressWay moves cargo from origins across India to worldwide destinations.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <div className="bg-surface">
      <ProcessHero />
      <ProcessJourney />
      <PageAeo
        answers={[CORE_INTENT_FAQS[1], CORE_INTENT_FAQS[2], PROCESS_PAGE_FAQS[2]]}
        faqs={PROCESS_PAGE_FAQS}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Process", path: "/process" },
        ]}
        extraJsonLd={[howToProcessSchema(PROCESS_STEPS)]}
        answerTitle="How to ship from India"
        answerDescription="The booking path, documents usually required for export from India, and why transit is not published as a guarantee."
      />
    </div>
  );
}
