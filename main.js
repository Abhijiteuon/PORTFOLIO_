document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Logic
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    
    if (hamburgerBtn && hamburgerMenu) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && hamburgerMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        });
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const iconLight = document.querySelector('.theme-icon-light');
    const iconDark = document.querySelector('.theme-icon-dark');
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme') || 'theme-dark';
    document.body.className = savedTheme;
    
    if (savedTheme === 'theme-light') {
        iconLight.style.display = 'block';
        iconDark.style.display = 'none';
    } else {
        iconLight.style.display = 'none';
        iconDark.style.display = 'block';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            // Close hamburger menu if it's open
            if (hamburgerMenu && hamburgerBtn) {
                hamburgerMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }

            if (document.body.classList.contains('theme-dark')) {
                document.body.classList.remove('theme-dark');
                document.body.classList.add('theme-light');
                localStorage.setItem('theme', 'theme-light');
                iconLight.style.display = 'block';
                iconDark.style.display = 'none';
            } else {
                document.body.classList.remove('theme-light');
                document.body.classList.add('theme-dark');
                localStorage.setItem('theme', 'theme-dark');
                iconLight.style.display = 'none';
                iconDark.style.display = 'block';
            }
        });
        
        // Add custom cursor effect
        themeToggle.addEventListener('mouseenter', () => {
            document.querySelector('.cursor').classList.add('active');
            document.querySelector('.cursor-follower').classList.add('active');
        });
        themeToggle.addEventListener('mouseleave', () => {
            document.querySelector('.cursor').classList.remove('active');
            document.querySelector('.cursor-follower').classList.remove('active');
        });
    }

    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const navLinks = document.querySelectorAll('a, .work-item, .modal-close, .hamburger-btn, .menu-action-btn');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Follower easing function
    function animateCursor() {
        if (!cursor || !cursorFollower) return;
        
        // Smooth follower
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    animateCursor();

    // Hover states for cursor
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorFollower.classList.add('active');
            
            if (link.classList.contains('work-item')) {
                cursorFollower.classList.add('view-project');
            }
        });

        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorFollower.classList.remove('active');
            cursorFollower.classList.remove('view-project');
        });
    });

    // Work Item Image Reveal Logic
    const workItems = document.querySelectorAll('.work-item');
    const workSection = document.querySelector('.work-list');

    // Create a generic preview div to handle background image swapping
    const previewDiv = document.createElement('div');
    previewDiv.classList.add('work-image-preview');
    workSection.appendChild(previewDiv);

    workItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const imageSrc = item.getAttribute('data-image');
            previewDiv.style.backgroundImage = `url(${imageSrc})`;
            previewDiv.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
             previewDiv.classList.remove('active');
        });
    });


    // General Modal Logic
    // General Modal Logic
    const modalsMap = [
        { btn: document.getElementById('aboutNavBtn'), modal: document.getElementById('aboutModal') },
        { btn: document.getElementById('resumeNavBtn'), modal: document.getElementById('resumeModal') },
        { btn: document.getElementById('contactNavBtn'), modal: document.getElementById('contactModal') },
        { btn: document.getElementById('openCallbackBtn'), modal: document.getElementById('callbackModal') },
        { btn: document.getElementById('openCallbackBtnContact'), modal: document.getElementById('callbackModal') },
        { btn: document.getElementById('openCallbackBtnMenu'), modal: document.getElementById('callbackModal') }
    ];

    // First setup all buttons to open their respective modals
    modalsMap.forEach(({btn, modal}) => {
        if(btn && modal) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Close hamburger menu if it was clicked from inside
                if (btn.closest('.hamburger-dropdown')) {
                    const hMenu = document.getElementById('hamburgerMenu');
                    const hBtn = document.getElementById('hamburgerBtn');
                    if (hMenu) hMenu.classList.remove('active');
                    if (hBtn) hBtn.classList.remove('active');
                }

                // close other open modals first
                document.querySelectorAll('.about-modal.active').forEach(m => m.classList.remove('active'));
                
                modal.classList.add('active');
            });
        }
    });

    // Then setup the close logic ONLY ONCE per modal to avoid duplicate event listeners
    const uniqueModals = [...new Set(modalsMap.map(m => m.modal).filter(Boolean))];
    uniqueModals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modal.classList.remove('active');
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }
    });

    // Simple Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-fade');
    
    // Wrap content only if it hasn't been wrapped already
    document.querySelectorAll('.reveal-text:not(.hero-title)').forEach(el => {
        if (!el.querySelector('.line')) {
            const content = el.innerHTML;
            el.innerHTML = `<span class="line"><span>${content}</span></span>`;
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
    
    // Callback Form Logic
    const reasonSelect = document.getElementById('cb-reason');
    const otherGroup = document.getElementById('otherReasonGroup');
    const otherInput = document.getElementById('cb-other');
    const charCount = document.querySelector('.char-count');
    const callbackForm = document.getElementById('callbackForm');

    if (reasonSelect && otherGroup && otherInput) {
        reasonSelect.addEventListener('change', (e) => {
            if (e.target.value === 'other') {
                otherGroup.classList.remove('hidden');
                otherInput.setAttribute('required', 'true');
            } else {
                otherGroup.classList.add('hidden');
                otherInput.removeAttribute('required');
                otherInput.value = '';
                charCount.textContent = '0 / 64';
            }
        });

        otherInput.addEventListener('input', (e) => {
            const currentLength = e.target.value.length;
            charCount.textContent = `${currentLength} / 64`;
        });
        
        if (callbackForm) {
            callbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(callbackForm);
                
                fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString(),
                })
                .then(() => {
                    // Close modal and reset
                    const modal = document.getElementById('callbackModal');
                    if(modal) {
                        modal.classList.remove('active');
                    }
                    callbackForm.reset();
                    otherGroup.classList.add('hidden');
                    if (charCount) charCount.textContent = '0 / 64';
                    const msgCharCount = document.getElementById('msgCharCount');
                    if (msgCharCount) msgCharCount.textContent = '0 / 50';
                    alert('Callback request submitted successfully! Your message will reach me via Netlify.');
                })
                .catch((error) => {
                    console.error('Form submission error:', error);
                    alert('Oops! There was an error submitting your request. Please try again later.');
                });

                const msgInput = document.getElementById('cb-message');
                const msgCharCount = document.getElementById('msgCharCount');
                if (msgInput && msgCharCount) {
                    msgInput.addEventListener('input', (e) => {
                        msgCharCount.textContent = `${e.target.value.length} / 50`;
                    });
                }
            });
        }
    }

    // Initial trigger for hero items and viewport safety
    const triggerInitialReveals = () => {
        // Reveal hero elements with staggered delay
        document.querySelectorAll('.hero .reveal-text, .hero .reveal-fade').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('is-revealed');
            }, 100 + (index * 150));
        });

        // Safety fallback: reveal EVERYTHING after 4 seconds if they are still hidden
        setTimeout(() => {
            document.querySelectorAll('.reveal-text:not(.is-revealed), .reveal-fade:not(.is-revealed)').forEach(el => {
                console.warn('Revealing element via fallback:', el);
                el.classList.add('is-revealed');
            });
        }, 3000);
    };

    if (document.readyState === 'complete') {
        triggerInitialReveals();
    } else {
        window.addEventListener('load', triggerInitialReveals);
    }
});
