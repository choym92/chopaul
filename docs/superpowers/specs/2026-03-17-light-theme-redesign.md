# Light Theme Full Redesign — chopaul.com

**Date**: 2026-03-17
**Status**: Approved

## Overview

Full redesign of chopaul.com from dark minimal theme to a light, typography-forward design inspired by the Duwy reference. The hero section features oversized "Data Scientist" typography with a photo placement. All pages adopt the new light color palette.

## Reference

Duwy-style landing: white background, massive serif-less typography, rounded-corner photo on the right, minimal navigation.

## Design Decisions

### Theme Tokens (globals.css)

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#f5f5f5` | Cards, elevated surfaces |
| `--color-border` | `#e5e5e5` | Card borders |
| `--color-divider` | `#eeeeee` | Section dividers |
| `--color-text-primary` | `#111111` | Headings |
| `--color-text-secondary` | `#555555` | Body text |
| `--color-text-muted` | `#999999` | Labels, low-priority |
| `--color-text-faint` | `#bbbbbb` | Dates, subtle elements |
| `--color-accent` | `#2563eb` | Highlights, active states (blue for visibility on white) |
| `--color-link` | `#555555` | Links |

Selection: `#e0e0e0` background, `#111111` text.

### Navigation

- **Logo**: `logo.svg` (copied to `public/logo.svg`), displayed at ~28px height
- **Links**: Projects, Blog, About — centered, Inter 14px
- **No Sign In button**
- **No bottom border** — clean float
- **Max-width**: 1200px (expanded from 720px)
- **Background**: white, semi-transparent backdrop blur kept for scroll
- Remove Resume from nav links

### Hero Section

- **Height**: min-h-[80vh], flex layout
- **Left side**: "Data" + "Scientist" — two lines, Inter 400 weight, ~clamp(80px, 12vw, 160px), tracking-tighter, color text-primary
- **Right side upper**: Rounded-corner (16px) photo placeholder — ~320x400px, bg-surface as placeholder
- **No subtitle, no CTA buttons, no bio text**
- **Max-width**: 1200px

### Featured Project Section

- Same component structure
- Colors flip to light palette via token changes
- Card: bg-surface (#f5f5f5), border-border (#e5e5e5)
- Max-width stays 720px (content sections remain narrow)

### Recent Writing Section

- Same structure, light colors
- Hover: text-primary instead of accent

### About Section

- Same structure, light colors

### Footer

- Light border-divider, light text colors
- Max-width expanded to 1200px to match nav

### Subpages (About, Blog, Projects detail)

- Inherit from globals.css token changes automatically
- `src/app/blog/page.tsx` — fix `hover:text-accent` on post titles
- `src/app/resume/page.tsx` — fix `hover:text-accent` + `border-accent/30` on buttons
- `src/app/not-found.tsx` — fix `text-accent` link
- `src/app/error.tsx` — fix `text-accent` + `border-accent/30` button

### OG Image Route

- `src/app/og/route.tsx` has hardcoded dark colors (inline styles, not Tailwind tokens)
- Must manually flip: white background, `#111111` text

### Code Syntax Highlighting

- `src/components/portable-text.tsx` uses Shiki theme `"github-dark-default"`
- Switch to `"github-light"` to match new light palette

### Section Labels

- `src/components/section-label.tsx` uses `font-mono` — keep monospace for contrast with the sans-serif body

## Files to Modify

1. `src/app/globals.css` — theme tokens, body styles, selection colors
2. `public/logo.svg` — copy logo file
3. `src/components/nav.tsx` — logo.svg image, centered links, remove Resume link, widen max-width, remove bottom border
4. `src/components/mobile-menu.tsx` — light theme bg
5. `src/components/home/hero.tsx` — massive typography layout, photo placeholder, remove CTA buttons
6. `src/components/home/featured-project.tsx` — no structural changes (tokens handle it)
7. `src/components/home/recent-writing.tsx` — hover color change (accent → text-primary)
8. `src/components/home/about-snippet.tsx` — no changes needed
9. `src/components/footer.tsx` — widen max-width to 1200px
10. `src/app/layout.tsx` — update metadata title/description to "Data Scientist"
11. `src/app/page.tsx` — update structured data jobTitle to "Data Scientist"
12. `src/app/og/route.tsx` — flip hardcoded dark colors to light
13. `src/components/portable-text.tsx` — switch Shiki theme to `"github-light"`
14. `src/app/blog/page.tsx` — fix accent hover colors
15. `src/app/resume/page.tsx` — fix accent hover/border colors
16. `src/app/not-found.tsx` — fix accent link color
17. `src/app/error.tsx` — fix accent button colors

## Out of Scope

- Animation/motion
- New pages or routes
- Sanity schema changes
- Photo upload (user will add later)
