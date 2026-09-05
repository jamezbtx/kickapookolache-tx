(function () {
  var params = new URLSearchParams(window.location.search);
  var raw = (params.get("category") || "").toLowerCase().trim();
  if (!raw && window.location.hash) {
    raw = window.location.hash.replace(/^#/, "").toLowerCase().trim();
  }
  if (!raw) return;

  var map = {
    job: "Job listing",
    jobs: "Job listing",
    "job-listing": "Job listing",
    ask: "Ask the Kolache",
    "ask-the-kolache": "Ask the Kolache",
    garage: "Garage sale",
    "garage-sale": "Garage sale",
    sales: "Garage sale",
    contractor: "Contractor directory",
    contractors: "Contractor directory",
    directory: "Contractor directory",
    other: "Other tip",
    tip: "Other tip"
  };

  var value = map[raw] || null;
  var select = document.getElementById("category");
  if (!select || !value) return;
  select.value = value;
})();
