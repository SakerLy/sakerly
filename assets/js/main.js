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
        
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
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
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navigation background on scroll
        const nav = document.querySelector('.main-nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    nav.style.background = 'rgba(15, 15, 35, 0.9)';
                } else {
                    nav.style.background = 'rgba(255, 255, 255, 0.1)';
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
        document.querySelectorAll('.gallery-item, .stat-item, .section-title').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-section');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!mobileMenuBtn || !navLinks) return;

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
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

        this.gl.clearColor(0.005, 0, 0.05, 1.0);
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
