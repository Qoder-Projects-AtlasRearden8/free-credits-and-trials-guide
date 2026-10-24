import {
  AUDIENCE_ORDER,
  CARD_ORDER,
  CATEGORY_META,
  CATEGORY_ORDER,
  DISCLAIMER,
  FEATURED_PROGRAMS,
  SITE,
  STATUS_LABELS,
} from "./content.mjs";
import { escapeHtml, formatIsoDate } from "./markdown.mjs";
import {
  brandMark,
  cardBadge,
  externalLink,
  icon,
  layout,
  pagerCard,
  sectionHeading,
  statusBadge,
} from "./ui.mjs";

function categoryHref(category) {
  return `finder.html?category=${encodeURIComponent(category)}`;
}

function categoryCounts(programs) {
  const counts = new Map(CATEGORY_ORDER.map((category) => [category, 0]));
  for (const program of programs) {
    counts.set(program.category, (counts.get(program.category) || 0) + 1);
  }
  return counts;
}

function shortDate(iso) {
  return formatIsoDate(iso, "short");
}

function featuredProgram(program) {
  return `<article class="mini-program">
  <div class="mini-program-top">
    <span class="mini-program-provider">${escapeHtml(program.provider)}</span>
    ${cardBadge(program.card)}
  </div>
  <h3><a href="finder.html#p-${escapeHtml(program.id)}">${escapeHtml(program.name)}</a></h3>
  <p>${escapeHtml(program.headline)}</p>
  <div class="mini-program-foot">
    ${statusBadge(program.status, STATUS_LABELS[program.status])}
    <a class="text-link text-link--small" href="finder.html#p-${escapeHtml(program.id)}">Read the entry ${icon("arrow-right")}</a>
  </div>
</article>`;
}

function chapterTeaser(chapter) {
  return `<a class="chapter-teaser" href="${chapter.output}">
  <span class="chapter-teaser-number">${String(chapter.order).padStart(2, "0")}</span>
  <span class="chapter-teaser-content">
    <span class="chapter-teaser-kicker">${escapeHtml(chapter.kicker)}</span>
    <span class="chapter-teaser-title">${escapeHtml(chapter.title)}</span>
    <span class="chapter-teaser-description">${escapeHtml(chapter.description)}</span>
    <span class="chapter-teaser-meta">${chapter.readingMinutes} min read ${icon("arrow-right")}</span>
  </span>
</a>`;
}

function pageActions({ primaryHref, primaryLabel, secondaryHref, secondaryLabel }) {
  return `<div class="button-row">
  <a class="button button-primary" href="${primaryHref}">${primaryLabel}${icon("arrow-right")}</a>
  <a class="button button-secondary" href="${secondaryHref}">${secondaryLabel}</a>
</div>`;
}

