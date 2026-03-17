# Light Theme Full Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign chopaul.com from dark to light theme with Duwy-style hero featuring oversized "Data Scientist" typography.

**Architecture:** Swap Tailwind CSS 4 `@theme` tokens in `globals.css` for site-wide color flip. Restructure hero component for massive typography + photo placeholder layout. Update nav to use SVG logo with wider layout. Fix hardcoded dark colors in OG route and Shiki theme.

**Tech Stack:** Next.js 16, Tailwind CSS 4, Sanity CMS, Shiki

**Spec:** `docs/superpowers/specs/2026-03-17-light-theme-redesign.md`

---

### Task 1: Theme Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update @theme tokens to light palette**

Replace all color tokens in `globals.css`:

```css
@theme {
  --color-bg: #ffffff;
  --color-surface: #f5f5f5;
  --color-border: #e5e5e5;
  --color-divider: #eeeeee;
  --color-text-primary: #111111;
  --color-text-secondary: #555555;
  --color-text-muted: #999999;
  --color-text-faint: #bbbbbb;
  --color-accent: #2563eb;
  --color-link: #555555;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
}
```

- [ ] **Step 2: Update body and ::selection styles**

```css
body {
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
}

/* Selection uses custom colors (not matching any token — intentionally neutral gray) */
::selection {
  background-color: #e0e0e0;
  color: #111111;
}
```

- [ ] **Step 3: Verify dev server renders white background**

Run: `npm run dev`
Open http://localhost:3000 — page should have white background with dark text.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: switch theme tokens from dark to light palette"
```

---

### Task 2: Copy Logo & Update Metadata

**Files:**
- Create: `public/logo.svg` (copy from `~/Downloads/logo.svg`)
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Copy logo SVG to public directory**

```bash
cp /Users/youngmincho/Downloads/logo.svg /Users/youngmincho/Project/chopaul/public/logo.svg
```

- [ ] **Step 2: Update layout.tsx metadata**

In `src/app/layout.tsx`, change:
- Title default: `"Youngmin Cho — Software Engineer"` → `"Youngmin Cho — Data Scientist"`
- Description: `"Software engineer building intelligent systems at the intersection of AI and finance."` → `"Data scientist building intelligent systems at the intersection of AI and finance."`

- [ ] **Step 3: Update page.tsx structured data**

In `src/app/page.tsx`, change `jobTitle: "Software Engineer"` → `jobTitle: "Data Scientist"`

- [ ] **Step 4: Commit**

```bash
git add public/logo.svg src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add logo SVG and update metadata to Data Scientist"
```

---

### Task 3: Redesign Navigation

**Files:**
- Modify: `src/components/nav.tsx`
- Modify: `src/components/mobile-menu.tsx`

- [ ] **Step 1: Update nav.tsx**

Replace the full `nav.tsx` content:

```tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MobileMenu } from "./mobile-menu";

