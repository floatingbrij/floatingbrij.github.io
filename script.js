/* ═══════════════════════════════════════════════════════════
   BRIJESHARUN.COM — Interactions & Animations
   Particles, scroll reveals, stat counters, nav toggle
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Particle Canvas ───
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        let animId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticles() {
            const count = Math.min(Math.floor(window.innerWidth / 15), 80);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.4 + 0.1,
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Mouse interaction
                if (mouse.x !== null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const force = (150 - dist) / 150;
                        p.x += (dx / dist) * force * 0.8;
                        p.y += (dy / dist) * force * 0.8;
                    }
                }
            }

            animId = requestAnimationFrame(drawParticles);
        }

        resize();
        createParticles();
        drawParticles();

        window.addEventListener('resize', function () {
            resize();
            createParticles();
        });

        document.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // ─── Navigation ───
    var nav = document.querySelector('.nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    // scroll → add .scrolled
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // mobile toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });
        // close on link click
        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });
    }

    // ─── Scroll Reveal (Intersection Observer) ───
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        reveals.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ─── Stat Counter Animation ───
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        var counted = new Set();
        var statObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !counted.has(entry.target)) {
                        counted.add(entry.target);
                        animateCount(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        statNumbers.forEach(function (el) {
            statObserver.observe(el);
        });
    }

    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var duration = 1500;
        var start = performance.now();

        function tick(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            // ease out
            var ease = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(target * ease);
            el.textContent = prefix + current + suffix;
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    // ─── Active nav link highlight ───
    var sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        var allNavLinks = document.querySelectorAll('.nav-link');
        window.addEventListener('scroll', function () {
            var scrollPos = window.scrollY + 200;
            sections.forEach(function (section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');
                if (scrollPos >= top && scrollPos < top + height) {
                    allNavLinks.forEach(function (l) {
                        l.style.color = '';
                    });
                    var active = document.querySelector('.nav-link[href="#' + id + '"]');
                    if (active) {
                        active.style.color = '#e2e8f0';
                    }
                }
            });
        });
    }
})();
