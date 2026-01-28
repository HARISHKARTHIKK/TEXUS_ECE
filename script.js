const initParticles = () => {
    // Canvas and Context Setup
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0'; // Start hidden for boot sequence
    canvas.style.transition = 'opacity 2s ease-in-out';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#22FF88';
            ctx.fill();
        }
    }

    // Floating light streaks generator
    const createStreaks = () => {
        const container = document.getElementById('hero-streaks');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const streak = document.createElement('div');
            streak.className = 'streak';
            streak.style.left = Math.random() * 100 + 'vw';
            streak.style.animationDelay = Math.random() * 5 + 's';
            streak.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(streak);
        }
    };

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.update();
            p.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 180) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(34, 255, 136, ${0.2 * (1 - dist / 180)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    };

    animate();
    createStreaks();
};

document.addEventListener('DOMContentLoaded', () => {
    initParticles();

    // Cinematic Boot Sequence
    const preloader = document.getElementById('preloader');
    const heroContent = document.getElementById('hero-content');
    const particleCanvas = document.getElementById('particle-canvas');

    // Stage 1 & 2: System Boot & Neural Formation (handled by preloader CSS)
    // Stage 3 & 4: Title Reveal & UI Settle
    setTimeout(() => {
        // Transition Preloader
        if (preloader) preloader.style.opacity = '0';

        // Show Particles
        if (particleCanvas) particleCanvas.style.opacity = '0.3';

        // Reveal Hero
        setTimeout(() => {
            if (heroContent) heroContent.classList.add('boot-visible');
            if (preloader) preloader.style.display = 'none';
        }, 800);

    }, 2000); // 2 seconds total for boot formation

    // Scroll Reveal Animation (for remaining sections)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal class to sections/elements
    document.querySelectorAll('section, .glass, .hero > div').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Handle the intersection logic via a CSS class
    const style = document.createElement('style');
    style.innerHTML = `
        .active {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Magnetic Button Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // Parallax Depth Effect on Cards
    const cards = document.querySelectorAll('.glass');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });

    // Smooth Scroll transitions already handled by CSS but adding a JS fallback
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});