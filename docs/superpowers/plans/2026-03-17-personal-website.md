# chopaul.com Personal Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal-dark personal website at chopaul.com with portfolio, blog, and professional hub powered by Sanity CMS.

**Architecture:** Next.js 15 App Router with Server Components fetching content from Sanity v3 CMS. Single-page scroll home with detail pages for blog posts, project case studies, about, and resume. Tailwind CSS 4 for styling with CSS-first `@theme` configuration. ISR with Sanity webhook revalidation.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, Sanity v3, next-sanity, @sanity/image-url, Shiki, Vercel Analytics, TypeScript 5

**Spec:** `docs/superpowers/specs/2026-03-17-personal-website-design.md`

---

## File Structure

```
chopaul/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (fonts, analytics, metadata)
│   │   ├── page.tsx                      # Home — single-page scroll
│   │   ├── globals.css                   # Tailwind @theme tokens, base styles
│   │   ├── not-found.tsx                 # Custom 404
│   │   ├── error.tsx                     # Custom error boundary
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Project case study detail
│   │   ├── blog/
│   │   │   ├── page.tsx                  # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Blog post detail
│   │   ├── about/
│   │   │   └── page.tsx                  # Full bio + Now
│   │   ├── resume/
│   │   │   └── page.tsx                  # Web resume + PDF download
│   │   ├── studio/
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx              # Sanity Studio
│   │   ├── api/
│   │   │   └── revalidate/
│   │   │       └── route.ts              # Webhook revalidation endpoint
│   │   ├── sitemap.ts                    # Dynamic sitemap
│   │   ├── robots.ts                     # Robots.txt
│   │   └── og/
│   │       └── route.tsx                 # Dynamic OG image generation
│   ├── components/
│   │   ├── nav.tsx                       # Fixed nav bar
│   │   ├── footer.tsx                    # Site footer
│   │   ├── section-label.tsx             # Reusable uppercase monospace label
│   │   ├── home/
│   │   │   ├── hero.tsx                  # Hero section
│   │   │   ├── featured-project.tsx      # Featured project section
│   │   │   ├── recent-writing.tsx        # Recent blog posts section
│   │   │   └── about-snippet.tsx         # About teaser section
│   │   ├── portable-text.tsx             # Portable Text renderer (code, callouts, images)
│   │   └── mobile-menu.tsx              # Hamburger menu overlay
│   └── lib/
│       ├── sanity/
│       │   ├── client.ts                 # Sanity client + fetch helper with tags
│       │   ├── image.ts                  # Image URL builder
│       │   └── queries.ts               # All GROQ queries
│       └── utils.ts                      # Reading time, date formatting
├── sanity/
│   ├── sanity.config.ts                  # Sanity Studio config
│   ├── sanity.cli.ts                     # Sanity CLI config
│   ├── schemas/
│   │   ├── index.ts                      # Schema registry
│   │   ├── project.ts                    # Project schema
│   │   ├── post.ts                       # Post schema
│   │   ├── author.ts                     # Author singleton schema
│   │   └── resume.ts                     # Resume singleton schema
│   └── lib/
│       └── structure.ts                  # Desk structure (singleton handling)
├── public/
│   └── og-default.png                    # Default OG image
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── .env.local.example                    # Env var template
├── .gitignore
└── .claude/                              # Ported from araverus (adapted)
    ├── settings.json
    └── settings.local.json
```

---

## Task 1: Project Scaffolding & Git Init

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `.env.local.example`

- [ ] **Step 1: Initialize git repo and connect to GitHub**

```bash
cd /Users/youngmincho/Project/chopaul
git init
git remote add origin https://github.com/choym92/chopaul.git
```

- [ ] **Step 2: Create Next.js 15 project**

```bash
cd /Users/youngmincho/Project/chopaul
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select: Yes to all defaults. This scaffolds `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`.

- [ ] **Step 3: Install dependencies**

```bash
npm install next-sanity @sanity/image-url @sanity/vision sanity @portabletext/react shiki @vercel/analytics
npm install -D @sanity/types
```

- [ ] **Step 4: Create `.env.local.example`**

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Revalidation
REVALIDATION_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` — should see default Next.js page.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js 15 project with dependencies"
```

---

## Task 2: Tailwind CSS 4 Theme & Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Configure Tailwind theme tokens in `globals.css`**

Replace the contents of `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-border: #1a1a1a;
  --color-divider: #141414;
  --color-text-primary: #ffffff;
  --color-text-secondary: #999999;
  --color-text-muted: #555555;
  --color-text-faint: #333333;
  --color-accent: #d4a843;
  --color-link: #888888;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
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
  background-color: var(--color-accent);
  color: var(--color-bg);
}
```

- [ ] **Step 2: Update root layout with fonts**

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Youngmin Cho — Software Engineer",
    template: "%s | Youngmin Cho",
  },
  description:
    "Software engineer building intelligent systems at the intersection of AI and finance.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Youngmin Cho",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify theme renders**

```bash
npm run dev
```

Open `http://localhost:3000` — should see dark background (#0a0a0a), correct fonts loading.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: configure Tailwind CSS 4 dark theme and typography"
```

---

## Task 3: Sanity CMS Setup & Schemas

**Files:**
- Create: `sanity/sanity.config.ts`, `sanity/sanity.cli.ts`, `sanity/schemas/index.ts`, `sanity/schemas/project.ts`, `sanity/schemas/post.ts`, `sanity/schemas/author.ts`, `sanity/schemas/resume.ts`, `sanity/schemas/block-content.ts`, `sanity/lib/structure.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`

- [ ] **Step 1: Create Sanity project**

Go to https://www.sanity.io/manage and create a new project named "chopaul". Note the project ID. Add `http://localhost:3000` to CORS origins.

