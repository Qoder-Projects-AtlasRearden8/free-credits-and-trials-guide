#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, getSiteStats, loadContent, validateContent } from "./lib/content.mjs";
import { createStaticServer } from "./serve.mjs";

const SITE_DIR = path.join(ROOT, "site");
const errors = [];
const checks = [];
const fail = (message) => errors.push(message);
const pass = (message) => checks.push(message);

const TEXT_EXTENSIONS = new Set([
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".txt",
  ".yaml",
  ".yml",
]);

const SECRET_PATTERNS = [
  { name: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/g },
  { name: "GitHub token", pattern: /ghp_[A-Za-z0-9]{36}/g },
  { name: "OpenAI-style key", pattern: /\bsk-[A-Za-z0-9_-]{20,}/g },
  { name: "Google API key", pattern: /AIza[0-9A-Za-z_-]{35}/g },
  { name: "private key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/g },
];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
}

function readAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = pattern.exec(tag)) !== null) {
    const name = match[1].toLowerCase();
    if (name === "<a" || name === "a" || name.startsWith("<")) continue;
    attributes[name] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

function isExternal(href) {
  return /^(?:https?:)?\/\//i.test(href) || /^(?:mailto|tel):/i.test(href);
}

function relativeOutput(absoluteFile) {
  return path.relative(SITE_DIR, absoluteFile).split(path.sep).join("/");
}

function validateSiteFile() {
  const required = [
    "index.html",
    "guide.html",
    "finder.html",
    "tracker.html",
    "sources.html",
    "404.html",
    "assets/site.css",
    "assets/site.js",
    "assets/favicon.svg",
    "free-credit-tracker-template.csv",
    ".nojekyll",
  ];
  for (const relative of required) {
    if (!fs.existsSync(path.join(SITE_DIR, relative))) {
      fail(`Required generated file is missing: site/${relative}`);
    }
  }
  if (!errors.length) pass("Required generated files exist");
}

function analyzePages() {
  const pages = fs
    .readdirSync(SITE_DIR)
    .filter((file) => file.endsWith(".html"))
    .sort();
  if (pages.length < 14) fail(`Expected at least 14 HTML pages, found ${pages.length}`);

  const pageData = new Map();
  const allIds = new Map();
  let internalLinks = 0;
  let externalLinks = 0;

  for (const page of pages) {
    const file = path.join(SITE_DIR, page);
    const html = fs.readFileSync(file, "utf8");
    const label = `site/${page}`;

    const checksForPage = [
      [/^<!doctype html>/i, "missing doctype"],
      [/<html lang="en">/i, "missing lang=\"en\""],
      [/<meta charset="utf-8">/i, "missing charset"],
      [/<meta name="viewport" content="width=device-width, initial-scale=1">/i, "missing viewport"],
      [/<title>[^<]+<\/title>/i, "missing title"],
      [/<meta name="description" content="[^"]+">/i, "missing description"],
      [/<main id="main">/i, "missing main landmark"],
      [/<link rel="stylesheet" href="assets\/site\.css">/i, "missing local stylesheet"],
      [/<script src="assets\/site\.js" defer><\/script>/i, "missing local site script"],
      [/Copyright \(c\) 2026 Asdale Dynamics, LLC/i, "missing company copyright"],
      [/No affiliate links/i, "missing independence statement"],
    ];
    for (const [pattern, message] of checksForPage) {
      if (!pattern.test(html)) fail(`${label}: ${message}`);
    }

    if (/<script\b(?![^>]*\bsrc=)[^>]*>/i.test(html)) {
      // The one allowed inline script sets the js class before CSS paints.
      const inlineScripts = html.match(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi) || [];
      const allowed = inlineScripts.filter(
        (script) => script.replace(/\s+/g, " ") ===
          '<script>document.documentElement.classList.add("js");</script>',
      );
      if (inlineScripts.length !== allowed.length) {
        fail(`${label}: contains an unexpected inline script`);
      }
    }

    if (/<(?:img|script|link)\b[^>]*(?:src|href)="(?:https?:)?\/\//i.test(html)) {
      fail(`${label}: loads a remote asset`);
    }

    if (/https?:\/\/[^\s"'<>]*\?(?:[^\s"'<>]*&)?(?:utm_|affiliate|aff=|ref=)/i.test(html)) {
      fail(`${label}: contains a likely affiliate or campaign parameter`);
    }

    const ids = new Set();
    for (const match of html.matchAll(/\sid="([^"]+)"/g)) {
      const id = decodeHtml(match[1]);
      if (ids.has(id)) fail(`${label}: duplicate id "${id}"`);
      ids.add(id);
    }
    allIds.set(page, ids);

    for (const tag of html.match(/<a\b[^>]*>/gi) || []) {
      const attributes = readAttributes(tag);
      const href = attributes.href;
      if (!href) {
        fail(`${label}: anchor without href`);
        continue;
      }

      if (isExternal(href)) {
        externalLinks += 1;
        if (!/^https:\/\//i.test(href) && !/^mailto:|^tel:/i.test(href)) {
          fail(`${label}: external URL is not HTTPS: ${href}`);
        }
        if (attributes.target === "_blank" && !/\bnoopener\b/i.test(attributes.rel || "")) {
          fail(`${label}: target="_blank" without rel="noopener": ${href}`);
        }
        if (/\s/.test(href)) fail(`${label}: unencoded space in URL: ${href}`);
      } else if (!href.startsWith("#")) {
        internalLinks += 1;
      }
    }

    pageData.set(page, { html, attributes: null });
  }

  for (const [page, { html }] of pageData) {
    const label = `site/${page}`;
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const raw = decodeHtml(match[1]);
      if (!raw || isExternal(raw) || raw.startsWith("data:")) continue;

      const [pathAndQuery, fragment = ""] = raw.split("#");
      const [pathname] = pathAndQuery.split("?");
      if (!pathname && !fragment) {
        fail(`${label}: empty relative link`);
        continue;
      }

      let targetPage = page;
      const targetFile = path.resolve(path.dirname(path.join(SITE_DIR, page)), pathname || page);
      const root = path.resolve(SITE_DIR);
      if (targetFile !== root && !targetFile.startsWith(`${root}${path.sep}`)) {
        fail(`${label}: relative link escapes site/: ${raw}`);
        continue;
      }
      if (pathname) {
        if (!fs.existsSync(targetFile) || !fs.statSync(targetFile).isFile()) {
          fail(`${label}: broken local link "${raw}"`);
          continue;
        }
        if (targetFile.endsWith(".html")) targetPage = relativeOutput(targetFile);
      }

      if (fragment) {
        const ids = allIds.get(targetPage);
        if (!ids) {
          fail(`${label}: fragment target is not an HTML page: ${raw}`);
        } else if (!ids.has(decodeURIComponent(fragment))) {
          fail(`${label}: missing anchor "#${fragment}" in ${targetPage}`);
        }
      }
    }
  }

  pass(`${pages.length} pages passed structure and local-link checks`);
  pass(`${internalLinks} internal links checked; ${externalLinks} external links are HTTPS`);
  return pages;
}

