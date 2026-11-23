(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
  var toBn = function (s) { return String(s).replace(/\d/g, function (d) { return BN_DIGITS[d]; }); };
  var norm = function (s) { return String(s || "").toLowerCase().replace(/\s+/g, " ").trim(); };

  var songs = (window.LYRICS || []).filter(function (s) {
    return s && s.slug && s.title && s.lyrics;
  });

  var baseTitle = document.title;
  var state = { query: "", cat: "" };

  var els = {
    listView: $("lyrics-list-view"),
    toolbar: $("lyrics-toolbar"),
    search: $("lyrics-search"),
    chips: $("lyrics-chips"),
    count: $("lyrics-count"),
    grid: $("lyrics-grid"),
    noResults: $("lyrics-no-results"),
    comingSoon: $("lyrics-coming-soon"),
    detail: $("lyrics-detail"),
    back: $("lyrics-back"),
    cat: $("ld-category"),
    title: $("ld-title"),
    meta: $("ld-meta"),
    yt: $("ld-youtube"),
    video: $("ld-video"),
    body: $("ld-body"),
    share: $("ld-share"),
    shareLabel: $("ld-share-label"),
    smaller: $("ld-smaller"),
    bigger: $("ld-bigger")
  };

  // ---------- সাহায্যকারী ----------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function firstLine(lyrics) {
    var lines = String(lyrics).split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    return lines[0] || "";
  }

  function youtubeId(url) {
    if (!url) return "";
    var m = String(url).match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }

  function searchable(s) {
    return norm([s.title, s.singer, s.lyricist, s.composer, s.category, s.lyrics].join(" "));
  }

  // ---------- তালিকা ----------
  function renderList() {
    if (!songs.length) {
      els.toolbar.hidden = true;
      els.count.hidden = true;
      els.grid.hidden = true;
      els.noResults.hidden = true;
      els.comingSoon.hidden = false;
      return;
    }

    var q = norm(state.query);
    var shown = songs.filter(function (s) {
      if (state.cat && s.category !== state.cat) return false;
      return !q || searchable(s).indexOf(q) !== -1;
    });

    els.grid.textContent = "";
    shown.forEach(function (s) {
      var a = el("a", "lyric-card");
      a.href = "#" + encodeURIComponent(s.slug);
      if (s.category) a.appendChild(el("span", "tag", s.category));
      a.appendChild(el("h3", null, s.title));
      a.appendChild(el("p", "first-line", firstLine(s.lyrics)));
      if (s.singer) a.appendChild(el("p", "card-meta", "কণ্ঠ: " + s.singer));
      els.grid.appendChild(a);
    });

    var filtered = q || state.cat;
    els.count.textContent = filtered
      ? toBn(shown.length) + "টি গান পাওয়া গেছে"
      : "মোট " + toBn(songs.length) + "টি গানের কথা";
    els.grid.hidden = !shown.length;
    els.noResults.hidden = !!shown.length;
    els.comingSoon.hidden = true;
  }

  if (els.search) {
    els.search.addEventListener("input", function () {
      state.query = els.search.value;
      renderList();
    });
  }

  if (els.chips) {
    els.chips.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      state.cat = btn.getAttribute("data-cat") || "";
      els.chips.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", c === btn ? "true" : "false");
      });
      renderList();
    });
  }

  // ---------- একটি গানের কথা ----------
  function showDetail(s) {
    els.cat.textContent = s.category || "";
    els.cat.hidden = !s.category;
    els.title.textContent = s.title;

    els.meta.textContent = "";
    [["কণ্ঠ", s.singer], ["কথা", s.lyricist], ["সুর", s.composer]].forEach(function (pair) {
      if (!pair[1]) return;
      var row = el("div");
      row.appendChild(el("dt", null, pair[0] + ":"));
      row.appendChild(el("dd", null, pair[1]));
      els.meta.appendChild(row);
    });
    els.meta.hidden = !els.meta.children.length;

    var vid = youtubeId(s.youtube);
    els.video.textContent = "";
    if (vid) {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + vid;
      f.title = s.title + " — ভিডিও";
      f.loading = "lazy";
      f.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      els.video.appendChild(f);
    }
    els.video.hidden = !vid;
    els.yt.hidden = !s.youtube;
    if (s.youtube) els.yt.href = s.youtube;

    els.body.textContent = "";
    String(s.lyrics).replace(/\r/g, "").trim().split(/\n\s*\n/).forEach(function (stanza) {
      var p = el("p", "stanza");
      stanza.split("\n").forEach(function (line, i) {
        if (i) p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(line.trim()));
      });
      els.body.appendChild(p);
    });

    els.listView.hidden = true;
    els.detail.hidden = false;
    els.shareLabel.textContent = "শেয়ার করুন";
    document.title = s.title + " — লিরিক্স | রূপালী কণ্ঠ";
    document.body.classList.add("lyric-open");
    window.scrollTo(0, 0);
  }

  function showList() {
    els.detail.hidden = true;
    els.listView.hidden = false;
    document.body.classList.remove("lyric-open");
    document.title = baseTitle;
    renderList();
  }

  function route() {
    var slug = "";
    try { slug = decodeURIComponent(location.hash.slice(1)); } catch (e) { slug = ""; }
    var song = null;
    for (var i = 0; i < songs.length; i++) {
      if (songs[i].slug === slug) { song = songs[i]; break; }
    }
    if (song) showDetail(song); else showList();
  }

  if (els.back) {
    els.back.addEventListener("click", function (e) {
      e.preventDefault();
      if (history.pushState) history.pushState(null, "", location.pathname + location.search);
      else location.hash = "";
      showList();
      window.scrollTo(0, 0);
    });
  }

  window.addEventListener("hashchange", route);

  // ---------- লেখার আকার ----------
  var SIZES = [17, 19, 21, 23, 26, 30];
  var sizeIdx = -1;
  try { sizeIdx = parseInt(localStorage.getItem("rk-lyric-size"), 10); } catch (e) {}
  if (!(sizeIdx >= 0 && sizeIdx < SIZES.length)) sizeIdx = -1;

  function applySize() {
    if (sizeIdx < 0) return;
    els.body.style.setProperty("--lyric-size", SIZES[sizeIdx] + "px");
    try { localStorage.setItem("rk-lyric-size", String(sizeIdx)); } catch (e) {}
  }
  function currentIdx() {
    if (sizeIdx >= 0) return sizeIdx;
    var px = parseFloat(getComputedStyle(els.body).fontSize) || 21;
    var best = 0;
    SIZES.forEach(function (v, i) { if (Math.abs(v - px) < Math.abs(SIZES[best] - px)) best = i; });
    return best;
  }
  if (els.smaller) els.smaller.addEventListener("click", function () {
    sizeIdx = Math.max(0, currentIdx() - 1); applySize();
  });
  if (els.bigger) els.bigger.addEventListener("click", function () {
    sizeIdx = Math.min(SIZES.length - 1, currentIdx() + 1); applySize();
  });
  applySize();

  // ---------- শেয়ার ----------
  if (els.share) {
    els.share.addEventListener("click", function () {
      var url = location.href;
      var title = els.title.textContent;
      if (navigator.share) {
        navigator.share({ title: title + " — রূপালী কণ্ঠ", url: url }).catch(function () {});
        return;
      }
      var done = function () {
        els.shareLabel.textContent = "লিংক কপি হয়েছে";
        setTimeout(function () { els.shareLabel.textContent = "শেয়ার করুন"; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt("লিংকটি কপি করুন:", url); });
      } else {
        window.prompt("লিংকটি কপি করুন:", url);
      }
    });
  }

  route();
})();
