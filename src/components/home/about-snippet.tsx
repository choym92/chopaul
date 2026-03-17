import { SectionLabel } from "@/components/section-label";

export function AboutSnippet({ bio }: { bio: string | null }) {
  return (
    <section id="about" className="py-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>About</SectionLabel>
        {bio && <p className="text-text-secondary text-sm leading-relaxed max-w-[520px]">{bio}</p>}
        <div className="flex gap-4 mt-5">
          <a href="/about" className="text-text-muted text-xs border-b border-text-faint hover:text-text-primary transition-colors">Full bio &rarr;</a>
          <a href="/resume" className="text-text-muted text-xs border-b border-text-faint hover:text-text-primary transition-colors">Download resume &rarr;</a>
        </div>
      </div>
    </section>
  );
}
