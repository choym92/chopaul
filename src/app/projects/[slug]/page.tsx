import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { allProjectsQuery, projectBySlugQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PortableText, highlightCodeBlocks } from "@/components/portable-text";

type Project = {
  title: string;
  slug: { current: string };
  description: string;
  body?: unknown[];
  techStack?: string[];
  links?: { live?: string; github?: string };
  image?: { asset: { _ref: string } };
};

type Params = { slug: string };

export async function generateStaticParams() {
  const projects = await sanityFetch<{ slug: { current: string } }[]>({
    query: allProjectsQuery,
    tags: ["project"],
  });
  return (projects || []).map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project"],
  });

  if (!project) return { title: "Project not found" };

  const ogImage = project.image
    ? urlFor(project.image).width(1200).height(630).auto("format").url()
    : `/og?title=${encodeURIComponent(project.title)}`;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project"],
  });

  if (!project) notFound();

  const highlightedBody = project.body
    ? await highlightCodeBlocks(project.body)
    : [];

  return (
    <>
      <Nav />
      <main className="pt-24 pb-16 px-6 mx-auto max-w-[720px]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: project.title,
                description: project.description,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com"}/projects/${slug}`,
                author: {
                  "@type": "Person",
                  name: "Youngmin Cho",
                  url: process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com",
                },
                ...(project.techStack && { keywords: project.techStack.join(", ") }),
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
                    name: "Projects",
                    item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com"}/#projects`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: project.title,
                  },
                ],
              },
            ]),
          }}
        />
        {project.image && (
          <div className="mb-8 -mx-6 md:mx-0 md:rounded-lg overflow-hidden bg-white">
            <Image
              src={urlFor(project.image).width(1440).auto("format").url()}
              alt={project.title}
              width={1440}
              height={400}
              className="w-full h-auto object-contain max-h-[360px] p-6"
              priority
            />
          </div>
        )}

        <h1 className="text-text-primary text-3xl font-semibold mb-3">
          {project.title}
        </h1>
        <p className="text-text-secondary text-base leading-relaxed mb-6">
          {project.description}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] text-text-muted border border-divider rounded-full px-2.5 py-0.5"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.links && (project.links.live || project.links.github) && (
          <div className="flex gap-4 mb-10">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-primary border-b border-text-faint hover:border-text-primary transition-colors"
              >
                Live Site
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-primary border-b border-text-faint hover:border-text-primary transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
        )}

        {highlightedBody.length > 0 && (
          <article className="prose-custom">
            <PortableText value={highlightedBody} />
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
