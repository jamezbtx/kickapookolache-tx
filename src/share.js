(function () {
  var SHARE_URL = "https://kickapookolache.com";
  var SHARE_TITLE = "Kickapoo Kolache — Brownsboro · Chandler TX";
  var SHARE_TEXT = "Local digital newspaper for Brownsboro and Chandler, Texas.";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function setStatus(el, msg) {
    if (!el) return;
    el.textContent = msg;
    window.clearTimeout(el._shareTimer);
    el._shareTimer = window.setTimeout(function () {
      el.textContent = "";
    }, 2200);
  }

  async function copyLink(statusEl) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(SHARE_URL);
      } else {
        var ta = document.createElement("textarea");
        ta.value = SHARE_URL;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setStatus(statusEl, "Link copied");
    } catch (err) {
      setStatus(statusEl, "Copy failed — select the URL above");
    }
  }

  async function sharePage(statusEl) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: SHARE_URL
        });
        setStatus(statusEl, "Shared");
        return;
      } catch (err) {
        if (err && err.name === "AbortError") {
          setStatus(statusEl, "");
          return;
        }
      }
    }
    await copyLink(statusEl);
  }

  function bindStrip(strip) {
    var statusEl = $(".share-status", strip);
    var copyBtn = $("[data-share-copy]", strip);
    var shareBtn = $("[data-share-native]", strip);
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        copyLink(statusEl);
      });
    }
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        sharePage(statusEl);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".qr-share-strip").forEach(bindStrip);
  });
})();
