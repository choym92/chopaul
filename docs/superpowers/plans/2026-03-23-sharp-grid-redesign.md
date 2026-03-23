# Sharp Grid Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign chopaul.com with Space Grotesk font, refined light color palette, new hero copy, and removal of all accent colors and "Data Scientist" branding.

**Architecture:** Pure CSS/component update — no new dependencies beyond `Space_Grotesk` from `next/font/google`. Changes flow from global tokens (CSS + layout) outward to components. No structural or data-fetching changes.

**Tech Stack:** Next.js 16, Tailwind CSS 4, `next/font/google` (Space_Grotesk)

**Spec:** `docs/superpowers/specs/2026-03-23-sharp-grid-redesign.md`

---

### Task 1: Global Foundation — Font + Colors

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update globals.css — replace all color tokens and font**

Replace the entire `@theme` block and `::selection` in `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #fafafa;
  --color-surface: #f0f0f0;
  --color-border: #e0e0e0;
  --color-divider: #ebebeb;
  --color-text-primary: #111111;
  --color-text-secondary: #444444;
  --color-text-muted: #888888;
  --color-text-faint: #bbbbbb;
  --color-accent: #111111; /* deprecated — kept temporarily until accent migration in Task 5 */
  --color-link: #111111;

  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
}

::selection {
  background-color: #d8d8d8;
  color: #111111;
}
```

Key changes: updated all color values, swapped font-sans to Space Grotesk. `--color-accent` is kept temporarily as `#111111` (alias for primary) to avoid breaking pages until Task 5 migrates all accent usages.

- [ ] **Step 2: Update layout.tsx — swap Inter for Space_Grotesk, update metadata**

In `src/app/layout.tsx`:
- Replace `import { Inter } from "next/font/google"` with `import { Space_Grotesk } from "next/font/google"`
- Replace `const inter = Inter({...})` with `const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" })`
- Update the `<html>` className from `inter.variable` to `spaceGrotesk.variable`
- Update metadata title from `"Youngmin Cho — Data Scientist"` to `"Youngmin Cho"`
- Update metadata description to `"Building tools that think — portfolio and writing by Youngmin Cho."`

- [ ] **Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Site loads with Space Grotesk font, new background color `#fafafa`, no build errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: swap Inter for Space Grotesk, update color tokens and metadata"
```

---

### Task 2: Hero Redesign

**Files:**
- Modify: `src/components/home/hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite hero.tsx**

Replace the entire content of `src/components/home/hero.tsx`:

```tsx
export function Hero() {
  return (
    <section id="top" className="min-h-[80vh] flex items-end px-6 pb-16 pt-24">
      <div className="mx-auto max-w-[1200px] w-full flex justify-between items-end">
        <div>
          <h1
            className="text-text-primary font-bold leading-[0.9] tracking-tighter"
            style={{ fontSize: "clamp(72px, 10vw, 140px)" }}
          >
            Building<br />tools that<br />think.
          </h1>
          <p className="font-mono text-[13px] text-text-muted mt-6">
            Youngmin Cho
          </p>
        </div>
        <div className="hidden md:block w-[320px] h-[400px] bg-surface border border-border rounded-2xl flex-shrink-0 mb-8" />
      </div>
    </section>
  );
}
```

Key changes: new headline text, `font-bold`, reduced clamp sizes, monospace name subtitle, image placeholder gets border.

- [ ] **Step 2: Remove jobTitle from JSON-LD in page.tsx**

In `src/app/page.tsx`, remove the `jobTitle: "Data Scientist",` line from the Schema.org JSON-LD script.

- [ ] **Step 3: Verify hero renders correctly**

