# The Free Tier Field Guide

**Free AI, cloud, and developer offers, with the catch included.** A practical field guide for careful builders: how to use legitimate free tiers, understand what they cost you in data or time, avoid surprise bills, and choose open-source alternatives when "free" needs to mean something more durable.

Built by **ASDALE DYNAMICS, LLC** for anyone who prefers plain English, dated facts, and a cancel date written down before the "Activate" button is clicked.

## At a glance

- **9 short chapters** covering AI API credits, cloud and developer free tiers, startup/student/nonprofit programs, local AI, and bill safety.
- **36 dated offers** in a filterable program finder, each with its card requirement and main catch.
- **Official sources and a dated change log**, so a claim can be traced back to a provider page.
- **A downloadable tracker CSV** and a browser-only `.ics` reminder generator.
- **No accounts, API keys, analytics, remote fonts, CDNs, or third-party scripts** in the site.
- **Zero npm dependencies.** Node.js 20+ is enough to build, test, and serve.

## Who it is for

Solo founders, authors, students, career changers, and small teams who want to use AI without mistaking a generous trial for a business model. It is written with a one-person Indiana LLC in mind, but the same questions apply to a nonprofit, a classroom, a side project, or a weekend experiment.

## Run it

Requirements: Node.js 20 or newer. There is nothing to install.

```bash
npm run build     # regenerate site/ from docs/ and src/site/
npm test          # build, run tests, verify content/links, and smoke-test HTTP
npm run serve     # serve site/ at http://localhost:4173
npm run dev       # build, then serve
```

The generated `site/` directory is committed, so you can host the folder as static files without a build step. For local preview, use the server rather than opening files directly: real HTTP paths, query-string filters, and security headers all behave the way they will in production.

## What is in this repository

- `docs/` — the full nine-chapter manual, a source list, and a downloadable tracker CSV template.
- `site/` — the generated, self-contained static website (14 pages plus `404.html`).
- `src/site/` — site styles, browser scripts, icons, and the program/source data used by the build.
- `scripts/` — the zero-dependency build, verification, and local server scripts.
- `tests/` — unit, data, generated-site, and HTTP server tests.

## Verification

`npm test` is the one command that checks the whole repository. It currently runs **31 tests** and a separate verifier that checks:

- all expected pages, metadata, landmarks, local assets, and the copyright notice;
- internal links and anchors, plus HTTPS and `rel="noopener"` on external links;
- program data, source coverage, chapter order, tracker schema, and CSV integrity;
- high-confidence secret patterns and unfinished placeholder text;
- HTTP behavior, including 404s, method handling, path traversal, and headers.

The build output and full verification results are recorded in [STATUS.md](./STATUS.md). Interactive browser checks (mobile menu, finder filters, tracker download, responsive overflow) were run separately with headless Chrome; they are not part of `npm test`, because the project intentionally has no browser-automation dependency.

## Read the manual

Start with `docs/README.md`, then read in order:

1. How free offers really work
2. Free AI API credits
3. Cloud free tiers
4. Startup credit programs
5. Student and education discounts
6. Nonprofit programs and the LLC boundary
7. Open-source and local alternatives
8. Avoiding surprise bills
9. Applying, maintaining, and knowing when to pay

The template tracker is `docs/free-credit-tracker-template.csv`. A copy is offered for download on the site's Tracker page.

## Freshness and honesty

Provider offers change constantly. Offer facts in this edition were checked on **October 22, 2026**; developer-infrastructure links were added and checked on **October 24, 2026**. The guide describes the shape of each offer and its main caveats, not a permanent price list. Always confirm eligibility, credit amounts, data-use terms, renewal behavior, and cancellation steps on the provider's own pages before entering payment details.

This project is educational. It is not financial, legal, tax, medical, or compliance advice. It contains no affiliate links and no sponsored placements. ASDALE DYNAMICS, LLC is not affiliated with the providers named.

## Privacy and safety

- The site is static HTML, CSS, and JavaScript. It makes no analytics or third-party requests.
- Finder filters run in the browser and sync to the URL; no query is sent to a server.
- The tracker form builds an `.ics` file locally. Nothing is uploaded, and no email is required.
- Never paste API keys, patient information, student records, client documents, or unpublished manuscripts into a free tier.
- The guide contains no real credentials or personal data. Secret scanning is part of `npm test`.

## Editing the guide

- Chapter source of truth: the numbered Markdown files in `docs/`.
- Program directory source of truth: `src/site/data/programs.json`.
- Source list and dated changes: `src/site/data/sources.json` and `src/site/data/changes.json`.
- Styling and interaction: `src/site/assets/`.
- Generated HTML lives in `site/` and should not be edited by hand.

When an offer changes, update the data file, the relevant chapter if needed, `updated` in the chapter front matter, and rerun `npm test`. Keep the date honest.

## Known limits

- This is a dated snapshot, not a live offer tracker. A link working today is not proof that an offer still exists.
- Some provider pages block automated checks with a 403 even when they are reachable in a normal browser. Link availability was checked separately from offer accuracy.
- The guide does not create accounts, enter payment methods, or test provider billing systems. It teaches the controls; the provider's current documentation is authoritative.
- It is not legal, tax, medical, or compliance advice. Nonprofit status, HIPAA, FERPA/COPPA, and contract questions need a qualified professional.
- The interactive browser checks are documented in [STATUS.md](./STATUS.md) but are not an automated CI suite.

## License and reuse

Copyright (c) 2026 Asdale Dynamics, LLC. All rights reserved. The guide is provided for personal and educational use; commercial reuse, republication, or redistribution requires written permission. See [LICENSE](./LICENSE) for the full notice.

Provider names and trademarks belong to their respective owners. This project is independent and is not sponsored by or affiliated with any provider named in the guide.
