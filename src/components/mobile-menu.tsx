"use client";

type NavLink = { label: string; home: string; other: string };

export function MobileMenu({ open, onClose, links, isHome }: { open: boolean; onClose: () => void; links: NavLink[]; isHome: boolean }) {
  if (!open) return null;
  return (
    <div className="md:hidden border-t border-border bg-bg px-6 py-4 flex flex-col gap-4">
      {links.map((link) => (
        <a key={link.label} href={isHome ? link.home : link.other} onClick={onClose} className="text-sm text-text-muted hover:text-text-primary transition-colors">
          {link.label}
        </a>
      ))}
    </div>
  );
}
