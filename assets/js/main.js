// ===== MODERN FEATURES =====
class SakerlyApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupAudio();
        this.setupNavigation();
        this.setupLoadingScreen();
        this.fetchUserIP();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.updateCopyright();
        
        // Initialize WebGL when page loads
        window.addEventListener('load', () => {
            this.initWebGL();
        });
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        // Default to dark theme with better contrast
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            // Add transition effect
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
            
            // Update navigation immediately
            this.updateNavTheme(newTheme);
        });
    }

    updateNavTheme(theme) {
        const nav = document.querySelector('.main-nav');
        const audioControls = document.querySelector('.audio-controls');
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (nav) {
            if (theme === 'dark') {
                nav.style.background = 'rgba(255, 255, 255, 0.25)';
                nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.9)';
                nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
            }
        }
        
        // Update controls appearance
        if (audioControls) {
            if (theme === 'dark') {
                audioControls.style.background = 'rgba(255, 255, 255, 0.15)';
                audioControls.style.border = '1px solid rgba(255, 255, 255, 0.25)';
            } else {
                audioControls.style.background = 'rgba(255, 255, 255, 0.9)';
                audioControls.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            }
        }
        
        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.style.background = 'rgba(255, 255, 255, 0.15)';
                themeToggle.style.border = '1px solid rgba(255, 255, 255, 0.25)';
            } else {
                themeToggle.style.background = 'rgba(255, 255, 255, 0.9)';
                themeToggle.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            }
        }
    }

    updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Audio Controls
    setupAudio() {
        const audio = document.getElementById('playAudio');
        const audioToggle = document.getElementById('audioToggle');
        const audioIcon = document.getElementById('audioIcon');
        const volumeSlider = document.getElementById('volumeSlider');

        if (!audio || !audioToggle || !volumeSlider) return;

        // Set initial volume
        audio.volume = 0.5;
        let isPlaying = false;

        // Auto-play with user interaction
        document.addEventListener('click', () => {
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    audioIcon.className = 'fas fa-volume-up';
                }).catch(() => {
                    console.log('Auto-play prevented');
                });
            }
        }, { once: true });

        // Toggle audio
        audioToggle.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => {
                    isPlaying = true;
                    audioIcon.className = 'fas fa-volume-up';
                });
            } else {
                audio.pause();
                audioIcon.className = 'fas fa-volume-mute';
            }
        });

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
            const volume = parseFloat(e.target.value);
            
            if (volume === 0) {
                audioIcon.className = 'fas fa-volume-mute';
            } else if (volume < 0.5) {
                audioIcon.className = 'fas fa-volume-down';
            } else {
                audioIcon.className = 'fas fa-volume-up';
            }
        });
    }

    // Navigation
    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navigation background on scroll with theme awareness
        const nav = document.querySelector('.main-nav');
        const audioControls = document.querySelector('.audio-controls');
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (nav) {
            window.addEventListener('scroll', () => {
                const theme = document.documentElement.getAttribute('data-theme');
                const scrolled = window.scrollY > 100;
                
                if (scrolled) {
                    if (theme === 'dark') {
                        nav.style.background = 'rgba(26, 26, 46, 0.95)';
                        nav.style.backdropFilter = 'blur(20px)';
                        nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
                        
                        if (audioControls) {
                            audioControls.style.background = 'rgba(26, 26, 46, 0.9)';
                        }
                        if (themeToggle) {
                            themeToggle.style.background = 'rgba(26, 26, 46, 0.9)';
                        }
                    } else {
                        nav.style.background = 'rgba(255, 255, 255, 0.95)';
                        nav.style.backdropFilter = 'blur(20px)';
                        nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
                        
                        if (audioControls) {
                            audioControls.style.background = 'rgba(255, 255, 255, 0.95)';
                        }
                        if (themeToggle) {
                            themeToggle.style.background = 'rgba(255, 255, 255, 0.95)';
                        }
                    }
                } else {
                    if (theme === 'dark') {
                        nav.style.background = 'rgba(255, 255, 255, 0.25)';
                        nav.style.backdropFilter = 'blur(20px)';
                        nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
                        
                        if (audioControls) {
                            audioControls.style.background = 'rgba(255, 255, 255, 0.15)';
                        }
                        if (themeToggle) {
                            themeToggle.style.background = 'rgba(255, 255, 255, 0.15)';
                        }
                    } else {
                        nav.style.background = 'rgba(255, 255, 255, 0.9)';
                        nav.style.backdropFilter = 'blur(20px)';
                        nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
                        
                        if (audioControls) {
                            audioControls.style.background = 'rgba(255, 255, 255, 0.9)';
                        }
                        if (themeToggle) {
                            themeToggle.style.background = 'rgba(255, 255, 255, 0.9)';
                        }
                    }
                }
            });
        }
    }

    // Loading Screen
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.querySelector('.loading-progress');
        
        if (!loadingScreen) return;

        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.classList.remove('is-preload');
                }, 500);
            }
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }, 200);
    }

    // Fetch User IP
    async fetchUserIP() {
        const ipElement = document.getElementById('userIP');
        if (!ipElement) return;

        try {
            // Using a simple IP service
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ipElement.textContent = data.ip;
        } catch (error) {
            // Fallback to the original method
            try {
                const script = document.createElement('script');
                script.src = 'https://pv.sohu.com/cityjson?ie=utf-8';
                document.head.appendChild(script);
                
                window.returnCitySN = window.returnCitySN || {};
                setTimeout(() => {
                    if (window.returnCitySN && window.returnCitySN.cip) {
                        ipElement.textContent = window.returnCitySN.cip;
                    } else {
                        ipElement.textContent = 'Unavailable';
                    }
                }, 1000);
            } catch (fallbackError) {
                ipElement.textContent = 'Unavailable';
            }
        }
    }

    // Scroll Effects
    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.section-title').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Removed parallax effect to prevent overlapping issues
        // The hero section now stays in place for better layout stability
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!mobileMenuBtn) return; // No mobile menu needed with single nav link

        mobileMenuBtn.addEventListener('click', () => {
            navLinks?.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks && mobileMenuBtn && 
                !mobileMenuBtn.contains(e.target) && 
                !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.onResize();
                // Fix viewport height on mobile after orientation change
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }, 100);
        });
        
        // Set initial viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Update Copyright Year
    updateCopyright() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Initialize WebGL Sakura Effect
    initWebGL() {
        this.setupWebGL();
    }

    setupWebGL() {
        const canvas = document.getElementById("sakura");
        if (!canvas) return;

        try {
            this.makeCanvasFullScreen(canvas);
            this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!this.gl) {
                console.error("WebGL not supported");
                return;
            }

            window.addEventListener('resize', () => this.onResize());
            
            this.setViewports();
            this.createScene();
            this.initScene();
            
            this.timeInfo = {
                start: new Date(),
                prev: new Date(),
                delta: 0,
                elapsed: 0
            };
            
            this.animate();
        } catch (e) {
            console.error("WebGL initialization failed:", e);
        }
    }

    makeCanvasFullScreen(canvas) {
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
    }

    onResize() {
        if (!this.gl) return;
        
        this.makeCanvasFullScreen(this.gl.canvas);
        this.setViewports();
        if (this.sceneStandBy) {
            this.initScene();
        }
    }

    setViewports() {
        if (!this.gl) return;

        this.renderSpec = this.renderSpec || {};
        this.renderSpec.width = this.gl.canvas.width;
        this.renderSpec.height = this.gl.canvas.height;
        this.renderSpec.aspect = this.renderSpec.width / this.renderSpec.height;
        this.renderSpec.array = new Float32Array([this.renderSpec.width, this.renderSpec.height, this.renderSpec.aspect]);

        this.gl.viewport(0, 0, this.renderSpec.width, this.renderSpec.height);
        
        // Create render targets (simplified)
        this.createRenderTargets();
    }

    createRenderTargets() {
        // Simplified render target creation for the demo
        // In a full implementation, you'd create proper framebuffers
    }

    createScene() {
        this.createEffectLib();
        this.createBackground();
        this.createPointFlowers();
        this.sceneStandBy = true;
    }

    createEffectLib() {
        // Simplified effect library creation
        this.effectLib = {};
    }

    createBackground() {
        // Background creation logic
    }

    createPointFlowers() {
        if (!this.gl) return;

        // Get point size range
        const prm = this.gl.getParameter(this.gl.ALIASED_POINT_SIZE_RANGE);
        this.renderSpec.pointSize = { min: prm[0], max: prm[1] };

        // Create simplified particle system
        this.pointFlower = {
            numFlowers: Math.min(800, Math.floor(window.innerWidth * window.innerHeight / 3000)), // Adaptive count
            particles: [],
            area: { x: 20, y: 20, z: 20 }
        };

        // Initialize particles
        for (let i = 0; i < this.pointFlower.numFlowers; i++) {
            this.pointFlower.particles[i] = {
                position: [
                    (Math.random() - 0.5) * this.pointFlower.area.x,
                    (Math.random() - 0.5) * this.pointFlower.area.y,
                    (Math.random() - 0.5) * this.pointFlower.area.z
                ],
                velocity: [
                    (Math.random() - 0.5) * 2,
                    -Math.random() * 2 - 1,
                    (Math.random() - 0.5) * 2
                ],
                size: 0.5 + Math.random() * 0.5,
                alpha: Math.random()
            };
        }
    }

    initScene() {
        if (!this.pointFlower) return;

        // Adjust area based on screen size
        this.pointFlower.area.x = this.pointFlower.area.y * this.renderSpec.aspect;
    }

    renderScene() {
        if (!this.gl || !this.pointFlower) return;

        // Dynamic background based on theme
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            this.gl.clearColor(0.98, 0.98, 1.0, 1.0); // Light background
        } else {
            this.gl.clearColor(0.1, 0.1, 0.18, 1.0); // Dark background
        }
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Update particles
        this.updateParticles();
        
        // Simple particle rendering (placeholder)
        this.renderParticles();
    }

    updateParticles() {
        const dt = this.timeInfo.delta;
        
        this.pointFlower.particles.forEach(particle => {
            // Update position
            particle.position[0] += particle.velocity[0] * dt;
            particle.position[1] += particle.velocity[1] * dt;
            particle.position[2] += particle.velocity[2] * dt;

            // Wrap around screen
            if (Math.abs(particle.position[0]) > this.pointFlower.area.x) {
                particle.position[0] = particle.position[0] > 0 ? -this.pointFlower.area.x : this.pointFlower.area.x;
            }
            if (Math.abs(particle.position[1]) > this.pointFlower.area.y) {
                particle.position[1] = particle.position[1] > 0 ? -this.pointFlower.area.y : this.pointFlower.area.y;
            }
            if (Math.abs(particle.position[2]) > this.pointFlower.area.z) {
                particle.position[2] = particle.position[2] > 0 ? -this.pointFlower.area.z : this.pointFlower.area.z;
            }
        });
    }

    renderParticles() {
        // Simplified particle rendering
        // In a full implementation, this would use the complex shaders from the original code
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Basic point rendering would go here
        
        this.gl.disable(this.gl.BLEND);
    }

    animate() {
        const curdate = new Date();
        this.timeInfo.elapsed = (curdate - this.timeInfo.start) / 1000.0;
        this.timeInfo.delta = (curdate - this.timeInfo.prev) / 1000.0;
        this.timeInfo.prev = curdate;

        this.renderScene();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== ORIGINAL WEBGL CODE (Enhanced) =====
// Keeping the original complex WebGL implementation for the full cherry blossom effect

// Utilities
var Vector3 = {};
var Matrix44 = {};

Vector3.create = function(x, y, z) {
    return {'x':x, 'y':y, 'z':z};
};

Vector3.dot = function (v0, v1) {
    return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
};

Vector3.cross = function (v, v0, v1) {
    v.x = v0.y * v1.z - v0.z * v1.y;
    v.y = v0.z * v1.x - v0.x * v1.z;
    v.z = v0.x * v1.y - v0.y * v1.x;
};

Vector3.normalize = function (v) {
    var l = v.x * v.x + v.y * v.y + v.z * v.z;
    if(l > 0.00001) {
        l = 1.0 / Math.sqrt(l);
        v.x *= l;
        v.y *= l;
        v.z *= l;
    }
};

Vector3.arrayForm = function(v) {
    if(v.array) {
        v.array[0] = v.x;
        v.array[1] = v.y;
        v.array[2] = v.z;
    } else {
        v.array = new Float32Array([v.x, v.y, v.z]);
    }
    return v.array;
};

Matrix44.createIdentity = function () {
    return new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
};

Matrix44.loadProjection = function (m, aspect, vdeg, near, far) {
    var h = near * Math.tan(vdeg * Math.PI / 180.0 * 0.5) * 2.0;
    var w = h * aspect;
    
    m[0] = 2.0 * near / w;
    m[1] = 0.0;
    m[2] = 0.0;
    m[3] = 0.0;
    
    m[4] = 0.0;
    m[5] = 2.0 * near / h;
    m[6] = 0.0;
    m[7] = 0.0;
    
    m[8] = 0.0;
    m[9] = 0.0;
    m[10] = -(far + near) / (far - near);
    m[11] = -1.0;
    
    m[12] = 0.0;
    m[13] = 0.0;
    m[14] = -2.0 * far * near / (far - near);
    m[15] = 0.0;
};

Matrix44.loadLookAt = function (m, vpos, vlook, vup) {
    var frontv = Vector3.create(vpos.x - vlook.x, vpos.y - vlook.y, vpos.z - vlook.z);
    Vector3.normalize(frontv);
    var sidev = Vector3.create(1.0, 0.0, 0.0);
    Vector3.cross(sidev, vup, frontv);
    Vector3.normalize(sidev);
    var topv = Vector3.create(1.0, 0.0, 0.0);
    Vector3.cross(topv, frontv, sidev);
    Vector3.normalize(topv);
    
    m[0] = sidev.x;
    m[1] = topv.x;
    m[2] = frontv.x;
    m[3] = 0.0;
    
    m[4] = sidev.y;
    m[5] = topv.y;
    m[6] = frontv.y;
    m[7] = 0.0;
    
    m[8] = sidev.z;
    m[9] = topv.z;
    m[10] = frontv.z;
    m[11] = 0.0;
    
    m[12] = -(vpos.x * m[0] + vpos.y * m[4] + vpos.z * m[8]);
    m[13] = -(vpos.x * m[1] + vpos.y * m[5] + vpos.z * m[9]);
    m[14] = -(vpos.x * m[2] + vpos.y * m[6] + vpos.z * m[10]);
    m[15] = 1.0;
};

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.maxHistoryLength = 60;
    }

    update() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.fpsHistory.push(this.fps);
            
            if (this.fpsHistory.length > this.maxHistoryLength) {
                this.fpsHistory.shift();
            }
            
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Auto-adjust quality based on performance
            this.adjustQuality();
        }
    }

    adjustQuality() {
        const avgFps = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
        
        if (avgFps < 30 && window.sakerly && window.sakerly.pointFlower) {
            // Reduce particle count for better performance
            window.sakerly.pointFlower.numFlowers = Math.max(200, window.sakerly.pointFlower.numFlowers * 0.8);
        } else if (avgFps > 55 && window.sakerly && window.sakerly.pointFlower) {
            // Increase particle count for better visuals
            window.sakerly.pointFlower.numFlowers = Math.min(1600, window.sakerly.pointFlower.numFlowers * 1.1);
        }
    }

    getFPS() {
        return this.fps;
    }
}

