import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsQuery, postBySlugQuery } from "@/lib/sanity/queries";
import { readingTime, formatDateFull } from "@/lib/utils";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PortableText, highlightCodeBlocks } from "@/components/portable-text";
import { type PortableTextBlock } from "@portabletext/react";

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  body: PortableTextBlock[];
  publishedAt: string;
  tags?: string[];
  image?: { asset: { _ref: string } };
};

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: { current: string } }[]>({
    query: allPostsQuery,
    tags: ["post"],
  });
  return (posts || []).map((post) => ({ slug: post.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [
        {
          url: `/og?title=${encodeURIComponent(post.title)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });

  if (!post) notFound();

  const highlightedBody = post.body
    ? await highlightCodeBlocks(post.body)
    : [];

  return (
    <>
      <Nav />
      <main className="pt-24 pb-16 px-6 mx-auto max-w-[720px]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              datePublished: post.publishedAt,
              description: post.excerpt,
              author: {
                "@type": "Person",
                name: "Youngmin Cho",
              },
            }),
          }}
        />
        <div className="mb-10">
          <h1 className="text-text-primary text-2xl font-light mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-text-faint text-xs">
            <time>{formatDateFull(post.publishedAt)}</time>
            <span>&middot;</span>
            <span>{readingTime(post.body)}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-text-faint border border-divider rounded px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <article className="prose-custom">
          <PortableText value={highlightedBody} />
        </article>
      </main>
      <Footer />
    </>
  );
}