function validateData() {
  let data;
  try {
    data = validateContent(loadContent());
  } catch (error) {
    fail(error.message);
    return null;
  }

  const stats = getSiteStats(data);
  if (stats.chapters !== 9) fail(`Expected 9 chapters, found ${stats.chapters}`);
  if (stats.programs < 30) fail(`Expected at least 30 program entries, found ${stats.programs}`);
  if (stats.sources < 45) fail(`Expected at least 45 source links, found ${stats.sources}`);

  const sourceUrls = new Set(
    data.sources.groups.flatMap((group) => group.entries.map((entry) => entry.url)),
  );
  for (const program of data.programs.programs) {
    if (!sourceUrls.has(program.url)) {
      fail(`Program ${program.id} official URL is absent from the source list`);
    }
  }

  const finder = fs.readFileSync(path.join(SITE_DIR, "finder.html"), "utf8");
  for (const program of data.programs.programs) {
    if (!finder.includes(`id="p-${program.id}"`)) {
      fail(`Finder page is missing program ${program.id}`);
    }
  }

  const checked = data.programs.meta.checked;
  for (const page of ["index.html", "finder.html", "sources.html"]) {
    const html = fs.readFileSync(path.join(SITE_DIR, page), "utf8");
    if (!html.includes(`datetime="${checked}"`)) {
      fail(`site/${page} does not expose the checked date ${checked}`);
    }
  }

  pass(
    `${stats.programs} programs, ${stats.chapters} chapters, ${stats.sources} sources validated`,
  );
  return data;
}

