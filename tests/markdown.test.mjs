import assert from "node:assert/strict";
import test from "node:test";
import {
  escapeHtml,
  formatIsoDate,
  renderMarkdown,
  slugify,
} from "../scripts/lib/markdown.mjs";

test("renders headings, unique ids, and a table of contents", () => {
  const result = renderMarkdown(
    "# Chapter\n\n## The same heading\n\nText.\n\n## The same heading\n\n### A detail",
  );
  assert.match(result.html, /<h1 id="chapter">Chapter<\/h1>/);
  assert.match(result.html, /<h2 id="the-same-heading">/);
  assert.match(result.html, /<h2 id="the-same-heading-2">/);
  assert.deepEqual(result.toc, [
    { level: 2, text: "The same heading", id: "the-same-heading" },
    { level: 2, text: "The same heading", id: "the-same-heading-2" },
    { level: 3, text: "A detail", id: "a-detail" },
  ]);
});

test("escapes raw HTML and refuses executable links", () => {
  const result = renderMarkdown(
    'A <script>alert("x")</script> and [bad](javascript:alert(1)) and [good](https://example.com).',
  );
  assert.doesNotMatch(result.html, /<script>/);
  assert.match(result.html, /&lt;script&gt;/);
  assert.match(result.html, /<a href="#"[^>]*>bad<\/a>|bad/);
  assert.match(result.html, /<a href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer">good<\/a>/);
});

test("rewrites local documentation links", () => {
  const rewrite = (href) =>
    href === "./README.md" ? "guide.html" : href.replace(/^(?:\.\/)?(\d{2}-.+?)\.md/, "$1.html");
  const result = renderMarkdown("See [chapter](./02-free-ai-api-credits.md) and [start](./README.md).", {
    rewriteHref: rewrite,
  });
  assert.match(result.html, /href="02-free-ai-api-credits.html"/);
  assert.match(result.html, /href="guide.html"/);
});

test("renders lists, tables, code fences, and inline code", () => {
  const source = [
    "A paragraph with `const x = 1`.",
    "",
    "- one",
    "  - two",
    "    1. three",
    "",
    "| A | B |",
    "| --- | --- |",
    "| 1 | 2 |",
    "",
    "```js",
    "const answer = 42;",
    "```",
  ].join("\n");
  const result = renderMarkdown(source);
  assert.match(result.html, /<code>const x = 1<\/code>/);
  assert.match(result.html, /<ul>/);
  assert.match(result.html, /<ol>/);
  assert.match(result.html, /<table>/);
  assert.match(result.html, /<th scope="col">A<\/th>/);
  assert.match(result.html, /<pre><code class="language-js">const answer = 42;<\/code><\/pre>/);
});

test("counts words and rounds reading time up", () => {
  const result = renderMarkdown(`# Title\n\n${"word ".repeat(441)}`);
  assert.equal(result.wordCount, 442);
  assert.equal(result.readingMinutes, 3);
  assert.equal(renderMarkdown("").readingMinutes, 1);
});

test("escapes HTML characters and formats ISO dates", () => {
  assert.equal(escapeHtml(`<>&"'`), "&lt;&gt;&amp;&quot;&#39;");
  assert.equal(formatIsoDate("2026-10-22"), "October 22, 2026");
  assert.equal(formatIsoDate("2026-10-22", "short"), "Oct 22, 2026");
  assert.equal(formatIsoDate("bad"), "bad");
});

test("slugifies plain and accented headings", () => {
  assert.equal(slugify("Free tiers, trials & credits"), "free-tiers-trials-and-credits");
  assert.equal(slugify("Café résumé"), "cafe-resume");
  assert.equal(slugify("!!!"), "section");
});
