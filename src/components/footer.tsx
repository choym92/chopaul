import { sanityFetch } from "@/lib/sanity/client";
import { authorBioQuery } from "@/lib/sanity/queries";

type AuthorData = {
  socialLinks?: { github?: string; linkedin?: string; email?: string };
};

export async function Footer() {
  const author = await sanityFetch<AuthorData>({
    query: authorBioQuery,
    tags: ["author"],
  });

  const socials = [
    { label: "GitHub", href: author?.socialLinks?.github },
    { label: "LinkedIn", href: author?.socialLinks?.linkedin },
    { label: "Email", href: author?.socialLinks?.email ? `mailto:${author.socialLinks.email}` : undefined },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-divider py-10 px-6">
      <div className="mx-auto max-w-[1200px] flex justify-between items-center">
        <div className="text-text-muted text-sm">&copy; {new Date().getFullYear()} Youngmin Cho</div>
        <div className="flex gap-5">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-text-muted text-sm hover:text-text-primary transition-colors">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
