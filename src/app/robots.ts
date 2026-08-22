import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const DISALLOW = [
  "/command-center",
  "/ops-login",
  "/dashboard",
  "/admin",
  "/api/",
];

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
