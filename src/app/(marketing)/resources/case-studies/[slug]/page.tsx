import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/molecules/page-hero";
import { DirectAnswerBlock } from "@/components/molecules/direct-answer-block";
import { ArticlePanel } from "@/components/molecules/article-panel";
import { RelatedLinks } from "@/components/organisms/related-links";
import { QuoteCtaBand } from "@/components/organisms/quote-cta-band";
import { JsonLd } from "@/components/molecules/json-ld";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/constants/resources";
import { SERVICES } from "@/constants/services";
import { articleSchema } from "@/lib/schema";
import { pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study not found" };
  return pageSeo({
    title: study.seoTitle,
    description: study.seoDescription,
    path: `/resources/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "Case studies", path: "/resources/case-studies" },
    { name: study.title, path: `/resources/case-studies/${study.slug}` },
  ];

  return (
    <div className="bg-surface">
      <JsonLd
        data={articleSchema({
          headline: study.h1,
          description: study.seoDescription,
          path: `/resources/case-studies/${study.slug}`,
        })}
      />
      <PageHero
        eyebrow="Case example"
        title={study.h1}
        description={study.directAnswer}
        image="/images/operations-center.jpg"
        backHref="/resources/case-studies"
        backLabel="All case examples"
        breadcrumbs={crumbs}
      />
      <section className="bg-surface py-section">
        <div className="container-page space-y-8">
          <DirectAnswerBlock text={study.directAnswer} />
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Industry
              </dt>
              <dd className="mt-2 text-sm font-semibold text-foreground">
                {study.industry}
              </dd>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Mode
              </dt>
              <dd className="mt-2 text-sm font-semibold text-foreground">
                {study.mode}
              </dd>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Route
              </dt>
              <dd className="mt-2 text-sm font-semibold text-foreground">
                {study.route}
              </dd>
            </div>
          </dl>
          <ArticlePanel>
            <h2 className="text-lg font-semibold text-foreground">Challenge</h2>
            <p className="leading-relaxed text-slate-600">{study.challenge}</p>
            <h2 className="text-lg font-semibold text-foreground">Approach</h2>
            <ul className="list-disc space-y-2 pl-5 leading-relaxed text-slate-600">
              {study.approach.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <h2 className="text-lg font-semibold text-foreground">Outcome</h2>
            <p className="leading-relaxed text-slate-600">{study.outcome}</p>
            <p className="text-sm text-muted-foreground">
              Anonymized summary from a verified ExpressWay shipment file. Details
              vary by commodity, lane and current regulations.
            </p>
          </ArticlePanel>
        </div>
      </section>
      <RelatedLinks
        services={study.relatedServiceIds
          .map((id) => SERVICES.find((service) => service.id === id))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .map((service) => ({ href: service.href, label: service.title }))}
      />
      <QuoteCtaBand />
    </div>
  );
}
