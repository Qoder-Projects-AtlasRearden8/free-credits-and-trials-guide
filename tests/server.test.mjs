import assert from "node:assert/strict";
import test from "node:test";
import { createStaticServer } from "../scripts/serve.mjs";

let server;
let base;

test.before(async () => {
  server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  server.closeAllConnections?.();
  await new Promise((resolve) => server.close(resolve));
});

test("serves the home page and local assets", async () => {
  const home = await fetch(`${base}/`);
  assert.equal(home.status, 200);
  assert.match(home.headers.get("content-type"), /^text\/html/);
  assert.equal(home.headers.get("x-content-type-options"), "nosniff");
  assert.match(await home.text(), /The Free Tier Field Guide/);

  const css = await fetch(`${base}/assets/site.css`);
  assert.equal(css.status, 200);
  assert.match(css.headers.get("content-type"), /^text\/css/);

  const csv = await fetch(`${base}/free-credit-tracker-template.csv`);
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("content-type"), /^text\/csv/);
});

test("supports HEAD and rejects unsupported methods", async () => {
  const head = await fetch(`${base}/index.html`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");

  const post = await fetch(`${base}/`, { method: "POST" });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
});

test("returns the custom 404 page and resists path traversal", async () => {
  const missing = await fetch(`${base}/not-here`);
  assert.equal(missing.status, 404);
  const html = await missing.text();
  assert.match(html, /Nothing here but a clean slate/);

  const traversal = await fetch(`${base}/%2e%2e%2fpackage.json`);
  assert.ok(![200, 301].includes(traversal.status));
  assert.doesNotMatch(await traversal.text(), /free-credits-and-trials-guide/);

  const malformed = await fetch(`${base}/%E0%A4%A`);
  assert.ok([400, 404].includes(malformed.status));
});
