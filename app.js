document.addEventListener('DOMContentLoaded', () => {
    const highlightEl = document.querySelector('[data-highlight]');
    const focusTopics = [
        'autonomous robots',
        'underwater inspection',
        'AI prediction models',
        'long-range telemetry'
    ];
    let focusIndex = 0;

    if (highlightEl) {
        setInterval(() => {
            focusIndex = (focusIndex + 1) % focusTopics.length;
            highlightEl.textContent = focusTopics[focusIndex];
        }, 2800);
    }

    const navCollapseEl = document.getElementById('primaryNav');
    if (navCollapseEl) {
        navCollapseEl.addEventListener('click', event => {
            if (event.target.classList.contains('nav-link')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    }

    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 90, density: { enable: true, value_area: 1000 } },
                color: { value: '#4ae3ff' },
                shape: { type: 'circle' },
                opacity: { value: 0.45, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 160,
                    color: '#4ae3ff',
                    opacity: 0.28,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2.2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    attract: { enable: false }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 180, line_linked: { opacity: 0.45 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 120
        });
    }

    const threadCanvas = document.getElementById('thread-canvas');
    const heroSection = document.querySelector('.hero-section');
    if (threadCanvas && heroSection) {
        const ctx = threadCanvas.getContext('2d');
        let canvasWidth = 0;
        let canvasHeight = 0;
        let points = [];
        let mouseY = null;
        let animationFrame = null;
        const POINT_COUNT = 40;

        const allocatePoints = () => {
            points = [];
            for (let i = 0; i <= POINT_COUNT; i += 1) {
                points.push({
                    x: (i / POINT_COUNT) * canvasWidth,
                    baseY: canvasHeight * 0.55,
                    offset: Math.random() * Math.PI * 2
                });
            }
        };

        const resizeCanvas = () => {
            const rect = heroSection.getBoundingClientRect();
            canvasWidth = rect.width;
            canvasHeight = rect.height;
            threadCanvas.width = canvasWidth * window.devicePixelRatio;
            threadCanvas.height = canvasHeight * window.devicePixelRatio;
            threadCanvas.style.width = `${canvasWidth}px`;
            threadCanvas.style.height = `${canvasHeight}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            allocatePoints();
        };

        const render = time => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            const amplitude = canvasHeight * 0.1;
            const pointerInfluence = canvasHeight * 0.25;
            ctx.beginPath();
            points.forEach((point, index) => {
                const wave = Math.sin(time * 0.0016 + point.offset) * amplitude;
                let y = point.baseY + wave;
                if (mouseY !== null) {
                    const distance = Math.max(60, Math.abs(point.x - mouseY.x));
                    const influence = ((pointerInfluence / distance) * (mouseY.y - point.baseY)) * 0.4;
                    y += influence;
                }
                if (index === 0) {
                    ctx.moveTo(point.x, y);
                } else {
                    ctx.lineTo(point.x, y);
                }
            });
            ctx.strokeStyle = 'rgba(74, 227, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(74, 227, 255, 0.35)';
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(141, 245, 255, 0.3)';
            ctx.lineWidth = 4;
            ctx.stroke();

            animationFrame = requestAnimationFrame(render);
        };

        const handlePointerMove = event => {
            const rect = heroSection.getBoundingClientRect();
            mouseY = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        };

        const handlePointerLeave = () => {
            mouseY = null;
        };

        resizeCanvas();
        render(0);

        heroSection.addEventListener('pointermove', handlePointerMove);
        heroSection.addEventListener('pointerleave', handlePointerLeave);
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrame);
            heroSection.removeEventListener('pointermove', handlePointerMove);
            heroSection.removeEventListener('pointerleave', handlePointerLeave);
            window.removeEventListener('resize', resizeCanvas);
        });
    }
});