export function renderHome({ chapters, programs, stats }) {
  const counts = categoryCounts(programs);
  const featured = FEATURED_PROGRAMS.map((id) => programs.find((program) => program.id === id)).filter(
    Boolean,
  );
  const selectedChapters = [1, 7, 8]
    .map((order) => chapters.find((chapter) => chapter.order === order))
    .filter(Boolean);

  const categoryCards = CATEGORY_ORDER.map((category) => {
    const meta = CATEGORY_META[category];
    return `<a class="category-card category-card--${meta.slug}" href="${categoryHref(category)}">
  <span class="category-card-top">
    <span class="category-count">${counts.get(category)} ${counts.get(category) === 1 ? "offer" : "offers"}</span>
    <span class="category-arrow">${icon("arrow-right")}</span>
  </span>
  <span class="category-title">${escapeHtml(meta.label)}</span>
  <span class="category-blurb">${escapeHtml(meta.blurb)}</span>
  <span class="category-note">${escapeHtml(meta.note)}</span>
</a>`;
  }).join("\n");

  const main = `<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span>An Asdale Dynamics field guide</p>
      <h1>Free credits.<br>Real limits.<br><span class="hero-highlight">No surprise bills.</span></h1>
      <p class="hero-lede">Use AI, cloud, and developer offers with your eyes open. Learn what each free tier really includes, what it costs in data or time, and how to set a clean exit before the meter starts.</p>
      ${pageActions({
        primaryHref: "finder.html",
        primaryLabel: "Find a free program",
        secondaryHref: "guide.html",
        secondaryLabel: "Read the guide",
      })}
      <ul class="hero-stats" aria-label="What is inside the guide">
        <li><strong>${stats.programs}</strong><span>offers checked<br>by hand</span></li>
        <li><strong>${stats.chapters}</strong><span>short chapters<br>plain English</span></li>
        <li><strong>0</strong><span>affiliate links<br>or sponsored spots</span></li>
      </ul>
    </div>
    <aside class="promise-panel" aria-labelledby="promise-title">
      <div class="promise-top">
        <span>Before “Activate”</span>
        <span class="promise-tag">Field note 01</span>
      </div>
      <h2 id="promise-title">The three-line<br>promise</h2>
      <ol class="promise-list">
        <li>
          <span class="promise-number">01</span>
          <span><strong>A real job</strong><small>A free account is not a plan. Name the one task it serves.</small></span>
        </li>
        <li>
          <span class="promise-number">02</span>
          <span><strong>A hard cap</strong><small>Turn on the limit that blocks spend, not just the alert.</small></span>
        </li>
        <li>
          <span class="promise-number">03</span>
          <span><strong>A cancel date</strong><small>Write it down before the card and put it on the calendar.</small></span>
        </li>
      </ol>
      <p class="promise-foot">If a provider can charge you,<br>it gets all three.</p>
      <a class="text-link" href="08-avoid-surprise-bills.html">Read the bill-safety playbook ${icon("arrow-right")}</a>
    </aside>
  </div>
</section>

<section class="section section-paths">
  <div class="container">
    ${sectionHeading({
      eyebrow: "Start where you are",
      title: "A safe first move,<br>whatever you need.",
      lede: "You do not need thirty accounts. Pick one useful job, give it a limit, and know how to walk away.",
    })}
    <div class="path-grid">
      <a class="path-card" href="${categoryHref("AI API")}">
        <span class="path-card-top"><span class="path-number">01</span><span class="path-icon">${icon("spark")}</span></span>
        <span class="path-kicker">For a first API key</span>
        <span class="path-title">Find a free AI allowance</span>
        <span class="path-description">Compare real free tiers, their rate limits, and the data trade-off that comes with them.</span>
        <span class="text-link">Browse AI APIs ${icon("arrow-right")}</span>
      </a>
      <a class="path-card" href="${categoryHref("Cloud")}">
        <span class="path-card-top"><span class="path-number">02</span><span class="path-icon">${icon("cloud")}</span></span>
        <span class="path-kicker">For a cloud experiment</span>
        <span class="path-title">Trial without leftovers</span>
        <span class="path-description">See which cloud offers need a card, what expires, and where forgotten resources hide.</span>
        <span class="text-link">Explore cloud offers ${icon("arrow-right")}</span>
      </a>
      <a class="path-card" href="07-open-source-alternatives.html">
        <span class="path-card-top"><span class="path-number">03</span><span class="path-icon">${icon("terminal")}</span></span>
        <span class="path-kicker">For privacy or offline work</span>
        <span class="path-title">Run a model locally</span>
        <span class="path-description">Skip the per-token meter. Understand the hardware, maintenance, and security costs instead.</span>
        <span class="text-link">Read the local-first chapter ${icon("arrow-right")}</span>
      </a>
      <a class="path-card" href="08-avoid-surprise-bills.html">
        <span class="path-card-top"><span class="path-number">04</span><span class="path-icon">${icon("shield")}</span></span>
        <span class="path-kicker">For peace of mind</span>
        <span class="path-title">Build a clean exit</span>
        <span class="path-description">Set native caps, test them, save the cancel link, and put the decision on your calendar.</span>
        <span class="text-link">Open the bill-safety playbook ${icon("arrow-right")}</span>
      </a>
    </div>
  </div>
</section>

<section class="safety-feature">
  <div class="container safety-feature-grid">
    <div class="safety-feature-copy">
      <p class="eyebrow eyebrow--light">The rule that saves the most money</p>
      <h2>An alert tells you the house is on fire.<br><span>A hard cap is the sprinkler.</span></h2>
      <p>Most dashboards are good at sending email. That is not the same as stopping usage. Before you trust a guardrail, find out whether it blocks the request—and test it with a tiny limit.</p>
      <a class="button button-light" href="08-avoid-surprise-bills.html#alert-versus-brake">Learn the difference ${icon("arrow-right")}</a>
    </div>
    <div class="wallet-card" aria-label="Credits, alerts, and hard caps compared">
      <div class="wallet-head">
        <span>The two-wallet mistake</span>
        ${icon("alert")}
      </div>
      <div class="wallet-row">
        <span class="wallet-label">Credits</span>
        <p>A dollar balance. It can run out, or the account can start charging your card.</p>
        <span class="wallet-tag">Not a cap</span>
      </div>
      <div class="wallet-row">
        <span class="wallet-label">Rate limits</span>
        <p>They control how fast you can go, not the total monthly damage.</p>
        <span class="wallet-tag">Not a cap</span>
      </div>
      <div class="wallet-row">
        <span class="wallet-label">Alerts</span>
        <p>They notify you after a threshold. Useful, but they do not stop the request.</p>
        <span class="wallet-tag">Not a brake</span>
      </div>
      <div class="wallet-rule">Only a hard cap, quota, or tested block stops usage. <strong>Test yours.</strong></div>
    </div>
  </div>
</section>

<section class="section section-categories">
  <div class="container">
    ${sectionHeading({
      eyebrow: "What kind of free?",
      title: "Six shapes of an offer.",
      lede: "A rate-limited API, an expiring cloud trial, a student benefit, and local software are not interchangeable. Browse them by the decision you are actually making.",
      action: `<a class="button button-secondary" href="finder.html">See all ${stats.programs} offers ${icon("arrow-right")}</a>`,
    })}
    <div class="category-grid">
      ${categoryCards}
    </div>
  </div>
</section>

<section class="section section-chapters">
  <div class="container">
    ${sectionHeading({
      eyebrow: "The field guide",
      title: "Read the parts<br>you need.",
      lede: "Start with the basics, go straight to local AI, or learn the bill-safety system. Every chapter is short enough for a coffee break.",
      action: `<a class="text-link" href="guide.html">See all ${stats.chapters} chapters ${icon("arrow-right")}</a>`,
    })}
    <div class="chapter-teaser-grid">
      ${selectedChapters.map(chapterTeaser).join("\n")}
    </div>
  </div>
</section>

<section class="section section-featured">
  <div class="container">
    ${sectionHeading({
      eyebrow: "From the directory",
      title: "Three offers worth knowing.",
      lede: "A useful free tier, a way to ship a static site, and a local-first escape hatch. Each entry includes the catch.",
      action: `<a class="button button-secondary" href="finder.html">Open the program finder ${icon("arrow-right")}</a>`,
    })}
    <div class="mini-program-grid">
      ${featured.map(featuredProgram).join("\n")}
    </div>
    <p class="fine-print">Inclusion is not an endorsement. Offers are snapshots from ${escapeHtml(
      stats.checkedLabel,
    )}; verify the current terms with the provider before you sign up.</p>
  </div>
</section>

<section class="closing-band">
  <div class="container closing-grid">
    <div>
      <p class="eyebrow">The goal is not more accounts</p>
      <h2>Keep the useful free stuff.<br><span>Lose the billing mystery.</span></h2>
      <p>A good free trial helps you learn something and then lets you leave cleanly. Set the decision date before the momentum takes over.</p>
      <div class="button-row">
        <a class="button button-primary" href="finder.html">Browse every offer ${icon("arrow-right")}</a>
        <a class="button button-secondary" href="tracker.html">Get the tracker</a>
      </div>
    </div>
    <blockquote class="closing-quote">
      <p>“Free is a starting point.<br>A budget is a business.”</p>
      <footer>From Chapter 09 · ${escapeHtml(SITE.company)}</footer>
    </blockquote>
  </div>
</section>`;

  return layout({
    title: SITE.name,
    description: SITE.description,
    current: "home",
    bodyClass: "home",
    main,
    checked: stats.checked,
    checkedLabel: stats.checkedLabel,
  });
}

