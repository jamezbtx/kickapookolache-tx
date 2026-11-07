/* "Get new story alerts" bell (opt-in web push). */
(function () {
  var nav = document.querySelector(".site-nav");
  if (!nav) return;
  var wrap = document.createElement("span"); wrap.className = "push-wrap";
  var btn = document.createElement("button"); btn.type = "button"; btn.className = "push-btn";
  var hint = document.createElement("span"); hint.className = "push-hint"; hint.hidden = true; hint.setAttribute("role", "status");
  wrap.appendChild(btn); wrap.appendChild(hint); nav.parentNode.insertBefore(wrap, nav);
  var BELL = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 3a6 6 0 0 0-6 6v4l-1.6 2.7A.9.9 0 0 0 5.2 17h13.6a.9.9 0 0 0 .8-1.3L18 13V9a6 6 0 0 0-6-6zm-2.3 15.5a2.4 2.4 0 0 0 4.6 0z" fill="currentColor"/></svg>';
  function label(t, on) { var short = on ? "Alerts on" : "Alerts"; btn.innerHTML = BELL + '<span class="push-long">' + t + '</span><span class="push-short">' + short + "</span>"; btn.title = on ? "Story alerts are on. Tap to turn off." : "Get a notice when a new story posts"; btn.classList.toggle("is-on", !!on); btn.setAttribute("aria-pressed", on ? "true" : "false"); }
  function say(t) { hint.textContent = t; hint.hidden = !t; }
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  var supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  label("Get story alerts");
  if (ios && !standalone) {
    btn.addEventListener("click", function () { say("On iPhone, add Kickapoo Kolache to your Home Screen first: tap Share, then Add to Home Screen. Then open it from there and tap the bell."); });
    return;
  }
  if (!supported) { btn.addEventListener("click", function () { say("This browser doesn't support story alerts."); }); return; }
  function b64ToU8(s) { s = (s + "===".slice((s.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/"); var r = atob(s), a = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a; }
  function post(path, data) { return fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error(path + " " + r.status); return r; }); }
  var reg;
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(function () { return navigator.serviceWorker.ready; }).then(function (r) {
    reg = r; return r.pushManager.getSubscription();
  }).then(function (sub) { if (sub && Notification.permission === "granted") label("Alerts on", true); }).catch(function () {});
  var busy = false;
  btn.addEventListener("click", function () {
    if (busy || !reg) return; busy = true; say("");
    reg.pushManager.getSubscription().then(function (sub) {
      if (sub) {
        return post("/api/push-unsubscribe", { endpoint: sub.endpoint }).catch(function () {}).then(function () { return sub.unsubscribe(); })
          .then(function () { label("Get story alerts"); say("Story alerts are off."); });
      }
      return Notification.requestPermission().then(function (p) {
        if (p !== "granted") { say(p === "denied" ? "Notifications are blocked for this site. You can allow them in your browser's site settings." : "No problem. Tap the bell any time."); return; }
        return fetch("/api/push-key").then(function (r) { return r.json(); }).then(function (k) {
          return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(k.publicKey) });
        }).then(function (s) { return post("/api/push-subscribe", s.toJSON()); })
          .then(function () { label("Alerts on", true); say("You'll get a notice when a new story posts."); });
      });
    }).catch(function () { say("Sorry, alerts couldn't be set up. Please try again."); }).then(function () { busy = false; });
  });
})();
