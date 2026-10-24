import { escapeHtml, formatIsoDate } from "./markdown.mjs";
import { DISCLAIMER, SITE } from "./content.mjs";

const NAV = [
  { id: "guide", label: "The guide", href: "guide.html" },
  { id: "finder", label: "Program finder", href: "finder.html" },
  { id: "tracker", label: "Tracker", href: "tracker.html" },
  { id: "sources", label: "Sources", href: "sources.html" },
];

const ICONS = {
  "arrow-right": '<path d="M3 10h13M11 5l5 5-5 5"/>',
  "arrow-left": '<path d="M17 10H4m5-5-5 5 5 5"/>',
  external: '<path d="M11 3.5h5.5V9M16.5 3.5 8.5 11.5M15 12.5V17H3V5h4.5"/>',
  check: '<path d="m3 10.5 4.3 4.2L17 4.5"/>',
  clock: '<circle cx="10" cy="10" r="7.2"/><path d="M10 5.8V10l3 1.8"/>',
  download: '<path d="M10 2.8v10m0 0 4-4m-4 4-4-4M3 16.8h14"/>',
  search: '<circle cx="8.5" cy="8.5" r="5.3"/><path d="m12.5 12.5 4 4"/>',
  shield: '<path d="M10 2.4 17 5v4.6c0 4-2.9 6.8-7 8-4.1-1.2-7-4-7-8V5l7-2.6Z"/><path d="m6.8 9.8 2.1 2.1 4.4-4.4"/>',
  spark: '<path d="M10 2.5c.4 4.8 2.7 7.1 7.5 7.5-4.8.4-7.1 2.7-7.5 7.5-.4-4.8-2.7-7.1-7.5-7.5 4.8-.4 7.1-2.7 7.5-7.5Z"/>',
  cloud: '<path d="M6.6 15.8h7.6a3.8 3.8 0 0 0 .5-7.6 5.1 5.1 0 0 0-9.8 1.1 3.3 3.3 0 0 0 1.7 6.5Z"/>',
  terminal: '<rect x="2.5" y="3.5" width="15" height="13" rx="2"/><path d="m6 7 3 3-3 3m6.5 0H14"/>',
  book: '<path d="M3 3.5h5.2c1 0 1.8.8 1.8 1.8v11.2c0-1.1-.8-2-1.8-2H3V3.5Zm14 0h-5.2c-1 0-1.8.8-1.8 1.8v11.2c0-1.1.8-2 1.8-2H17V3.5Z"/>',
  calendar: '<rect x="3" y="4.5" width="14" height="12.5" rx="2"/><path d="M6.5 2.8v3.4M13.5 2.8v3.4M3 8.2h14m-10.3 3.3h2v2h-2z"/>',
  file: '<path d="M5 2.8h6l4 4v10.4H5V2.8Z"/><path d="M11 2.8v4h4M7.8 11h4.4m-4.4 3h4.4"/>',
  alert: '<path d="M10 3 18 17H2L10 3Z"/><path d="M10 8v4m0 2.6v.1"/>',
  "chevron-down": '<path d="m5 7.5 5 5 5-5"/>',
};

export function icon(name, className = "") {
  const path = ICONS[name];
  if (!path) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon${className ? ` ${className}` : ""}" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
}

export function iconSprite() {
  return `<svg class="svg-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
${Object.entries(ICONS)
  .map(
    ([name, paths]) =>
      `<symbol id="icon-${name}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</symbol>`,
  )
  .join("\n")}
</svg>`;
}

export function brandMark(className = "") {
  return `<svg class="brand-mark${className ? ` ${className}` : ""}" viewBox="0 0 42 42" aria-hidden="true" focusable="false">
  <rect width="42" height="42" rx="12" fill="currentColor"/>
  <path d="M10.8 30.8 19.4 11h3.2l8.6 19.8h-5.1l-1.5-4h-7.2l-1.5 4h-5.1Zm8-8h4.4l-2.2-5.9-2.2 5.9Z" fill="#f8f2e4"/>
  <circle cx="32.4" cy="31.5" r="3.1" fill="#eef0a5"/>
</svg>`;
}

export function externalLink(href, label, className = "text-link") {
  return `<a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
    label,
  )}${icon("external")}</a>`;
}

export function cardBadge(card) {
  const slug = String(card).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `<span class="badge badge-card badge-card--${slug}">${escapeHtml(card)}</span>`;
}

export function statusBadge(status, label) {
  return `<span class="badge badge-status badge-status--${escapeHtml(status)}"><span class="badge-dot" aria-hidden="true"></span>${escapeHtml(
    label,
  )}</span>`;
}

export function sectionHeading({ eyebrow, title, lede, action }) {
  return `<header class="section-heading">
  <div class="section-heading-main">
    <p class="eyebrow">${eyebrow}</p>
    <h2>${title}</h2>
  </div>
  <div class="section-heading-side">
    ${lede ? `<p>${lede}</p>` : ""}
    ${action || ""}
  </div>
