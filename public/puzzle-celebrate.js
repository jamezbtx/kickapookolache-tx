/*
 * Puzzle celebration pop-up for the Country Living Crossword and Word Search.
 * Shared copy lives in LINES below (edit here only). No business names, no ads.
 * Usage: PuzzleCelebrate.show({ type: "crossword" | "wordsearch", onAgain: fn });
 * Shows at most once per page load. Callers must only call it for a genuine solve
 * (no revealed answers).
 */
(function () {
  "use strict";

  var LINES = {
    crossword: [
      "You are true country! Even the hound dog is impressed.",
      "Solved it quicker than a church potluck line.",
      "Sweet tea is on the house (not really, but you earned it).",
      "Every square filled. The tractor would applaud if it could.",
      "Smoother than Grandma's cornbread. Nicely done.",
      "That puzzle never stood a chance against a porch-sitter like you.",
      "Put your feet up. The porch swing has been saved for you.",
      "Not one square left behind. The neighbors will hear about this.",
      "Brainy as a barn owl and twice as friendly.",
      "Gone faster than the last biscuit at supper, and just as satisfying."
    ],
    wordsearch: [
      "You are true country! The rooster says so.",
      "Found every word faster than the potluck dessert table empties.",
      "Sharper eyes than a hound dog on a hot trail.",
      "Sweet tea is on the house (not really, but you earned it).",
      "Every word found, even the ones hiding behind the barn.",
      "Eyes like that could spot a lost button in the hayloft.",
      "Not one word got past you. The tractor is jealous.",
      "Quicker than finding a seat on the porch swing at a family reunion.",
      "Neighbor, those are the sharpest eyes on the whole road.",
      "Quicker than a hen at feeding time."
    ]
  };

  var NAMES = { crossword: "Country Living Crossword", wordsearch: "Country Living Word Search" };
  var shown = false;
  var root = null;
  var lastFocus = null;
  var opts = null;
  var currentLine = "";

  function pick(type) {
    var list = LINES[type] || LINES.crossword;
    return list[Math.floor(Math.random() * list.length)];
  }

  function pageUrl() {
    var link = document.querySelector('link[rel="canonical"]');
    var base = link && link.href ? link.href : location.origin + location.pathname;
    return base.split("#")[0].split("?")[0] + (location.search || "");
  }

  function focusables() {
    return Array.prototype.slice.call(root.querySelectorAll("button:not([disabled])"));
  }

  function close() {
    if (!root) return;
    root.hidden = true;
    document.documentElement.classList.remove("pc-open");
    document.removeEventListener("keydown", onKey, true);
    var back = lastFocus;
    lastFocus = null;
    if (back && typeof back.focus === "function" && document.contains(back)) back.focus();
  }

  function onKey(ev) {
    if (ev.key === "Escape" || ev.key === "Esc") {
      ev.preventDefault();
      ev.stopPropagation();
      close();
      return;
    }
    if (ev.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (!root.contains(a)) { ev.preventDefault(); first.focus(); return; }
    if (ev.shiftKey && a === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && a === last) { ev.preventDefault(); first.focus(); }
  }

  function setNote(msg) {
    var n = root.querySelector(".pc-note");
    n.textContent = msg || "";
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("copy failed"));
      } catch (e) { reject(e); }
    });
  }

  function build() {
    root = document.createElement("div");
    root.className = "pc-overlay";
    root.hidden = true;
    root.innerHTML =
      '<div class="pc-card" role="dialog" aria-modal="true" aria-labelledby="pc-title" aria-describedby="pc-line">' +
      '<p class="pc-orn" aria-hidden="true">&#9733; &#9733; &#9733;</p>' +
      '<h2 class="pc-title" id="pc-title">Well done, neighbor!</h2>' +
      '<p class="pc-line" id="pc-line"></p>' +
      '<div class="pc-actions">' +
      '<button type="button" class="btn btn-primary pc-share">Share my solve</button>' +
      '<button type="button" class="btn pc-again">Play again</button>' +
      '<button type="button" class="btn pc-close">Close</button>' +
      '</div>' +
      '<p class="pc-note" role="status" aria-live="polite"></p>' +
      '</div>';
    document.body.appendChild(root);

    root.addEventListener("click", function (ev) {
      if (ev.target === root) close();
    });
    root.querySelector(".pc-close").addEventListener("click", close);
    root.querySelector(".pc-again").addEventListener("click", function () {
      var fn = opts && opts.onAgain;
      close();
      if (typeof fn === "function") fn();
    });
    root.querySelector(".pc-share").addEventListener("click", function () {
      var text = currentLine + " I solved the " + NAMES[opts.type] + " on Kickapoo Kolache: " + pageUrl();
      copyText(text).then(
        function () { setNote("Copied. Paste it anywhere to share."); },
        function () { setNote("Could not copy. You can copy the page address instead."); }
      );
    });
  }

  function show(options) {
    if (shown) return false;
    shown = true;
    opts = options || { type: "crossword" };
    if (!root) build();
    currentLine = pick(opts.type);
    root.querySelector(".pc-line").textContent = currentLine;
    setNote("");
    lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add("pc-open");
    document.addEventListener("keydown", onKey, true);
    root.querySelector(".pc-share").focus();
    return true;
  }

  window.PuzzleCelebrate = { show: show, lines: LINES };
})();
