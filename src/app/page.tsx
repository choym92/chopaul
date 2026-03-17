import { sanityFetch } from "@/lib/sanity/client";
import { featuredProjectQuery, recentPostsQuery, authorBioQuery } from "@/lib/sanity/queries";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { FeaturedProject } from "@/components/home/featured-project";
import { RecentWriting } from "@/components/home/recent-writing";
import { AboutSnippet } from "@/components/home/about-snippet";

type FeaturedProjectData = {
  title: string; slug: { current: string }; description: string;
  techStack: string[]; links?: { live?: string; github?: string };
  image?: { asset: { _ref: string } };
} | null;

type RecentPost = { title: string; slug: { current: string }; excerpt: string; publishedAt: string };
type AuthorBio = { bio: string; socialLinks?: { github?: string; linkedin?: string; email?: string } } | null;

export default async function Home() {
  const [project, posts, author] = await Promise.all([
    sanityFetch<FeaturedProjectData>({ query: featuredProjectQuery, tags: ["project"] }),
    sanityFetch<RecentPost[]>({ query: recentPostsQuery, tags: ["post"] }),
    sanityFetch<AuthorBio>({ query: authorBioQuery, tags: ["author"] }),
  ]);

  return (
    <>
      <Nav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Youngmin Cho",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com",
              jobTitle: "Software Engineer",
              sameAs: [
                author?.socialLinks?.github,
                author?.socialLinks?.linkedin,
              ].filter(Boolean),
            }),
          }}
        />
        <Hero socialLinks={author?.socialLinks} />
        <FeaturedProject project={project} />
        <RecentWriting posts={posts || []} />
        <AboutSnippet bio={author?.bio ?? null} />
      </main>
      <Footer />
    </>
  );
}
