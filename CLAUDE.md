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

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
