import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsQuery, postBySlugQuery } from "@/lib/sanity/queries";
import { readingTime, formatDateFull } from "@/lib/utils";
import Image from "next/image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PortableText, highlightCodeBlocks } from "@/components/portable-text";
import { TocSidebar } from "@/components/toc-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { urlFor } from "@/lib/sanity/image";
import { type PortableTextBlock } from "@portabletext/react";

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  body: PortableTextBlock[];
  publishedAt: string;
  _updatedAt?: string;
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
      <main className="pt-24 pb-16 px-6 mx-auto max-w-[1200px]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                datePublished: post.publishedAt,
                dateModified: post._updatedAt || post.publishedAt,
                description: post.excerpt,
                image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com"}/og?title=${encodeURIComponent(post.title)}`,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com"}/blog/${slug}`,
                author: {
                  "@type": "Person",
                  name: "Youngmin Cho",
                  url: process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com",
                },
                publisher: {
                  "@type": "Person",
                  name: "Youngmin Cho",
                  url: process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Blog",
                    item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com"}/blog`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: post.title,
                  },
                ],
              },
            ]),
          }}
        />
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
        <div className="flex gap-12">
          <div className="max-w-[720px] flex-1 min-w-0">
            <div className="mb-10">
              <h1 className="text-text-primary text-3xl font-semibold mb-3">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-text-muted text-sm">
                <time>{formatDateFull(post.publishedAt)}</time>
                <span>&middot;</span>
                <span>{readingTime(post.body)}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-text-muted border border-divider rounded px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {post.image?.asset && (
              <div className="mb-10 rounded-lg overflow-hidden">
                <Image
                  src={urlFor(post.image).width(1440).quality(85).url()}
                  alt={post.title}
                  width={1440}
                  height={578}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}

            <article className="prose-custom">
              <PortableText value={highlightedBody} />
            </article>
          </div>

          <TocSidebar />
        </div>
      </main>
      <Footer />
    </>
  );
}
