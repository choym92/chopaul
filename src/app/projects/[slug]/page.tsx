import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { allProjectsQuery, projectBySlugQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
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
        <h1 className="text-text-primary text-2xl font-light mb-3">
          {project.title}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
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
                className="text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-2"
              >
                Live Site
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-2"
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
