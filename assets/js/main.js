/* Renders the content in data.js and wires up the page's interactions. */
(function () {
  'use strict';

  var D = window.PORTFOLIO || {};
  var root = document.documentElement;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }
  function icon(name, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>'; }
  function ext(href, label, cls) {
    return '<a class="' + (cls || 'link') + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
      esc(label) + ' ' + icon('arrow-ur') + '<span class="sr-only">(opens in a new tab)</span></a>';
  }

  /* Colour classes: `hue` tints a block, `hot` marks its decisive element. */
  function tone(o) { return (o.hue ? ' hue-' + o.hue : '') + (o.hot ? ' hot-' + o.hot : ''); }

  /* A technology chip: its logo if we have one, otherwise a coloured dot. */
  function chip(name) {
    var file = D.logos && D.logos[name];
    var mark = file
      ? '<span class="chip-logo"><img src="assets/icons/' + esc(file) + '.svg" alt="" width="16" height="16" loading="lazy" decoding="async"></span>'
      : '<span class="chip-dot" aria-hidden="true"></span>';
    return '<li class="chip">' + mark + esc(name) + '</li>';
  }
  function chips(items, label) {
    return '<ul class="chips"' + (label ? ' aria-label="' + esc(label) + '"' : '') + '>' + items.map(chip).join('') + '</ul>';
  }

  /* ---------------------------------------------------------------- */
  /* Figures: one schematic language shared by every project.         */
  /* ---------------------------------------------------------------- */

  function rails(list) {
    if (!list || !list.length) return '';
    return '<dl class="rails">' + list.map(function (r) {
      return '<div' + (r.accent ? ' class="is-accent"' : '') + '><dt>' + esc(r.k) + '</dt><dd>' + esc(r.v) + '</dd></div>';
    }).join('') + '</dl>';
  }

  function shot(s) {
    return '<div class="shot">' +
      '<div class="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(s.label) + '</span></div>' +
      '<button class="shot-btn" type="button" data-zoom="' + esc(s.src) + '" data-alt="' + esc(s.alt) + '" data-caption="' + esc(s.label) + '" aria-label="Enlarge screenshot: ' + esc(s.label) + '">' +
      '<img src="' + esc(s.src) + '" width="' + s.w + '" height="' + s.h + '" alt="' + esc(s.alt) + '" loading="lazy" decoding="async">' +
      '</button></div>';
  }

  var TOPOLOGY =
    '<svg viewBox="0 28 640 186" role="img" aria-label="A substation feeds a transformer and a tree of poles. One span is marked as the fault: its parent pole is live and every pole downstream of it is dark.">' +
      '<rect class="tp-zone" x="352" y="82" width="278" height="114" rx="8"/>' +
      /* live edges */
      '<path class="tp-edge tp-edge--ht" d="M32 106H110"/>' +
      '<path class="tp-edge" d="M128 106H300M240 106 292 52H412M180 106 228 172H288"/>' +
      /* dark edges */
      '<path class="tp-edge tp-edge--dark" d="M372 106H612M432 106 480 172H540"/>' +
      /* the localized span */
      '<path class="tp-edge tp-edge--fault" d="M300 106H372"/>' +
      '<path class="tp-x" d="M329 99l14 14M343 99l-14 14"/>' +
      /* substation and transformer */
      '<rect class="tp-sub" x="14" y="97" width="18" height="18" rx="3"/>' +
      '<rect class="tp-dt" x="110" y="97" width="18" height="18" rx="3"/>' +
      /* live poles */
      '<g class="tp-live">' +
        '<circle cx="180" cy="106" r="6"/><circle cx="240" cy="106" r="6"/><circle cx="300" cy="106" r="6"/>' +
        '<circle cx="292" cy="52" r="6"/><circle cx="412" cy="52" r="6"/>' +
        '<circle cx="228" cy="172" r="6"/><circle cx="288" cy="172" r="6"/>' +
      '</g>' +
      /* poles with no sensor */
      '<g class="tp-none"><circle cx="352" cy="52" r="5.5"/><circle cx="552" cy="106" r="5.5"/></g>' +
      /* confirmed dark poles */
      '<g class="tp-dark">' +
        '<circle cx="372" cy="106" r="6"/><circle cx="432" cy="106" r="6"/><circle cx="492" cy="106" r="6"/><circle cx="612" cy="106" r="6"/>' +
        '<circle cx="480" cy="172" r="6"/><circle cx="540" cy="172" r="6"/>' +
      '</g>' +
    '</svg>' +
    '<ul class="legend">' +
      '<li><span class="mk mk--sub"></span>Substation</li>' +
      '<li><span class="mk mk--dt"></span>Transformer</li>' +
      '<li><span class="mk mk--live"></span>Live pole</li>' +
      '<li><span class="mk mk--dark"></span>Confirmed dark</li>' +
      '<li><span class="mk mk--none"></span>No sensor</li>' +
      '<li class="is-accent"><span class="mk mk--x"></span>Localized span</li>' +
    '</ul>';

  /* Each step is a tile holding its icon, or its number when it has none. */
  function pipe(steps) {
    return '<ol class="pipe" style="--n:' + steps.length + '">' + steps.map(function (s, i) {
      var n = (i < 9 ? '0' : '') + (i + 1);
      return '<li class="pipe-step' + (s.accent ? ' is-accent' : '') + '">' +
        '<span class="pipe-ico" aria-hidden="true">' + (s.icon ? icon(s.icon) : n) + '</span>' +
        '<span class="pipe-t">' + esc(s.t) + '</span>' +
        '<span class="pipe-d">' + esc(s.d) + '</span></li>';
    }).join('') + '</ol>';
  }

  /* A second, smaller flow under a figure's main schematic. `stepsIn: 'study'`
     keeps it out of the project block and shows it in the case study only. */
  function subflow(f, inStudy) {
    if (!f.steps || (f.stepsIn === 'study' && !inStudy)) return '';
    return '<div class="fig-sub">' + (f.stepsLabel ? '<p class="label">' + esc(f.stepsLabel) + '</p>' : '') + pipe(f.steps) + '</div>';
  }

  var FIGURES = {
    pipeline: function (f) { return pipe(f.steps) + rails(f.rails); },

    rollout: function (f) {
      var steps = f.steps.map(function (s, i) {
        return '<li' + (i === f.active ? ' class="is-on" aria-current="step"' : '') + '>' + esc(s) + '</li>';
      }).join('');
      return '<div class="rollout">' +
          '<div class="ro-top"><span>Stable <b>' + f.stable + '%</b></span><span class="is-canary">Canary <b>' + f.canary + '%</b></span></div>' +
          '<div class="ro-bar" role="img" aria-label="' + f.stable + ' percent of users on the stable version, ' + f.canary + ' percent on the canary">' +
            '<span class="ro-stable" style="flex-grow:' + f.stable + '"></span><span class="ro-canary" style="flex-grow:' + f.canary + '"></span>' +
          '</div>' +
          '<ol class="ro-steps" aria-label="Rollout steps">' + steps + '</ol>' +
          rails(f.rails) +
        '</div>';
    },

    layers: function (f, inStudy) {
      return '<div class="layers">' + f.layers.map(function (l) {
        var tag = l.chain ? 'ol' : 'ul';
        var items = l.items.map(function (it) {
          var o = typeof it === 'string' ? { t: it } : it;
          return '<li' + (o.accent ? ' class="is-accent"' : '') + '>' + esc(o.t) + '</li>';
        }).join('');
        return '<div class="layer"><span class="layer-k">' + esc(l.k) + '</span>' +
          '<' + tag + ' class="layer-items' + (l.chain ? ' is-chain' : '') + '">' + items + '</' + tag + '></div>';
      }).join('') + '</div>' + subflow(f, inStudy);
    },

    topology: function (f, inStudy) { return '<div class="topo">' + TOPOLOGY + '</div>' + subflow(f, inStudy); }
  };

  /* In a case study the screenshot moves to its own section, so the figure drops it. */
  function figure(f, n, inStudy) {
    if (!f || !FIGURES[f.type]) return '';
    var caption = inStudy && f.studyCaption ? f.studyCaption : f.caption;
    // A diagram always says what it is: a "How it works" label and a plain title.
    var head = f.title
      ? '<div class="fig-head"><span class="label">How it works</span><h4 class="fig-title">' + esc(f.title) + '</h4></div>'
      : '';
    return '<figure class="fig fig--' + f.type + '">' +
      '<div class="fig-body">' + head + (f.shot && !inStudy ? shot(f.shot) : '') + FIGURES[f.type](f, inStudy) + '</div>' +
      '<figcaption>' + esc(caption) + '</figcaption>' +
      '</figure>';
  }

  /* ---------------------------------------------------------------- */
  /* Projects                                                         */
  /* ---------------------------------------------------------------- */

  function projectLinks(p) {
    var out = '';
    if (p.links && p.links.github) out += ext(p.links.github, 'GitHub');
    if (p.links && p.links.live) out += ext(p.links.live, 'Live');
    return out;
  }

  function badge(p) {
    return '<p class="p-index"><span class="p-num">' + esc(p.index) + '</span>' +
      (p.status ? '<span class="p-status">' + esc(p.status) + '</span>' : '') +
      (p.when ? '<span class="p-when">' + esc(p.when) + '</span>' : '') + '</p>';
  }

  function projectHTML(p, i) {
    var layout = i === 0 ? 'project--lead' : (i % 2 === 0 ? 'project--flip' : 'project--std');
    return '<article class="project ' + layout + tone(p) + '" id="project-' + esc(p.id) + '" aria-labelledby="p-' + esc(p.id) + '">' +
      figure(p.figure, p.index) +
      '<div class="p-head" data-reveal>' +
        badge(p) +
        '<h3 class="p-name" id="p-' + esc(p.id) + '">' + esc(p.name) + '</h3>' +
        '<p class="p-title">' + esc(p.title) + '</p>' +
        '<p class="p-summary">' + esc(p.summary) + '</p>' +
      '</div>' +
      '<div class="p-body" data-reveal>' +
        '<dl class="p-facts">' +
          '<div><dt>Problem</dt><dd>' + esc(p.problem) + '</dd></div>' +
          '<div><dt>What I built</dt><dd>' + esc(p.built) + '</dd></div>' +
          '<div><dt>Why it is interesting</dt><dd>' + esc(p.interesting) + '</dd></div>' +
        '</dl>' +
        chips(p.stack, 'Main technologies') +
      '</div>' +
      '<div class="p-actions" data-reveal>' +
        '<button class="btn" type="button" data-case="' + esc(p.id) + '" aria-haspopup="dialog">Read case study ' + icon('arrow-r', 'i--move-r') + '</button>' +
        projectLinks(p) +
      '</div>' +
    '</article>';
  }

  /* Secondary projects: a card with a real screenshot, or the stack's logos when there is none. */
  function moreHTML(m) {
    var visual = m.shot
      ? '<button class="more-visual" type="button" data-zoom="' + esc(m.shot.src) + '" data-alt="' + esc(m.shot.alt) + '" data-caption="' + esc(m.shot.label) + '" aria-label="Enlarge screenshot: ' + esc(m.shot.label) + '">' +
          '<img src="' + esc(m.shot.src) + '" width="' + m.shot.w + '" height="' + m.shot.h + '" alt="' + esc(m.shot.alt) + '" loading="lazy" decoding="async"></button>'
      : '<div class="more-visual more-visual--logos" aria-hidden="true">' + (m.logos || []).map(function (n) {
          var file = D.logos && D.logos[n];
          return file ? '<span><img src="assets/icons/' + esc(file) + '.svg" alt="" width="34" height="34" loading="lazy" decoding="async"></span>' : '';
        }).join('') + '</div>';
    return '<article class="more-card' + tone(m) + '" data-reveal>' + visual +
      '<div class="more-body">' +
        '<p class="p-index"><span class="p-num">' + esc(m.index) + '</span><span class="p-status">' + esc(m.title) + '</span></p>' +
        '<h4>' + esc(m.name) + '</h4>' +
        '<p>' + esc(m.summary) + '</p>' +
        chips(m.stack, 'Technologies') +
        '<div class="more-links">' + projectLinks(m) + '</div>' +
      '</div></article>';
  }

  /* ---------------------------------------------------------------- */
  /* Case study                                                       */
  /* ---------------------------------------------------------------- */

  function kv(list, join) {
    return '<dl class="kv">' + list.map(function (r) {
      var v = Array.isArray(r.v) ? r.v.map(esc).join(join || ' · ') : esc(r.v);
      return '<div><dt>' + esc(r.k) + '</dt><dd>' + v + '</dd></div>';
    }).join('') + '</dl>';
  }

  function sec(title, body) {
    return '<section class="case-sec"><h3>' + esc(title) + '</h3><div class="case-sec-body">' + body + '</div></section>';
  }

  function caseHTML(p) {
    var s = p.study;
    var idx = D.projects.indexOf(p);
    var next = D.projects[(idx + 1) % D.projects.length];
    var shots = (p.figure.shot ? [p.figure.shot] : []).concat(p.shots || []);

    return '<header class="case-head">' +
        badge(p) +
        '<h2 class="case-name" id="case-title">' + esc(p.name) + '</h2>' +
        '<p class="case-title">' + esc(p.title) + '</p>' +
        '<div class="case-links">' + projectLinks(p) + '</div>' +
      '</header>' +
      sec('Problem', '<p>' + esc(p.problem) + '</p>') +
      sec('Solution', '<p>' + esc(s.solution) + '</p>' + (p.credit ? '<p class="case-credit">' + esc(p.credit) + '</p>' : '')) +
      sec('Architecture', figure(p.figure, p.index, true) + kv(s.architecture)) +
      sec('Key decisions', '<ol class="decisions">' + s.decisions.map(function (d) {
        return '<li><h4>' + esc(d.t) + '</h4><p>' + esc(d.d) + '</p></li>';
      }).join('') + '</ol>') +
      (shots.length ? sec('Screenshots', '<div class="shots">' + shots.map(shot).join('') + '</div>') : '') +
      sec('Stack', kv(s.stack)) +
      sec(s.outcomeTitle || 'Status and results', '<ul class="bullets">' + s.outcome.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>') +
      '<footer class="case-foot">' +
        '<div class="case-links">' + projectLinks(p) + '</div>' +
        '<button class="btn btn--ghost" type="button" data-case="' + esc(next.id) + '" data-case-replace>Next: ' + esc(next.name) + ' ' + icon('arrow-r', 'i--move-r') + '</button>' +
      '</footer>';
  }

  /* ---------------------------------------------------------------- */
  /* Smaller lists                                                    */
  /* ---------------------------------------------------------------- */

  function experienceHTML(x) {
    return '<li class="' + tone(x).trim() + '" data-reveal>' +
      '<p class="xp-when">' + esc(x.dates) + '</p>' +
      '<div>' + (x.type ? '<span class="xp-type">' + esc(x.type) + '</span>' : '') +
      '<h3 class="xp-role">' + esc(x.role) + (x.grade ? ' <span class="xp-grade">' + esc(x.grade) + '</span>' : '') + '</h3>' +
      '<p class="xp-org">' + esc(x.org) + (x.location ? ' · ' + esc(x.location) : '') + '</p>' +
      (x.points && x.points.length
        ? '<ul class="bullets">' + x.points.map(function (pt) { return '<li>' + esc(pt) + '</li>'; }).join('') + '</ul>'
        : '') + '</div>' +
    '</li>';
  }

  function render() {
    var el;
    if ((el = $('#projects')) && D.projects) el.innerHTML = D.projects.map(projectHTML).join('');
    if ((el = $('#more-list')) && D.more) el.innerHTML = D.more.map(moreHTML).join('');
    if ((el = $('#experience-list')) && D.experience) el.innerHTML = D.experience.map(experienceHTML).join('');
    if ((el = $('#stats-list')) && D.stats) {
      el.innerHTML = D.stats.map(function (s) {
        return '<li class="stat' + tone(s) + '" data-reveal><span class="stat-n">' + esc(s.n) + '</span>' +
          '<span class="stat-k">' + esc(s.k) + '</span><span class="stat-d">' + esc(s.d) + '</span></li>';
      }).join('');
    }
    if ((el = $('#skills-list')) && D.skills) {
      el.innerHTML = D.skills.map(function (r) {
        return '<div class="skill-row' + tone(r) + '" data-reveal><h3 class="skill-k">' + esc(r.k) + '</h3>' + chips(r.v) + '</div>';
      }).join('');
    }
    if ((el = $('#certificates-list')) && D.certificates) {
      el.innerHTML = D.certificates.map(function (c) {
        var cap = c.t + ', ' + c.by;
        return '<li data-reveal><button type="button" class="cert-card" data-zoom="' + esc(c.img) + '" data-alt="Certificate: ' + esc(cap) + '" data-caption="' + esc(cap) + '">' +
          '<span class="cert-img"><img src="' + esc(c.thumb || c.img) + '" alt="" width="720" height="540" loading="lazy" decoding="async">' +
            '<span class="cert-zoom">' + icon('expand') + '</span></span>' +
          '<span class="cert-info"><span class="cert-t">' + esc(c.t) + '</span>' +
            '<span class="cert-by">' + esc(c.by) + ' · ' + esc(c.d) + '</span></span>' +
          '<span class="sr-only">View certificate full size</span>' +
        '</button></li>';
      }).join('');
    }
  }

  /* ---------------------------------------------------------------- */
  /* Interactions                                                     */
  /* ---------------------------------------------------------------- */

  function initTheme() {
    var btn = $('#theme-toggle');
    var meta = $('#theme-color');
    function apply(t, persist) {
      root.dataset.theme = t;
      if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      if (meta) meta.setAttribute('content', t === 'dark' ? '#111110' : '#f8f5ef');
      if (persist) { try { localStorage.setItem('theme', t); } catch (e) {} }
    }
    apply(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
    if (btn) btn.addEventListener('click', function () { apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true); });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) {
        var saved; try { saved = localStorage.getItem('theme'); } catch (err) {}
        if (!saved) apply(e.matches ? 'dark' : 'light', false);
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
  }

  function initNav() {
    var nav = $('.nav');
    var links = $$('.nav-links a');
    var targets = links.map(function (a) { return $(a.getAttribute('href')); });
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle('is-stuck', y > 8);
      var line = y + window.innerHeight * 0.35;
      var current = -1;
      targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top + y <= line) current = i; });
      // At the very bottom the last section may be too short to cross the line.
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = targets.length - 1;
      links.forEach(function (a, i) {
        if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function initReveal() {
    var items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    root.classList.add('has-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Native <dialog> gives focus trapping, Esc to close and focus return. */
  function initDialogs() {
    var menu = $('#menu'), caseDlg = $('#case'), box = $('#lightbox');
    var caseBody = $('#case-body'), caseScroll = $('#case-scroll'), kicker = $('#case-kicker');
    var ownsHistory = false;   // true while the open case study holds a #case-… URL

    // Give the URL back when the case study closes. Runs once per open,
    // whichever way it was closed (button, backdrop, Esc or the Back button).
    function releaseHistory() {
      if (!ownsHistory) return;
      ownsHistory = false;
      if (history.state && history.state.caseStudy) history.back();
      else if (caseId()) history.replaceState(null, '', location.pathname + location.search);
    }

    function shut(d) {
      d.close();
      if (d === caseDlg) releaseHistory();
    }

    $$('dialog').forEach(function (d) {
      // Click on the backdrop closes.
      d.addEventListener('click', function (e) { if (e.target === d) shut(d); });
      $$('[data-close]', d).forEach(function (b) { b.addEventListener('click', function () { shut(d); }); });
    });

    // Mobile menu
    var menuBtn = $('#menu-open');
    if (menu && menuBtn) {
      menuBtn.addEventListener('click', function () { menu.showModal(); });
      $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.close(); }); });
    }

    // Case studies
    function caseId() { var m = /^#case-([\w-]+)$/.exec(location.hash); return m ? m[1] : null; }
    function find(id) { return (D.projects || []).filter(function (p) { return p.id === id; })[0]; }

    function openCase(id, mode) {
      var p = find(id);
      if (!p || !caseDlg) return;
      caseBody.className = 'case' + tone(p);      // the panel takes the project's colours
      caseBody.innerHTML = caseHTML(p);
      if (kicker) kicker.textContent = 'Case study ' + p.index + ' of ' + (D.projects.length < 10 ? '0' : '') + D.projects.length;
      if (!caseDlg.open) caseDlg.showModal();
      caseScroll.scrollTop = 0;
      ownsHistory = true;
      if (mode === 'push') history.pushState({ caseStudy: id }, '', '#case-' + id);
      else if (mode === 'replace') history.replaceState(history.state, '', '#case-' + id);
    }

    if (caseDlg) {
      caseDlg.addEventListener('cancel', releaseHistory);   // Esc
      caseDlg.addEventListener('close', releaseHistory);    // anything else

      window.addEventListener('popstate', function () {
        var id = caseId();
        if (id) openCase(id, null);
        else if (caseDlg.open) { ownsHistory = false; caseDlg.close(); }
      });

      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-case]') : null;
        if (!t) return;
        openCase(t.getAttribute('data-case'), t.hasAttribute('data-case-replace') ? 'replace' : 'push');
      });

      if (caseId()) openCase(caseId(), null);
    }

    // Lightbox
    var img = $('#lightbox-img'), cap = $('#lightbox-cap');
    if (box && img) {
      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-zoom]') : null;
        if (!t) return;
        img.src = t.getAttribute('data-zoom');
        img.alt = t.getAttribute('data-alt') || '';
        cap.textContent = t.getAttribute('data-caption') || '';
        box.showModal();
      });
    }
  }

  function initCopy() {
    var status = $('#copy-status');
    $$('[data-copy]').forEach(function (btn) {
      var label = $('[data-copy-label]', btn);
      var original = label ? label.textContent : '';
      var use = $('use', btn);
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var done = function (ok) {
          if (label) label.textContent = ok ? 'Copied' : 'Press Ctrl+C to copy';
          if (use && ok) use.setAttribute('href', '#i-check');
          if (status) status.textContent = ok ? 'Email address copied to clipboard' : '';
          setTimeout(function () {
            if (label) label.textContent = original;
            if (use) use.setAttribute('href', '#i-copy');
            if (status) status.textContent = '';
          }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else { done(false); }
      });
    });
  }

  render();
  initTheme();
  initNav();
  initReveal();
  initDialogs();
  initCopy();
})();
