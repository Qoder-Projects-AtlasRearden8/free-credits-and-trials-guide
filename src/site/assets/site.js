(function (root) {
  "use strict";

  function normalizeSearch(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getAudiences(program) {
    if (Array.isArray(program.audience)) return program.audience;
    return String(program.audience || "")
      .split("|")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  function filterPrograms(programs, filters) {
    const query = normalizeSearch(filters && filters.query);
    const category = filters && filters.category ? String(filters.category) : "";
    const audience = filters && filters.audience ? String(filters.audience) : "";
    const card = filters && filters.card ? String(filters.card) : "";
    const tokens = query ? query.split(" ") : [];

    return programs.filter((program) => {
      if (category && program.category !== category) return false;
      if (audience && !getAudiences(program).includes(audience)) return false;
      if (card && program.card !== card) return false;
      if (tokens.length) {
        const haystack = normalizeSearch(
          [
            program.name,
            program.provider,
            program.category,
            getAudiences(program).join(" "),
            program.headline,
            program.whatYouGet,
            program.watchOut,
            program.eligibility,
            program.search,
          ].join(" "),
        );
        if (!tokens.every((token) => haystack.includes(token))) return false;
      }
      return true;
    });
  }

  function parseIsoDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) throw new Error("Choose a valid date.");
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error("Choose a real calendar date.");
    }
    return date;
  }

  function icsDate(value) {
    return parseIsoDate(value).toISOString().slice(0, 10).replace(/-/g, "");
  }

  function addDaysToIso(value, days) {
    const date = parseIsoDate(value);
    date.setUTCDate(date.getUTCDate() + Number(days || 0));
    return date.toISOString().slice(0, 10);
  }

  function icsTimestamp(now) {
    const date = now instanceof Date ? now : new Date(now || Date.now());
    if (Number.isNaN(date.valueOf())) throw new Error("Invalid timestamp.");
    return `${date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`;
  }

  function escapeIcsText(value) {
    return String(value == null ? "" : value)
      .replace(/\\/g, "\\\\")
      .replace(/\r\n?|\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  }

  function foldIcsLine(value) {
    const line = String(value == null ? "" : value);
    const encoder = new TextEncoder();
    let current = "";
    let bytes = 0;
    const lines = [];
    for (const character of line) {
      const size = encoder.encode(character).length;
      if (bytes + size > 75) {
        lines.push(current);
        current = ` ${character}`;
        bytes = 1 + size;
      } else {
        current += character;
        bytes += size;
      }
    }
    lines.push(current);
    return lines.join("\r\n");
  }

  function slugifyFilename(value) {
    const slug = String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 56);
    return slug || "program";
  }

  function buildIcs(options) {
    const program = String((options && options.program) || "").trim();
    if (!program) throw new Error("Enter the program name.");
    const date = options && options.date;
    parseIsoDate(date);
    const note = String((options && options.note) || "").trim();
    const timestamp = icsTimestamp(options && options.now);
    const endDate = addDaysToIso(date, 1);
    const uid =
      (options && options.uid) ||
      `free-tier-${date.replace(/-/g, "")}-${slugifyFilename(program)}-${Date.now()}@asdale-dynamics.local`;
    const description = [
      note ? `Note: ${note}` : "",
      "Check usage and export anything you need. Then keep, downgrade, or cancel before the renewal or charge.",
      "From The Free Tier Field Guide by Asdale Dynamics, LLC.",
    ]
      .filter(Boolean)
      .join("\n");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Asdale Dynamics, LLC//The Free Tier Field Guide//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${icsDate(date)}`,
      `DTEND;VALUE=DATE:${icsDate(endDate)}`,
      `SUMMARY:${escapeIcsText(`Decide: keep or cancel ${program}`)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "TRANSP:TRANSPARENT",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(`Decide tomorrow: ${program}`)}`,
      "TRIGGER:-P1D",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
  }

  function localIsoDate(date) {
    const value = date instanceof Date ? date : new Date(date);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatReadableDate(value) {
    try {
      const date = parseIsoDate(value);
      return new Intl.DateTimeFormat(undefined, {
        timeZone: "UTC",
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return "Choose a date to preview it";
    }
  }

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    const header = document.querySelector(".site-header");
    if (!toggle || !nav || !header) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      const label = toggle.querySelector(".nav-toggle-label");
      if (label) label.textContent = open ? "Close" : "Menu";
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) setOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  function initFinder() {
    const form = document.getElementById("program-filters");
    const grid = document.getElementById("program-grid");
    if (!form || !grid) return;

    const search = document.getElementById("program-search");
    const category = document.getElementById("filter-category");
    const audience = document.getElementById("filter-audience");
    const card = document.getElementById("filter-card");
    const resultCount = document.getElementById("result-count");
    const noResults = document.getElementById("no-results");
    const clearButton = document.getElementById("clear-filters");
    const cards = Array.from(grid.querySelectorAll("[data-program]")).map((element) => ({
      element,
      name: element.dataset.name,
      provider: element.dataset.provider,
      category: element.dataset.category,
      audience: element.dataset.audience,
      card: element.dataset.card,
      status: element.dataset.status,
      search: element.dataset.search,
    }));
    const total = cards.length;

    const availableValues = (select) =>
      new Set(Array.from(select.options).map((option) => option.value).filter(Boolean));

    const readQueryIntoControls = () => {
      const params = new URLSearchParams(window.location.search);
      const values = {
        q: params.get("q") || "",
        category: params.get("category") || "",
        audience: params.get("audience") || "",
        card: params.get("card") || "",
      };
      search.value = values.q;
      const selects = [
        [category, values.category],
        [audience, values.audience],
        [card, values.card],
      ];
      for (const [select, value] of selects) {
        select.value = availableValues(select).has(value) ? value : "";
      }
    };

    const readFilters = () => ({
      query: search.value,
      category: category.value,
      audience: audience.value,
      card: card.value,
    });

    const syncUrl = (filters) => {
      const url = new URL(window.location.href);
      const pairs = {
        q: filters.query.trim(),
        category: filters.category,
        audience: filters.audience,
        card: filters.card,
      };
      for (const [key, value] of Object.entries(pairs)) {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      }
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    };

    const applyFilters = (sync = true) => {
      const filters = readFilters();
      const visible = filterPrograms(cards, filters);
      const visibleElements = new Set(visible.map((item) => item.element));
      for (const item of cards) item.element.hidden = !visibleElements.has(item.element);
      if (resultCount) {
        resultCount.textContent =
          visible.length === total
            ? `Showing all ${total} offers.`
            : `Showing ${visible.length} of ${total} offers.`;
      }
      if (noResults) noResults.hidden = visible.length !== 0;
      grid.hidden = visible.length === 0;
      if (sync) syncUrl(filters);
    };

    const reset = () => {
      form.reset();
      search.value = "";
      for (const select of [category, audience, card]) select.value = "";
      applyFilters();
    };

    readQueryIntoControls();
    applyFilters(false);
    form.addEventListener("input", () => applyFilters());
    form.addEventListener("change", () => applyFilters());
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFilters();
    });
    form.addEventListener("reset", (event) => {
      event.preventDefault();
      reset();
    });
    if (clearButton) clearButton.addEventListener("click", reset);
  }

  function initTracker() {
    const form = document.getElementById("calendar-form");
    if (!form) return;

    const program = document.getElementById("reminder-program");
    const date = document.getElementById("reminder-date");
    const note = document.getElementById("reminder-note");
    const error = document.getElementById("calendar-error");
    const status = document.getElementById("calendar-status");
    const previewTitle = document.getElementById("calendar-preview-title");
    const previewDate = document.getElementById("calendar-preview-date");

    const today = localIsoDate(new Date());
    date.min = today;
    if (!date.value) date.value = addDaysToIso(today, 7);

    const updatePreview = () => {
      const name = program.value.trim();
      if (previewTitle) {
        previewTitle.textContent = name
          ? `Decide: keep or cancel ${name}`
          : "Decide: keep or cancel your program";
      }
      if (previewDate) previewDate.textContent = formatReadableDate(date.value);
    };

    const showError = (message) => {
      if (!error) return;
      error.textContent = message;
      error.hidden = !message;
      if (message) {
        error.focus?.();
        if (status) status.textContent = "";
      }
    };

    program.addEventListener("input", updatePreview);
    date.addEventListener("input", updatePreview);
    updatePreview();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showError("");
      if (status) status.textContent = "";
      const programName = program.value.trim();
      if (!programName) {
        showError("Enter the program name so the reminder is useful.");
        program.focus();
        return;
      }
      if (!date.value) {
        showError("Choose the date you will decide.");
        date.focus();
        return;
      }
      if (date.value < today) {
        showError("Choose today or a future date for the reminder.");
        date.focus();
        return;
      }

      try {
        const ics = buildIcs({
          program: programName,
          date: date.value,
          note: note.value.trim(),
        });
        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `decide-${slugifyFilename(programName)}.ics`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        if (status) {
          status.textContent = `Reminder downloaded for ${formatReadableDate(date.value)}. Import the .ics file into your calendar.`;
        }
      } catch (caught) {
        showError(caught.message || "The reminder could not be created.");
      }
    });
  }

  function init() {
    initNavigation();
    initFinder();
    initTracker();
  }

  const api = {
    normalizeSearch,
    filterPrograms,
    parseIsoDate,
    icsDate,
    addDaysToIso,
    icsTimestamp,
    escapeIcsText,
    foldIcsLine,
    slugifyFilename,
    buildIcs,
    localIsoDate,
    formatReadableDate,
  };

  root.FreeTierGuide = api;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
