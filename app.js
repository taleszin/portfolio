(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- i18n ---------- */
  const EN = {
    'nav.products': 'Products', 'nav.games': 'Games', 'nav.ai': 'AI', 'nav.stack': 'Stack', 'nav.journey': 'Journey', 'nav.contact': 'Contact',
    'hero.eyebrow': 'Full Stack Engineer · Fortaleza, Brazil · remote',
    'hero.l1': 'I build products', 'hero.l2': 'that real people', 'hero.l3': 'use every day.',
    'hero.sub': 'Node and TypeScript on the server, React and React Native on the screen, language models in between. Right now I keep a voice tutoring app, a clinical SaaS and a historical archive that answers questions in production. In my spare time, I make games.',
    'hero.cta1': 'Message me on WhatsApp', 'hero.cta2': 'See GitHub',
    'stat.products': 'products in production', 'stat.doctors': 'doctors and med students on Leap Notes', 'stat.headlines': 'searchable headlines in the Portal', 'stat.games': 'original games published',
    'products.eyebrow': '01 · Products', 'products.title': 'Three products live,', 'products.title2': 'with people on the other side.',
    'badge.live': 'live', 'badge.stores': 'App Store · Play Store', 'link.visit': 'Open the product', 'link.play': 'Play in the browser', 'link.code': 'See the code',
    'leap.title': 'The clinical notebook of more than a thousand doctors and medical students.',
    'leap.role': 'Co-founder and lead engineer · Nov 2025 to date',
    'leap.p1': 'Leap Notes is where interns, residents and physicians keep the protocols, prescriptions and summaries they use on shift. I started the product with the founding team and own all of the engineering, from the editor to billing.',
    'leap.b1': 'Rich editor on TipTap with real-time collaboration, tables, images and PDF and DOCX export.',
    'leap.b2': '3D anatomy with 2,234 selectable structures, clinical calculators, a question feed and Leap AI, a clinically grounded assistant inside the note.',
    'leap.b3': 'Freemium model and an in-house checkout with three payment gateways (card, Pix and subscription), a capped lifetime plan and an observability panel for the partners.',
    'leap.b4': 'Same code in the browser and on the phone via Capacitor, with 46 TypeScript edge functions handling webhooks, uploads and email.',
    'leap.m1': 'real users, doctors and students', 'leap.m2': 'sessions per week', 'leap.m3': 'medical schools with cohorts using it', 'leap.m4': 'of my PRs in production',
    'woolly.panelbar': 'coordination panel',
    'woolly.title': 'A voice AI tutor, in final pilot at the school with the best ENEM results in Brazil.',
    'woolly.role': 'Full Stack Engineer · Feb 2026 to date',
    'woolly.p1': 'Woolly is an app where students study by talking out loud with an AI tutor. I joined as a full stack engineer and have been continuously improving the product since, across the mobile app, both back-ends and the dashboards. We are in the final pilot phase at Colégio Farias Brito in Fortaleza, a national reference in ENEM admissions.',
    'woolly.b1': 'Gamification layer: XP, leagues, streaks, missions, quizzes and a guided tour that lives on the server, with no client-side state machine.',
    'woolly.b2': 'Push-to-talk voice over a real-time STT → LLM → TTS pipeline, with a text fallback when native audio fails.',
    'woolly.b3': 'A coordination panel for schools, from login to a chat with the class, designed and built in one week for the pilot.',
    'woolly.b4': 'Sentry observability on all three layers, with personal data stripped before it leaves the server.',
    'woolly.m1': 'students in pilot, 3 classes, 2 schools', 'woolly.m2': 'activation in the Farias Brito class', 'woolly.m3': 'services I work on: mobile, .NET, FastAPI and dashboards', 'woolly.m4': 'PRs merged since February',
    'phc.chatq': 'When did Ceará abolish slavery?', 'phc.chata': 'On March 25, 1884, four years before the Golden Law. I found 3 facts and 12 headlines from the time. Want to see the issues?', 'phc.chatmeta': 'with citation',
    'phc.name': 'Portal da História do Ceará',
    'phc.title': 'An archive of 250 thousand newspaper issues that answers questions.',
    'phc.role': 'Tech lead and author of IAcema · Sep 2025 to date · with Prof. Gildácio Sá',
    'phc.p1': 'The largest digital archive on the history of Ceará: newspapers since the 19th century, facts, biographies, books and magazines. I took over the platform, rebuilt the admin panel and created IAcema, an assistant that answers from the archive.',
    'phc.b1': 'IAcema is an agent with 16 SQL tools, not vector RAG: every answer cites the headline, issue and date it came from.',
    'phc.b2': 'OCR and PDF reconciliation pipeline that made thousands of academic articles searchable.',
    'phc.b3': 'Full-text search over 2.5 million headlines, a curation panel for conversations and an automatic monthly report for the stakeholder.',
    'phc.m1': 'searchable headlines', 'phc.m2': 'issues from 133 newspapers', 'phc.m3': 'conversations answered by IAcema', 'phc.m4': 'newspaper reading sessions',
    'games.eyebrow': '02 · Original games', 'games.title': 'Engines, art and sound', 'games.title2': 'built from scratch.',
    'games.lead': 'This is the authorial side of the work. None of the three uses an off-the-shelf engine or purchased assets: the engine, the art direction, the soundtrack and the physics came out of the same code editor. One of them won its course category at UECE.', 'games.s1': 'games published', 'games.s2': 'purchased assets', 'games.s3': 'hand-written WebGL engine',
    'game.fuel.k': 'Management sim · 3D · web and Android',
    'game.fuel.p': 'A Brazilian roadside gas station for you to run. Low-poly town, day and night cycle, rain, storms and wind dust, all generated in code: the game does not load a single art image. Customer queues, a tanker truck, electric cars and a progression track that closes the loop.',
    'game.fuel.f1': '100% procedural, zero binary assets', 'game.fuel.f2': 'Portuguese, English and Spanish', 'game.fuel.f3': 'Own telemetry with PostHog',
    'game.geo.k': 'Arena fighter · pure WebGL', 'game.geo.award': 'course champion in the 3D games category, UECE',
    'game.geo.p': 'Neon geometric shapes shove each other off a floating arena. Written in WebGL and GLSL with no engine: custom physics with percentage knockback and hitstun, ring-outs, combat AI on three difficulties and up to four opponents. The audio is synthesized live from musical scales. It started as a course project and won the 3D games category.',
    'game.geo.f1': 'Hand-written render and physics engine', 'game.geo.f2': '100% synthesized audio, no samples', 'game.geo.f3': '8 shapes, 12 palettes and 9 eyes, all procedural',
    'game.hylo.k': 'Artificial life sim · pixel art · Phaser',
    'game.hylo.p': 'You are the scientist: combine matter, form and energy to create geometric golems, then observe, breed and evolve them. Underneath there is Mendelian genetics with mutation, steering behaviors and real formulas for the stats, inspired by Aristotle\'s hylomorphism. Original pixel art direction, soundtrack and opening video, with a full GDD behind it.',
    'game.hylo.f1': 'Genetics with variable dominance and mutation', 'game.hylo.f2': 'Original art, music and script', 'game.hylo.f3': 'Published on GitHub Pages',
    'ai.eyebrow': '03 · AI in production', 'ai.title': 'Five LLM integrations', 'ai.title2': 'with a user at the end.',
    'ai.lead': 'Not demos. Each one has monitored token cost, a versioned prompt and a product problem it solves.',
    'ai.c1': 'Agent with a tool loop: 16 SQL tools with prepared statements query newspapers, facts and authors. Every answer ships with a citation from the archive. Versioned prompt and conversations curated in a dedicated panel.',
    'ai.c2t': 'Woolly voice tutor', 'ai.c2': 'Spoken conversation in real time: transcription, model and speech synthesis chained over WebSocket, with multiple tutor personalities and latency treated as a product requirement.',
    'ai.c3': 'Clinical assistant inside the Leap Notes editor, with answers anchored in protocols and a sales mode that presents the product to visitors who have not subscribed yet.',
    'ai.c4': 'Structured generation of tests, lesson plans and educational games with validated output and PDF and DOCX export.',
    'ai.c5': 'Socratic tutor for the ENEM exam: the model is instructed to ask before answering, with adaptive difficulty and gamification.',
    'ai.c6t': 'How I work with AI', 'ai.c6': 'I use coding agents daily, with multi-agent audits before implementing and adversarial review before every PR. The speed only counts when the tests pass and a human review approves.',
    'stack.eyebrow': '04 · Stack', 'stack.title': 'What I reach for', 'stack.title2': 'when the product is serious.',
    'stack.h1': 'Server', 'stack.h2': 'Screen', 'stack.h3': 'Data and operations',
    'stack.s1': '46 Leap Notes edge functions, FUELMANIA Vercel Functions, Edutopia and ENEMBot APIs in Next.js',
    'stack.s2': 'Woolly main back-end: gamification, domain events, server-authoritative APIs',
    'stack.s3': 'Woolly real-time voice service, WebSocket and audio streaming',
    'stack.s4': 'Portal da História do Ceará, where it all started',
    'stack.s5': 'Leap Notes, Woolly dashboards, Basquete Cearense',
    'stack.s6': 'the Woolly app on both stores, with Expo Router, Zustand and TanStack Query',
    'stack.s7': 'Edutopia and ENEMBot', 'stack.s8': 'three published games, one with its own engine',
    'stack.s9': 'auth, RLS, migrations versioned with Sqitch, edge functions',
    'stack.s10': 'full-text index over 2.5 million rows', 'stack.s11': 'five integrations in production',
    'stack.s12': 'subscription, card and Pix, with an in-house checkout',
    'stack.s13': 'deploy, monitoring and telemetry across every product',
    'journey.eyebrow': '05 · Journey', 'journey.title': 'Four and a half years', 'journey.title2': 'of code that shipped.',
    'journey.bio': 'I am from Fortaleza. I study Computer Science at UECE, finishing the degree, and have worked as an engineer since 2022. I like sitting between product and engineering: designing the engagement mechanic and then implementing it end to end. I prefer a lean solution to showcase architecture.',
    'journey.j1': 'Full Stack Engineer. Voice tutoring app on both stores, gamification, coordination panel and school pilots.',
    'journey.j2': 'Co-founder and lead engineer. Clinical SaaS with more than a thousand doctors and students, payments and mobile.',
    'journey.j3t': 'Portal da História do Ceará', 'journey.j3': 'Tech lead. Admin rebuild, archive OCR and IAcema.',
    'journey.j4': 'Software engineering and SLA support. PHP, JavaScript and Figma prototyping.',
    'journey.j5': 'Research and process management. Machine learning for clinical risk prediction in the CONCERN project.',
    'journey.j6time': 'in progress', 'journey.j6t': 'Computer Science · UECE', 'journey.j6': 'Bachelor\'s degree. Fluent English, intermediate Spanish.',
    'contact.eyebrow': '06 · Contact', 'contact.title': 'Have a product to build?', 'contact.title2': 'Let\'s talk.',
    'contact.lead': 'Available for remote roles and on-site in Fortaleza, full stack or mobile. I reply within 24 hours.',
    'footer.made': 'Designed and built by Tales Santiago.', 'footer.tech': 'No framework, no template: HTML, CSS and JavaScript.', 'footer.src': 'source of this page',
  };
  const PT = {};
  $$('[data-i18n]').forEach(el => { PT[el.dataset.i18n] = el.innerHTML; });
  const META = {
    pt: { title: document.title, desc: $('meta[name="description"]').content },
    en: { title: 'Tales Santiago | Full Stack Engineer · Node, React, React Native and AI in production', desc: 'Full Stack Engineer from Fortaleza, Brazil. Node/TypeScript, React, React Native and AI in production: a voice tutoring app on the stores, a clinical SaaS with 1,000+ doctors, a historical archive with 2.5 million headlines and three original games.' },
  };
  let lang = 'pt';
  const setLang = (l) => {
    lang = l;
    const dict = l === 'en' ? EN : PT;
    $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    document.documentElement.lang = l === 'en' ? 'en' : 'pt-BR';
    document.title = META[l].title;
    $('meta[name="description"]').content = META[l].desc;
    $$('#lang span').forEach((s, i) => s.classList.toggle('on', (i === 0) === (l === 'pt')));
    $('#lang').setAttribute('aria-label', l === 'pt' ? 'Switch to English' : 'Mudar para português');
    try { localStorage.setItem('lang', l); } catch (e) {}
  };
  $('#lang').addEventListener('click', () => setLang(lang === 'pt' ? 'en' : 'pt'));
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'pt');

  /* ---------- mobile nav ---------- */
  const burger = $('#burger'), nav = $('.nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });

  /* ---------- topbar + progress ---------- */
  const topbar = $('.topbar'), bar = $('.progress span');
  const onScroll = () => {
    const y = window.scrollY;
    topbar.classList.toggle('scrolled', y > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- counters ---------- */
  const fmt = (n, d) => n.toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; cio.unobserve(el);
      const target = parseFloat(el.dataset.count), d = parseInt(el.dataset.decimals || '0', 10);
      if (reduce) { el.textContent = fmt(target, d); return; }
      const t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(target * e, d);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  $$('.count').forEach(el => cio.observe(el));

  /* ---------- accent per section ---------- */
  const root = document.documentElement;
  const aio = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) root.style.setProperty('--accent', en.target.dataset.accent); });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  $$('[data-accent]').forEach(el => aio.observe(el));

  /* ---------- horizontal games ---------- */
  const games = $('.games'), track = $('#games-track'), gbar = $('#games-bar');
  const layoutGames = () => {
    if (innerWidth <= 900) { games.style.height = ''; track.style.transform = ''; return; }
    const extra = track.scrollWidth - track.clientWidth;
    games.style.height = `${innerHeight + extra}px`;
    moveGames();
  };
  const moveGames = () => {
    if (innerWidth <= 900) return;
    const rect = games.getBoundingClientRect();
    const total = games.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / (total || 1)));
    const extra = track.scrollWidth - track.clientWidth;
    track.style.transform = `translate3d(${-p * extra}px,0,0)`;
    gbar.style.width = `${p * 100}%`;
  };
  addEventListener('resize', layoutGames);
  addEventListener('scroll', moveGames, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutGames);
  addEventListener('load', layoutGames); layoutGames();

  /* ---------- cursor + magnetic ---------- */
  if (fine && !reduce) {
    const cur = $('.cursor');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const loop = () => {
      rx += (mx - rx) * 0.35; ry += (my - ry) * 0.35;
      cur.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- aura canvas ---------- */
  const cv = $('#aura');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let w, h, dpr;
    const blobs = [
      { x: .2, y: .3, r: .45, s: .00021, o: 0 },
      { x: .8, y: .2, r: .38, s: .00017, o: 2 },
      { x: .5, y: .9, r: .5, s: .00013, o: 4 },
    ];
    let px = .5, py = .4, tx = .5, ty = .4;
    const size = () => { dpr = Math.min(1.5, devicePixelRatio || 1); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; };
    size(); addEventListener('resize', size);
    addEventListener('mousemove', e => { tx = e.clientX / innerWidth; ty = e.clientY / innerHeight; }, { passive: true });
    const hex = (c, a) => { const n = parseInt(c.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    let last = 0;
    const draw = (t) => {
      requestAnimationFrame(draw);
      if (t - last < 33) return; last = t;
      if (document.hidden) return;
      px += (tx - px) * .04; py += (ty - py) * .04;
      const acc = getComputedStyle(root).getPropertyValue('--accent').trim() || '#c4a6ff';
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach((b, i) => {
        const a = t * b.s + b.o;
        const bx = (b.x + Math.cos(a) * .12 + (px - .5) * (.18 + i * .06)) * w;
        const by = (b.y + Math.sin(a * 1.3) * .12 + (py - .5) * (.18 + i * .06)) * h;
        const rad = b.r * Math.max(w, h) * .55;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        g.addColorStop(0, hex(acc, .13)); g.addColorStop(1, hex(acc, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, rad, 0, Math.PI * 2); ctx.fill();
      });
    };
    requestAnimationFrame(draw);
  }
})();