export function renderGuide({ chapters, stats }) {
  const chapterRows = chapters
    .map(
      (chapter) => `<li>
  <a class="chapter-row" href="${chapter.output}">
    <span class="chapter-row-number">${String(chapter.order).padStart(2, "0")}</span>
    <span class="chapter-row-body">
      <span class="chapter-row-kicker">${escapeHtml(chapter.kicker)}</span>
      <span class="chapter-row-title">${escapeHtml(chapter.title)}</span>
      <span class="chapter-row-description">${escapeHtml(chapter.description)}</span>
      <span class="chapter-row-meta">${chapter.readingMinutes} min read <span aria-hidden="true">·</span> Updated ${shortDate(chapter.updated)}</span>
    </span>
    <span class="chapter-row-arrow">${icon("arrow-right")}</span>
  </a>
</li>`,
    )
    .join("\n");

  const main = `<section class="page-hero guide-hero">
  <div class="container page-hero-grid">
    <div class="page-hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span>The complete manual</p>
      <h1>Nine chapters.<br>One careful habit.</h1>
      <p class="page-lede">No growth hacks, no coupon hoarding, and no pretending a trial is a business model. Learn how free offers work, where the real costs hide, and when paying is the simpler choice.</p>
      <div class="button-row">
        <a class="button button-primary" href="${chapters[0].output}">Start with chapter one ${icon("arrow-right")}</a>
        <a class="button button-secondary" href="free-credit-tracker-template.csv" download>Download the tracker</a>
      </div>
    </div>
    <aside class="guide-stamp" aria-label="Guide details">
      <span class="guide-stamp-label">FIELD EDITION</span>
      <strong>${stats.chapters}</strong>
      <span>chapters</span>
      <span class="guide-stamp-rule"></span>
      <span>Checked ${escapeHtml(stats.checkedLabel)}</span>
      <span>${stats.programs} dated program entries</span>
      <span>No affiliate links</span>
    </aside>
  </div>
</section>

<section class="section guide-section">
  <div class="container guide-layout">
    <aside class="guide-rail">
      <div class="rail-card">
        <p class="rail-label">Fast track</p>
        <h2>Short on time?</h2>
        <ol>
          <li><a href="01-how-free-offers-work.html">Understand the five kinds of free</a></li>
          <li><a href="08-avoid-surprise-bills.html">Set caps and a cancel date</a></li>
          <li><a href="09-apply-maintain-and-know-when-to-pay.html">Decide when to pay</a></li>
        </ol>
      </div>
      <div class="rail-quote">
        <p>“You will get more value from three careful experiments than from thirty free accounts.”</p>
        <span>Chapter 09</span>
      </div>
      <div class="rail-card rail-card--plain">
        <p class="rail-label">Keep nearby</p>
        <a class="text-link" href="finder.html">Program finder ${icon("arrow-right")}</a>
        <a class="text-link" href="tracker.html">Tracker &amp; reminders ${icon("arrow-right")}</a>
        <a class="text-link" href="sources.html">Sources &amp; dated changes ${icon("arrow-right")}</a>
      </div>
    </aside>
    <div class="guide-chapters">
      <div class="guide-chapters-head">
        <p class="eyebrow">Contents</p>
        <p>In order, or jump to what is useful today.</p>
      </div>
      <ol class="chapter-list">
        ${chapterRows}
      </ol>
      <div class="guide-rule-card">
        <div class="guide-rule-icon">${icon("shield")}</div>
        <div>
          <p class="rail-label">Before you open a provider tab</p>
          <h2>The one-sentence policy</h2>
          <p>“I do not enter a card unless I have a hard cap, a real job for the tool, and a cancel date written down.”</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="closing-band closing-band--compact">
  <div class="container closing-grid">
    <div>
      <p class="eyebrow">Start small</p>
      <h2>One offer.<br><span>One honest test.</span></h2>
      <p>Pick a free tier with no card, name the task, and see whether it earns a place in your workflow. The directory includes the catch for every entry.</p>
    </div>
    <div class="button-row button-row--end">
      <a class="button button-primary" href="finder.html">Open the program finder ${icon("arrow-right")}</a>
      <a class="button button-secondary" href="tracker.html">Make a reminder</a>
    </div>
  </div>
</section>`;

  return layout({
    title: "The guide",
    description:
      "The complete nine-chapter field guide to free AI, cloud, and developer offers, bill safety, local AI, and choosing when to pay.",
    current: "guide",
    bodyClass: "guide",
    main,
    checked: stats.checked,
    checkedLabel: stats.checkedLabel,
  });
}

