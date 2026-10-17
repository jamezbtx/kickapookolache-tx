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

  function loadPuzzle() {
    return fetch(archiveUrl(), { cache: "no-store", credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.grid) || !data.grid.length || !Array.isArray(data.words)) throw new Error("invalid puzzle");
        return data;
      });
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
      if (Object.keys(state.revealed).length === 0 && window.PuzzleCelebrate) {
        window.PuzzleCelebrate.show({ type: "wordsearch", onAgain: reset });
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
      state.dragging = true;
      state.start = pointToCell(ev);
      try { grid.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
      showSelection([state.start]);
    });
    grid.addEventListener("pointermove", function (ev) {
      if (!state.dragging) return;
      ev.preventDefault();
      showSelection(snapLine(state.start, pointToCell(ev)));
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
