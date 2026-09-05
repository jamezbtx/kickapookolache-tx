(function () {
  "use strict";

  var KEYS = ["almanac", "joke", "scripture", "history"];

  function applyItem(card, item) {
    if (!card || !item) return;
    var badge = card.querySelector(".badge");
    var title = card.querySelector("h3");
    var body = card.querySelector("p");
    if (title && item.title) title.textContent = item.title;
    if (body) {
      var text = item.body || "";
      if (item.reference) {
        text = text ? text + " — " + item.reference : item.reference;
      }
      body.textContent = text;
    }
    if (badge) {
      if (item.example === false || item.source === "ai") {
        badge.textContent = item.source === "ai" ? "Daily" : "Local";
        badge.classList.remove("badge");
        badge.classList.add("badge", "badge-live");
      } else {
        badge.textContent = "EXAMPLE";
        badge.classList.remove("badge-live");
        badge.classList.add("badge");
      }
    }
  }

  function applyPayload(data) {
    if (!data || typeof data !== "object") return false;
    var root = document.getElementById("essentials-root");
    if (!root) return false;
    var applied = false;
    KEYS.forEach(function (key) {
      var card = root.querySelector('[data-essentials-key="' + key + '"]');
      if (card && data[key]) {
        applyItem(card, data[key]);
        applied = true;
      }
    });
    var note = document.getElementById("essentials-note");
    if (note && data.generatedAt) {
      var src = data.source === "ai" ? "AI daily draft" : "static JSON";
      note.textContent =
        "Essentials loaded from " +
        src +
        (data.timezone ? " · " + data.timezone : "") +
        (data.example ? " · EXAMPLE until verified" : "") +
        ".";
    }
    return applied;
  }

  function tryFetch(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  function initEssentials() {
    if (!document.getElementById("essentials-root")) return;
    // Prefer live API (Blobs from scheduled function), then static JSON, else keep HTML EXAMPLE.
    tryFetch("/api/essentials")
      .then(function (data) {
        if (!applyPayload(data)) throw new Error("empty api");
      })
      .catch(function () {
        return tryFetch("data/essentials.json").then(function (data) {
          if (!applyPayload(data)) throw new Error("empty static");
        });
      })
      .catch(function () {
        // Soft-fail: EXAMPLE markup already on the page.
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEssentials);
  } else {
    initEssentials();
  }
})();