export function renderChapter({ chapter, chapters, previous, next, stats }) {
  const toc = chapter.toc;
  const tocLinks = toc.length
    ? toc
        .map(
          (item) =>
            `<a class="toc-link toc-link--h${item.level}" href="#${escapeHtml(item.id)}">${escapeHtml(
              item.text,
            )}</a>`,
        )
        .join("\n")
    : '<p class="toc-empty">This chapter has no subsections.</p>';

  const tocDisclosure = toc.length
    ? `<details class="toc-disclosure">
  <summary>On this page ${icon("chevron-down")}</summary>
  <nav class="toc-mobile-links" aria-label="On this page">
    ${tocLinks}
  </nav>
</details>`
    : "";

  const prevCard = previous
    ? pagerCard({
        direction: "previous",
        href: previous.output,
        label: `Chapter ${String(previous.order).padStart(2, "0")}`,
        title: previous.title,
      })
    : pagerCard({
        direction: "previous",
        href: "guide.html",
        label: "The guide",
        title: "Browse all chapters",
      });

  const nextCard = next
    ? pagerCard({
        direction: "next",
        href: next.output,
        label: `Chapter ${String(next.order).padStart(2, "0")}`,
        title: next.title,
      })
    : pagerCard({
        direction: "next",
        href: "tracker.html",
        label: "Put it into practice",
        title: "Set a decide-by date",
      });

  const main = `<article class="chapter">
  <header class="chapter-hero">
    <div class="container chapter-hero-inner">
      <div class="chapter-hero-top">
        <a class="back-link" href="guide.html">${icon("arrow-left")} All chapters</a>
        <span class="chapter-position">Chapter ${String(chapter.order).padStart(2, "0")} of ${String(
          chapters.length,
        ).padStart(2, "0")}</span>
      </div>
      <p class="chapter-kicker">${escapeHtml(chapter.kicker)}</p>
      <h1>${escapeHtml(chapter.title)}</h1>
      <p class="chapter-lede">${escapeHtml(chapter.description)}</p>
      <div class="chapter-meta">
        <span>${icon("clock")} ${chapter.readingMinutes} min read</span>
        <span>${icon("check")} Updated ${shortDate(chapter.updated)}</span>
        <span>${icon("shield")} Checked ${escapeHtml(stats.checkedLabel)}</span>
      </div>
    </div>
  </header>
  <div class="container chapter-layout">
    <aside class="chapter-aside">
      <div class="aside-sticky">
        <p class="toc-label">On this page</p>
        <nav class="toc" aria-label="On this page">
          ${tocLinks}
        </nav>
        <div class="aside-promo">
          <span class="aside-promo-icon">${icon("shield")}</span>
          <p class="rail-label">Before you enter a card</p>
          <p>Run the 15-minute audit: list the tools, set one hard cap, save one cancel URL.</p>
          <a class="text-link text-link--small" href="${
            chapter.order === 8 ? "tracker.html" : "08-avoid-surprise-bills.html"
          }">${chapter.order === 8 ? "Download a reminder" : "Open the playbook"} ${icon("arrow-right")}</a>
        </div>
      </div>
    </aside>
    <div class="chapter-content-wrap">
      ${tocDisclosure}
      <div class="prose">
        ${chapter.html}
      </div>
      <aside class="chapter-safety-note">
        <span class="chapter-safety-icon">${icon("shield")}</span>
        <div>
          <h2>The habit behind the list</h2>
          <p>Offers change. A dated check, a tested limit, and a cancel path do not. Use the tracker before you use the trial.</p>
        </div>
        <a class="button button-secondary" href="tracker.html">Open the tracker</a>
      </aside>
      <nav class="chapter-pager" aria-label="Chapter navigation">
        ${prevCard}
        ${nextCard}
      </nav>
    </div>
  </div>
</article>`;

  return layout({
    title: chapter.title,
    description: chapter.description,
    current: "guide",
    bodyClass: "chapter-page",
    main,
    ogType: "article",
    checked: stats.checked,
    checkedLabel: stats.checkedLabel,
  });
}

