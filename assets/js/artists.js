(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var I = window.RK_I18N;
  var T = function (key, vars) { return I ? I.t(key, vars) : key; };
  var curLang = function () { return I ? I.lang() : "bn"; };
  var norm = function (s) { return String(s || "").toLowerCase().replace(/\s+/g, " ").trim(); };

  var ROLE_KEYS = { singer: "role.singer", lyricist: "role.lyricist", composer: "role.composer" };
  var CAT_KEYS = { "হামদ": "genre.hamd", "নাত": "genre.naat", "গজল": "genre.gojol", "নাশীদ": "genre.nasheed", "ইসলামী সংগীত": "genre.islamic" };
  var SILHOUETTE = '<svg class="artist-silhouette" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="23" r="11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 56c2.2-11.5 10.4-18 20-18s17.8 6.5 20 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  var artists = (window.ARTISTS || []).filter(function (a) { return a && a.slug && a.name; });
  var songs = (window.LYRICS || []).filter(function (s) { return s && s.slug && s.title; });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function roleText(a) {
    return (a.roles || []).map(function (r) { return ROLE_KEYS[r] ? T(ROLE_KEYS[r]) : r; }).join(" · ");
  }

  function portrait(a, extra) {
    var box = el("div", "artist-portrait" + (extra ? " " + extra : ""));
    var fallback = function () { box.insertAdjacentHTML("beforeend", SILHOUETTE); };
    if (a.photo) {
      var img = document.createElement("img");
      img.src = a.photo;
      img.alt = a.name;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () { img.remove(); fallback(); };
      box.appendChild(img);
    } else {
      fallback();
    }
    return box;
  }

  function card(a, base) {
    var link = el("a", "artist-card");
    link.href = (base || "") + "#" + encodeURIComponent(a.slug);
    link.appendChild(portrait(a));
    var name = el("h3", null, a.name);
    name.lang = "bn";
    link.appendChild(name);
    var roles = roleText(a);
    if (roles) link.appendChild(el("p", "artist-role", roles));
    return link;
  }

  function songsFor(a) {
    var n = norm(a.name);
    return songs.filter(function (s) {
      return [s.singer, s.lyricist, s.composer].some(function (v) { return v && norm(v).indexOf(n) !== -1; });
    });
  }

  // ---------- হোমপেজের ঝলক ----------
  var teaser = document.querySelector("[data-artists-teaser]");
  function renderTeaser() {
    if (!teaser) return;
    var grid = $("artists-teaser-grid");
    grid.textContent = "";
    teaser.hidden = !artists.length;
    artists.slice(0, 4).forEach(function (a) { grid.appendChild(card(a, "/artists")); });
  }
  renderTeaser();

  // ---------- শিল্পী পেজ ----------
  var listView = $("artists-list-view");
  if (!listView) {
    document.addEventListener("rk:langchange", renderTeaser);
    return;
  }

  var els = {
    toolbar: $("artists-toolbar"),
    chips: $("artists-chips"),
    count: $("artists-count"),
    grid: $("artists-grid"),
    noResults: $("artists-no-results"),
    comingSoon: $("artists-coming-soon"),
    detail: $("artist-detail"),
    back: $("artist-back"),
    photo: $("ad-photo"),
    roles: $("ad-roles"),
    name: $("ad-name"),
    bio: $("ad-bio"),
    yt: $("ad-youtube"),
    fb: $("ad-facebook"),
    songs: $("ad-songs"),
    songsEmpty: $("ad-songs-empty")
  };
  var state = { role: "" };

  function renderList() {
    if (!artists.length) {
      els.toolbar.hidden = true;
      els.count.hidden = true;
      els.grid.hidden = true;
      els.noResults.hidden = true;
      els.comingSoon.hidden = false;
      return;
    }
    var shown = artists.filter(function (a) {
      return !state.role || (a.roles || []).indexOf(state.role) !== -1;
    });
    els.grid.textContent = "";
    shown.forEach(function (a) { els.grid.appendChild(card(a)); });
    els.count.textContent = T("artists.count", { n: shown.length });
    els.grid.hidden = !shown.length;
    els.noResults.hidden = !!shown.length;
    els.comingSoon.hidden = true;
  }

  els.chips.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip");
    if (!btn) return;
    state.role = btn.getAttribute("data-role") || "";
    els.chips.querySelectorAll(".chip").forEach(function (c) {
      c.setAttribute("aria-pressed", c === btn ? "true" : "false");
    });
    renderList();
  });

  function showDetail(a, keepScroll) {
    els.photo.textContent = "";
    els.photo.appendChild(portrait(a, "artist-portrait--lg"));

    els.roles.textContent = "";
    (a.roles || []).forEach(function (r) {
      els.roles.appendChild(el("span", "tag", ROLE_KEYS[r] ? T(ROLE_KEYS[r]) : r));
    });

    els.name.textContent = a.name;

    var l = curLang();
    var bio = (l !== "bn" && a["bio_" + l]) ? { text: a["bio_" + l], lang: l } : (a.bio ? { text: a.bio, lang: "bn" } : null);
    els.bio.hidden = !bio;
    if (bio) { els.bio.textContent = bio.text; els.bio.lang = bio.lang; }

    els.yt.hidden = !a.youtube;
    if (a.youtube) els.yt.href = a.youtube;
    els.fb.hidden = !a.facebook;
    if (a.facebook) els.fb.href = a.facebook;

    var list = songsFor(a);
    els.songs.textContent = "";
    list.forEach(function (s) {
      var li = el("li");
      var link = el("a");
      link.href = "/lyrics#" + encodeURIComponent(s.slug);
      var title = el("span", "song-title", s.title);
      title.lang = "bn";
      link.appendChild(title);
      if (s.category) link.appendChild(el("span", "tag", CAT_KEYS[s.category] ? T(CAT_KEYS[s.category]) : s.category));
      link.insertAdjacentHTML("beforeend", '<svg class="flip-rtl" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      li.appendChild(link);
      els.songs.appendChild(li);
    });
    els.songs.hidden = !list.length;
    els.songsEmpty.hidden = !!list.length;

    listView.hidden = true;
    els.detail.hidden = false;
    document.body.classList.add("detail-open");
    document.title = a.name + T("title.artistSuffix");
    if (!keepScroll) window.scrollTo(0, 0);
  }

  function showList() {
    els.detail.hidden = true;
    listView.hidden = false;
    document.body.classList.remove("detail-open");
    document.title = T("title.artists");
    renderList();
  }

  function route(keepScroll) {
    var slug = "";
    try { slug = decodeURIComponent(location.hash.slice(1)); } catch (e) { slug = ""; }
    var found = null;
    for (var i = 0; i < artists.length; i++) {
      if (artists[i].slug === slug) { found = artists[i]; break; }
    }
    if (found) showDetail(found, keepScroll === true); else showList();
  }

  els.back.addEventListener("click", function (e) {
    e.preventDefault();
    if (history.pushState) history.pushState(null, "", location.pathname + location.search);
    else location.hash = "";
    showList();
    window.scrollTo(0, 0);
  });

  window.addEventListener("hashchange", function () { route(false); });
  document.addEventListener("rk:langchange", function () { renderTeaser(); route(true); });

  route(false);
})();
