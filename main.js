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
        if (iconLight) iconLight.style.display = 'block';
        if (iconDark) iconDark.style.display = 'none';
    } else {
        if (iconLight) iconLight.style.display = 'none';
        if (iconDark) iconDark.style.display = 'block';
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
                if (iconLight) iconLight.style.display = 'block';
                if (iconDark) iconDark.style.display = 'none';
            } else {
                document.body.classList.remove('theme-light');
                document.body.classList.add('theme-dark');
                localStorage.setItem('theme', 'theme-dark');
                if (iconLight) iconLight.style.display = 'none';
                if (iconDark) iconDark.style.display = 'block';
            }
        });
        
        // Add custom cursor effect
        themeToggle.addEventListener('mouseenter', () => {
            const cursor = document.querySelector('.cursor');
            const cursorFollower = document.querySelector('.cursor-follower');
            if (cursor) cursor.classList.add('active');
            if (cursorFollower) cursorFollower.classList.add('active');
        });
        themeToggle.addEventListener('mouseleave', () => {
            const cursor = document.querySelector('.cursor');
            const cursorFollower = document.querySelector('.cursor-follower');
            if (cursor) cursor.classList.remove('active');
            if (cursorFollower) cursorFollower.classList.remove('active');
        });
    }

    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const navLinks = document.querySelectorAll('a, .work-item, .modal-close, .hamburger-btn, .menu-action-btn, .menu-btn, .submit-btn');

    // Custom Cursor Logic - Only for devices with hover capability
    if (window.matchMedia('(hover: hover)').matches) {
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
    } else {
        // Ensure cursor elements are hidden on non-hover devices
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

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
        { btn: document.getElementById('resumeNavBtnMenu'), modal: document.getElementById('resumeModal') },
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

    // Then setup the close logic ONLY ONCE per modal
    const uniqueModals = [...new Set(modalsMap.map(m => m.modal).filter(Boolean))];
    uniqueModals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scroll
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }
    });

    // Body scroll lock trigger
    modalsMap.forEach(({btn, modal}) => {
        if(btn && modal) {
            btn.addEventListener('click', () => {
                if (modal.classList.contains('active')) {
                    document.body.style.overflow = 'hidden'; // Lock scroll
                }
            });
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
    
    // --- Real Visit Counter Implementation ---
    const VISIT_API_URL = 'https://api.counterapi.dev/v1/abhijit-portfolio/visits';

    async function initVisitCounter() {
        const viewsDisplay = document.getElementById('profile-views-count');
        if (!viewsDisplay) return;

        try {
            // Increment and fetch the count
            const response = await fetch(`${VISIT_API_URL}/up`);
            const data = await response.json();
            
            if (data && data.count) {
                animateValue(viewsDisplay, 0, data.count, 2000);
            }
        } catch (error) {
            console.error('Failed to fetch visit count:', error);
            // Fallback to static or zero if API fails
            viewsDisplay.textContent = '0';
        }
    }

    // Smooth counting animation for stats
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Call the counter on load
    initVisitCounter();

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
                
                fetch(callbackForm.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
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
                        alert('Callback request submitted successfully! Your message will reach me via Formspree.');
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert("Oops! There was a problem submitting your form");
                            }
                        })
                    }
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
