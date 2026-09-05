(function () {
  "use strict";

  var TYPE_TITLES = {
    almanac: "Farmer's Almanac tip",
    joke: "Joke of the day",
    scripture: "Scripture",
    history: "This Day in History"
  };

  var FALLBACK_ITEMS = [
    {
      type: "almanac",
      title: "Farmer's Almanac tip",
      body:
        "EXAMPLE only — not a live almanac feed. After Labor Day, Brownsboro–Chandler gardens can still use a little shade cloth; plant cool-weather greens once the afternoon heat finally breaks.",
      badge: "EXAMPLE"
    },
    {
      type: "joke",
      title: "Joke of the day",
      body:
        "EXAMPLE only — not a live joke feed. Why did the kolache refuse to leave Chandler? It was already in a jam — and the coffee on Main Street was still hot.",
      badge: "EXAMPLE"
    },
    {
      type: "scripture",
      title: "Scripture",
      body:
        "EXAMPLE only — not a live lectionary. “Love your neighbor as yourself.” A short weekday verse for Brownsboro–Chandler kitchen tables; live rotation comes later.",
      badge: "EXAMPLE"
    },
    {
      type: "history",
      title: "This Day in History",
      body:
        "EXAMPLE only — not a live history feed. On this day in East Texas lore: neighbors in Brownsboro and Chandler swapped harvest news over fence lines long before the FM roads were paved. Local heritage placeholder.",
      badge: "EXAMPLE"
    }
  ];

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderItems(root, items, sourceNote) {
    if (!root || !items || !items.length) return;
    var html = items
      .map(function (item) {
        var title = item.title || TYPE_TITLES[item.type] || "Essential";
        var badge = item.badge || (item.source === "ai" ? "Daily" : "EXAMPLE");
        var body = item.body || "";
        return (
          '<article class="feed-card essentials-card" data-type="' +
          escapeHtml(item.type || "") +
          '">' +
          '<span class="badge">' +
          escapeHtml(badge) +
          "</span>" +
          "<h3>" +
          escapeHtml(title) +
          "</h3>" +
          "<p>" +
          escapeHtml(body) +
          "</p>" +
          "</article>"
        );
      })
      .join("\n");
    root.innerHTML = html;
    var note = document.getElementById("essentials-note");
    if (note && sourceNote) note.textContent = sourceNote;
  }

  function applyFallback(root, reason) {
    renderItems(
      root,
      FALLBACK_ITEMS,
      "EXAMPLE placeholders — Farmer’s Almanac, joke, scripture, and This Day in History are sample cards only. Not live AI yet." +
        (reason ? " (" + reason + ")" : "")
    );
  }

  function initEssentials() {
    var root = document.getElementById("essentials-root");
    if (!root) return;

    fetch("/data/essentials.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.items) || !data.items.length) {
          applyFallback(root, "empty payload");
          return;
        }
        var source = data.source === "ai" ? "ai" : "fallback";
        var note =
          source === "ai"
            ? "Daily essentials refreshed at build (AI source). Brownsboro–Chandler local flavor."
            : "EXAMPLE placeholders — Farmer’s Almanac, joke, scripture, and This Day in History are sample cards only. Not live AI yet. Scaffold written by fetch-essentials.js.";
        renderItems(root, data.items, note);
      })
      .catch(function () {
        // Soft-fail: keep static EXAMPLE HTML already in #essentials-root
        // if present; otherwise inject fallback cards.
        if (!root.querySelector(".essentials-card, .feed-card")) {
          applyFallback(root, "json missing");
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEssentials);
  } else {
    initEssentials();
  }
})();
