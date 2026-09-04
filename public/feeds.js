(function () {
  "use strict";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function formatDate(isoOrRss) {
    if (!isoOrRss) return "";
    var d = new Date(isoOrRss);
    if (Number.isNaN(d.getTime())) return String(isoOrRss);
    try {
      return d.toLocaleString("en-US", {
        timeZone: "America/Chicago",
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch (_) {
      return d.toLocaleString();
    }
  }

  function fillBears(root, data) {
    clear(root);
    var mp = (data && data.maxpreps) || {};
    var card = el("article", "feed-card story-card feed-live-card");
    card.appendChild(el("span", "badge badge-live", "LIVE"));
    card.appendChild(el("h3", null, "Brownsboro Bears · MaxPreps"));

    var links = el("ul", "feed-live-list");
    if (mp.footballUrl) {
      var liF = el("li");
      var aF = el("a", null, "Football scores & schedule");
      aF.href = mp.footballUrl;
      aF.target = "_blank";
      aF.rel = "noopener noreferrer";
      liF.appendChild(aF);
      links.appendChild(liF);
    }
    if (mp.schoolUrl) {
      var liS = el("li");
      var aS = el("a", null, "Bears school page");
      aS.href = mp.schoolUrl;
      aS.target = "_blank";
      aS.rel = "noopener noreferrer";
      liS.appendChild(aS);
      links.appendChild(liS);
    }
    card.appendChild(links);

    if (mp.featured) {
      var feat = el("p", "feed-featured");
      var parts = [];
      if (mp.featured.opponent) parts.push("vs " + mp.featured.opponent);
      if (mp.featured.date) parts.push(formatDate(mp.featured.date));
      feat.textContent =
        (parts.length ? "Featured: " + parts.join(" · ") : "Featured game") +
        (mp.featured.note ? " — " + mp.featured.note : "");
      card.appendChild(feat);
    } else {
      card.appendChild(
        el("p", null, "Featured game unavailable — open MaxPreps for the latest.")
      );
    }
    root.appendChild(card);
  }

  function fillChandler(root, data) {
    clear(root);
    var ch = (data && data.chandler) || {};
    var items = ch.items || [];
    var card = el("article", "feed-card feed-live-card");
    if (items.length) {
      card.appendChild(el("span", "badge badge-live", "LIVE"));
    } else {
      card.appendChild(el("span", "badge", "EXAMPLE"));
    }
    card.appendChild(el("h3", null, "City of Chandler — official announcements"));

    if (items.length) {
      var list = el("ul", "feed-live-list");
      items.forEach(function (item) {
        var li = el("li");
        if (item.link) {
          var a = el("a", null, item.title || "Untitled");
          a.href = item.link;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          li.appendChild(a);
        } else {
          li.appendChild(document.createTextNode(item.title || "Untitled"));
        }
        if (item.pubDate) {
          li.appendChild(document.createTextNode(" · " + formatDate(item.pubDate)));
        }
        list.appendChild(li);
      });
      card.appendChild(list);
      if (ch.pageUrl) {
        var more = el("p");
        var ma = el("a", null, "All Chandler news flash");
        ma.href = ch.pageUrl;
        ma.target = "_blank";
        ma.rel = "noopener noreferrer";
        more.appendChild(ma);
        card.appendChild(more);
      }
    } else {
      card.appendChild(
        el(
          "p",
          null,
          "Live headlines unavailable. " +
            (ch.pageUrl ? "See Chandler news flash page." : "RSS not connected.")
        )
      );
      if (ch.pageUrl) {
        var p = el("p");
        var a = el("a", null, ch.pageUrl);
        a.href = ch.pageUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        p.appendChild(a);
        card.appendChild(p);
      }
    }
    root.appendChild(card);
  }

  function fillFallback(root, title, label, links) {
    clear(root);
    var card = el("article", "feed-card feed-live-card");
    card.appendChild(el("span", "badge badge-live", "LINKS"));
    card.appendChild(el("h3", null, title));
    if (label) card.appendChild(el("p", null, label));
    var list = el("ul", "feed-live-list");
    (links || []).forEach(function (entry) {
      if (!entry || !entry.href) return;
      var li = el("li");
      var a = el("a", null, entry.text || entry.href);
      a.href = entry.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);
      list.appendChild(li);
    });
    card.appendChild(list);
    root.appendChild(card);
  }

  function fillCivic(root) {
    clear(root);
    var card = el("article", "feed-card feed-live-card");
    card.appendChild(el("span", "badge", "CURATED"));
    card.appendChild(el("h3", null, "Local civic roundup"));
    card.appendChild(
      el(
        "p",
        null,
        "Short note: this Brownsboro–Chandler civic roundup is curated later by the Editor — not an auto-RSS pull."
      )
    );
    root.appendChild(card);
  }

  function apply(data) {
    var bears = document.getElementById("bears-live");
    var chandler = document.getElementById("feed-chandler");
    var brownsboro = document.getElementById("feed-brownsboro");
    var bisd = document.getElementById("feed-bisd");
    var civic = document.getElementById("feed-civic");

    if (bears) fillBears(bears, data);
    if (chandler) fillChandler(chandler, data);

    if (brownsboro) {
      var bb = (data && data.brownsboro) || {};
      fillFallback(brownsboro, "City of Brownsboro — official announcements", bb.label || "No RSS — link fallback", [
        { href: bb.pageUrl, text: "City of Brownsboro website" },
        { href: bb.agendasUrl, text: "Meeting agendas & minutes" }
      ]);
    }

    if (bisd) {
      var bi = (data && data.bisd) || {};
      fillFallback(bisd, "BISD — school announcements / calendar / closings", bi.label || "No news RSS — link fallback", [
        { href: bi.newsUrl, text: "BISD headlines" },
        { href: bi.calendarUrl, text: "District-wide calendar" }
      ]);
    }

    if (civic) fillCivic(civic);
  }

  function load() {
    fetch("/data/feeds.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(apply)
      .catch(function () {
        apply({
          maxpreps: {
            schoolUrl: "https://www.maxpreps.com/tx/brownsboro/brownsboro-bears/",
            footballUrl:
              "https://www.maxpreps.com/tx/brownsboro/brownsboro-bears/football/",
            featured: null
          },
          chandler: {
            hasRss: true,
            pageUrl: "https://www.chandlertx.com/m/NewsFlash",
            items: []
          },
          brownsboro: {
            hasRss: false,
            label: "No RSS — link fallback",
            pageUrl: "https://brownsborotx.gov/",
            agendasUrl: "https://brownsborotx.gov/meeting-agendas-and-minutes"
          },
          bisd: {
            hasRss: false,
            label: "No news RSS — link fallback",
            newsUrl: "https://www.gobearsgo.net/about-us/new-headlines",
            calendarUrl: "https://www.gobearsgo.net/about-us/district-wide-calendar"
          }
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
