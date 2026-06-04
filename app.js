/* ==========================================
   AESTHETIC ANIME PROFESSIONAL PORTFOLIO JS
   ========================================== */

// 1. DREAMSCAPE PARTICLES (Cherry Blossom Petals & Glowing Embers)
class DreamscapeEngine {
    constructor() {
        this.canvas = document.getElementById('dreamscapeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(initRandomY = false) {
        const isPetal = Math.random() < 0.4; // 40% cherry blossom petals, 60% glowing embers
        const x = Math.random() * this.canvas.width;
        // Start from top or random Y for initialization
        const y = initRandomY ? Math.random() * this.canvas.height : -10;
        
        if (isPetal) {
            // Cherry Blossom Petals
            this.particles.push({
                type: 'petal',
                x, y,
                size: Math.random() * 6 + 4,
                speedY: Math.random() * 1.0 + 0.6,
                speedX: -(Math.random() * 1.2 + 0.4), // Drift left
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.4 + 0.3,
                color: `rgba(255, ${Math.floor(Math.random() * 40 + 130)}, ${Math.floor(Math.random() * 30 + 170)}, 1)` // Soft pinks
            });
        } else {
            // Soft Glowing Embers
            this.particles.push({
                type: 'ember',
                x, y: initRandomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
                size: Math.random() * 2 + 1,
                speedY: -(Math.random() * 0.8 + 0.2), // Float up
                speedX: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.2,
                fadeSpeed: Math.random() * 0.003 + 0.001,
                color: Math.random() < 0.5 ? '#ff7bb5' : '#e6c8ff'
            });
        }
    }

    update() {
        // Maintain particle count limit
        if (this.particles.length < 50 && Math.random() < 0.15) {
            this.createParticle();
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            if (p.type === 'petal') {
                p.y += p.speedY;
                p.x += p.speedX;
                p.angle += p.spinSpeed;
                
                // If out of bounds, delete
                if (p.y > this.canvas.height + 10 || p.x < -10) {
                    this.particles.splice(i, 1);
                    i--;
                }
            } else {
                p.y += p.speedY;
                p.x += p.speedX;
                p.opacity -= p.fadeSpeed;
                
                // If out of life or bounds, delete
                if (p.opacity <= 0 || p.y < -10) {
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
                
                // Draw delicate petal shape (ellipse/oval)
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            } else {
                // Draw glowing ember
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.shadowBlur = p.size * 4;
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
        // Generate initial batch of particles throughout the screen
        for (let i = 0; i < 30; i++) {
            this.createParticle(true);
        }
    }
}

// 2. NAV BAR & SCROLL ANIMATIONS
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
    }

    bindEvents() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
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

    // Highlights navigation link matching the section in viewport
    setupScrollSpy() {
        let fromTop = window.scrollY + 100;

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
}

// 3. LAUNCH ENGINES
document.addEventListener('DOMContentLoaded', () => {
    // Start canvas particles
    const dreamscape = new DreamscapeEngine();
    dreamscape.initSparks();
    dreamscape.loop();

    // Start portfolio behavior coordinator
    window.Portfolio = new PortfolioManager();
});
