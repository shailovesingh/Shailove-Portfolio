/* ============================================================
   Shailove Singh — Portfolio  ·  app.js
   Vanilla JS only · no libraries · GitHub-Pages friendly
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Sticky nav background on scroll ---------- */
    var nav = document.getElementById('nav');
    function onScroll() {
        if (window.scrollY > 24) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile menu ---------- */
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    toggle.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        toggle.classList.toggle('is-open', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            links.classList.remove('is-open');
            toggle.classList.remove('is-open');
        });
    });

    /* ---------- Scroll reveal (staggered within groups) ---------- */
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        // stagger siblings that share a parent
        var groups = new Map();
        reveals.forEach(function (el) {
            var p = el.parentElement;
            if (!groups.has(p)) groups.set(p, 0);
            var i = groups.get(p);
            el.style.setProperty('--d', (i * 70) + 'ms');
            groups.set(p, i + 1);
            io.observe(el);
        });

        // Reveal anything already in the viewport on load (hero shows instantly)
        var vh = window.innerHeight || document.documentElement.clientHeight;
        reveals.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < vh * 0.92 && r.bottom > 0) {
                el.classList.add('in');
                io.unobserve(el);
            }
        });

        // Safety net: never leave content permanently hidden if IO misbehaves
        setTimeout(function () {
            reveals.forEach(function (el) {
                if (!el.classList.contains('in')) el.classList.add('in');
            });
        }, 1400);
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- Active nav link via section observer ---------- */
    var navMap = {};
    document.querySelectorAll('.nav__links a[href^="#"]').forEach(function (a) {
        navMap[a.getAttribute('href').slice(1)] = a;
    });
    var sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove('is-active'); });
                    var link = navMap[e.target.id];
                    if (link) link.classList.add('is-active');
                }
            });
        }, { threshold: 0.5, rootMargin: '-20% 0px -40% 0px' });
        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Contact form → opens email client (no backend needed) ---------- */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var data = new FormData(form);
            var name = (data.get('name') || '').trim();
            var email = (data.get('email') || '').trim();
            var message = (data.get('message') || '').trim();
            var subject = encodeURIComponent('Portfolio enquiry — ' + name);
            var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
            var note = document.getElementById('formNote');
            if (note) note.hidden = false;
            window.location.href = 'mailto:shailovesingh787@gmail.com?subject=' + subject + '&body=' + body;
        });
    }

    /* ---------- Year (footer) ---------- */
    var y = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });
})();
