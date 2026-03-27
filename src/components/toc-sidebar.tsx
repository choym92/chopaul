"use client";

import { useState, useEffect, useCallback } from "react";

type TocItem = { id: string; text: string; level: number };

export function TocSidebar() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const els = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(els)
      .filter((el) => el.textContent?.trim())
      .map((el, i) => {
        if (!el.id) el.id = `heading-${i}`;
        return {
          id: el.id,
          text: el.textContent!.trim(),
          level: el.tagName === "H2" ? 2 : 3,
        };
      });
    setHeadings(items);
  }, []);

  const handleScroll = useCallback(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleHeight = rect.height;
    const scrolled = window.scrollY - articleTop;
    const pct = Math.min(100, Math.max(0, Math.round((scrolled / (articleHeight - window.innerHeight)) * 100)));
    setProgress(pct);

    const headingEls = document.querySelectorAll("article h2, article h3");
    let current = "";
    for (const el of headingEls) {
      const top = el.getBoundingClientRect().top;
      if (top <= 120) current = el.id;
    }
    if (current) setActiveId(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
            On this page
          </span>
          <span className="text-[11px] font-mono text-text-faint">{progress}%</span>
        </div>

        <div className="h-px bg-divider mb-4 relative">
          <div
            className="absolute top-0 left-0 h-full bg-text-primary transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <nav className="flex flex-col gap-2.5 mb-8">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-sm leading-snug transition-colors ${
                h.level === 3 ? "pl-3" : ""
              } ${
                activeId === h.id
                  ? "text-text-primary font-semibold"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>

        <div className="border-t border-divider pt-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors w-full"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 11V3M3 6l4-4 4 4" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </aside>
  );
}
