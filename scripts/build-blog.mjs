#!/usr/bin/env node
// Gera o blog estático a partir de blog/_posts/*.md, sem dependências.
// Saída: blog/index.html, blog/<slug>/index.html, blog/feed.xml, sitemap.xml
// e os cards mais recentes dentro de index.html (entre os marcadores BLOG:START e BLOG:END).
// Uso: node scripts/build-blog.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'blog', '_posts');
const OUT = join(ROOT, 'blog');
const SITE = 'https://taleszin.github.io/portfolio';
const AUTHOR = 'Tales Santiago';
const VERSION = '20261126a';

const CATEGORIAS = {
  'Carreira': { id: 'carreira', cor: '#c4a6ff' },
  'Produto': { id: 'produto', cor: '#7c8cff' },
  'Engenharia': { id: 'engenharia', cor: '#3ef2d6' },
  'IA': { id: 'ia', cor: '#e2b04a' },
  'Projetos pessoais': { id: 'projetos-pessoais', cor: '#ff7a1a' },
};

/* ---------------- utilidades ---------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dataLonga = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${MESES[m - 1]} de ${y}`; };
const dataRss = (iso) => new Date(`${iso}T12:00:00-03:00`).toUTCString();

/* ---------------- frontmatter ---------------- */
function parseFrontmatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: sem frontmatter`);
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = JSON.parse(v);
    else if (/^".*"$/.test(v)) v = JSON.parse(v);
    else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
    data[kv[1]] = v;
  }
  for (const k of ['title', 'slug', 'description', 'category']) if (!data[k]) throw new Error(`${file}: falta ${k}`);
  if (!CATEGORIAS[data.category]) throw new Error(`${file}: categoria desconhecida "${data.category}"`);
  data.tags ||= [];
  data.publishedAt ||= '2026-11-26';
  return { data, body: m[2] };
}

/* ---------------- markdown (subconjunto) ---------------- */
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const ext = /^https?:/.test(u);
    return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
  return s;
}

function markdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [], toc = [], used = new Set();
  let i = 0;
  const isBlockStart = (l) => /^(#{2,4}\s|```|>\s?|[-*]\s|\d+[.)]\s)/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const buf = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      out.push(`<pre class="code"${fence[1] ? ` data-lang="${esc(fence[1])}"` : ''}><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = Math.max(2, h[1].length);
      const text = h[2].trim();
      let id = slugify(text) || 'secao';
      while (used.has(id)) id += '-2';
      used.add(id);
      if (level === 2) toc.push({ id, text: inline(text) });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++; continue;
    }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      const inner = buf.join('\n').split(/\n\s*\n/).map((p) => `<p>${inline(p.replace(/\n/g, ' '))}</p>`).join('');
      out.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }
    if (/^([-*]|\d+[.)])\s/.test(line)) {
      const ordered = /^\d/.test(line);
      const re = ordered ? /^\d+[.)]\s+/ : /^[-*]\s+/;
      const items = [];
      while (i < lines.length && (re.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (re.test(lines[i])) items.push(lines[i].replace(re, ''));
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${tag}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) buf.push(lines[i++].trim());
    if (!buf.length) { buf.push(lines[i++].trim()); }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}

const words = (md) => md.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;

/* ---------------- capa generativa (curvas de nível) ---------------- */
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
}
function cover(post, { big = false } = {}) {
  const r = rng(post.slug);
  const W = 640, H = 360;
  const cx = W * (0.25 + r() * 0.5), cy = H * (0.3 + r() * 0.45);
  const harm = Array.from({ length: 4 }, (_, k) => ({ a: (0.05 + r() * 0.12) / (k + 1), f: k + 2, p: r() * Math.PI * 2 }));
  const rings = [];
  for (let k = 0; k < 15; k++) {
    const rad = 22 + k * 28;
    const pts = [];
    for (let s = 0; s <= 72; s++) {
      const t = (s / 72) * Math.PI * 2;
      let m = 1;
      for (const hh of harm) m += hh.a * Math.sin(hh.f * t + hh.p + k * 0.15);
      pts.push([cx + Math.cos(t) * rad * m * 1.35, cy + Math.sin(t) * rad * m]);
    }
    const d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
    rings.push(`<path d="${d}" stroke-opacity="${k % 5 === 4 ? 0.55 : 0.22}" stroke-width="${k % 5 === 4 ? 1.4 : 0.9}"/>`);
  }
  const n = String(post.order).padStart(2, '0');
  const cat = CATEGORIAS[post.category];
  return `<svg class="cover-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs><radialGradient id="g-${post.slug}" cx="${(cx / W).toFixed(2)}" cy="${(cy / H).toFixed(2)}" r="0.8"><stop offset="0" stop-color="${cat.cor}" stop-opacity=".34"/><stop offset="1" stop-color="${cat.cor}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="#0d0d14"/><rect width="${W}" height="${H}" fill="url(#g-${post.slug})"/>
<g fill="none" stroke="${cat.cor}">${rings.join('')}</g>
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.5" fill="${cat.cor}"/>
</svg>`;
}

/* ---------------- carregar posts ---------------- */
const posts = readdirSync(SRC).filter((f) => f.endsWith('.md')).map((f) => {
  const { data, body } = parseFrontmatter(readFileSync(join(SRC, f), 'utf8'), f);
  const { html, toc } = markdown(body);
  const w = words(body);
  return { ...data, html, toc, words: w, minutes: Math.max(1, Math.round(w / 210)) };
}).sort((a, b) => (b.publishedAt.localeCompare(a.publishedAt)) || (a.order - b.order));
// Ordem de leitura da trilha (1 = começo da história); o hub mostra a mesma ordem.
posts.sort((a, b) => a.order - b.order);

/* ---------------- partes comuns ---------------- */
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">`;
const head = ({ title, desc, url, base, type = 'website', extra = '' }) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${AUTHOR}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/assets/og.png">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0a0a0f">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="Blog do Tales Santiago" href="${SITE}/blog/feed.xml">
${FONTS}
<link rel="stylesheet" href="${base}blog/blog.css?v=${VERSION}">
${extra}
</head>`;
const topbar = (base, here) => `<div class="progress" aria-hidden="true"><span></span></div>
<header class="topbar">
  <a href="${base}" class="brand" aria-label="Tales Santiago, portfólio"><span class="brand-mark">TS</span><span class="brand-name">Tales Santiago</span></a>
  <nav class="nav" aria-label="Navegação">
    <a href="${base}#produtos">Produtos</a>
    <a href="${base}blog/"${here === 'blog' ? ' aria-current="page"' : ''}>Blog</a>
    <a href="${base}#jornada">Jornada</a>
    <a href="${base}#contato" class="nav-cta">Contato</a>
  </nav>
</header>`;
const footer = (base) => `<footer class="footer">
  <p>Escrito e construído por Tales Santiago. HTML, CSS e JavaScript, sem framework.</p>
  <p class="footer-links"><a href="${base}blog/feed.xml">RSS</a><a href="https://github.com/taleszin" target="_blank" rel="noopener">GitHub</a><a href="${base}">Portfólio</a></p>
</footer>
<script src="${base}blog/blog.js?v=${VERSION}" defer></script>
</body>
</html>`;

const WHATS = 'https://wa.me/5585984038749?text=' + encodeURIComponent('Olá Tales! Li um artigo do seu blog e quero conversar.');

const card = (p, base, { featured = false } = {}) => {
  const cat = CATEGORIAS[p.category];
  const hay = [p.title, p.description, p.category, ...p.tags].join(' ').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return `<a class="post-card${featured ? ' is-featured' : ''}" href="${base}blog/${p.slug}/" data-cat="${cat.id}" data-search="${esc(hay)}" style="--c:${cat.cor}">
  <figure class="post-cover">${cover(p, { big: featured })}<span class="cover-label">N.º ${String(p.order).padStart(2, '0')} · ${esc(p.category)}</span></figure>
  <div class="post-card-body">
    <p class="post-kicker"><span class="cat-dot"></span>${esc(p.category)}<span class="sep">·</span>${p.minutes} min</p>
    <h${featured ? 2 : 3}>${esc(p.title)}</h${featured ? 2 : 3}>
    <p class="post-desc">${esc(p.description)}</p>
    <span class="post-more">Ler artigo</span>
  </div>
</a>`;
};

/* ---------------- hub ---------------- */
function hub() {
  const base = '../';
  const counts = Object.fromEntries(Object.keys(CATEGORIAS).map((c) => [c, posts.filter((p) => p.category === c).length]));
  const totalMin = posts.reduce((s, p) => s + p.minutes, 0);
  const [destaque, ...demais] = posts;
  const desc = 'Textos de Tales Santiago sobre carreira em tecnologia, produto, engenharia e IA em produção: Leap Notes, Portal da História do Ceará e projetos pessoais.';
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog do Tales Santiago', url: `${SITE}/blog/`, inLanguage: 'pt-BR', description: desc,
    author: { '@type': 'Person', name: AUTHOR, url: `${SITE}/` },
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.publishedAt })),
  };
  return `${head({ title: 'Blog | Tales Santiago', desc, url: `${SITE}/blog/`, base, extra: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` })}
<body class="page-hub">
${topbar(base, 'blog')}
<main id="top">
  <header class="hub-hero">
    <p class="eyebrow">Blog · ${posts.length} artigos · ${totalMin} min de leitura</p>
    <h1>Do primeiro semestre <em class="serif nowrap">ao produto no ar.</em></h1>
    <p class="lead">O que eu aprendi entrando em Computação sem saber programar, construindo o Leap Notes e o Portal da História do Ceará, e fazendo coisa pra mim mesmo no fim de semana. Contado por quem fez, com os erros junto.</p>
  </header>

  <div class="hub-tools" role="search">
    <label class="search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input id="q" type="search" placeholder="Buscar por tema, projeto ou ferramenta" aria-label="Buscar artigos" autocomplete="off">
      <kbd aria-hidden="true">/</kbd>
    </label>
    <nav class="chips-filter" aria-label="Categorias">
      <button type="button" class="chip is-on" data-filter="todos" aria-pressed="true">Todos <span>${posts.length}</span></button>
      ${Object.entries(CATEGORIAS).filter(([c]) => counts[c]).map(([c, v]) => `<button type="button" class="chip" data-filter="${v.id}" aria-pressed="false" style="--c:${v.cor}">${esc(c)} <span>${counts[c]}</span></button>`).join('\n      ')}
    </nav>
  </div>

  <section class="hub-list" aria-label="Artigos">
    ${destaque ? card(destaque, base, { featured: true }) : ''}
    <div class="post-grid">
      ${demais.map((p) => card(p, base)).join('\n      ')}
    </div>
    <p class="empty" hidden>Nada com esse termo. Tenta outra palavra ou <button type="button" data-clear>limpa o filtro</button>.</p>
  </section>

  <aside class="hub-cta">
    <div>
      <p class="eyebrow">Fora do blog</p>
      <h2>Tem um produto pra construir?</h2>
      <p>Trabalho com produto e engenharia de ponta a ponta, remoto ou em Fortaleza. Respondo em menos de 24 horas.</p>
    </div>
    <div class="hub-cta-actions"><a class="btn btn-primary" href="${WHATS}" target="_blank" rel="noopener">Falar no WhatsApp</a><a class="btn btn-ghost" href="${base}#produtos">Ver os projetos</a></div>
  </aside>
</main>
${footer(base)}`;
}

/* ---------------- artigo ---------------- */
function article(p, idx) {
  const base = '../../';
  const cat = CATEGORIAS[p.category];
  const url = `${SITE}/blog/${p.slug}/`;
  const prev = posts[idx - 1], next = posts[idx + 1];
  const related = [
    ...posts.filter((x) => x !== p && x.category === p.category),
    ...posts.filter((x) => x !== p && x.category !== p.category && Math.abs(x.order - p.order) <= 2),
    ...posts.filter((x) => x !== p),
  ].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, inLanguage: 'pt-BR',
    datePublished: p.publishedAt, dateModified: p.publishedAt, wordCount: p.words, timeRequired: `PT${p.minutes}M`,
    articleSection: p.category, keywords: p.tags.join(', '), mainEntityOfPage: url, image: `${SITE}/assets/og.png`,
    author: { '@type': 'Person', name: AUTHOR, url: `${SITE}/`, jobTitle: 'Full Stack Engineer' },
    isPartOf: { '@type': 'Blog', name: 'Blog do Tales Santiago', url: `${SITE}/blog/` },
  };
  const tocHtml = p.toc.length >= 2 ? `<ol>${p.toc.map((t) => `<li><a href="#${t.id}">${t.text}</a></li>`).join('')}</ol>` : '';
  const share = encodeURIComponent(url);
  return `${head({ title: `${p.title} | Tales Santiago`, desc: p.description, url, base, type: 'article', extra: `<meta property="article:published_time" content="${p.publishedAt}"><meta property="article:section" content="${esc(p.category)}"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` })}
<body class="page-post" style="--c:${cat.cor}">
${topbar(base, 'blog')}
<main id="top">
  <header class="post-hero">
    <nav class="crumbs" aria-label="Você está em"><a href="${base}">Portfólio</a><span>/</span><a href="${base}blog/">Blog</a><span>/</span><a href="${base}blog/#${cat.id}">${esc(p.category)}</a></nav>
    <p class="post-kicker"><span class="cat-dot"></span>${esc(p.category)}<span class="sep">·</span>N.º ${String(p.order).padStart(2, '0')}</p>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.description)}</p>
    <div class="byline">
      <img class="avatar" src="${base}assets/img/tales.webp" alt="" width="44" height="44">
      <div><b>${AUTHOR}</b><span><time datetime="${p.publishedAt}">${dataLonga(p.publishedAt)}</time> · ${p.minutes} min de leitura</span></div>
    </div>
    <figure class="post-cover hero-cover">${cover(p, { big: true })}<span class="cover-label">N.º ${String(p.order).padStart(2, '0')} · ${esc(p.category)}</span></figure>
  </header>

  <div class="post-layout">
    <article class="prose" data-prose>
      ${tocHtml ? `<details class="toc-mobile"><summary>Neste artigo</summary>${tocHtml}</details>` : ''}
      ${p.html}
      ${p.tags.length ? `<p class="post-tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : ''}
      <div class="author-box">
        <img src="${base}assets/img/tales.webp" alt="" width="72" height="72" loading="lazy">
        <div><b>Tales Santiago</b><p>Full stack de Fortaleza. Ciência da Computação na UECE, cofundador e CTO do Leap Notes, tech lead do Portal da História do Ceará.</p><p class="author-links"><a href="${base}">Portfólio</a><a href="https://github.com/taleszin" target="_blank" rel="noopener">GitHub</a><a href="${WHATS}" target="_blank" rel="noopener">WhatsApp</a></p></div>
      </div>
    </article>
    <aside class="post-side" aria-label="Navegação do artigo">
      ${tocHtml ? `<nav class="toc" aria-label="Neste artigo"><p class="side-title">Neste artigo</p>${tocHtml}</nav>` : ''}
      <div class="side-share"><p class="side-title">Compartilhar</p>
        <div class="share-row">
          <button type="button" class="share-btn" data-copy="${url}">Copiar link</button>
          <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${share}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="share-btn" href="https://wa.me/?text=${encodeURIComponent(p.title + ' ' + url)}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
      <a class="side-cta" href="${WHATS}" target="_blank" rel="noopener"><span>Tem um produto pra construir?</span><b>Vamos conversar ↗</b></a>
    </aside>
  </div>

  <nav class="post-pager" aria-label="Outros artigos">
    ${prev ? `<a class="pager prev" href="${base}blog/${prev.slug}/"><span>← Anterior</span><b>${esc(prev.title)}</b></a>` : '<span></span>'}
    ${next ? `<a class="pager next" href="${base}blog/${next.slug}/"><span>Próximo →</span><b>${esc(next.title)}</b></a>` : '<span></span>'}
  </nav>

  <section class="related" aria-labelledby="rel">
    <h2 id="rel">Continue lendo</h2>
    <div class="post-grid">${related.map((x) => card(x, base)).join('')}</div>
  </section>
</main>
${footer(base)}`;
}

/* ---------------- feed, sitemap, home ---------------- */
function feed() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Blog do Tales Santiago</title><link>${SITE}/blog/</link><description>Carreira, produto, engenharia e IA em produção.</description><language>pt-BR</language>
<atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/blog/${p.slug}/</link><guid>${SITE}/blog/${p.slug}/</guid><pubDate>${dataRss(p.publishedAt)}</pubDate><category>${esc(p.category)}</category><description>${esc(p.description)}</description></item>`).join('\n')}
</channel></rss>`;
}
function sitemap() {
  const urls = [`${SITE}/`, `${SITE}/blog/`, ...posts.map((p) => `${SITE}/blog/${p.slug}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
}
function homeCards() {
  // Um artigo de cada categoria, pra vitrine da home mostrar a variedade do blog.
  const picks = Object.keys(CATEGORIAS).map((c) => posts.find((p) => p.category === c)).filter(Boolean).slice(0, 4).sort((a, b) => a.order - b.order);
  return `<!-- BLOG:START (gerado por scripts/build-blog.mjs) -->
  <div class="article-grid">
${picks.map((p, i) => `    <a class="article-card reveal" href="blog/${p.slug}/" style="--c:${CATEGORIAS[p.category].cor}">
      <span class="article-number">${String(i + 1).padStart(2, '0')}</span><p class="article-kicker">${esc(p.category)} · ${p.minutes} min</p>
      <h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
      <span class="article-link">Ler artigo</span>
    </a>`).join('\n')}
  </div>
  <!-- BLOG:END -->`;
}

/* ---------------- escrever ---------------- */
for (const d of readdirSync(OUT, { withFileTypes: true })) {
  if (d.isDirectory() && !d.name.startsWith('_') && existsSync(join(OUT, d.name, 'index.html'))) rmSync(join(OUT, d.name), { recursive: true });
}
writeFileSync(join(OUT, 'index.html'), hub());
posts.forEach((p, i) => {
  mkdirSync(join(OUT, p.slug), { recursive: true });
  writeFileSync(join(OUT, p.slug, 'index.html'), article(p, i));
});
writeFileSync(join(OUT, 'feed.xml'), feed());
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap());
const homePath = join(ROOT, 'index.html');
const home = readFileSync(homePath, 'utf8');
if (/<!-- BLOG:START[\s\S]*?BLOG:END -->/.test(home)) writeFileSync(homePath, home.replace(/<!-- BLOG:START[\s\S]*?BLOG:END -->/, homeCards()));
console.log(`blog: ${posts.length} artigos, ${posts.reduce((s, p) => s + p.words, 0)} palavras`);
for (const p of posts) console.log(`  ${String(p.order).padStart(2)} ${p.slug} (${p.words} palavras, ${p.minutes} min, ${p.toc.length} seções)`);
