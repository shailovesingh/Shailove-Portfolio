/* ==========================================
   AESTHETIC PORTFOLIO JS - ENHANCED UX & PARTICLES
   ========================================== */

// 1. DYNAMIC INTERACTIVE PARTICLES (Dreamscape Engine with Mouse Physics)
class DreamscapeEngine {
    constructor() {
        this.canvas = document.getElementById('dreamscapeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        this.mouseRadius = 140; // Area of effect
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Mouse movement tracking
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Mouse leave tracking
        window.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(initRandomY = false) {
        const isPetal = Math.random() < 0.35; // 35% cherry blossom petals, 65% glowing embers
        const x = Math.random() * this.canvas.width;
        const y = initRandomY ? Math.random() * this.canvas.height : -10;
        
        if (isPetal) {
            // Cherry Blossom Petals
            this.particles.push({
                type: 'petal',
                x, y,
                size: Math.random() * 5 + 3,
                speedY: Math.random() * 0.8 + 0.5,
                speedX: -(Math.random() * 1.0 + 0.3), // Drift left
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.015,
                opacity: Math.random() * 0.35 + 0.2,
                color: `rgba(255, ${Math.floor(Math.random() * 30 + 140)}, ${Math.floor(Math.random() * 20 + 180)}, 1)`
            });
        } else {
            // Soft Glowing Embers (More reactive to mouse physics)
            this.particles.push({
                type: 'ember',
                x, y: initRandomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
                size: Math.random() * 2 + 1,
                speedY: -(Math.random() * 0.6 + 0.2), // Float up
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.6 + 0.2,
                fadeSpeed: Math.random() * 0.0025 + 0.0008,
                color: Math.random() < 0.5 ? '#ff7bb5' : '#00f0ff' // Pink & Cyan mix
            });
        }
    }

    update() {
        // Maintain particle count limit
        if (this.particles.length < 60 && Math.random() < 0.18) {
            this.createParticle();
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // 1. Apply Mouse Repulsion Force
            if (this.mouseX !== null && this.mouseY !== null) {
                const dx = p.x - this.mouseX;
                const dy = p.y - this.mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouseRadius) {
                    const force = (this.mouseRadius - dist) / this.mouseRadius;
                    // Push particles away proportional to proximity
                    const pushX = (dx / dist) * force * 2.5;
                    const pushY = (dy / dist) * force * 2.5;

                    p.x += pushX;
                    p.y += pushY;
                }
            }

            // 2. Standard Drift
            if (p.type === 'petal') {
                p.y += p.speedY;
                p.x += p.speedX;
                p.angle += p.spinSpeed;
                
                // Boundaries reset
                if (p.y > this.canvas.height + 10 || p.x < -10) {
                    this.particles.splice(i, 1);
                    i--;
                }
            } else {
                p.y += p.speedY;
                p.x += p.speedX;
                p.opacity -= p.fadeSpeed;
                
                // Boundaries/Life reset
                if (p.opacity <= 0 || p.y < -10 || p.x < -10 || p.x > this.canvas.width + 10) {
                    this.particles.splice(i, 1);
                    i--;
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            if (p.type === 'petal') {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.angle);
                
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            } else {
                // Embers with premium glow shadows
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.shadowBlur = p.size * 5;
                this.ctx.shadowColor = p.color;
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.shadowBlur = 0; // Reset
            }
        }
        
        this.ctx.globalAlpha = 1.0;
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    initSparks() {
        for (let i = 0; i < 40; i++) {
            this.createParticle(true);
        }
    }
}

// 2. NAV BAR, SCROLL SPY, & STAGGERED SCROLL REVEALS
class PortfolioManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollSections = document.querySelectorAll('.scroll-section, .hero-section');

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupScrollSpy();
        this.setupScrollReveal();
    }

    bindEvents() {
        // Floating Navbar scroll indicator styling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            this.setupScrollSpy();
        });

        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            const icon = this.mobileToggle.querySelector('i');
            if (this.navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile menu on nav link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // Scroll Spy active navigation state
    setupScrollSpy() {
        let fromTop = window.scrollY + 120;

        this.scrollSections.forEach(section => {
            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                const id = section.getAttribute('id');
                
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // High performance IntersectionObserver for staggered reveals
    setupScrollReveal() {
        const revealOptions = {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed to maintain animations
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => observer.observe(el));
    }
}

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Start canvas particles
    const dreamscape = new DreamscapeEngine();
    dreamscape.initSparks();
    dreamscape.loop();

    // Start portfolio behavior coordinator
    window.Portfolio = new PortfolioManager();
});
