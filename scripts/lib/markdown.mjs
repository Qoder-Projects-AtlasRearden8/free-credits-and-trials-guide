const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "section";
}

function safeHref(raw) {
  const href = String(raw || "").trim();
  if (!href) return "#";
  if (/^(https:\/\/|http:\/\/|mailto:|tel:|#|\/|\.{1,2}\/)/i.test(href)) return href;
  if (/^[\w./-]+(#[-\w]+)?$/.test(href)) return href;
  return "#";
}

function isSafeHexColor(value) {
  return /^#[0-9a-f]{3,8}$/i.test(value);
}

function plainText(value) {
  return String(value)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/[#>*_`]/g, "")
    .trim();
}

function tokenizeInline(text) {
  const tokens = [];
  const protectedText = String(text).replace(/`([^`\n]+)`/g, (_, code) => {
    const index = tokens.length;
    tokens.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000INLINE${index}\u0000`;
  });
  return { protectedText, tokens };
}

function restoreInline(text, tokens) {
  return text.replace(/\u0000INLINE(\d+)\u0000/g, (_, index) => tokens[Number(index)] ?? "");
}

function renderInline(raw, rewriteHref) {
  const { protectedText, tokens } = tokenizeInline(raw);
  let text = escapeHtml(protectedText);

  text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt, href) => {
    const safe = safeHref(href);
    return safe === "#" ? escapeHtml(alt) : `<img src="${escapeHtml(safe)}" alt="${escapeHtml(alt)}" loading="lazy">`;
  });

  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
    const rewritten = rewriteHref ? rewriteHref(href) : href;
    const safe = safeHref(rewritten);
    if (safe === "#") return label;
    const external = /^https?:\/\//i.test(safe);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${escapeHtml(safe)}"${attrs}>${label}</a>`;
  });

  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s).,;:!?])/g, "$1<em>$2</em>");
  text = text.replace(/~~([^~\n]+)~~/g, "<del>$1</del>");

  return restoreInline(text, tokens);
}

function splitTableRow(line) {
  let body = line.trim();
  if (body.startsWith("|")) body = body.slice(1);
  if (body.endsWith("|")) body = body.slice(0, -1);
  return body.split("|").map((cell) => cell.trim());
}

function isTableSeparator(line) {
  if (!line || !line.includes("|")) return false;
  return splitTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

function listMatch(line) {
  const match = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
  if (!match) return null;
  return {
    indent: match[1].replace(/\t/g, "  ").length,
    ordered: /^\d+\.$/.test(match[2]),
    content: match[3],
  };
}

function renderList(items, depth, rewriteHref) {
  if (!items.length) return "";
  const ordered = items[0].ordered;
  const tag = ordered ? "ol" : "ul";
  let html = `<${tag}>\n`;
  let index = 0;

  while (index < items.length) {
    const item = items[index];
    const children = [];

    index += 1;
    while (index < items.length && items[index].indent > item.indent) {
      const childLevel = items[index].indent;
      const siblings = [];
      while (index < items.length && items[index].indent === childLevel) {
        siblings.push(items[index]);
        index += 1;
      }
      children.push(renderList(siblings, depth + 1, rewriteHref));
    }

    html += `<li>${renderInline(item.content, rewriteHref)}${children.join("")}</li>\n`;
  }

  html += `</${tag}>\n`;
  return html;
}

function countWords(markdown) {
  const text = String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_|~-]/g, " ");
  const matches = text.match(/[\p{Letter}\p{Number}]+(?:['’-][\p{Letter}\p{Number}]+)*/gu);
  return matches ? matches.length : 0;
}

export function renderMarkdown(markdown, options = {}) {
  const rewriteHref = options.rewriteHref || ((href) => href);
  const source = String(markdown).replace(/\r\n?/g, "\n");
  const lines = source.split("\n");
  const html = [];
  const toc = [];
  const usedIds = new Map();
  let index = 0;

  const uniqueId = (raw) => {
    const base = slugify(plainText(raw));
    const seen = usedIds.get(base) || 0;
    usedIds.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  };

  const isBlockStart = (line, nextLine) => {
    if (!line.trim()) return true;
    if (/^\s*#{1,4}\s+/.test(line)) return true;
    if (/^\s*(```|~~~)/.test(line)) return true;
    if (/^\s*>\s?/.test(line)) return true;
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) return true;
    if (listMatch(line)) return true;
    if (line.trim().startsWith("|") && nextLine && isTableSeparator(nextLine)) return true;
    return false;
  };

  while (index < lines.length) {
    const line = lines[index];
    const nextLine = lines[index + 1] ?? "";

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^\s*(```+|~~~+)\s*([\w-]*)\s*$/);
    if (fence) {
      const marker = fence[1][0];
      const lang = fence[2] || "";
      const codeLines = [];
      index += 1;
      while (index < lines.length && !new RegExp(`^\\s*${marker}{3,}\\s*$`).test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      html.push(`<pre><code${langClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^\s*(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = uniqueId(text);
      const rendered = renderInline(text, rewriteHref);
      html.push(`<h${level} id="${escapeHtml(id)}">${rendered}</h${level}>`);
      if (level === 2 || level === 3) {
        toc.push({ level, text: plainText(text), id });
      }
      index += 1;
      continue;
    }

    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line) && !listMatch(line)) {
      html.push("<hr>");
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      const paragraphs = quoteLines
        .join(" ")
        .split(/\s{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);
      html.push(
        `<blockquote>${paragraphs
          .map((part) => `<p>${renderInline(part, rewriteHref)}</p>`)
          .join("")}</blockquote>`,
      );
      continue;
    }

    if (line.trim().startsWith("|") && isTableSeparator(nextLine)) {
      const headerCells = splitTableRow(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      const head = headerCells
        .map((cell) => `<th scope="col">${renderInline(cell, rewriteHref)}</th>`)
        .join("");
      const body = rows
        .map(
          (cells) =>
            `<tr>${cells
              .map((cell) => `<td>${renderInline(cell, rewriteHref)}</td>`)
              .join("")}</tr>`,
        )
        .join("");
      html.push(
        `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`,
      );
      continue;
    }

    const firstListItem = listMatch(line);
    if (firstListItem) {
      const items = [];
      const baseIndent = firstListItem.indent;
      while (index < lines.length) {
        const item = listMatch(lines[index]);
        if (!item) break;
        items.push({ ...item, indent: Math.max(0, Math.floor((item.indent - baseIndent) / 2) * 2) });
        index += 1;
      }
      html.push(renderList(items, 0, rewriteHref));
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length) {
      const current = lines[index];
      const following = lines[index + 1] ?? "";
      if (isBlockStart(current, following)) break;
      paragraph.push(current.trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "), rewriteHref)}</p>`);
  }

  const wordCount = countWords(source);
  return {
    html: html.join("\n"),
    toc,
    wordCount,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 220)),
  };
}

export function formatIsoDate(iso, style = "long") {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  if (!match) return String(iso || "");
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: style === "short" ? "short" : "long",
    day: "numeric",
  }).format(date);
}

export function isSafeColor(value) {
  return isSafeHexColor(value);
}
