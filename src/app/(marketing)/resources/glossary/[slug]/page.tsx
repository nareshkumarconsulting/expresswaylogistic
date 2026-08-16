import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { getGlossaryBySlug, GLOSSARY } from "@/constants/resources";
import { SERVICES } from "@/constants/services";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GLOSSARY.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryBySlug(slug);
  if (!term) return { title: "Term not found" };
  return pageSeo({
    title: `${term.term} | Glossary | ExpressWay Logistic`,
    description: term.definition,
    path: `/resources/glossary/${term.slug}`,
  });
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = getGlossaryBySlug(slug);
  if (!term) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "Glossary", path: "/resources/glossary" },
    { name: term.term, path: `/resources/glossary/${term.slug}` },
  ];

  return (
    <div className="bg-surface">
      <PageHero
        eyebrow="Glossary"
        title={term.term}
        description={term.definition}
        image="/images/operations-center.jpg"
        backHref="/resources/glossary"
        backLabel="All terms"
        breadcrumbs={crumbs}
      />
      <section className="bg-surface py-section">
        <div className="container-page">
          <DirectAnswerBlock heading="Definition" text={term.definition} />
        </div>
      </section>
      <RelatedLinks
        services={term.relatedServiceIds
          .map((id) => SERVICES.find((service) => service.id === id))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .map((service) => ({ href: service.href, label: service.title }))}
      />
      <QuoteCtaBand />
    </div>
  );
}
