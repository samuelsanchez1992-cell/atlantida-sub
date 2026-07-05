document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Sticky Header scroll effect
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 3. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle menu icon between menu and x
            if (navMenu.classList.contains('active')) {
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            // Re-render icon
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuIcon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. Active Link Highlight on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 6. Interactive Bubble Canvas Background
    const canvas = document.getElementById('bubbles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let bubblesArray = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Bubble {
            constructor(isTemporary = false) {
                this.isTemporary = isTemporary;
                this.reset();
                if (!isTemporary) {
                    this.y = Math.random() * canvas.height; // Random start height initially
                }
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;

                // Random colour: white, sky-blue or orange (club palette)
                const palette = [
                    '255, 255, 255',   // white
                    '56, 189, 248',    // sky blue
                    '242, 122, 24'     // orange
                ];
                this.color = palette[Math.floor(Math.random() * palette.length)];

                if (this.isTemporary) {
                    this.size = Math.random() * 6 + 3;
                    this.speedY = Math.random() * 3.5 + 2;
                    this.speedX = Math.random() * 0.8 - 0.4;
                    this.opacity = Math.random() * 0.55 + 0.3;
                    this.wobble = Math.random() * 0.03;
                } else {
                    this.size = Math.random() * 3.5 + 1;
                    this.speedY = Math.random() * 0.6 + 0.15;
                    this.speedX = Math.random() * 0.4 - 0.2;
                    this.opacity = Math.random() * 0.35 + 0.08;
                    this.wobble = Math.random() * 0.02;
                }
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX + Math.sin(this.y * this.wobble) * 0.15;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                // Coloured translucent outline
                ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Subtle fill tint
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.12})`;
                ctx.fill();

                // Specular highlight (bright dot top-left)
                ctx.beginPath();
                ctx.arc(
                    this.x - this.size * 0.35,
                    this.y - this.size * 0.35,
                    this.size * 0.2,
                    0, Math.PI * 2
                );
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 1.8})`;
                ctx.fill();
            }
        }

        // Initialize bubbles (density based on screen width)
        const initBubbles = () => {
            bubblesArray = [];
            const numberOfBubbles = Math.floor((canvas.width * canvas.height) / 20000);
            for (let i = 0; i < numberOfBubbles; i++) {
                bubblesArray.push(new Bubble(false));
            }
        };
        initBubbles();
        window.addEventListener('resize', initBubbles);

        // Animation Loop
        const animateBubbles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = bubblesArray.length - 1; i >= 0; i--) {
                bubblesArray[i].update();
                bubblesArray[i].draw();
                
                // If bubble goes off top
                if (bubblesArray[i].y < -10) {
                    if (bubblesArray[i].isTemporary) {
                        bubblesArray.splice(i, 1); // remove temporary scrolling bubbles!
                    } else {
                        bubblesArray[i].reset(); // reset background bubbles
                    }
                }
            }
            requestAnimationFrame(animateBubbles);
        };
        animateBubbles();

        // Spawn bubbles during navigation scrolling
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);
            
            if (scrollDelta > 3) {
                const spawnCount = Math.min(Math.floor(scrollDelta / 12), 5);
                for (let i = 0; i < spawnCount; i++) {
                    bubblesArray.push(new Bubble(true)); // Spawn temporary fast bubble
                }
            }
            lastScrollY = currentScrollY;
        });
    }

    // 7. Interactive Map of Tenerife Spots logic
    const mapPins = document.querySelectorAll('.map-pin');
    const placeholder = document.getElementById('map-placeholder');
    const detailContainers = document.querySelectorAll('.map-details');

    if (mapPins.length > 0) {
        mapPins.forEach(pin => {
            pin.addEventListener('click', () => {
                const spot = pin.getAttribute('data-spot');
                
                // 1. Remove active class from all pins
                mapPins.forEach(p => p.classList.remove('active'));
                
                // 2. Add active class to clicked pin
                pin.classList.add('active');
                
                // 3. Hide placeholder text
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
                
                // 4. Hide all spot detail blocks and show the target one
                detailContainers.forEach(detail => {
                    detail.classList.remove('active');
                    if (detail.getAttribute('id') === `spot-${spot}`) {
                        detail.classList.add('active');
                    }
                });
            });
        });
    }

    // 8. Contact Form Handling (Interactive Mockup)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const btnSubmit = document.getElementById('btn-submit-form');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect info
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Simple validation check
            if (!name || !email || !subject || !message) {
                formStatus.textContent = 'Por favor, rellena todos los campos obligatorios.';
                formStatus.className = 'form-status-message error';
                return;
            }

            // Visual sending state
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `Enviando al Club... <i data-lucide="loader-2" class="btn-icon animate-spin"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Simulate Network delay (1.2 seconds)
            setTimeout(() => {
                // Success message
                formStatus.innerHTML = `<strong>¡Mensaje enviado con éxito!</strong><br>Gracias por contactar con Atlántida Sub, ${name}. Nos pondremos en contacto contigo por correo electrónico en breve para resolver tu solicitud sobre el club. 🌊🍊`;
                formStatus.className = 'form-status-message success';
                
                // Reset form fields
                contactForm.reset();

                // Reset button state
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `Enviar Consulta al Club <i data-lucide="send" class="btn-icon"></i>`;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Smooth scroll down to read status message if needed
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Fade status out after 8 seconds
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    formStatus.style.transition = 'opacity 1s ease';
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.style.opacity = '1';
                    }, 1000);
                }, 8000);

            }, 1200);
        });
    }

    // 9. Interactive Bubble Pop effect & Scroll delay
    const chartNodes = document.querySelectorAll('.chart-node');
    chartNodes.forEach(node => {
        node.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Add popup pop class
            this.classList.add('pop-effect');
            
            // Delay to let bubble burst animation play before scrolling
            setTimeout(() => {
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Remove pop class after scroll is triggered
                setTimeout(() => {
                    this.classList.remove('pop-effect');
                }, 600);
            }, 350);
        });
    });

    // 10. Floating FAB back-to-chart toggle
    const fabChart = document.getElementById('fab-back-to-chart');
    if (fabChart) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                fabChart.classList.add('show');
            } else {
                fabChart.classList.remove('show');
            }
        });

        fabChart.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 11. Club Hub Section Tab Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Set active class on buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Set active class on content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.add('active');
                    }
                });

                // Trigger Lucide icons update if any new icon renders inside tabs
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });

        // Intercept clicks on links pointing to services with data-target-tab
        document.querySelectorAll('[data-target-tab]').forEach(link => {
            link.addEventListener('click', function(e) {
                const tabName = this.getAttribute('data-target-tab');
                const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
                if (targetBtn) {
                    // Activate the tab
                    targetBtn.click();
                }
            });
        });
    }
});
