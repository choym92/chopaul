import { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsQuery, allProjectsQuery } from "@/lib/sanity/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    sanityFetch<{ slug: { current: string } }[]>({
      query: allPostsQuery,
      tags: ["post"],
    }),
    sanityFetch<{ slug: { current: string } }[]>({
      query: allProjectsQuery,
      tags: ["project"],
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const projectPages: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...projectPages];
}
