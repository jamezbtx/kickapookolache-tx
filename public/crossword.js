/**
 * Country Living Crossword — player logic.
 * Loads /api/crossword first, falls back to data/crossword.json.
 */
(function () {
  "use strict";

  var state = {
    puzzle: null,
    cells: [], // {el, r, c, solution, user, isBlock}
    focus: { r: 0, c: 0 },
    direction: "across", // across | down
    activeEntry: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function tryFetch(url) {
    return fetch(url, { cache: "no-store", credentials: "same-origin" }).then(
      function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }
    );
  }

  function isValidPuzzle(data) {
    return (
      data &&
      Array.isArray(data.grid) &&
      data.grid.length > 0 &&
      Array.isArray(data.across) &&
      Array.isArray(data.down)
    );
  }

  // Archive: crossword.html?week=YYYY-MM-DD loads data/archive/crossword-YYYY-MM-DD.json
  function archiveWeek() {
    var m = /[?&]week=(\d{4}-\d{2}-\d{2})(?:&|$)/.exec(window.location.search);
    return m ? m[1] : null;
  }

  function loadPuzzle() {
    var wk = archiveWeek();
    if (wk) {
      return tryFetch("data/archive/crossword-" + wk + ".json").then(function (data) {
        if (isValidPuzzle(data)) return data;
        throw new Error("invalid archive payload");
      });
    }
    return tryFetch("/api/crossword")
      .then(function (data) {
        if (isValidPuzzle(data)) return data;
        throw new Error("invalid api payload");
      })
      .catch(function () {
        return tryFetch("data/crossword.json").then(function (data) {
          if (isValidPuzzle(data)) return data;
          throw new Error("invalid static payload");
        });
      });
  }

  function showEmpty() {
    var empty = $("crossword-empty");
    var app = $("crossword-app");
    if (empty) empty.hidden = false;
    if (app) app.hidden = true;
  }

  function setStatus(msg) {
    var el = $("cw-status");
    if (el) el.textContent = msg || "";
  }

  function cellKey(r, c) {
    return r + "," + c;
  }

  function getCell(r, c) {
    return state.cells[cellKey(r, c)] || null;
  }

  function isLetterCell(r, c) {
    var cell = getCell(r, c);
    return cell && !cell.isBlock;
  }

  function findEntryAt(r, c, dir) {
    var list = dir === "across" ? state.puzzle.across : state.puzzle.down;
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      var len = e.answer.length;
      if (dir === "across") {
        if (e.row === r && c >= e.col && c < e.col + len) return e;
      } else {
        if (e.col === c && r >= e.row && r < e.row + len) return e;
      }
    }
    return null;
  }

  function highlightEntry(entry, dir) {
    Object.keys(state.cells).forEach(function (k) {
      var cell = state.cells[k];
      if (cell.isBlock || !cell.el) return;
      cell.el.classList.remove("is-active", "is-cursor");
    });
    if (!entry) return;
    for (var i = 0; i < entry.answer.length; i++) {
      var r = dir === "across" ? entry.row : entry.row + i;
      var c = dir === "across" ? entry.col + i : entry.col;
      var cell = getCell(r, c);
      if (cell && cell.el) cell.el.classList.add("is-active");
    }
    var cursor = getCell(state.focus.r, state.focus.c);
    if (cursor && cursor.el) cursor.el.classList.add("is-cursor");

    document.querySelectorAll(".crossword-clue-list li").forEach(function (li) {
      li.classList.toggle(
        "is-active",
        li.getAttribute("data-dir") === dir &&
          Number(li.getAttribute("data-num")) === entry.num
      );
    });
  }

  function setFocus(r, c, opts) {
    opts = opts || {};
    if (!isLetterCell(r, c)) return;
    state.focus = { r: r, c: c };
    if (opts.toggleDir) {
      var other = state.direction === "across" ? "down" : "across";
      if (findEntryAt(r, c, other)) state.direction = other;
    }
    var entry = findEntryAt(r, c, state.direction);
    if (!entry) {
      var alt = state.direction === "across" ? "down" : "across";
      entry = findEntryAt(r, c, alt);
      if (entry) state.direction = alt;
    }
    state.activeEntry = entry;
    highlightEntry(entry, state.direction);
    var cell = getCell(r, c);
    if (cell && cell.input) cell.input.focus();
  }

  function moveFocus(dr, dc) {
    var size = state.puzzle.size;
    var r = state.focus.r + dr;
    var c = state.focus.c + dc;
    while (r >= 0 && r < size && c >= 0 && c < size) {
      if (isLetterCell(r, c)) {
        setFocus(r, c);
        return;
      }
      r += dr;
      c += dc;
    }
  }

  function advanceAfterType() {
    // Defer so mobile keyboards finish committing the letter first
    var dir = state.direction;
    var r = state.focus.r;
    var c = state.focus.c;
    setTimeout(function () {
      if (dir === "across") moveFocusFrom(r, c, 0, 1);
      else moveFocusFrom(r, c, 1, 0);
    }, 0);
  }

  function moveFocusFrom(r, c, dr, dc) {
    var size = state.puzzle.size;
    r = r + dr;
    c = c + dc;
    while (r >= 0 && r < size && c >= 0 && c < size) {
      if (isLetterCell(r, c)) {
        setFocus(r, c);
        return;
      }
      r += dr;
      c += dc;
    }
  }

  function renderGrid() {
    var puzzle = state.puzzle;
    var size = puzzle.size;
    var wrap = $("cw-grid");
    wrap.innerHTML = "";
    wrap.style.setProperty("--cw-size", String(size));
    state.cells = {};

    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        var ch = puzzle.grid[r][c];
        var isBlock = ch === "." || ch === "#";
        var cellEl = document.createElement("div");
        cellEl.className = "cw-cell" + (isBlock ? " is-block" : "");
        cellEl.setAttribute("role", "gridcell");
        cellEl.dataset.row = String(r);
        cellEl.dataset.col = String(c);

        var num =
          (puzzle.numbers && puzzle.numbers[r] && puzzle.numbers[r][c]) || 0;
        if (!isBlock && num) {
          var numEl = document.createElement("span");
          numEl.className = "cw-num";
          numEl.textContent = String(num);
          cellEl.appendChild(numEl);
        }

        var input = null;
        if (!isBlock) {
          input = document.createElement("input");
          input.type = "text";
          input.maxLength = 1;
          input.autocomplete = "off";
          input.autocapitalize = "characters";
          input.spellcheck = false;
          input.setAttribute("aria-label", "Row " + (r + 1) + " column " + (c + 1));
          input.className = "cw-input";
          // Pass this square's input in so each handler talks to its own square
          (function (rr, cc, input) {
            // Only flip across/down when tapping the square that already has the cursor
            var wasCursor = false;
            input.addEventListener("mousedown", function () {
              wasCursor =
                state.focus.r === rr &&
                state.focus.c === cc &&
                document.activeElement === input;
            });
            input.addEventListener("focus", function () {
              setFocus(rr, cc);
            });
            input.addEventListener("click", function () {
              setFocus(rr, cc, { toggleDir: wasCursor });
              wasCursor = false;
            });
            input.addEventListener("input", function () {
              var v = (input.value || "").toUpperCase().replace(/[^A-Z]/g, "");
              input.value = v.slice(0, 1);
              var cell = getCell(rr, cc);
              if (cell) {
                cell.user = input.value;
                cell.el.classList.remove("is-wrong", "is-correct", "is-revealed");
              }
              if (input.value) advanceAfterType();
            });
            input.addEventListener("keydown", function (ev) {
              // Type letter → fill + jump (more reliable than input alone on phones)
              if (ev.key && ev.key.length === 1 && /[a-zA-Z]/.test(ev.key) && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
                ev.preventDefault();
                var v = ev.key.toUpperCase();
                input.value = v;
                var cell = getCell(rr, cc);
                if (cell) {
                  cell.user = v;
                  cell.el.classList.remove("is-wrong", "is-correct", "is-revealed");
                }
                advanceAfterType();
                return;
              }
              handleKey(ev, rr, cc);
            });
          })(r, c, input);
          cellEl.appendChild(input);
        }

        wrap.appendChild(cellEl);
        state.cells[cellKey(r, c)] = {
          el: cellEl,
          input: input,
          r: r,
          c: c,
          solution: isBlock ? "" : ch.toUpperCase(),
          user: "",
          isBlock: isBlock
        };
      }
    }

    // Focus first letter cell
    for (var r2 = 0; r2 < size; r2++) {
      for (var c2 = 0; c2 < size; c2++) {
        if (isLetterCell(r2, c2)) {
          setFocus(r2, c2);
          return;
        }
      }
    }
  }

  function handleKey(ev, r, c) {
    var key = ev.key;
    if (key === "ArrowRight") {
      ev.preventDefault();
      state.direction = "across";
      moveFocus(0, 1);
    } else if (key === "ArrowLeft") {
      ev.preventDefault();
      state.direction = "across";
      moveFocus(0, -1);
    } else if (key === "ArrowDown") {
      ev.preventDefault();
      state.direction = "down";
      moveFocus(1, 0);
    } else if (key === "ArrowUp") {
      ev.preventDefault();
      state.direction = "down";
      moveFocus(-1, 0);
    } else if (key === "Tab") {
      ev.preventDefault();
      jumpEntry(ev.shiftKey ? -1 : 1);
    } else if (key === "Backspace") {
      var cell = getCell(r, c);
      if (cell && cell.user) {
        cell.user = "";
        cell.input.value = "";
        cell.el.classList.remove("is-wrong", "is-correct", "is-revealed");
      } else {
        ev.preventDefault();
        if (state.direction === "across") moveFocus(0, -1);
        else moveFocus(-1, 0);
        var prev = getCell(state.focus.r, state.focus.c);
        if (prev && prev.input) {
          prev.user = "";
          prev.input.value = "";
          prev.el.classList.remove("is-wrong", "is-correct", "is-revealed");
        }
      }
    } else if (key === " " || key === "Enter") {
      ev.preventDefault();
      setFocus(r, c, { toggleDir: true });
    }
  }

  function allEntries() {
    var list = [];
    state.puzzle.across.forEach(function (e) {
      list.push({ entry: e, dir: "across" });
    });
    state.puzzle.down.forEach(function (e) {
      list.push({ entry: e, dir: "down" });
    });
    return list;
  }

  function jumpEntry(delta) {
    var list = allEntries();
    if (!list.length) return;
    var idx = 0;
    for (var i = 0; i < list.length; i++) {
      if (
        state.activeEntry &&
        list[i].entry.num === state.activeEntry.num &&
        list[i].dir === state.direction
      ) {
        idx = i;
        break;
      }
    }
    idx = (idx + delta + list.length) % list.length;
    state.direction = list[idx].dir;
    setFocus(list[idx].entry.row, list[idx].entry.col);
  }

  function renderClues() {
    function fill(listId, entries, dir) {
      var ol = $(listId);
      ol.innerHTML = "";
      entries
        .slice()
        .sort(function (a, b) {
          return a.num - b.num;
        })
        .forEach(function (e) {
          var li = document.createElement("li");
          li.setAttribute("data-num", String(e.num));
          li.setAttribute("data-dir", dir);
          li.value = e.num;
          li.innerHTML =
            "<button type=\"button\" class=\"cw-clue-btn\"><strong>" +
            e.num +
            "</strong> " +
            escapeHtml(e.clue) +
            "</button>";
          li.querySelector("button").addEventListener("click", function () {
            state.direction = dir;
            setFocus(e.row, e.col);
          });
          ol.appendChild(li);
        });
    }
    fill("cw-across", state.puzzle.across, "across");
    fill("cw-down", state.puzzle.down, "down");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Genuine solve = every square correct AND no letter/word/solution was revealed this attempt.
  function celebrateIfSolved() {
    if (state.usedReveal || !window.PuzzleCelebrate) return;
    window.PuzzleCelebrate.show({ type: "crossword", onAgain: clearPuzzle });
  }

  function checkPuzzle() {
    var filled = 0;
    var wrong = 0;
    var correct = 0;
    Object.keys(state.cells).forEach(function (k) {
      var cell = state.cells[k];
      if (cell.isBlock) return;
      cell.el.classList.remove("is-wrong", "is-correct");
      if (!cell.user) return;
      filled++;
      if (cell.user === cell.solution) {
        correct++;
        cell.el.classList.add("is-correct");
      } else {
        wrong++;
        cell.el.classList.add("is-wrong");
      }
    });
    if (!filled) {
      setStatus("Fill a few squares, then Check.");
      return;
    }
    if (wrong === 0) {
      var total = Object.keys(state.cells).filter(function (k) {
        return !state.cells[k].isBlock;
      }).length;
      if (correct === total) {
        setStatus("All correct — nice work.");
        celebrateIfSolved();
      }
      else setStatus("Looks good so far (" + correct + " checked).");
    } else {
      setStatus(wrong + " need another look.");
    }
  }

  function revealLetter() {
    var cell = getCell(state.focus.r, state.focus.c);
    if (!cell || cell.isBlock) return;
    cell.user = cell.solution;
    cell.input.value = cell.solution;
    cell.el.classList.remove("is-wrong");
    cell.el.classList.add("is-revealed", "is-correct");
    state.usedReveal = true;
    setStatus("Letter revealed.");
    advanceAfterType();
  }

  function revealWord() {
    var entry = state.activeEntry || findEntryAt(state.focus.r, state.focus.c, state.direction);
    if (!entry) {
      setStatus("Select a clue first.");
      return;
    }
    var dir = state.direction;
    for (var i = 0; i < entry.answer.length; i++) {
      var r = dir === "across" ? entry.row : entry.row + i;
      var c = dir === "across" ? entry.col + i : entry.col;
      var cell = getCell(r, c);
      if (!cell || cell.isBlock) continue;
      cell.user = cell.solution;
      cell.input.value = cell.solution;
      cell.el.classList.remove("is-wrong");
      cell.el.classList.add("is-revealed", "is-correct");
    }
    state.usedReveal = true;
    setStatus("Word revealed.");
  }

  function clearPuzzle() {
    Object.keys(state.cells).forEach(function (k) {
      var cell = state.cells[k];
      if (cell.isBlock) return;
      cell.user = "";
      if (cell.input) cell.input.value = "";
      cell.el.classList.remove("is-wrong", "is-correct", "is-revealed");
    });
    state.usedReveal = false;
    setStatus("Cleared.");
  }

  function showSolution() {
    if (
      !window.confirm(
        "Show the full solution? This fills every square."
      )
    ) {
      return;
    }
    Object.keys(state.cells).forEach(function (k) {
      var cell = state.cells[k];
      if (cell.isBlock) return;
      cell.user = cell.solution;
      cell.input.value = cell.solution;
      cell.el.classList.remove("is-wrong");
      cell.el.classList.add("is-revealed", "is-correct");
    });
    state.usedReveal = true;
    setStatus("Solution shown.");
  }

  function bindToolbar() {
    $("cw-check").addEventListener("click", checkPuzzle);
    $("cw-reveal-letter").addEventListener("click", revealLetter);
    $("cw-reveal-word").addEventListener("click", revealWord);
    $("cw-clear").addEventListener("click", clearPuzzle);
    $("cw-solution").addEventListener("click", showSolution);
  }

  function mount(puzzle) {
    state.puzzle = puzzle;
    var week = $("crossword-week");
    if (week) {
      week.hidden = false;
      week.textContent =
        (puzzle.weekLabel || "") +
        (puzzle.title && puzzle.title !== "Country Living Crossword"
          ? " · " + puzzle.title
          : "");
      if (!puzzle.weekLabel) week.textContent = puzzle.title || "";
    }
    $("crossword-empty").hidden = true;
    $("crossword-app").hidden = false;
    renderGrid();
    renderClues();
    bindToolbar();
  }

  function init() {
    loadPuzzle()
      .then(mount)
      .catch(function () {
        showEmpty();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
