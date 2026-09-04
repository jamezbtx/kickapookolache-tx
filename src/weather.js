(function () {
  "use strict";

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

  function roundTemp(t) {
    if (t == null || Number.isNaN(Number(t))) return "—";
    return Math.round(Number(t)) + "°F";
  }

  function buildUrl(lat, lon) {
    var params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "temperature_2m,weather_code",
      daily: "temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      timezone: "America/Chicago",
      forecast_days: "1"
    });
    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function setCardError(card, message) {
    var temp = card.querySelector('[data-role="temp"]');
    var desc = card.querySelector('[data-role="desc"]');
    var extra = card.querySelector('[data-role="extra"]');
    if (temp) temp.textContent = "—";
    if (desc) desc.textContent = message || "Unavailable";
    if (extra) extra.textContent = "High / low unavailable";
    card.classList.add("weather-error");
  }

  function fillCard(card, data) {
    var temp = card.querySelector('[data-role="temp"]');
    var desc = card.querySelector('[data-role="desc"]');
    var extra = card.querySelector('[data-role="extra"]');
    var current = data && data.current;
    var daily = data && data.daily;
    if (!current) {
      setCardError(card, "Unavailable");
      return;
    }
    if (temp) temp.textContent = roundTemp(current.temperature_2m);
    if (desc) desc.textContent = wmoLabel(current.weather_code);
    var hi = daily && daily.temperature_2m_max && daily.temperature_2m_max[0];
    var lo = daily && daily.temperature_2m_min && daily.temperature_2m_min[0];
    if (extra) {
      extra.textContent = "High " + roundTemp(hi) + " · Low " + roundTemp(lo);
    }
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