function audienceLabel(audience) {
  if (audience === "Anyone") return "For anyone";
  if (audience === "Startups") return "For startups";
  if (audience === "Students") return "For students";
  if (audience === "Nonprofits") return "For nonprofits";
  return "For personal projects";
}

function programCard(program) {
  const search = [
    program.name,
    program.provider,
    program.category,
    ...program.audience,
    program.headline,
    program.whatYouGet,
    program.watchOut,
    program.eligibility,
  ]
    .join(" ")
    .toLowerCase();

  return `<article class="program-card" id="p-${escapeHtml(program.id)}"
  data-program
  data-name="${escapeHtml(program.name)}"
  data-provider="${escapeHtml(program.provider)}"
  data-category="${escapeHtml(program.category)}"
  data-audience="${escapeHtml(program.audience.join("|"))}"
  data-card="${escapeHtml(program.card)}"
  data-status="${escapeHtml(program.status)}"
  data-search="${escapeHtml(search)}">
  <div class="program-top">
    <p class="program-provider">${escapeHtml(program.provider)} <span aria-hidden="true">·</span> ${escapeHtml(
      CATEGORY_META[program.category].label,
    )}</p>
    ${statusBadge(program.status, STATUS_LABELS[program.status])}
  </div>
  <h3 class="program-title">${escapeHtml(program.name)}</h3>
  <p class="program-headline">${escapeHtml(program.headline)}</p>
  <dl class="program-details">
    <div>
      <dt>What you get</dt>
      <dd>${escapeHtml(program.whatYouGet)}</dd>
    </div>
    <div class="program-warning">
      <dt>${icon("alert")} Watch out</dt>
      <dd>${escapeHtml(program.watchOut)}</dd>
    </div>
    <div>
      <dt>Eligibility</dt>
      <dd>${escapeHtml(program.eligibility)}</dd>
    </div>
  </dl>
  <div class="program-foot">
    <div class="program-labels">
      ${cardBadge(program.card)}
      <span class="program-audience">${escapeHtml(audienceLabel(program.audience[0]))}</span>
    </div>
    <div class="program-links">
      <span class="program-checked">Checked ${shortDate(program.checked)}</span>
      ${externalLink(program.url, "Official page", "program-link")}
    </div>
  </div>
</article>`;
}

