(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* progresso de leitura: no artigo mede o texto, no hub a página */
  const bar = $('.progress span');
  const prose = $('[data-prose]');
  const onScroll = () => {
    let p;
    if (prose) {
      const r = prose.getBoundingClientRect();
      p = (innerHeight * 0.5 - r.top) / r.height;
    } else {
      const max = document.documentElement.scrollHeight - innerHeight;
      p = max > 0 ? scrollY / max : 0;
    }
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* entrada dos cards */
  const cards = $$('.post-card, .pager, .hub-cta');
  if (!reduce && 'IntersectionObserver' in window) {
    cards.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    cards.forEach(el => io.observe(el));
  }

  /* hub: busca + filtro por categoria, com estado na URL (#categoria) */
  const q = $('#q');
  if (q) {
    const chips = $$('.chip[data-filter]');
    const all = $$('.hub-list .post-card');
    const empty = $('.empty');
    const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    let cat = 'todos';
    const apply = () => {
      const terms = norm(q.value).split(/\s+/).filter(Boolean);
      let shown = 0;
      all.forEach(c => {
        const ok = (cat === 'todos' || c.dataset.cat === cat) && terms.every(t => c.dataset.search.includes(t));
        c.classList.toggle('is-hidden', !ok);
        if (ok) { shown++; c.classList.add('in'); }
      });
      // Com filtro ativo, o destaque vira um card comum para a grade não ficar com buraco.
      const feat = $('.post-card.is-featured');
      if (feat) feat.classList.toggle('as-card', cat !== 'todos' || terms.length > 0);
      empty.hidden = shown > 0;
    };
    const setCat = (c, push = true) => {
      cat = chips.some(ch => ch.dataset.filter === c) ? c : 'todos';
      chips.forEach(ch => { const on = ch.dataset.filter === cat; ch.classList.toggle('is-on', on); ch.setAttribute('aria-pressed', String(on)); });
      if (push) history.replaceState(null, '', cat === 'todos' ? location.pathname : `#${cat}`);
      apply();
    };
    chips.forEach(ch => ch.addEventListener('click', () => setCat(ch.dataset.filter)));
    q.addEventListener('input', apply);
    $('[data-clear]')?.addEventListener('click', () => { q.value = ''; setCat('todos'); q.focus(); });
    addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
      if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; apply(); q.blur(); }
    });
    setCat(location.hash.slice(1) || 'todos', false);
  }

  /* artigo: sumário que acompanha a leitura */
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map(a => [decodeURIComponent(a.hash.slice(1)), a]));
    const heads = $$('.prose h2[id]');
    const mark = () => {
      let cur = heads[0];
      heads.forEach(h => { if (h.getBoundingClientRect().top < innerHeight * 0.3) cur = h; });
      tocLinks.forEach(a => a.classList.toggle('is-active', map.get(cur.id) === a));
    };
    addEventListener('scroll', mark, { passive: true }); mark();
  }
  $$('.toc-mobile a').forEach(a => a.addEventListener('click', () => a.closest('details').open = false));

  /* copiar link */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    const t = b.textContent; b.textContent = 'Link copiado'; b.classList.add('ok');
    setTimeout(() => { b.textContent = t; b.classList.remove('ok'); }, 1800);
  }));
})();
