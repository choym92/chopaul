# chopaul.com — Personal Website Design Spec

## Purpose

A personal website for Youngmin Cho at chopaul.com targeting potential employers and recruiters. Combines portfolio showcase, technical blog, and professional hub into a single, polished presence.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Styling | Tailwind CSS 4 |
| CMS | Sanity v3 |
| Deployment | Vercel |
| Domain | chopaul.com |
| Analytics | Vercel Analytics |

## Visual Direction

Minimal Dark — inspired by Vercel, Linear, and Raycast aesthetics. Clean, developer-focused, technically sophisticated.

### Palette

| Token | Value | Usage |
|---|---|---|
| `bg` | `#0a0a0a` | Page background |
| `surface` | `#111111` | Cards, elevated surfaces |
| `border` | `#1a1a1a` | Card borders, dividers |
| `divider` | `#141414` | Section dividers |
| `text-primary` | `#ffffff` | Headings, primary text |
| `text-secondary` | `#999999` | Body text, descriptions |
| `text-muted` | `#555555` | Labels, secondary info |
| `text-faint` | `#333333` | Dates, low-priority text |
| `accent` | `#d4a843` | Gold — project cards, active nav indicator, CTA hover |
| `link` | `#888888` | Links (hover → `#ffffff`) |

### Typography

- **Headings**: Inter, weight 300 (light)
- **Body**: Inter, weight 400
- **Monospace labels**: Geist Mono — uppercase, letter-spaced section headers ("SOFTWARE ENGINEER", "FEATURED PROJECT")

### Spacing & Layout

- Max content width: ~720px
- Section vertical padding: 64–80px
- Section dividers: `1px solid #141414`
- Card border-radius: 8px, border `1px solid #1a1a1a`

### Interactions

- Smooth scroll between anchor sections
- Intersection observer for active nav highlighting
- Subtle hover states (opacity/color shift)
- No scroll-triggered animations — content is static and fast

### Responsive

- Mobile-first, single column below 768px
- Featured project card stacks vertically on mobile
- Nav collapses to hamburger on mobile

## Site Structure

### Layout Approach

Single-page scroll for the home page. Recruiter gets the full story — statement, proof, thinking, background — in one continuous scroll. Detail pages for deep content.

### Routes

```
/                     → Single-page home (5 sections)
/projects/[slug]      → Project case study detail
/blog                 → Blog listing (all posts)
/blog/[slug]          → Individual blog post
/about                → Full bio + Now section
/resume               → Web resume + downloadable PDF
/studio               → Sanity Studio (auth-protected)
```

### Home Page Sections

1. **Hero** (`#top`)
   - Uppercase monospace label: "SOFTWARE ENGINEER"
   - Tagline: "I build intelligent systems at the intersection of AI and finance."
   - One-liner description
   - CTA buttons: View Projects ↓, GitHub →, LinkedIn →

2. **Featured Project** (`#projects`)
   - Shows the single project where `featured == true` (if multiple, show first by `order`). Currently: araverus only.
   - Araverus card with preview, description, tech stack pills
   - Alongside: project summary text with "Read case study →" link
   - Two-column layout (stacks on mobile)

3. **Recent Writing** (`#blog`)
   - 3 most recent posts: title, excerpt, date
   - Each row separated by subtle divider
   - "All posts →" link at bottom

4. **About** (`#about`)
   - Short bio paragraph pulled from Sanity `author` singleton
   - Links to full bio and downloadable resume

5. **Footer**
   - Copyright, social links (GitHub, LinkedIn, Email)

### Nav

- Fixed top bar
- Left: "CHOPAUL" wordmark
- Right: Projects, Blog, About, Resume
- **On home page**: Projects, Blog, About scroll to anchors (`#projects`, `#blog`, `#about`). Resume links to `/resume`.
- **On other pages**: Projects links to `/#projects`, Blog links to `/blog`, About links to `/about`, Resume links to `/resume`.
- Active section highlighted on scroll via intersection observer (home page only)
- Hamburger menu on mobile

### Project Detail (`/projects/[slug]`)

Full case study page for araverus (and future projects):
- Problem statement
- Architecture overview
- Key features with screenshots
- Technical highlights ($11/month infra, 9-phase pipeline, bilingual TTS)
- Links to live site and GitHub

### Blog Listing (`/blog`)

Chronological list of all posts. Same visual style as the home blog section but complete. Tags displayed per post.

### Blog Post (`/blog/[slug]`)

- Sanity Portable Text rendered with custom components:
  - **Code blocks**: Shiki for syntax highlighting (dark theme matching site palette)
  - **Callouts**: styled info/warning/tip blocks
  - **Images**: Sanity image CDN with Next.js `<Image>`
- Minimal layout — content-focused
- Post metadata: title, date, tags, reading time (computed: word count / 200 wpm, not stored)

### About (`/about`)

- Full bio from Sanity `author.fullBio` (Portable Text)
- Skills section pulled from Sanity `author.skills` (structured by category)
- "Now" section pulled from Sanity `author.nowContent` — what you're currently working on, with last-updated date

### Resume (`/resume`)