</header>`;
}

export function header(current = "", checkedISO = "2026-10-22", checkedLabel = "October 22, 2026") {
  const links = NAV.map((item) => {
    const active = item.id === current;
    return `<a href="${item.href}"${active ? ' class="is-active" aria-current="page"' : ""}>${item.label}</a>`;
  }).join("");

  return `<div class="trust-bar">
  <div class="container trust-inner">
    <p class="trust-left"><span class="trust-signal" aria-hidden="true"></span>Independent, dated, no affiliate links</p>
    <p class="trust-right">Offers checked <time datetime="${escapeHtml(checkedISO)}">${escapeHtml(checkedLabel)}</time></p>
  </div>
</div>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="${SITE.name}, home">
      ${brandMark()}
      <span class="brand-copy">
        <span class="brand-kicker">${SITE.brand}</span>
        <span class="brand-title">${SITE.name}</span>
      </span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-label">Menu</span>
      <span class="nav-toggle-bars" aria-hidden="true"><span></span><span></span></span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
      ${links}
    </nav>
  </div>
</header>`;
}

export function footer(checkedISO = "2026-10-22", checkedLabel = "October 22, 2026") {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand brand--footer" href="index.html" aria-label="${SITE.name}, home">
        ${brandMark()}
        <span class="brand-copy">
          <span class="brand-kicker">${SITE.brand}</span>
          <span class="brand-title">${SITE.name}</span>
        </span>
      </a>
      <p>Free AI, cloud, and developer offers, with the catch included.</p>
      <p class="footer-small">Plain English. Dated facts. A cancel date before the card.</p>
    </div>
    <div class="footer-links">
      <h2>Explore</h2>
      <a href="guide.html">The guide</a>
      <a href="finder.html">Program finder</a>
      <a href="tracker.html">Tracker &amp; reminders</a>
      <a href="sources.html">Sources &amp; changes</a>
    </div>
    <div class="footer-links">
      <h2>Read before signing up</h2>
      <a href="08-avoid-surprise-bills.html">Avoid surprise bills</a>
      <a href="07-open-source-alternatives.html">Run AI locally</a>
      <a href="free-credit-tracker-template.csv" download>Download the tracker</a>
    </div>
    <div class="footer-note">
      <h2>The short rule</h2>
      <p>No card without a hard cap, a real job, and a dated exit.</p>
      <time class="footer-stamp" datetime="${escapeHtml(checkedISO)}">Checked ${escapeHtml(checkedLabel)}</time>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>Copyright (c) 2026 Asdale Dynamics, LLC. All rights reserved.</p>
    <p>${DISCLAIMER} Offers and terms change—verify with the provider.</p>
  </div>
</footer>`;
}

export function layout({
  title,
  description,
  current = "",
  bodyClass = "",
  main,
  ogType = "website",
  checked = "2026-10-22",
  checkedLabel = "October 22, 2026",
}) {
  const pageTitle =
    current === "home" || !title
      ? `${SITE.name}: free credits, real limits, no surprise bills`
      : `${title} | ${SITE.name}`;
  return `<!doctype html>
<html lang="${SITE.language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description || SITE.description)}">
  <meta name="author" content="${SITE.company}">
  <meta name="theme-color" content="${SITE.themeColor}">
  <meta name="color-scheme" content="light">
  <meta property="og:type" content="${escapeHtml(ogType)}">
  <meta property="og:site_name" content="${escapeHtml(SITE.name)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description || SITE.description)}">
  <script>document.documentElement.classList.add("js");</script>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/site.css">
  <script src="assets/site.js" defer></script>
</head>
<body class="page-${escapeHtml(bodyClass || current || "default")}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${iconSprite()}
  ${header(current, checked, checkedLabel)}
  <main id="main">
${main}
  </main>
  ${footer(checked, checkedLabel)}
</body>
</html>
`;
}

export function renderDate(iso, style = "long") {
  return formatIsoDate(iso, style);
}

export function pagerCard({ direction, href, label, title }) {
  return `<a class="pager-card pager-card--${direction}" href="${escapeHtml(href)}">
  <span class="pager-direction">${direction === "next" ? "Next" : "Previous"}</span>
  <span class="pager-label">${escapeHtml(label)}</span>
  <span class="pager-title">${escapeHtml(title)}</span>
  <span class="pager-arrow">${icon(direction === "next" ? "arrow-right" : "arrow-left")}</span>
</a>`;
}
