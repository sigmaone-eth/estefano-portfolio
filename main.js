(function () {
  'use strict';

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var Lenis = window.Lenis;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = getComputedStyle(document.documentElement);
  var color = {
    bg: css.getPropertyValue('--bg').trim(),
    surface: css.getPropertyValue('--surface').trim(),
    text: css.getPropertyValue('--text').trim(),
    line: css.getPropertyValue('--line').trim(),
    accentText: css.getPropertyValue('--accent-text').trim(),
    accentRgb: '255, 106, 51'
  };

  // Free-to-use test images (credits in the footer). 01–05 are the real pieces, 06–10 test cards.
  var PIECES = [
    { n: '01', kind: 'Reel', year: '2026', title: 'Gesture driven collage', img: 'assets/work/01.jpg', href: 'https://www.instagram.com/reel/DbE_e8vRxvb/' },
    { n: '02', kind: 'Reel', year: '2026', title: 'Room scan study', img: 'assets/work/02.jpg', href: 'https://www.instagram.com/reel/DSBotMuDAzJ/' },
    { n: '03', kind: 'Reel', year: '2026', title: 'Signal portrait', img: 'assets/work/03.jpg', href: 'https://www.instagram.com/reel/DTHMGqrDNI2/' },
    { n: '04', kind: 'Visual diary', year: '2026', title: 'Real time interactive screen', img: 'assets/work/04.jpg', href: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MzQ4MDI1MzM2MjY5MDAz?story_media_id=3986517951536821931&stkn=MTRyOTJ2a2lxN2VzdA==' },
    { n: '05', kind: 'Visual diary', year: '2026', title: 'Steel tongue in light', img: 'assets/work/05.jpg', href: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MTI0OTE2NjE3Njk3MDYy?story_media_id=3972695447919757193&stkn=MXFqNmRwN3U0eDRocw==' },
    { n: '06', kind: 'Test card', year: '2026', title: '[ Piece 06 ]', img: 'assets/work/06.jpg', href: '' },
    { n: '07', kind: 'Test card', year: '2026', title: '[ Piece 07 ]', img: 'assets/work/07.jpg', href: '' },
    { n: '08', kind: 'Test card', year: '2026', title: '[ Piece 08 ]', img: 'assets/work/08.jpg', href: '' },
    { n: '09', kind: 'Test card', year: '2026', title: '[ Piece 09 ]', img: 'assets/work/09.jpg', href: '' },
    { n: '10', kind: 'Test card', year: '2026', title: '[ Piece 10 ]', img: 'assets/work/10.jpg', href: '' }
  ].map(function (d) {
    var initials = d.title.replace(/[^A-Za-z0-9 ]/g, '').split(' ').map(function (w) { return w.charAt(0); }).join('').toUpperCase();
    d.code = 'EG-' + d.n + ' ' + initials;
    d.meta = 'CH ' + d.n + ' — ' + d.kind + ' — ' + d.year;
    return d;
  });
  var TRAIL = ['01', '09', '02', '03', '04', '05', '06', '07', '08'].map(function (n) { return 'assets/work/' + n + '.jpg'; });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(x) { var v = Math.sin(x) * 43758.5453; return v - Math.floor(v); }
  // Element-local pointer position (handles any CSS scaling of the element).
  function local(el, e) {
    var r = el.getBoundingClientRect(), k = r.width / (el.offsetWidth || r.width || 1);
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k, k: k, r: r };
  }

  /* ---------------------------------------------------------------- Lenis + GSAP */
  var lenis = null;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!reduce && Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true, autoRaf: !gsap });
    if (gsap) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      if (ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* ---------------------------------------------------------------- Headline reveal */
  if (gsap && !reduce) {
    gsap.from('.headline .word > span', { yPercent: 110, duration: 0.8, ease: 'power4.out', stagger: 0.05, delay: 0.1 });
  }

  /* ---------------------------------------------------------------- Ticker (scroll velocity) */
  (function ticker() {
    var track = document.querySelector('.ticker-track');
    if (!track || !gsap || !ScrollTrigger || reduce) return;
    track.classList.add('gsap');
    var loop = gsap.to(track, { xPercent: -50, repeat: -1, duration: 36, ease: 'none' });
    var skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3.out' });
    var settle;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (st) {
        var v = st.getVelocity(), dir = v < 0 ? -1 : 1;
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 400, 5)), duration: 0.2, overwrite: true });
        skewTo(clamp(-v / 300, -6, 6));
        clearTimeout(settle);
        settle = setTimeout(function () {
          skewTo(0);
          gsap.to(loop, { timeScale: dir, duration: 0.8, overwrite: true });
        }, 120);
      }
    });
  })();

  /* ---------------------------------------------------------------- Magnet buttons */
  if (canHover && !reduce && gsap) {
    document.querySelectorAll('.magnet').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.25, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.4, ease: 'power3.out', overwrite: true });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power3.out', overwrite: true });
      });
    });
  }

  /* ---------------------------------------------------------------- Cursor grid */
  (function cursorGrid() {
    var cv = document.querySelector('.grid-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d'), size = 56, w = 0, h = 0, active = {}, looping = false;
    function draw() {
      var sy = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(242,239,233,.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var x = 0; x <= w; x += size) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, h); }
      for (var y = -(sy % size); y <= h; y += size) { ctx.moveTo(0, y + .5); ctx.lineTo(w, y + .5); }
      ctx.stroke();
      for (var key in active) {
        var p = key.split(','), cx = +p[0] * size, cy = +p[1] * size - sy, a = active[key];
        if (cy < -size || cy > h) continue;
        ctx.fillStyle = 'rgba(' + color.accentRgb + ', ' + (a * 0.07).toFixed(3) + ')';
        ctx.fillRect(cx + 1, cy + 1, size - 1, size - 1);
        ctx.strokeStyle = 'rgba(' + color.accentRgb + ', ' + (a * 0.55).toFixed(3) + ')';
        ctx.strokeRect(cx + .5, cy + .5, size, size);
      }
    }
    function loop() {
      var any = false;
      for (var key in active) {
        active[key] *= reduce ? 0 : 0.93;
        if (active[key] < 0.02) delete active[key]; else any = true;
      }
      draw();
      looping = any;
      if (any) requestAnimationFrame(loop);
    }
    function resize() { w = window.innerWidth; h = window.innerHeight; cv.width = w; cv.height = h; draw(); }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', function () { if (!looping) draw(); }, { passive: true });
    if (canHover) {
      window.addEventListener('mousemove', function (e) {
        var c = Math.floor(e.clientX / size), r = Math.floor((e.clientY + window.scrollY) / size);
        for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) {
          var k = (c + dc) + ',' + (r + dr);
          active[k] = Math.max(active[k] || 0, dc === 0 && dr === 0 ? 1 : 0.3);
        }
        if (!looping) { looping = true; requestAnimationFrame(loop); }
      }, { passive: true });
    }
  })();

  /* ---------------------------------------------------------------- Click spark (portfolio) */
  (function clickSpark() {
    var cv = document.querySelector('.spark-canvas'), zone = document.getElementById('work');
    if (!cv || !zone || reduce) return;
    var ctx = cv.getContext('2d'), sparks = [], w = 0, h = 0, running = false;
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function frame(now) {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color.accentText; ctx.lineWidth = 2; ctx.lineCap = 'round';
      sparks = sparks.filter(function (s) {
        var t = (now - s.start) / 400;
        if (t >= 1) return false;
        var e = 1 - Math.pow(1 - t, 3), d = 6 + e * 26, len = 12 * (1 - e);
        ctx.beginPath();
        ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d);
        ctx.lineTo(s.x + Math.cos(s.a) * (d + len), s.y + Math.sin(s.a) * (d + len));
        ctx.stroke();
        return true;
      });
      running = sparks.length > 0;
      if (running) requestAnimationFrame(frame);
    }
    size();
    window.addEventListener('resize', size);
    zone.addEventListener('pointerdown', function (e) {
      var now = performance.now();
      for (var i = 0; i < 8; i++) sparks.push({ x: e.clientX, y: e.clientY, a: i / 8 * Math.PI * 2, start: now });
      if (!running) { running = true; requestAnimationFrame(frame); }
    });
  })();

  /* ---------------------------------------------------------------- Hero: face square + image trail */
  (function hero() {
    var panel = document.querySelector('.face-panel');
    if (!panel) return;
    var trail = panel.querySelector('.trail'), last = null, pick = 0, toggle = panel.querySelector('.face-toggle');
    function dropStill(x, y) {
      if (reduce) return;
      var img = new Image();
      img.src = TRAIL[pick = (pick + 1) % TRAIL.length];
      img.alt = '';
      img.style.left = x + 'px';
      img.style.top = y + 'px';
      img.addEventListener('animationend', function () { img.remove(); });
      trail.appendChild(img);
      while (trail.children.length > 14) trail.firstChild.remove();
    }
    if (canHover) {
      // The square only shows near the head (its own box plus an 8% margin); the trail runs elsewhere.
      panel.addEventListener('mousemove', function (e) {
        var p = local(panel, e), W = panel.offsetWidth, top = panel.offsetHeight * 0.32, m = W * 0.08;
        var near = p.x > W * 0.315 - m && p.x < W * 0.685 + m && p.y > top - m && p.y < top + W * 0.37 + m;
        panel.classList.toggle('face-on', near);
        if (near) return;
        if (last && Math.abs(p.x - last.x) + Math.abs(p.y - last.y) < 70) return;
        last = { x: p.x, y: p.y };
        dropStill(p.x, p.y);
      });
      panel.addEventListener('mouseleave', function () { panel.classList.remove('face-on'); });
    }
    if (toggle) {
      toggle.addEventListener('click', function () {
        var on = !panel.classList.contains('face-on');
        panel.classList.toggle('face-on', on);
        toggle.textContent = on ? 'HIDE ×' : 'TAP TO REVEAL';
        if (on) for (var n = 0; n < 5; n++) dropStill(panel.offsetWidth * (.25 + Math.random() * .5), panel.offsetHeight * (.7 + Math.random() * .2));
      });
    }
  })();

  /* ---------------------------------------------------------------- Dither veil: live code portrait */
  // The portrait is ordered-dithered into 0 / 1 / $ characters by brightness. The characters keep
  // re-rolling and a "typing" band sweeps down the frame rewriting each line, so it reads like code
  // being written. The cursor burns through to the photo, which knits back cell by cell.
  (function ditherVeil() {
    var cv = document.querySelector('.dither');
    if (!cv) return;
    var ctx = cv.getContext('2d'), img = new Image();
    var cell = 8, cols = 0, rows = 0, lum, alpha, glyph, heat, rate, live = {}, fitBox;
    var bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    var fresh, freshLive = {}, spanL, spanR, writers = [], lastTick = 0, lastT = 0, visible = true, running = false;

    // Square frame: fill the width, start 27% down the photo (trims the empty top, keeps the torso).
    function fit(iw, ih, W, H) {
      var k = Math.max(W / iw, H / ih), fw = iw * k, fh = ih * k;
      return { x: (W - fw) / 2, y: -Math.min(fh - H, fh * 0.27), w: fw, h: fh };
    }
    function roll(l) {
      var r = Math.random();
      if (l > 0.62) return r < 0.6 ? '$' : r < 0.9 ? '1' : '0';
      if (l > 0.38) return r < 0.6 ? '1' : r < 0.85 ? '0' : '$';
      return r < 0.7 ? '0' : '1';
    }
    function paint(i, hot) {
      var c = i % cols, r = (i / cols) | 0, x = c * cell, y = r * cell, hv = heat[i];
      var on = lum[i] > (bayer[(r % 4) * 4 + (c % 4)] + .5) / 16;
      ctx.globalAlpha = 1;
      ctx.fillStyle = color.surface;
      ctx.fillRect(x, y, cell, cell);
      if (hv < 1) {
        ctx.globalAlpha = 1 - hv;
        hot = hot || fresh[i] > 0;
        if (on) {
          ctx.fillStyle = hot ? color.text : color.accentText;
          ctx.fillText(glyph[i], x + cell / 2, y + cell / 2 + .5);
        } else if (alpha[i] > 0.1) {
          ctx.fillStyle = hot ? 'rgba(242,239,233,.45)' : color.line;
          ctx.fillText(glyph[i] === '$' ? '0' : glyph[i], x + cell / 2, y + cell / 2 + .5);
        }
      }
      if (hv > 0) {
        ctx.globalAlpha = Math.min(1, hv * 1.4);
        ctx.drawImage(img, (x - fitBox.x) / fitBox.w * img.naturalWidth, (y - fitBox.y) / fitBox.h * img.naturalHeight,
          cell / fitBox.w * img.naturalWidth, cell / fitBox.h * img.naturalHeight, x, y, cell, cell);
      }
      ctx.globalAlpha = 1;
    }
    // Typing cursors: each writes a code-like line (random indent and length) inside the figure, then moves down.
    function newLine(w) {
      for (var tries = 0; tries < rows; tries++) {
        w.r = (w.r + 1) % rows;
        if (spanR[w.r] - spanL[w.r] > 3) break;
      }
      var L = spanL[w.r], R = spanR[w.r];
      w.c = Math.min(R - 1, L + Math.floor(Math.random() * 4) * 2);
      w.end = Math.min(R, w.c + 4 + Math.floor(Math.random() * (R - w.c)));
    }
    function caret(w) {
      if (w.r >= rows || w.c >= cols) return;
      ctx.fillStyle = color.text;
      ctx.fillRect(w.c * cell + 1, w.r * cell + 1, cell - 2, cell - 2);
    }
    function type(w, n) {
      w.acc += n;
      while (w.acc >= 1) {
        w.acc--;
        var i = w.r * cols + w.c;
        glyph[i] = roll(lum[i]);
        fresh[i] = 1; freshLive[i] = true;
        paint(i, false);
        w.c++;
        if (w.c >= w.end) newLine(w);
      }
      caret(w);
    }
    function build() {
      var w = cv.offsetWidth, h = cv.offsetHeight;
      if (!w || !h || !img.naturalWidth) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = "700 9px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
      fitBox = fit(img.naturalWidth, img.naturalHeight, w, h);
      var off = document.createElement('canvas');
      off.width = cols; off.height = rows;
      var octx = off.getContext('2d'), g = fit(img.naturalWidth, img.naturalHeight, cols, rows);
      octx.drawImage(img, g.x, g.y, g.w, g.h);
      var n = cols * rows, d = octx.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(n); alpha = new Float32Array(n); glyph = new Array(n);
      heat = new Float32Array(n); rate = new Float32Array(n); live = {};
      fresh = new Float32Array(n); freshLive = {};
      spanL = new Int16Array(rows); spanR = new Int16Array(rows);
      for (var i = 0; i < n; i++) {
        alpha[i] = d[i * 4 + 3] / 255;
        lum[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255 * alpha[i];
        glyph[i] = lum[i] > 0.62 ? '$' : lum[i] > 0.38 ? '1' : '0';
        rate[i] = 0.955 + Math.random() * 0.032;
      }
      for (var y = 0; y < rows; y++) {
        var L = -1, R = -1;
        for (var x = 0; x < cols; x++) if (alpha[y * cols + x] > 0.1) { if (L < 0) L = x; R = x + 1; }
        spanL[y] = Math.max(0, L); spanR[y] = Math.max(0, R);
      }
      writers = [];
      for (var wn = 0; wn < (reduce ? 1 : 3); wn++) {
        var wr = { r: Math.floor(rows * (0.2 + wn * 0.27)), c: 0, end: 0, acc: 0 };
        newLine(wr);
        writers.push(wr);
      }
      for (var j = 0; j < n; j++) paint(j, false);
      start();
    }
    function frame(now) {
      running = false;
      if (!visible || !heat) return;
      var dt = Math.min(64, now - (lastT || now));
      lastT = now;
      // Burn: hot cells cool at their own rates.
      for (var key in live) {
        var i = +key;
        heat[i] *= rate[i];
        if (heat[i] < 0.04) { heat[i] = 0; delete live[key]; }
        paint(i, false);
      }
      // Code runs all the time (slower and calmer with reduced motion): freshly typed characters glow, then settle...
      for (var fk in freshLive) {
        var f = +fk;
        fresh[f] -= dt * 0.0022;
        if (fresh[f] <= 0) { fresh[f] = 0; delete freshLive[fk]; paint(f, false); }
      }
      // ...cursors type new lines...
      for (var wi = 0; wi < writers.length; wi++) type(writers[wi], dt * (reduce ? 0.012 : 0.045));
      // ...and scattered characters keep flipping.
      if (now - lastTick > (reduce ? 400 : 70)) {
        lastTick = now;
        var count = Math.floor(cols * rows * (reduce ? 0.006 : 0.03));
        for (var k = 0; k < count; k++) {
          var idx = (Math.random() * cols * rows) | 0;
          glyph[idx] = roll(lum[idx]);
          paint(idx, false);
        }
        for (var wc = 0; wc < writers.length; wc++) caret(writers[wc]);
      }
      start();
    }
    function start() {
      if (running || !visible || !heat) return;
      running = true;
      requestAnimationFrame(frame);
    }
    function burn(e) {
      if (!heat) return;
      var p = local(cv, e), cx = p.x / cell, cy = p.y / cell, rad = 5;
      for (var r = Math.floor(cy - rad); r <= cy + rad; r++) {
        for (var c = Math.floor(cx - rad); c <= cx + rad; c++) {
          if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
          var d = Math.hypot(c + .5 - cx, r + .5 - cy);
          if (d > rad) continue;
          var i = r * cols + c, v = 1 - d / rad;
          if (v > heat[i]) { heat[i] = v; live[i] = true; }
        }
      }
      start();
    }
    cv.addEventListener('pointermove', burn);
    if (!canHover) document.querySelector('.dither-hint').textContent = 'Drag across to burn through to the photo';
    img.onload = build;
    img.src = 'assets/img/portrait.webp';
    new ResizeObserver(build).observe(cv);
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; lastT = 0; start(); }).observe(cv);
  })();

  /* ---------------------------------------------------------------- Crosshair (portfolio header) */
  (function crosshair() {
    var head = document.querySelector('.work-head');
    if (!head || !canHover || !gsap) return;
    head.classList.add('crosshair-on');
    var H = head.querySelector('.cross-h'), V = head.querySelector('.cross-v'), box = head.querySelector('.cross-box'), lab = head.querySelector('.cross-label');
    function to(el, vars) {
      if (reduce) gsap.set(el, vars);
      else gsap.to(el, Object.assign({ duration: 0.22, ease: 'power3.out', overwrite: 'auto' }, vars));
    }
    function pad4(n) { return ('000' + Math.max(0, Math.round(n))).slice(-4); }
    // Keep the readout inside the header: flip above / left near the bottom / right edge.
    function place(lx, below, above, left) {
      var W = head.offsetWidth, Hh = head.offsetHeight, lw = lab.offsetWidth, lh = lab.offsetHeight;
      var px = lx + lw > W - 4 ? (left != null ? left - lw : W - 4 - lw) : lx;
      var py = below + lh > Hh - 4 ? above - lh : below;
      return { x: Math.max(4, px), y: Math.max(4, py) };
    }
    head.addEventListener('mousemove', function (e) {
      var p = local(head, e), pad = 8;
      var t = e.target.closest('[data-crosshair]');
      if (t && !head.contains(t)) t = null;
      if (t) {
        var tr = t.getBoundingClientRect();
        var bx = (tr.left - p.r.left) / p.k, by = (tr.top - p.r.top) / p.k, bw = tr.width / p.k, bh = tr.height / p.k;
        to(H, { y: by + bh / 2, opacity: 1 });
        to(V, { x: bx + bw / 2, opacity: 1 });
        to(box, { x: bx - pad, y: by - pad, width: bw + pad * 2, height: bh + pad * 2, opacity: 1 });
        lab.textContent = 'W ' + Math.round(bw) + ' × H ' + Math.round(bh);
        var s = place(bx - pad, by + bh + pad + 6, by - pad - 6);
        to(lab, { x: s.x, y: s.y, opacity: 1 });
      } else {
        to(H, { y: p.y, opacity: 1 });
        to(V, { x: p.x, opacity: 1 });
        to(box, { x: p.x - 10, y: p.y - 10, width: 20, height: 20, opacity: 0 });
        lab.textContent = 'X ' + pad4(p.x) + '  Y ' + pad4(p.y);
        var f = place(p.x + 14, p.y + 14, p.y - 14, p.x - 14);
        to(lab, { x: f.x, y: f.y, opacity: 1 });
      }
    });
    head.addEventListener('mouseleave', function () { [H, V, box, lab].forEach(function (el) { to(el, { opacity: 0 }); }); });
  })();

  /* ---------------------------------------------------------------- Decrypted text */
  var flickers = new WeakMap();
  function flicker(el, text) {
    var prev = flickers.get(el);
    if (prev) cancelAnimationFrame(prev);
    el.setAttribute('aria-label', text);
    if (reduce) { el.textContent = text; return; }
    var glyphs = '#%&@$/<>01X*', start = null;
    function step(now) {
      if (start === null) start = now;
      var k = Math.min(1, (now - start) / 360), frame = Math.floor((now - start) / 40), locked = Math.floor(k * text.length);
      el.textContent = k >= 1 ? text : text.split('').map(function (ch, i) {
        if (ch === ' ' || i < locked) return ch;
        return glyphs.charAt(Math.floor(rnd((i + 1) * 12.9898 + frame * 78.233) * glyphs.length));
      }).join('');
      if (k < 1) flickers.set(el, requestAnimationFrame(step)); else flickers.delete(el);
    }
    flickers.set(el, requestAnimationFrame(step));
  }

  /* ---------------------------------------------------------------- Carousel + full screen */
  (function carousel() {
    var stage = document.querySelector('.stage');
    if (!stage) return;
    var N = PIECES.length;
    var readMeta = document.querySelector('.readout-meta'), readTitle = document.querySelector('.readout-title'), readCount = document.querySelector('.readout-count');
    var sheet = document.querySelector('.sheet'), sheetBg = sheet.querySelector('.sheet-bg'), media = sheet.querySelector('.sheet-media'), mediaImg = media.querySelector('img');
    var cards = PIECES.map(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'card';
      b.setAttribute('aria-label', 'Open ' + d.title + ' full screen');
      b.innerHTML = '<span class="card-code"></span><span class="card-media"><img alt="" draggable="false"></span>';
      b.querySelector('.card-code').textContent = d.code;
      b.querySelector('img').src = d.img;
      b.addEventListener('mouseenter', function () { if (!drag) { hovering = true; setHover(i); } });
      b.addEventListener('focus', function () { setHover(i); });
      b.addEventListener('click', function () { if (moved <= 6) open(i); });
      stage.appendChild(b);
      return b;
    });

    var pos = 0, target = 0, drag = null, moved = 0, hovering = false, touched = false, hover = null, active = -1, openIdx = null, visible = true, raf = null;
    function geom() {
      return stage.offsetWidth < 760 ? { R: 760, step: 15 } : { R: 1060, step: 14 };
    }
    function spacing() { var g = geom(); return g.R * Math.sin(g.step * Math.PI / 180); }
    function mod(i) { return ((i % N) + N) % N; }
    function setHover(i) {
      hover = i;
      refreshActive();
    }
    function refreshActive() {
      var a = hover != null ? hover : mod(Math.round(pos));
      if (a === active) return;
      active = a;
      cards.forEach(function (c, i) { c.classList.toggle('active', i === a); });
      readMeta.textContent = PIECES[a].meta;
      readCount.textContent = PIECES[a].n + ' / ' + N;
      if (openIdx == null) flicker(readTitle, PIECES[a].title); else readTitle.textContent = PIECES[a].title;
    }
    function layout() {
      var g = geom();
      cards.forEach(function (c, i) {
        var dd = ((i - pos) % N + N + N / 2) % N - N / 2, th = dd * g.step * Math.PI / 180, far = Math.abs(dd);
        c.style.display = far > 4.6 ? 'none' : 'flex';
        c.style.transform = 'translate(-50%, -50%) translate3d(' + (g.R * Math.sin(th)).toFixed(1) + 'px, 0, ' + (g.R * (1 - Math.cos(th))).toFixed(1) + 'px) rotateY(' + (-dd * g.step).toFixed(2) + 'deg)';
        c.style.opacity = clamp(4.6 - far, 0, 1).toFixed(3);
        c.style.zIndex = String(100 - Math.round(far * 10));
      });
    }
    // Ease toward the target; a slow idle drift keeps the ring moving until someone touches it.
    function tick() {
      raf = null;
      var drift = !reduce && !touched && !hovering && openIdx == null && visible;
      if (!drag) {
        if (drift) target += 0.0018;
        pos += (target - pos) * (reduce ? 1 : 0.12);
      }
      var settled = Math.abs(target - pos) < 0.0005 && !drift && !drag;
      if (settled) pos = target;
      layout();
      refreshActive();
      if (!settled && visible) raf = requestAnimationFrame(tick);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function centre(i) {
      var base = Math.round(target);
      target = base + (((i - base) % N + N + N / 2) % N - N / 2);
      touched = true;
      kick();
    }

    stage.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      drag = { x: e.clientX, start: target, lastX: e.clientX, lastT: performance.now(), vel: 0 };
      moved = 0;
      touched = true;
      stage.classList.add('dragging');
    });
    stage.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x, now = performance.now();
      moved = Math.max(moved, Math.abs(dx));
      target = pos = drag.start - dx / spacing();
      drag.vel = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT) / spacing();
      drag.lastX = e.clientX;
      drag.lastT = now;
      layout();
      refreshActive();
    });
    function endDrag() {
      if (!drag) return;
      target = Math.round(target - drag.vel * 220);
      drag = null;
      stage.classList.remove('dragging');
      kick();
      setTimeout(function () { moved = 0; }, 0);
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', function () {
      hovering = false;
      hover = null;
      endDrag();
      refreshActive();
      kick();
    });
    var wheelSnap;
    stage.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      target += e.deltaX / spacing();
      touched = true;
      clearTimeout(wheelSnap);
      wheelSnap = setTimeout(function () { target = Math.round(target); kick(); }, 140);
      kick();
    }, { passive: false });
    document.querySelector('.car-prev').addEventListener('click', function () { target = Math.round(target) - 1; touched = true; kick(); });
    document.querySelector('.car-next').addEventListener('click', function () { target = Math.round(target) + 1; touched = true; kick(); });
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; if (visible) kick(); }).observe(stage);
    if (!canHover) document.querySelector('.readout-hint').textContent = 'Swipe · tap to open';
    window.addEventListener('resize', layout);

    /* Full screen: the clicked card flies up to fill the screen; Back flies it home. */
    function fill(i, animate) {
      var d = PIECES[i];
      mediaImg.src = d.img;
      mediaImg.alt = 'Still for ' + d.title;
      sheet.querySelector('.sheet-code').textContent = d.code + ' · ' + d.n + ' / ' + N;
      sheet.querySelector('.sheet-meta').textContent = d.meta;
      sheet.querySelector('.fact-year').textContent = d.year;
      sheet.querySelector('.fact-kind').textContent = d.kind;
      var watch = sheet.querySelector('.sheet-watch');
      watch.hidden = !d.href;
      if (d.href) watch.href = d.href;
      flicker(sheet.querySelector('.sheet-title'), d.title);
      flicker(sheet.querySelector('.sheet-nav-title'), d.title);
      if (animate && gsap && !reduce) gsap.fromTo(mediaImg, { opacity: 0.4, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' });
    }
    function rectOf(i) { return cards[i].querySelector('.card-media').getBoundingClientRect(); }
    function open(i) {
      var from = rectOf(i);
      openIdx = i;
      touched = true;
      fill(i, false);
      sheet.hidden = false;
      cards[i].style.visibility = 'hidden';
      if (lenis) lenis.stop();
      document.documentElement.style.overflow = 'hidden';
      sheet.querySelector('.sheet-back').focus({ preventScroll: true });
      if (!gsap || reduce) return;
      var to = media.getBoundingClientRect();
      gsap.fromTo(media,
        { x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height, transformOrigin: '0 0', borderRadius: 8 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 10, duration: 0.6, ease: 'power3.inOut' });
      gsap.fromTo(sheetBg, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(sheet.querySelectorAll('[data-reveal]'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.04, delay: 0.35 });
    }
    function finishClose(i) {
      sheet.hidden = true;
      cards[i].style.visibility = '';
      gsap && gsap.set([media, sheetBg].concat(Array.prototype.slice.call(sheet.querySelectorAll('[data-reveal]'))), { clearProps: 'all' });
      openIdx = null;
      if (lenis) lenis.start();
      document.documentElement.style.overflow = '';
      cards[i].focus({ preventScroll: true });
      kick();
    }
    function close() {
      var i = openIdx;
      if (i == null) return;
      if (!gsap || reduce) { finishClose(i); return; }
      var to = media.getBoundingClientRect(), from = rectOf(i);
      gsap.to(sheet.querySelectorAll('[data-reveal]'), { opacity: 0, duration: 0.15 });
      gsap.to(sheetBg, { opacity: 0, duration: 0.35, delay: 0.15, ease: 'power2.in' });
      gsap.to(media, {
        x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height,
        transformOrigin: '0 0', borderRadius: 8, duration: 0.5, ease: 'power3.inOut',
        onComplete: function () { finishClose(i); }
      });
    }
    function step(dir) {
      if (openIdx == null) return;
      cards[openIdx].style.visibility = '';
      openIdx = mod(openIdx + dir);
      cards[openIdx].style.visibility = 'hidden';
      centre(openIdx);
      fill(openIdx, true);
    }
    sheet.querySelector('.sheet-back').addEventListener('click', close);
    sheet.querySelector('.sheet-prev').addEventListener('click', function () { step(-1); });
    sheet.querySelector('.sheet-next').addEventListener('click', function () { step(1); });
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });

    layout();
    refreshActive();
    kick();
  })();
})();
