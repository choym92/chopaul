import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsQuery } from "@/lib/sanity/queries";
import { formatDate } from "@/lib/utils";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, AI, and building things.",
};

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  tags?: string[];
};

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>({
    query: allPostsQuery,
    tags: ["post"],
  });

  return (
    <>
      <Nav />
      <main className="pt-24 pb-16 px-6 mx-auto max-w-[720px]">
        <SectionLabel>Blog</SectionLabel>
        <h1 className="text-text-primary text-2xl font-light mb-10">
          Writing
        </h1>

        {!posts || posts.length === 0 ? (
          <p className="text-text-muted text-sm">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug.current}
                href={`/blog/${post.slug.current}`}
                className="block group"
              >
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h2 className="text-text-primary text-sm font-medium group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <time className="text-text-faint text-xs whitespace-nowrap">
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
                <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
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
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
