import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, recordsFromCsv } from "./csv.mjs";
import { parseFrontmatter } from "./frontmatter.mjs";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const DOCS_DIR = path.join(ROOT, "docs");
export const DATA_DIR = path.join(ROOT, "src", "site", "data");

export const SITE = {
  name: "The Free Tier Field Guide",
  shortName: "Free Tier Field Guide",
  brand: "Asdale Dynamics",
  company: "Asdale Dynamics, LLC",
  description:
    "A plain-English guide to free AI, cloud, and developer credits, trials, and open-source alternatives—and how to use them without a surprise bill.",
  author: "Dylan Asdale",
  language: "en",
  themeColor: "#173b32",
  keywords: [
    "free AI credits",
    "cloud free tier",
    "developer free trials",
    "avoid surprise bills",
    "local AI",
    "startup credits",
  ],
};

export const CATEGORY_META = {
  "AI API": {
    label: "AI APIs",
    slug: "ai-api",
    blurb: "Real developer allowances, rate limits, and data trade-offs.",
    note: "A free API is a lab bench, not a budget.",
  },
  Cloud: {
    label: "Cloud & hosting",
    slug: "cloud",
    blurb: "Trial credit, always-free limits, hosting, notebooks, and developer infrastructure.",
    note: "The resource you forget is the one that bills you.",
  },
  Startup: {
    label: "Startup programs",
    slug: "startup",
    blurb: "Application-based credits for eligible young companies.",
    note: "Eligibility is narrower than the marketing suggests.",
  },
  Education: {
    label: "Student & education",
    slug: "education",
    blurb: "Verified learning benefits, their limits, and their expiry dates.",
    note: "Use learning tools for learning, not for the LLC.",
  },
  Nonprofit: {
    label: "Nonprofit",
    slug: "nonprofit",
    blurb: "Charitable-status programs and the boundary an LLC must respect.",
    note: "Good intentions are not a 501(c)(3) determination.",
  },
  "Local / open source": {
    label: "Local & open source",
    slug: "local",
    blurb: "No per-token meter, but hardware, maintenance, and time are real.",
    note: "Free like a puppy, not free like a sample.",
  },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META);

export const CARD_ORDER = ["No card", "Card required", "Varies"];

export const AUDIENCE_ORDER = [
  "Anyone",
  "Personal projects",
  "Students",
  "Startups",
  "Nonprofits",
];

export const STATUS_LABELS = {
  open: "Open at check",
  limited: "Limited at check",
  "partner-only": "Partner route",
};

export const FEATURED_PROGRAMS = [
  "gemini-developer-api",
  "cloudflare-workers-ai",
  "github-pages",
];

export const DISCLAIMER =
  "Educational material only—not financial, legal, tax, medical, or compliance advice.";

function readJson(relativePath) {
  const file = path.join(ROOT, relativePath);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Could not read ${relativePath}: ${error.message}`);
  }
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function requireString(value, label, errors) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${label} is required`);
  }
}

function validateHttpUrl(value, label, errors) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") errors.push(`${label} must use https`);
  } catch {
    errors.push(`${label} must be a valid URL`);
  }
}

export function loadContent() {
  const data = {
    programs: readJson("src/site/data/programs.json"),
    sources: readJson("src/site/data/sources.json"),
    changes: readJson("src/site/data/changes.json"),
    trackerColumns: readJson("src/site/data/tracker-columns.json"),
  };

  const files = fs
    .readdirSync(DOCS_DIR)
    .filter((file) => /^\d{2}-[a-z0-9-]+\.md$/.test(file))
    .sort();

  data.chapters = files.map((file) => {
    const raw = fs.readFileSync(path.join(DOCS_DIR, file), "utf8");
    const { data: frontmatter, body } = parseFrontmatter(raw);
    return {
      ...frontmatter,
      order: Number(frontmatter.order),
      file,
      output: file.replace(/\.md$/, ".html"),
      body,
    };
  });

  const trackerPath = path.join(DOCS_DIR, "free-credit-tracker-template.csv");
  data.trackerCsv = fs.readFileSync(trackerPath, "utf8");
  data.trackerCsvHeader = parseCsv(data.trackerCsv)[0] || [];

  const sourceText = fs.readFileSync(path.join(DOCS_DIR, "sources.md"), "utf8");
  data.sourcesMarkdown = sourceText;

  return data;
}