export function renderFinder({ programs, stats }) {
  const counts = categoryCounts(programs);
  const categoryOptions = CATEGORY_ORDER.map(
    (category) =>
      `<option value="${escapeHtml(category)}">${escapeHtml(CATEGORY_META[category].label)} (${counts.get(
        category,
      )})</option>`,
  ).join("");

  const audienceCounts = new Map();
  for (const program of programs) {
    for (const audience of program.audience) {
      audienceCounts.set(audience, (audienceCounts.get(audience) || 0) + 1);
    }
  }
  const audienceOptions = AUDIENCE_ORDER.filter((audience) => audienceCounts.has(audience))
    .map(
      (audience) =>
        `<option value="${escapeHtml(audience)}">${escapeHtml(audience)} (${audienceCounts.get(
          audience,
        )})</option>`,
    )
    .join("");

  const cardOptions = CARD_ORDER.map(
    (card) =>
      `<option value="${escapeHtml(card)}">${escapeHtml(card)} (${programs.filter((program) => program.card === card).length})</option>`,
  ).join("");

  const main = `<section class="page-hero finder-hero">
  <div class="container page-hero-grid">
    <div class="page-hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span>Checked ${escapeHtml(stats.checkedLabel)}</p>
      <h1>The free program finder.</h1>
      <p class="page-lede">${stats.programs} AI, cloud, startup, education, nonprofit, and local-first offers—with the card requirement and the catch stated plainly.</p>
    </div>
    <div class="finder-summary" aria-label="Directory summary">
      <div><strong>${stats.programs}</strong><span>dated offers</span></div>
      <div><strong>${stats.categories}</strong><span>categories</span></div>
      <div><strong>0</strong><span>affiliate links</span></div>
    </div>
  </div>
</section>

<section class="finder-section">
  <div class="container">
    <div class="finder-notice">
      <span class="finder-notice-icon">${icon("alert")}</span>
      <div>
        <strong>An entry is a starting point, not a promise.</strong>
        <p>Amounts, eligibility, data terms, and card requirements can change. Read the provider's current page before adding a payment method. Inclusion is not an endorsement.</p>
      </div>
      <a href="08-avoid-surprise-bills.html">Bill-safety checklist ${icon("arrow-right")}</a>
    </div>

    <form class="finder-controls" id="program-filters" role="search" aria-label="Filter program offers">
      <div class="control control--search">
        <label for="program-search">Search offers</label>
        <span class="search-input-wrap">
          ${icon("search")}
          <input type="search" id="program-search" name="q" placeholder="Provider, tool, or category" autocomplete="off">
        </span>
      </div>
      <div class="control">
        <label for="filter-category">Category</label>
        <select id="filter-category" name="category">
          <option value="">All categories</option>
          ${categoryOptions}
        </select>
      </div>
      <div class="control">
        <label for="filter-audience">Audience</label>
        <select id="filter-audience" name="audience">
          <option value="">All audiences</option>
          ${audienceOptions}
        </select>
      </div>
      <div class="control">
        <label for="filter-card">Payment method</label>
        <select id="filter-card" name="card">
          <option value="">Any requirement</option>
          ${cardOptions}
        </select>
      </div>
      <button class="button button-quiet finder-reset" type="reset">Reset</button>
    </form>

    <div class="finder-meta">
      <p id="result-count" role="status" aria-live="polite">Showing all ${stats.programs} offers.</p>
      <p>Last checked ${escapeHtml(stats.checkedLabel)} <span aria-hidden="true">·</span> No affiliate links</p>
    </div>

    <noscript>
      <div class="inline-notice">Filters need JavaScript. All ${stats.programs} offers are listed below, so you can still browse without it.</div>
    </noscript>

    <div class="program-grid" id="program-grid">
      ${programs.map(programCard).join("\n")}
    </div>

    <div class="empty-state" id="no-results" hidden>
      <span class="empty-icon">${icon("search")}</span>
      <h2>No offers match those filters.</h2>
      <p>Try a shorter search, a different category, or reset the filters to see every entry.</p>
      <button class="button button-secondary" type="button" id="clear-filters">Clear all filters</button>
    </div>

    <p class="finder-disclaimer">${DISCLAIMER} Amounts and terms are snapshots from ${escapeHtml(
      stats.checkedLabel,
    )}. Verify eligibility and billing behavior with the provider. <a href="sources.html">See the source list</a>.</p>
  </div>
</section>`;

  return layout({
    title: "Free program finder",
    description: `Browse ${stats.programs} dated free AI, cloud, developer, startup, education, nonprofit, and open-source offers with card requirements and caveats.`,
    current: "finder",
    bodyClass: "finder",
    main,
    checked: stats.checked,
    checkedLabel: stats.checkedLabel,
  });
}

