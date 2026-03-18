# Design: Araverus Landing Port — chopaul.com Home Page Redesign

## Overview

Replace the current chopaul.com home page layout with the araverus-style sidebar + header + hero layout. The page remains a scrollable one-pager with anchor-based section navigation ("tabs") via the sidebar.

## Architecture

### Server/Client Split

`src/app/page.tsx` stays a **server component** responsible for Sanity data fetching. It wraps a new `HomeClient` client component that owns sidebar open/close state and renders the layout shell. All section components (including `Footer`) are passed as `children` from `page.tsx` into `HomeClient` — they are not imported directly inside `HomeClient`. This preserves the server-component nature of async children (e.g. `Footer` calls `sanityFetch` internally) without violating the Next.js App Router rule that async server components cannot be rendered by client components.

`<Nav />` is **removed from `page.tsx`** — it is replaced by the `<Header>` rendered inside `HomeClient`. `nav.tsx` is kept intact and continues to be used on all non-home pages (blog, about, resume, project pages).

```
page.tsx (server — fetches Sanity data, passes children to HomeClient)
 └── HomeClient (client — sidebar state)
      ├── Sidebar (framer-motion slide-in)
      ├── Header (logo + hamburger toggle)
      └── <main> + children from page.tsx:
           ├── Hero (#top — WaveGrid animation)
           ├── FeaturedProject (#projects — receives project prop)
           ├── RecentWriting (#blog — receives posts prop)
           ├── AboutSnippet (#about — receives bio prop)
           └── Footer (async server component, passed as child)
```

## Components

### WaveGrid (`src/components/WaveGrid.tsx`)
- Exact port from araverus `archive/landing/WaveGrid.tsx`
- Three.js ∞ (lemniscate) shaped point cloud animation
- Mouse repulsion + depth push on hover
- White background (`0xffffff`) — matches light theme
- `dynamic()` loaded (SSR disabled) from Hero

### Sidebar (`src/components/Sidebar.tsx`)
- Ported from araverus git history (commit `8f1055c`)
- framer-motion slide-in from left, AnimatePresence exit
- ESC keydown closes sidebar
- Mobile: full-height overlay (click-to-close) + body scroll lock on open. Scroll lock `useEffect` must restore the previous `document.body.style.overflow` value in its cleanup function (not hardcode empty string) to avoid permanent scroll lock if the sidebar unmounts while open. Guard the lock with `window.innerWidth < 1024` so desktop is unaffected.
- Nav links (anchor-based, `scroll-behavior: smooth` already in globals.css):
  - Home → `#top`
  - Projects → `#projects`
  - Blog → `#blog`
  - About → `#about`
- Active state highlighted via `currentPage` prop (driven by IntersectionObserver in HomeClient)
- Props: `isOpen`, `onClose`, `onNavigate`, `currentPage`
- Accessibility: `role="dialog"`, `aria-modal="true"`, `aria-label="Primary navigation"` on sidebar aside; overlay has `onClick={onClose}` and `aria-hidden`; ESC key handled. Focus trap is deferred (not required for MVP).
- Uses `ChevronRight` icon from `lucide-react`

### Header (`src/components/Header.tsx`)
- Ported from araverus Header, **all auth/Supabase removed**
- Sticky top-0, `bg-white/80 backdrop-blur-md`, `border-b border-neutral-100`
- Left: hamburger/X toggle button (controlled by `sidebarOpen` prop) + logo (`/logo.svg` via `<Image>`)
- No right-side content (auth removed; links live in sidebar)
- Uses inline SVG for hamburger/X icon (consistent with existing `nav.tsx` pattern — no additional icon imports)
- Props: `sidebarOpen`, `onToggleSidebar`

