import { SectionLabel } from "@/components/section-label";

export function AboutSnippet({ bio }: { bio: string | null }) {
  return (
    <section id="about" className="py-24 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>About</SectionLabel>
        {bio && <p className="text-text-primary/70 text-base leading-relaxed">{bio}</p>}
        <div className="flex gap-6 mt-6">
          <a href="/about" className="text-text-primary text-sm font-medium border-b border-text-muted hover:border-text-primary transition-colors">Full bio &rarr;</a>
          <a href="/resume" className="text-text-primary text-sm font-medium border-b border-text-muted hover:border-text-primary transition-colors">Download resume &rarr;</a>
        </div>
      </div>
    </section>
  );
}
