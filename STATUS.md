# Project status

**Updated:** October 24, 2026
**Status:** Complete first edition, ready for local review and static hosting.

## What was built

A beginner-friendly field guide to free AI, cloud, and developer offers, published in two forms from one source:

- **Markdown manual in `docs/`:** nine numbered chapters, a quick-start README, a 19-column tracker template, and an official source list with a dated change log.
- **Static website in `site/`:** 14 content pages plus `404.html`, with a home page, chapter reader, filterable program finder, tracker page, source timeline, and a downloadable CSV. The generated site is committed and has no runtime dependencies.
- **Structured data in `src/site/data/`:** 36 checked programs, 67 source links, seven dated changes, and the tracker schema.
- **Zero-dependency tooling in `scripts/`:** build, static server, and verifier. `package.json` has no third-party packages.
- **Tests in `tests/`:** Markdown rendering and escaping, content validation, CSV/front-matter parsing, finder and `.ics` logic, generated-site structure, and HTTP server behavior.

The guide is written for Dylan Asdale / ASDALE DYNAMICS, LLC and follows the requested plain-English, step-by-step, non-condescending voice. It is educational only and does not give medical, legal, tax, or compliance advice. There are no affiliate links, remote assets, analytics, API keys, or real personal data in the repository.

## How to run it

Requirements: Node.js 20 or newer. No install step is needed.

```bash
npm run build     # regenerate site/ from docs/ and src/site/
npm test          # build, 31 tests, then full content/link/HTTP verification
npm run serve     # http://localhost:4173
npm run dev       # build, then serve
```

To preview an already-built site, run `npm run serve`; the server serves the committed `site/` directory. The site can also be hosted as ordinary static files.

## Verification results

Final run on **October 24, 2026**:

| Check | Result |
|---|---|
| Build | 14 content pages plus `404.html`; 36 programs, 9 chapters, 67 sources |
| Automated tests (`node --test`) | **31 passed, 0 failed** |
| Internal links and anchors | **306 checked**, all valid |
| External links | **185 checked**, all HTTPS with safe `rel` attributes |
| Page structure and local assets | **15/15 pages passed** |
| Secret scan | clean (no high-confidence key or private-key patterns) |
| Placeholder scan | clean (no unfinished task markers or sample filler text) |
| HTTP smoke test | passed: GET/HEAD, 404 page, method guard, path-traversal resistance |
| Headless Chrome interaction checks | **22/22 passed** (see below) |

The separate browser checks covered:

- Mobile menu: toggle, visible 307px dropdown, body scroll lock, Escape close, focus return, no console errors.
- Finder: initial 36 offers, search, category filter, empty state, reset, URL query sync, and deep-link restoration.
- Tracker: valid `.ics` creation and download, preview text, status message, and rejection of past dates.
- Responsive layout: no horizontal overflow at 390px or 1440px on home, guide, chapters 1–3, finder, tracker, and sources pages.

These browser checks were run with a local headless-Chrome script during this session. They are **not** part of `npm test`, because the repository intentionally has no browser-automation dependency. The automated suite covers the same filter/date/`.ics` logic directly.

## Content coverage

- **Chapter 1:** the five kinds of "free," provider motives, card risks, the two-wallet mistake, and a 10-minute safety setup.
- **Chapter 2:** real AI API free tiers (Gemini, Groq, OpenRouter, Cloudflare, Mistral, Cohere, NVIDIA), common non-offers, free coding assistants, token economics, portable code, and data-use warnings.
- **Chapter 3:** AWS, Google Cloud, Azure, Oracle, hosting platforms, and free developer infrastructure (CI, edge, databases, object storage, monitoring), plus teardown discipline.
- **Chapter 4:** honest startup-credit tiers for a bootstrapped LLC, application kit, usage forecasts, and Indiana resources.
- **Chapter 5:** student programs, verification, 2026 changes, and the line between learning and running a business.
- **Chapter 6:** nonprofit eligibility, Google/Microsoft/AWS/TechSoup programs, and the LLC boundary.
- **Chapter 7:** local AI stack, hardware expectations, model licenses, self-hosting costs, and security.
- **Chapter 8:** alerts versus hard caps, provider controls, the `$1` test, API-key hygiene, monthly close, and cancellation playbook.
- **Chapter 9:** maintaining the tracker, portability, honest applications, when to pay, and a 90-day plan.

## Known gaps

- **Dated snapshot, not a live tracker.** Offer facts are dated October 22, 2026. Provider terms change constantly; the guide says so repeatedly, but no automated process re-verifies provider pages.
- **Link rot.** New developer-infrastructure links were checked on October 24, 2026. Some provider pages return 403 to automated clients even when reachable in a browser, so availability checks are not the same as offer verification.
- **No real signup or billing test.** No accounts, payment methods, emails, or provider billing systems were touched. The provider's current documentation remains authoritative.
- **Browser checks are manual/scripted, not CI.** There is no hosted CI or screenshot-diff suite in the repository.
- **Scope and jurisdiction.** The manual is English-language and U.S.-leaning, especially on nonprofit and tax topics. Readers outside the U.S. must verify local eligibility and rules.
- **Not professional advice.** Nonprofit formation, HIPAA, FERPA/COPPA, taxes, contracts, and compliance require a qualified professional.
- **Commercial reuse is restricted.** The text and design are all rights reserved by Asdale Dynamics, LLC; see `LICENSE`.
- **Single edition.** The program finder has 36 offers, not every free tier in existence. It favors offers that could be checked and explained honestly over an exhaustive list.

## Repository notes

- The site is generated; do not edit files in `site/` by hand. Edit `docs/` or `src/site/` and rerun `npm run build`.
- `site/.nojekyll` is included for hosting on GitHub Pages.
- The repository is local-only. No remote, push, deployment, or publication was performed.
- Commit history uses the existing git identity only, with no co-author trailers.
