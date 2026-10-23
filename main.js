/**
 * ABHIJIT KUMAR — SOFTWARE ENGINEER PORTFOLIO
 * High-performance, clean interaction logic & ambient visual canvas
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       01. THEME TOGGLE (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme-mode') || 'theme-dark';
    
    // Apply initial theme
    document.body.className = savedTheme;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('theme-dark');
            const nextTheme = isDark ? 'theme-light' : 'theme-dark';
            
            document.body.classList.remove('theme-dark', 'theme-light');
            document.body.classList.add(nextTheme);
            localStorage.setItem('theme-mode', nextTheme);
        });
    }

    /* ==========================================================================
       02. AMBIENT VISUAL CANVAS (INTERACTIVE CONSTELLATION)
       ========================================================================== */
    const canvas = document.getElementById('ambientCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 25 : 50;
        const maxDist = isMobile ? 100 : 140;

        let mouse = { x: -1000, y: -1000 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.5 + 0.8;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                else if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                else if (this.y > height) this.y = 0;

                // Gentle mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x += (dx / dist) * force * 1.2;
                    this.y += (dy / dist) * force * 1.2;
                }
            }

            draw() {
                const isLight = document.body.classList.contains('theme-light');
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isLight ? 'rgba(37, 99, 235, 0.4)' : 'rgba(147, 197, 253, 0.55)';
                ctx.fill();
            }
        }

        const particles = Array.from({ length: particleCount }, () => new Particle());

        let isRunning = true;
        const animateCanvas = () => {
            if (!isRunning) return;
            ctx.clearRect(0, 0, width, height);

            const isLight = document.body.classList.contains('theme-light');
            const lineColor = isLight ? 'rgba(37, 99, 235,' : 'rgba(99, 102, 241,';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `${lineColor}${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        };

        requestAnimationFrame(animateCanvas);

        // Pause canvas when user switches tab
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isRunning = false;
            } else {
                isRunning = true;
                requestAnimationFrame(animateCanvas);
            }
        });
    }

    /* ==========================================================================
       03. AMBIENT MOUSE SPOTLIGHT (SUBTLE GLOW)
       ========================================================================== */
    const ambientSpotlight = document.getElementById('ambientSpotlight');
    if (ambientSpotlight && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateSpotlight = () => {
            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;
            ambientSpotlight.style.left = `${currentX}px`;
            ambientSpotlight.style.top = `${currentY}px`;
            requestAnimationFrame(animateSpotlight);
        };
        requestAnimationFrame(animateSpotlight);
    }

    /* ==========================================================================
       04. INTERACTIVE TERMINAL TABS & COPY
       ========================================================================== */
    const termTabs = document.querySelectorAll('.term-tab');
    const termPanes = document.querySelectorAll('.term-code');
    const copyTermBtn = document.getElementById('copyTermCodeBtn');

    termTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = `pane-${tab.getAttribute('data-tab')}`;
            
            termTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            termPanes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const activePane = document.getElementById(targetId);
            if (activePane) activePane.classList.add('active');
        });
    });

    if (copyTermBtn) {
        copyTermBtn.addEventListener('click', () => {
            const activeCode = document.querySelector('.term-code.active');
            if (!activeCode) return;

            navigator.clipboard.writeText(activeCode.innerText).then(() => {
                copyTermBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                setTimeout(() => {
                    copyTermBtn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            }).catch(err => {
                console.error('Could not copy terminal snippet:', err);
            });
        });
    }

    /* ==========================================================================
       05. PROJECT CATEGORY FILTER TABS
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterValue = pill.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    /* ==========================================================================
       06. MOBILE DRAWER NAVIGATION
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileDrawer.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active', isOpen);
            mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileDrawer.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ==========================================================================
       07. DOCK ACTIVE LINK OBSERVER
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.dock-links .nav-item');

    const updateActiveNav = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* ==========================================================================
       08. MODAL DIALOG CONTROLLER
       ========================================================================== */
    const modals = {
        hire: document.getElementById('callbackModal'),
        genospark: document.getElementById('genosparkCertModal'),
        bireena: document.getElementById('bireenaCertModal'),
        resume: document.getElementById('resumeModal')
    };

    const openModal = (modal) => {
        if (!modal) return;
        // Close other modals
        Object.values(modals).forEach(m => m && m.classList.remove('active'));
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Close mobile drawer if active
        if (mobileDrawer) {
            mobileDrawer.classList.remove('active');
            mobileMenuBtn && mobileMenuBtn.classList.remove('active');
        }
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on backdrop or close button
    document.querySelectorAll('.modern-modal').forEach(modal => {
        const backdrop = modal.querySelector('.modal-backdrop');
        const closeBtn = modal.querySelector('.modal-close-btn');

        if (backdrop) backdrop.addEventListener('click', () => closeModal(modal));
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Object.values(modals).forEach(m => m && closeModal(m));
        }
    });

    // Triggers for Hire Me Modal
    const hireTriggers = [
        document.getElementById('openHireModalBtn'),
        document.getElementById('openHireModalMobileBtn'),
        document.getElementById('openHireFormSectionBtn')
    ];
    hireTriggers.forEach(btn => {
        if (btn) btn.addEventListener('click', () => openModal(modals.hire));
    });

    // Triggers for Genospark Modal
    const genoTriggers = [
        document.getElementById('openGenosparkModalBtn'),
        document.getElementById('openGenosparkModalBtn2')
    ];
    genoTriggers.forEach(btn => {
        if (btn) btn.addEventListener('click', () => openModal(modals.genospark));
    });

    // Triggers for Bireena Modal
    const bireenaTriggers = [
        document.getElementById('openBireenaModalBtn'),
        document.getElementById('openBireenaModalBtn2')
    ];
    bireenaTriggers.forEach(btn => {
        if (btn) btn.addEventListener('click', () => openModal(modals.bireena));
    });

    // Trigger for Resume Modal
    const resumeTrigger = document.getElementById('resumeModalTrigger');
    if (resumeTrigger) {
        resumeTrigger.addEventListener('click', () => openModal(modals.resume));
    }

    // Success overlay dismiss
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            const successScreen = document.getElementById('formSuccessMessage');
            if (successScreen) successScreen.style.display = 'none';
            closeModal(modals.hire);
        });
    }

    /* ==========================================================================
       09. URGENCY SLIDER FEEDBACK
       ========================================================================== */
    const urgencySlider = document.getElementById('gh-urgency');
    const urgencyValue = document.getElementById('urgencyValue');
    
    const urgencyLabels = {
        1: '1 · Relaxed',
        2: '2 · Low Priority',
        3: '3 · Flexible',
        4: '4 · Standard',
        5: '5 · Normal',
        6: '6 · Priority',
        7: '7 · Expedited',
        8: '8 · High Velocity',
        9: '9 · Critical',
        10: '10 · Immediate'
    };

    if (urgencySlider && urgencyValue) {
        urgencySlider.addEventListener('input', (e) => {
            const val = e.target.value;
            urgencyValue.textContent = urgencyLabels[val] || `${val} · Custom`;
        });
    }

    /* ==========================================================================
       10. GOOGLE FORM DISPATCH HANDLER
       ========================================================================== */
    const googleForm = document.getElementById('googleHireMeForm');
    const successScreen = document.getElementById('formSuccessMessage');

    if (googleForm) {
        googleForm.addEventListener('submit', () => {
            const submitBtn = googleForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Transmitting brief...</span>`;

            // Since it targets hidden iframe, handle success UI after short timeout
            setTimeout(() => {
                if (successScreen) successScreen.style.display = 'flex';
                googleForm.reset();
                if (urgencyValue) urgencyValue.textContent = '5 · Normal';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }, 900);
        });
    }

});
