# Sharp Grid Redesign — chopaul.com

**Date**: 2026-03-23
**Status**: Approved
**Summary**: Full visual redesign of chopaul.com — swap Inter for Space Grotesk, refine the light theme into a precise "Sharp Grid" aesthetic, update hero copy, remove "Data Scientist" branding.

---

## Design Direction

**Vibe**: Technical / Crafted — Stripe-meets-Vercel precision on a light background.
**Key principle**: No accent color. Hierarchy comes entirely from font weight, size, and spacing. Thin hairline borders and monospace labels give the "systems" feel.

---

## Typography System

| Role | Font | Size | Weight | Tracking |
|------|------|------|--------|----------|
| Hero headline | Space Grotesk | `clamp(72px, 10vw, 140px)` | 700 | `-0.04em` |
| Section headings (h2) | Space Grotesk | 28px | 600 | `-0.02em` |
| Card titles (h3) | Space Grotesk | 16px | 500 | normal |
| Body text | Space Grotesk | 15px | 400 | normal |
| Section labels | Geist Mono | 11px | 400 | `3px` uppercase |
| Tags / metadata | Geist Mono | 11px | 400 | `1px` |

- Space Grotesk is the sole sans-serif (replaces Inter for both headings and body)
- Geist Mono stays for labels, code, and metadata
- Available via `next/font/google` as `Space_Grotesk`

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#fafafa` | Page background |
| `--color-surface` | `#f0f0f0` | Cards, elevated areas |
| `--color-border` | `#e0e0e0` | Hairline borders (1px) |
| `--color-divider` | `#ebebeb` | Section separators |
| `--color-text-primary` | `#111111` | Headings, hero |
| `--color-text-secondary` | `#444444` | Body text |
| `--color-text-muted` | `#888888` | Labels, metadata |
| `--color-text-faint` | `#bbbbbb` | Timestamps, tertiary |
| `--color-link` | `#111111` | Links (black + faint underline) |

- No accent color — `--color-accent` removed from tokens
- All existing `text-accent` / `border-accent` / `bg-accent` usages must be replaced with appropriate alternatives (see Accent Migration below)
- `::selection`: `background: #d8d8d8; color: #111111`

### Accent Migration

All files currently using accent color tokens need updating:

| File | Current Usage | Replacement |
|------|--------------|-------------|
| `src/components/home/featured-project.tsx` | `text-accent` on hostname label | `text-text-muted font-mono` |
| `src/app/not-found.tsx` | `text-accent` on "Back to home" link | `text-text-primary border-b border-text-faint hover:border-text-primary` |
| `src/app/error.tsx` | `text-accent`, `border-accent/30`, `bg-accent/5` on button | `text-text-primary border border-border hover:bg-surface` |
| `src/app/resume/page.tsx` | Same accent pattern on "Download PDF" button | `text-text-primary border border-border hover:bg-surface` |
| `src/app/projects/[slug]/page.tsx` | `text-accent` on "Live Site" and "GitHub" links | `text-text-primary border-b border-text-faint hover:border-text-primary` |

---

## Layout & Spacing

- **Content max-width**: `720px` (body sections)
- **Hero max-width**: `1200px` (matches nav width for alignment)
- **Section padding**: `py-20` (increased from `py-16`)
- **Section dividers**: `1px border-divider`
- **Nav height**: `h-14` (tightened from `h-16`)
- **Content padding**: `px-6` (unchanged)

---

## Component Changes

### Hero (`src/components/home/hero.tsx`)
- Headline: **"Building tools that think."** at `clamp(72px, 10vw, 140px)`, `font-bold`, `tracking-tighter`
- Remove "Data Scientist" entirely
- Below headline: "Youngmin Cho" in Geist Mono, 13px, `text-muted` — name is secondary to the statement
- Keep placeholder image block on right, style with `bg-surface border border-border`

### Nav (`src/components/nav.tsx`)
- Height: `h-14`
- Inherits new font automatically (Space Grotesk via CSS variable)
- No other structural changes

### Section Labels (`src/components/section-label.tsx`)
- No changes needed — already monospace uppercase, fits the aesthetic

### Featured Project (`src/components/home/featured-project.tsx`)
- Card: `bg-surface border border-border`
- Remove duplicate description (currently displayed twice)
- Tech tags: `border border-border`, Geist Mono, `text-[11px]`

### Recent Writing (`src/components/home/recent-writing.tsx`)
- Post titles: 15px, `font-medium`, `text-primary`
- Dates: Geist Mono, `text-faint`
- Hover: title shifts to `text-secondary`

### About Snippet (`src/components/home/about-snippet.tsx`)
- Update section padding from `py-16` to `py-20`

### Footer (`src/components/footer.tsx`)
- Inherits new fonts and spacing, no structural changes

### Links (global pattern)
- Style: `text-primary` with `border-b border-text-faint`
- Hover: `border-text-primary` (border darkens, no color change)

---

## Global CSS Changes (`src/app/globals.css`)

- Update `--font-sans` to `"Space Grotesk"` fallback chain
- Update all color tokens to new palette values
- Remove `--color-accent`
- Update `::selection` colors

## Layout Changes (`src/app/layout.tsx`)

- Replace `Inter` import with `Space_Grotesk` from `next/font/google`
- Update font variable assignment
- Update metadata:
  - Title: `"Youngmin Cho"` (remove "— Data Scientist")
  - Description: `"Building tools that think — portfolio and writing by Youngmin Cho."` (replaces current "Data scientist building intelligent systems..." text)

## Page Changes (`src/app/page.tsx`)

- Remove `jobTitle: "Data Scientist"` from Schema.org JSON-LD

## About Page (`src/app/about/page.tsx`)

- Inherits new typography, no structural changes needed

---

## Files to Modify

1. `src/app/globals.css` — color tokens, font variable, selection, remove accent
2. `src/app/layout.tsx` — font import, metadata (title + description)
3. `src/app/page.tsx` — remove jobTitle from JSON-LD
4. `src/components/home/hero.tsx` — new headline, subtitle, styling
5. `src/components/home/featured-project.tsx` — remove duplicate description, update card style, replace `text-accent`
6. `src/components/home/recent-writing.tsx` — update hover behavior, section padding
7. `src/components/home/about-snippet.tsx` — section padding `py-16` → `py-20`
8. `src/components/nav.tsx` — height adjustment
9. `src/app/not-found.tsx` — replace `text-accent` on link
10. `src/app/error.tsx` — replace accent colors on button
11. `src/app/resume/page.tsx` — replace accent colors on button
12. `src/app/projects/[slug]/page.tsx` — replace accent colors on links

## Files Unchanged

- `src/components/section-label.tsx` — already fits
- `src/components/footer.tsx` — inherits font/color changes
- `src/components/mobile-menu.tsx` — inherits token changes
