/**
 * Seed script to create a technical blog post about the ML embedding
 * candidate generation & ranking system used in Araverus.
 *
 * Usage:
 *   npx tsx sanity/seed-embedding-blog.ts
 *
 * Requires: `npx sanity login` first (reads token from ~/.config/sanity/config.json)
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

// Helper: create a unique key
let keyCounter = 0;
function k(prefix = "b") {
  return `${prefix}_${++keyCounter}`;
}

// Helper: normal paragraph
function p(text: string, key?: string) {
  return {
    _type: "block",
    _key: key ?? k("p"),
    style: "normal",
    children: [{ _type: "span", _key: k("s"), text }],
  };
}

// Helper: paragraph with mixed spans (bold + normal)
function pMixed(
  spans: Array<{ text: string; marks?: string[] }>,
  key?: string
) {
  return {
    _type: "block",
    _key: key ?? k("p"),
    style: "normal",
    markDefs: [],
    children: spans.map((s) => ({
      _type: "span",
      _key: k("s"),
      text: s.text,
      marks: s.marks ?? [],
    })),
  };
}

// Helper: heading
function h2(text: string) {
  return {
    _type: "block",
    _key: k("h2"),
    style: "h2",
    children: [{ _type: "span", _key: k("s"), text }],
  };
}

function h3(text: string) {
  return {
    _type: "block",
    _key: k("h3"),
    style: "h3",
    children: [{ _type: "span", _key: k("s"), text }],
  };
}

// Helper: code block
function code(language: string, codeText: string) {
  return {
    _type: "code",
    _key: k("code"),
    language,
    code: codeText,
  };
}

// Helper: callout
function callout(type: "info" | "warning" | "tip", text: string) {
  return {
    _type: "callout",
    _key: k("callout"),
    type,
    text,
  };
}

// Helper: blockquote
function quote(text: string) {
  return {
    _type: "block",
    _key: k("bq"),
    style: "blockquote",
    children: [{ _type: "span", _key: k("s"), text }],
  };
}

// ---------------------------------------------------------------------------
// Blog post body
// ---------------------------------------------------------------------------
const body = [
  // --- TL;DR ---
  h2("TL;DR"),
  p(
    "Araverus aggregates ~200 financial news articles daily from multiple sources and needs to match related coverage across publications. " +
      "I built a three-stage system: candidate generation via publicly available RSS feeds with LLM-optimized search queries, " +
      "embedding-based ranking using BAAI/bge-base-en-v1.5 (768-dim cosine similarity), and an LLM Judge for narrative threading. " +
      "The embedding ranker runs in ~15 seconds for 60 articles, costs effectively nothing, and replaced a fragile keyword-matching approach " +
      "that missed 40% of valid matches. The same embeddings are then reused downstream for story thread clustering."
  ),

  // --- The Problem ---
  h2("The Problem: Matching Related Coverage Across Publications"),
  p(
    "Araverus is a financial news platform that groups related articles into developing narratives. " +
      "The core challenge: given a financial news event, find all articles covering that same story across dozens of publications. " +
      "A single event like a Fed rate decision generates coverage from Reuters, AP, Bloomberg, CNBC, and countless others — " +
      "each with different angles, depth, and emphasis."
  ),
  p(
    "The naive approach is keyword matching: extract terms from one article's title and search for them. " +
      "This fails spectacularly in financial news. A headline like \"Fed Holds Rates Steady, Signals Patience\" " +
      "and an article titled \"Central Bank Maintains Borrowing Costs Amid Economic Uncertainty\" cover the exact same event " +
      "but share almost no keywords. Financial journalism uses diverse vocabulary to describe identical events."
  ),
  callout(
    "info",
    "Key insight: In financial news, semantic similarity matters far more than lexical overlap. " +
      "Two articles about the same Fed decision may share zero keywords beyond common stopwords."
  ),
  p(
    "I needed a system that understands meaning, not just words. This is where ML embeddings enter the picture."
  ),

  // --- Pipeline Architecture ---
  h2("Pipeline Architecture Overview"),
  p(
    "The full pipeline runs daily at 6 AM ET on a Mac Mini via launchd. " +
      "The candidate generation and ranking system spans three scripts in the middle of a 9-script pipeline:"
  ),
  code(
    "text",
    `Phase 1: Ingest     → Financial news RSS feeds → Supabase (news_items)
Phase 1: Preprocess → Gemini Flash-Lite extracts entities, keywords, search queries
Phase 2: Search     → RSS-based candidate generation (80-180 candidates/item)
Phase 2: Rank       → BAAI/bge-base-en-v1.5 embedding similarity (top-k filtering)
Phase 2: Resolve    → Redirect URLs → canonical article URLs
Phase 3: Analyze    → LLM relevance gate + content analysis
Phase 4: Embed      → Article embeddings → pgvector storage
Phase 4: Thread     → LLM Judge assigns articles to narrative threads
Phase 5: Brief      → Bilingual audio briefing generation`
  ),
  p(
    "Each phase is a standalone Python script that reads from and writes to Supabase. " +
      "This design means any script can be re-run independently, which proved essential during development and debugging."
  ),

  // --- Candidate Generation ---
  h2("Phase 1: Candidate Generation"),

  h3("LLM-Powered Search Query Optimization"),
  p(
    "Before searching for related coverage, each source headline is preprocessed by Gemini Flash-Lite (temperature=0.1) " +
      "to extract structured metadata: named entities, search-optimized keywords, ticker symbols, and — critically — " +
      "2-3 reformulated search queries designed for news RSS feeds."
  ),
  code(
    "python",
    `# Preprocessing prompt extracts search-ready metadata
prompt = f"""Analyze this news headline and extract:
- entities: company/person/org names (max 5)
- keywords: 3-5 search terms capturing the specific event
- tickers: stock symbols if identifiable
- search_queries: 2-3 optimized news search queries (5-10 words each)

Title: {title}
Description: {description}"""

# Response: structured JSON via response_mime_type="application/json"
result = model.generate_content(prompt, generation_config={
    "temperature": 0.1,
    "max_output_tokens": 512,
    "response_mime_type": "application/json"
})`
  ),
  p(
    "This preprocessing step is what makes the system work. A title like \"Tech Giants Face New EU Scrutiny\" " +
      "generates queries like \"European Union digital markets regulation big tech\" and \"EU antitrust investigation Apple Google Meta\" — " +
      "queries that surface relevant articles a simple title search would miss."
  ),

  h3("RSS-Based Candidate Discovery"),
  p(
    "The system uses publicly available news RSS feeds to discover candidate articles. " +
      "For each source item, up to 4 queries are issued: the cleaned original title plus up to 3 LLM-generated queries. " +
      "Each query includes a tight 3-day date window to ensure temporal relevance."
  ),
  code(
    "python",
    `# RSS-based news search with date filtering
params = {
    "q": f"{query} after:{pub_date - 1d} before:{pub_date + 1d}",
    "hl": "en-US",
    "gl": "US",
}

# Domain exclusions: filter out low-quality sources
# Prioritized by quality score from domain tracking DB
excluded = get_low_quality_domains(limit=28)
params["q"] += " " + " ".join(f"-site:{d}" for d in excluded)`
  ),

  h3("Domain Quality Tracking"),
  p(
    "Not all news sources are equal. Some domains consistently return low-quality or non-English articles. " +
      "The system maintains a domain quality database " +
      "that tracks 17 distinct failure types using Wilson score confidence intervals for auto-blocking. " +
      "Domains that appear frequently in search results but consistently fail quality checks get progressively deprioritized, " +
      "then blocked entirely once confidence is high enough."
  ),
  callout(
    "tip",
    "Wilson score intervals are the right tool for domain quality ranking — they handle the cold-start " +
      "problem gracefully. A domain with 1 failure out of 1 attempt isn't as confidently bad as one with " +
      "50 failures out of 60 attempts, even though the failure rate is higher."
  ),

  // --- Embedding Ranking ---
  h2("Phase 2: Embedding-Based Ranking"),

  h3("Why BAAI/bge-base-en-v1.5"),
  p(
    "Choosing the right embedding model was a critical decision. I evaluated three options: " +
      "OpenAI text-embedding-3-small (API-based, $0.02/1M tokens), all-MiniLM-L6-v2 (local, 384-dim), " +
      "and BAAI/bge-base-en-v1.5 (local, 768-dim). I chose bge-base because:"
  ),
  pMixed([
    { text: "Zero marginal cost: ", marks: ["strong"] },
    {
      text: "It runs locally on the Mac Mini. At 200+ articles/day with 100+ candidates each, API costs would accumulate. Local inference costs nothing beyond the initial model download.",
    },
  ]),
  pMixed([
    { text: "Superior performance on retrieval tasks: ", marks: ["strong"] },
    {
      text: "bge-base consistently outperforms MiniLM on MTEB retrieval benchmarks, which closely matches our use case — finding semantically similar news articles.",
    },
  ]),
  pMixed([
    { text: "768 dimensions is the sweet spot: ", marks: ["strong"] },
    {
      text: "Enough capacity to capture financial news nuance without the storage overhead of 1024+ dim models. Each vector is 3KB in pgvector.",
    },
  ]),
  pMixed([
    { text: "Offline-first design: ", marks: ["strong"] },
    {
      text: "The pipeline sets HF_HUB_OFFLINE=1 in production. The model loads from local cache with a 30-second timeout fallback to Hub download. No external dependency during daily runs.",
    },
  ]),

  h3("The Scoring Algorithm"),
  p(
    "The ranking algorithm is elegantly simple. Both the query (source article title + description) " +
      "and each candidate (normalized title + source name) are encoded into 768-dimensional vectors " +
      "using the same model. Cosine similarity is computed as a dot product of L2-normalized vectors:"
  ),
  code(
    "python",
    `from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("BAAI/bge-base-en-v1.5")

# Encode query: source article title + description
query_text = f"{source_title} {source_description}"
query_vec = model.encode(query_text, normalize_embeddings=True)

# Encode all candidates in a single batch for efficiency
candidate_texts = [
    f"{normalize_title(c['title'])} {c['source']}"
    for c in candidates
]
doc_vecs = model.encode(candidate_texts, normalize_embeddings=True)

# Cosine similarity via dot product (vectors are already L2-normalized)
scores = np.dot(doc_vecs, query_vec)

# Filter: min_score=0.55, top_k=40
ranked = sorted(
    [(c, s) for c, s in zip(candidates, scores) if s >= 0.55],
    key=lambda x: x[1],
    reverse=True
)[:40]`
  ),
  quote(
    "Because both vectors are L2-normalized, the dot product equals cosine similarity exactly — " +
      "no need for the full cosine formula. This is a standard optimization but worth calling out " +
      "because it halves the computation."
  ),

  h3("Why Include Source Name in Candidate Encoding"),
  p(
    "One non-obvious decision: I encode candidates as \"{title} {source_name}\" rather than just the title. " +
      "This matters because publication context carries semantic signal. " +
      "An article titled \"Markets Rally\" from Reuters semantically differs from the same title on a crypto blog. " +
      "Including the source name shifted accuracy by roughly 3-5% in my testing — a small but consistent improvement."
  ),

  h3("Title Normalization"),
  p(
    "Raw candidate titles from RSS feeds often include publisher suffixes like \" - Reuters\" or \" — Associated Press\". " +
      "Since the source name is already encoded separately, these suffixes create redundancy that can skew similarity scores. " +
      "A regex strips them before encoding:"
  ),
  code(
    "python",
    `import re

def normalize_title(title: str) -> str:
    """Strip publisher suffixes: 'Headline - Reuters' → 'Headline'"""
    return re.sub(
        r'\\s*[-\\u2013]\\s*[A-Za-z0-9][A-Za-z0-9 .&\\']+$',
        '', title
    ).strip()`
  ),

  h3("Threshold Tuning: The 0.55 Cutoff"),
  p(
    "The minimum similarity threshold (0.55) was determined empirically over two weeks of pipeline runs. " +
      "I logged all scores and manually labeled 500 candidate pairs as match/non-match:"
  ),
  code(
    "text",
    `Score Distribution (500 labeled pairs):
>=0.70  →  95% true match rate  (high confidence)
0.55-0.70  →  72% true match rate  (worth keeping)
0.40-0.55  →  31% true match rate  (too noisy)
<0.40  →   8% true match rate  (mostly irrelevant)

Production thresholds:
- Ranking stage: min_score=0.55, top_k=40 (generous, let downstream LLM filter)
- Source display: min_score=0.73 (only show high-confidence sources to users)
- Thread matching: min_score=0.40 (pre-filter for LLM Judge)`
  ),
  p(
    "The key insight: different pipeline stages need different thresholds. " +
      "The ranking stage is intentionally generous (0.55) because downstream LLM analysis provides a second quality gate. " +
      "Rejecting a valid candidate at the ranking stage is permanent — you can't recover it. " +
      "But passing a bad candidate costs only one LLM call to filter out. Asymmetric cost of errors drives threshold design."
  ),

  // --- Threading ---
  h2("Phase 3: From Ranking to Narrative Threading"),
  p(
    "Here's where the architecture pays dividends: the same BAAI/bge-base-en-v1.5 model used for candidate ranking " +
      "is reused for a completely different task — clustering articles into narrative story threads."
  ),

  h3("Embedding Composition for Threading"),
  p(
    "For threading, articles are encoded differently than in the ranking stage. " +
      "Instead of just title + source, the embedding text includes the full context available after LLM analysis:"
  ),
  code(
    "python",
    `# Richer text composition for thread embeddings
parts = [article['title']]
if article.get('description'):
    parts.append(article['description'])

# Pick the best summary from LLM analysis results
summary = pick_best_summary(article)  # prioritize: relevance_flag → score → length
if summary:
    parts.append(summary)

text = ' '.join(parts)
embedding = model.encode(text, normalize_embeddings=True)  # → 768-dim vector`
  ),
  p(
    "These enriched embeddings are stored in Supabase using the pgvector extension, enabling native vector operations in SQL:"
  ),
  code(
    "sql",
    `-- pgvector enables native 768-dim vector storage and similarity search
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE news_embeddings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_item_id UUID NOT NULL UNIQUE REFERENCES news_items(id) ON DELETE CASCADE,
    embedding   vector(768) NOT NULL,
    model       TEXT NOT NULL DEFAULT 'BAAI/bge-base-en-v1.5',
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- RPC for finding similar articles (used in "Related Articles" UI)
CREATE FUNCTION match_articles(query_item_id UUID, match_count INT DEFAULT 5)
RETURNS TABLE(id UUID, title TEXT, similarity FLOAT) AS $$
  SELECT n.id, n.title, 1 - (e.embedding <=> query.embedding) AS similarity
  FROM news_embeddings e
  JOIN news_items n ON n.id = e.news_item_id
  CROSS JOIN (SELECT embedding FROM news_embeddings WHERE news_item_id = query_item_id) query
  WHERE e.news_item_id != query_item_id
  ORDER BY e.embedding <=> query.embedding
  LIMIT match_count;
$$ LANGUAGE sql;`
  ),

  h3("Thread Assignment: LLM Judge vs. Cosine Heuristic"),
  p(
    "The original threading system was pure cosine similarity with a 0.60 threshold: " +
      "find the thread whose centroid is most similar to the article, assign if above threshold, else create new. " +
      "This approach used 20+ tunable constants and suffered from thread contamination — " +
      "semantically similar but narratively distinct stories (e.g., two different Fed speeches in the same week) " +
      "would merge into a single thread."
  ),
  p(
    "The replacement: a hybrid system where cosine similarity acts as a pre-filter (threshold: 0.40, top-5 candidates), " +
      "and an LLM Judge (Gemini 2.5 Flash) makes the final assignment decision with narrative context:"
  ),
  code(
    "python",
    `# Step 1: Cosine pre-filter — fast, eliminates 95% of thread candidates
candidates = []
for thread in active_threads:
    similarity = cosine_similarity(article_embedding, thread.centroid)
    if similarity >= 0.40:  # CANDIDATE_THRESHOLD
        candidates.append((thread, similarity))
candidates = sorted(candidates, key=lambda x: x[1], reverse=True)[:5]

# Step 2: LLM Judge — slow but understands narrative context
judge_response = gemini_flash.generate(
    prompt=build_judge_prompt(article, candidates),
    # Returns: {"action": "assign"|"new_thread", "thread_id": ..., "reason": ...}
)

# Step 3: Update thread centroid (running mean)
if judge_response.action == "assign":
    thread = get_thread(judge_response.thread_id)
    new_centroid = (
        thread.centroid * thread.member_count + article_embedding
    ) / (thread.member_count + 1)
    new_centroid = new_centroid / np.linalg.norm(new_centroid)  # re-normalize`
  ),
  p(
    "The LLM Judge reduced thread contamination from ~15% to under 2%, while using only 7 configuration constants " +
      "instead of 20+. Every judgment is logged with full audit trail: " +
      "candidate threads considered, decision reason, confidence level, and model version."
  ),

  h3("Thread Merge Protection"),
  p(
    "When unmatched articles are grouped into potential new threads, there's a risk of creating duplicates. " +
      "Before creating any new thread, its centroid is compared against all existing threads. " +
      "If cosine similarity exceeds 0.92 (THREAD_MERGE_THRESHOLD), the articles merge into the existing thread instead. " +
      "This threshold is intentionally high — a false merge is worse than a redundant thread."
  ),

  // --- Production Reality ---
  h2("Production Reality: Performance and Cost"),
  p(
    "After six months of daily operation, here are the actual numbers:"
  ),
  code(
    "text",
    `Performance metrics (daily averages):
- Source articles ingested:  ~200 articles
- Candidates per article:    80-180
- Embedding ranking time:    ~15 seconds for 60 items
- Total candidates ranked:   ~8,000-12,000 per run
- Pass rate (score >= 0.55): ~22% of candidates
- Thread assignment:         ~60 articles/day into ~15-25 active threads
- Pipeline total runtime:    ~25 minutes end-to-end

Cost breakdown (monthly):
- Embedding inference:       $0 (local, Mac Mini)
- pgvector storage:          included in Supabase free tier
- LLM preprocessing:         ~$3 (Gemini Flash-Lite)
- LLM Judge + analysis:      ~$5 (Gemini Flash)
- Audio briefing generation: ~$3 (Gemini Pro + TTS)
- Total pipeline cost:       ~$11/month`
  ),
  callout(
    "info",
    "The entire pipeline — ingestion, candidate generation, embedding ranking, " +
      "threading, and audio briefing — runs for approximately $11/month. " +
      "Local embedding inference is the key cost saver: at 10,000+ candidates/day, " +
      "API-based embeddings would cost $6-8/month just for this one step."
  ),

  // --- Tradeoffs ---
  h2("Key Tradeoffs and Decisions"),

  pMixed([
    { text: "Local vs. API embeddings: ", marks: ["strong"] },
    {
      text: "I chose local inference for cost and reliability. The tradeoff is slower first-run (model download) and no automatic upgrades. Worth it for a pipeline that runs 365 days/year.",
    },
  ]),
  pMixed([
    { text: "Generous ranking threshold: ", marks: ["strong"] },
    {
      text: "Setting 0.55 instead of 0.70 increases candidate volume by ~40%, but the downstream LLM gate catches false positives. Precision at the ranking stage matters less than recall when you have a second filter.",
    },
  ]),
  pMixed([
    { text: "Single embedding model for two tasks: ", marks: ["strong"] },
    {
      text: "Using bge-base for both ranking and threading simplifies the system but means neither task gets a specialized model. A retrieval-tuned model might rank better; a clustering-tuned model might thread better. In practice, bge-base is good enough at both that the complexity of two models isn't justified.",
    },
  ]),
  pMixed([
    { text: "LLM Judge over pure embeddings for threading: ", marks: ["strong"] },
    {
      text: "Adds latency and cost ($5/month) but reduced contamination from 15% to 2%. The audit trail also makes debugging possible — you can read why every article was assigned where it was.",
    },
  ]),

  // --- What I'd Do Differently ---
  h2("What I'd Do Differently"),
  p(
    "If starting over, I'd explore two changes. First, fine-tuning the embedding model on financial news pairs — " +
      "bge-base is trained on general text, and financial jargon has specific semantic patterns " +
      "(\"hawkish\" ≈ \"rate hike\" ≈ \"tightening\") that a fine-tuned model would capture better. " +
      "Second, I'd add hard negative mining to the evaluation: the current 500-pair labeled set " +
      "over-represents easy cases and under-represents the tricky near-misses that cause real problems."
  ),
  p(
    "That said, the current system has run autonomously for six months with minimal intervention. " +
      "The combination of cheap local embeddings for fast filtering and an LLM Judge for nuanced decisions " +
      "hits a practical sweet spot that more sophisticated approaches would struggle to beat on cost-effectiveness."
  ),
];

async function seed() {
  const POST_ID = "post-embedding-ranking";
  const doc = {
    _id: POST_ID,
    _type: "post",
    title:
      "Building an ML Embedding Pipeline for Financial News Ranking",
    slug: {
      _type: "slug",
      current: "ml-embedding-pipeline-financial-news-ranking",
    },
    excerpt:
      "How I built a candidate generation and ranking system using BAAI/bge-base-en-v1.5 embeddings to match related financial news across publications — architecture decisions, threshold tuning, and the evolution from cosine heuristics to an LLM Judge.",
    publishedAt: new Date().toISOString(),
    tags: ["ML", "Embeddings", "Python", "NLP"],
    body,
  };

  console.log("Creating/replacing blog post...");
  await client.createOrReplace(doc);
  console.log(
    "Done! Blog post created: 'Building an ML Embedding Pipeline for Financial News Ranking'"
  );
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
