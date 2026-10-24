import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ROOT, loadContent } from "../scripts/lib/content.mjs";

const siteDir = path.join(ROOT, "site");
const htmlFiles = fs
  .readdirSync(siteDir)
  .filter((file) => file.endsWith(".html"))
  .sort();

test("all expected pages were generated", () => {
  assert.equal(htmlFiles.length, 15);
  for (const page of [
    "index.html",
    "guide.html",
    "finder.html",
    "tracker.html",
    "sources.html",
    "404.html",
    "01-how-free-offers-work.html",
    "09-apply-maintain-and-know-when-to-pay.html",
  ]) {
    assert.ok(htmlFiles.includes(page), `${page} exists`);
  }
});

test("pages have complete metadata, landmarks, and local-only assets", () => {
  for (const page of htmlFiles) {
    const html = fs.readFileSync(path.join(siteDir, page), "utf8");
    assert.match(html, /^<!doctype html>/i, page);
    assert.match(html, /<html lang="en">/, page);
    assert.match(html, /<meta name="viewport"/, page);
    assert.match(html, /<main id="main">/, page);
    assert.match(html, /href="assets\/site\.css"/, page);
    assert.match(html, /src="assets\/site\.js"/, page);
    assert.match(html, /Copyright \(c\) 2026 Asdale Dynamics, LLC/, page);
    assert.doesNotMatch(html, /<(?:script|img)\b[^>]*(?:src)="https?:\/\//i, page);
  }
});

test("the finder lists every program exactly once", () => {
  const data = loadContent();
  const html = fs.readFileSync(path.join(siteDir, "finder.html"), "utf8");
  for (const program of data.programs.programs) {
    const occurrences = html.split(`id="p-${program.id}"`).length - 1;
    assert.equal(occurrences, 1, `${program.id} appears once`);
  }
  assert.equal((html.match(/class="program-card"/g) || []).length, data.programs.programs.length);
});

test("the guide links all chapters in order", () => {
  const data = loadContent();
  const html = fs.readFileSync(path.join(siteDir, "guide.html"), "utf8");
  let previous = -1;
  for (const chapter of data.chapters.slice().sort((a, b) => a.order - b.order)) {
    const position = html.indexOf(`<a class="chapter-row" href="${chapter.output}">`);
    assert.ok(position > previous, `${chapter.output} appears in the chapter list in order`);
    previous = position;
  }
});

test("tracker and downloadable CSV are available", () => {
  const tracker = fs.readFileSync(path.join(siteDir, "tracker.html"), "utf8");
  const csv = fs.readFileSync(path.join(siteDir, "free-credit-tracker-template.csv"), "utf8");
  assert.match(tracker, /id="calendar-form"/);
  assert.match(tracker, /href="free-credit-tracker-template\.csv" download/);
  assert.match(csv, /^program_name,provider,category,/);
  assert.match(csv, /EXAMPLE - Gemini Developer API/);
});

test("generated pages contain no unfinished markers", () => {
  for (const page of htmlFiles) {
    const html = fs.readFileSync(path.join(siteDir, page), "utf8");
    assert.doesNotMatch(html, /\b(?:TODO|FIXME|TBD|lorem ipsum)\b/i, page);
    assert.doesNotMatch(html, /undefined|\[object Object\]/, page);
  }
});

test("the stylesheet covers all major page components", () => {
  const css = fs.readFileSync(path.join(siteDir, "assets", "site.css"), "utf8");
  for (const selector of [
    ".hero",
    ".program-card",
    ".chapter-layout",
    ".finder-controls",
    ".calendar-form",
    ".timeline",
    ".site-footer",
    "@media (max-width: 960px)",
    "@media print",
  ]) {
    assert.ok(css.includes(selector), `${selector} is styled`);
  }
  assert.doesNotMatch(css, /@import|url\(["']?https?:/i);
});
