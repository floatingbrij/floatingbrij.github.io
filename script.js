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

    // ─── Header scroll state ───
    var header = document.getElementById('header');
    var lastY = 0;
    function updateHeader() {
        if (!header) return;
        var y = window.scrollY;
        header.classList.toggle('scrolled', y > 50);
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

    // ─── Combined scroll handler (no separate listeners) ───
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
            var x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            heroName.style.transform =
                'rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 3) + 'deg)';
        });
        hero.addEventListener('mouseleave', function () {
            heroName.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }

    // ─── Stagger assignment ───
    // Assign --stagger custom property to sibling .reveal children
    document.querySelectorAll('.exp-list, .edu-list, .project-grid, .skills-row, .contact-links').forEach(function (parent) {
        var children = parent.querySelectorAll('.reveal, > *');
        children.forEach(function (child, i) {
            child.style.setProperty('--stagger', i);
        });
    });

    // ─── Scroll reveal (elements + dividers) ───
    var reveals = document.querySelectorAll('.reveal, .divider');
    if (reveals.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        reveals.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        reveals.forEach(function (el) {
            el.classList.add('visible');
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
