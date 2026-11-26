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
  const cards = $$('.post-card, .pager, .hub-cta, .prose .media, .prose .carousel');

  /* spotlight dos cards segue o mouse */
  $$('.post-card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  /* artigo: título de seção ganha o traço quando aparece + pílula de tempo restante */
  if (prose) {
    const hs = $$('.prose h2');
    if ('IntersectionObserver' in window) {
      const ho = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); ho.unobserve(e.target); } }), { rootMargin: '0px 0px -15% 0px' });
      hs.forEach(h => ho.observe(h));
    } else hs.forEach(h => h.classList.add('seen'));
    const total = Number(prose.dataset.minutes) || 0;
    if (total) {
      const pill = document.createElement('button');
      pill.type = 'button'; pill.className = 'time-left'; pill.setAttribute('aria-label', 'Voltar ao topo');
      pill.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="bg" cx="12" cy="12" r="9"/><circle class="fg" cx="12" cy="12" r="9" pathLength="1"/></svg><span></span>';
      document.body.append(pill);
      const fg = $('.fg', pill), label = $('span', pill);
      pill.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
      const upd = () => {
        const r = prose.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / r.height));
        fg.style.strokeDashoffset = String(1 - p);
        const left = Math.ceil(total * (1 - p));
        label.textContent = p >= 0.98 ? 'fim · voltar ao topo' : `${left} min restante${left > 1 ? 's' : ''}`;
        pill.classList.toggle('on', r.top < innerHeight * 0.2 && r.bottom > innerHeight * 0.15);
      };
      addEventListener('scroll', upd, { passive: true }); upd();
    }
  }
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

  /* carrosséis: setas, contador, teclado */
  $$('.carousel').forEach(car => {
    const track = $('.car-track', car), slides = $$('.slide', track);
    const count = $('.car-count b', car), btns = $$('.car-btn', car);
    if (slides.length < 2) return;
    const cur = () => {
      const x = track.scrollLeft + track.clientWidth / 2; let best = 0, d = Infinity;
      slides.forEach((s, n) => { const c = s.offsetLeft - track.offsetLeft + s.offsetWidth / 2; if (Math.abs(c - x) < d) { d = Math.abs(c - x); best = n; } });
      return best;
    };
    const go = n => { const s = slides[Math.max(0, Math.min(slides.length - 1, n))]; track.scrollTo({ left: s.offsetLeft - track.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' }); };
    const sync = () => { const n = cur(); if (count) count.textContent = n + 1; if (btns.length) { btns[0].disabled = n === 0; btns[1].disabled = n === slides.length - 1; } };
    btns.forEach(b => b.addEventListener('click', () => go(cur() + Number(b.dataset.dir))));
    track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(cur() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur() - 1); } });
    let t; track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sync, 60); }, { passive: true });
    sync();
  });

  /* vídeos só tocam quando aparecem na tela */
  const vids = $$('.prose video');
  if (vids.length && 'IntersectionObserver' in window) {
    const vo = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !reduce) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: 0.25 });
    vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); vo.observe(v); });
  }

  /* zoom nas imagens */
  $$('.prose img[data-zoom]').forEach(img => img.addEventListener('click', () => {
    const box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', img.alt);
    const inner = document.createElement('div');
    const big = document.createElement('img'); big.src = img.currentSrc || img.src; big.alt = img.alt;
    inner.append(big);
    const cap = img.closest('figure')?.querySelector('figcaption');
    if (cap) { const p = document.createElement('p'); p.textContent = cap.textContent; inner.append(p); }
    box.append(inner);
    const onKey = e => { if (e.key === 'Escape') close(); };
    const close = () => { box.classList.remove('on'); removeEventListener('keydown', onKey); setTimeout(() => box.remove(), 250); };
    box.addEventListener('click', close); addEventListener('keydown', onKey);
    document.body.append(box); requestAnimationFrame(() => box.classList.add('on'));
  }));

  /* copiar link */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    const t = b.textContent; b.textContent = 'Link copiado'; b.classList.add('ok');
    setTimeout(() => { b.textContent = t; b.classList.remove('ok'); }, 1800);
  }));
})();
