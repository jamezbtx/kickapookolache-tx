(function () {
  "use strict";

  var FORECAST_DAYS = 7;
  var REFRESH_MS = 20 * 60 * 1000;
  var UA_HEADERS = {
    Accept: "application/geo+json"
  };

  function roundTempF(t) {
    if (t == null || Number.isNaN(Number(t))) return "—";
    return Math.round(Number(t)) + "°F";
  }

  function roundTemp(t) {
    if (t == null || Number.isNaN(Number(t))) return "—";
    return Math.round(Number(t)) + "°";
  }

  function shortForecast(text) {
    if (!text) return "—";
    var t = String(text).trim();
    if (t.length <= 18) return t;
    // Prefer the first clause before "then"
    var cut = t.split(/\s+then\s+/i)[0].trim();
    if (cut.length > 18) cut = cut.slice(0, 16) + "…";
    return cut;
  }

  function weekdayFromPeriodName(name, startTime) {
    if (name) {
      var n = String(name).replace(/\s+Night$/i, "").trim();
      if (/^Today$/i.test(n) || /^This Afternoon$/i.test(n)) return "Today";
      if (/^Tonight$/i.test(n)) return "Tonight";
      var map = {
        Sunday: "Sun",
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat"
      };
      if (map[n]) return map[n];
    }
    if (startTime) {
      var d = new Date(startTime);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { weekday: "short" });
      }
    }
    return "—";
  }

  function setCardError(card, message) {
    var temp = card.querySelector('[data-role="temp"]');
    var desc = card.querySelector('[data-role="desc"]');
    var extra = card.querySelector('[data-role="extra"]');
    var forecast = card.querySelector('[data-role="forecast"]');
    if (temp) temp.textContent = "—";
    if (desc) desc.textContent = message || "Unavailable";
    if (extra) extra.textContent = "High / low unavailable";
    if (forecast) {
      forecast.innerHTML = "";
      forecast.hidden = true;
    }
    card.classList.add("weather-error");
  }

  function fetchJson(url) {
    return fetch(url, { headers: UA_HEADERS, redirect: "follow" }).then(
      function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }
    );
  }

  function resolveForecastUrls(lat, lon) {
    var pointsUrl =
      "https://api.weather.gov/points/" +
      encodeURIComponent(lat) +
      "," +
      encodeURIComponent(lon);
    return fetchJson(pointsUrl).then(function (data) {
      var p = data && data.properties;
      if (!p || !p.forecast) throw new Error("No NWS forecast URL");
      return {
        forecast: p.forecast,
        hourly: p.forecastHourly || null
      };
    });
  }

  /** Pair daytime + night periods into calendar days for the strip. */
  function buildDailyStrip(periods) {
    var days = [];
    if (!periods || !periods.length) return days;

    var i = 0;
    while (i < periods.length && days.length < FORECAST_DAYS) {
      var p = periods[i];
      var dayHigh = null;
      var dayLow = null;
      var label = "";
      var short = "";
      var start = p.startTime;

      if (p.isDaytime) {
        dayHigh = p.temperature;
        short = p.shortForecast;
        label = weekdayFromPeriodName(p.name, p.startTime);
        if (i + 1 < periods.length && !periods[i + 1].isDaytime) {
          dayLow = periods[i + 1].temperature;
          i += 2;
        } else {
          i += 1;
        }
      } else {
        // Leading night-only period (e.g. Tonight when after sunset)
        dayLow = p.temperature;
        short = p.shortForecast;
        label = weekdayFromPeriodName(p.name, p.startTime);
        i += 1;
      }

      days.push({
        label: label,
        high: dayHigh,
        low: dayLow,
        short: short,
        start: start
      });
    }
    return days;
  }

  function renderForecast(container, days) {
    if (!container) return;
    container.innerHTML = "";
    if (!days || !days.length) {
      container.hidden = true;
      return;
    }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < days.length; i++) {
      var d = days[i];
      var day = document.createElement("div");
      day.className = "forecast-day";
      var name = document.createElement("span");
      name.className = "forecast-dow";
      name.textContent = d.label;
      var hiLo = document.createElement("span");
      hiLo.className = "forecast-temps";
      if (d.high != null && d.low != null) {
        hiLo.textContent = roundTemp(d.high) + " / " + roundTemp(d.low);
      } else if (d.high != null) {
        hiLo.textContent = "Hi " + roundTemp(d.high);
      } else if (d.low != null) {
        hiLo.textContent = "Lo " + roundTemp(d.low);
      } else {
        hiLo.textContent = "—";
      }
      var label = document.createElement("span");
      label.className = "forecast-label";
      label.textContent = shortForecast(d.short);
      label.title = d.short || "";
      day.appendChild(name);
      day.appendChild(hiLo);
      day.appendChild(label);
      frag.appendChild(day);
    }
    container.appendChild(frag);
    container.hidden = false;
  }

  function fillCard(card, forecastData, hourlyData) {
    var temp = card.querySelector('[data-role="temp"]');
    var desc = card.querySelector('[data-role="desc"]');
    var extra = card.querySelector('[data-role="extra"]');
    var forecastEl = card.querySelector('[data-role="forecast"]');

    var periods =
      (forecastData &&
        forecastData.properties &&
        forecastData.properties.periods) ||
      [];
    if (!periods.length) {
      setCardError(card, "Unavailable");
      return;
    }

    var days = buildDailyStrip(periods);
    var hourlyPeriods =
      (hourlyData &&
        hourlyData.properties &&
        hourlyData.properties.periods) ||
      [];

    var nowTemp = null;
    var nowDesc = null;
    if (hourlyPeriods.length) {
      nowTemp = hourlyPeriods[0].temperature;
      nowDesc = hourlyPeriods[0].shortForecast;
    } else {
      nowTemp = periods[0].temperature;
      nowDesc = periods[0].shortForecast;
    }

    if (temp) temp.textContent = roundTempF(nowTemp);
    if (desc) desc.textContent = nowDesc || "—";

    var todayHigh = days[0] && days[0].high;
    var todayLow = days[0] && days[0].low;
    // If first strip day is Tonight-only, look ahead for today's high from periods
    if (todayHigh == null) {
      for (var j = 0; j < periods.length; j++) {
        if (periods[j].isDaytime) {
          todayHigh = periods[j].temperature;
          break;
        }
      }
    }
    if (extra) {
      extra.textContent =
        "Today High " +
        roundTempF(todayHigh) +
        " · Low " +
        roundTempF(todayLow);
    }

    renderForecast(forecastEl, days);
    card.classList.remove("weather-error");
  }

  function loadCard(card) {
    var lat = card.getAttribute("data-lat");
    var lon = card.getAttribute("data-lon");
    if (!lat || !lon) {
      setCardError(card, "Missing coordinates");
      return Promise.resolve();
    }

    var cached = card._nwsUrls;
    var urlsPromise = cached
      ? Promise.resolve(cached)
      : resolveForecastUrls(lat, lon).then(function (urls) {
          card._nwsUrls = urls;
          return urls;
        });

    return urlsPromise
      .then(function (urls) {
        var jobs = [fetchJson(urls.forecast)];
        if (urls.hourly) jobs.push(fetchJson(urls.hourly));
        else jobs.push(Promise.resolve(null));
        return Promise.all(jobs);
      })
      .then(function (results) {
        fillCard(card, results[0], results[1]);
      })
      .catch(function () {
        setCardError(card, "Unavailable");
      });
  }

  function refreshAll() {
    var root = document.getElementById("weather-root");
    if (!root) return;
    var cards = root.querySelectorAll(".weather-card[data-lat][data-lon]");
    cards.forEach(function (card) {
      loadCard(card);
    });
  }

  function initWeather() {
    refreshAll();
    setInterval(refreshAll, REFRESH_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWeather);
  } else {
    initWeather();
  }
})();
