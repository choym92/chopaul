"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./mobile-menu";

const links = [
  { label: "Projects", home: "#projects", other: "/#projects" },
  { label: "Blog", home: "#blog", other: "/blog" },
  { label: "About", home: "#about", other: "/about" },
  { label: "Resume", home: "/resume", other: "/resume" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-[720px] px-6 flex items-center justify-between h-14">
        <a href="/" className="text-text-primary text-sm font-semibold tracking-[1px]">
          CHOPAUL
        </a>
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const href = isHome ? link.home : link.other;
            const isActive = isHome && activeSection === link.home.replace("#", "");
            return (
              <a
                key={link.label}
                href={href}
                className={`text-xs transition-colors ${
                  isActive ? "text-accent" : "text-text-muted hover:text-text-primary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <button
          className="md:hidden text-text-muted"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} isHome={isHome} />
    </nav>
  );
}
