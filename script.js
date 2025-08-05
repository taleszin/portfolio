document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        duration: 900,
        once: true,
        offset: 50,
    });

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
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
    
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

    // Métricas fictícias para cada projeto
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

    // Links fictícios para cada projeto
    const linksMap = {
        'MedLeap AI': { live: '#', code: '#' },
        'ShotMap Basketball': { live: '#', code: '#' },
        'Portal da História do Ceará': { live: '#', code: '#' },
        "Valentine's Day": { live: '#', code: '#' },
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