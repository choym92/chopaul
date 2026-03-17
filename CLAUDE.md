# CLAUDE.md — chopaul.com

## Project Overview

Personal portfolio and blog site for Youngmin Cho at chopaul.com (www.chopaul.com).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **CMS**: Sanity v5 (embedded Studio at /studio)
- **Rendering**: Portable Text with Shiki syntax highlighting (github-dark-default)
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Directory Structure

```
src/
├── app/                    # App Router pages & routes
│   ├── page.tsx            # Home (hero, featured project, recent writing, about snippet)
│   ├── layout.tsx          # Root layout (Inter + Geist Mono fonts, analytics)
│   ├── globals.css         # CSS variables & Tailwind theme
│   ├── blog/               # Blog listing + [slug] detail
│   ├── projects/[slug]/    # Project case studies
│   ├── about/              # Bio, skills, "now" section
│   ├── resume/             # Experience, education, skills
│   ├── studio/[[...tool]]/ # Sanity Studio embed
│   ├── api/revalidate/     # ISR revalidation endpoint
│   ├── og/                 # Dynamic OG image generation (edge)
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── robots.ts           # robots.txt
│   ├── not-found.tsx       # 404 page
│   └── error.tsx           # Error boundary
├── components/             # React components
│   ├── nav.tsx             # Navigation with intersection observer
│   ├── mobile-menu.tsx     # Mobile nav menu
│   ├── footer.tsx          # Footer with social links
│   ├── section-label.tsx   # Section heading component
│   ├── portable-text.tsx   # Rich text renderer with code highlighting
│   └── home/               # Home page section components
└── lib/
    ├── utils.ts            # Helpers (date formatting, reading time)
    └── sanity/
        ├── client.ts       # Sanity client & fetch wrapper
        ├── queries.ts      # All GROQ queries (centralized)
        └── image.ts        # Image URL builder

sanity/
├── sanity.config.ts        # Sanity configuration
├── sanity.cli.ts           # Sanity CLI config
├── schemas/                # Content schemas (post, project, author, resume, block-content)
└── lib/structure.ts        # Studio navigation structure
```

## Conventions

- **File naming**: kebab-case (e.g., `mobile-menu.tsx`, `featured-project.tsx`)
- **Components**: PascalCase exports, server components by default, `"use client"` only when needed
- **Functions/variables**: camelCase
- **Path alias**: `@/*` → `src/*`
- **Styling**: Utility-first Tailwind, no CSS modules. Dark theme with gold accent (#d4a843)
- **Data fetching**: GROQ queries centralized in `src/lib/sanity/queries.ts`, fetched via wrapper in `client.ts`
- **Caching**: ISR with 3600s default, tag-based revalidation via `/api/revalidate`

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SITE_URL
REVALIDATION_SECRET
```

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Design System

- **Background**: #0a0a0a / Surface: #111111
- **Text**: primary #ffffff, secondary #999999, muted #555555
- **Accent**: #d4a843 (gold)
- **Fonts**: Inter (sans), Geist Mono (code)
- **Responsive**: mobile-first, `md:` breakpoint for tablet/desktop

## Sanity Schemas

- **post**: title, slug, excerpt, body, publishedAt, tags, image
- **project**: title, slug, featured, description, body, techStack, links, image, order
- **author**: name, title, bio, fullBio, image, socialLinks, skills, nowContent, resumePdf
- **resume**: experience[], education[], skills[], projects (references)
- **block-content**: h2/h3/normal/blockquote, bold/italic/code/link marks, image/code/callout types
