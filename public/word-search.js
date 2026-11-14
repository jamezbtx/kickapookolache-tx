/**
 * Country Living Word Search — player.
 * Loads data/wordsearch.json (made by scripts/gen-wordsearch.js).
 * Pointer events (mouse + touch + pen); the grid uses touch-action:none so dragging never scrolls the page.
 */
(function () {
  "use strict";

  var COLORS = 6; // CSS classes .ws-found-0 … .ws-found-5
  var state = {
    puzzle: null,
    cells: [], // flat array, index = r * size + c
    found: {}, // word -> true
    revealed: {},
    dragging: false,
    start: null,
    sel: [] // [{r,c}]
  };

  function $(id) { return document.getElementById(id); }

  // Archive: word-search.html?week=YYYY-MM-DD loads data/archive/wordsearch-YYYY-MM-DD.json
  function archiveUrl() {
    var m = /[?&]week=(\d{4}-\d{2}-\d{2})(?:&|$)/.exec(window.location.search);
    return m ? "data/archive/wordsearch-" + m[1] + ".json" : "data/wordsearch.json";
  }

  function fetchPuzzle(url) {
    return fetch(url, { cache: "no-store", credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.grid) || !data.grid.length || !Array.isArray(data.words)) throw new Error("invalid puzzle");
        return data;
      });
  }

  // Challenge links carry ?pz=<puzzle id>. If that is not the current puzzle, try the archive copy;
  // if that is gone too, fall back to the current puzzle and show a gentle note.
  function loadPuzzle() {
    var url = archiveUrl();
    return fetchPuzzle(url).then(function (data) {
      var want = challenge && challenge.pz;
      if (!want || String(data.id) === want || url !== "data/wordsearch.json") return data;
      return fetchPuzzle("data/archive/wordsearch-" + want + ".json").catch(function () {
        challenge.stale = true;
        return data;
      });
    });
  }

  // ---- timer, best times, challenges --------------------------------------
  var MILESTONES = [60, 120, 180, 300, 600, 900, 1200, 1800];
  var timer = { start: 0, elapsed: 0, id: null, running: false, done: false };
  var challenge = readChallenge();

  function qp(name) {
    var m = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.search);
    if (!m) return null;
    try { return decodeURIComponent(m[1].replace(/\+/g, " ")); } catch (e) { return null; }
  }

  // Letters (any language), spaces, apostrophes, periods and hyphens only; max 20 chars.
  function cleanName(s) {
    s = String(s || "").replace(/[^\p{L}\p{M} .'\-]/gu, "").replace(/\s+/g, " ").trim();
    return s.slice(0, 20).trim();
  }

  function readChallenge() {
    var raw = qp("challenge");
    if (raw === null || !/^\d{1,5}$/.test(raw)) return null;
    var secs = parseInt(raw, 10);
    if (!(secs > 0 && secs < 86400)) return null;
    var pz = qp("pz");
    return { secs: secs, from: cleanName(qp("from")), pz: pz && /^[\w-]{1,32}$/.test(pz) ? pz : null, stale: false };
  }

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function spoken(sec) {
    var m = Math.floor(sec / 60), s = sec % 60, out = [];
    if (m) out.push(m + (m === 1 ? " minute" : " minutes"));
    if (s || !m) out.push(s + (s === 1 ? " second" : " seconds"));
    return out.join(" ");
  }

  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      if (val === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, val);
    } catch (e) { return null; }
  }
  function bestKey() { return "kk-ws-best-" + (state.puzzle.id || state.puzzle.seed || "current"); }
  function getBest() { var v = parseInt(store(bestKey()) || "", 10); return v > 0 ? v : 0; }

  function elapsedSecs() {
    return Math.floor((timer.running ? timer.elapsed + (Date.now() - timer.start) : timer.elapsed) / 1000);
  }
  function tick() {
    var sec = elapsedSecs();
    $("ws-time").textContent = fmt(sec);
    if (MILESTONES.indexOf(sec) !== -1 && timer.lastMilestone !== sec) {
      timer.lastMilestone = sec;
      $("ws-timer-live").textContent = spoken(sec) + " elapsed.";
    }
  }
  function startTimer() {
    if (timer.running || timer.done) return;
    timer.running = true;
    timer.start = Date.now();
    timer.id = window.setInterval(tick, 250);
    tick();
  }
  function stopTimer() {
    if (!timer.running) return;
    timer.elapsed += Date.now() - timer.start;
    timer.running = false;
    window.clearInterval(timer.id);
    tick();
  }
  function resetTimer() {
    stopTimer();
    timer.elapsed = 0; timer.done = false; timer.lastMilestone = null;
    $("ws-timer").classList.remove("is-done");
    $("ws-time").textContent = "0:00";
  }
  // Pause while the tab is hidden so a phone in a pocket doesn't count.
  document.addEventListener("visibilitychange", function () {
    if (!state.puzzle || timer.done) return;
    if (document.hidden && timer.running) { stopTimer(); timer.paused = true; }
    else if (!document.hidden && timer.paused) { timer.paused = false; startTimer(); }
  });

  function showBest() {
    var b = getBest(), el = $("ws-best");
    el.hidden = !b;
    el.textContent = b ? "Your best: " + fmt(b) : "";
  }

  function showChallengeBanner() {
    var el = $("ws-challenge-banner");
    if (!challenge) { el.hidden = true; return; }
    var who = challenge.from || "A friend";
    el.textContent = "";
    var strong = document.createElement("span");
    strong.textContent = who + " finished in " + fmt(challenge.secs) + ". Can you beat it?";
    el.appendChild(strong);
    var sub = document.createElement("span");
    sub.className = "ws-small";
    sub.textContent = challenge.stale
      ? "Heads up: that challenge was for an older puzzle that is no longer posted, so here is this week's. Times may not compare exactly."
      : "The clock starts when you touch the grid.";
    el.appendChild(sub);
    el.hidden = false;
  }

  function toast(msg) {
    var t = $("ws-toast");
    t.textContent = msg; t.hidden = false;
    window.clearTimeout(toast.id);
    toast.id = window.setTimeout(function () { t.hidden = true; }, 3500);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", "");
        ta.style.position = "absolute"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("copy failed"));
      } catch (e) { reject(e); }
    });
  }

  function challengeUrl(secs) {
    var u = window.location.origin + window.location.pathname + "?";
    var parts = [];
    if (state.puzzle.id) parts.push("pz=" + encodeURIComponent(state.puzzle.id));
    var wk = /[?&]week=(\d{4}-\d{2}-\d{2})/.exec(window.location.search);
    if (wk) parts.push("week=" + wk[1]);
    parts.push("challenge=" + secs);
    var name = cleanName($("ws-name").value);
    if (name) parts.push("from=" + encodeURIComponent(name));
    return u + parts.join("&");
  }

  function sendChallenge() {
    var secs = timer.finalSecs;
    if (!secs) return;
    var name = cleanName($("ws-name").value);
    store("kk-ws-name", name || null);
    var url = challengeUrl(secs);
    var text = "I found every word in " + fmt(secs) + " on the Kickapoo Kolache word search. Can you beat me?";
    if (navigator.share) {
      navigator.share({ title: "Kickapoo Kolache Word Search", text: text, url: url }).catch(function (err) {
        if (err && err.name === "AbortError") return;
        copyText(text + " " + url).then(function () { toast("Challenge link copied. Paste it to a friend!"); },
          function () { toast("Could not copy. Here is the link: " + url); });
      });
      return;
    }
    copyText(text + " " + url).then(function () { toast("Challenge link copied. Paste it to a friend!"); },
      function () { toast("Could not copy. Here is the link: " + url); });
  }

  function finish() {
    stopTimer();
    timer.done = true;
    $("ws-timer").classList.add("is-done");
    var secs = Math.max(1, elapsedSecs());
    timer.finalSecs = secs;
    var n = state.puzzle.words.length;
    var prev = getBest();
    var newBest = !prev || secs < prev;
    if (newBest) store(bestKey(), String(secs));
    $("ws-done-time").textContent = "Your time: " + fmt(secs) + " · " + n + " of " + n + " words found";
    var bestEl = $("ws-done-best");
    bestEl.textContent = "Your best: " + fmt(newBest ? secs : prev);
    if (newBest && prev) {
      var b = document.createElement("span"); b.className = "ws-new-best"; b.textContent = "New best!";
      bestEl.appendChild(b);
    }
    var vs = $("ws-done-vs"), btn = $("ws-challenge-btn");
    if (challenge && !challenge.stale) {
      var who = challenge.from || "your friend";
      if (secs < challenge.secs) vs.textContent = "You beat " + who + " by " + fmt(challenge.secs - secs) + "! Bragging rights are yours.";
      else if (secs === challenge.secs) vs.textContent = "A dead heat with " + who + "! Same time to the second.";
      else vs.textContent = who.charAt(0).toUpperCase() + who.slice(1) + " was " + fmt(secs - challenge.secs) + " faster this time. Good game! Play again or send one back.";
      vs.hidden = false;
      btn.textContent = "Challenge them back";
    } else { vs.hidden = true; btn.textContent = "Challenge a friend"; }
    $("ws-name").value = cleanName(store("kk-ws-name") || "");
    $("ws-done").hidden = false;
    showBest();
    $("ws-timer-live").textContent = "Finished in " + spoken(secs) + "." + (newBest && prev ? " New best!" : "");
  }

  function setStatus(msg) { var el = $("ws-status"); if (el) el.textContent = msg || ""; }

  function cellAt(r, c) { return state.cells[r * state.puzzle.size + c]; }

  function updateProgress() {
    var n = state.puzzle.words.length;
    var f = Object.keys(state.found).length;
    $("ws-progress").textContent = f + " of " + n + " found";
    if (f === n) {
      setStatus("You found them all! Nice work, neighbor.");
      // Genuine solve only: nothing was revealed by the Reveal button.
      if (Object.keys(state.revealed).length === 0 && !timer.done) {
        finish();
        if (window.PuzzleCelebrate) window.PuzzleCelebrate.show({ type: "wordsearch", onAgain: reset });
      }
    }
  }

  function renderGrid() {
    var p = state.puzzle, N = p.size, wrap = $("ws-grid");
    wrap.innerHTML = "";
    wrap.style.setProperty("--ws-size", String(N));
    state.cells = [];
    for (var r = 0; r < N; r++) {
      var row = document.createElement("div");
      row.className = "ws-row";
      row.setAttribute("role", "row");
      for (var c = 0; c < N; c++) {
        var el = document.createElement("div");
        el.className = "ws-cell";
        el.setAttribute("role", "gridcell");
        el.setAttribute("aria-label", "Row " + (r + 1) + ", column " + (c + 1) + ", letter " + p.grid[r][c]);
        el.textContent = p.grid[r][c];
        row.appendChild(el);
        state.cells.push(el);
      }
      wrap.appendChild(row);
    }
  }

  function renderWords() {
    var ul = $("ws-words");
    ul.innerHTML = "";
    state.puzzle.words
      .map(function (w, i) { return { w: w.word, i: i }; })
      .sort(function (a, b) { return a.w < b.w ? -1 : 1; })
      .forEach(function (x) {
        var li = document.createElement("li");
        li.className = "ws-word";
        li.setAttribute("data-word", x.w);
        li.innerHTML = '<span class="ws-check" aria-hidden="true"></span><span class="ws-word-text">' + escapeHtml(x.w) + '</span><span class="ws-sr"></span>';
        ul.appendChild(li);
      });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function wordItem(word) { return document.querySelector('#ws-words li[data-word="' + word + '"]'); }

  function wordLine(w) {
    var out = [];
    for (var i = 0; i < w.word.length; i++) out.push({ r: w.row + w.dir[0] * i, c: w.col + w.dir[1] * i });
    return out;
  }

  function wordIndex(word) {
    for (var i = 0; i < state.puzzle.words.length; i++) if (state.puzzle.words[i].word === word) return i;
    return -1;
  }

  function markFound(w, revealed) {
    var idx = wordIndex(w.word);
    wordLine(w).forEach(function (pt) {
      var el = cellAt(pt.r, pt.c);
      if (revealed) el.classList.add("ws-revealed");
      else {
        for (var k = 0; k < COLORS; k++) el.classList.remove("ws-found-" + k);
        el.classList.add("ws-found", "ws-found-" + (idx % COLORS));
      }
    });
    var li = wordItem(w.word);
    if (li) {
      li.classList.add(revealed ? "is-revealed" : "is-found");
      li.querySelector(".ws-sr").textContent = revealed ? " (revealed)" : " (found)";
    }
  }

  // ---- selection geometry -------------------------------------------------
  function pointToCell(ev) {
    var rect = $("ws-grid").getBoundingClientRect();
    var N = state.puzzle.size;
    var c = Math.floor(((ev.clientX - rect.left) / rect.width) * N);
    var r = Math.floor(((ev.clientY - rect.top) / rect.height) * N);
    return { r: Math.max(0, Math.min(N - 1, r)), c: Math.max(0, Math.min(N - 1, c)) };
  }

  // Snap a drag from `a` to `b` onto the nearest horizontal / vertical / diagonal line.
  function snapLine(a, b) {
    var N = state.puzzle.size;
    var dr = b.r - a.r, dc = b.c - a.c;
    if (dr === 0 && dc === 0) return [a];
    var k = Math.round(Math.atan2(dr, dc) / (Math.PI / 4));
    var ur = Math.round(Math.sin(k * Math.PI / 4));
    var uc = Math.round(Math.cos(k * Math.PI / 4));
    var len = Math.round((dc * uc + dr * ur) / (uc * uc + ur * ur));
    var out = [];
    for (var i = 0; i <= Math.max(0, len); i++) {
      var r = a.r + ur * i, c = a.c + uc * i;
      if (r < 0 || c < 0 || r >= N || c >= N) break;
      out.push({ r: r, c: c });
    }
    return out;
  }

  function showSelection(line) {
    state.cells.forEach(function (el) { el.classList.remove("ws-selecting"); });
    line.forEach(function (pt) { cellAt(pt.r, pt.c).classList.add("ws-selecting"); });
    state.sel = line;
  }

  function selectedText(line) {
    return line.map(function (pt) { return state.puzzle.grid[pt.r][pt.c]; }).join("");
  }

  function cheb(a, b) { return Math.max(Math.abs(a.r - b.r), Math.abs(a.c - b.c)); }

  // Unfound word whose one end is exactly the start cell and whose other end is within one
  // cell of where the drag ended. Returns null if none or if two words tie.
  function nearMiss(a, b) {
    var best = null, bestD = 99, tie = false;
    state.puzzle.words.forEach(function (w) {
      if (state.found[w.word]) return;
      var L = w.word.length, s = { r: w.row, c: w.col };
      var e = { r: w.row + w.dir[0] * (L - 1), c: w.col + w.dir[1] * (L - 1) };
      var d = 99;
      if (cheb(a, s) === 0 && cheb(b, e) <= 1) d = cheb(b, e);
      if (cheb(a, e) === 0 && cheb(b, s) <= 1) d = Math.min(d, cheb(b, s));
      if (d > 1 || cheb(a, b) < L - 2) return;
      if (d < bestD) { best = w; bestD = d; tie = false; }
      else if (d === bestD) tie = true;
    });
    return tie ? null : best;
  }

  function finishSelection() {
    var line = state.sel;
    showSelection([]);
    state.sel = [];
    if (line.length < 2) return;
    var text = selectedText(line);
    var rev = text.split("").reverse().join("");
    var hit = null;
    state.puzzle.words.forEach(function (w) {
      if (!hit && (w.word === text || w.word === rev)) hit = w;
    });
    // Forgiving match (Nov. 14, 2026): a finger or mouse that lets go one cell off the last
    // letter (common on long diagonals like CRANBERRY on a phone) still counts when the drag
    // began on a word's first or last letter and ended next to its other end.
    if (!hit) hit = nearMiss(line[0], state.end || line[line.length - 1]);
    if (!hit) { setStatus("Not one of the words. Try again."); return; }
    if (state.found[hit.word]) { setStatus("You already found " + hit.word + "."); return; }
    state.found[hit.word] = true;
    delete state.revealed[hit.word];
    markFound(hit, false);
    setStatus("Found " + hit.word + "!");
    updateProgress();
  }

  function bindGrid() {
    var grid = $("ws-grid");
    grid.addEventListener("pointerdown", function (ev) {
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      ev.preventDefault();
      startTimer();
      state.dragging = true;
      state.start = pointToCell(ev);
      state.end = state.start;
      try { grid.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
      showSelection([state.start]);
    });
    grid.addEventListener("pointermove", function (ev) {
      if (!state.dragging) return;
      ev.preventDefault();
      state.end = pointToCell(ev);
      showSelection(snapLine(state.start, state.end));
    });
    function end(ev) {
      if (!state.dragging) return;
      state.dragging = false;
      try { grid.releasePointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
      if (ev.type === "pointercancel") { showSelection([]); state.sel = []; return; }
      finishSelection();
    }
    grid.addEventListener("pointerup", end);
    grid.addEventListener("pointercancel", end);
    grid.addEventListener("contextmenu", function (ev) { ev.preventDefault(); });
    // iOS Safari: stop the page from scrolling/selecting while a finger is on the grid
    grid.addEventListener("touchmove", function (ev) { ev.preventDefault(); }, { passive: false });
  }

  function reset() {
    resetTimer();
    $("ws-done").hidden = true;
    state.found = {};
    state.revealed = {};
    state.cells.forEach(function (el) {
      el.className = "ws-cell";
    });
    document.querySelectorAll("#ws-words li").forEach(function (li) {
      li.classList.remove("is-found", "is-revealed");
      li.querySelector(".ws-sr").textContent = "";
    });
    setStatus("Puzzle reset.");
    updateProgress();
    // updateProgress may not set a message; keep "reset" visible
    setStatus("Puzzle reset.");
  }

  function reveal() {
    stopTimer();
    timer.done = true; // a revealed puzzle doesn't count toward a best time
    state.puzzle.words.forEach(function (w) {
      if (!state.found[w.word]) { state.revealed[w.word] = true; markFound(w, true); }
    });
    setStatus("Answers shown. Press Reset to try again.");
  }

  function mount(puzzle) {
    state.puzzle = puzzle;
    var week = $("ws-week");
    if (week) {
      week.hidden = false;
      week.textContent = puzzle.weekLabel || puzzle.title || "";
    }
    $("ws-empty").hidden = true;
    $("ws-app").hidden = false;
    renderGrid();
    renderWords();
    bindGrid();
    $("ws-reset").addEventListener("click", reset);
    $("ws-reveal").addEventListener("click", reveal);
    $("ws-print").addEventListener("click", function () { window.print(); });
    $("ws-challenge-btn").addEventListener("click", sendChallenge);
    $("ws-again-btn").addEventListener("click", reset);
    $("ws-name").addEventListener("change", function () {
      var v = cleanName(this.value); this.value = v; store("kk-ws-name", v || null);
    });
    showBest();
    showChallengeBanner();
    updateProgress();
  }

  function init() {
    loadPuzzle().then(mount).catch(function () {
      $("ws-empty").hidden = false;
      $("ws-app").hidden = true;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
