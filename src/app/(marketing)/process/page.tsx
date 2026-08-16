import { PROCESS_STEPS } from "@/constants/content";
import { CORE_INTENT_FAQS, PROCESS_PAGE_FAQS } from "@/constants/faqs";
import { ProcessHero } from "@/features/process/components/process-hero";
import { ProcessJourney } from "@/features/process/components/process-journey";
import { PageAeo } from "@/components/organisms/page-aeo";
import { howToProcessSchema } from "@/lib/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How to ship cargo internationally with ExpressWay Logistic: quote, documents, pickup, customs clearance, and door delivery — including India to Dubai and other EXIM lanes.",
  alternates: { canonical: "/process" },
};

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
        answerTitle="How to ship from India — including Dubai"
        answerDescription="The booking path, typical India–Middle East transit, and documents usually required for export from India."
      />
    </div>
  );
}
