(function () {
  "use strict";

  var FORECAST_DAYS = 7;

  var WMO_LABELS = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    56: "Freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Light showers",
    81: "Showers",
    82: "Heavy showers",
    85: "Light snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm + hail",
    99: "Thunderstorm + heavy hail"
  };

  function wmoLabel(code) {
    if (code == null || Number.isNaN(Number(code))) return "Weather unavailable";
    var n = Number(code);
    return WMO_LABELS[n] || "Weather code " + n;
  }

  function shortWmo(code) {
    var full = wmoLabel(code);
    if (full.indexOf("Thunderstorm") === 0) return "T-storm";
    if (full.indexOf("Partly cloudy") === 0) return "Partly cloudy";
    if (full.indexOf("Mainly clear") === 0) return "Mostly clear";
    if (full.indexOf("Depositing") === 0) return "Fog";
    if (full.length > 16) {
      var cut = full.split(/[+·]/)[0].trim();
      return cut.length > 16 ? cut.slice(0, 14) + "…" : cut;
    }
    return full;
  }

  function roundTemp(t) {
    if (t == null || Number.isNaN(Number(t))) return "—";
    return Math.round(Number(t)) + "°";
  }

  function roundTempF(t) {
    if (t == null || Number.isNaN(Number(t))) return "—";
    return Math.round(Number(t)) + "°F";
  }

  function weekdayLabel(isoDate) {
    if (!isoDate) return "—";
    var parts = String(isoDate).split("-");
    if (parts.length < 3) return "—";
    var d = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }

  function buildUrl(lat, lon) {
    var params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "temperature_2m,weather_code",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      timezone: "America/Chicago",
      forecast_days: String(FORECAST_DAYS)
    });
    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
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

  function renderForecast(container, daily) {
    if (!container) return;
    container.innerHTML = "";
    if (
      !daily ||
      !daily.time ||
      !daily.temperature_2m_max ||
      !daily.temperature_2m_min
    ) {
      container.hidden = true;
      return;
    }
    var frag = document.createDocumentFragment();
    var count = Math.min(FORECAST_DAYS, daily.time.length);
    for (var i = 0; i < count; i++) {
      var day = document.createElement("div");
      day.className = "forecast-day";
      var name = document.createElement("span");
      name.className = "forecast-dow";
      name.textContent = weekdayLabel(daily.time[i]);
      var hiLo = document.createElement("span");
      hiLo.className = "forecast-temps";
      hiLo.textContent =
        roundTemp(daily.temperature_2m_max[i]) +
        " / " +
        roundTemp(daily.temperature_2m_min[i]);
      var label = document.createElement("span");
      label.className = "forecast-label";
      label.textContent = shortWmo(
        daily.weather_code && daily.weather_code[i]
      );
      day.appendChild(name);
      day.appendChild(hiLo);
      day.appendChild(label);
      frag.appendChild(day);
    }
    container.appendChild(frag);
    container.hidden = false;
  }

  function fillCard(card, data) {
    var temp = card.querySelector('[data-role="temp"]');
    var desc = card.querySelector('[data-role="desc"]');
    var extra = card.querySelector('[data-role="extra"]');
    var forecast = card.querySelector('[data-role="forecast"]');
    var current = data && data.current;
    var daily = data && data.daily;
    if (!current) {
      setCardError(card, "Unavailable");
      return;
    }
    if (temp) temp.textContent = roundTempF(current.temperature_2m);
    if (desc) desc.textContent = wmoLabel(current.weather_code);
    var hi = daily && daily.temperature_2m_max && daily.temperature_2m_max[0];
    var lo = daily && daily.temperature_2m_min && daily.temperature_2m_min[0];
    if (extra) {
      extra.textContent =
        "Today High " + roundTempF(hi) + " · Low " + roundTempF(lo);
    }
    renderForecast(forecast, daily);
    card.classList.remove("weather-error");
  }

  function loadCard(card) {
    var lat = card.getAttribute("data-lat");
    var lon = card.getAttribute("data-lon");
    if (!lat || !lon) {
      setCardError(card, "Missing coordinates");
      return Promise.resolve();
    }
    return fetch(buildUrl(lat, lon))
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        fillCard(card, data);
      })
      .catch(function () {
        setCardError(card, "Unavailable");
      });
  }

  function initWeather() {
    var root = document.getElementById("weather-root");
    if (!root) return;
    var cards = root.querySelectorAll(".weather-card[data-lat][data-lon]");
    cards.forEach(function (card) {
      loadCard(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWeather);
  } else {
    initWeather();
  }
})();
