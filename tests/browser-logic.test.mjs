import assert from "node:assert/strict";
import test from "node:test";

await import("../src/site/assets/site.js");
const app = globalThis.FreeTierGuide;

const programs = [
  {
    name: "Alpha AI",
    provider: "Alpha",
    category: "AI API",
    audience: ["Anyone", "Students"],
    card: "No card",
    headline: "Free tokens for testing",
    whatYouGet: "A daily request allowance",
    watchOut: "Data may be used for training",
    eligibility: "A verified account",
    search: "alpha artificial intelligence",
  },
  {
    name: "Cloud Trial",
    provider: "Beta Cloud",
    category: "Cloud",
    audience: ["Anyone", "Startups"],
    card: "Card required",
    headline: "Credits for ninety days",
    whatYouGet: "Trial credit",
    watchOut: "Card is charged after the trial",
    eligibility: "New accounts",
    search: "beta hosting virtual machines",
  },
];

test("finder search is case- and accent-insensitive", () => {
  assert.deepEqual(
    app.filterPrograms(programs, { query: "  ALPHA  " }).map((item) => item.name),
    ["Alpha AI"],
  );
  assert.deepEqual(app.filterPrograms(programs, { query: "ninety" }).map((item) => item.name), [
    "Cloud Trial",
  ]);
  assert.equal(app.filterPrograms(programs, { query: "missing" }).length, 0);
});

test("finder combines category, audience, and card filters", () => {
  assert.deepEqual(
    app.filterPrograms(programs, { category: "AI API", audience: "Students" }).map(
      (item) => item.name,
    ),
    ["Alpha AI"],
  );
  assert.deepEqual(
    app.filterPrograms(programs, { category: "Cloud", card: "Card required" }).map(
      (item) => item.name,
    ),
    ["Cloud Trial"],
  );
  assert.equal(app.filterPrograms(programs, { audience: "Nonprofits" }).length, 0);
});

test("dates are validated as real calendar dates", () => {
  assert.equal(app.parseIsoDate("2026-10-22").toISOString(), "2026-10-22T00:00:00.000Z");
  assert.throws(() => app.parseIsoDate("2026-02-30"), /valid date|real calendar/);
  assert.throws(() => app.parseIsoDate("22-10-2026"), /valid date/);
  assert.equal(app.addDaysToIso("2026-10-22", 7), "2026-10-29");
  assert.equal(app.addDaysToIso("2026-12-30", 3), "2027-01-02");
  assert.equal(app.icsDate("2026-10-22"), "20261022");
});

test("calendar text escaping and line folding are standards-safe", () => {
  assert.equal(
    app.escapeIcsText("Keep, cancel; export\\now\nnext"),
    "Keep\\, cancel\\; export\\\\now\\nnext",
  );
  const folded = app.foldIcsLine(`SUMMARY:${"é".repeat(60)}`);
  for (const line of folded.split("\r\n")) {
    assert.ok(new TextEncoder().encode(line).length <= 75, `line too long: ${line.length}`);
  }
  assert.match(app.foldIcsLine("x".repeat(80)), /^x{75}\r\n x{5}$/);
});

test("generated ICS reminders are deterministic when supplied an id and time", () => {
  const ics = app.buildIcs({
    program: "AWS trial",
    date: "2026-11-05",
    note: "Export the demo",
    now: "2026-10-22T12:00:00Z",
    uid: "test-reminder@example.invalid",
  });
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /VERSION:2\.0/);
  assert.match(ics, /UID:test-reminder@example\.invalid/);
  assert.match(ics, /DTSTART;VALUE=DATE:20261105/);
  assert.match(ics, /DTEND;VALUE=DATE:20261106/);
  assert.match(ics, /SUMMARY:Decide: keep or cancel AWS trial/);
  assert.match(ics, /TRIGGER:-P1D/);
  assert.match(ics, /Export the demo/);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.throws(() => app.buildIcs({ program: "", date: "2026-11-05" }), /program name/);
  assert.throws(() => app.buildIcs({ program: "X", date: "not-a-date" }), /valid date|real calendar/);
});

test("filename slugs are portable", () => {
  assert.equal(app.slugifyFilename("AWS Free Tier: Café!"), "aws-free-tier-cafe");
  assert.equal(app.slugifyFilename("***"), "program");
  assert.ok(app.slugifyFilename("word ".repeat(30)).length <= 56);
});
