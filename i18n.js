// Language switch (English / Spanish).
// Default language, in order: the visitor's saved choice, the country they
// are visiting from (via /api/geo), the browser language, English.
// English lives in the HTML; this file holds the Spanish strings.
(() => {
  const ES = {
    'meta.title': 'JayBuddies · Todo tu show en un solo lugar',
    'meta.description': 'JayBuddies es un conjunto de aplicaciones abiertas para sonido, iluminación y visual: VJBuddy, DJBuddy, LJBuddy, SJBuddy y CJBuddy.',
    'nav.future': 'Futuro',
    'hero.title': 'Todo tu show<br>en <span class="amber">un solo lugar</span>',
    'hero.lead': 'Un conjunto de aplicaciones para sonido, iluminación y visual. Herramientas abiertas para que todo tu show viva en el mismo sitio.',
    'hero.apps': 'Ver las apps',
    'hero.idea': 'La idea',
    'area.sound': 'Sonido',
    'area.lighting': 'Iluminación',
    'area.visuals': 'Visual',
    'apps.title': 'Las apps',
    'apps.jays': 'Cada app es un Jay: VJ, DJ, LJ, SJ y CJ. Juntas son los JayBuddies.',
    'apps.vj': 'Una herramienta para VJs.',
    'apps.dj': 'Una herramienta para DJs.',
    'apps.lj': 'Un programa para controlar iluminación mediante DMX.',
    'apps.sj': 'Un programa para manejar múltiples entradas y salidas de sonido.',
    'apps.cj': 'Un software para el director de cámaras.',
    'status.soon': 'Próximamente',
    'status.dev': 'En desarrollo',
    'btn.github': 'Abrir en GitHub',
    'btn.demo': 'Ver demo',
    'idea.title': 'Una alternativa abierta',
    'idea.text': 'JayBuddies <strong>no pretende reemplazar a la industria</strong>. Pretende crear una alternativa abierta y llena de opciones para unir algo que a veces es difícil de lograr:',
    'idea.coordination': 'Coordinación',
    'idea.connection': 'Vinculación',
    'future.title': 'Todas conectadas',
    'future.lead': 'En el futuro, las apps se van a conectar entre sí para funcionar juntas, como un solo sistema.',
    'future.map': 'Las cinco apps conectadas a JayBuddies',
    'footer.areas': 'Sonido · Iluminación · Visual',
  };
  const SPANISH_COUNTRIES = new Set(['AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE']);
  const KEY = 'jaybuddies.lang', GEO_KEY = 'jaybuddies.geo';
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // Remember the English originals the first time each element is seen.
  const EN = new Map();
  const nodes = () => document.querySelectorAll('[data-i18n], [data-i18n-attr]');

  function apply(lang) {
    for (const el of nodes()) {
      const key = el.dataset.i18n, attr = el.dataset.i18nAttr;
      if (!EN.has(el)) EN.set(el, attr ? el.getAttribute(attr) : el.innerHTML);
      const text = lang === 'es' && ES[key] !== undefined ? ES[key] : EN.get(el);
      if (attr) el.setAttribute(attr, text); else el.innerHTML = text;
    }
    if (!EN.has(document)) EN.set(document, document.title);
    document.title = lang === 'es' ? ES['meta.title'] : EN.get(document);
    root.lang = lang;
    for (const b of document.querySelectorAll('[data-lang]')) b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    root.classList.remove('i18n-pending');
  }

  const fromBrowser = () => ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
  const fromCountry = c => (SPANISH_COUNTRIES.has(c) ? 'es' : 'en');

  function start() {
    for (const b of document.querySelectorAll('[data-lang]')) {
      b.addEventListener('click', () => { store.set(KEY, b.dataset.lang); apply(b.dataset.lang); });
    }
    const saved = store.get(KEY);
    if (saved === 'es' || saved === 'en') return apply(saved);
    const country = store.get(GEO_KEY);
    if (country) return apply(fromCountry(country));

    // First visit: ask where the visitor is. If the answer is slow or
    // unavailable, fall back to the browser language so the page never hangs.
    let done = false;
    const finish = lang => { if (!done) { done = true; apply(lang); } };
    const timer = setTimeout(() => finish(fromBrowser()), 700);
    fetch('/api/geo', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(({ country }) => {
        if (!country) throw 0;
        store.set(GEO_KEY, country);
        clearTimeout(timer);
        // A late answer still wins unless the visitor already picked a language.
        if (!store.get(KEY)) { done = true; apply(fromCountry(country)); }
      })
      .catch(() => { clearTimeout(timer); finish(fromBrowser()); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
