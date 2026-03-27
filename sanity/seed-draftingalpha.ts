/**
 * One-time seed script to create/update the DraftingAlpha project in Sanity.
 *
 * Usage:
 *   npx tsx sanity/seed-draftingalpha.ts
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

const PROJECT_ID = "draftingalpha";

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
        text: "Fantasy football drafts are deceptively complex. Twelve managers compete over 16 rounds in a snake draft, making 192 total picks where every selection shifts the optimal strategy for everyone else. DraftingAlpha is a reinforcement learning system that learns to navigate this multi-agent optimization problem — training a PPO agent across thousands of simulated drafts using six seasons of historical NFL data to discover draft strategies that outperform conventional heuristics.",
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
        text: "DraftingAlpha combines a complete NFL data pipeline, a Monte Carlo draft simulator (1,000 trials), and a custom Gymnasium reinforcement learning environment. The system processes play-by-play data from 2018 to 2023 to compute fantasy scoring, simulates realistic multi-agent drafts with probabilistic bot opponents, and trains an RL agent that learns positional scarcity, value-over-replacement, and draft timing strategies from experience.",
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
        text: "Most fantasy football draft advice boils down to static tier lists and ADP-based rankings. But the optimal pick at any point depends on dynamic factors: which positions are being drained by opponents, how many quality players remain at each position relative to your roster needs, and the opportunity cost of waiting another round. These interdependencies create a combinatorial decision space that rule-based systems handle poorly — the 'best player available' heuristic ignores positional scarcity, while strict positional strategies ignore talent gaps.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_problem2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s6",
        text: "I framed this as a reinforcement learning problem: an agent that observes the draft state (available players, roster composition, opponent behavior) and learns a policy that maximizes total fantasy points across an entire season — not just optimizing individual picks in isolation, but learning when to reach for positional scarcity and when to draft best available talent.",
      },
    ],
  },

  // --- Architecture ---
  {
    _type: "block",
    _key: "h2_arch",
    style: "h2",
    children: [{ _type: "span", _key: "s7", text: "Architecture" }],
  },
  {
    _type: "block",
    _key: "p_arch1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s8",
        text: "The system follows a three-phase architecture: data pipeline, draft simulation environment, and RL agent training.",
      },
    ],
  },

  // --- Data Pipeline ---
  {
    _type: "block",
    _key: "h3_pipeline",
    style: "h3",
    children: [
      { _type: "span", _key: "s9", text: "Data Pipeline" },
    ],
  },
  {
    _type: "block",
    _key: "p_pipeline1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s10",
        text: "The data pipeline processes raw NFL play-by-play data from 2018 to 2023 through three specialized scripts. Roster data is pulled via nfl_data_py to map player IDs to positions and teams. Offensive stats are computed from play-by-play records: passing, rushing, and receiving yards and touchdowns, receptions (full PPR scoring), field goals bucketed by yardage (0-39, 40-49, 50+), PATs, two-point conversions, return TDs, and fumbles. Defensive/special teams stats use a bucketing system for points-allowed and yards-allowed, producing both weekly and seasonal fantasy point totals.",
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
        _key: "s11",
        text: "The pipeline generates ADP (Average Draft Position) files for each season containing positional rankings across three scoring formats: full PPR, half PPR, and standard. This multi-format approach allows the system to adapt to different league configurations while training on the same underlying player data.",
      },
    ],
  },

  // --- Draft Simulation ---
  {
    _type: "block",
    _key: "h3_simulation",
    style: "h3",
    children: [
      { _type: "span", _key: "s12", text: "Draft Simulation Engine" },
    ],
  },
  {
    _type: "block",
    _key: "p_sim1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s13",
        text: "The simulation engine models a 12-team, 16-round snake draft with realistic constraints. Each trial randomly selects a historical season (2018-2022) for the player pool. Eleven bot opponents draft using weighted probability distributions that shift across rounds: early rounds favor top-ranked players heavily (64/20/10/5/1% across top 5 candidates), while later rounds use flatter distributions reflecting the increased unpredictability of real drafts. Position limits mirror standard league rules: up to 4 QBs, 8 RBs, 8 WRs, 3 TEs, 3 Ks, and 3 DSTs per team.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_sim2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s14",
        text: "Post-draft, the engine assembles optimal starting lineups (1 QB, 2 RB, 2 WR, 1 TE, 1 K, 1 DST, 1 Flex) and applies a waiver wire correction — if a team's drafted starter at a position performs worse than a replacement-level player available on waivers, the system swaps them out. This correction prevents the model from being penalized for late-round busts that would realistically be dropped in-season, producing more accurate team-level scoring.",
      },
    ],
  },

  // --- RL Agent ---
  {
    _type: "block",
    _key: "h3_agent",
    style: "h3",
    children: [
      { _type: "span", _key: "s15", text: "Reinforcement Learning Agent" },
    ],
  },
  {
    _type: "block",
    _key: "p_agent1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s16",
        text: "The RL agent is built on Stable-Baselines3's PPO (Proximal Policy Optimization) implementation within a custom Gymnasium environment. The observation space encodes two types of information: a binary availability mask over the entire player pool (which players remain undrafted) and the agent's current roster composition by position (QB/RB/WR/TE counts). The action space is discrete — at each turn, the agent selects one player from the available pool.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_agent2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s17",
        text: "Reward shaping was one of the most iterative design decisions. I experimented with end-of-draft total fantasy points, per-pick fantasy value, and Value Over Replacement Position (VORP) signals before settling on a reward structure that balances immediate pick quality with positional scarcity awareness. The agent learns through thousands of episodes, each a complete 16-round draft against 11 simulated opponents drawing from randomized historical seasons — ensuring the policy generalizes across different player pools rather than memorizing specific year-player combinations.",
      },
    ],
  },

  // --- Design Concepts ---
  {
    _type: "block",
    _key: "h3_concepts",
    style: "h3",
    children: [
      { _type: "span", _key: "s18", text: "Key Design Concepts" },
    ],
  },
  {
    _type: "block",
    _key: "p_concepts1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s19",
        marks: ["strong"],
        text: "Positional Scarcity:",
      },
      {
        _type: "span",
        _key: "s20",
        text: " The ratio of remaining quality players to total remaining players per position. When this ratio drops sharply at a position, the opportunity cost of waiting rises — the agent learns to detect and respond to these scarcity signals rather than following fixed position-ordering rules.",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_concepts2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s21",
        marks: ["strong"],
        text: "Value Over Replacement (VOR):",
      },
      {
        _type: "span",
        _key: "s22",
        text: " Normalizes player value across positions by measuring how much better a player is than the baseline replacement-level player at the same position. A running back projected for 250 fantasy points and a quarterback projected for 350 points might have similar VOR if the replacement-level QB is much closer to 350 than the replacement-level RB is to 250.",
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "p_concepts3",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s23",
        marks: ["strong"],
        text: "ADP Tier Bucketing:",
      },
      {
        _type: "span",
        _key: "s24",
        text: " Players are grouped into Top/Mid/Low tiers per position to prevent the agent from memorizing specific player identities or year-specific rankings. This abstraction forces the policy to learn generalizable draft strategy rather than overfitting to historical data.",
      },
    ],
    markDefs: [],
  },

  // --- Key Features ---
  {
    _type: "block",
    _key: "h2_features",
    style: "h2",
    children: [{ _type: "span", _key: "s25", text: "Key Features" }],
  },
  {
    _type: "block",
    _key: "p_feat1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s26",
        marks: ["strong"],
        text: "Complete Fantasy Scoring Engine",
      },
      {
        _type: "span",
        _key: "s27",
        text: " — Handles all PPR scoring categories including passing/rushing/receiving stats, field goals by distance bracket, defensive scoring with points-allowed and yards-allowed buckets, return TDs, two-point conversions, and fumbles across 6 NFL seasons.",
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
        _key: "s28",
        marks: ["strong"],
        text: "Monte Carlo Draft Simulator",
      },
      {
        _type: "span",
        _key: "s29",
        text: " — Runs 1,000 complete 12-team snake drafts per trial with probabilistic bot opponents whose behavior patterns shift across draft rounds, producing statistically robust baseline performance metrics.",
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
        _key: "s30",
        marks: ["strong"],
        text: "Custom Gymnasium RL Environment",
      },
      {
        _type: "span",
        _key: "s31",
        text: " — Purpose-built OpenAI Gymnasium environment with configurable observation/action spaces, multi-agent opponent simulation, and flexible reward shaping for PPO training.",
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
        _key: "s32",
        marks: ["strong"],
        text: "Waiver Wire Correction",
      },
      {
        _type: "span",
        _key: "s33",
        text: " — Post-draft roster optimization that simulates in-season waiver pickups, replacing drafted busts with replacement-level alternatives to produce realistic season-long scoring.",
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
        _key: "s34",
        marks: ["strong"],
        text: "Multi-Season Generalization",
      },
      {
        _type: "span",
        _key: "s35",
        text: " — Training across randomized historical seasons (2018-2023) with ADP tier bucketing prevents overfitting to specific player pools and forces the agent to learn transferable draft strategy.",
      },
    ],
    markDefs: [],
  },

  // --- Results & Insights ---
  {
    _type: "block",
    _key: "h2_results",
    style: "h2",
    children: [{ _type: "span", _key: "s36", text: "Results & Insights" }],
  },
  {
    _type: "block",
    _key: "p_results1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s37",
        text: "The Monte Carlo baseline simulator established statistical benchmarks across 1,000 complete drafts, producing over 10 MB of detailed results data and 3.5 MB of season-long fantasy rankings. These baselines quantify the expected performance of weighted-probability drafting strategies and serve as the target the RL agent must beat.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_results2",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s38",
        text: "One of the most interesting findings during development was that Value Over Replacement Position (VORP), widely considered the gold standard for fantasy draft strategy, introduced training instability when used as a direct reward signal. The agent would over-index on high-VORP positions in early rounds at the expense of depth. This led me to explore tiered reward structures that balance per-pick value with roster completeness — a nuance that mirrors the real-world tension between 'stars and scrubs' versus 'balanced roster' draft strategies.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p_results3",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s39",
        text: "The project remains actively in development, with ongoing work on opponent behavior modeling (tracking competitor team needs and draft tendencies), dynamic tier depth tracking, and scaling training to 100K-1M timesteps for policy convergence.",
      },
    ],
  },

  // --- Tech Stack ---
  {
    _type: "block",
    _key: "h2_tech",
    style: "h2",
    children: [{ _type: "span", _key: "s40", text: "Tech Stack" }],
  },
  {
    _type: "block",
    _key: "p_tech1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s41",
        marks: ["strong"],
        text: "Reinforcement Learning:",
      },
      {
        _type: "span",
        _key: "s42",
        text: " Stable-Baselines3 (PPO, A2C), Gymnasium, TensorBoard",
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
        _key: "s43",
        marks: ["strong"],
        text: "Data Processing:",
      },
      {
        _type: "span",
        _key: "s44",
        text: " Python, pandas, NumPy, nfl_data_py (play-by-play data source)",
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
        _key: "s45",
        marks: ["strong"],
        text: "Simulation:",
      },
      {
        _type: "span",
        _key: "s46",
        text: " Custom Monte Carlo engine (1,000 trials), probabilistic bot opponents, waiver wire correction system",
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
        _key: "s47",
        marks: ["strong"],
        text: "Visualization:",
      },
      {
        _type: "span",
        _key: "s48",
        text: " matplotlib, Jupyter Notebooks (EDA and analysis)",
      },
    ],
    markDefs: [],
  },
];

async function seed() {
  const doc = {
    _id: PROJECT_ID,
    _type: "project",
    title: "DraftingAlpha",
    slug: { _type: "slug", current: "draftingalpha" },
    featured: false,
    description:
      "Reinforcement learning system that learns optimal fantasy football draft strategy. Trains a PPO agent across 1,000 simulated snake drafts using six seasons of NFL data to discover positional scarcity and value-over-replacement strategies that outperform conventional heuristics.",
    techStack: [
      "Python",
      "Stable-Baselines3",
      "Gymnasium",
      "PPO",
      "pandas",
      "NumPy",
      "TensorBoard",
      "nfl_data_py",
    ],
    links: {
      github: "https://github.com/choym92/DraftingAlpha",
    },
    body,
    order: 1,
  };

  console.log("Creating/replacing DraftingAlpha project document...");
  await client.createOrReplace(doc);
  console.log(
    "Done! DraftingAlpha project created with full case study body."
  );
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