Run: `npm run dev`, check homepage.
Expected: "Building tools that think." headline in bold Space Grotesk, "Youngmin Cho" in monospace below, no "Data Scientist" anywhere.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/hero.tsx src/app/page.tsx
git commit -m "feat: redesign hero with new headline, remove Data Scientist branding"
```

---

### Task 3: Home Page Sections — Spacing + Component Updates

**Files:**
- Modify: `src/components/home/featured-project.tsx`
- Modify: `src/components/home/recent-writing.tsx`
- Modify: `src/components/home/about-snippet.tsx`

- [ ] **Step 1: Update featured-project.tsx**

Replace the full return JSX in `src/components/home/featured-project.tsx`:

```tsx
return (
    <section id="projects" className="py-20 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Featured Project</SectionLabel>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-surface rounded-lg p-6 border border-border">
              <div className="text-text-muted text-[11px] tracking-[2px] font-mono mb-3">
                {project.links?.live ? new URL(project.links.live).hostname.toUpperCase() : project.title.toUpperCase()}
              </div>
              {project.techStack && (
                <div className="flex gap-1.5 flex-wrap">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-text-faint text-[10px] font-mono border border-border px-2 py-0.5 rounded">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary text-sm font-medium mb-2">{project.title}</h3>
            <p className="text-text-muted text-[13px] leading-relaxed mb-4">{project.description}</p>
            <a href={`/projects/${project.slug.current}`} className="text-text-primary text-xs border-b border-text-faint hover:border-text-primary transition-colors">
              Read case study &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
```

Changes from current: `py-16` → `py-20`, `text-accent` → `text-text-muted` on hostname, removed duplicate description from card, added `font-mono` to tech tags, updated link to new pattern.

- [ ] **Step 2: Update recent-writing.tsx**

In `src/components/home/recent-writing.tsx`:

1. Change section padding from `py-16` to `py-20`
2. Update post title classes: change `text-sm` to `text-[15px] font-medium`
3. Add `font-mono` to date display
4. Update hover: change `group-hover:text-text-primary` to `group-hover:text-text-secondary`
5. Update "All posts" link: change to `text-text-primary text-xs border-b border-text-faint hover:border-text-primary transition-colors`

- [ ] **Step 3: Update about-snippet.tsx**

In `src/components/home/about-snippet.tsx`:

1. Change section `py-16` → `py-20`
2. On both links (lines 10-11), make two class changes each:
   - Change `text-text-muted` → `text-text-primary`
   - Change `hover:text-text-primary` → `hover:border-text-primary`

   Final link class: `text-text-primary text-xs border-b border-text-faint hover:border-text-primary transition-colors`

- [ ] **Step 4: Verify home sections**

Run: `npm run dev`, scroll through homepage.
Expected: Increased section spacing, no accent colors, monospace dates and tags, clean link styling.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/featured-project.tsx src/components/home/recent-writing.tsx src/components/home/about-snippet.tsx
git commit -m "feat: update home sections with Sharp Grid spacing and styling"
```

---

### Task 4: Nav Height

**Files:**
- Modify: `src/components/nav.tsx`

- [ ] **Step 1: Update nav height**

In `src/components/nav.tsx`, change `h-16` to `h-14` on the inner div (line 39).

- [ ] **Step 2: Verify nav**

Run: `npm run dev`
Expected: Slightly tighter nav bar, no layout breakage.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav.tsx
git commit -m "feat: tighten nav height to h-14"
```

---

### Task 5: Accent Color Migration — Error, Not Found, Resume, Project Pages

**Files:**
- Modify: `src/app/not-found.tsx`
- Modify: `src/app/error.tsx`
- Modify: `src/app/resume/page.tsx`
- Modify: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Update not-found.tsx**

Change the link class on line 18 from:
```
text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-2
```
to:
```
text-xs text-text-primary border-b border-text-faint hover:border-text-primary transition-colors
```

- [ ] **Step 2: Update error.tsx**

Change the button class on line 19 from:
```
text-xs text-accent border border-accent/30 rounded px-3 py-1.5 hover:bg-accent/5 transition-colors
```
to:
```
text-xs text-text-primary border border-border rounded px-3 py-1.5 hover:bg-surface transition-colors
```

- [ ] **Step 3: Update resume/page.tsx**

Change the "Download PDF" link class on line 63 from:
```
text-xs text-accent border border-accent/30 rounded px-3 py-1.5 hover:bg-accent/5 transition-colors
```
to:
```
text-xs text-text-primary border border-border rounded px-3 py-1.5 hover:bg-surface transition-colors
```

- [ ] **Step 4: Update projects/[slug]/page.tsx**

Change both link classes (lines 108 and 118) from:
```
text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-2
```
to:
```
text-xs text-text-primary border-b border-text-faint hover:border-text-primary transition-colors
```

- [ ] **Step 5: Remove deprecated accent token from globals.css**

In `src/app/globals.css`, delete the line:
```css
  --color-accent: #111111; /* deprecated — kept temporarily until accent migration in Task 5 */
```

All accent usages are now migrated, so this token is safe to remove.

- [ ] **Step 6: Verify all migrated pages**

Run: `npm run dev`, visit /resume, /projects/[any-slug], trigger 404.
Expected: No broken accent colors, all links and buttons use the new black + border pattern.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/not-found.tsx src/app/error.tsx src/app/resume/page.tsx src/app/projects/[slug]/page.tsx
git commit -m "feat: migrate accent colors to Sharp Grid link/button pattern"
```

---

### Task 6: Final Build Verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors or warnings about missing CSS tokens.

- [ ] **Step 2: Visual spot-check**

Run: `npm run start`, check:
- Homepage hero, sections, footer
- /about page
- /resume page
- /blog page
- Any /projects/[slug] page
- 404 page (visit /nonexistent)

Expected: Consistent Space Grotesk typography, `#fafafa` background, no blue accent colors anywhere, all links use black + border pattern.

- [ ] **Step 3: Commit if any fixes needed**

Only if fixes were needed in step 2.
