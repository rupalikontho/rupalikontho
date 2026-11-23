/*
  রূপালী কণ্ঠ — ভাষা বদলানো (বাংলা, English, हिन्दी, اردو, العربية)
  লেখাগুলো আছে assets/js/i18n-strings.js ফাইলে।
*/
(function () {
  "use strict";

  var S = window.RK_STRINGS || {};

  var LANGS = [
    { code: "bn", name: "বাংলা", flag: "bd", dir: "ltr" },
    { code: "en", name: "English", flag: "gb", dir: "ltr" },
    { code: "hi", name: "हिन्दी", flag: "in", dir: "ltr" },
    { code: "ur", name: "اردو", flag: "pk", dir: "rtl" },
    { code: "ar", name: "العربية", flag: "sa", dir: "rtl" }
  ];

  // যে ভাষায় আলাদা ফন্ট লাগে, শুধু সেটা বেছে নিলে তবেই লোড হবে
  var FONTS = {
    hi: "family=Hind:wght@400;500;600&family=Tiro+Devanagari+Hindi",
    ur: "family=Noto+Nastaliq+Urdu:wght@400;600",
    ar: "family=Noto+Naskh+Arabic:wght@400;500;600"
  };

  var DIGITS = { bn: "০১২৩৪৫৬৭৮৯", ur: "۰۱۲۳۴۵۶۷۸۹", ar: "٠١٢٣٤٥٦٧٨٩" };

  // পতাকা (৩:২ অনুপাত)
  var FLAGS = {
    bd: '<rect width="30" height="20" fill="#006a4e"/><circle cx="13.5" cy="10" r="6" fill="#f42a41"/>',
    gb: '<rect width="30" height="20" fill="#012169"/>' +
        '<path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/>' +
        '<path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.6"/>' +
        '<path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="6.5"/>' +
        '<path d="M15 0V20M0 10H30" stroke="#c8102e" stroke-width="3.8"/>',
    in: '<rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#ff9933"/>' +
        '<rect y="13.33" width="30" height="6.67" fill="#138808"/>' +
        '<circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width="0.6"/>' +
        '<circle cx="15" cy="10" r="0.6" fill="#000080"/>' +
        '<path d="M15 7.4V12.6M12.4 10H17.6M13.16 8.16L16.84 11.84M16.84 8.16L13.16 11.84" stroke="#000080" stroke-width="0.3"/>',
    pk: '<rect width="30" height="20" fill="#01411c"/><rect width="7.5" height="20" fill="#fff"/>' +
        '<circle cx="19.6" cy="10.4" r="5.4" fill="#fff"/><circle cx="21.3" cy="9.1" r="4.7" fill="#01411c"/>' +
        '<path d="M21.75 5.81L22.61 6.85L23.90 6.43L23.18 7.57L23.98 8.66L22.67 8.33L21.88 9.43L21.79 8.08L20.50 7.67L21.75 7.16Z" fill="#fff"/>',
    sa: '<rect width="30" height="20" fill="#006c35"/>' +
        '<text x="15" y="10" text-anchor="middle" font-family="Amiri, serif" font-size="4.6" fill="#fff" textLength="21" lengthAdjust="spacingAndGlyphs">لا إله إلا الله محمد رسول الله</text>' +
        '<path d="M7.5 13.6H22" stroke="#fff" stroke-width="0.9" stroke-linecap="round"/><path d="M21.6 12.7V14.5" stroke="#fff" stroke-width="0.9"/>'
  };

  function flag(code) {
    return '<svg class="flag" viewBox="0 0 30 20" width="24" height="16" aria-hidden="true" focusable="false">' + FLAGS[code] + "</svg>";
  }

  var CHECK = '<svg class="lang-check" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEVRON = '<svg class="lang-chevron" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var current = "bn";
  var loadedFonts = {};

  function find(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return null;
  }

  function num(n, lang) {
    var d = DIGITS[lang || current];
    return d ? String(n).replace(/\d/g, function (x) { return d[x]; }) : String(n);
  }

  function t(key, vars) {
    var e = S[key];
    if (vars && vars.n === 1 && S[key + ".one"]) e = S[key + ".one"];
    if (!e) return "";
    var s = e[current] != null && e[current] !== "" ? e[current] : (current === "bn" ? e.bn : e.en || e.bn);
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) {
        if (k === "n") return num(vars.n);
        return vars[k] != null ? vars[k] : m;
      });
    }
    return s;
  }

  function loadFont(code) {
    if (!FONTS[code] || loadedFonts[code]) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?" + FONTS[code] + "&display=swap";
    document.head.appendChild(l);
    loadedFonts[code] = true;
  }

  function apply() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length !== 2) return;
        var v = t(p[1].trim());
        if (v) el.setAttribute(p[0].trim(), v);
      });
    });
    document.querySelectorAll("[data-hide-bn]").forEach(function (el) {
      el.hidden = current === "bn";
    });
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = num(new Date().getFullYear());
    });
    var tk = document.documentElement.getAttribute("data-title-key");
    if (tk && !document.body.classList.contains("lyric-open")) document.title = t(tk);
  }

  // ---------- ভাষা বাছাইয়ের মেনু ----------
  var switches = [];

  function buildSwitch(box, idx) {
    var menuId = "lang-menu-" + idx;
    var html = '<button type="button" class="lang-btn" aria-expanded="false" aria-controls="' + menuId + '">' +
      '<span class="lang-btn-flag"></span><span class="lang-btn-name"></span>' + CHEVRON + "</button>" +
      '<ul class="lang-menu" id="' + menuId + '" hidden>';
    LANGS.forEach(function (L) {
      html += '<li><button type="button" class="lang-opt" data-lang="' + L.code + '" lang="' + L.code + '">' +
        flag(L.flag) + '<span class="lang-opt-name">' + L.name + "</span>" + CHECK + "</button></li>";
    });
    html += "</ul>";
    box.innerHTML = html;

    var btn = box.querySelector(".lang-btn");
    var menu = box.querySelector(".lang-menu");
    var sw = { box: box, btn: btn, menu: menu };

    function open(focusFirst) {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      box.classList.add("is-open");
      if (focusFirst) {
        var active = menu.querySelector('.lang-opt[aria-current="true"]') || menu.querySelector(".lang-opt");
        if (active) active.focus();
      }
    }
    sw.close = function (focusBtn) {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      box.classList.remove("is-open");
      if (focusBtn) btn.focus();
    };

    btn.addEventListener("click", function () {
      if (menu.hidden) open(false); else sw.close(false);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); open(true); }
    });
    menu.addEventListener("click", function (e) {
      var opt = e.target.closest(".lang-opt");
      if (!opt) return;
      setLang(opt.getAttribute("data-lang"), true);
      sw.close(true);
    });
    menu.addEventListener("keydown", function (e) {
      var opts = Array.prototype.slice.call(menu.querySelectorAll(".lang-opt"));
      var i = opts.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
      else if (e.key === "Escape") { e.preventDefault(); sw.close(true); }
    });
    box.addEventListener("focusout", function (e) {
      if (!box.contains(e.relatedTarget) && e.relatedTarget) sw.close(false);
    });

    switches.push(sw);
  }

  function renderSwitches() {
    var L = find(current);
    switches.forEach(function (sw) {
      sw.btn.querySelector(".lang-btn-flag").innerHTML = flag(L.flag);
      var name = sw.btn.querySelector(".lang-btn-name");
      name.textContent = L.name;
      name.setAttribute("lang", L.code);
      sw.btn.setAttribute("aria-label", t("lang.label") + ": " + L.name);
      sw.menu.querySelectorAll(".lang-opt").forEach(function (o) {
        var on = o.getAttribute("data-lang") === current;
        if (on) o.setAttribute("aria-current", "true"); else o.removeAttribute("aria-current");
      });
    });
  }

  document.addEventListener("click", function (e) {
    switches.forEach(function (sw) {
      if (!sw.box.contains(e.target)) sw.close(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") switches.forEach(function (sw) { if (!sw.menu.hidden) sw.close(true); });
  });

  // ---------- ভাষা বদলানো ----------
  function setLang(code, persist) {
    var L = find(code) || LANGS[0];
    current = L.code;
    var h = document.documentElement;
    h.lang = L.code;
    h.dir = L.dir;
    loadFont(L.code);
    apply();
    renderSwitches();
    if (persist) {
      try { localStorage.setItem("rk-lang", L.code); } catch (e) {}
    }
    var ev;
    try { ev = new CustomEvent("rk:langchange", { detail: { lang: L.code } }); }
    catch (e) { ev = document.createEvent("CustomEvent"); ev.initCustomEvent("rk:langchange", false, false, { lang: L.code }); }
    document.dispatchEvent(ev);
  }

  window.RK_I18N = {
    t: t,
    num: num,
    lang: function () { return current; },
    setLang: setLang
  };

  document.querySelectorAll("[data-lang-switch]").forEach(buildSwitch);

  var start = "bn";
  var fromUrl = null;
  try { fromUrl = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  if (fromUrl && find(fromUrl)) {
    start = fromUrl;
    try { localStorage.setItem("rk-lang", start); } catch (e) {}
  } else {
    try { var saved = localStorage.getItem("rk-lang"); if (saved && find(saved)) start = saved; } catch (e) {}
  }
  setLang(start, false);
})();
