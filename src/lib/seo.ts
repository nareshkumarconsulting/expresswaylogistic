import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  ogImage?: string;
};

export function pageSeo({
  title,
  description,
  path,
  index = true,
  ogImage = "/images/hero-banner.png",
}: PageSeoInput): Metadata {
  const canonicalPath = path === "/" ? "/" : path;
  const url = `${siteConfig.url}${canonicalPath === "/" ? "/" : canonicalPath}`;

  return {
    title: { absolute: title },
    description,
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
      title,
      description,
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
      title,
      description,
      images: [ogImage],
    },
  };
}