Set in `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 2: Create `sanity.config.ts`**

```ts
// sanity/sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./lib/structure";

export default defineConfig({
  name: "chopaul",
  title: "chopaul.com",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
```

- [ ] **Step 3: Create `sanity.cli.ts`**

```ts
// sanity/sanity.cli.ts
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
});
```

- [ ] **Step 4: Create project schema**

```ts
// sanity/schemas/project.ts
import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "techStack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "links",
      type: "object",
      fields: [
        defineField({ name: "live", type: "url", title: "Live URL" }),
        defineField({ name: "github", type: "url", title: "GitHub URL" }),
      ],
    }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", featured: "featured" },
    prepare({ title, featured }) {
      return { title, subtitle: featured ? "Featured" : "" };
    },
  },
});
```

- [ ] **Step 5: Create post schema**

```ts
// sanity/schemas/post.ts
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
  orderings: [
    { title: "Published", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", date: "publishedAt" },
    prepare({ title, date }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString() : "Draft" };
    },
  },
});
```

- [ ] **Step 6: Create author singleton schema**

```ts
// sanity/schemas/author.ts
import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "bio", type: "text", rows: 3, description: "Short bio for home page" }),
    defineField({ name: "fullBio", type: "blockContent", description: "Full bio for /about" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "socialLinks",
      type: "object",
      fields: [
        defineField({ name: "github", type: "url" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "email", type: "string" }),
      ],
    }),
    defineField({
      name: "skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "category", type: "string" }),
            defineField({ name: "items", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
          ],
          preview: {
            select: { title: "category" },
          },
        },
      ],
    }),
    defineField({ name: "nowContent", type: "blockContent", description: "What you're working on now" }),
    defineField({ name: "nowUpdatedAt", type: "datetime", description: "When Now section was last updated" }),
    defineField({ name: "resumePdf", type: "file" }),
  ],
  preview: { select: { title: "name" } },
});
```

- [ ] **Step 7: Create resume singleton schema**

```ts
// sanity/schemas/resume.ts
import { defineField, defineType } from "sanity";

export const resume = defineType({
  name: "resume",
  title: "Resume",
  type: "document",
  fields: [
    defineField({
      name: "experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "company", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
            defineField({ name: "startDate", type: "date", validation: (r) => r.required() }),
            defineField({ name: "endDate", type: "date" }),
            defineField({ name: "current", type: "boolean", initialValue: false }),
            defineField({ name: "description", type: "blockContent" }),
          ],
          preview: {
            select: { title: "role", subtitle: "company" },
          },
        },
      ],
    }),
    defineField({
      name: "education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "institution", type: "string", validation: (r) => r.required() }),
            defineField({ name: "degree", type: "string" }),
            defineField({ name: "field", type: "string" }),
            defineField({ name: "startDate", type: "date" }),
            defineField({ name: "endDate", type: "date" }),
          ],
          preview: {
            select: { title: "institution", subtitle: "degree" },
          },
        },
      ],
    }),
    defineField({
      name: "skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "category", type: "string" }),
            defineField({ name: "items", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
          ],
          preview: { select: { title: "category" } },
        },
      ],
    }),
    defineField({
      name: "projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Resume" }) },
});
```

- [ ] **Step 8: Create blockContent type and schema index**

```ts
// sanity/schemas/block-content.ts
import { defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "URL" }],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true } },
    {
      name: "code",
      title: "Code Block",
      type: "object",
      fields: [
        { name: "language", type: "string", title: "Language" },
        { name: "code", type: "text", title: "Code" },
      ],
    },
    {
      name: "callout",
      title: "Callout",
      type: "object",
      fields: [
        {
          name: "type",
          type: "string",
          options: { list: ["info", "warning", "tip"] },
          initialValue: "info",
        },
        { name: "text", type: "text" },
      ],
    },
  ],
});
```

```ts
// sanity/schemas/index.ts
import { project } from "./project";
import { post } from "./post";
import { author } from "./author";
import { resume } from "./resume";
import { blockContent } from "./block-content";

export const schemaTypes = [project, post, author, resume, blockContent];
```

- [ ] **Step 9: Create desk structure for singletons**

```ts
// sanity/lib/structure.ts
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Author")
        .child(S.document().schemaType("author").documentId("author")),
      S.listItem()
        .title("Resume")
        .child(S.document().schemaType("resume").documentId("resume")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["author", "resume"].includes(listItem.getId()!)
      ),
    ]);
```

- [ ] **Step 10: Create Studio page route**

```tsx
// src/app/studio/[[...tool]]/page.tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity/sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 11: Verify Studio loads**

```bash
npm run dev
```

Open `http://localhost:3000/studio` — should see Sanity Studio with Project, Post, Author, Resume content types.

