import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getServiceIds } from "@/constants/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    ...getServiceIds().map((id) => `/services/${id}`),
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
      route === "" ? 1 : route.startsWith("/services") ? 0.8 : 0.7,
  }));
}
