import assert from "node:assert/strict";
import test from "node:test";
import {
  AUDIENCE_ORDER,
  CARD_ORDER,
  CATEGORY_META,
  getSiteStats,
  loadContent,
  validateContent,
} from "../scripts/lib/content.mjs";
import { parseCsv, recordsFromCsv, toCsvRow } from "../scripts/lib/csv.mjs";
import { parseFrontmatter } from "../scripts/lib/frontmatter.mjs";

test("the shipped content passes validation", () => {
  const data = validateContent(loadContent());
  assert.equal(data.chapters.length, 9);
  assert.equal(data.programs.programs.length, 36);
  assert.ok(data.sources.groups.length >= 6);
  assert.ok(data.changes.length >= 5);
});

test("chapters are continuous and have complete metadata", () => {
  const data = loadContent();
  const chapters = data.chapters.slice().sort((a, b) => a.order - b.order);
  assert.deepEqual(
    chapters.map((chapter) => chapter.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  for (const chapter of chapters) {
    for (const field of ["title", "nav", "description", "kicker", "updated", "body"]) {
      assert.ok(String(chapter[field]).trim(), `${chapter.file} has ${field}`);
    }
    assert.match(chapter.output, /^\d{2}-[a-z0-9-]+\.html$/);
  }
});

test("programs use known categories, audiences, cards, and statuses", () => {
  const data = loadContent();
  const ids = new Set();
  for (const program of data.programs.programs) {
    assert.ok(!ids.has(program.id), `duplicate id ${program.id}`);
    ids.add(program.id);
    assert.ok(Object.hasOwn(CATEGORY_META, program.category), program.category);
    assert.ok(CARD_ORDER.includes(program.card), program.card);
    for (const audience of program.audience) assert.ok(AUDIENCE_ORDER.includes(audience));
    assert.match(program.url, /^https:\/\//);
    assert.match(program.checked, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("every program URL appears in the official source list", () => {
  const data = loadContent();
  const sourceUrls = new Set(
    data.sources.groups.flatMap((group) => group.entries.map((entry) => entry.url)),
  );
  for (const program of data.programs.programs) {
    assert.ok(sourceUrls.has(program.url), `${program.id} is missing from sources`);
  }
});

test("tracker CSV matches the documented column schema", () => {
  const data = loadContent();
  const { header, records } = recordsFromCsv(data.trackerCsv);
  assert.deepEqual(
    header,
    data.trackerColumns.map((column) => column.key),
  );
  assert.ok(records.length >= 1);
  assert.match(records[0].program_name, /^EXAMPLE - /);
  assert.equal(records[0].card_on_file, "no");
});

test("site statistics reflect the loaded content", () => {
  const data = loadContent();
  const stats = getSiteStats(data);
  assert.equal(stats.chapters, 9);
  assert.equal(stats.programs, 36);
  assert.equal(stats.categories, 6);
  assert.equal(stats.sources, data.sources.groups.reduce((n, group) => n + group.entries.length, 0));
  assert.equal(stats.checked, "2026-10-22");
});

test("CSV parser handles quotes, escaped quotes, CRLF, and blank rows", () => {
  const rows = parseCsv('name,note\r\n"Ada, A.","Said ""hello"""\r\n\r\n');
  assert.deepEqual(rows, [
    ["name", "note"],
    ["Ada, A.", 'Said "hello"'],
  ]);
  assert.throws(() => parseCsv('a,b\n"unterminated'), /quoted field/);
  assert.equal(toCsvRow(["a", 'b,c', 'say "hi"']), 'a,"b,c","say ""hi"""');
});

test("front matter parser handles quoting and rejects an unclosed header", () => {
  const parsed = parseFrontmatter(
    '---\ntitle: "A title"\norder: 3\nnote: \'quoted\'\n---\n\nBody text.\n',
  );
  assert.deepEqual(parsed.data, { title: "A title", order: "3", note: "quoted" });
  assert.equal(parsed.body.trim(), "Body text.");
  assert.throws(() => parseFrontmatter("---\ntitle: No end\n"), /never closed/);
  assert.deepEqual(parseFrontmatter("# No front matter").data, {});
});
