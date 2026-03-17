import { Metadata } from "next";
import Image from "next/image";
import { sanityFetch } from "@/lib/sanity/client";
import { aboutQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatDateFull } from "@/lib/utils";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { PortableText } from "@/components/portable-text";

export const metadata: Metadata = {
  title: "About",
  description: "About Youngmin Cho — background, skills, and what I'm doing now.",
};

type AboutData = {
  name: string;
  title: string;
  fullBio?: unknown[];
  skills?: { category: string; items: string[] }[];
  nowContent?: unknown[];
  nowUpdatedAt?: string;
  image?: { asset: { _ref: string } };
} | null;

export default async function AboutPage() {
  const author = await sanityFetch<AboutData>({
    query: aboutQuery,
    tags: ["author"],
  });

  return (
    <>
      <Nav />
      <main className="pt-24 pb-16 px-6 mx-auto max-w-[720px]">
        <SectionLabel>About</SectionLabel>

        {/* Header: image + name + title */}
        <div className="flex items-center gap-5 mb-10">
          {author?.image && (
            <Image
              src={urlFor(author.image).width(80).height(80).auto("format").url()}
              alt={author.name || "Author"}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-text-primary text-2xl font-light">
              {author?.name || "Youngmin Cho"}
            </h1>
            {author?.title && (
              <p className="text-text-muted text-sm mt-1">{author.title}</p>
            )}
          </div>
        </div>

        {/* Full bio */}
        {author?.fullBio && (
          <section className="mb-12">
            <article className="prose-custom">
              <PortableText value={author.fullBio} />
            </article>
          </section>
        )}

        {/* Skills grid */}
        {author?.skills && author.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-text-primary text-lg font-light mb-6">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {author.skills.map((group) => (
                <div key={group.category}>
                  <h3 className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-[11px] text-text-muted border border-divider rounded px-2 py-0.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Now section */}
        {author?.nowContent && (
          <section>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-text-primary text-lg font-light">Now</h2>
              {author.nowUpdatedAt && (
                <span className="text-text-faint text-xs">
                  Updated {formatDateFull(author.nowUpdatedAt)}
                </span>
              )}
            </div>
            <article className="prose-custom">
              <PortableText value={author.nowContent} />
            </article>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
