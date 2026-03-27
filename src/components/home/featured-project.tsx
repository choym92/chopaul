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

type OtherProject = {
  title: string;
  slug: { current: string };
  description: string;
  image?: { asset: { _ref: string } };
};

export function FeaturedProject({
  project,
  otherProjects,
}: {
  project: Project | null;
  otherProjects: OtherProject[];
}) {
  if (!project) return null;

  const liveUrl = project.links?.live;

  return (
    <section id="projects" className="py-24 px-6 border-b border-divider">
      <div className="mx-auto max-w-[1100px]">
        <SectionLabel>Projects</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Featured — 3/4 */}
          <div className="md:col-span-3">
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
                      src={urlFor(project.image).width(720).auto("format").fit("max").url()}
                      alt={project.title}
                      className="w-full h-full object-contain"
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

              <a href={`/projects/${project.slug.current}`} className="block p-6 md:p-8 group/text hover:bg-surface/80 transition-colors">
                <h2 className="text-text-primary text-lg font-medium mb-1 group-hover/text:text-text-secondary transition-colors">
                  {project.title}
                </h2>
                <p className="text-text-primary/70 text-sm leading-relaxed mb-5">
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

                <span className="text-text-primary text-sm font-semibold group-hover/text:underline">
                  View project &rarr;
                </span>
              </a>
            </div>
          </div>

          {/* Other projects — 1/4 */}
          <div className="md:col-span-1 flex flex-col gap-4">
            {otherProjects.map((p) => (
              <a
                key={p.slug.current}
                href={`/projects/${p.slug.current}`}
                className="group block rounded-lg border border-border overflow-hidden bg-surface hover:bg-surface/80 transition-colors"
              >
                {p.image && (
                  <div className="aspect-[2/1] bg-white flex items-center justify-center border-b border-border">
                    <img
                      src={urlFor(p.image).width(400).auto("format").fit("max").url()}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-text-primary text-sm font-medium mb-1 group-hover:text-text-secondary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-text-primary/60 text-xs leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
