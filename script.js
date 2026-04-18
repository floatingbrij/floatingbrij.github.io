(function () {
    'use strict';

    // ─── Scroll progress bar ───
    var progress = document.querySelector('.scroll-progress');
    function updateProgress() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (progress && docHeight > 0) {
            progress.style.width = (scrollTop / docHeight * 100) + '%';
        }
    }

    // ─── Header scroll state + role text reveal ───
    var header = document.getElementById('header');
    var heroSection = document.querySelector('.hero');
    var lastY = 0;
    function updateHeader() {
        if (!header) return;
        var y = window.scrollY;
        header.classList.toggle('scrolled', y > 50);

        // Show role text after scrolling past hero
        if (heroSection) {
            var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            header.classList.toggle('past-hero', y > heroBottom - 100);
        }

        // Hide header on fast downward scroll, show on any upward scroll
        if (y > 300 && y - lastY > 8) {
            header.style.transform = 'translateY(-100%)';
        } else if (lastY - y > 4 || y < 100) {
            header.style.transform = 'translateY(0)';
        }
        lastY = y;
    }
    if (header) {
        header.style.transition += ', transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
    }

    // ─── Combined scroll handler ───
    var scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            requestAnimationFrame(function () {
                updateProgress();
                updateHeader();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
    updateProgress();
    updateHeader();

    // ─── Mobile nav toggle ───
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
            });
        });
    }

    // ─── Magnetic hero tilt ───
    var heroName = document.querySelector('.hero-name');
    var hero = document.querySelector('.hero');
    if (heroName && hero && window.innerWidth > 768) {
        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            heroName.style.transform =
                'rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 3) + 'deg)';
        });
        hero.addEventListener('mouseleave', function () {
            heroName.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }

    // ─── Time-aware greeting ───
    var heroLead = document.getElementById('heroLead');
    if (heroLead) {
        var hour = new Date().getHours();
        var greeting;
        if (hour >= 5 && hour < 12) {
            greeting = 'Good morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good evening';
        } else {
            greeting = 'Late night coding?';
        }
        heroLead.textContent = greeting + ' — I build tools that give AI agents control over Windows desktop applications.';
    }

    // ─── Konami code easter egg ───
    var konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var konamiIndex = 0;
    var konamiActivated = false;
    document.addEventListener('keydown', function (e) {
        if (konamiActivated) return;
        var key = e.key;
        if (key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                konamiActivated = true;
                activateKonami();
            }
        } else {
            konamiIndex = 0;
            // Check if the pressed key starts a new sequence
            if (key === konamiSequence[0]) {
                konamiIndex = 1;
            }
        }
    });

    function activateKonami() {
        // Switch accent color from orange to green
        document.documentElement.classList.add('konami-active');

        // Show toast
        var toast = document.createElement('div');
        toast.className = 'konami-toast';
        toast.textContent = '🎮 konami activated — you found the green mode';
        document.body.appendChild(toast);
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                toast.classList.add('show');
            });
        });

        // Hide toast after 4 seconds
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 500);
        }, 4000);
    }

    // ─── Stagger assignment ───
    document.querySelectorAll('.exp-list, .edu-list, .project-grid, .skills-row, .contact-links').forEach(function (parent) {
        var children = parent.children;
        children.forEach(function (child, i) {
            child.style.setProperty('--stagger', i);
        });
    });

    // ─── Scroll reveal (elements + dividers) ───
    var reveals = document.querySelectorAll('.reveal, .divider');
    if (reveals.length && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('js-ready');
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0, rootMargin: '0px 0px -20px 0px' }
        );
        reveals.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ─── View Transitions for internal navigation ───
    if (document.startViewTransition) {
        document.querySelectorAll('a[href^="/"]').forEach(function (a) {
            // Skip same-page anchors and external links
            if (a.getAttribute('href').indexOf('#') === 0) return;
            a.addEventListener('click', function (e) {
                var href = this.href;
                if (href === window.location.href) return;
                e.preventDefault();
                document.startViewTransition(function () {
                    window.location.href = href;
                });
            });
        });
    }

    // ─── Smooth anchor scroll with offset ───
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
