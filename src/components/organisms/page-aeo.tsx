import { DirectAnswers } from "@/components/organisms/direct-answers";
import { EntityFacts } from "@/components/organisms/entity-facts";
import { PageFaq } from "@/components/organisms/page-faq";
import { JsonLd } from "@/components/molecules/json-ld";
import { PageBreadcrumbs } from "@/components/molecules/page-breadcrumbs";
import type { FaqItem } from "@/constants/faqs";
import {
  breadcrumbSchema,
  faqPageSchema,
  uniqueFaqs,
} from "@/lib/schema";

interface PageAeoProps {
  answers: readonly FaqItem[];
  faqs: readonly FaqItem[];
  breadcrumbs: readonly { name: string; path: string }[];
  extraJsonLd?: unknown[];
  answerTitle?: string;
  answerDescription?: string;
  faqTitle?: string;
  faqDescription?: string;
  showBreadcrumbs?: boolean;
}

export function PageAeo({
  answers,
  faqs,
  breadcrumbs,
  extraJsonLd = [],
  answerTitle,
  answerDescription,
  faqTitle,
  faqDescription,
  showBreadcrumbs = false,
}: PageAeoProps) {
  const schemaFaqs = uniqueFaqs(answers, faqs);
  const accordionFaqs = uniqueFaqs(faqs).filter(
    (item) => !answers.some((answer) => answer.question === item.question),
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqPageSchema(schemaFaqs)} />
      {extraJsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      {showBreadcrumbs ? <PageBreadcrumbs items={breadcrumbs} /> : null}
      <DirectAnswers
        items={answers}
        title={answerTitle}
        description={answerDescription}
      />
      <EntityFacts />
      <PageFaq
        items={accordionFaqs}
        title={faqTitle}
        description={faqDescription}
      />
    </>
  );
}