// ===== REQUEST ANIMATION FRAME POLYFILL =====
(function (w, r) {
    w['r'+r] = w['r'+r] || w['webkitR'+r] || w['mozR'+r] || w['msR'+r] || w['oR'+r] || function(c){ w.setTimeout(c, 1000 / 60); };
})(window, 'equestAnimationFrame');

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the modern SakerLy application
    window.sakerly = new SakerlyApp();
    
    // Initialize performance monitor
    window.performanceMonitor = new PerformanceMonitor();
    
    // Add FPS counter (for development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const fpsCounter = document.createElement('div');
        fpsCounter.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
        `;
        document.body.appendChild(fpsCounter);
        
        setInterval(() => {
            window.performanceMonitor.update();
            fpsCounter.textContent = `FPS: ${window.performanceMonitor.getFPS()}`;
        }, 100);
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initParticles();
    initThemeToggle();
    initAudioToggle();
    initScrollEffects();
    initStats();
    fetchUserIP();
    updateYear();
});

// ==================== LOADING SCREEN ====================
function initLoader() {
    const loading = document.getElementById('loading');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1500);
    });
}

// ==================== PARTICLE CANVAS ====================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.speed = Math.random() * 2 + 1;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.drift = Math.random() * 0.5 - 0.25;
        }

        update() {
            this.y -= this.speed;
            this.x += this.drift;
            
            if (this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

// ==================== THEME TOGGLE ====================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ==================== AUDIO TOGGLE ====================
function initAudioToggle() {
    const audioToggle = document.getElementById('audioToggle');
    const audioIcon = document.getElementById('audioIcon');
    const bgAudio = document.getElementById('bgAudio');

    let isPlaying = false;

    audioToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgAudio.pause();
            audioIcon.classList.remove('fa-volume-up');
            audioIcon.classList.add('fa-volume-mute');
            isPlaying = false;
        } else {
            bgAudio.play().catch(e => console.log('Audio play failed:', e));
            audioIcon.classList.remove('fa-volume-mute');
            audioIcon.classList.add('fa-volume-up');
            isPlaying = true;
        }
    });

    // Set initial volume
    bgAudio.volume = 0.3;
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
    const nav = document.querySelector('nav');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        // Navbar scroll effect
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide scroll indicator
        if (scrollIndicator) {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
    });

    // Smooth scroll for scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe stats cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ==================== ANIMATED STATS COUNTER ====================
function initStats() {
    const statValues = document.querySelectorAll('.stat-value');
    let hasAnimated = false;

    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end + (element.dataset.count === '99' ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.count === '99' ? '%' : '+');
            }
        }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statValues.forEach(stat => {
                    const target = parseInt(stat.dataset.count);
                    animateValue(stat, 0, target, 2000);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ==================== FETCH USER IP ====================
async function fetchUserIP() {
    const ipElement = document.getElementById('userIP');
    
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipElement.textContent = data.ip;
        
        // Add typing effect
        typeWriter(ipElement, data.ip, 0);
    } catch (error) {
        ipElement.textContent = 'Unable to fetch';
        console.error('Error fetching IP:', error);
    }
}

function typeWriter(element, text, index) {
    if (index < text.length) {
        element.textContent = text.substring(0, index + 1);
        setTimeout(() => typeWriter(element, text, index + 1), 100);
    }
}

// ==================== UPDATE YEAR ====================
function updateYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D already handled by browser for bookmarking
    
    // Ctrl/Cmd + K for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
    
    // Ctrl/Cmd + M for audio toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        document.getElementById('audioToggle').click();
    }
});

// ==================== MOUSE TRAIL EFFECT ====================
let mouseTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (mouseTrail.length > maxTrailLength) {
        mouseTrail.shift();
    }
});

// ==================== EASTER EGG ====================
let clickCount = 0;
const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount === 5) {
            createConfetti();
            clickCount = 0;
        }
    });
}

function createConfetti() {
    const colors = ['#ff6b9d', '#c96dd8', '#4d9cff', '#ffd93d'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / confettiCount;
            const velocity = 200 + Math.random() * 200;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            confetti.style.transform = `translate(${x}px, ${y}px)`;
            confetti.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            confetti.remove();
        }, 1000);
    }
}

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized resize handler
const handleResize = debounce(() => {
    // Any resize-dependent code here
    console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// ==================== ACCESSIBILITY ====================
// Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🌸 Welcome to SakerLy! 🌸', 'color: #ff6b9d; font-size: 24px; font-weight: bold;');
console.log('%cDeveloped with ❤️ by SakerLy', 'color: #c96dd8; font-size: 14px;');
console.log('%cWebsite: https://www.sakerly.top', 'color: #4d9cff; font-size: 12px;');
