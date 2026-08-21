import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { INDUSTRIES } from "@/constants/content";
import { LOCATIONS, REGIONS, ROUTES } from "@/constants/geography";
import { GLOSSARY, GUIDES } from "@/constants/resources";
import { getServiceIds } from "@/constants/services";

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
};

function isGatewayKind(kind: (typeof LOCATIONS)[number]["kind"]) {
  return kind === "icd" || kind === "airport";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },

    // Core
    { path: "/services", priority: 0.8 },
    ...getServiceIds().map((id) => ({
      path: `/services/${id}`,
      priority: 0.8,
    })),
    { path: "/quote", priority: 0.8 },
    { path: "/pan-india-logistics", priority: 0.8 },

    // Regions & hubs
    ...REGIONS.map((region) => ({
      path: `/pan-india-logistics/${region.slug}`,
      priority: 0.75,
    })),
    { path: "/locations", priority: 0.75 },
    ...LOCATIONS.filter((location) => !isGatewayKind(location.kind)).map(
      (location) => ({
        path: `/locations/${location.slug}`,
        priority: 0.75,
      }),
    ),

    // ICD / airport gateways
    ...LOCATIONS.filter((location) => isGatewayKind(location.kind)).map(
      (location) => ({
        path: `/locations/${location.slug}`,
        priority: 0.65,
      }),
    ),

    // Supporting
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/process", priority: 0.6 },
    { path: "/industries", priority: 0.6 },
    ...INDUSTRIES.map((industry) => ({
      path: `/industries/${industry.slug}`,
      priority: 0.6,
    })),
    { path: "/shipping-routes", priority: 0.6 },
    ...ROUTES.map((route) => ({
      path: `/shipping-routes/${route.slug}`,
      priority: 0.6,
    })),
    { path: "/resources", priority: 0.6 },
    { path: "/resources/guides", priority: 0.6 },
    ...GUIDES.map((guide) => ({
      path: `/resources/guides/${guide.slug}`,
      priority: 0.6,
    })),
    { path: "/resources/faq", priority: 0.6 },
    { path: "/resources/glossary", priority: 0.6 },
    ...GLOSSARY.map((term) => ({
      path: `/resources/glossary/${term.slug}`,
      priority: 0.6,
    })),
    { path: "/track", priority: 0.6 },
    { path: "/appointment", priority: 0.6 },
    { path: "/privacy", priority: 0.6 },
    { path: "/terms", priority: 0.6 },
  ];

  return entries.map(({ path, priority, changeFrequency = "monthly" }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
