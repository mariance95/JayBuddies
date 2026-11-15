// Shared helpers for the JayBuddies app UI previews. These pages are static
// mockups: nothing here controls real audio, video or lighting.
const UI = (() => {
  const APPS = { vj: 'Visuals', dj: 'Sound', lj: 'Lighting', sj: 'Sound', cj: 'Visuals' };

  // Tiny element builder: h('div.cls', {attrs}, ...children)
  function h(spec, attrs, ...kids) {
    const [tag, ...cls] = spec.split('.');
    const el = document.createElement(tag || 'div');
    if (cls.length) el.className = cls.join(' ');
    if (attrs != null && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'style' && typeof v === 'object') for (const [p, x] of Object.entries(v)) el.style.setProperty(p, x);
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) el.append(k);
    return el;
  }

  // Deterministic pseudo-random numbers, so each mockup always looks the same.
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), (s ^= s >>> 16) >>> 0) / 4294967296);
  }

  const knob = (label, v, cls = '') => h('span.knob' + (cls ? '.' + cls : ''), { style: { '--v': v } }, h('i'), label);
  const fader = (v, cls = '') => h('span.fader' + (cls ? '.' + cls : ''), { style: { '--v': v } });
  const slide = (v, cls = '') => h('span.slide' + (cls ? '.' + cls : ''), { style: { '--v': v } });
  const meter = (base, cls = '') => h('span.meter' + (cls ? '.' + cls : ''), { 'data-live': base, style: { '--l': base } });
  const btn = (text, cls = '') => h('span.b' + (cls ? '.' + cls.split(' ').join('.') : ''), text);

  // Audio-style waveform drawn on a canvas.
  function wave(canvas, { seed = 1, color = '#fff', played = 0, bars = 240, dimColor = '#555' } = {}) {
    const r = rng(seed), dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, hgt = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = hgt * dpr;
    const g = canvas.getContext('2d'); g.scale(dpr, dpr);
    const bw = w / bars;
    let env = .5;
    for (let i = 0; i < bars; i++) {
      env = Math.min(1, Math.max(.12, env + (r() - .5) * .35));
      const section = .55 + .45 * Math.sin(i / bars * Math.PI * 5 + seed);
      const a = Math.max(.06, env * section * (.6 + r() * .4));
      g.fillStyle = i / bars < played ? dimColor : color;
      g.fillRect(i * bw, hgt / 2 - a * hgt / 2, Math.max(1, bw - .6), a * hgt);
    }
  }

  // Top bar with the app name, menus and links to the other previews.
  function bar(menus) {
    const app = document.body.dataset.app;
    document.body.prepend(h('header.bar',
      h('a.logo', { href: './' + app + '.html' }, h('b', app.toUpperCase()), 'Buddy'),
      h('span.menus', menus.map(m => h('span', m))),
      h('span.grow'),
      h('span.note', 'UI preview · no functions yet'),
      h('span.apps', Object.keys(APPS).map(a => h('a' + (a === app ? '.here' : ''), { href: './' + a + '.html', title: a.toUpperCase() + 'Buddy · ' + APPS[a], style: { '--a': `var(--${a})` } }, a.toUpperCase()))),
      h('a.home', { href: '../' }, 'JayBuddies ↗'),
    ));
  }

  // Makes the level meters move a little so the mockup feels alive.
  function animateMeters() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = rng(7);
    setInterval(() => {
      for (const m of document.querySelectorAll('.meter[data-live]')) {
        const base = +m.dataset.live;
        if (!base) continue;
        m.style.setProperty('--l', Math.max(0.02, Math.min(1, base + (r() - .55) * .28)).toFixed(3));
      }
    }, 110);
  }

  return { h, rng, knob, fader, slide, meter, btn, wave, bar, animateMeters };
})();