export function validateContent(data) {
  const errors = [];
  const checked = data.programs?.meta?.checked;

  if (!data.chapters.length) errors.push("No chapter Markdown files were found");
  if (!isIsoDate(checked)) errors.push("program meta.checked must be an ISO date");

  const orders = new Set();
  for (const chapter of data.chapters) {
    const label = `Chapter ${chapter.file}`;
    for (const field of ["title", "nav", "description", "kicker", "updated"]) {
      requireString(chapter[field], `${label} front matter "${field}"`, errors);
    }
    if (!Number.isInteger(chapter.order) || chapter.order < 1) {
      errors.push(`${label} has an invalid order`);
    } else if (orders.has(chapter.order)) {
      errors.push(`${label} duplicates chapter order ${chapter.order}`);
    } else {
      orders.add(chapter.order);
    }
    if (!isIsoDate(chapter.updated)) {
      errors.push(`${label} updated date must be YYYY-MM-DD`);
    }
    if (!chapter.body.trim()) errors.push(`${label} has no content`);
  }

  data.chapters
    .slice()
    .sort((a, b) => a.order - b.order)
    .forEach((chapter, index) => {
      if (chapter.order !== index + 1) {
        errors.push(`Chapter order should be continuous; expected ${index + 1}, found ${chapter.order}`);
      }
    });

  if (!Array.isArray(data.programs?.programs) || !data.programs.programs.length) {
    errors.push("programs.json must contain at least one program");
  }

  const ids = new Set();
  for (const [index, program] of (data.programs?.programs || []).entries()) {
    const label = `programs[${index}] (${program.id || "no id"})`;
    for (const field of [
      "id",
      "name",
      "provider",
      "category",
      "card",
      "status",
      "headline",
      "whatYouGet",
      "watchOut",
      "eligibility",
      "url",
      "checked",
    ]) {
      requireString(program[field], `${label} field "${field}"`, errors);
    }
    if (program.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(program.id)) {
      errors.push(`${label} id must be a lowercase slug`);
    }
    if (program.id && ids.has(program.id)) errors.push(`${label} has a duplicate id`);
    if (program.id) ids.add(program.id);
    if (!Array.isArray(program.audience) || !program.audience.length) {
      errors.push(`${label} needs at least one audience`);
    } else {
      for (const audience of program.audience) {
        if (!AUDIENCE_ORDER.includes(audience)) {
          errors.push(`${label} has an unknown audience "${audience}"`);
        }
      }
    }
    if (!Object.hasOwn(CATEGORY_META, program.category)) {
      errors.push(`${label} has an unknown category "${program.category}"`);
    }
    if (!CARD_ORDER.includes(program.card)) {
      errors.push(`${label} has an unknown card label "${program.card}"`);
    }
    if (!Object.hasOwn(STATUS_LABELS, program.status)) {
      errors.push(`${label} has an unknown status "${program.status}"`);
    }
    if (!isIsoDate(program.checked)) errors.push(`${label} checked date must be YYYY-MM-DD`);
    validateHttpUrl(program.url, `${label} url`, errors);
  }

  if (!Array.isArray(data.sources?.groups) || !data.sources.groups.length) {
    errors.push("sources.json must contain at least one group");
  }
  for (const [groupIndex, group] of (data.sources?.groups || []).entries()) {
    requireString(group.name, `sources group ${groupIndex + 1} name`, errors);
    if (!Array.isArray(group.entries) || !group.entries.length) {
      errors.push(`sources group ${groupIndex + 1} needs at least one entry`);
    }
    for (const [entryIndex, entry] of (group.entries || []).entries()) {
      const label = `sources[${groupIndex}].entries[${entryIndex}]`;
      requireString(entry.name, `${label} name`, errors);
      requireString(entry.note, `${label} note`, errors);
      validateHttpUrl(entry.url, `${label} url`, errors);
    }
  }

  if (!Array.isArray(data.changes) || !data.changes.length) {
    errors.push("changes.json must contain at least one change");
  }
  for (const [index, change] of (data.changes || []).entries()) {
    const label = `changes[${index}]`;
    for (const field of ["date", "kind", "title", "summary", "url"]) {
      requireString(change[field], `${label} ${field}`, errors);
    }
    if (!isIsoDate(change.date)) errors.push(`${label} date must be YYYY-MM-DD`);
    validateHttpUrl(change.url, `${label} url`, errors);
  }

  if (!Array.isArray(data.trackerColumns) || !data.trackerColumns.length) {
    errors.push("tracker-columns.json must contain at least one column");
  }
  const columnKeys = (data.trackerColumns || []).map((column) => column.key);
  if (new Set(columnKeys).size !== columnKeys.length) {
    errors.push("tracker columns must have unique keys");
  }
  if (data.trackerCsvHeader.join(",") !== columnKeys.join(",")) {
    errors.push("tracker CSV header must exactly match tracker-columns.json");
  }

  const records = recordsFromCsv(data.trackerCsv).records;
  for (const [index, record] of records.entries()) {
    if (Object.values(record).every((value) => !String(value).trim())) {
      errors.push(`tracker CSV row ${index + 2} is empty`);
    }
    if (record.official_url) {
      validateHttpUrl(record.official_url, `tracker CSV row ${index + 2} official_url`, errors);
    }
    if (record.date_checked && !isIsoDate(record.date_checked)) {
      errors.push(`tracker CSV row ${index + 2} has an invalid date_checked`);
    }
  }

  if (errors.length) {
    const error = new Error(`Content validation failed:\n- ${errors.join("\n- ")}`);
    error.validation = errors;
    throw error;
  }

  return data;
}

export function getSiteStats(data) {
  return {
    chapters: data.chapters.length,
    programs: data.programs.programs.length,
    sources: data.sources.groups.reduce((total, group) => total + group.entries.length, 0),
    categories: CATEGORY_ORDER.length,
    checked: data.programs.meta.checked,
    checkedLabel: data.programs.meta.checkedLabel,
  };
}