- Web-rendered resume: experience, education, skills, projects
- Download PDF button (file from Sanity `author.resumePdf`)
- All content editable from Sanity Studio

## Sanity CMS Schema

### `project`

| Field | Type | Description |
|---|---|---|
| `title` | string | Project name |
| `slug` | slug | URL path |
| `featured` | boolean | Show on home page |
| `description` | text | Short summary for cards |
| `body` | Portable Text | Full case study (code, callouts, images) |
| `techStack` | array of strings | Tech pills on cards |
| `links` | object | `{ live: url, github: url }` |
| `image` | image | Hero/preview screenshot |
| `order` | number | Sort order |

### `post`

| Field | Type | Description |
|---|---|---|
| `title` | string | Post title |
| `slug` | slug | URL path |
| `excerpt` | text | Summary for cards and SEO |
| `body` | Portable Text | Full post content |
| `publishedAt` | datetime | Publication date |
| `tags` | array of strings | Post tags |
| `image` | image | Optional cover image |

### `author` (singleton)

| Field | Type | Description |
|---|---|---|
| `name` | string | Full name |
| `title` | string | "Software Engineer" |
| `bio` | text | Short version for home page |
| `fullBio` | Portable Text | Full version for /about |
| `image` | image | Headshot |
| `socialLinks` | object | `{ github, linkedin, email }` |
| `skills` | array of objects | `[{ category: string, items: string[] }]` e.g. `{ category: "Languages", items: ["TypeScript", "Python"] }` |
| `nowContent` | Portable Text | What you're currently working on |
| `nowUpdatedAt` | datetime | Last updated for Now section |
| `resumePdf` | file | Downloadable resume |

### `resume` (singleton)

| Field | Type | Description |
|---|---|---|
| `experience` | array of objects | `[{ company, role, startDate, endDate?, description (Portable Text), current: boolean }]` |
| `education` | array of objects | `[{ institution, degree, field, startDate, endDate }]` |
| `skills` | array of objects | `[{ category, items: string[] }]` — mirrors author.skills or can differ |
| `projects` | array of references | References to `project` documents |

### Sanity Studio

- Hosted at `/studio` route (`/app/studio/[[...tool]]/page.tsx`)
- Protected by Sanity's built-in authentication
- No public access

## SEO & Performance

### SEO

- Dynamic `<meta>` tags via Next.js `generateMetadata` per route
- Open Graph images: static default for home; detail pages use Sanity `image` field if set, otherwise auto-generated via `next/og` (`ImageResponse`) with title on dark background
- Dynamic `sitemap.xml` — all blog posts and project pages
- `robots.txt` — standard allow-all
- JSON-LD structured data: `Person` on home, `Article` on blog posts
- Canonical URLs on all pages

### Performance

- Server Components by default — Sanity data fetched server-side
- ISR for blog and project pages:
  - Default `revalidate: 3600` (1 hour) as fallback
  - On-demand revalidation via `/api/revalidate` route (POST, shared secret in `REVALIDATION_SECRET` env var)
  - Sanity webhook calls `/api/revalidate` on publish — uses `revalidateTag` with tags like `post`, `project`, `author`
  - Each GROQ fetch tagged for granular invalidation
- Sanity CDN for all reads
- Image optimization: Next.js `<Image>` + Sanity image CDN
- Minimal client JS — no animation libraries
- Target: Lighthouse 95+ all categories

### Analytics

- Vercel Analytics (zero-config)
- No Google Analytics

## Error States

- Custom `not-found.tsx` — styled to match dark theme, "Page not found" message with link back to home
- Custom `error.tsx` — generic error boundary, same dark styling
- 404s for invalid `/blog/[slug]` or `/projects/[slug]` return the custom not-found page

## Draft Preview

- Out of scope for v1. Content goes live on publish. Draft preview via Sanity Presentation tool can be added later.

## Tailwind CSS 4 Notes

- Uses CSS-first configuration via `@theme` directive in `globals.css` (not `tailwind.config.js`)
- All custom color tokens (`bg`, `surface`, `border`, `text-*`, `accent`) defined as CSS custom properties under `@theme`

## Key GROQ Queries

```groq
// Home — featured project
*[_type == "project" && featured == true] | order(order asc)[0]

// Home — recent posts
*[_type == "post"] | order(publishedAt desc)[0...3] { title, slug, excerpt, publishedAt }

// Home — author bio
*[_type == "author"][0] { bio, socialLinks }

// Blog listing
*[_type == "post"] | order(publishedAt desc) { title, slug, excerpt, publishedAt, tags }

// Blog post detail
*[_type == "post" && slug.current == $slug][0]

// Project detail
*[_type == "project" && slug.current == $slug][0]

// About page
*[_type == "author"][0] { fullBio, skills, nowContent, nowUpdatedAt, image }

// Resume page
*[_type == "resume"][0] { experience, education, skills, projects[]-> { title, slug, description } }
```

## What This Site Does NOT Include

- Newsletter or email capture
- Uses/Stack page
- Google Analytics
- Scroll-triggered animations or heavy JS libraries
- araverus blog content (araverus stays independent)