- [ ] **Step 12: Commit**

```bash
git add sanity/ src/app/studio/
git commit -m "feat: add Sanity v3 schemas and Studio route"
```

---

## Task 4: Sanity Client & Query Layer

**Files:**
- Create: `src/lib/sanity/client.ts`, `src/lib/sanity/image.ts`, `src/lib/sanity/queries.ts`, `src/lib/utils.ts`

- [ ] **Step 1: Create Sanity client with tag-based fetching**

```ts
// src/lib/sanity/client.ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: 3600, tags },
  });
}
```

- [ ] **Step 2: Create image URL builder**

```ts
// src/lib/sanity/image.ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}
```

- [ ] **Step 3: Create GROQ queries**

```ts
// src/lib/sanity/queries.ts

// Home page
export const featuredProjectQuery = `
  *[_type == "project" && featured == true] | order(order asc)[0] {
    title, slug, description, techStack, links, image, order
  }
`;

export const recentPostsQuery = `
  *[_type == "post"] | order(publishedAt desc)[0...3] {
    title, slug, excerpt, publishedAt
  }
`;

export const authorBioQuery = `
  *[_type == "author"][0] {
    bio, socialLinks
  }
`;

// Blog
export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    title, slug, excerpt, publishedAt, tags
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    title, slug, excerpt, body, publishedAt, tags, image
  }
`;

// Projects
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    title, slug, description, body, techStack, links, image
  }
`;

// About
export const aboutQuery = `
  *[_type == "author"][0] {
    name, title, fullBio, skills, nowContent, nowUpdatedAt, image
  }
`;

// Resume
export const resumeQuery = `
  *[_type == "resume"][0] {
    experience, education, skills,
    projects[]-> { title, slug, description }
  }
`;

export const resumePdfQuery = `
  *[_type == "author"][0] {
    "resumeUrl": resumePdf.asset->url
  }
`;

// All projects (for sitemap + generateStaticParams)
export const allProjectsQuery = `
  *[_type == "project"] | order(order asc) { title, slug }
`;
```

- [ ] **Step 4: Create utility functions**

```ts
// src/lib/utils.ts
import { toPlainText } from "@portabletext/react";

export function readingTime(body: unknown[]): string {
  const text = toPlainText(body);
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateFull(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add Sanity client, queries, and utility functions"
```

---

## Task 5: Shared Components (Nav, Footer, Section Label)

**Files:**
- Create: `src/components/nav.tsx`, `src/components/mobile-menu.tsx`, `src/components/footer.tsx`, `src/components/section-label.tsx`

- [ ] **Step 1: Create section label component**

