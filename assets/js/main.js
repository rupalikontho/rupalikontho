(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  // ---------- লিংক বসানো (config.js থেকে) ----------
  function hrefFor(key, el) {
    var v = (cfg[key] || "").trim();
    if (!v) return "";
    if (key === "email") {
      var subject = el && el.getAttribute("data-mail-subject");
      return "mailto:" + v + (subject ? "?subject=" + encodeURIComponent(subject) : "");
    }
    if (key === "phone") return "tel:" + v.replace(/[^\d+]/g, "");
    if (key === "whatsapp") return "https://wa.me/" + v.replace(/\D/g, "");
    return v;
  }

  var toBn = function (s) {
    return String(s).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; });
  };

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var href = hrefFor(key, el);
    if (href) {
      el.setAttribute("href", href);
      if (/^https?:/.test(href)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
      if (el.hasAttribute("data-text")) {
        el.textContent = key === "phone" ? toBn(cfg[key]) : cfg[key];
      }
    } else if (el.hasAttribute("data-fallback")) {
      el.setAttribute("href", el.getAttribute("data-fallback"));
      el.querySelectorAll("[data-label-fallback]").forEach(function (lbl) {
        lbl.textContent = lbl.getAttribute("data-label-fallback");
      });
    } else if (el.hasAttribute("data-hide-empty") || el.hasAttribute("data-text")) {
      el.hidden = true;
    }
  });

  document.querySelectorAll("[data-link-row]").forEach(function (row) {
    if (!(cfg[row.getAttribute("data-link-row")] || "").trim()) row.hidden = true;
  });

  document.querySelectorAll("[data-text-of]").forEach(function (el) {
    el.textContent = cfg[el.getAttribute("data-text-of")] || "";
  });

  // সোশ্যাল লিংক একটাও না থাকলে পুরো কলামটা লুকানো
  document.querySelectorAll("[data-social-block]").forEach(function (block) {
    var visible = Array.prototype.some.call(block.querySelectorAll("a"), function (a) { return !a.hidden; });
    if (!visible) block.hidden = true;
  });

  // ---------- সাল ----------
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = toBn(new Date().getFullYear());
  });

  // ---------- মোবাইল মেনু ----------
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "মেনু বন্ধ করুন" : "মেনু খুলুন");
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }
})();
