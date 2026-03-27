import { SectionLabel } from "@/components/section-label";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  image?: { asset: { _ref: string } };
};

export function RecentWriting({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  return (
    <section id="blog" className="py-20 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Recent Writing</SectionLabel>
        <div className="flex flex-col gap-4">
          {posts.map((post, i) => (
            <a
              key={post.slug.current}
              href={`/blog/${post.slug.current}`}
              className={`flex gap-4 group ${i < posts.length - 1 ? "pb-4 border-b border-surface" : ""}`}
            >
              {post.image && (
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={urlFor(post.image).width(160).height(160).format("webp").url()}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex justify-between items-baseline gap-4 min-w-0 flex-1">
                <div className="min-w-0">
                  <div className="text-text-primary text-[15px] font-medium mb-1 group-hover:text-text-secondary transition-colors">
                    {post.title}
                  </div>
                  <div className="text-text-faint text-xs">{post.excerpt}</div>
                </div>
                <div className="text-text-faint text-xs font-mono whitespace-nowrap">
                  {formatDate(post.publishedAt)}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-5">
          <a
            href="/blog"
            className="text-text-primary text-xs border-b border-text-faint hover:border-text-primary transition-colors"
          >
            All posts &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
