(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- showcase videos ---------- */
  // O poster e carregado como imagem; o arquivo de vídeo só entra quando a
  // demonstração está prestes a aparecer. Isso mantém a página inicial leve.
  if (!reduce && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const video = entry.target;
        if (video.dataset.src) {
          // Garante as condições exigidas pelos navegadores para autoplay antes
          // de anexar o arquivo que foi adiado até o vídeo entrar na tela.
          video.muted = true;
          video.defaultMuted = true;
          video.autoplay = true;
          video.playsInline = true;
          video.src = video.dataset.src;
          delete video.dataset.src;
          video.load();
          video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
        }
        observer.unobserve(video);
      });
    }, { rootMargin: '240px 0px' });
    $$('video[data-src]').forEach(video => {
      // Em um navegador que não reproduza o formato, volta ao poster em vez
      // de deixar um bloco de erro no principal asset do case.
      video.addEventListener('error', () => {
        video.removeAttribute('src');
        video.load();
      }, { once: true });
      videoObserver.observe(video);
    });
  }

  /* ---------- i18n ---------- */
  const EN = {
    'nav.products': 'Products', 'nav.articles': 'Articles', 'nav.games': 'Games', 'nav.hw': 'Hardware', 'nav.ai': 'AI', 'nav.stack': 'Stack', 'nav.journey': 'Journey', 'nav.contact': 'Contact',
    'hero.eyebrow': 'Full Stack Engineer · Fortaleza, Brazil · remote',
    'hero.l1': 'From back end', 'hero.l2': 'to kernel,', 'hero.l3': 'shipped and live.',
    'hero.sub': 'Node and TypeScript on the server, React and React Native on the screen, language models in between. In my spare time, I make games.',
    'hero.cta1': 'Message me on WhatsApp', 'hero.cta2': 'See the projects',
    'stat.products': 'products in production', 'stat.doctors': 'doctors on Leap Notes', 'stat.hn': '2.5M', 'stat.dn': '1,000+', 'stat.headlines': 'headlines with AI',
    'show.t1': '1,000+ doctors', 'show.t2': 'App Store · Play', 'show.t3': 'own ROM · 512 MB', 'show.t4': '2.5M headlines', 'show.t5': 'pure WebGL', 'show.t6': '100% procedural', 'show.t7': '3D anatomy', 'show.t8': 'a 2014 tablet', 'show.t9': 'school dashboard', 'show.t10': 'artificial life', 'show.t11': 'AI that cites sources', 'show.t12': 'voice tutor', 'show.t13': '7 med schools', 'show.t14': 'native reader', 'show.t15': 'in-house checkout',
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
    'articles.eyebrow': '02 · Articles', 'articles.title': 'Product stories,', 'articles.title2': 'with sources and context.',
    'articles.lead': 'Published pieces in the Portal da História do Ceará about research, digital preservation, and AI applied to a real archive.',
    'articles.a1.kicker': 'OCR · indexing · curation', 'articles.a1.title': 'From paper to search', 'articles.a1.text': 'How scanning, OCR, AI-assisted curation, and indexing turn old newspapers into searchable text.',
    'articles.a2.kicker': 'AI · tools · sources', 'articles.a2.title': 'IAcema and archive research', 'articles.a2.text': 'How an assistant searches 2.5 million headlines and returns answers with verifiable sources.',
    'articles.read': 'Read on the Portal', 'articles.all': 'See all Portal articles ↗',
    'games.eyebrow': '03 · Original games', 'games.title': 'Engines, art and sound', 'games.title2': 'built from scratch.',
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
    'hw.eyebrow': '04 · Low level', 'hw.title': 'A 2014 tablet headed for the trash', 'hw.title2': 'became an operating system.', 'hw.live': 'on the real device',
    'hw.lead': 'The Multilaser M7s has 512 MB of RAM, two cores at 1 GHz and no alternative ROM anywhere. I wrote the first one: Taleszin OS, with a reproducible build from the official firmware, shell boot services, hooks into the Android UI and five native apps built without Gradle. All over a USB cable, without opening the device.',
    'hw.l1.t': 'Hardware and flashing', 'hw.l1.p': 'Rockchip RK3026, NAND and partitions mapped by reverse engineering the official firmware. Full backup in loader mode and flashing from a Mac with rkflashtool, verified block by block with sha256.',
    'hw.l2.t': 'Kernel and drivers', 'hw.l2.p': 'The kernel battery sensor freezes between percentage steps, so the real voltage comes straight from the ADC (× 6.06 mV). The power button is read as a raw evdev event and, held for 8 s, forces a clean reboot through sysrq, a reset the device never had.',
    'hw.l3.t': 'Boot and services', 'hw.l3.p': 'Shell services started by init: 128 MB zRAM, KSM, a tuned CPU governor, a sentinel that kills the right process before an out-of-memory freeze, a black box that explains on the next boot why the last session ended, and a stepped battery guard.',
    'hw.l4.t': 'System and UI', 'hw.l4.p': 'A system.img reproducible from the official zip, with no firmware or third-party APKs in version control. Xposed hooks into SystemUI swap the tablet layout for the phone one, SELinux contexts are fixed so the hook loads, plus a custom boot animation.',
    'hw.l5.t': 'Native apps', 'hw.l5.p': 'Home screen, theme, Diagnostics, the Estante book reader (column pagination in a 2013 WebView) and Fliperama, which launches homebrew games straight into the emulator. Plain Java built with aapt2 and d8, no Gradle: most apps weigh under 120 KB.',
    'hw.m1': 'of RAM, with zRAM and KSM to make it fit', 'hw.m2': 'alternative ROMs for this device before this one', 'hw.m3': 'native apps of my own, none using Gradle', 'hw.m4': 'on Super Nintendo, with a compatibility shim for the emulator',
    'hw.cap': 'The battery guard lowers CPU and brightness before the blackout.',
    'ai.eyebrow': '05 · AI in production', 'ai.title': 'Five LLM integrations', 'ai.title2': 'with a user at the end.',
    'ai.lead': 'Not demos. Each one has monitored token cost, a versioned prompt and a product problem it solves.',
    'ai.c1': 'Agent with a tool loop: 16 SQL tools with prepared statements query newspapers, facts and authors. Every answer ships with a citation from the archive. Versioned prompt and conversations curated in a dedicated panel.',
    'ai.c2t': 'Woolly voice tutor', 'ai.c2': 'Spoken conversation in real time: transcription, model and speech synthesis chained over WebSocket, with multiple tutor personalities and latency treated as a product requirement.',
    'ai.c3': 'Clinical assistant inside the Leap Notes editor, with answers anchored in protocols and a sales mode that presents the product to visitors who have not subscribed yet.',
    'ai.c4': 'Structured generation of tests, lesson plans and educational games with validated output and PDF and DOCX export.',
    'ai.c5': 'Socratic tutor for the ENEM exam: the model is instructed to ask before answering, with adaptive difficulty and gamification.',
    'ai.c6t': 'How I work with AI', 'ai.c6': 'I use coding agents daily, with multi-agent audits before implementing and adversarial review before every PR. The speed only counts when the tests pass and a human review approves.',
    'stack.eyebrow': '06 · Stack', 'stack.title': 'What I reach for', 'stack.title2': 'when the product is serious.',
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
    'journey.eyebrow': '07 · Journey', 'journey.title': 'Four and a half years', 'journey.title2': 'of code that shipped.',
    'journey.bio': 'I am from Fortaleza. I study Computer Science at UECE, finishing the degree, and have worked as an engineer since 2022. I like sitting between product and engineering: designing the engagement mechanic and then implementing it end to end. I prefer a lean solution to showcase architecture.',
    'journey.j1': 'Full Stack Engineer. Voice tutoring app on both stores, gamification, coordination panel and school pilots.',
    'journey.j2': 'Co-founder and lead engineer. Clinical SaaS with more than a thousand doctors and students, payments and mobile.',
    'journey.j3t': 'Portal da História do Ceará', 'journey.j3': 'Tech lead. Admin rebuild, archive OCR and IAcema.',
    'journey.j4': 'Software engineering and SLA support. PHP, JavaScript and Figma prototyping.',
    'journey.j5': 'Research and process management. Machine learning for clinical risk prediction in the CONCERN project.',
    'journey.j6time': 'in progress', 'journey.j6t': 'Computer Science · UECE', 'journey.j6': 'Bachelor\'s degree. Fluent English, intermediate Spanish.',
    'contact.eyebrow': '08 · Contact', 'contact.title': 'Have a product to build?', 'contact.title2': 'Let\'s talk.',
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
    $('#mosaic').setAttribute('aria-label', l === 'pt' ? 'Telas reais dos projetos' : 'Real screens from the projects');
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
  $$('[data-accent]:not(.showcase-slide)').forEach(el => aio.observe(el));

  /* ---------- hero mosaic ---------- */
  // As colunas só animam com a abertura na tela: fora dela o compositor fica livre.
  {
    const mosaic = $('#mosaic');
    new IntersectionObserver(([en]) => mosaic.classList.toggle('is-off', !en.isIntersecting)).observe(mosaic);
  }

  /* ---------- cursor + magnetic ---------- */
  if (fine && !reduce) {
    const cur = $('.cursor');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    let craf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.35; ry += (my - ry) * 0.35;
      cur.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      craf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('mousemove', () => { craf ||= requestAnimationFrame(loop); }, { passive: true });
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

  /* ---------- terrain ---------- */
  const cv = $('#terrain');
  const gl = cv && cv.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (gl) {
    const vert = `#version 300 es
      void main() {
        vec2 v = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
        gl_Position = vec4(v * 2. - 1., 0., 1.);
      }`;
    const frag = `#version 300 es
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime, uScroll, uQuality;
      uniform vec3 uAccent, uMouse, uRipple;
      out vec4 color;

      // Integer hash: a float one rounds differently per GPU and tears the contours along noise cell edges.
      float hash(ivec2 cell) {
        uvec2 v = uvec2(cell) * 1664525u + 1013904223u;
        v.x += v.y * 1664525u;
        v.y += v.x * 1664525u;
        v ^= v >> 16u;
        v.x += v.y * 1664525u;
        return float(v.x >> 8u) / 16777216.;
      }
      float noise(vec2 p) {
        ivec2 i = ivec2(floor(p));
        vec2 f = fract(p);
        vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
        return mix(mix(hash(i), hash(i + ivec2(1, 0)), u.x), mix(hash(i + ivec2(0, 1)), hash(i + ivec2(1, 1)), u.x), u.y);
      }
      float fbm(vec2 p, int octaves) {
        const mat2 turn = mat2(.8, .6, -.6, .8);
        float amp = .5, sum = 0.;
        for (int i = 0; i < octaves; i++) { sum += amp * noise(p); p = turn * p * 2.03 + 7.1; amp *= .5; }
        return sum;
      }
      float contour(float v, float width) {
        float w = max(fwidth(v), 1e-4);
        float line = 1. - smoothstep(0., width, abs(fract(v - .5) - .5) / w);
        return line * (1. - smoothstep(.3, .65, w));
      }
      void main() {
        vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
        vec2 p = uv * 1.7 - vec2(0., uScroll);
        vec2 warp = vec2(fbm(p + uTime * .035, 2), fbm(p + vec2(5.2, 1.3) - uTime * .028, 2)) * 1.3;
        float h = fbm(p + warp * .95, 3);

        float mouse = length(uv - uMouse.xy);
        h += uMouse.z * .13 * exp(-mouse * mouse * 16.);

        float age = uRipple.z;
        float ring = exp(-pow((length(uv - uRipple.xy) - age * .8) * 6., 2.)) * exp(-age * 1.5);
        h += ring * .045;

        float v = h * 24.;
        float light = (.07 * contour(v, 1.1) + .16 * contour(v / 5., 1.5)) * uQuality;
        light *= 1. + 2.2 * uMouse.z * exp(-mouse * mouse * 9.) + 3. * ring;

        vec2 cell = p * 1.25;
        vec2 cross = abs(fract(cell + .5) - .5) * uRes.y / 2.125;
        if ((cross.x < .7 && cross.y < 6.) || (cross.y < .7 && cross.x < 6.)) light += .2;

        vec3 ground = vec3(.039, .039, .059) + uAccent * .012 * floor(v / 5.);
        color = vec4(ground + uAccent * light, 1.);
      }`;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    gl.useProgram(program);
    const uniform = Object.fromEntries(['uRes', 'uTime', 'uScroll', 'uQuality', 'uAccent', 'uMouse', 'uRipple'].map(n => [n, gl.getUniformLocation(program, n)]));

    const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
    const toMap = (x, y) => [(x - innerWidth / 2) / innerHeight, (innerHeight / 2 - y) / innerHeight];
    const accentNow = () => rgb(root.style.getPropertyValue('--accent').trim() || '#c4a6ff');
    let accent = accentNow(), scroll = scrollY, mouse = [0, 0], mouseTarget = [0, 0], strength = 0, strengthTarget = 0;
    let ripple = [0, 0], rippleStart = -1e4, last = 0, quality = 1, frames = 0, windowStart = 0;

    const render = (now) => {
      const target = accentNow();
      accent = accent.map((c, i) => c + (target[i] - c) * .07);
      scroll += (scrollY - scroll) * .12;
      mouse = mouse.map((c, i) => c + (mouseTarget[i] - c) * .14);
      strength += (strengthTarget - strength) * .08;
      gl.uniform2f(uniform.uRes, cv.width, cv.height);
      gl.uniform1f(uniform.uTime, now / 1000);
      gl.uniform1f(uniform.uQuality, quality);
      gl.uniform1f(uniform.uScroll, scroll / innerHeight * .55);
      gl.uniform3f(uniform.uAccent, ...accent);
      gl.uniform3f(uniform.uMouse, mouse[0], mouse[1], strength);
      gl.uniform3f(uniform.uRipple, ripple[0], ripple[1], (now - rippleStart) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const size = () => {
      const dpr = .6 * quality; // contornos finos: meia resolução já basta e custa ~4x menos
      cv.width = innerWidth * dpr;
      cv.height = innerHeight * dpr;
      gl.viewport(0, 0, cv.width, cv.height);
      if (reduce) render(0);
    };
    size();
    addEventListener('resize', size);

    if (!reduce) {
      if (fine) {
        addEventListener('pointermove', e => { mouseTarget = toMap(e.clientX, e.clientY); strengthTarget = 1; }, { passive: true });
        document.documentElement.addEventListener('mouseleave', () => { strengthTarget = 0; });
      }
      { // uma onda de entrada saindo do mosaico
        const r = $('#mosaic').getBoundingClientRect();
        ripple = toMap(r.left + r.width / 2, r.top + r.height * .4);
        rippleStart = performance.now();
      }
      // Parado, o relevo respira a ~8 fps; rolando, com o mouse ou com a onda, sobe para ~30.
      let lastMove = 0;
      addEventListener('scroll', () => { lastMove = performance.now(); }, { passive: true });
      if (fine) addEventListener('pointermove', () => { lastMove = performance.now(); }, { passive: true });
      const loop = (now) => {
        requestAnimationFrame(loop);
        if (document.hidden) { frames = 0; return; }
        const busy = now - lastMove < 900 || now - rippleStart < 2500 || Math.abs(scrollY - scroll) > 1;
        if (now - last < (busy ? 33 : 125)) return;
        last = now;
        if (!busy) { frames = 0; render(now); return; } // só mede o custo no ritmo cheio
        if (!frames) windowStart = now;
        if (++frames > 30) {
          frames = 0;
          if ((now - windowStart) / 30 > 45 && quality > .6) { quality *= .8; size(); }
        }
        render(now);
      };
      requestAnimationFrame(loop);
    }
  }
})();
