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

  // MaxPreps featuredGameData.date is local wall time WITHOUT offset
  // (e.g. 2026-09-04T19:30:00). Do not pass through Date() as UTC.
  function formatKickoffLocal(isoLocal) {
    if (!isoLocal) return "";
    var m = String(isoLocal).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m) return formatDate(isoLocal);
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var month = months[parseInt(m[2], 10) - 1] || m[2];
    var hour = parseInt(m[4], 10);
    var ampm = hour >= 12 ? "PM" : "AM";
    var h12 = hour % 12;
    if (h12 === 0) h12 = 12;
    var weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var wd = "";
    try {
      // Construct as local components for weekday only
      var tmp = new Date(parseInt(m[1],10), parseInt(m[2],10)-1, parseInt(m[3],10), hour, parseInt(m[5],10));
      wd = weekdays[tmp.getDay()] + ", ";
    } catch (_) {}
    return wd + month + " " + parseInt(m[3], 10) + ", " + m[1] + " · " + h12 + ":" + m[5] + " " + ampm + " local";
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
      var vs = mp.featured.vsLabel || (mp.featured.opponent ? "vs " + mp.featured.opponent : null);
      if (vs) parts.push(vs);
      if (mp.featured.date) {
        parts.push(
          mp.featured.dateIsLocalWall !== false
            ? formatKickoffLocal(mp.featured.date)
            : formatDate(mp.featured.date)
        );
      }
      if (mp.featured.location) parts.push(mp.featured.location);
      feat.textContent =
        (parts.length ? "Featured: " + parts.join(" · ") : "Featured game") +
        (mp.featured.note ? " — " + mp.featured.note : "");
      card.appendChild(feat);
      if (mp.featured.canonicalUrl) {
        var gp = el("p");
        var ga = el("a", null, "MaxPreps game page");
        ga.href = mp.featured.canonicalUrl;
        ga.target = "_blank";
        ga.rel = "noopener noreferrer";
        gp.appendChild(ga);
        card.appendChild(gp);
      }
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
      card.appendChild(el("span", "badge badge-fallback", "No headlines"));
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
    card.appendChild(el("span", "badge badge-fallback", label || "No RSS — link fallback"));
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
    var card = el("article", "feed-card story-empty");
    card.appendChild(el("span", "badge badge-waiting", "WAITING"));
    card.appendChild(el("h3", null, "Local civic roundup"));
    card.appendChild(
      el(
        "p",
        null,
        "No curated civic roundup this week. Editor notes appear here when filed — not an auto-RSS pull."
      )
    );
    root.appendChild(card);
  }

  function fillJobs(root, data) {
    clear(root);
    var jobs = (data && data.chandlerJobs) || {};
    var items = jobs.items || [];
    var card = el("article", "feed-card feed-live-card");
    if (items.length) {
      card.appendChild(el("span", "badge badge-live", "LIVE"));
      card.appendChild(el("h3", null, "City of Chandler — job openings"));
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
      if (jobs.pageUrl) {
        var more = el("p");
        var ma = el("a", null, "All Chandler city jobs");
        ma.href = jobs.pageUrl;
        ma.target = "_blank";
        ma.rel = "noopener noreferrer";
        more.appendChild(ma);
        card.appendChild(more);
      }
    } else {
      card.appendChild(el("span", "badge badge-fallback", "No RSS items"));
      card.appendChild(el("h3", null, "City of Chandler — job openings"));
      card.appendChild(
        el(
          "p",
          "jobs-empty",
          "No city RSS openings right now — see source links."
        )
      );
      if (jobs.pageUrl) {
        var p = el("p");
        var a = el("a", null, "Chandler jobs page");
        a.href = jobs.pageUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        p.appendChild(a);
        card.appendChild(p);
      }
    }
    root.appendChild(card);
  }

  /** Interviews & Stories — Local briefs (LIVE RSS). Never invent stories. */
  function fillLocalBriefs(root, data) {
    if (!root) return;
    clear(root);
    var lb = (data && data.localBriefs) || {};
    // Support { items, sources, errors } shape (preferred) or legacy array.
    var briefs = Array.isArray(lb) ? lb : lb.items || [];
    if (!briefs.length) {
      var empty = el("article", "feed-card story-card story-empty");
      empty.appendChild(el("p", "stories-empty-msg", "No local briefs right now."));
      empty.appendChild(
        el(
          "p",
          "note",
          "Live pulls: Henderson County News Flash + filtered Athens Review (rural towns only — not Tyler). Chandler News Flash stays under Official City & School Feeds. Soft-fail OK."
        )
      );
      root.appendChild(empty);
      return;
    }

    briefs.forEach(function (item) {
      var card = el("article", "feed-card story-card feed-live-card brief-card");
      card.appendChild(el("span", "badge badge-live", "LIVE"));
      var titleText = item.title || "Untitled brief";
      if (item.link) {
        var h = el("h3");
        var a = el("a", "brief-title-link", titleText);
        a.href = item.link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        h.appendChild(a);
        card.appendChild(h);
      } else {
        card.appendChild(el("h3", null, titleText));
      }
      var meta = el("p", "brief-meta");
      var bits = [];
      var src = item.source || item.sourceLabel;
      if (src) bits.push(src);
      if (item.pubDate) bits.push(formatDate(item.pubDate));
      meta.textContent = bits.join(" · ");
      card.appendChild(meta);
      root.appendChild(card);
    });
  }

  function fillGarageCraigslist(root, data) {
    if (!root) return;
    clear(root);
    var gs = (data && data.garageSales) || {};
    var items = gs.items || [];
    var errors = gs.errors || [];
    var pageUrl =
      gs.pageUrl ||
      "https://easttexas.craigslist.org/search/gms?query=Brownsboro%7CChandler%7CMurchison%7CEustace%7CBerryville%7CPoynor%7CLarue%7CNeches%7C75756%7C75758";

    if (items.length) {
      items.forEach(function (item) {
        var card = el("article", "feed-card feed-live-card");
        card.appendChild(el("span", "badge badge-live", "LIVE"));
        var titleText = item.title || "Untitled sale";
        if (item.link) {
          var h = el("h3");
          var a = el("a", null, titleText);
          a.href = item.link;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          h.appendChild(a);
          card.appendChild(h);
        } else {
          card.appendChild(el("h3", null, titleText));
        }
        var meta = el("p", "brief-meta");
        var bits = [];
        if (item.location) bits.push(item.location);
        if (item.pubDate) bits.push(formatDate(item.pubDate));
        bits.push("Craigslist East TX");
        meta.textContent = bits.join(" · ");
        card.appendChild(meta);
        root.appendChild(card);
      });
      var note = el("p", "note");
      note.appendChild(
        document.createTextNode(
          "Filtered local hits from Craigslist (third-party). "
        )
      );
      var more = el("a", null, "Browse full Craigslist search");
      more.href = pageUrl;
      more.target = "_blank";
      more.rel = "noopener noreferrer";
      note.appendChild(more);
      root.appendChild(note);
      return;
    }

    var empty = el("article", "feed-card story-empty");
    empty.appendChild(el("span", "badge badge-waiting", "WAITING"));
    empty.appendChild(el("h3", null, "No filtered Craigslist hits right now"));
    var why =
      "No Brownsboro / Chandler / rural Henderson matches in the latest pull";
    if (errors.length) {
      why +=
        " — or the Craigslist pull soft-failed (third-party block / empty feed).";
    } else {
      why += ".";
    }
    empty.appendChild(el("p", null, why));
    empty.appendChild(
      el(
        "p",
        "note",
        "Honest empty: we only show filtered hits when the build-time pull returns local matches. Soft-fail on 403/block is normal from this environment."
      )
    );
    var p = el("p");
    var a = el("a", null, "Browse filtered Craigslist East TX garage sales");
    a.href = pageUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    p.appendChild(a);
    p.appendChild(document.createTextNode(" "));
    var lbl = el("span", "third-party-label", "(third-party · browse link)");
    p.appendChild(lbl);
    empty.appendChild(p);
    root.appendChild(empty);
  }

  function apply(data) {

    var bears = document.getElementById("bears-live");
    var chandler = document.getElementById("feed-chandler");
    var brownsboro = document.getElementById("feed-brownsboro");
    var bisd = document.getElementById("feed-bisd");
    var civic = document.getElementById("feed-civic");
    var jobsLive = document.getElementById("jobs-live");
    var storiesBriefs = document.getElementById("stories-briefs");
    var localBriefsEl = document.getElementById("local-briefs");

    if (bears) fillBears(bears, data);
    if (chandler) fillChandler(chandler, data);
    if (jobsLive) fillJobs(jobsLive, data);
    if (storiesBriefs) fillLocalBriefs(storiesBriefs, data);
    if (localBriefsEl) fillLocalBriefs(localBriefsEl, data);

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
        { href: bi.calendarUrl, text: "District-wide calendar" },
        { href: bi.parentSquareUrl || "https://www.gobearsgo.net/families/parentsquare", text: "ParentSquare (primary for families)" }
      ]);
    }

    if (civic) fillCivic(civic);

    var garageCl = document.getElementById("garage-craigslist");
    if (garageCl) fillGarageCraigslist(garageCl, data);
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
          chandlerJobs: {
            hasRss: true,
            pageUrl: "https://www.chandlertx.com/jobs.aspx",
            items: []
          },
          henderson: { hasRss: true, items: [] },
          athensReview: { hasRss: true, items: [] },
          localBriefs: { items: [], sources: [], errors: [] },
          garageSales: {
            items: [],
            hasRss: true,
            feedUrl:
              "https://easttexas.craigslist.org/search/gms?format=rss&query=Brownsboro%7CChandler%7CMurchison%7CEustace%7CBerryville%7CPoynor%7CLarue%7CNeches%7C75756%7C75758",
            pageUrl:
              "https://easttexas.craigslist.org/search/gms?query=Brownsboro%7CChandler%7CMurchison%7CEustace%7CBerryville%7CPoynor%7CLarue%7CNeches%7C75756%7C75758",
            filterNote:
              "Brownsboro/Chandler/rural west Henderson towns + 75756/75758; Henderson County careful; drop Tyler/Longview-only",
            errors: ["feeds.json unavailable — soft empty"]
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
            calendarUrl: "https://www.gobearsgo.net/about-us/district-wide-calendar",
            parentSquareUrl: "https://www.gobearsgo.net/families/parentsquare",
            note: "ParentSquare is primary for families"
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
