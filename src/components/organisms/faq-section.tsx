"use client";

import { HOME_SUPPORTING_FAQS } from "@/constants/faqs";
import { PageFaq } from "@/components/organisms/page-faq";

/** Homepage FAQ accordion. Prefer PageAeo on new pages. */
export function FaqSection() {
  return <PageFaq items={HOME_SUPPORTING_FAQS} />;
}