export function renderTracker({ stats, columns }) {
  const columnRows = columns
    .map(
      (column) => `<tr>
  <th scope="row"><code>${escapeHtml(column.key)}</code><span>${escapeHtml(column.label)}</span></th>
  <td>${escapeHtml(column.help)}</td>
</tr>`,
    )
    .join("\n");

  const main = `<section class="page-hero tracker-hero">
  <div class="container page-hero-grid">
    <div class="page-hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span>Make the careful choice repeatable</p>
      <h1>Track the trial.<br>Keep the exit.</h1>
      <p class="page-lede">Two dates prevent most billing surprises: when the offer ends, and when you will decide. Put both somewhere you will actually look.</p>
    </div>
    <aside class="tracker-hero-card">
      <p class="rail-label">The rule</p>
      <p>If a tool has your card, the tracker needs its cancel URL and a decide-by date.</p>
      <span>No passwords. No API keys. No card numbers.</span>
    </aside>
  </div>
</section>

<section class="section tracker-section">
  <div class="container">
    <div class="download-panel">
      <span class="download-panel-icon">${icon("file")}</span>
      <div class="download-panel-copy">
        <p class="eyebrow">The plain CSV</p>
        <h2>Your free-tier flight log.</h2>
        <p>${columns.length} columns for eligibility, renewal dates, spend caps, cancellation links, and the one job the tool is meant to do. The two example rows are fictional—replace them with your own.</p>
      </div>
      <div class="download-panel-action">
        <a class="button button-primary" href="free-credit-tracker-template.csv" download>Download tracker CSV ${icon(
          "download",
        )}</a>
        <span>Opens in any spreadsheet. No account needed.</span>
      </div>
    </div>

    <div class="tracker-grid">
      <section class="calendar-panel" aria-labelledby="calendar-title">
        <div class="panel-heading">
          <span class="panel-icon">${icon("calendar")}</span>
          <div>
            <p class="eyebrow">A reminder you will actually see</p>
            <h2 id="calendar-title">Make a decide-by event.</h2>
          </div>
        </div>
        <p class="panel-lede">This creates an all-day calendar event with a one-day-before alert. It happens entirely in your browser; nothing is sent anywhere.</p>
        <form class="calendar-form" id="calendar-form" novalidate>
          <div class="form-field">
            <label for="reminder-program">Program name <span>Required</span></label>
            <input id="reminder-program" name="program" type="text" maxlength="100" autocomplete="off" placeholder="Example: AWS Free account plan" required>
            <p class="field-help">Use the same name as your tracker row.</p>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label for="reminder-date">Decide by <span>Required</span></label>
              <input id="reminder-date" name="date" type="date" required>
              <p class="field-help">Pick a date before renewal or trial end.</p>
            </div>
            <div class="form-field">
              <label for="reminder-note">Note <span>Optional</span></label>
              <input id="reminder-note" name="note" type="text" maxlength="180" autocomplete="off" placeholder="Export the demo, then decide">
              <p class="field-help">Appears inside the calendar event.</p>
            </div>
          </div>
          <p class="form-error" id="calendar-error" role="alert" hidden></p>
          <div class="form-actions">
            <button class="button button-primary" type="submit">Download .ics reminder ${icon("download")}</button>
            <span>Works with Google Calendar, Apple Calendar, Outlook, and most calendar apps.</span>
          </div>
          <p class="form-status" id="calendar-status" role="status" aria-live="polite"></p>
        </form>
        <noscript>
          <div class="inline-notice">The reminder generator needs JavaScript. You can still use the CSV tracker and your calendar app directly.</div>
        </noscript>
      </section>

      <aside class="calendar-aside">
        <div class="calendar-preview">
          <div class="calendar-preview-top">
            <span>ALL-DAY EVENT</span>
            <span class="calendar-preview-dot" aria-hidden="true"></span>
          </div>
          <p class="calendar-preview-label">Reminder preview</p>
          <h3 id="calendar-preview-title">Decide: keep or cancel your program</h3>
          <p class="calendar-preview-date" id="calendar-preview-date">Choose a date to preview it</p>
          <p class="calendar-preview-copy">Check usage and export anything you need. Cancel, downgrade, or commit before the renewal.</p>
          <div class="calendar-preview-rule"></div>
          <span class="calendar-preview-alert">${icon("clock")} Alert one day before</span>
        </div>
        <div class="aside-note">
          <p class="rail-label">Why not just rely on the provider?</p>
          <p>Because the email may be filtered, the dashboard may lag, and the trial clock keeps moving. A calendar event is a second, independent reminder.</p>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section tracker-steps-section">
  <div class="container">
    ${sectionHeading({
      eyebrow: "How to use it",
      title: "A five-minute habit.",
      lede: "The tracker is deliberately boring. That is what makes it useful when the renewal email arrives.",
    })}
    <ol class="step-grid">
      <li>
        <span class="step-number">01</span>
        <h3>One row per offer</h3>
        <p>Record the official URL, eligibility, card status, and the exact job you want it to do.</p>
      </li>
      <li>
        <span class="step-number">02</span>
        <h3>Fill dates before the card</h3>
        <p>Add the trial end, renewal date, and a decide-by date that leaves room to act.</p>
      </li>
      <li>
        <span class="step-number">03</span>
        <h3>Set the native control</h3>
        <p>Turn on the provider's spend cap or quota, then test it with a deliberately tiny limit.</p>
      </li>
      <li>
        <span class="step-number">04</span>
        <h3>Review once a month</h3>
        <p>Open the resource list, check the invoices, revoke unused keys, and close the row you finished.</p>
      </li>
    </ol>

    <details class="field-dictionary">
      <summary><span>Every tracker column, explained</span> ${icon("chevron-down")}</summary>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">Column</th><th scope="col">What it is for</th></tr></thead>
          <tbody>${columnRows}</tbody>
        </table>
      </div>
    </details>

    <div class="privacy-callout">
      <span class="privacy-callout-icon">${icon("shield")}</span>
      <div>
        <h2>Keep it useful, not sensitive.</h2>
        <p>Use a dedicated business email and an account identifier—never a password, full card number, recovery code, or API key. Do not put patient, student, or client information in the tracker. This template is recordkeeping, not a secret store.</p>
      </div>
    </div>
  </div>
</section>`;

  return layout({
    title: "Tracker and calendar reminders",
    description:
      "Download a free-tier tracker CSV and generate a local calendar reminder for the date you will decide to keep, downgrade, or cancel a trial.",
    current: "tracker",
    bodyClass: "tracker",
    main,
    checked: stats.checked,
    checkedLabel: stats.checkedLabel,
  });
}

export function renderSources({ sources, changes, stats }) {
  const groups = sources.groups
    .map(
      (group, index) => `<section class="source-group">
  <div class="source-group-head">
    <span class="source-group-number">${String(index + 1).padStart(2, "0")}</span>
    <h2>${escapeHtml(group.name)}</h2>
    <span class="source-group-count">${group.entries.length} ${group.entries.length === 1 ? "source" : "sources"}</span>
  </div>
  <ul class="source-list">
    ${group.entries
      .map(
        (entry) => `<li>
  <a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
    entry.name,
  )}${icon("external")}</a>
  <p>${escapeHtml(entry.note)}</p>
