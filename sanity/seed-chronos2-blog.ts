/**
 * Seed script to create a technical blog post about Amazon Chronos-2
 * zero-shot demand forecasting in supply chain.
 *
 * Usage:
 *   npx tsx sanity/seed-chronos2-blog.ts
 *
 * Requires: `npx sanity login` first (reads token from ~/.config/sanity/config.json)
 */
import { createClient } from "@sanity/client";
import { readFileSync, createReadStream } from "fs";
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

function p(text: string, key?: string) {
  return {
    _type: "block",
    _key: key ?? k("p"),
    style: "normal",
    children: [{ _type: "span", _key: k("s"), text }],
  };
}

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

function code(language: string, codeText: string) {
  return {
    _type: "code",
    _key: k("code"),
    language,
    code: codeText,
  };
}

function callout(type: "info" | "warning" | "tip", text: string) {
  return {
    _type: "callout",
    _key: k("callout"),
    type,
    text,
  };
}

function quote(text: string) {
  return {
    _type: "block",
    _key: k("bq"),
    style: "blockquote",
    children: [{ _type: "span", _key: k("s"), text }],
  };
}

function img(assetRef: string, caption?: string) {
  return {
    _type: "image",
    _key: k("img"),
    asset: { _type: "reference", _ref: assetRef },
    ...(caption ? { caption } : {}),
  };
}

// ---------------------------------------------------------------------------
// Image upload + blog post body
// ---------------------------------------------------------------------------
const IMAGE_DIR =
  "/Users/paulcho/Projects/LG_DS/00.SCM/notebooks/extracted_images";

const IMAGE_FILES = [
  {
    file: "02_cell9_img1.png",
    caption:
      "Syntetos-Boylan demand classification (left), SKU lifecycle distribution (center), and a successor pair example showing concatenated demand history (right).",
  },
  {
    file: "02_cell15_img2.png",
    caption:
      "Chronos-2 ZeroShot baseline: WAPE distribution, Smooth vs Erratic comparison, Chronos vs Last Year scatter, and sample forecast plots for best/worst SKUs.",
  },
  {
    file: "02_cell16_img3.png",
    caption:
      "Per-SKU accuracy: Chronos vs Last Year scatter (left) showing 89% win rate, and WAPE by weekly volume tier (right) — high-volume SKUs forecast significantly better.",
  },
  {
    file: "02_cell26_img4.png",
    caption:
      "Replenishment demand (bars) vs Weeks of Supply (red line) for top SKUs. WOS inversely correlates with future demand — a key covariate signal for fine-tuning.",
  },
  {
    file: "02_cell29_img5.png",
    caption:
      "National vs warehouse-level sparsity analysis. Top-left: zero-week distribution shows WH-SKU series are far sparser. Bottom-left: per-warehouse volume split between direct forecast (Tier 1) and national-to-split (Tier 2).",
  },
  {
    file: "03_cell15_img1.png",
    caption:
      "WH-level Chronos-2 ZeroShot performance: WAPE distribution vs Last Year (top-left), per-warehouse accuracy bars (top-right), and Chronos bias distribution showing slight under-forecasting tendency (bottom-right).",
  },
];

async function uploadImages(): Promise<Record<string, string>> {
  const refs: Record<string, string> = {};
  for (const { file } of IMAGE_FILES) {
    const path = join(IMAGE_DIR, file);
    console.log(`  Uploading ${file}...`);
    const asset = await client.assets.upload(
      "image",
      createReadStream(path),
      { filename: file }
    );
    refs[file] = asset._id;
    console.log(`  → ${asset._id}`);
  }
  return refs;
}

