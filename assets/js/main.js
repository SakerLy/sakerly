// ==================== SAKERLY APP - MAIN ====================

class SakerlyApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.setupAudio();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupStats();
        this.fetchUserIP();
        this.updateYear();
        this.setupKeyboardShortcuts();
        this.setupEasterEgg();
        
        console.log('%c🌸 Welcome to SakerLy! 🌸', 'color: #ff6b9d; font-size: 24px; font-weight: bold;');
        console.log('%cDeveloped with ❤️ by SakerLy', 'color: #c96dd8; font-size: 14px;');
    }

    // ==================== LOADING SCREEN ====================
    setupLoadingScreen() {
        const loading = document.getElementById('loading');
        const progressBar = document.querySelector('.loading-progress');
        
        if (!loading) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    loading.classList.add('hidden');
                    document.body.classList.remove('is-preload');
                }, 500);
            }
            
            if (progressBar) progressBar.style.width = `${progress}%`;
        }, 200);
    }

    // ==================== THEME TOGGLE ====================
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        if (!themeToggle || !themeIcon) {
            console.warn('Theme toggle elements not found');
            return;
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            
            if (isLight) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // ==================== AUDIO CONTROLS ====================
    setupAudio() {
        const audio = document.getElementById('playAudio');
        const audioToggle = document.getElementById('audioToggle');
        const audioIcon = document.getElementById('audioIcon');

        if (!audio || !audioToggle || !audioIcon) {
            console.warn('Audio elements not found');
            return;
        }

        audio.volume = 0.3;
        let isPlaying = false;

        audioToggle.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                audioIcon.classList.remove('fa-volume-up');
                audioIcon.classList.add('fa-volume-mute');
            } else {
                audio.play().catch(e => console.log('Audio play prevented:', e));
                audioIcon.classList.remove('fa-volume-mute');
                audioIcon.classList.add('fa-volume-up');
            }
            isPlaying = !isPlaying;
        });
    }

    // ==================== NAVIGATION ====================
    setupNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 100);
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==================== SCROLL EFFECTS ====================
    setupScrollEffects() {
        const scrollIndicator = document.querySelector('.scroll-indicator');

        // Hide scroll indicator on scroll
        window.addEventListener('scroll', () => {
            if (scrollIndicator) {
                scrollIndicator.style.opacity = window.scrollY > 200 ? '0' : '1';
            }
        });

        // Click to scroll
        scrollIndicator?.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });

        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        // Observe stat cards
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // ==================== ANIMATED STATS ====================
    setupStats() {
        const statValues = document.querySelectorAll('.stat-value');
        let hasAnimated = false;

        const animateValue = (element, end, duration = 2000) => {
            const start = 0;
            const increment = end / (duration / 16);
            let current = start;
            const suffix = element.dataset.count === '99' ? '%' : '+';

            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    element.textContent = end + suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    statValues.forEach(stat => {
                        const target = parseInt(stat.dataset.count);
                        animateValue(stat, target);
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) observer.observe(statsSection);
    }

    // ==================== FETCH USER IP ====================
    async fetchUserIP() {
        const ipElement = document.getElementById('userIP');
        if (!ipElement) return;

        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            this.typeWriter(ipElement, data.ip);
        } catch (error) {
            ipElement.textContent = 'Unable to fetch';
            console.error('Error fetching IP:', error);
        }
    }

    typeWriter(element, text, index = 0) {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            setTimeout(() => this.typeWriter(element, text, index + 1), 100);
        }
    }

    // ==================== UPDATE YEAR ====================
    updateYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ==================== KEYBOARD SHORTCUTS ====================
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('themeToggle')?.click();
            }
            
            // Ctrl/Cmd + M for audio toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                document.getElementById('audioToggle')?.click();
            }

            // Tab key for keyboard navigation visibility
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    // ==================== EASTER EGG ====================
    setupEasterEgg() {
        let clickCount = 0;
        const logo = document.querySelector('.logo');

        logo?.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                this.createConfetti();
                clickCount = 0;
            }
        });
    }

    createConfetti() {
        const colors = ['#ff6b9d', '#c96dd8', '#4d9cff', '#ffd93d'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            Object.assign(confetti.style, {
                position: 'fixed',
                width: '10px',
                height: '10px',
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                left: '50%',
                top: '50%',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: '9999',
                transition: 'all 1s ease-out'
            });
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / confettiCount;
                const velocity = 200 + Math.random() * 200;
                const x = Math.cos(angle) * velocity;
                const y = Math.sin(angle) * velocity;
                
                confetti.style.transform = `translate(${x}px, ${y}px)`;
                confetti.style.opacity = '0';
            }, 10);
            
            setTimeout(() => confetti.remove(), 1000);
        }
    }
}

// ==================== PARTICLE CANVAS ====================
class ParticleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.onResize());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onResize() {
        this.resizeCanvas();
        this.createParticles();
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + 10;
        this.speed = Math.random() * 2 + 1;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.drift = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.y -= this.speed;
        this.x += this.drift;
        
        if (this.y < -10) this.reset();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// ==================== UTILITIES ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
    window.sakerlyApp = new SakerlyApp();
    window.particleCanvas = new ParticleCanvas('particleCanvas');
});

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => console.error('App Error:', e.error));
window.addEventListener('unhandledrejection', (e) => console.error('Unhandled Rejection:', e.reason));