```tsx
// src/components/section-label.tsx
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-6">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create nav component**

```tsx
// src/components/nav.tsx
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
        <a
          href="/"
          className="text-text-primary text-sm font-semibold tracking-[1px]"
        >
          CHOPAUL
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const href = isHome ? link.home : link.other;
            const isActive =
              isHome && activeSection === link.home.replace("#", "");
            return (
              <a
                key={link.label}
                href={href}
                className={`text-xs transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-muted"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {menuOpen ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={links}
        isHome={isHome}
      />
    </nav>
  );
}
```

- [ ] **Step 3: Create mobile menu component**

```tsx
// src/components/mobile-menu.tsx
"use client";

type NavLink = {
  label: string;
  home: string;
  other: string;
};

export function MobileMenu({
  open,
  onClose,
  links,
  isHome,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  isHome: boolean;
}) {
  if (!open) return null;

  return (
    <div className="md:hidden border-t border-border bg-bg px-6 py-4 flex flex-col gap-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={isHome ? link.home : link.other}
          onClick={onClose}
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create footer component**

```tsx
// src/components/footer.tsx
import { sanityFetch } from "@/lib/sanity/client";
import { authorBioQuery } from "@/lib/sanity/queries";

type AuthorData = {
  socialLinks?: { github?: string; linkedin?: string; email?: string };
};

export async function Footer() {
  const author = await sanityFetch<AuthorData>({
    query: authorBioQuery,
    tags: ["author"],
  });

  const socials = [
    { label: "GitHub", href: author?.socialLinks?.github },
    { label: "LinkedIn", href: author?.socialLinks?.linkedin },
    {
      label: "Email",
      href: author?.socialLinks?.email
        ? `mailto:${author.socialLinks.email}`
        : undefined,
    },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-divider py-8 px-6">
      <div className="mx-auto max-w-[720px] flex justify-between items-center">
        <div className="text-text-faint text-xs">
          &copy; {new Date().getFullYear()} Youngmin Cho
        </div>
        <div className="flex gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-faint text-xs hover:text-text-secondary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add nav, footer, and section-label components"
```

---

## Task 6: Home Page — Single-Page Scroll

**Files:**
- Create: `src/components/home/hero.tsx`, `src/components/home/featured-project.tsx`, `src/components/home/recent-writing.tsx`, `src/components/home/about-snippet.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create hero section**

```tsx
// src/components/home/hero.tsx
import { SectionLabel } from "@/components/section-label";

type HeroProps = {
  socialLinks?: { github?: string; linkedin?: string };
};

export function Hero({ socialLinks }: HeroProps) {
  return (
    <section id="top" className="pt-32 pb-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Software Engineer</SectionLabel>
        <h1 className="text-text-primary text-[32px] font-light leading-[1.3] mb-4">
          I build intelligent systems
          <br />
          at the intersection of
          <br />
          AI and finance.
        </h1>
        <p className="text-text-muted text-sm leading-relaxed max-w-[480px]">
          Full-stack engineer specializing in AI pipelines, data infrastructure,
          and financial intelligence platforms.
        </p>
        <div className="flex gap-3 mt-7">
          <a
            href="#projects"
            className="text-text-primary text-xs bg-surface px-4 py-2 rounded"
          >
            View Projects &darr;
          </a>
          {socialLinks?.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted text-xs border border-border px-4 py-2 rounded hover:text-text-primary transition-colors"
            >
              GitHub &rarr;
            </a>
          )}
          {socialLinks?.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted text-xs border border-border px-4 py-2 rounded hover:text-text-primary transition-colors"
            >
              LinkedIn &rarr;
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create featured project section**

```tsx
// src/components/home/featured-project.tsx
import { SectionLabel } from "@/components/section-label";
import { urlFor } from "@/lib/sanity/image";

type Project = {
  title: string;
  slug: { current: string };
  description: string;
  techStack: string[];
  links?: { live?: string; github?: string };
  image?: { asset: { _ref: string } };
};

export function FeaturedProject({ project }: { project: Project | null }) {
  if (!project) return null;

  return (
    <section id="projects" className="py-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Featured Project</SectionLabel>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-surface rounded-lg p-6 border border-border">
              <div className="text-accent text-[11px] tracking-[2px] font-mono mb-3">
                {project.links?.live
                  ? new URL(project.links.live).hostname.toUpperCase()
                  : project.title.toUpperCase()}
              </div>
              <div className="text-text-muted text-xs leading-relaxed mb-4">
                {project.description}
              </div>
              {project.techStack && (
                <div className="flex gap-1.5 flex-wrap">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-text-faint text-[10px] border border-border px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary text-sm font-medium mb-2">
              {project.title}
            </h3>
            <p className="text-text-muted text-[13px] leading-relaxed mb-4">
              {project.description}
            </p>
            <a
              href={`/projects/${project.slug.current}`}
              className="text-link text-xs border-b border-text-faint hover:text-text-primary transition-colors"
            >
              Read case study &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create recent writing section**

```tsx
// src/components/home/recent-writing.tsx
import { SectionLabel } from "@/components/section-label";
import { formatDate } from "@/lib/utils";

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
};

export function RecentWriting({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  return (
    <section id="blog" className="py-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>Recent Writing</SectionLabel>
        <div className="flex flex-col gap-4">
          {posts.map((post, i) => (
            <a
              key={post.slug.current}
              href={`/blog/${post.slug.current}`}
              className={`flex justify-between items-baseline gap-4 group ${
                i < posts.length - 1 ? "pb-4 border-b border-surface" : ""
              }`}
            >
              <div>
                <div className="text-text-primary text-sm mb-1 group-hover:text-accent transition-colors">
                  {post.title}
                </div>
                <div className="text-text-faint text-xs">{post.excerpt}</div>
              </div>
              <div className="text-text-faint text-xs whitespace-nowrap">
                {formatDate(post.publishedAt)}
              </div>
            </a>
          ))}
        </div>
        <div className="mt-5">
          <a
            href="/blog"
            className="text-text-muted text-xs border-b border-text-faint hover:text-text-primary transition-colors"
          >
            All posts &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create about snippet section**

```tsx
// src/components/home/about-snippet.tsx
import { SectionLabel } from "@/components/section-label";

type AboutProps = {
  bio: string | null;
};

export function AboutSnippet({ bio }: AboutProps) {
  return (
    <section id="about" className="py-16 px-6 border-b border-divider">
      <div className="mx-auto max-w-[720px]">
        <SectionLabel>About</SectionLabel>
        {bio && (
          <p className="text-text-secondary text-sm leading-relaxed max-w-[520px]">
            {bio}
          </p>
        )}
        <div className="flex gap-4 mt-5">
          <a
            href="/about"
            className="text-text-muted text-xs border-b border-text-faint hover:text-text-primary transition-colors"
          >
            Full bio &rarr;
          </a>
          <a
            href="/resume"
            className="text-text-muted text-xs border-b border-text-faint hover:text-text-primary transition-colors"
          >
            Download resume &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Compose home page**

```tsx
// src/app/page.tsx
import { sanityFetch } from "@/lib/sanity/client";
import {
  featuredProjectQuery,
  recentPostsQuery,
  authorBioQuery,
} from "@/lib/sanity/queries";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { FeaturedProject } from "@/components/home/featured-project";
import { RecentWriting } from "@/components/home/recent-writing";
import { AboutSnippet } from "@/components/home/about-snippet";

type FeaturedProjectData = {
  title: string;
  slug: { current: string };
  description: string;
  techStack: string[];
  links?: { live?: string; github?: string };
  image?: { asset: { _ref: string } };
} | null;

type RecentPost = {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
};

type AuthorBio = {
  bio: string;
  socialLinks?: { github?: string; linkedin?: string; email?: string };
} | null;

export default async function Home() {
  const [project, posts, author] = await Promise.all([
    sanityFetch<FeaturedProjectData>({ query: featuredProjectQuery, tags: ["project"] }),
    sanityFetch<RecentPost[]>({ query: recentPostsQuery, tags: ["post"] }),
    sanityFetch<AuthorBio>({ query: authorBioQuery, tags: ["author"] }),
  ]);

  return (
    <>
      <Nav />
      <main>
        <Hero socialLinks={author?.socialLinks} />
        <FeaturedProject project={project} />
        <RecentWriting posts={posts || []} />
        <AboutSnippet bio={author?.bio ?? null} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Verify home page renders**

```bash
npm run dev
```

Open `http://localhost:3000` — should see the full single-page scroll with all sections. Content will be empty until Sanity has data.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/ src/app/page.tsx
git commit -m "feat: build single-page scroll home with all sections"
```

---

## Task 7: Portable Text Renderer

**Files:**
- Create: `src/components/portable-text.tsx`

- [ ] **Step 1: Create Portable Text renderer with Shiki code blocks**

```tsx
// src/components/portable-text.tsx
import {
  PortableText as PortableTextReact,
  type PortableTextComponents,
} from "@portabletext/react";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

// Pre-highlight code blocks server-side before passing to PortableText
let highlighterPromise: ReturnType<typeof createHighlighterCore> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import("shiki/themes/github-dark-default.mjs")],
      langs: [
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/javascript.mjs"),
        import("shiki/langs/python.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/css.mjs"),
        import("shiki/langs/html.mjs"),
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return highlighterPromise;
}

export async function highlightCodeBlocks(body: unknown[]): Promise<unknown[]> {
  const highlighter = await getHighlighter();
  return body.map((block: any) => {
    if (block._type === "code" && block.code) {
      const lang = highlighter.getLoadedLanguages().includes(block.language)
        ? block.language
        : "text";
      const html = highlighter.codeToHtml(block.code, {
        lang,
        theme: "github-dark-default",
      });
      return { ...block, highlightedHtml: html };
    }
    return block;
  });
}

function CodeBlock({
  value,
}: {
  value: { language?: string; code: string; highlightedHtml?: string };
}) {
  if (value.highlightedHtml) {
    return (
      <div
        className="my-6 rounded-lg overflow-hidden text-sm"
        dangerouslySetInnerHTML={{ __html: value.highlightedHtml }}
      />
    );
  }
  return (
    <pre className="my-6 rounded-lg overflow-hidden text-sm bg-surface p-4">
      <code>{value.code}</code>
    </pre>
  );
}

function Callout({ value }: { value: { type: string; text: string } }) {
  const colors: Record<string, string> = {
    info: "border-blue-500/30 bg-blue-500/5",
    warning: "border-yellow-500/30 bg-yellow-500/5",
    tip: "border-green-500/30 bg-green-500/5",
  };

  return (
    <div
      className={`my-6 border-l-2 pl-4 py-3 text-sm text-text-secondary ${colors[value.type] || colors.info}`}
    >
      {value.text}
    </div>
  );
}

function SanityImage({ value }: { value: { asset: { _ref: string } } }) {
  const url = urlFor(value).width(720).auto("format").url();
  return (
    <div className="my-6">
      <Image
        src={url}
        alt=""
        width={720}
        height={400}
        className="rounded-lg"
      />
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-text-primary text-xl font-light mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-text-primary text-lg font-light mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-border pl-4 my-6 text-text-muted italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-text-primary font-medium">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link hover:text-text-primary underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    code: CodeBlock,
    callout: Callout,
    image: SanityImage,
  },
};

export function PortableText({ value }: { value: unknown[] }) {
  return <PortableTextReact value={value} components={components} />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/portable-text.tsx
git commit -m "feat: add Portable Text renderer with Shiki code blocks"
```

---

## Task 8: Blog Pages

**Files:**
- Create: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create blog listing page**

```tsx
// src/app/blog/page.tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsQuery } from "@/lib/sanity/queries";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing on AI, engineering, and financial intelligence.",
};

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  tags: string[];
};

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>({
    query: allPostsQuery,
    tags: ["post"],
  });

  return (
    <>
      <Nav />
      <main className="pt-28 pb-16 px-6">
        <div className="mx-auto max-w-[720px]">
          <SectionLabel>Blog</SectionLabel>
          <h1 className="text-text-primary text-2xl font-light mb-8">
            Writing
          </h1>
          <div className="flex flex-col gap-4">
            {posts?.map((post, i) => (
              <a
                key={post.slug.current}
                href={`/blog/${post.slug.current}`}
                className={`flex justify-between items-baseline gap-4 group ${
                  i < posts.length - 1 ? "pb-4 border-b border-surface" : ""
                }`}
              >
                <div>
                  <div className="text-text-primary text-sm mb-1 group-hover:text-accent transition-colors">
                    {post.title}
                  </div>
                  <div className="text-text-faint text-xs">{post.excerpt}</div>
                  {post.tags?.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-text-faint text-[10px] border border-border px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-text-faint text-xs whitespace-nowrap">
                  {formatDate(post.publishedAt)}
                </div>
              </a>
            ))}
          </div>
          {(!posts || posts.length === 0) && (
            <p className="text-text-muted text-sm">No posts yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create blog post detail page**

```tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { postBySlugQuery, allPostsQuery } from "@/lib/sanity/queries";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PortableText, highlightCodeBlocks } from "@/components/portable-text";
import { formatDateFull, readingTime } from "@/lib/utils";

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  body: unknown[];
  publishedAt: string;
  tags: string[];
  image?: { asset: { _ref: string } };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: `/og?title=${encodeURIComponent(post.title)}` }],
    },
  };
}

export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: { current: string } }[]>({
    query: allPostsQuery,
    tags: ["post"],
  });
  return posts?.map((p) => ({ slug: p.slug.current })) || [];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });

  if (!post) notFound();

  const highlightedBody = post.body ? await highlightCodeBlocks(post.body) : null;

  return (
    <>
      <Nav />
      <main className="pt-28 pb-16 px-6">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-8">
            <h1 className="text-text-primary text-2xl font-light mb-3">
              {post.title}
            </h1>
            <div className="flex gap-3 text-text-faint text-xs">
              <span>{formatDateFull(post.publishedAt)}</span>
              {post.body && <span>{readingTime(post.body)}</span>}
            </div>
          </div>
          {highlightedBody && <PortableText value={highlightedBody} />}
          {post.tags?.length > 0 && (
            <div className="flex gap-1.5 mt-10 pt-6 border-t border-divider">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-text-faint text-[10px] border border-border px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/
git commit -m "feat: add blog listing and post detail pages"
```

---

## Task 9: Project Detail Page

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create project case study page**

```tsx
// src/app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { projectBySlugQuery, allProjectsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PortableText, highlightCodeBlocks } from "@/components/portable-text";

type Project = {
  title: string;
  slug: { current: string };
  description: string;
  body: unknown[];
  techStack: string[];
  links?: { live?: string; github?: string };
  image?: { asset: { _ref: string } };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project"],
  });
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image
        ? [{ url: urlFor(project.image).width(1200).height(630).url() }]
        : [{ url: `/og?title=${encodeURIComponent(project.title)}` }],
    },
  };
}

export async function generateStaticParams() {
  const projects = await sanityFetch<{ slug: { current: string } }[]>({
    query: allProjectsQuery,
    tags: ["project"],
  });
  return projects?.map((p) => ({ slug: p.slug.current })) || [];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project"],
  });

  if (!project) notFound();

  const highlightedBody = project.body ? await highlightCodeBlocks(project.body) : null;

  return (
    <>
      <Nav />
      <main className="pt-28 pb-16 px-6">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-8">
            <h1 className="text-text-primary text-2xl font-light mb-3">
              {project.title}
            </h1>
            <p className="text-text-muted text-sm mb-4">
              {project.description}
            </p>
            {project.techStack && (
              <div className="flex gap-1.5 flex-wrap mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-text-faint text-[10px] border border-border px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-xs border border-accent/30 px-3 py-1.5 rounded hover:bg-accent/10 transition-colors"
                >
                  Visit site &rarr;
                </a>
              )}
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted text-xs border border-border px-3 py-1.5 rounded hover:text-text-primary transition-colors"
                >
                  GitHub &rarr;
                </a>
              )}
            </div>
          </div>
          {highlightedBody && <PortableText value={highlightedBody} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/projects/
git commit -m "feat: add project case study detail page"
```

---

## Task 10: About Page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create about page**

```tsx
// src/app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { sanityFetch } from "@/lib/sanity/client";
import { aboutQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { PortableText } from "@/components/portable-text";
import { formatDateFull } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "About Youngmin Cho — software engineer building at the intersection of AI and finance.",
};

type Author = {
  name: string;
  title: string;
  fullBio: unknown[];
  skills: { category: string; items: string[] }[];
  nowContent: unknown[];
  nowUpdatedAt: string;
  image?: { asset: { _ref: string } };
};

export default async function AboutPage() {
  const author = await sanityFetch<Author | null>({
    query: aboutQuery,
    tags: ["author"],
  });

  if (!author) return null;

  return (
    <>
      <Nav />
      <main className="pt-28 pb-16 px-6">
        <div className="mx-auto max-w-[720px]">
          {/* Header */}
          <div className="flex items-start gap-6 mb-10">
            {author.image && (
              <Image
                src={urlFor(author.image).width(80).height(80).url()}
                alt={author.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-text-primary text-2xl font-light">
                {author.name}
              </h1>
              <p className="text-text-muted text-sm">{author.title}</p>
            </div>
          </div>

          {/* Bio */}
          {author.fullBio && (
            <div className="mb-12">
              <PortableText value={author.fullBio} />
            </div>
          )}

          {/* Skills */}
          {author.skills?.length > 0 && (
            <div className="mb-12">
              <SectionLabel>Skills</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {author.skills.map((group) => (
                  <div key={group.category}>
                    <h3 className="text-text-primary text-sm font-medium mb-2">
                      {group.category}
                    </h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="text-text-muted text-xs border border-border px-2 py-1 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Now */}
          {author.nowContent && (
            <div>
              <SectionLabel>Now</SectionLabel>
              {author.nowUpdatedAt && (
                <p className="text-text-faint text-xs mb-4">
                  Updated {formatDateFull(author.nowUpdatedAt)}
                </p>
              )}
              <PortableText value={author.nowContent} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about/
git commit -m "feat: add about page with bio, skills, and now section"
```

---

## Task 11: Resume Page

**Files:**
- Create: `src/app/resume/page.tsx`

- [ ] **Step 1: Create resume page**

```tsx
// src/app/resume/page.tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { resumeQuery, resumePdfQuery } from "@/lib/sanity/queries";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/section-label";
import { PortableText } from "@/components/portable-text";

export const metadata: Metadata = {
  title: "Resume",
  description: "Youngmin Cho — Software Engineer resume.",
};

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: unknown[];
};

type Education = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

type ResumeData = {
  experience: Experience[];
  education: Education[];
  skills: { category: string; items: string[] }[];
  projects: { title: string; slug: { current: string }; description: string }[];
};

function formatYear(date: string) {
  return new Date(date).getFullYear().toString();
}

export default async function ResumePage() {
  const [resume, pdfData] = await Promise.all([
    sanityFetch<ResumeData | null>({ query: resumeQuery, tags: ["resume"] }),
    sanityFetch<{ resumeUrl?: string } | null>({
      query: resumePdfQuery,
      tags: ["author"],
    }),
  ]);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-16 px-6">
        <div className="mx-auto max-w-[720px]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-text-primary text-2xl font-light">Resume</h1>
            </div>
            {pdfData?.resumeUrl && (
              <a
                href={pdfData.resumeUrl}
                download
                className="text-accent text-xs border border-accent/30 px-3 py-1.5 rounded hover:bg-accent/10 transition-colors"
              >
                Download PDF
              </a>
            )}
          </div>

          {/* Experience */}
          {resume?.experience?.length > 0 && (
            <div className="mb-12">
              <SectionLabel>Experience</SectionLabel>
              <div className="flex flex-col gap-6">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="border-l border-border pl-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-text-primary text-sm font-medium">
                        {exp.role}
                      </h3>
                      <span className="text-text-faint text-xs">
                        {formatYear(exp.startDate)} —{" "}
                        {exp.current ? "Present" : exp.endDate ? formatYear(exp.endDate) : ""}
                      </span>
                    </div>
                    <p className="text-text-muted text-xs mb-2">{exp.company}</p>
                    {exp.description && (
                      <div className="text-text-muted">
                        <PortableText value={exp.description} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume?.education?.length > 0 && (
            <div className="mb-12">
              <SectionLabel>Education</SectionLabel>
              <div className="flex flex-col gap-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="border-l border-border pl-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-text-primary text-sm font-medium">
                        {edu.institution}
                      </h3>
                      <span className="text-text-faint text-xs">
                        {formatYear(edu.startDate)} — {formatYear(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-text-muted text-xs">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resume?.skills?.length > 0 && (
            <div className="mb-12">
              <SectionLabel>Skills</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resume.skills.map((group) => (
                  <div key={group.category}>
                    <h3 className="text-text-primary text-sm font-medium mb-2">
                      {group.category}
                    </h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="text-text-muted text-xs border border-border px-2 py-1 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume?.projects?.length > 0 && (
            <div>
              <SectionLabel>Projects</SectionLabel>
              <div className="flex flex-col gap-3">
                {resume.projects.map((proj) => (
                  <a
                    key={proj.slug.current}
                    href={`/projects/${proj.slug.current}`}
                    className="group"
                  >
                    <span className="text-text-primary text-sm group-hover:text-accent transition-colors">
                      {proj.title}
                    </span>
                    <span className="text-text-faint text-xs ml-2">
                      {proj.description}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/resume/
git commit -m "feat: add web resume page with PDF download"
```

---

## Task 12: Error Pages, Sitemap, Robots, OG Image, Revalidation

**Files:**
- Create: `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/og/route.tsx`, `src/app/api/revalidate/route.ts`

- [ ] **Step 1: Create 404 page**

```tsx
// src/app/not-found.tsx
import { Nav } from "@/components/nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-16 px-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-text-primary text-4xl font-light mb-4">404</h1>
          <p className="text-text-muted text-sm mb-6">Page not found.</p>
          <a
            href="/"
            className="text-link text-xs hover:text-text-primary transition-colors"
          >
            &larr; Back to home
          </a>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Create error page**

```tsx
// src/app/error.tsx
"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <div className="text-center">
        <h1 className="text-text-primary text-4xl font-light mb-4">Error</h1>
        <p className="text-text-muted text-sm mb-6">Something went wrong.</p>
        <button
          onClick={reset}
          className="text-link text-xs hover:text-text-primary transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create dynamic sitemap**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsQuery, allProjectsQuery } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com";

  const [posts, projects] = await Promise.all([
    sanityFetch<{ slug: { current: string }; publishedAt: string }[]>({
      query: allPostsQuery,
      tags: ["post"],
    }),
    sanityFetch<{ slug: { current: string } }[]>({
      query: allProjectsQuery,
      tags: ["project"],
    }),
  ]);

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/resume`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const postPages = posts?.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })) || [];

  const projectPages = projects?.map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })) || [];

  return [...staticPages, ...postPages, ...projectPages];
}
```

- [ ] **Step 4: Create robots.txt**

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/studio/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Create OG image route**

```tsx
// src/app/og/route.tsx
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Youngmin Cho";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
        }}
      >
        <div style={{ color: "#555555", fontSize: 16, letterSpacing: 3, marginBottom: 24 }}>
          CHOPAUL.COM
        </div>
        <div style={{ color: "#ffffff", fontSize: 48, fontWeight: 300, lineHeight: 1.3 }}>
          {title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

- [ ] **Step 6: Create revalidation webhook endpoint**

```ts
// src/app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const type = body?._type;

    if (type) {
      revalidateTag(type);
    }

    return NextResponse.json({ revalidated: true, type });
  } catch {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/not-found.tsx src/app/error.tsx src/app/sitemap.ts src/app/robots.ts src/app/og/ src/app/api/
git commit -m "feat: add 404, error, sitemap, robots, OG image, and revalidation endpoint"
```

---

## Task 13: Next.js Config & JSON-LD

**Files:**
- Modify: `next.config.ts`
- Modify: `src/app/page.tsx` (add JSON-LD)
- Modify: `src/app/blog/[slug]/page.tsx` (add JSON-LD)

- [ ] **Step 1: Update Next.js config for Sanity image domains**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  transpilePackages: ["sanity"],
};

export default nextConfig;
```

- [ ] **Step 2: Add JSON-LD Person schema to home page**

Add to `src/app/page.tsx`, inside the `<main>` tag before `<Hero>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Youngmin Cho",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://chopaul.com",
      jobTitle: "Software Engineer",
      description:
        "Software engineer building intelligent systems at the intersection of AI and finance.",
    }),
  }}
/>
```

- [ ] **Step 3: Add JSON-LD Article schema to blog post page**

Add to `src/app/blog/[slug]/page.tsx`, inside `<main>` before the title:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      datePublished: post.publishedAt,
      author: { "@type": "Person", name: "Youngmin Cho" },
      description: post.excerpt,
    }),
  }}
/>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts src/app/page.tsx src/app/blog/
git commit -m "feat: add Next.js config, JSON-LD structured data"
```

---

## Task 14: Port .claude Config & Final Polish

**Files:**
- Create: `.claude/settings.json`, `.claude/settings.local.json`
- Modify: `.gitignore`

- [ ] **Step 1: Create adapted .claude settings from araverus**

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILEPATH\" 2>/dev/null; npx eslint --fix \"$FILEPATH\" 2>/dev/null; true"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Create settings.local.json with permissions**

```json
// .claude/settings.local.json
{
  "permissions": {
    "allow": [
      "Bash(npm run build)",
      "Bash(npm run dev)",
      "Bash(npm run lint)",
      "Bash(npx tsc --noEmit)",
      "Bash(git *)"
    ]
  }
}
```

- [ ] **Step 3: Update .gitignore**

Add to `.gitignore`:
```
.superpowers/
.env.local
```

- [ ] **Step 4: Add seed content in Sanity Studio**

Open `http://localhost:3000/studio` and create:
1. **Author** singleton — fill in name, title, bio, social links
2. **Resume** singleton — add experience, education, skills
3. **Project** — create "Araverus" with description, tech stack, links, set featured = true
4. Optionally create a test blog post

- [ ] **Step 5: Verify full site end-to-end**

```bash
npm run dev
```

Check:
- Home page shows all 5 sections with real content
- Nav scrolls to sections on home, links to routes elsewhere
- `/projects/araverus` renders case study
- `/blog` shows posts (if any)
- `/about` shows bio, skills, now
- `/resume` shows resume with PDF download
- `/studio` shows Sanity Studio
- Mobile responsive (resize browser)
- 404 page works for invalid routes

- [ ] **Step 6: Run build to verify**

```bash
npm run build
```

Expected: Build succeeds. No errors.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add .claude config, .gitignore, finalize v1"
```

- [ ] **Step 8: Push to GitHub**

```bash
git push -u origin main
```

---

## Task 15: Deploy to Vercel

- [ ] **Step 1: Connect to Vercel**

Go to https://vercel.com/new, import the `choym92/chopaul` GitHub repo.

- [ ] **Step 2: Set environment variables in Vercel**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<from Sanity manage>
REVALIDATION_SECRET=<generate a random secret>
NEXT_PUBLIC_SITE_URL=https://chopaul.com
```

- [ ] **Step 3: Add custom domain**

In Vercel project settings → Domains → Add `chopaul.com`. Follow DNS instructions.

- [ ] **Step 4: Configure Sanity webhook**

In Sanity manage → API → Webhooks → Create:
- URL: `https://chopaul.com/api/revalidate`
- HTTP method: POST
- Headers: `x-revalidation-secret: <your secret>`
- Trigger on: Create, Update, Delete
- Filter: leave blank (all types)

- [ ] **Step 5: Add Vercel URL to Sanity CORS**

In Sanity manage → API → CORS origins → Add `https://chopaul.com`

- [ ] **Step 6: Verify production deployment**

Visit `https://chopaul.com` — should see the full site with all content from Sanity.

- [ ] **Step 7: Commit any deployment tweaks**

```bash
git add .
git commit -m "chore: finalize deployment configuration"
git push
```
