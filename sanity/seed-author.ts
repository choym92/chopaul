/**
 * Seed script: Author profile (About page content)
 * Usage: npx tsx sanity/seed-author.ts
 * Requires: npx sanity login first
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

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

let keyCounter = 0;
function k(prefix = "b") {
  return `${prefix}_${++keyCounter}`;
}

function p(text: string) {
  return {
    _type: "block",
    _key: k("p"),
    style: "normal" as const,
    children: [{ _type: "span", _key: k("s"), text }],
  };
}

function pWithLink(
  before: string,
  linkText: string,
  href: string,
  after: string
) {
  const markKey = k("link");
  return {
    _type: "block",
    _key: k("p"),
    style: "normal" as const,
    markDefs: [{ _type: "link", _key: markKey, href }],
    children: [
      { _type: "span", _key: k("s"), text: before, marks: [] },
      { _type: "span", _key: k("s"), text: linkText, marks: [markKey] },
      { _type: "span", _key: k("s"), text: after, marks: [] },
    ],
  };
}

// ---------------------------------------------------------------------------
// Now section content (Portable Text)
// ---------------------------------------------------------------------------
const nowContent = [
  pWithLink(
    "Building ",
    "Araverus",
    "https://araverus.com",
    " — a financial news intelligence platform that aggregates coverage across publications and clusters articles into developing narratives using ML embeddings and LLM-powered analysis."
  ),
  p(
    "Day to day, I work across the full stack: designing embedding pipelines for semantic article matching, tuning retrieval thresholds on real production data, and building the Next.js frontend that surfaces these insights to users. The entire system runs autonomously on a daily schedule for about $11/month."
  ),
  p(
    "Currently focused on improving the narrative threading system — replacing heuristic-based clustering with an LLM Judge that understands editorial context, not just vector similarity."
  ),
  p(
    "Outside of Araverus, I'm exploring retrieval-augmented generation patterns and how small, specialized models can replace expensive API calls in production ML pipelines."
  ),
];

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
const skills = [
  {
    _key: k("skill"),
    category: "Machine Learning & AI",
    items: [
      "Python",
      "PyTorch",
      "Sentence Transformers",
      "LLM Orchestration",
      "Embeddings & Vector Search",
      "NLP",
      "RAG",
    ],
  },
  {
    _key: k("skill"),
    category: "Data & Infrastructure",
    items: [
      "SQL",
      "PostgreSQL",
      "Supabase",
      "pgvector",
      "Pandas",
      "NumPy",
      "ETL Pipelines",
    ],
  },
  {
    _key: k("skill"),
    category: "Web & Product",
    items: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Vercel",
      "Sanity CMS",
    ],
  },
  {
    _key: k("skill"),
    category: "Tools & Workflow",
    items: [
      "Git",
      "Docker",
      "Google Cloud",
      "Gemini API",
      "REST APIs",
      "CI/CD",
    ],
  },
];

async function seed() {
  // First, find the existing author document
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "author"][0] { _id }`
  );

  if (!existing) {
    console.error(
      "No author document found. Create one in Sanity Studio first."
    );
    process.exit(1);
  }

  console.log(`Updating author document: ${existing._id}`);

  await client
    .patch(existing._id)
    .set({
      title: "Data Science Lead",
      bio: "The portfolio and technical blog of Youngmin Paul Cho, focused on AI, ML, and building data-driven products.",
      skills,
      nowContent,
      nowUpdatedAt: new Date().toISOString(),
    })
    .commit();

  console.log("Done! Author profile updated with:");
  console.log("  - Title: Data Science Lead");
  console.log("  - Bio (home page snippet)");
  console.log("  - Skills (4 categories)");
  console.log("  - Now section (current work at Araverus)");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