function scanForSecrets() {
  let scanned = 0;
  for (const file of walk(ROOT)) {
    if (path.basename(file).startsWith(".env")) {
      fail(`Environment file must not be committed: ${relativeOutput(file)}`);
      continue;
    }
    if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    const text = fs.readFileSync(file, "utf8");
    scanned += 1;
    for (const { name, pattern } of SECRET_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) {
        fail(`${name} pattern found in ${path.relative(ROOT, file)}`);
      }
    }
  }
  pass(`${scanned} text files scanned; no high-confidence secret patterns found`);
}

function scanForPlaceholders() {
  const self = path.resolve(fileURLToPath(import.meta.url));
  const files = [
    ...walk(path.join(ROOT, "docs")),
    ...walk(path.join(ROOT, "scripts")),
    ...walk(path.join(ROOT, "src")),
    path.join(ROOT, "README.md"),
  ].filter(
    (file) =>
      path.resolve(file) !== self && TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()),
  );

  const pattern = /\b(?:TODO|FIXME|TBD|lorem ipsum|dummy text)\b/i;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    if (pattern.test(text)) {
      fail(`Placeholder text found in ${path.relative(ROOT, file)}`);
    }
  }
  pass("No TODO, FIXME, TBD, or lorem ipsum placeholders in source content");
}

async function smokeTestHttp() {
  const server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  try {
    const cases = [
      ["/", 200, "text/html"],
      ["/index.html", 200, "text/html"],
      ["/finder.html", 200, "text/html"],
      ["/tracker.html", 200, "text/html"],
      ["/assets/site.css", 200, "text/css"],
      ["/assets/site.js", 200, "text/javascript"],
      ["/free-credit-tracker-template.csv", 200, "text/csv"],
      ["/definitely-not-a-page", 404, "text/html"],
    ];

    for (const [pathname, expectedStatus, expectedType] of cases) {
      const response = await fetch(`${base}${pathname}`);
      const contentType = response.headers.get("content-type") || "";
      if (response.status !== expectedStatus) {
        fail(`HTTP ${pathname}: expected ${expectedStatus}, received ${response.status}`);
      }
      if (!contentType.includes(expectedType)) {
        fail(`HTTP ${pathname}: expected ${expectedType}, received ${contentType || "none"}`);
      }
      await response.arrayBuffer();
    }

    const postResponse = await fetch(`${base}/`, { method: "POST" });
    if (postResponse.status !== 405) {
      fail(`HTTP POST /: expected 405, received ${postResponse.status}`);
    }
    await postResponse.arrayBuffer();

    const traversalResponse = await fetch(`${base}/%2e%2e%2fpackage.json`);
    if (traversalResponse.ok) {
      fail("HTTP path traversal check failed: package.json was served");
    }
    await traversalResponse.arrayBuffer();

    pass("HTTP smoke test passed for pages, assets, 404 handling, method guard, and traversal");
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  if (!fs.existsSync(path.join(SITE_DIR, "index.html"))) {
    console.error("site/ has not been built. Run `npm run build` first.");
    process.exitCode = 1;
    return;
  }

  console.log("Verifying The Free Tier Field Guide…");
  validateSiteFile();
  analyzePages();
  validateData();
  scanForSecrets();
  scanForPlaceholders();
  await smokeTestHttp();

  if (errors.length) {
    console.error(`\nVerification failed with ${errors.length} problem(s):`);
    for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
    if (errors.length > 80) console.error(`- …and ${errors.length - 80} more`);
    process.exitCode = 1;
    return;
  }

  console.log("");
  for (const check of checks) console.log(`  OK  ${check}`);
  console.log("\nAll checks passed.");
}

await main();
