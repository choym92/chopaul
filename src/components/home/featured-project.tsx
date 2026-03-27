import Image from "next/image";
import { SectionLabel } from "@/components/section-label";
import { urlFor } from "@/lib/sanity/image";

type Project = {
  title: string;
  slug: { current: string };
  description: string;
  techStack: string[];
  links?: { live?: string; github?: string };
  image?: { asset: { _ref: string } };
};

export function FeaturedProject({ project }: { project: Project | null }) {
  if (!project) return null;

  const liveUrl = project.links?.live;

  return (
    <section id="projects" className="py-24 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Featured Project</SectionLabel>
        <div className="rounded-xl border border-border overflow-hidden bg-surface">
          <a
            href={liveUrl || `/projects/${project.slug.current}`}
            target={liveUrl ? "_blank" : undefined}
            rel={liveUrl ? "noopener noreferrer" : undefined}
            className="block group"
          >
            <div className="aspect-[2.2/1] bg-white flex items-center justify-center p-10 border-b border-border transition-colors group-hover:bg-gray-50">
              {project.image ? (
                <img
                  src={urlFor(project.image).width(720).height(327).auto("format").url()}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src="/araverus-logo.png"
                  alt={project.title}
                  width={300}
                  height={65}
                  className="opacity-90"
                  priority
                />
              )}
            </div>
          </a>

          <div className="p-6 md:p-8">
            <h2 className="text-text-primary text-lg font-medium mb-1">
              {project.title}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-5">
              {project.description}
            </p>

            {project.techStack && (
              <div className="flex gap-2 flex-wrap mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-text-muted text-[11px] font-mono border border-border px-2.5 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary text-sm font-semibold hover:underline"
                >
                  Visit site &rarr;
                </a>
              )}
              <a
                href={`/projects/${project.slug.current}`}
                className="text-text-primary text-sm font-semibold hover:underline transition-colors"
              >
                View project &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
