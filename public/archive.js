(function () {
  var grid = document.getElementById("archive-grid");
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll("article"));
  var q = document.getElementById("archive-q"), town = document.getElementById("archive-town"),
      month = document.getElementById("archive-month"), count = document.getElementById("archive-count"),
      empty = document.getElementById("archive-empty"), reset = document.getElementById("archive-reset");
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, ""); }
  cards.sort(function (a, b) { return (b.dataset.date || "").localeCompare(a.dataset.date || ""); });
  cards.forEach(function (c) {
    grid.appendChild(c);
    var h = c.querySelector("h3"), p = c.querySelector("h3 ~ p:not(.spotlight-teaser-link)"), m = c.querySelector(".spotlight-teaser-meta");
    c._text = norm([h && h.textContent, p && p.textContent, m && m.textContent, c.dataset.names, c.dataset.town].join(" "));
  });
  var seen = {};
  cards.forEach(function (c) { var k = (c.dataset.date || "").slice(0, 7); if (k && !seen[k]) { seen[k] = 1;
    var o = document.createElement("option"); o.value = k; o.textContent = MONTHS[+k.slice(5) - 1] + " " + k.slice(0, 4); month.appendChild(o); } });
  function apply() {
    var terms = norm(q.value).split(/\s+/).filter(Boolean), t = town.value, mo = month.value, n = 0;
    cards.forEach(function (c) {
      var ok = (!t || c.dataset.town === t) && (!mo || (c.dataset.date || "").indexOf(mo) === 0) &&
        terms.every(function (w) { return c._text.indexOf(w) !== -1; });
      c.hidden = !ok; if (ok) n++;
    });
    var filtered = terms.length || t || mo;
    count.textContent = filtered ? "Showing " + n + " of " + cards.length + " stories" : cards.length + " stories";
    empty.hidden = n !== 0;
  }
  [q, town, month].forEach(function (el) { el.addEventListener("input", apply); el.addEventListener("change", apply); });
  reset.addEventListener("click", function () { q.value = ""; town.value = ""; month.value = ""; apply(); q.focus(); });
  apply();
})();
