#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { ROOT, getSiteStats, loadContent, validateContent } from "./lib/content.mjs";
import { renderMarkdown } from "./lib/markdown.mjs";
import {
  renderChapter,
  renderFinder,
  renderGuide,
  renderHome,
  renderNotFound,
  renderSources,
  renderTracker,
} from "./lib/pages.mjs";

const SITE_DIR = path.join(ROOT, "site");
const ASSETS_DIR = path.join(ROOT, "src", "site", "assets");
const TRACKER_FILE = path.join(ROOT, "docs", "free-credit-tracker-template.csv");

function rewriteDocLink(href) {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) return href;
  if (href === "./README.md" || href === "README.md") return "guide.html";
  const match = /^(?:\.\/)?(\d{2}-[a-z0-9-]+)\.md(#[-\w]+)?$/.exec(href);
  if (match) return `${match[1]}.html${match[2] || ""}`;
  return href;
}

function writePage(name, html) {
  fs.writeFileSync(path.join(SITE_DIR, name), html, "utf8");
}

function build() {
  const data = validateContent(loadContent());
  const stats = getSiteStats(data);

  const chapters = data.chapters
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((chapter) => {
      const rendered = renderMarkdown(chapter.body, { rewriteHref: rewriteDocLink });
      return {
        ...chapter,
        html: rendered.html,
        toc: rendered.toc,
        wordCount: rendered.wordCount,
        readingMinutes: rendered.readingMinutes,
      };
    });

  fs.rmSync(SITE_DIR, { recursive: true, force: true });
  fs.mkdirSync(SITE_DIR, { recursive: true });
  fs.cpSync(ASSETS_DIR, path.join(SITE_DIR, "assets"), { recursive: true });
  fs.copyFileSync(TRACKER_FILE, path.join(SITE_DIR, "free-credit-tracker-template.csv"));

  writePage("index.html", renderHome({ chapters, programs: data.programs.programs, stats }));
  writePage("guide.html", renderGuide({ chapters, stats }));

  for (const [index, chapter] of chapters.entries()) {
    writePage(
      chapter.output,
      renderChapter({
        chapter,
        chapters,
        previous: chapters[index - 1] || null,
        next: chapters[index + 1] || null,
        stats,
      }),
    );
  }

  writePage("finder.html", renderFinder({ programs: data.programs.programs, stats }));
  writePage("tracker.html", renderTracker({ stats, columns: data.trackerColumns }));
  writePage(
    "sources.html",
    renderSources({ sources: data.sources, changes: data.changes, stats }),
  );
  writePage("404.html", renderNotFound({ stats }));
  fs.writeFileSync(path.join(SITE_DIR, ".nojekyll"), "");

  const pageCount = 5 + chapters.length;
  console.log(
    `Built ${pageCount} pages in site/ (${stats.programs} programs, ${chapters.length} chapters, ${stats.sources} sources).`,
  );
  console.log(`Offers checked ${stats.checkedLabel}. No external assets or analytics included.`);
}

try {
  build();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
