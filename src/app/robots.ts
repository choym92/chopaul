import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.chopaul.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/studio/",
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: "/studio/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: "/studio/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: "/studio/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: "/studio/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: "/studio/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
