import { createClient } from "next-sanity";
import { draftMode } from "next/headers";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  let isDraft = false;
  try {
    isDraft = (await draftMode()).isEnabled;
  } catch {
    // draftMode() unavailable outside request scope (e.g. generateStaticParams)
  }

  if (isDraft) {
    const token = process.env.SANITY_API_READ_TOKEN;
    return client
      .withConfig({ token, useCdn: false, perspective: "previewDrafts" })
      .fetch<T>(query, params, { next: { revalidate: 0, tags } });
  }

  return client.fetch<T>(query, params, {
    next: { revalidate: 3600, tags },
  });
}