function buildBody(refs: Record<string, string>) {
  return [
    // --- TL;DR ---
    h2("TL;DR"),
    p(
      "I ran Amazon's Chronos-2 foundation model zero-shot against ~280 SKUs of weekly demand data in a consumer electronics supply chain. " +
        "Without any fine-tuning, Chronos-2 beat last year's actuals on 89% of SKUs and achieved ~43% median WAPE — " +
        "roughly 2x better than the naive baseline. But the biggest lesson wasn't about the model: " +
        "switching from warehouse-level to national-level forecasting with proportional allocation improved accuracy from 52% to 18% WAPE. " +
        "Aggregation strategy matters more than model sophistication."
    ),

    // --- The Problem ---
    h2("The Problem: SKU-Level Demand Forecasting in Supply Chain"),
    p(
      "Enterprise supply chain demand forecasting is a different beast from the clean univariate benchmarks " +
        "that foundation models are typically evaluated on. You're dealing with intermittent demand patterns, " +
        "product lifecycle transitions where successor SKUs inherit demand from discontinued models, " +
        "and the fundamental tension between forecast granularity and data sparsity."
    ),
    p(
      "At LG, I was tasked with building a weekly SKU-level demand forecast for the US replenishment channel — " +
        "roughly 260 qualifying SKUs flowing through multiple distribution centers. " +
        "The existing approach relied heavily on manual, spreadsheet-based forecasting " +
        "that struggled with new product launches and seasonal transitions."
    ),
    p(
      "The question I wanted to answer first: can a pretrained foundation model provide a usable zero-shot baseline " +
        "without any domain-specific training? If so, that baseline becomes the floor we iterate from — " +
        "not the ceiling."
    ),

    // --- Why Chronos-2 ---
    h2("Why Chronos-2? The Foundation Model Bet"),
    p(
      "Amazon's Chronos-2, released in October 2025, represents the second generation of their time series " +
        "foundation model family. The architectural leap from the original Chronos is substantial — " +
        "it went from a T5 encoder-decoder that could only handle univariate series to an encoder-only transformer " +
        "that supports multivariate inputs, covariates, and in-context learning across groups of related series."
    ),
    quote(
      "Chronos-2 achieved a 90.7% win rate across 100 benchmark tasks on fev-bench, " +
        "making it the top-performing zero-shot time series foundation model as of late 2025."
    ),
    p(
      "I chose Chronos-2 over alternatives like Google's TimesFM-2.5 and Salesforce's Moirai 2.0 for three reasons. " +
        "First, the AutoGluon integration is seamless — a single hyperparameter switch gives you Chronos-2 " +
        "with no boilerplate. Second, it's Apache-2.0 licensed and runs locally, which matters in enterprise environments " +
        "where sending demand data to external APIs raises procurement questions. " +
        "Third, the 120M parameter model is small enough to run on a single GPU or even Apple Silicon " +
        "with MPS acceleration, which kept my iteration cycles fast during experimentation."
    ),
    p(
      "Here are the key specs that made Chronos-2 compelling for supply chain work:"
    ),
    code(
      "text",
      `Chronos-2 at a glance:
├── Architecture:    Encoder-only transformer (T5 encoder base)
├── Parameters:      120M (base) / 28M (small)
├── Context window:  Up to 8,192 time steps
├── Prediction:      Up to 1,024 steps ahead
├── Multivariate:    Yes (Group Attention mechanism)
├── Covariates:      Past-only, known future, categorical
├── Output:          21 quantile levels (probabilistic forecasts)
├── Speed:           300+ series/sec on A10G GPU
└── License:         Apache-2.0 (open source)`
    ),

    // --- Experiment Setup ---
    h2("Experiment Setup: From Raw Data to Forecast-Ready Series"),
    p(
      "The raw data came from shipment records — roughly 17 million rows spanning multiple years of weekly demand " +
        "across all US distribution channels. Not all of this is forecastable. " +
        "The data engineering pipeline had to make several non-obvious decisions before a single forecast could be generated."
    ),

    h3("Demand Classification: Not Everything Should Be Forecasted"),
    p(
      "I used the Syntetos-Boylan classification framework to categorize every SKU into one of four demand patterns " +
        "based on two metrics: Average Demand Interval (ADI) and squared Coefficient of Variation (CV²). " +
        "The ADI threshold of 1.32 and CV² threshold of 0.49 split the SKUs into Smooth, Erratic, Intermittent, and Lumpy categories."
    ),
    code(
      "python",
      `# Syntetos-Boylan demand classification
def classify_demand(series: pd.Series, adi_thresh=1.32, cv2_thresh=0.49):
    """Classify demand pattern based on ADI and CV² thresholds."""
    non_zero = series[series > 0]
    if len(non_zero) < 2:
        return "TooShort"

    # ADI: average interval between non-zero demands
    intervals = np.diff(np.where(series > 0)[0])
    adi = intervals.mean() if len(intervals) > 0 else float('inf')

    # CV²: squared coefficient of variation of non-zero demands
    cv2 = (non_zero.std() / non_zero.mean()) ** 2

    if adi < adi_thresh and cv2 < cv2_thresh:
        return "Smooth"
    elif adi < adi_thresh and cv2 >= cv2_thresh:
        return "Erratic"
    elif adi >= adi_thresh and cv2 < cv2_thresh:
        return "Intermittent"
    else:
        return "Lumpy"`
    ),
    // Image: Syntetos-Boylan classification
    img(refs["02_cell9_img1.png"], IMAGE_FILES[0].caption),

    p(
      "Out of ~2,300 product slots, only about 780 had Active lifecycle status. " +
        "Of those, ~285 qualified as Smooth or Erratic — the patterns where point forecasting methods make sense. " +
        "Intermittent and Lumpy demand patterns require specialized methods like SBA or Croston's, " +
        "and I deliberately excluded them from the Chronos-2 baseline to keep the evaluation clean."
    ),

    h3("Successor Pair Handling"),
    p(
      "Consumer electronics has a unique data challenge: product succession. " +
        "When a new refrigerator model replaces an old one, demand doesn't start from zero — " +
        "it inherits the predecessor's demand history. I identified 57 successor pairs " +
        "and concatenated their time series to give Chronos-2 a continuous demand signal. " +
        "Without this step, every new model would look like a cold-start problem with only a few weeks of history."
    ),

    // --- Zero-Shot Results ---
    h2("Zero-Shot Results: Better Than Expected"),
    p(
      "The zero-shot baseline used AutoGluon's TimeSeriesPredictor with Chronos-2, SeasonalNaive, and AutoETS. " +
        "The setup is almost embarrassingly simple:"
    ),
    code(
      "python",
      `from autogluon.timeseries import TimeSeriesPredictor, TimeSeriesDataFrame

# Convert pandas DataFrame to AutoGluon format
ts_df = TimeSeriesDataFrame.from_data_frame(
    df,
    id_column="item_id",
    timestamp_column="week",
    target="qty"
)

predictor = TimeSeriesPredictor(
    prediction_length=12,         # 12-week forecast horizon
    eval_metric="WQL",            # Weighted Quantile Loss
    path="outputs/ag_zeroshot_baseline",
)

predictor.fit(
    train_data=ts_df,
    hyperparameters={
        "Chronos2": [{
            "device": "mps",      # Apple Silicon GPU
            "ag_args": {"name_suffix": "ZeroShot"}
        }],
        "SeasonalNaive": {},
        "AutoETS": {},
    },
    enable_ensemble=True,
)`
    ),
    p(
      "AutoGluon's WeightedEnsemble evaluated all three models and assigned 100% weight to Chronos-2. " +
        "SeasonalNaive and AutoETS couldn't compete — Chronos-2 dominated the Weighted Quantile Loss metric " +
        "by a wide margin."
    ),
    callout(
      "info",
      "In our supply chain forecasting experiment, Chronos-2's zero-shot predictions outperformed " +
        "last year's actuals on 89% of SKUs — without any fine-tuning or domain-specific training."
    ),

    // Image: 6-panel performance dashboard
    img(refs["02_cell15_img2.png"], IMAGE_FILES[1].caption),

    p(
      "Here's how the results broke down across different dimensions:"
    ),
    code(
      "text",
      `Model Leaderboard (Weighted Quantile Loss, lower = better):
┌──────────────────────┬────────┐
│ Chronos-2 ZeroShot   │ -0.326 │  ← best
│ SeasonalNaive        │ -0.560 │
│ AutoETS              │ -0.568 │
└──────────────────────┴────────┘

WAPE by demand pattern:
  Smooth demand:     ~39% median WAPE
  Erratic demand:    ~59% median WAPE

WAPE by weekly volume tier:
  Very High (>1K/wk): ~19% median  ← production-ready
  High (200-1K/wk):   ~39% median
  Mid (50-200/wk):    ~45% median
  Low (<50/wk):       ~46% median

Quality distribution:
  54% of SKUs below 40% WAPE (usable)
  vs. 19% for Last Year baseline`
    ),

    // Image: Chronos vs Last Year scatter + Volume tier
    img(refs["02_cell16_img3.png"], IMAGE_FILES[2].caption),

    p(
      "The volume tier breakdown was the most actionable finding. " +
        "High-volume SKUs — the ones that matter most for inventory planning — " +
        "had dramatically better accuracy. For the top 20 sellers, 80% were already at usable accuracy levels " +
        "with zero-shot alone. This follows a Pareto pattern: the SKUs you care most about forecast best " +
        "because they have the most consistent, learnable demand signals."
    ),

    // --- The Granularity Trap ---
    h2("The Granularity Trap: National vs. Warehouse-Level Forecasting"),
    p(
      "This was the most important finding of the entire experiment, " +
        "and it had nothing to do with Chronos-2 specifically."
    ),
    p(
      "My initial approach was to forecast demand directly at the warehouse-SKU level — " +
        "each warehouse gets its own forecast for each product. " +
        "This seems intuitive: if you need warehouse-level inventory decisions, " +
        "forecast at the warehouse level. I ran Chronos-2 on ~976 warehouse-SKU series " +
        "and got a median WAPE of 52%."
    ),
    p(
      "Then I tried the alternative: forecast at the national level (all warehouses aggregated) " +
        "and split the forecast proportionally based on each warehouse's historical share. " +
        "The result was 18% median WAPE — a 3x improvement from changing the aggregation strategy, not the model."
    ),
    quote(
      "National-level forecast with proportional warehouse allocation achieved ~18% median WAPE " +
        "versus ~52% for direct warehouse-level forecasting — " +
        "a 3x accuracy improvement from changing the aggregation strategy, not the model."
    ),

    // Image: Sparsity analysis
    img(refs["02_cell29_img5.png"], IMAGE_FILES[4].caption),

    p(
      "Why does this happen? Data sparsity. When you break demand into warehouse-level series, " +
        "each individual series becomes much more intermittent. A product that sells 500 units nationally per week " +
        "might only sell 30-80 units at any given warehouse — with many zero-demand weeks. " +
        "Chronos-2 (or any model) can't learn patterns from noise. " +
        "The national series is smoother, has clearer seasonality, and gives the model more signal to work with."
    ),
    p(
      "The sparsity analysis made this crystal clear: " +
        "at the national level, the median zero-week percentage was under 5%. " +
        "At the warehouse-SKU level, it jumped to over 30%. " +
        "Many warehouse-SKU combinations had 50-70% zero weeks — " +
        "far too sparse for any point forecasting method to handle reliably."
    ),

    // Image: WH-level performance
    img(refs["03_cell15_img1.png"], IMAGE_FILES[5].caption),

    callout(
      "tip",
      "Before choosing your forecast granularity, plot the zero-week distribution at each level. " +
        "If more than 20% of your series have >30% zero weeks, " +
        "you're better off forecasting at a higher level and disaggregating."
    ),

    // --- Key Decisions ---
    h2("Key Decisions and Tradeoffs"),

    h3("Why Zero-Shot First"),
    p(
      "It's tempting to jump straight to fine-tuning, but zero-shot serves a critical purpose: " +
        "it establishes a cost-free baseline. If zero-shot already beats your existing approach, " +
        "you've validated the model choice before investing in training infrastructure. " +
        "If it doesn't, you know exactly where the gaps are — which demand patterns need help, " +
        "which volume tiers are underperforming — and can target fine-tuning accordingly."
    ),

    h3("AutoGluon vs. Raw Chronos-2 Pipeline"),
    p(
      "You can use Chronos-2 directly via the chronos-forecasting package, " +
        "which gives you full control over the prediction pipeline. " +
        "I chose AutoGluon's wrapper instead because it handles train/test splitting, " +
        "ensemble construction, and model comparison out of the box. " +
        "The tradeoff is less flexibility — you can't easily customize the tokenization or add custom loss functions. " +
        "For a baseline experiment, AutoGluon's convenience outweighed the limitations."
    ),
    code(
      "python",
      `# Direct Chronos-2 usage (more control, more boilerplate)
from chronos import Chronos2Pipeline

pipeline = Chronos2Pipeline.from_pretrained(
    "amazon/chronos-2",
    device_map="mps",
)
predictions = pipeline.predict_df(
    context_df,
    prediction_length=12,
    quantile_levels=[0.1, 0.5, 0.9],
    id_column="item_id",
    timestamp_column="week",
    target="qty",
)

# vs. AutoGluon wrapper (simpler, handles evaluation)
predictor = TimeSeriesPredictor(prediction_length=12)
predictor.fit(train_data, presets="chronos2")`
    ),

    h3("Apple Silicon for Experimentation"),
    p(
      "All experiments ran on an M-series MacBook Pro using MPS (Metal Performance Shaders) acceleration. " +
        "The 120M parameter model fits comfortably in unified memory, " +
        "and inference for 285 series with 12-week horizons completed in under a minute. " +
        "For production deployment, I'd move to a GPU instance — but for rapid experimentation, " +
        "local MPS inference meant I could iterate without waiting for cloud instances to spin up."
    ),

    // --- What's Next: Expanded Fine-Tuning Plan ---
    h2("What's Next: The Fine-Tuning Roadmap"),
    p(
      "The zero-shot baseline tells us where the floor is. The roadmap to get from ~43% to a target of under 25% median WAPE " +
        "centers on LoRA fine-tuning with domain-specific covariates — signals the pretrained model has never seen."
    ),

    h3("LoRA Fine-Tuning with Covariates"),
    p(
      "Chronos-2 supports parameter-efficient fine-tuning through LoRA (Low-Rank Adaptation) via AutoGluon. " +
        "Rather than retraining the full 120M parameters, LoRA freezes the pretrained weights and trains small adapter matrices — " +
        "typically adding less than 1% extra parameters. This means fine-tuning on our dataset takes minutes, not hours, " +
        "and the pretrained zero-shot capability is preserved as a fallback."
    ),
    code(
      "python",
      `# Chronos-2 LoRA fine-tuning with covariates via AutoGluon
predictor = TimeSeriesPredictor(
    prediction_length=12,
    eval_metric="WQL",
)

predictor.fit(
    train_data=ts_df,
    hyperparameters={
        "Chronos2": [{
            "fine_tune": True,          # enable LoRA
            "fine_tune_epochs": 5,
            "fine_tune_lr": 1e-4,
            "device": "cuda",           # production GPU
            "context_length": 52 * 2,   # 2 years of weekly context
            "ag_args": {"name_suffix": "FineTuned"}
        }],
    },
    known_covariates_names=[
        "is_promo_week",
        "is_holiday_week",
        "ga4_sessions_lag2",
    ],
    static_features=static_df,  # product category, demand class, etc.
)`
    ),

    h3("Weeks of Supply (WOS) as a Past-Only Covariate"),
    p(
      "Our zero-shot analysis already revealed a strong inverse relationship between Weeks of Supply and future demand. " +
        "When WOS drops below a critical threshold, replenishment orders spike — and when inventory is bloated, demand flatlines. " +
        "This isn't a causal relationship; it's a censored demand signal. " +
        "Low inventory means stockouts, which means the demand data we see is artificially suppressed."
    ),

    // Image: Sales vs WOS
    img(refs["02_cell26_img4.png"], IMAGE_FILES[3].caption),

    p(
      "WOS enters the model as a past-only covariate — we know historical inventory levels but can't predict future ones. " +
        "Chronos-2 can learn to adjust its forecast when it sees WOS patterns that historically preceded demand shifts. " +
        "Each SKU has a different critical WOS threshold, so the model needs to learn per-product sensitivity rather than a single global rule."
    ),

    h3("Promotional Calendar and Holidays"),
    p(
      "Promotional events create demand spikes that are impossible to forecast from historical patterns alone — " +
        "they're exogenous shocks by definition. The advantage is that we know them in advance. " +
        "Promo calendars and holiday schedules enter the model as known future covariates, " +
        "which is precisely the covariate type Chronos-2 was designed to handle."
    ),
    p(
      "The promotional calendar includes retailer-specific events (Home Depot spring sales, Best Buy holiday promotions, " +
        "Costco seasonal rotations) as well as category-wide events (Black Friday, Memorial Day, Labor Day). " +
        "Holidays are encoded as a binary feature per week with lead/lag windows to capture pre-holiday buildup " +
        "and post-holiday demand drops."
    ),
    code(
      "python",
      `# Known future covariates: promo + holiday features
future_df["is_promo_week"] = future_df["week"].isin(promo_calendar)
future_df["is_holiday_week"] = future_df["week"].isin(holiday_weeks)

# Holiday lead/lag windows (demand shifts ±2 weeks around holidays)
for lag in [-2, -1, 1, 2]:
    shifted = holiday_weeks + pd.Timedelta(weeks=lag)
    future_df[f"holiday_window_{lag}"] = future_df["week"].isin(shifted)`
    ),

    h3("GA4 Web Traffic as a Leading Indicator"),
    p(
      "This is the most unconventional covariate in the pipeline — and potentially the most valuable. " +
        "Google Analytics 4 product page sessions act as a leading demand indicator: " +
        "consumers research products online before purchasing through retail channels. " +
        "A spike in product page views on lg.com today predicts a replenishment order from Home Depot two weeks later."
    ),
    p(
      "GA4 traffic enters as a past-only covariate with a 2-week lag. " +
        "We can't predict future web traffic, but we can tell the model what happened recently and let it adjust. " +
        "The hypothesis is that GA4 sessions capture demand intent that shipment data can't — " +
        "especially for new product launches where there's no shipment history but web interest is already building."
    ),
    callout(
      "info",
      "GA4 web traffic as a demand covariate bridges the gap between consumer intent and wholesale orders. " +
        "Product page sessions on lg.com precede retail replenishment orders by approximately 2 weeks — " +
        "making it a natural leading indicator for supply chain forecasting."
    ),

    h3("Specialized Models for Intermittent Demand"),
    p(
      "The ~450 Intermittent and Lumpy SKUs were excluded from the Chronos-2 baseline. " +
        "These demand patterns — characterized by long stretches of zero demand punctuated by irregular spikes — " +
        "fundamentally break point forecasting models. " +
        "Methods like SBA (Syntetos-Boylan Approximation) and IMAPA (Intermittent Multiple Aggregation Prediction Algorithm) " +
        "are purpose-built for these patterns and will run alongside Chronos-2 in a hybrid model stack."
    ),
    p(
      "The final architecture maps demand classification directly to model selection:"
    ),
    code(
      "text",
      `Model Stack by Demand Pattern:
┌──────────────┬─────────────────────────────────┐
│ Smooth       │ Chronos-2 LoRA fine-tuned        │
│ Erratic      │ Chronos-2 LoRA fine-tuned        │
│ Intermittent │ SBA / IMAPA                      │
│ Lumpy        │ SBA / IMAPA                      │
│ Cold-start   │ Chronos-2 zero-shot (fallback)   │
└──────────────┴─────────────────────────────────┘

Covariate inputs (fine-tuned model):
├── Past-only:     WOS (inventory), GA4 sessions (2-wk lag)
├── Known future:  Promo calendar, holiday flags, holiday windows
└── Static:        Product category, demand class, lifecycle stage`
    ),

    // --- Conclusion ---
    h2("The Bottom Line"),
    p(
      "Amazon Chronos-2 zero-shot is a legitimate starting point for production demand forecasting. " +
        "On smooth, high-volume SKUs, it's already usable out of the box. " +
        "The model's real value isn't replacing domain expertise — " +
        "it's eliminating the cold-start problem for new SKUs and providing a strong default " +
        "that domain-specific fine-tuning can improve upon."
    ),
    p(
      "But if there's one takeaway from this experiment, it's this: " +
        "the aggregation strategy you choose matters more than the model you choose. " +
        "I got a bigger accuracy improvement from switching national-to-split allocation " +
        "than from any model selection decision. " +
        "Before fine-tuning your foundation model, make sure you're forecasting at the right level of granularity."
    ),
    p(
      "The next chapter is fine-tuning with domain covariates — WOS, promo calendars, holidays, and GA4 traffic. " +
        "If zero-shot got us to 43% median WAPE, I expect fine-tuning with these signals " +
        "to push us well below 25%. I'll share those results in a follow-up post."
    ),
  ];
}

async function seed() {
  console.log("Uploading images to Sanity...");
  const refs = await uploadImages();
  console.log(`\nUploaded ${Object.keys(refs).length} images.\n`);

  const body = buildBody(refs);

  const POST_ID = "drafts.post-chronos2-demand-forecasting";
  const doc = {
    _id: POST_ID,
    _type: "post",
    title:
      "Zero-Shot Demand Forecasting with Amazon Chronos-2: Lessons from Supply Chain Production",
    slug: {
      _type: "slug",
      current: "chronos2-zero-shot-demand-forecasting-supply-chain",
    },
    excerpt:
      "How Amazon's Chronos-2 outperformed traditional baselines in zero-shot supply chain demand forecasting — and why forecast granularity matters more than model complexity.",
    // publishedAt omitted — publish manually from Studio when ready
    tags: ["Time Series", "Machine Learning", "Supply Chain", "Forecasting"],
    body,
  };

  console.log("Creating/replacing blog post draft...");
  await client.createOrReplace(doc);
  console.log(
    "Done! Draft created: 'Zero-Shot Demand Forecasting with Amazon Chronos-2'"
  );
  console.log("→ Open Sanity Studio to review and publish.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
