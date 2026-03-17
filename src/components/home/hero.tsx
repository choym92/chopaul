import { SectionLabel } from "@/components/section-label";

type HeroProps = { socialLinks?: { github?: string; linkedin?: string } };

export function Hero({ socialLinks }: HeroProps) {
  return (
    <section id="top" className="pt-32 pb-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Software Engineer</SectionLabel>
        <h1 className="text-text-primary text-[32px] font-light leading-[1.3] mb-4">
          I build intelligent systems<br />at the intersection of<br />AI and finance.
        </h1>
        <p className="text-text-muted text-sm leading-relaxed max-w-[480px]">
          Full-stack engineer specializing in AI pipelines, data infrastructure, and financial intelligence platforms.
        </p>
        <div className="flex gap-3 mt-7">
          <a href="#projects" className="text-text-primary text-xs bg-surface px-4 py-2 rounded">View Projects &darr;</a>
          {socialLinks?.github && (
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-text-muted text-xs border border-border px-4 py-2 rounded hover:text-text-primary transition-colors">GitHub &rarr;</a>
          )}
          {socialLinks?.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted text-xs border border-border px-4 py-2 rounded hover:text-text-primary transition-colors">LinkedIn &rarr;</a>
          )}
        </div>
      </div>
    </section>
  );
}
