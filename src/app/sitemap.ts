import { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsQuery, allProjectsQuery } from "@/lib/sanity/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.chopaul.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    sanityFetch<{ slug: { current: string }; _updatedAt?: string }[]>({
      query: allPostsQuery,
      tags: ["post"],
    }),
    sanityFetch<{ slug: { current: string }; _updatedAt?: string }[]>({
      query: allProjectsQuery,
      tags: ["project"],
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/resume`, lastModified: new Date() },
  ];

  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
  }));

  const projectPages: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug.current}`,
    lastModified: project._updatedAt ? new Date(project._updatedAt) : new Date(),
  }));

  return [...staticPages, ...postPages, ...projectPages];
}
