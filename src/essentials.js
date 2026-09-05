(function () {
  "use strict";

  var TYPE_TITLES = {
    almanac: "Farmer's Almanac tip",
    joke: "Joke of the day",
    scripture: "Scripture",
    history: "This Day in History"
  };

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderEmpty(root, sourceNote) {
    if (!root) return;
    root.innerHTML =
      '<article class="feed-card essentials-card story-empty">' +
      '<span class="badge badge-waiting">WAITING</span>' +
      "<h3>Daily essentials</h3>" +
      "<p>Farmer\u2019s Almanac tip, joke, scripture, and This Day in History appear here when the daily feed is ready. Nothing invented for this draft.</p>" +
      "</article>";
    root.setAttribute("data-essentials-source", "empty");
    var note = document.getElementById("essentials-note");
    if (note) {
      note.textContent =
        sourceNote ||
        "Awaiting essentials JSON \u2014 empty until AI or editor fills it. Soft-fail keeps this honest.";
    }
  }

  function renderItems(root, items, sourceNote) {
    if (!root) return false;
    if (!items || !items.length) {
      renderEmpty(root, sourceNote);
      return false;
    }
    var html = items
      .map(function (item) {
        var title = item.title || TYPE_TITLES[item.type] || "Essential";
        var badge = item.badge || (item.source === "ai" ? "Daily" : "Daily");
        var body = item.body || "";
        var badgeClass =
          badge === "Daily" || item.source === "ai"
            ? "badge badge-live"
            : "badge";
        return (
          '<article class="feed-card essentials-card" data-type="' +
          escapeHtml(item.type || "") +
          '">' +
          '<span class="' +
          badgeClass +
          '">' +
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
    root.setAttribute(
      "data-essentials-source",
      sourceNote && sourceNote.indexOf("AI") >= 0 ? "ai" : "json"
    );
    var note = document.getElementById("essentials-note");
    if (note && sourceNote) note.textContent = sourceNote;
    return true;
  }

  function normalizePayload(data) {
    if (!data || typeof data !== "object") return null;
    if (Array.isArray(data.items)) {
      return {
        source: data.source || (data.items.length ? "json" : "empty"),
        items: data.items,
        generatedAt: data.generatedAt,
        note: data.note
      };
    }
    var keys = ["almanac", "joke", "scripture", "history"];
    var items = [];
    keys.forEach(function (key) {
      if (data[key] && (data[key].body || data[key].title)) {
        var chunk = data[key];
        var body = chunk.body || "";
        if (chunk.reference) {
          body = body ? body + " — " + chunk.reference : chunk.reference;
        }
        items.push({
          type: key,
          title: chunk.title || TYPE_TITLES[key],
          body: body,
          badge: data.source === "ai" ? "Daily" : "Daily",
          source: data.source
        });
      }
    });
    return {
      source: data.source || (items.length ? "json" : "empty"),
      items: items,
      generatedAt: data.generatedAt,
      note: data.note
    };
  }

  function noteFor(data, via) {
    if (data && data.source === "ai" && data.items && data.items.length) {
      return (
        "Daily essentials via " +
        via +
        " (AI). Brownsboro–Chandler local flavor." +
        (data.generatedAt ? " Updated " + data.generatedAt + "." : "")
      );
    }
    if (data && (!data.items || !data.items.length)) {
      return (
        "Awaiting essentials (" +
        via +
        ") — empty until AI or editor fills it. No invented EXAMPLE cards."
      );
    }
    return "Essentials from " + via + ".";
  }

  function tryFetch(url) {
    return fetch(url, { cache: "no-store", credentials: "same-origin" }).then(
      function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }
    );
  }

  function initEssentials() {
    var root = document.getElementById("essentials-root");
    if (!root) return;

    tryFetch("/api/essentials")
      .then(function (raw) {
        var data = normalizePayload(raw);
        if (!data) throw new Error("empty api");
        renderItems(root, data.items, noteFor(data, "/api/essentials"));
      })
      .catch(function () {
        return tryFetch("data/essentials.json").then(function (raw) {
          var data = normalizePayload(raw);
          if (!data) throw new Error("empty static");
          renderItems(root, data.items, noteFor(data, "data/essentials.json"));
        });
      })
      .catch(function () {
        // Soft-fail: keep honest empty HTML already in #essentials-root
        if (!root.querySelector(".essentials-card, .feed-card")) {
          renderEmpty(root, "Essentials JSON unavailable — leaving empty (no invented cards).");
        } else {
          root.setAttribute("data-essentials-source", "empty");
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEssentials);
  } else {
    initEssentials();
  }
})();
