Write a technical blog post and publish it to Sanity CMS for chopaul.com.

Topic: $ARGUMENTS

## Blog Requirements
- 1,500+ words
- Structure: H2/H3 logical hierarchy (no H1 — the title field handles that)
- Include a TL;DR section at the top
- Include code examples with language labels (python, sql, typescript, text, etc.)
- Include at least 1 quotable/citable key sentence (clear definition, number, or fact — optimized for AI search citation)
- Write from first-person experience perspective
- Focus on decision-making process and tradeoffs, NOT a step-by-step tutorial
- Mention actual production metrics and cost numbers where applicable
- Do NOT use emojis

## Post metadata
- Title: under 60 characters
- Excerpt: 120-160 characters, compelling summary
- Tags: 2-4 relevant tags
- publishedAt: current date/time

## Output Format
Create the blog as a Sanity seed script at `sanity/seed-{slug}.ts` and run it with `npx tsx` to publish directly.

Use this exact template structure:

```typescript
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
function k(prefix = "b") { return `${prefix}_${++keyCounter}`; }

function p(text: string) {
  return { _type: "block", _key: k("p"), style: "normal",
    children: [{ _type: "span", _key: k("s"), text }] };
}

function pMixed(spans: Array<{ text: string; marks?: string[] }>) {
  return { _type: "block", _key: k("p"), style: "normal", markDefs: [],
    children: spans.map(s => ({ _type: "span", _key: k("s"), text: s.text, marks: s.marks ?? [] })) };
}

function h2(text: string) {
  return { _type: "block", _key: k("h2"), style: "h2",
    children: [{ _type: "span", _key: k("s"), text }] };
}

function h3(text: string) {
  return { _type: "block", _key: k("h3"), style: "h3",
    children: [{ _type: "span", _key: k("s"), text }] };
}

function code(language: string, codeText: string) {
  return { _type: "code", _key: k("code"), language, code: codeText };
}

function callout(type: "info" | "warning" | "tip", text: string) {
  return { _type: "callout", _key: k("callout"), type, text };
}

function quote(text: string) {
  return { _type: "block", _key: k("bq"), style: "blockquote",
    children: [{ _type: "span", _key: k("s"), text }] };
}
```

## Available block types
- `h2("text")` — Section heading
- `h3("text")` — Subsection heading
- `p("text")` — Paragraph
- `pMixed([{text: "bold part", marks: ["strong"]}, {text: " normal part"}])` — Mixed bold/normal
- `code("python", "code here")` — Syntax-highlighted code block
- `callout("info"|"warning"|"tip", "text")` — Colored callout box
- `quote("text")` — Blockquote

## Process
1. Research the topic thoroughly — read relevant source code if the topic involves a project on this machine
2. Write the seed script with the full blog body
3. Save to `sanity/seed-{slug}.ts`
4. Run `npx tsx sanity/seed-{slug}.ts` to publish
5. Report the published URL: `/blog/{slug}`
