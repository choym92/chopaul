/**
 * One-time seed script to create/update the Araverus project in Sanity.
 *
 * Usage:
 *   npx tsx sanity/seed-araverus.ts
 *
 * Requires: `npx sanity login` first (reads token from ~/.config/sanity/config.json)
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// Read auth token from Sanity CLI config
const sanityConfig = JSON.parse(
  readFileSync(join(homedir(), ".config/sanity/config.json"), "utf-8")
);
const token = sanityConfig.authToken;
if (!token) {
  console.error("No Sanity auth token found. Run `npx sanity login` first.");
  process.exit(1);
}

const client = createClient({
  projectId: "une0zsrz",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const PROJECT_ID = "araverus";

const body = [
  // --- Overview ---
  {
    _type: "block",
    _key: "h2_overview",
    style: "h2",
    children: [{ _type: "span", _key: "s1", text: "Overview" }],
  },
  {
    _type: "block",
    _key: "p_overview1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s2",
        text: "Markets move on narratives, not isolated headlines. Araverus is a story-first financial intelligence platform that threads related news articles across days, surfaces narrative velocity, and maps market impact \u2014 so you understand in minutes what\u2019s actually driving markets.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_overview2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s3",
        text: "Built as a solo full-stack project, Araverus combines a Next.js 15 frontend with a Python data pipeline (~10,000 lines) that runs autonomously every day. The platform ingests WSJ headlines, discovers free alternative sources via Google News, crawls and analyzes content with LLMs, groups articles into narrative threads, and generates bilingual audio briefings.",
      },
    ],
  },

  // --- The Problem ---
  {
    _type: "block",
    _key: "h2_problem",
    style: "h2",
    children: [{ _type: "span", _key: "s4", text: "The Problem" }],
  },
  {
    _type: "block",
    _key: "p_problem1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s5",
        text: "Financial news is fragmented. A single developing story \u2014 like a Fed rate decision \u2014 spawns dozens of articles across publications, each covering a different angle. Traditional news aggregators show these as isolated items, leaving readers to stitch the narrative together themselves. Existing tools either require expensive terminal subscriptions or lack narrative context entirely.",
      },
    ],
  },

  // --- Architecture ---
  {
    _type: "block",
    _key: "h2_arch",
    style: "h2",
    children: [{ _type: "span", _key: "s6", text: "Architecture" }],
  },
  {
    _type: "block",
    _key: "p_arch1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s7",
        text: "The system is split into two main layers: a Next.js web application and a Python data pipeline, connected through Supabase (Postgres + Auth + Storage).",
      },
    ],
  },
  {
    _type: "block",
    _key: "h3_pipeline",
    style: "h3",
    children: [
      {
        _type: "span",
        _key: "s8",
        text: "Data Pipeline (Python)",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_pipeline1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s9",
        text: "The pipeline runs daily at 6 AM ET via launchd on a Mac Mini. It executes 9 scripts in sequence across 7 phases:",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_pipeline2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s10",
        marks: ["strong"],
        text: "Ingest \u2192 Search \u2192 Rank \u2192 Crawl \u2192 Embed & Thread \u2192 Brief \u2192 Notify",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_pipeline3",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s11",
        text: "WSJ RSS feeds are ingested and preprocessed with Gemini Flash-Lite. Articles are exported as JSONL with search queries, then matched against Google News to discover free alternative sources. Candidates are ranked using bge-base-en-v1.5 embeddings (cosine similarity), resolved to final URLs, and crawled. A two-stage LLM gate filters relevance: Flash-Lite for quick triage (~60 articles/day pass), then Flash for detailed analysis producing headlines, summaries, key takeaways, and keyword extraction.",
      },
    ],
  },

  // --- Story Threading ---
  {
    _type: "block",
    _key: "h3_threading",
    style: "h3",
    children: [
      {
        _type: "span",
        _key: "s12",
        text: "Story Threading (LLM Judge)",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_threading1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s13",
        text: "The threading system is the core differentiator. Each article is converted into a 768-dimensional vector. An LLM Judge (Gemini 2.5 Flash) decides whether each article belongs to an existing thread or starts a new one. This replaced an earlier heuristic system that used 20+ constants \u2014 the LLM Judge uses just 7 and understands narrative context far better, drastically reducing thread contamination.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_threading2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s14",
        text: "Threads have a heat-based lifecycle (Active \u2192 Cooling \u2192 Archived \u2192 Resurrected) and are analyzed for narrative velocity (accelerating, decelerating, stable, new), market impacts (sectors, tickers, commodities with direction and confidence), and causal relationships between threads.",
      },
    ],
  },

  // --- Frontend ---
  {
    _type: "block",
    _key: "h3_frontend",
    style: "h3",
    children: [
      { _type: "span", _key: "s15", text: "Frontend" },
    ],
  },
  {
    _type: "block",
    _key: "p_frontend1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s16",
        text: "The web app is a WSJ-inspired editorial design built with Next.js 15 (App Router), React 19, and Tailwind CSS 4. Key pages include a newspaper-style home page with market data widgets, a 3-column headlines view with category filtering, a threads view showing narrative evolution, and a bilingual audio briefing player with sentence-level alignment. The markets section features a D3.js sector heatmap, FRED macro indicators, and a CNN Fear & Greed Index dashboard.",
      },
    ],
  },

  // --- Audio Briefings ---
  {
    _type: "block",
    _key: "h3_audio",
    style: "h3",
    children: [
      {
        _type: "span",
        _key: "s17",
        text: "Audio Briefings",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_audio1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s18",
        text: "Daily AI-generated briefings are produced in both English and Korean. English uses Google Chirp 3 HD for neural TTS; Korean uses Gemini TTS. Each briefing includes chapter markers and sentence-level transcript alignment, allowing users to read along or jump to specific sections.",
      },
    ],
  },

  // --- Key Features ---
  {
    _type: "block",
    _key: "h2_features",
    style: "h2",
    children: [{ _type: "span", _key: "s19", text: "Key Features" }],
  },
  {
    _type: "block",
    _key: "p_feat1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s20",
        marks: ["strong"],
        text: "Story Threading",
      },
      {
        _type: "span",
        _key: "s21",
        text: " \u2014 AI clusters articles into narrative threads and tracks evolution across days with heat-based lifecycle management.",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_feat2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s22",
        marks: ["strong"],
        text: "Market Impact Mapping",
      },
      {
        _type: "span",
        _key: "s23",
        text: " \u2014 Each thread maps exposure to sectors, tickers, and macro factors with directional signals and confidence scores.",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_feat3",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s24",
        marks: ["strong"],
        text: "Bilingual Audio Briefings",
      },
      {
        _type: "span",
        _key: "s25",
        text: " \u2014 Daily EN/KO neural TTS briefings with chapter navigation and sentence-level transcript alignment.",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_feat4",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s26",
        marks: ["strong"],
        text: "Market Data Dashboard",
      },
      {
        _type: "span",
        _key: "s27",
        text: " \u2014 S&P 500 sector heatmap (D3.js), FRED macro indicators, Fear & Greed Index, stock performance charts (lightweight-charts v5).",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_feat5",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s28",
        marks: ["strong"],
        text: "Autonomous Pipeline",
      },
      {
        _type: "span",
        _key: "s29",
        text: " \u2014 Fully automated daily execution with health monitoring, search engine notification (IndexNow), and ISR cache revalidation. Runs at ~$11/month operational cost.",
      },
    ],
    markDefs: [],
  },

  // --- Tech Stack ---
  {
    _type: "block",
    _key: "h2_tech",
    style: "h2",
    children: [{ _type: "span", _key: "s30", text: "Tech Stack" }],
  },
  {
    _type: "block",
    _key: "p_tech1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s31",
        marks: ["strong"],
        text: "Frontend:",
      },
      {
        _type: "span",
        _key: "s32",
        text: " Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion, D3.js, lightweight-charts v5",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_tech2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s33",
        marks: ["strong"],
        text: "Backend / Pipeline:",
      },
      {
        _type: "span",
        _key: "s34",
        text: " Python (~10k LOC), 9 scripts across 7 phases, bge-base-en-v1.5 embeddings",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_tech3",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s35",
        marks: ["strong"],
        text: "AI / LLM:",
      },
      {
        _type: "span",
        _key: "s36",
        text: " Gemini 2.5 Pro & Flash (briefing + analysis), GPT-4o-mini (analysis), Google Chirp 3 HD (EN TTS), Gemini TTS (KO)",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_tech4",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s37",
        marks: ["strong"],
        text: "Infrastructure:",
      },
      {
        _type: "span",
        _key: "s38",
        text: " Supabase (Postgres + Auth + Storage), Vercel (web), Mac Mini (pipeline cron via launchd), GitHub Actions",
      },
    ],
    markDefs: [],
  },
];

async function seed() {
  // Upload hero image
  console.log("Uploading araverus-logo.png...");
  const imageBuffer = readFileSync(join(__dirname, "../public/araverus-logo.png"));
  const imageAsset = await client.assets.upload("image", imageBuffer, {
    filename: "araverus-logo.png",
  });

  const doc = {
    _id: PROJECT_ID,
    _type: "project",
    title: "Araverus.com",
    slug: { _type: "slug", current: "araverus" },
    featured: true,
    description:
      "Story-first financial intelligence platform. Threads related news into narratives, surfaces velocity and market impact, and delivers bilingual audio briefings \u2014 powered by a fully autonomous Python pipeline and LLM analysis.",
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Python",
      "Supabase",
      "Gemini",
      "D3.js",
      "Embedding",
    ],
    links: {
      live: "https://araverus.com",
    },
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    },
    body,
    order: 0,
  };

  console.log("Creating/replacing Araverus project document...");
  await client.createOrReplace(doc);
  console.log("Done! Araverus project created with hero image and full case study body.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
