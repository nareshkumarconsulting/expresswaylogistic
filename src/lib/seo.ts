import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CONTENT_UPDATED_AT } from "@/constants/entity";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  ogImage?: string;
};

const TITLE_MAX = 65;
const TITLE_MIN = 30;
const META_MAX = 160;
const META_MIN = 70;

function trimTo(value: string, max: number, min: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  let cut = trimmed.slice(0, max);
  const space = cut.lastIndexOf(" ");
  if (space >= min) cut = cut.slice(0, space);
  return cut.replace(/[\s|–—:,-]+$/g, "").trim();
}

/** Keep the document title inside the 30–65 character SERP window. */
export function documentTitle(title: string): string {
  return trimTo(title, TITLE_MAX, TITLE_MIN);
}

/** Keep meta descriptions inside the 70–160 character window. */
export function documentDescription(value: string, max = META_MAX): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimTo(trimmed, max - 1, META_MIN)}.`;
}

export function pageSeo({
  title,
  description,
  path,
  index = true,
  ogImage = "/images/hero-banner.png",
}: PageSeoInput): Metadata {
  const canonicalPath = path === "/" ? "/" : path;
  const url = `${siteConfig.url}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const seoTitle = documentTitle(title);
  const seoDescription = documentDescription(description);

  return {
    title: { absolute: seoTitle },
    description: seoDescription,
    alternates: { canonical: canonicalPath },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: ogImage,
          width: 1024,
          height: 682,
          alt: `${siteConfig.name} freight forwarding operations`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
    other: {
      "og:updated_time": CONTENT_UPDATED_AT,
    },
  };
}
