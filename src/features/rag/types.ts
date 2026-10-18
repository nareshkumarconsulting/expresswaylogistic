export type RagSourceKind =
  | "faq"
  | "service"
  | "process"
  | "company"
  | "shipment"
  | "quote"
  | "email";

export type RagDocument = {
  id: string;
  kind: RagSourceKind;
  title: string;
  text: string;
  /** Optional deep-link path inside Command Center or the marketing site. */
  href?: string;
};

export type RagHit = RagDocument & {
  score: number;
  excerpt: string;
};

export type RagAnswer = {
  answer: string;
  sources: RagHit[];
  usedLlm: boolean;
};