### HomeClient (`src/components/HomeClient.tsx`)
- `'use client'` shell component
- Accepts `children: React.ReactNode` — all section components are passed from `page.tsx`
- **SSR strategy:** Default `sidebarOpen = false` (server-safe). After mount, a `useEffect` reads `localStorage` and updates state. This avoids full null render, preventing SEO regression and CLS. Content renders on the server with sidebar closed; sidebar preference is applied client-side after hydration with no layout jump (sidebar is an overlay/push, not inline content).
- State: `sidebarOpen` (default `false`), `currentPage` (default `'top'`), `mounted` (default `false`)
- `mounted` flag gates only the `localStorage` read and sidebar default; the component tree is **not** held back behind `mounted`
- `localStorage` key: `'sidebar-open'`
- IntersectionObserver uses `document.querySelectorAll("section[id]")` (same pattern as existing `nav.tsx`) → sets `currentPage` to the intersecting section's `id` → drives Sidebar active state. `rootMargin: "-50% 0px -50% 0px"` so the active section triggers at mid-screen.
- CSS variable `--sidebar-w: 16rem` set as `style={{ '--sidebar-w': '16rem' } as React.CSSProperties}` inline on the outermost `div` of this component. It is consumed by `lg:ml-[var(--sidebar-w)]` on the inner main-content wrapper div. Both divs must be inside the same component tree so the variable is in scope.
- Renders: `<Sidebar>` + `<Header>` + `<main>{children}</main>`

### Hero (`src/components/home/hero.tsx`) — **replaced**
- `'use client'` component (replaces existing server component in-place)
- framer-motion fade-in for title, subtitle, CTA (delays: 0.2, 0.3, 0.4s)
- `useReducedMotion()` respected — animations disabled if user prefers
- WaveGrid loaded via `dynamic()` SSR-disabled, visible on `md:` and above only (`hidden md:block`)
- Section id: `id="top"`
- Title: "Continual Learning" (`text-neutral-900`, `font-light`, `text-5xl md:text-7xl`)
- Subtitle: "Building AI systems, financial tools, and lifelong learning projects." (`text-neutral-500`)
- CTA: "Read My Writing" → `/blog` (dark pill button)
- Background white

## Data Flow

```
page.tsx (server)
  → sanityFetch (project, posts, author) — unchanged
  → <HomeClient>
       children passed in from page.tsx:
       → <script type="application/ld+json"> — JSON-LD block kept as-is, moved to children
       → <Hero />                          — client, no data props
       → <FeaturedProject project={...} /> — sync server component, receives prop
       → <RecentWriting posts={...} />     — sync server component, receives prop
       → <AboutSnippet bio={...} />        — sync server component, receives prop
       → <Footer />                        — async server component, no props needed
```

## Navigation Behavior

- `scroll-behavior: smooth` already set in globals.css
- Sidebar links are `<a href="#section-id">` for same-page anchor scrolling
- `currentPage` updated by IntersectionObserver with `rootMargin: "-50% 0px -50% 0px"` (same pattern as existing nav.tsx)
- On mobile: sidebar closes after navigation click

## What Is Not Affected

- `nav.tsx` — kept intact, used on blog, about, resume, project pages
- `mobile-menu.tsx` — kept
- All blog, about, resume, project pages — unchanged
- Sanity queries — unchanged

## Dependencies

New packages to install (none of these exist in the current `package.json`):
```
npm install three framer-motion@^12 lucide-react
npm install -D @types/three
```

- `framer-motion@^12` — React 19 compatible (project uses React 19.2.3; v12+ is required). If a transitive install has already placed a v12 in node_modules, the explicit install will confirm it in package.json.
- `lucide-react` — used for `ChevronRight` icon in Sidebar
- `three` + `@types/three` — WaveGrid canvas animation
- If the build fails with `three` (ES module bundling), add `transpilePackages: ['three']` to `next.config.ts`

## File Changes Summary

| Action | Path |
|--------|------|
| Create | `src/components/WaveGrid.tsx` |
| Create | `src/components/Sidebar.tsx` |
| Create | `src/components/Header.tsx` |
| Create | `src/components/HomeClient.tsx` |
| Modify | `src/app/page.tsx` (remove Nav, wrap in HomeClient, pass children) |
| Modify | `src/components/home/hero.tsx` (replace with WaveGrid hero) |
