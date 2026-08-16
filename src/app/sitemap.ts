import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { INDUSTRIES } from "@/constants/content";
import { LOCATIONS, REGIONS, ROUTES } from "@/constants/geography";
import { GLOSSARY, GUIDES } from "@/constants/resources";
import { getServiceIds } from "@/constants/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/contact",
    "/process",
    "/industries",
    ...INDUSTRIES.map((industry) => `/industries/${industry.slug}`),
    "/services",
    ...getServiceIds().map((id) => `/services/${id}`),
    "/pan-india-logistics",
    ...REGIONS.map((region) => `/pan-india-logistics/${region.slug}`),
    "/locations",
    ...LOCATIONS.map((location) => `/locations/${location.slug}`),
    "/shipping-routes",
    ...ROUTES.map((route) => `/shipping-routes/${route.slug}`),
    "/resources",
    "/resources/guides",
    ...GUIDES.map((guide) => `/resources/guides/${guide.slug}`),
    "/resources/faq",
    "/resources/glossary",
    ...GLOSSARY.map((term) => `/resources/glossary/${term.slug}`),
    "/track",
    "/appointment",
    "/quote",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route.startsWith("/services") ||
            route === "/quote" ||
            route === "/pan-india-logistics"
          ? 0.8
          : 0.7,
  }));
}
