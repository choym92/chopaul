import { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity/client";
import { resumeQuery, resumePdfQuery } from "@/lib/sanity/queries";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { PortableText } from "@/components/portable-text";

export const metadata: Metadata = {
  title: "Resume",
  description: "Professional experience, education, and skills.",
};

type ResumeData = {
  experience?: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: unknown[];
  }[];
  education?: {
    institution: string;
    degree: string;
    startDate: string;
    endDate?: string;
  }[];
  skills?: { category: string; items: string[] }[];
  projects?: { title: string; slug: { current: string }; description: string }[];
} | null;

type ResumePdfData = {
  resumeUrl?: string;
} | null;

function formatYear(date: string) {
  return new Date(date).getFullYear().toString();
}

export default async function ResumePage() {
  const [resume, pdf] = await Promise.all([
    sanityFetch<ResumeData>({ query: resumeQuery, tags: ["resume"] }),
    sanityFetch<ResumePdfData>({ query: resumePdfQuery, tags: ["author"] }),
  ]);

  return (
    <>
      <Nav />
      <main className="pt-24 pb-16 px-6 mx-auto max-w-[720px]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <SectionLabel>Resume</SectionLabel>
            <h1 className="text-text-primary text-2xl font-light">
              Experience &amp; Skills
            </h1>
          </div>
          {pdf?.resumeUrl && (
            <a
              href={pdf.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-primary border border-border rounded px-3 py-1.5 hover:bg-surface transition-colors"
            >
              Download PDF
            </a>
          )}
        </div>

        {/* Experience */}
        {resume?.experience && resume.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-text-primary text-lg font-light mb-6">
              Experience
            </h2>
            <div className="space-y-8">
              {resume.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h3 className="text-text-primary text-sm font-medium">
                      {job.role}
                    </h3>
                    <span className="text-text-faint text-xs whitespace-nowrap">
                      {formatYear(job.startDate)} &ndash;{" "}
                      {job.endDate ? formatYear(job.endDate) : "Present"}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs mb-2">{job.company}</p>
                  {job.description && (
                    <div className="text-text-secondary text-sm">
                      <PortableText value={job.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume?.education && resume.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-text-primary text-lg font-light mb-6">
              Education
            </h2>
            <div className="space-y-6">
              {resume.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h3 className="text-text-primary text-sm font-medium">
                      {edu.degree}
                    </h3>
                    <span className="text-text-faint text-xs whitespace-nowrap">
                      {formatYear(edu.startDate)} &ndash;{" "}
                      {edu.endDate ? formatYear(edu.endDate) : "Present"}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resume?.skills && resume.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-text-primary text-lg font-light mb-6">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resume.skills.map((group) => (
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

        {/* Projects */}
        {resume?.projects && resume.projects.length > 0 && (
          <section>
            <h2 className="text-text-primary text-lg font-light mb-6">
              Projects
            </h2>
            <div className="space-y-4">
              {resume.projects.map((project) => (
                <Link
                  key={project.slug.current}
                  href={`/projects/${project.slug.current}`}
                  className="block group"
                >
                  <h3 className="text-text-primary text-sm font-medium group-hover:text-text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {project.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
