/**
 * One-time seed script to create/update the Resume document in Sanity.
 *
 * Usage:
 *   npx tsx sanity/seed-resume.ts
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

function block(key: string, text: string) {
  return {
    _type: "block",
    _key: key,
    style: "normal" as const,
    children: [{ _type: "span", _key: `${key}_s`, text }],
  };
}

const RESUME_ID = "resume";

async function seed() {
  // Look up araverus project ref
  const araverus = await client.fetch(
    `*[_type == "project" && slug.current == "araverus"][0]._id`
  );

  const doc = {
    _id: RESUME_ID,
    _type: "resume",
    experience: [
      {
        _key: "exp_hsad",
        company: "HSAD America",
        role: "Sr. Manager - Data Science",
        startDate: "2022-01-01",
        current: true,
        description: [
          block("hsad1", "Engineered a transformer-based multi-label classification model on LG.com user behavior data, analyzing intent for precise audience targeting for return visits. Achieved a 10% increase in website revisit rate."),
          block("hsad2", "Built an NLP pipeline that summarized 50K+ product reviews, using BERT, UMAP, HDBSCAN, and TF-IDF to extract high-signal product features and improve UX quality, leading to a 14% increase in user engagement."),
          block("hsad3", "Led psychological segmentation by mapping attitudinal survey data to 20M-customer CDP and deploying tailored marketing content; powered personalized campaigns that achieved a 2x lift in both CTR and CVR through email."),
          block("hsad4", "Streamlined call center operation by transcribing audio files using speech-to-text and building a fine-tuned LLM model to extract caller intent and root cause analysis, significantly improving resolution efficiency and agent response time."),
          block("hsad5", "Developed a Marketing Mix Modeling (MMM) tool by using Google's lightweight Bayesian framework to evaluate media channel effectiveness and optimize budget allocation, data-driven decisions that improved ROI by 15%."),
        ],
      },
      {
        _key: "exp_mars",
        company: "Mars",
        role: "Data Scientist",
        startDate: "2019-09-01",
        endDate: "2022-01-01",
        current: false,
        description: [
          block("mars1", "Optimized factory production processes by solving a convex optimization problem using cvxpy and Gurobi, balancing scheduling, raw material availability, and sales forecasts, resulting in a 15% improvement in factory throughput."),
          block("mars2", "Built a scalable time-series clustering algorithm using Dynamic Time Warping and ANN to group products by forecasted sales behavior, reducing forecast error by 22%, which improved the speed of inventory planning across key product lines."),
        ],
      },
      {
        _key: "exp_nydsa",
        company: "NYC Data Science Academy",
        role: "Teaching Assistant",
        startDate: "2019-02-01",
        endDate: "2019-09-01",
        current: false,
        description: [
          block("nydsa1", "Specialization in Deep Learning and Big Data. Designed convolutional neural network, computer vision model for classifying people's age, gender, and race. Partnered with MotionFlow, a smart AIoT ad company, delivering inference under 0.5 seconds with over 92% accuracy."),
        ],
      },
      {
        _key: "exp_samsung",
        company: "Samsung Electronics",
        role: "Supply Chain S&OP/Forecast Analyst",
        startDate: "2017-01-01",
        endDate: "2019-02-01",
        current: false,
        description: [
          block("samsung1", "Reduced daily backorder rates to under 2% by automating demand forecasting operation using VBA incorporating Holt-Winters. Designed delivery-date driven prioritization and improving forecast accuracy and speed in demand planning."),
        ],
      },
    ],
    education: [
      {
        _key: "edu_utaustin",
        institution: "University of Texas at Austin",
        degree: "Bachelor of Science in Mathematical Statistics",
        field: "Mathematical Statistics",
        startDate: "2012-08-01",
        endDate: "2016-12-01",
      },
      {
        _key: "edu_uw",
        institution: "University of Washington",
        degree: "Certificate in Machine Learning",
        startDate: "2019-06-01",
        endDate: "2019-09-01",
      },
      {
        _key: "edu_stanford",
        institution: "Stanford University",
        degree: "Certificate in Machine Learning",
        startDate: "2019-09-01",
        endDate: "2019-11-01",
      },
    ],
    skills: [
      {
        _key: "skill_lang",
        category: "Languages",
        items: ["Python", "SQL", "R"],
      },
      {
        _key: "skill_frameworks",
        category: "Frameworks & Tools",
        items: [
          "PyTorch",
          "TensorFlow",
          "Scikit-learn",
          "Transformers",
          "PySpark",
          "FastAPI",
          "Vector DBs",
          "Airflow",
          "MLflow",
          "Docker",
          "Kubernetes",
        ],
      },
      {
        _key: "skill_cloud",
        category: "Cloud",
        items: [
          "GCP (Vertex AI, BigQuery)",
          "Azure (Azure ML, Databricks)",
        ],
      },
      {
        _key: "skill_domain",
        category: "Domain & Concepts",
        items: [
          "Data Science",
          "Machine Learning",
          "Deep Learning",
          "AI",
          "NLP",
          "RAG",
        ],
      },
    ],
    ...(araverus
      ? {
          projects: [
            { _type: "reference", _ref: araverus, _key: "proj_araverus" },
          ],
        }
      : {}),
  };

  console.log("Creating/replacing Resume document...");
  await client.createOrReplace(doc);
  console.log("Done! Resume seeded with experience, education, skills, and projects.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
