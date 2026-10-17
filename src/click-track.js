/* Privacy-friendly listing click counter: no cookies, no IDs, no personal data.
 * Sends {business, type} with navigator.sendBeacon; never blocks navigation. */
(function () {
  if (!navigator.sendBeacon) return;
  function kind(a) {
    var h = (a.getAttribute("href") || "").toLowerCase();
    if (h.indexOf("tel:") === 0) return "phone";
    if (h.indexOf("mailto:") === 0) return "email";
    if (/facebook\.com|fb\.me/.test(h)) return "facebook";
    if (/maps\.google|google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl|maps\.apple\.com|bing\.com\/maps|waze\.com/.test(h)) return "directions";
    if (/^https?:/.test(h)) return "website";
    return null;
  }
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest(".sponsor-card a[href], .featured-business a[href]") : null;
    if (!a) return;
    var card = a.closest(".sponsor-card, .featured-business");
    var t = kind(a);
    var h3 = card && card.querySelector("h3");
    var biz = (card && card.getAttribute("data-business")) || (h3 && h3.textContent.trim());
    if (!t || !biz) return;
    try { navigator.sendBeacon("/api/click", new Blob([JSON.stringify({ business: biz.slice(0, 80), type: t })], { type: "text/plain" })); } catch (_) {}
  }, true);
})();
