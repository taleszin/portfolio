document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        duration: 900,
        once: true,
        offset: 50,
    });

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

    const typewriterTexts = [
        "Transformando Ideias em Realidade Digital",
        "Criando Soluções Inovadoras com IA",
        "Desenvolvendo Software que Resolve Problemas Reais",
        "Construindo o Futuro com Código Inteligente",
        "Arquitetando Sistemas Robustos e Escaláveis",
        "Inovando com Tecnologia e Design"
    ];

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

    const swiper = new Swiper('.swiper-container', {
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
    });

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

        // Add thematic effects based on card title
        const title = card.getAttribute('data-title');
        initCardThematicEffects(card, title);
    });

    // Initialize thematic effects for each project card
    function initCardThematicEffects(card, title) {
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
        if (title === 'MedLeap AI') {
            createMedicalParticles(particleContainer);
            addMedicalHoverEffect(card);
        } else if (title === 'ShotMap Basketball') {
            createBasketballTrails(particleContainer);
            addBasketballHoverEffect(card);
        } else if (title === 'Portal da História do Ceará') {
            createVintageSparkles(particleContainer);
            addVintageHoverEffect(card);
        } else if (title === "Valentine's Day") {
            createHeartParticles(particleContainer);
            addRomanticHoverEffect(card);
        } else if (title === 'Sistema de Gerenciamento de Inventário em C') {
            createMatrixEffect(particleContainer);
            addTerminalHoverEffect(card);
        } else if (title === 'Gerenciador de Atividades Acadêmicas') {
            createAcademicStars(particleContainer);
            addAcademicHoverEffect(card);
        }

        card.appendChild(particleContainer);
        
        // Add floating decoration
        addFloatingDecoration(card, title);
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
    function addFloatingDecoration(card, title) {
        const decoration = document.createElement('div');
        decoration.className = 'card-decoration';
        
        let decorationContent = '';
        let animationClass = '';
        
        switch(title) {
            case 'MedLeap AI':
                decorationContent = '🧬';
                animationClass = 'dna-rotate';
                break;
            case 'ShotMap Basketball':
                decorationContent = '🏆';
                animationClass = 'trophy-shine';
                break;
            case 'Portal da História do Ceará':
                decorationContent = '🏛️';
                animationClass = 'monument-sway';
                break;
            case "Valentine's Day":
                decorationContent = '💕';
                animationClass = 'love-pulse';
                break;
            case 'Sistema de Gerenciamento de Inventário em C':
                decorationContent = '⚙️';
                animationClass = 'gear-spin';
                break;
            case 'Gerenciador de Atividades Acadêmicas':
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
        if (!container) return;
        
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

    init3D();

    const popupOverlay = document.getElementById('project-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const popupGallery = document.getElementById('popup-gallery');
    const popupCloseBtn = document.getElementById('popup-close-btn');
    const popupLiveLink = document.getElementById('popup-live-link');
    const popupCodeLink = document.getElementById('popup-code-link');
    const popupMetrics = document.getElementById('popup-metrics');

    // Métricas para cada projeto
    const metricsMap = {
        'MedLeap AI': [
            { label: 'Usuários Ativos', value: '2.500+' },
            { label: 'Tempo Médio de Sessão', value: '18 min' },
            { label: 'Feedbacks Positivos', value: '97%' }
        ],
        'ShotMap Basketball': [
            { label: 'Arremessos Registrados', value: '12.000+' },
            { label: 'Atletas Impactados', value: '300+' },
            { label: 'Precisão Média', value: '85%' }
        ],
        'Portal da História do Ceará': [
            { label: 'Documentos Indexados', value: '8.000+' },
            { label: 'Consultas Mensais', value: '1.200+' },
            { label: 'Uptime', value: '99.9%' }
        ],
        "Valentine's Day": [
            { label: 'Visualizações', value: '5.000+' },
            { label: 'Performance', value: '60 FPS' },
            { label: 'Compatibilidade', value: '95%' }
        ],
        'Sistema de Gerenciamento de Inventário em C': [
            { label: 'Registros Gerenciados', value: '1.000+' },
            { label: 'Tempo de Execução', value: 'Instantâneo' },
            { label: 'Uso de Memória', value: 'Otimizado' }
        ],
        'Gerenciador de Atividades Acadêmicas': [
            { label: 'Horas Registradas', value: '4.500+' },
            { label: 'Usuários', value: '600+' },
            { label: 'Satisfação', value: '4.8/5' }
        ]
    };

    // Links para cada projeto
    const linksMap = {
        'MedLeap AI': { live: 'https://medleapbr.com', code: '#' },
        'ShotMap Basketball': { live: '#', code: 'https://github.com/taleszin/racha3x3' },
        'Portal da História do Ceará': { live: 'https://ceara.pro.br', code: '#' },
        "Valentine's Day": { live: 'https://taleszin.github.io/valentine_days/', code: 'https://github.com/taleszin/valentine_days' },
        'Sistema de Gerenciamento de Inventário em C': { live: '#', code: '#' },
        'Gerenciador de Atividades Acadêmicas': { live: '#', code: '#' }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const techCopy = card.getAttribute('data-tech-copy');
            const images = card.getAttribute('data-images').split(',');

            popupTitle.textContent = title;
            popupText.textContent = techCopy;
            popupGallery.innerHTML = '';

            popupMetrics.innerHTML = '';
            if (metricsMap[title]) {
                metricsMap[title].forEach(metric => {
                    const metricDiv = document.createElement('div');
                    metricDiv.className = 'project-metric';
                    metricDiv.innerHTML = `
                        <div class="metric-value">${metric.value}</div>
                        <div class="metric-label">${metric.label}</div>
                    `;
                    popupMetrics.appendChild(metricDiv);
                });
            }

            const links = linksMap[title] || { live: '#', code: '#' };
            popupLiveLink.href = links.live;
            popupCodeLink.href = links.code;

            images.forEach(imgSrc => {
                if(imgSrc.trim()) {
                    const img = document.createElement('img');
                    img.src = imgSrc.trim();
                    img.alt = `Imagem do projeto ${title}`;
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
            submitBtn.textContent = 'Enviando...';
            submitBtn.style.opacity = '0.7';

            try {
                const emailBody = `Nome: ${data.name}%0A` +
                                `Email: ${data.email}%0A` +
                                `Assunto: ${data.subject}%0A%0A` +
                                `Mensagem:%0A${data.message}`;

                const mailtoLink = `mailto:tales.santiago@aluno.uece.br?subject=${encodeURIComponent(data.subject)}&body=${emailBody}`;
                
                setTimeout(() => {
                    window.location.href = mailtoLink;
                    
                    submitBtn.textContent = 'E-mail Aberto! ✓';
                    submitBtn.style.background = '#28a745';
                    submitBtn.style.opacity = '1';
                    
                    showStatus('✅ Cliente de e-mail aberto com sucesso! Sua mensagem está pronta para envio.', 'success');
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Enviar Mensagem';
                        submitBtn.style.background = 'var(--primary-color)';
                    }, 3000);
                }, 800);
                
            } catch (error) {
                submitBtn.textContent = 'Erro. Tente novamente';
                submitBtn.style.background = '#dc3545';
                submitBtn.style.opacity = '1';
                
                showStatus('❌ Erro ao abrir cliente de e-mail. Tente usar o WhatsApp ou e-mail direto.', 'error');
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensagem';
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
});