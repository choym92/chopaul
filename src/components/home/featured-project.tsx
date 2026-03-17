import { SectionLabel } from "@/components/section-label";

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
  return (
    <section id="projects" className="py-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Featured Project</SectionLabel>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-surface rounded-lg p-6 border border-border">
              <div className="text-accent text-[11px] tracking-[2px] font-mono mb-3">
                {project.links?.live ? new URL(project.links.live).hostname.toUpperCase() : project.title.toUpperCase()}
              </div>
              <div className="text-text-muted text-xs leading-relaxed mb-4">{project.description}</div>
              {project.techStack && (
                <div className="flex gap-1.5 flex-wrap">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-text-faint text-[10px] border border-border px-2 py-0.5 rounded">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary text-sm font-medium mb-2">{project.title}</h3>
            <p className="text-text-muted text-[13px] leading-relaxed mb-4">{project.description}</p>
            <a href={`/projects/${project.slug.current}`} className="text-link text-xs border-b border-text-faint hover:text-text-primary transition-colors">
              Read case study &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
