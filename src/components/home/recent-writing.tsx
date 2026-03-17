import { SectionLabel } from "@/components/section-label";
import { formatDate } from "@/lib/utils";

type Post = { title: string; slug: { current: string }; excerpt: string; publishedAt: string };

export function RecentWriting({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;
  return (
    <section id="blog" className="py-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Recent Writing</SectionLabel>
        <div className="flex flex-col gap-4">
          {posts.map((post, i) => (
            <a key={post.slug.current} href={`/blog/${post.slug.current}`}
              className={`flex justify-between items-baseline gap-4 group ${i < posts.length - 1 ? "pb-4 border-b border-surface" : ""}`}>
              <div>
                <div className="text-text-primary text-sm mb-1 group-hover:text-accent transition-colors">{post.title}</div>
                <div className="text-text-faint text-xs">{post.excerpt}</div>
              </div>
              <div className="text-text-faint text-xs whitespace-nowrap">{formatDate(post.publishedAt)}</div>
            </a>
          ))}
        </div>
        <div className="mt-5">
          <a href="/blog" className="text-text-muted text-xs border-b border-text-faint hover:text-text-primary transition-colors">All posts &rarr;</a>
        </div>
      </div>
    </section>
  );
}