</li>`,
      )
      .join("\n")}
  </ul>
</section>`,
    )
    .join("\n");

  const timeline = changes
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(
      (change) => `<li class="timeline-item">
  <div class="timeline-date">
    <time datetime="${escapeHtml(change.date)}">${shortDate(change.date)}</time>
    <span>${escapeHtml(change.kind)}</span>
  </div>
  <div class="timeline-body">
    <h3>${escapeHtml(change.title)}</h3>
    <p>${escapeHtml(change.summary)}</p>
    ${externalLink(change.url, "Open the source", "text-link text-link--small")}
  </div>
</li>`,
    )
    .join("\n");

  const main = `<section class="page-hero sources-hero">
  <div class="container page-hero-grid">
    <div class="page-hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span>Receipts, dates, and limits</p>
      <h1>Sources &amp;<br>what changed.</h1>
      <p class="page-lede">The guide is only as useful as its check date. These are the official provider pages and the material changes that shaped this edition.</p>
    </div>
    <div class="sources-summary">
      <div><strong>${stats.sources}</strong><span>source links</span></div>
      <div><strong>${changes.length}</strong><span>dated changes</span></div>
      <div><strong>${escapeHtml(shortDate(stats.checked))}</strong><span>last check</span></div>
    </div>
  </div>
</section>

<section class="section sources-section">
  <div class="container sources-grid">
    <div class="source-groups">
      <div class="method-note">
        <span class="method-note-icon">${icon("check")}</span>
        <div>
          <strong>How this edition was checked</strong>
          <p>Official provider pages were reviewed on ${escapeHtml(
            stats.checkedLabel,
          )}. Entries avoid invented limits: where a number depends on region, model, account history, or plan, the guide says so.</p>
        </div>
      </div>
      ${groups}
    </div>
    <aside class="sources-aside">
      <div class="aside-sticky">
        <div class="rail-card">
          <p class="rail-label">Read this first</p>
          <h2>A link is not a guarantee.</h2>
          <p>Provider pages change without notice. A working link only means the page exists; it does not prove the offer is unchanged. Confirm eligibility, amounts, data-use terms, and cancellation behavior yourself.</p>
        </div>
        <div class="rail-quote">
          <p>“The date is part of the content.”</p>
          <span>Chapter 01</span>
        </div>
        <div class="rail-card rail-card--plain">
          <a class="text-link" href="08-avoid-surprise-bills.html">Bill-safety playbook ${icon(
            "arrow-right",
          )}</a>
          <a class="text-link" href="tracker.html">Track your own check dates ${icon("arrow-right")}</a>
        </div>
      </div>
    </aside>
  </div>
</section>

<section class="section changes-section">
  <div class="container">
    ${sectionHeading({
      eyebrow: "Why the date matters",
      title: "Material changes,<br>not a museum.",
      lede: "Free programs can close, retire, or change how they count usage. These are the changes worth knowing when an older guide tells you otherwise.",
    })}
    <ol class="timeline">
      ${timeline}
    </ol>
  </div>
</section>

<section class="closing-band closing-band--compact">
  <div class="container closing-grid">
    <div>
      <p class="eyebrow">Before you rely on a source</p>
      <h2>Check the page.<br><span>Update your tracker.</span></h2>
      <p>If an offer has changed, the official page wins. Record the new date, the new catch, and the decision you made.</p>
    </div>
    <div class="button-row button-row--end">
      <a class="button button-primary" href="tracker.html">Open the tracker ${icon("arrow-right")}</a>
      <a class="button button-secondary" href="guide.html">Back to the guide</a>
    </div>
  </div>
</section>`;

  return layout({
    title: "Sources and changes",
    description:
      "Official sources, method notes, and the 2026 program changes behind The Free Tier Field Guide, checked October 22, 2026.",
    current: "sources",
    bodyClass: "sources",
    main,
    checked: stats.checked,
    checkedLabel: stats.checkedLabel,
  });
}

export function renderNotFound({ stats }) {
  const main = `<section class="not-found">
  <div class="container not-found-inner">
    <p class="not-found-code">404</p>
    <p class="eyebrow">That page took an unplanned exit</p>
    <h1>Nothing here but a clean slate.</h1>
    <p>The address may have changed, or the link may have a typo. The guide and program finder are still where you left them.</p>
    <div class="button-row">
      <a class="button button-primary" href="index.html">Go home ${icon("arrow-right")}</a>
      <a class="button button-secondary" href="finder.html">Browse programs</a>
    </div>
  </div>
</section>`;

  return layout({
    title: "Page not found",
    description: "That page could not be found. Return to The Free Tier Field Guide.",
    current: "",
    bodyClass: "not-found-page",
    main,
    checked: stats.checked,
    checkedLabel: stats.checkedLabel,
  });
}

export function renderBrandMarkPreview() {
  return brandMark();
}