const links = [
  { label: "Projects", home: "#projects", other: "/#projects" },
  { label: "Blog", home: "#blog", other: "/blog" },
  { label: "About", home: "#about", other: "/about" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center">
          <Image src="/logo.svg" alt="chopaul" width={28} height={28} />
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const href = isHome ? link.home : link.other;
            const isActive = isHome && activeSection === link.home.replace("#", "");
            return (
              <a
                key={link.label}
                href={href}
                className={`text-sm transition-colors ${
                  isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
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
```

Key changes:
- Remove `border-b border-border` from nav
- Max-width `720px` → `1200px`
- Height `h-14` → `h-16`
- Replace "CHOPAUL" text with `<Image src="/logo.svg">` at 28px
- Remove Resume from links array
- Active state uses `text-text-primary` instead of `text-accent`
- Link size `text-xs` → `text-sm`, gap `gap-6` → `gap-8`

- [ ] **Step 2: Update mobile-menu.tsx light theme**

In `src/components/mobile-menu.tsx`, change:
- `bg-bg` stays (now resolves to white)
- `border-border` stays (now resolves to #e5e5e5)

No code changes needed — tokens handle it. Verify visually.

- [ ] **Step 3: Verify nav renders with logo and light theme**

Open http://localhost:3000 — nav should show SVG logo, 3 links centered, no bottom border, white background.

- [ ] **Step 4: Commit**

```bash
git add src/components/nav.tsx
git commit -m "feat: redesign nav with logo SVG, wider layout, remove Resume link"
```

---

### Task 4: Redesign Hero Section

**Files:**
- Modify: `src/components/home/hero.tsx`

- [ ] **Step 1: Replace hero.tsx with new layout**

```tsx
export function Hero() {
  return (
    <section id="top" className="min-h-[80vh] flex items-end px-6 pb-16 pt-24">
      <div className="mx-auto max-w-[1200px] w-full flex justify-between items-end">
        <h1 className="text-text-primary font-normal leading-[0.9] tracking-tighter" style={{ fontSize: "clamp(80px, 12vw, 160px)" }}>
          Data<br />Scientist
        </h1>
        <div className="hidden md:block w-[320px] h-[400px] bg-surface rounded-2xl flex-shrink-0 mb-8" />
      </div>
    </section>
  );
}
```

Key changes:
- Remove `SectionLabel` import and usage
- Remove all props (`socialLinks`) — component becomes stateless
- Remove subtitle, description, CTA buttons
- Massive typography with `clamp(80px, 12vw, 160px)`
- Flex layout: text left, photo placeholder right
- `min-h-[80vh]` for viewport presence
- Photo placeholder: `320x400px`, `rounded-2xl`, `bg-surface`

- [ ] **Step 2: Update page.tsx to remove Hero props**

In `src/app/page.tsx`, change:
- `<Hero socialLinks={author?.socialLinks} />` → `<Hero />`

- [ ] **Step 3: Verify hero renders with massive typography**

Open http://localhost:3000 — should see large "Data Scientist" text with gray placeholder box on right.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/hero.tsx src/app/page.tsx
git commit -m "feat: redesign hero with oversized Data Scientist typography"
```

---

### Task 5: Update Footer Width

**Files:**
- Modify: `src/components/footer.tsx`

- [ ] **Step 1: Widen footer max-width**

In `src/components/footer.tsx`, change:
- `max-w-[720px]` → `max-w-[1200px]`

- [ ] **Step 2: Commit**

```bash
git add src/components/footer.tsx
git commit -m "feat: widen footer to 1200px to match nav"
```

---

### Task 6: Fix OG Image Route

**Files:**
- Modify: `src/app/og/route.tsx`

- [ ] **Step 1: Flip hardcoded colors to light**

In `src/app/og/route.tsx`, change:
- `backgroundColor: "#0a0a0a"` → `backgroundColor: "#ffffff"`
- `color: "#666"` → `color: "#999999"`
- `color: "#e5e5e5"` → `color: "#111111"`

- [ ] **Step 2: Commit**

```bash
git add src/app/og/route.tsx
git commit -m "fix: update OG image colors to match light theme"
```

---

### Task 7: Switch Shiki Theme

**Files:**
- Modify: `src/components/portable-text.tsx`

- [ ] **Step 1: Change Shiki theme**

In `src/components/portable-text.tsx`, change:
- `theme: "github-dark-default"` → `theme: "github-light"`

- [ ] **Step 2: Commit**

```bash
git add src/components/portable-text.tsx
git commit -m "fix: switch Shiki code theme to github-light"
```

---

### Task 8: Fix Accent References in Subpages

**Files:**
- Modify: `src/components/home/recent-writing.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/resume/page.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/app/error.tsx`

With accent now `#2563eb` (blue), interactive affordances like `text-accent`, `border-accent/30`, and `hover:bg-accent/5` work well on white backgrounds. Per spec, hover states in content lists should use `text-text-primary` instead of `text-accent` for a cleaner monochrome feel.

- [ ] **Step 1: Update recent-writing.tsx hover**

In `src/components/home/recent-writing.tsx` line 15, change:
- `group-hover:text-accent` → `group-hover:text-text-primary`

- [ ] **Step 2: Update blog/page.tsx hover**

In `src/app/blog/page.tsx` line 49, change:
- `group-hover:text-accent` → `group-hover:text-text-primary`

- [ ] **Step 3: Update resume/page.tsx hover**

In `src/app/resume/page.tsx` line 166, change:
- `group-hover:text-accent` → `group-hover:text-text-primary`

(Lines 63: `text-accent border border-accent/30` on the Download PDF button — keep as-is, blue accent button is a deliberate interactive affordance.)

- [ ] **Step 4: Verify not-found.tsx**

In `src/app/not-found.tsx` line 18: `text-accent hover:text-text-primary` — blue link, hover to black. Works. No change needed.

- [ ] **Step 5: Verify error.tsx**

In `src/app/error.tsx` line 19: `text-accent border border-accent/30 hover:bg-accent/5` — blue button with subtle border. Works on white. No change needed.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/recent-writing.tsx src/app/blog/page.tsx src/app/resume/page.tsx
git commit -m "fix: update hover states to text-primary for content lists"
```

- [ ] **Step 7: Visual verification**

Open these pages and confirm they look correct:
- http://localhost:3000/blog
- http://localhost:3000/resume
- 404 page (any invalid URL)

---

### Task 9: Final Visual Review

- [ ] **Step 1: Full-page walkthrough**

Check each page in the browser:
- `/` — hero with massive typography, light nav, content sections
- `/blog` — post list with light theme
- `/about` — bio, skills, now section
- `/resume` — experience, education, skills
- `/projects/[any-slug]` — project detail with light code blocks
- Any invalid URL — 404 page

- [ ] **Step 2: Mobile responsive check**

Resize browser to mobile width. Verify:
- Nav hamburger menu works with light theme
- Hero text scales down via `clamp()`
- Photo placeholder hides on mobile (`hidden md:block`)
- Content sections look good at narrow widths

- [ ] **Step 3: Final commit if any touch-ups needed**
