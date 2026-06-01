document.addEventListener('DOMContentLoaded', () => {

    if (window.AOS) {
        AOS.init({
            duration: 900,
            once: true,
            offset: 50,
        });
    }

    // ----------------------------------------------------------------------
    // i18n (PT-BR / EN) — bilingual dictionary + language toggle
    // ----------------------------------------------------------------------
    const TYPEWRITER = {
        pt: [
            "Transformando ideias em produto real",
            "Construindo apps mobile com React Native",
            "Integrando IA de verdade em produção",
            "Desenhando gamificação e retenção",
            "Do front-end ao back-end, ponta a ponta",
            "Full-stack: produto, IA e jogos"
        ],
        en: [
            "Turning ideas into real products",
            "Building mobile apps with React Native",
            "Shipping real AI in production",
            "Designing gamification and retention",
            "Front-end to back-end, end to end",
            "Full-stack: product, AI and games"
        ]
    };

    const I18N = {
        pt: {
            meta: {
                title: "Tales Santiago | Desenvolvedor Full-Stack — Produto, Gamificação e IA",
                description: "Desenvolvedor full-stack de Fortaleza. Mobile (React Native), back-ends (.NET/FastAPI/PHP) e três integrações de IA em produção: Woolly, Leap-Notes, Iracema e games autorais."
            },
            nav: { home: "Início", about: "Sobre", projects: "Projetos", journey: "Jornada", contact: "Contato" },
            hero: {
                subtitle: "Desenvolvedor full-stack que constrói da camada de produto à infraestrutura — mobile, web, back-ends em microsserviços e três integrações de IA em produção. Junto engenharia, visão de produto e atenção real à experiência do usuário.",
                cta: "VAMOS CONSTRUIR JUNTOS"
            },
            about: {
                title: "Sobre Mim",
                bio: "Sou desenvolvedor full-stack de Fortaleza-CE e estudante de Ciência da Computação na UECE. Trabalho em produção com TypeScript/React Native, C#/ASP.NET Core, Python/FastAPI e PHP — do front-end mobile e web a back-ends em microsserviços, bancos PostgreSQL/MySQL e integrações de IA. Atuo como ponte entre produto e técnico: desenho mecânicas de engajamento e retenção e as implemento de ponta a ponta, sempre preferindo soluções enxutas a overengineering."
            },
            skill: {
                ts:     { t: "TypeScript & React Native", d: "Stack principal do meu trabalho mobile e web. No Woolly construo o app em Expo/React Native e interfaces reativas em React. TypeScript do front ao back para código seguro e manutenível." },
                csharp: { t: "C# & ASP.NET Core", d: "Back-end do Woolly em ASP.NET Core 8: módulos de gamificação, eventos de domínio e APIs server-authoritative sobre PostgreSQL." },
                python: { t: "Python & FastAPI", d: "Serviços em FastAPI, incluindo o serviço de voz do Woolly (LiveKit/WebRTC), além de automações e scripts de deploy." },
                php:    { t: "PHP — onde tudo começou", d: "Comecei com PHP na universidade e levei a produção: o Portal da História do Ceará e a IAcema rodam em PHP/MySQL, com APIs, padrão MVC e integração de IA." },
                ai:     { t: "LLM & IA Aplicada", d: "Três integrações de LLM em produção: a IAcema (agente com 16 ferramentas SQL), o tutor por voz do Woolly e o ENEMBot. Prompt engineering, tool use e saída estruturada." },
                db:     { t: "PostgreSQL & MySQL", d: "Modelagem relacional e otimização de queries em grande volume — do índice Full-Text do acervo do Portal a esquemas transacionais com Supabase no Leap-Notes." },
                cloud:  { t: "Deploy & DevOps", d: "Coloco produto no ar e mantenho de pé: Docker, VPS, CI/CD, Sentry e deploy automatizado. Da pipeline ao monitoramento em produção." },
                saas:   { t: "Pagamentos & SaaS", d: "No Leap-Notes integro assinaturas e Pix (Stripe e AbacatePay), com planos, gating de paywall e modo convidado — da cobrança à conversão." },
                arch:   { t: "Arquitetura de Sistemas", d: "Projeto sistemas pensando em escala e manutenção: monorepos, microsserviços, eventos de domínio e APIs claras. Padrões que duram e evoluem." },
                game:   { t: "Game Dev & WebGL", d: "Construo games web do zero — motores próprios em WebGL/GLSL e Phaser, física custom, geração procedural e controles mobile-first." },
                ux:     { t: "UX / UI", d: "Desenho a experiência antes de codar: gamificação, retenção, onboarding e 'game feel'. Figma para prototipar e atenção real ao usuário final." }
            },
            projects: { title: "Projetos em Destaque" },
            proj: {
                leapnotes: { blurb: "SaaS de notas e estudo para medicina. Como cofundador e engine técnico, conduzo produto, o editor rico (TipTap), pagamentos e toda a base de engenharia." },
                phc:       { blurb: "Acervo digital de jornais e fatos históricos, com a IAcema — uma assistente de IA que responde com base direta no acervo, via agente com ferramentas SQL." },
                geosumo:   { blurb: "Arena-fighter 3D em WebGL puro, com física custom, IA de combate e controles mobile-first. Motor e áudio escritos do zero." },
                hylomorph: { blurb: "\"God-game\" em Phaser sobre criar, cruzar e evoluir vida digital — genética, crafting e raridade." },
                geolife:   { blurb: "Pet-sim em canvas (estilo Tamagotchi) com arte procedural e vocabulário completo de gestos. Touch-native." },
                enembot:   { blurb: "Tutor conversacional gamificado para o ENEM, no método Feynman: pontuação, ofensivas, dificuldade adaptativa e dicas socráticas." }
            },
            exp: {
                title: "Minha Jornada",
                woolly:  { role: "Desenvolvedor Full-Stack", date: "fev 2026 — presente", desc: "Desenvolvedor full-stack e autor principal da camada de gamificação de um app de tutoria por voz com IA (Expo/React Native + ASP.NET Core 8 + FastAPI). Economia de XP e níveis, ligas competitivas, ofensivas, quizzes e push-to-talk por voz." },
                leap:    { role: "Cofundador & Engine Técnico", date: "2025 — presente", desc: "Cofundador e principal responsável técnico de um SaaS de notas para medicina (React + Supabase + Stripe/AbacatePay). Editor rico em TipTap, modo convidado, pagamentos, ativação e a base de engenharia do produto." },
                phc:     { role: "Desenvolvedor & Autor da IAcema", date: "2024 — presente", desc: "Manutenção do portal histórico em PHP/MySQL e autoria da IAcema, assistente de IA em arquitetura de agente com 16 ferramentas SQL sobre o acervo. Stakeholder: Prof. Gildácio Sá." },
                concern: { role: "Pesquisador Científico", date: "abr 2024 — set 2024", desc: "Aplicação de Machine Learning para predição de riscos clínicos em pacientes no projeto CONCERN." },
                aplis:   { role: "Estágio em Engenharia de Software", date: "mai 2023 — abr 2024", desc: "Desenvolvimento back-end e front-end com PHP e JavaScript, prototipação no Figma e aplicação de conceitos de UX." },
                pet:     { role: "Bolsista PET-CC", date: "jan 2022 — mai 2023", desc: "Atuação em projetos de ensino, pesquisa e extensão no Programa de Educação Tutorial em Ciência da Computação." }
            },
            contact: {
                title: "Vamos construir algo juntos?",
                intro: "Estou aberto a oportunidades — remotas e internacionais — em produto, mobile, IA aplicada e gamificação. Se você tem uma ideia ou uma vaga, vamos conversar.",
                name: "Nome *", email: "E-mail *", subject: "Assunto *", message: "Mensagem *",
                placeholder: "Conte-me sobre seu projeto ou oportunidade...",
                send: "Enviar Mensagem", emailDirect: "✉️ E-mail Direto", replyTime: "Respondo em até 24 horas"
            },
            footer: { text: "Projetado e construído por Tales Santiago." },
            popup: { live: "🚀 Ver ao Vivo", code: "💻 Ver Código" },
            ui: {
                sending: "Enviando...", emailOpened: "E-mail aberto ✓",
                successMsg: "Cliente de e-mail aberto. Sua mensagem está pronta para envio.",
                errorBtn: "Erro. Tente novamente",
                errorMsg: "Não foi possível abrir o e-mail. Use o WhatsApp ou o e-mail direto."
            }
        },
        en: {
            meta: {
                title: "Tales Santiago | Full-Stack Developer — Product, Gamification & Applied AI",
                description: "Full-stack developer from Brazil. Mobile (React Native), back-ends (.NET/FastAPI/PHP) and three AI integrations in production: Woolly, Leap-Notes, Iracema and original games."
            },
            nav: { home: "Home", about: "About", projects: "Projects", journey: "Journey", contact: "Contact" },
            hero: {
                subtitle: "Full-stack developer building from the product layer down to infrastructure — mobile, web, microservice back-ends and three AI integrations in production. I combine engineering, product sense and real care for the user experience.",
                cta: "LET'S BUILD TOGETHER"
            },
            about: {
                title: "About Me",
                bio: "I'm a full-stack developer from Fortaleza, Brazil, and a Computer Science student at UECE. I ship production code in TypeScript/React Native, C#/ASP.NET Core, Python/FastAPI and PHP — from mobile and web front-ends to microservice back-ends, PostgreSQL/MySQL databases and AI integrations. I bridge product and engineering: I design engagement and retention mechanics and build them end to end, always favoring lean solutions over overengineering."
            },
            skill: {
                ts:     { t: "TypeScript & React Native", d: "The core stack of my mobile and web work. At Woolly I build the app in Expo/React Native and reactive interfaces in React. TypeScript from front to back for safe, maintainable code." },
                csharp: { t: "C# & ASP.NET Core", d: "Woolly's back-end in ASP.NET Core 8: gamification modules, domain events and server-authoritative APIs over PostgreSQL." },
                python: { t: "Python & FastAPI", d: "FastAPI services, including Woolly's voice service (LiveKit/WebRTC), plus automation and deploy scripts." },
                php:    { t: "PHP — where it started", d: "I started with PHP at university and took it to production: Portal da História do Ceará and Iracema run on PHP/MySQL, with APIs, MVC and AI integration." },
                ai:     { t: "LLM & Applied AI", d: "Three LLM integrations in production: Iracema (an agent with 16 SQL tools), Woolly's voice tutor and ENEMBot. Prompt engineering, tool use and structured output." },
                db:     { t: "PostgreSQL & MySQL", d: "Relational modeling and query optimization at scale — from the Portal archive's Full-Text index to transactional schemas with Supabase on Leap-Notes." },
                cloud:  { t: "Deploy & DevOps", d: "I get products live and keep them up: Docker, VPS, CI/CD, Sentry and automated deploys. From pipeline to production monitoring." },
                saas:   { t: "Payments & SaaS", d: "On Leap-Notes I integrate subscriptions and Pix (Stripe and AbacatePay), with tiers, paywall gating and guest mode — from billing to conversion." },
                arch:   { t: "Systems Architecture", d: "I design systems for scale and maintainability: monorepos, microservices, domain events and clean APIs. Patterns that last and evolve." },
                game:   { t: "Game Dev & WebGL", d: "I build web games from scratch — custom engines in WebGL/GLSL and Phaser, custom physics, procedural generation and mobile-first controls." },
                ux:     { t: "UX / UI", d: "I design the experience before coding: gamification, retention, onboarding and game feel. Figma for prototyping and real attention to the end user." }
            },
            projects: { title: "Featured Projects" },
            proj: {
                leapnotes: { blurb: "Note-taking and study SaaS for medicine. As co-founder and technical engine, I drive product, the rich editor (TipTap), payments and the whole engineering foundation." },
                phc:       { blurb: "Digital archive of historical newspapers and facts, with Iracema — an AI assistant that answers grounded directly in the archive, via an agent with SQL tools." },
                geosumo:   { blurb: "3D arena fighter in pure WebGL, with custom physics, combat AI and mobile-first controls. Engine and audio written from scratch." },
                hylomorph: { blurb: "A Phaser \"god-game\" about creating, breeding and evolving digital life — genetics, crafting and rarity." },
                geolife:   { blurb: "Canvas pet-sim (Tamagotchi-style) with procedural art and a full gesture vocabulary. Touch-native." },
                enembot:   { blurb: "Gamified conversational tutor for the ENEM exam, using the Feynman method: scoring, streaks, adaptive difficulty and Socratic hints." }
            },
            exp: {
                title: "My Journey",
                woolly:  { role: "Full-Stack Developer", date: "Feb 2026 — Present", desc: "Full-stack developer and lead author of the gamification layer for an AI voice-tutoring app (Expo/React Native + ASP.NET Core 8 + FastAPI). XP and leveling economy, competitive leagues, streaks, quizzes and push-to-talk voice." },
                leap:    { role: "Co-Founder & Technical Engine", date: "2025 — Present", desc: "Co-founder and lead engineer of a medical note-taking SaaS (React + Supabase + Stripe/AbacatePay). TipTap rich editor, guest mode, payments, activation and the product's engineering foundation." },
                phc:     { role: "Developer & Author of Iracema", date: "2024 — Present", desc: "Maintain the historical portal in PHP/MySQL and author Iracema, an AI assistant in an agent architecture with 16 SQL tools over the archive. Stakeholder: Prof. Gildácio Sá." },
                concern: { role: "Research Scientist", date: "Apr 2024 — Sep 2024", desc: "Applied Machine Learning to predict clinical risk in patients on the CONCERN project." },
                aplis:   { role: "Software Engineering Intern", date: "May 2023 — Apr 2024", desc: "Back-end and front-end development with PHP and JavaScript, prototyping in Figma and applying UX concepts." },
                pet:     { role: "PET-CC Fellow", date: "Jan 2022 — May 2023", desc: "Teaching, research and outreach projects in the Tutorial Education Program in Computer Science." }
            },
            contact: {
                title: "Let's build something together?",
                intro: "I'm open to opportunities — remote and international — in product, mobile, applied AI and gamification. If you have an idea or a role, let's talk.",
                name: "Name *", email: "Email *", subject: "Subject *", message: "Message *",
                placeholder: "Tell me about your project or opportunity...",
                send: "Send Message", emailDirect: "✉️ Direct Email", replyTime: "I reply within 24 hours"
            },
            footer: { text: "Designed and built by Tales Santiago." },
            popup: { live: "🚀 Live Demo", code: "💻 Source Code" },
            ui: {
                sending: "Sending...", emailOpened: "Email opened ✓",
                successMsg: "Email client opened. Your message is ready to send.",
                errorBtn: "Error. Try again",
                errorMsg: "Couldn't open email. Use WhatsApp or direct email."
            }
        }
    };

    function getInitialLang() {
        const saved = localStorage.getItem('lang');
        if (saved === 'pt' || saved === 'en') return saved;
        const navLang = (navigator.language || navigator.userLanguage || 'pt').toLowerCase();
        return navLang.startsWith('pt') ? 'pt' : 'en';
    }
    let currentLang = getInitialLang();

    function tr(key) {
        const parts = key.split('.');
        let node = I18N[currentLang];
        for (const p of parts) {
            if (node == null) return null;
            node = node[p];
        }
        return (node == null) ? null : node;
    }

    function applyLang(lang, persist) {
        currentLang = (lang === 'en') ? 'en' : 'pt';
        document.documentElement.lang = currentLang === 'en' ? 'en' : 'pt-BR';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const v = tr(el.getAttribute('data-i18n'));
            if (v != null) el.textContent = v;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const v = tr(el.getAttribute('data-i18n-placeholder'));
            if (v != null) el.setAttribute('placeholder', v);
        });

        const meta = I18N[currentLang].meta;
        if (meta) {
            document.title = meta.title;
            const md = document.querySelector('meta[name="description"]');
            if (md) md.setAttribute('content', meta.description);
        }

        // typewriter: swap source and reset indices (avoids indexing past a shorter string)
        typewriterTexts = TYPEWRITER[currentLang];
        currentTextIndex = 0;
        currentCharIndex = 0;
        isDeleting = false;
        if (typewriterElement) typewriterElement.textContent = '';

        const langLabel = document.getElementById('lang-label');
        if (langLabel) langLabel.textContent = currentLang === 'pt' ? 'EN' : 'PT';

        if (persist) localStorage.setItem('lang', currentLang);
    }

    // Navbar scroll effect - muda cor quando rola
    const header = document.querySelector('header');
    let scrolled = false;

    function handleScroll() {
        const isScrolled = window.scrollY > 50;
        
        if (isScrolled !== scrolled) {
            scrolled = isScrolled;
            header.classList.toggle('header-scrolled', scrolled);
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Skills tooltips interativas
    const skillCards = document.querySelectorAll('.skill-card');
    let activeTooltip = null;

    function showTooltip(card) {
        // Esconder tooltip ativo se existir
        if (activeTooltip && activeTooltip !== card) {
            const activeTooltipElement = activeTooltip.querySelector('.skill-tooltip');
            activeTooltipElement?.classList.remove('show');
        }

        const tooltip = card.querySelector('.skill-tooltip');
        if (tooltip) {
            tooltip.classList.add('show');
            activeTooltip = card;
        }
    }

    function hideTooltip(card) {
        const tooltip = card.querySelector('.skill-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
            if (activeTooltip === card) {
                activeTooltip = null;
            }
        }
    }

    skillCards.forEach(card => {
        // Mouse events
        card.addEventListener('mouseenter', () => showTooltip(card));
        card.addEventListener('mouseleave', () => hideTooltip(card));
        
        // Keyboard events for accessibility
        card.addEventListener('focus', () => showTooltip(card));
        card.addEventListener('blur', () => hideTooltip(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const tooltip = card.querySelector('.skill-tooltip');
                tooltip?.classList.toggle('show');
            }
        });
    });

    // Esconder tooltips quando clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.skill-card') && activeTooltip) {
            hideTooltip(activeTooltip);
        }
    });

    let typewriterTexts = TYPEWRITER[currentLang];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typewriterSpeed = 100;

    const typewriterElement = document.getElementById('typewriter-text');

    function typewriterEffect() {
        const currentText = typewriterTexts[currentTextIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typewriterSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typewriterSpeed = 100;
        }

        if (!isDeleting && currentCharIndex === currentText.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
        }

        setTimeout(typewriterEffect, typewriterSpeed);
    }

    setTimeout(typewriterEffect, 1500);

    const swiper = window.Swiper ? new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        }
    }) : null;

    const projectCards = document.querySelectorAll('.project-card');
    
    // Enhanced project card effects with theming
    projectCards.forEach(card => {
        // Mouse tracking for glow effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });

        // Add thematic effects based on card key
        const key = card.getAttribute('data-key');
        initCardThematicEffects(card, key);
    });

    // Initialize thematic effects for each project card
    function initCardThematicEffects(card, key) {
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'card-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;

        // Add theme-specific particles
        if (key === 'leapnotes') {
            createMedicalParticles(particleContainer);
            addMedicalHoverEffect(card);
        } else if (key === 'phc') {
            createVintageSparkles(particleContainer);
            addVintageHoverEffect(card);
        } else if (key === 'geosumo') {
            createMatrixEffect(particleContainer);
            addTerminalHoverEffect(card);
        } else if (key === 'hylomorph') {
            createMatrixEffect(particleContainer);
            addTerminalHoverEffect(card);
        } else if (key === 'geolife') {
            createHeartParticles(particleContainer);
            addRomanticHoverEffect(card);
        } else if (key === 'enembot') {
            createAcademicStars(particleContainer);
            addAcademicHoverEffect(card);
        }

        card.appendChild(particleContainer);

        // Add floating decoration
        addFloatingDecoration(card, key);
    }

    // Particle creation functions
    function createMedicalParticles(container) {
        for (let i = 0; i < 4; i++) {
            const cross = document.createElement('div');
            cross.innerHTML = '+';
            cross.style.cssText = `
                position: absolute;
                color: rgba(0, 170, 255, 0.3);
                font-size: 18px;
                font-weight: bold;
                top: ${Math.random() * 80 + 10}%;
                left: ${Math.random() * 80 + 10}%;
                animation: medical-float ${3 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(cross);
        }
    }

    function createBasketballTrails(container) {
        for (let i = 0; i < 6; i++) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 140, 66, 0.6);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: basketball-trail ${2 + Math.random()}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(trail);
        }
    }

    function createVintageSparkles(container) {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✦';
            sparkle.style.cssText = `
                position: absolute;
                color: rgba(218, 165, 32, 0.4);
                font-size: ${8 + Math.random() * 12}px;
                top: ${Math.random() * 90 + 5}%;
                left: ${Math.random() * 90 + 5}%;
                animation: vintage-twinkle ${4 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 3}s;
            `;
            container.appendChild(sparkle);
        }
    }

    function createHeartParticles(container) {
        for (let i = 0; i < 7; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '♥';
            heart.style.cssText = `
                position: absolute;
                color: rgba(255, 105, 180, 0.4);
                font-size: ${6 + Math.random() * 10}px;
                top: ${Math.random() * 85 + 5}%;
                left: ${Math.random() * 85 + 5}%;
                animation: heart-float ${2.5 + Math.random() * 1.5}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(heart);
        }
    }

    function createMatrixEffect(container) {
        for (let i = 0; i < 10; i++) {
            const code = document.createElement('div');
            code.innerHTML = ['0', '1', '{', '}', ';', '*', '/', 'int', 'ptr'][Math.floor(Math.random() * 9)];
            code.style.cssText = `
                position: absolute;
                color: rgba(0, 255, 65, 0.3);
                font-family: 'Courier New', monospace;
                font-size: ${8 + Math.random() * 6}px;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: matrix-rain ${3 + Math.random() * 2}s linear infinite;
                animation-delay: ${Math.random() * 3}s;
            `;
            container.appendChild(code);
        }
    }

    function createAcademicStars(container) {
        for (let i = 0; i < 6; i++) {
            const star = document.createElement('div');
            star.innerHTML = '⭐';
            star.style.cssText = `
                position: absolute;
                font-size: ${6 + Math.random() * 8}px;
                top: ${Math.random() * 90 + 5}%;
                left: ${Math.random() * 90 + 5}%;
                animation: academic-twinkle ${3 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: 0.4;
            `;
            container.appendChild(star);
        }
    }

    // Hover effect functions
    function addMedicalHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.filter = 'drop-shadow(0 0 20px rgba(0, 170, 255, 0.8))';
            createRippleEffect(card);
        });
        card.addEventListener('mouseleave', () => {
            card.style.filter = '';
        });
    }

    function addBasketballHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.animation = 'basketball-shake 0.5s ease-in-out infinite';
            createBounceEffect(card);
        });
        card.addEventListener('mouseleave', () => {
            card.style.animation = '';
        });
    }

    function addVintageHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.filter = 'sepia(0.3) drop-shadow(0 0 15px rgba(218, 165, 32, 0.6))';
            createSparkleEffect(card);
        });
        card.addEventListener('mouseleave', () => {
            card.style.filter = '';
        });
    }

    function addRomanticHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.animation = 'heart-glow 1s ease-in-out infinite alternate';
            createHeartBurst(card);
        });
        card.addEventListener('mouseleave', () => {
            card.style.animation = '';
        });
    }

    function addTerminalHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.animation = 'terminal-glow 2s ease-in-out infinite alternate';
            createTerminalEffect(card);
        });
        card.addEventListener('mouseleave', () => {
            card.style.animation = '';
        });
    }

    function addAcademicHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(74, 144, 226, 0.6))';
            createStarBurst(card);
        });
        card.addEventListener('mouseleave', () => {
            card.style.filter = '';
        });
    }

    // Special effect functions
    function createRippleEffect(card) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0, 170, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple-expand 0.8s ease-out;
            pointer-events: none;
            z-index: 5;
        `;
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    function createBounceEffect(card) {
        for (let i = 0; i < 3; i++) {
            const ball = document.createElement('div');
            ball.innerHTML = '🏀';
            ball.style.cssText = `
                position: absolute;
                top: ${Math.random() * 50 + 25}%;
                left: ${Math.random() * 50 + 25}%;
                font-size: 16px;
                animation: bounce-out 1s ease-out forwards;
                animation-delay: ${i * 0.2}s;
                pointer-events: none;
                z-index: 5;
            `;
            card.appendChild(ball);
            setTimeout(() => ball.remove(), 1200);
        }
    }

    function createSparkleEffect(card) {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                top: ${Math.random() * 80 + 10}%;
                left: ${Math.random() * 80 + 10}%;
                font-size: 12px;
                animation: sparkle-burst 1.5s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                pointer-events: none;
                z-index: 5;
            `;
            card.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1500);
        }
    }

    function createHeartBurst(card) {
        for (let i = 0; i < 4; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                font-size: 14px;
                animation: heart-burst 1.2s ease-out forwards;
                animation-delay: ${i * 0.2}s;
                transform: translate(-50%, -50%) rotate(${i * 90}deg);
                pointer-events: none;
                z-index: 5;
            `;
            card.appendChild(heart);
            setTimeout(() => heart.remove(), 1400);
        }
    }

    function createTerminalEffect(card) {
        const terminal = document.createElement('div');
        terminal.innerHTML = '> LOADING...';
        terminal.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 15px;
            color: #00ff41;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            animation: terminal-typing 2s ease-in-out;
            pointer-events: none;
            z-index: 5;
        `;
        card.appendChild(terminal);
        setTimeout(() => terminal.remove(), 2000);
    }

    function createStarBurst(card) {
        for (let i = 0; i < 6; i++) {
            const star = document.createElement('div');
            star.innerHTML = '⭐';
            star.style.cssText = `
                position: absolute;
                top: ${30 + Math.random() * 40}%;
                left: ${20 + Math.random() * 60}%;
                font-size: 12px;
                animation: star-explode 1.5s ease-out forwards;
                animation-delay: ${i * 0.15}s;
                pointer-events: none;
                z-index: 5;
            `;
            card.appendChild(star);
            setTimeout(() => star.remove(), 1700);
        }
    }

    // Floating decorations
    function addFloatingDecoration(card, key) {
        const decoration = document.createElement('div');
        decoration.className = 'card-decoration';

        let decorationContent = '';
        let animationClass = '';

        switch(key) {
            case 'leapnotes':
                decorationContent = '📝';
                animationClass = 'love-pulse';
                break;
            case 'phc':
                decorationContent = '🏛️';
                animationClass = 'monument-sway';
                break;
            case 'geosumo':
                decorationContent = '🎮';
                animationClass = 'gear-spin';
                break;
            case 'hylomorph':
                decorationContent = '🧬';
                animationClass = 'dna-rotate';
                break;
            case 'geolife':
                decorationContent = '🐾';
                animationClass = 'love-pulse';
                break;
            case 'enembot':
                decorationContent = '📚';
                animationClass = 'book-flip';
                break;
        }
        
        decoration.innerHTML = decorationContent;
        decoration.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 24px;
            opacity: 0.2;
            z-index: 1;
            animation: ${animationClass} 4s ease-in-out infinite;
            pointer-events: none;
        `;
        
        card.appendChild(decoration);
    }

    // Add CSS animations dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes ripple-expand {
            0% { width: 0; height: 0; opacity: 1; }
            100% { width: 300px; height: 300px; opacity: 0; }
        }
        
        @keyframes bounce-out {
            0% { transform: scale(1) translateY(0); opacity: 1; }
            100% { transform: scale(0.3) translateY(-50px); opacity: 0; }
        }
        
        @keyframes sparkle-burst {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
        }
        
        @keyframes heart-burst {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) translateX(40px) scale(1.2); opacity: 0; }
        }
        
        @keyframes terminal-typing {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        @keyframes star-explode {
            0% { transform: scale(0); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(0.8) translateY(-20px); opacity: 0; }
        }
        
        @keyframes medical-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-15px) rotate(90deg); opacity: 0.6; }
        }
        
        @keyframes basketball-trail {
            0% { transform: translateX(-50px) translateY(0px); opacity: 1; }
            100% { transform: translateX(50px) translateY(-30px); opacity: 0; }
        }
        
        @keyframes vintage-twinkle {
            0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.8; transform: scale(1.3) rotate(180deg); }
        }
        
        @keyframes heart-float {
            0%, 100% { transform: translateY(0px); opacity: 0.4; }
            50% { transform: translateY(-20px); opacity: 0.8; }
        }
        
        @keyframes matrix-rain {
            0% { transform: translateY(-20px); opacity: 1; }
            100% { transform: translateY(100px); opacity: 0; }
        }
        
        @keyframes academic-twinkle {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes dna-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes trophy-shine {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes monument-sway {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
        }
        
        @keyframes love-pulse {
            0%, 100% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.4); opacity: 0.6; }
        }
        
        @keyframes gear-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes book-flip {
            0%, 100% { transform: rotateY(0deg); }
            50% { transform: rotateY(180deg); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const sunIcon = themeToggleButton.querySelector('.icon-sun');
    const moonIcon = themeToggleButton.querySelector('.icon-moon');
    const htmlEl = document.documentElement;

    function setInitialTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        htmlEl.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline';
        } else {
            sunIcon.style.display = 'inline';
            moonIcon.style.display = 'none';
        }
    }

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        sunIcon.style.display = newTheme === 'dark' ? 'inline' : 'none';
        moonIcon.style.display = newTheme === 'light' ? 'inline' : 'none';
    });

    setInitialTheme();

    let scene, camera, renderer, points;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function init3D() {
        const container = document.getElementById('hero-canvas');
        if (!container || !window.THREE) return;

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        scene = new THREE.Scene();
        
        const particles = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particles * 3);

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = Math.random() * 2000 - 1000;
            positions[i + 1] = Math.random() * 2000 - 1000;
            positions[i + 2] = Math.random() * 2000 - 1000;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const theme = htmlEl.getAttribute('data-theme');
        const color = theme === 'dark' ? 0x00aaff : 0x007bff;

        const material = new THREE.PointsMaterial({
            color: color,
            size: 2,
            transparent: true,
            opacity: 0.7
        });
        points = new THREE.Points(geometry, material);
        scene.add(points);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
        
        animate();
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const time = Date.now() * 0.00005;
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        points.rotation.x = time * 0.25;
        points.rotation.y = time * 0.5;
        renderer.render(scene, camera);
    }

    // WebGL can fail (no GPU / blocked context) — never let it break the page.
    try { init3D(); } catch (e) { /* hero particles are decorative */ }

    const popupOverlay = document.getElementById('project-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const popupGallery = document.getElementById('popup-gallery');
    const popupCloseBtn = document.getElementById('popup-close-btn');
    const popupLiveLink = document.getElementById('popup-live-link');
    const popupCodeLink = document.getElementById('popup-code-link');
    const popupMetrics = document.getElementById('popup-metrics');

    // Métricas por projeto (chave = data-key). label/value podem ser {pt,en}.
    const metricsMap = {
        leapnotes: [
            { label: { pt: 'Usuários Ativos', en: 'Active Users' }, value: '2.500+' },
            { label: { pt: 'Tempo Médio de Sessão', en: 'Avg. Session' }, value: '18 min' },
            { label: { pt: 'Feedbacks Positivos', en: 'Positive Feedback' }, value: '97%' }
        ],
        phc: [
            { label: { pt: 'Documentos Indexados', en: 'Indexed Documents' }, value: '8.000+' },
            { label: { pt: 'Consultas Mensais', en: 'Monthly Queries' }, value: '1.200+' },
            { label: { pt: 'Uptime', en: 'Uptime' }, value: '99.9%' }
        ],
        geosumo: [
            { label: { pt: 'Motor', en: 'Engine' }, value: { pt: 'WebGL/GLSL próprio', en: 'Custom WebGL/GLSL' } },
            { label: { pt: 'Física', en: 'Physics' }, value: { pt: 'Custom', en: 'Custom' } },
            { label: { pt: 'Áudio', en: 'Audio' }, value: { pt: 'Procedural', en: 'Procedural' } }
        ],
        hylomorph: [
            { label: { pt: 'Engine', en: 'Engine' }, value: 'Phaser 3' },
            { label: { pt: 'Sistemas', en: 'Systems' }, value: { pt: 'Genética + Crafting', en: 'Genetics + Crafting' } },
            { label: { pt: 'IA', en: 'AI' }, value: { pt: 'Steering behaviors', en: 'Steering behaviors' } }
        ],
        geolife: [
            { label: { pt: 'Renderizador', en: 'Renderer' }, value: { pt: 'Canvas (pixel)', en: 'Canvas (pixel)' } },
            { label: { pt: 'Gestos', en: 'Gestures' }, value: { pt: 'Toque/segurar/pinçar', en: 'Tap/hold/pinch' } },
            { label: { pt: 'Plataforma', en: 'Platform' }, value: { pt: 'Mobile-first', en: 'Mobile-first' } }
        ],
        enembot: [
            { label: { pt: 'Método', en: 'Method' }, value: 'Feynman' },
            { label: { pt: 'Stack', en: 'Stack' }, value: 'Next.js + OpenAI' },
            { label: { pt: 'Gamificação', en: 'Gamification' }, value: { pt: 'XP/Ofensiva/DDA', en: 'XP/Streak/DDA' } }
        ]
    };

    // Links por projeto (chave = data-key). null = botão escondido.
    const linksMap = {
        leapnotes: { live: 'https://medleapbr.com', code: null },
        phc: { live: 'https://ceara.pro.br', code: null },
        geosumo: { live: 'https://taleszin.github.io/geosumo/', code: 'https://github.com/taleszin/geosumo' },
        hylomorph: { live: 'https://taleszin.github.io/game/', code: 'https://github.com/taleszin/game' },
        geolife: { live: 'https://taleszin.github.io/geolife/', code: 'https://github.com/taleszin/geolife' },
        enembot: { live: null, code: null }
    };

    function localized(v) {
        return (v && typeof v === 'object') ? (v[currentLang] != null ? v[currentLang] : v.pt) : v;
    }
    function setPopupLink(el, url) {
        if (url) { el.href = url; el.style.display = ''; }
        else { el.removeAttribute('href'); el.style.display = 'none'; }
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-key');
            const h3 = card.querySelector('h3');
            const title = h3 ? h3.textContent : (key || '');
            let techCopy = card.getAttribute('data-tech') || '';
            const techEn = card.getAttribute('data-tech-en');
            if (currentLang === 'en' && techEn) techCopy = techEn;
            const imagesAttr = card.getAttribute('data-images') || '';
            const images = imagesAttr ? imagesAttr.split(',') : [];

            popupTitle.textContent = title;
            popupText.textContent = techCopy;
            popupGallery.innerHTML = '';

            popupMetrics.innerHTML = '';
            if (metricsMap[key]) {
                metricsMap[key].forEach(metric => {
                    const metricDiv = document.createElement('div');
                    metricDiv.className = 'project-metric';
                    metricDiv.innerHTML = `
                        <div class="metric-value">${localized(metric.value)}</div>
                        <div class="metric-label">${localized(metric.label)}</div>
                    `;
                    popupMetrics.appendChild(metricDiv);
                });
            }

            const links = linksMap[key] || {};
            setPopupLink(popupLiveLink, links.live);
            setPopupLink(popupCodeLink, links.code);

            images.forEach(imgSrc => {
                if(imgSrc.trim()) {
                    const img = document.createElement('img');
                    img.src = imgSrc.trim();
                    img.alt = `${title}`;
                    img.style.cursor = 'zoom-in';
                    popupGallery.appendChild(img);
                }
            });

            setTimeout(() => {
                if (window.mediumZoom) {
                    mediumZoom('.popup-gallery img', {
                        margin: 24,
                        background: 'rgba(0,0,0,0.95)',
                        scrollOffset: 40,
                        metaClick: false
                    });
                }
            }, 100);

            document.body.classList.add('modal-open');
            popupOverlay.classList.add('active');
        });
    });

    function closePopup() {
        document.body.classList.remove('modal-open');
        popupOverlay.classList.remove('active');
        if (window.mediumZoom) {
            const zoom = mediumZoom('.popup-gallery img');
            zoom.detach();
        }
    }

    popupCloseBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            submitBtn.disabled = true;
            submitBtn.textContent = tr('ui.sending');
            submitBtn.style.opacity = '0.7';

            try {
                const emailBody = `Nome: ${data.name}%0A` +
                                `Email: ${data.email}%0A` +
                                `Assunto: ${data.subject}%0A%0A` +
                                `Mensagem:%0A${data.message}`;

                const mailtoLink = `mailto:santiagold116@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${emailBody}`;

                setTimeout(() => {
                    window.location.href = mailtoLink;

                    submitBtn.textContent = tr('ui.emailOpened');
                    submitBtn.style.background = '#28a745';
                    submitBtn.style.opacity = '1';

                    showStatus(tr('ui.successMsg'), 'success');
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = tr('contact.send');
                        submitBtn.style.background = 'var(--primary-color)';
                    }, 3000);
                }, 800);

            } catch (error) {
                submitBtn.textContent = tr('ui.errorBtn');
                submitBtn.style.background = '#dc3545';
                submitBtn.style.opacity = '1';

                showStatus(tr('ui.errorMsg'), 'error');

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = tr('contact.send');
                    submitBtn.style.background = 'var(--primary-color)';
                }, 3000);
            }
        });
    }

    const whatsappLinks = document.querySelectorAll('.contact-action.whatsapp');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });

    // Language toggle
    const langToggleButton = document.getElementById('lang-toggle-btn');
    if (langToggleButton) {
        langToggleButton.addEventListener('click', () => {
            applyLang(currentLang === 'pt' ? 'en' : 'pt', true);
        });
    }

    // Mobile nav (hamburger)
    const navToggle = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        });
        navMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Apply detected/saved language on load (no persist)
    applyLang(currentLang, false);
});