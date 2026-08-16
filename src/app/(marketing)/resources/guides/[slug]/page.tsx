import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { JsonLd } from "@/components/molecules/json-ld";
import { getGuideBySlug, GUIDES } from "@/constants/resources";
import { SERVICES } from "@/constants/services";
import { articleSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };
  return pageSeo({
    title: guide.seoTitle,
    description: guide.seoDescription,
    path: `/resources/guides/${guide.slug}`,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "Guides", path: "/resources/guides" },
    { name: guide.title, path: `/resources/guides/${guide.slug}` },
  ];

  return (
    <div className="bg-surface">
      <JsonLd
        data={articleSchema({
          headline: guide.h1,
          description: guide.seoDescription,
          path: `/resources/guides/${guide.slug}`,
        })}
      />
      <PageHero
        eyebrow="Guide"
        title={guide.h1}
        description={guide.directAnswer}
        image="/images/operations-center.jpg"
        backHref="/resources/guides"
        backLabel="All guides"
        breadcrumbs={crumbs}
      />
      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock text={guide.directAnswer} />
          <ArticlePanel>
            {guide.body.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </ArticlePanel>
        </div>
      </section>
      <RelatedLinks
        services={guide.relatedServiceIds
          .map((id) => SERVICES.find((service) => service.id === id))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .map((service) => ({ href: service.href, label: service.title }))}
      />
      <QuoteCtaBand />
    </div>
  );
}
