document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // SPA Routing Logic
    const VALID_PAGES = ['#home', '#about', '#activities', '#services', '#inmersiones', '#pricing', '#contact'];
    
    function navigateToPage() {
        let hash = window.location.hash;
        
        // If there's no hash or it's not valid, default to #home
        if (!hash || !VALID_PAGES.includes(hash)) {
            hash = '#home';
        }
        
        const targetId = hash.substring(1);
        const sections = document.querySelectorAll('section');
        
        sections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.remove('hidden-section');
                
                // Trigger reveal animations for all elements inside this section immediately
                const revealElements = sec.querySelectorAll('.reveal');
                revealElements.forEach(el => el.classList.add('active'));
            } else {
                sec.classList.add('hidden-section');
            }
        });
        
        // Update header active links
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Specific check for #btn-header-join in header (pricing link)
        const joinBtn = document.getElementById('btn-header-join');
        if (joinBtn) {
            if (hash === '#pricing') {
                joinBtn.classList.add('active');
            } else {
                joinBtn.classList.remove('active');
            }
        }
        
        // Scroll to top of the viewport
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Leaflet map refresh when visible
        if (targetId === 'inmersiones' && window.leafletMap) {
            setTimeout(() => {
                window.leafletMap.invalidateSize();
            }, 200);
        }
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', navigateToPage);
    // Initial page load routing
    navigateToPage();

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

    // 5. Active Link Highlight is now handled dynamically by the SPA Router

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

    // 9. Interactive Bubble Pop effect & SPA Navigation delay
    const chartNodes = document.querySelectorAll('.chart-node');
    chartNodes.forEach(node => {
        node.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Add popup pop class
            this.classList.add('pop-effect');
            
            // Delay to let bubble burst animation play before navigating
            setTimeout(() => {
                window.location.hash = targetId;
                
                // Remove pop class after navigation is triggered
                setTimeout(() => {
                    this.classList.remove('pop-effect');
                }, 600);
            }, 350);
        });
    });

    // 10. Floating FAB back-to-chart is disabled for virtual page navigation

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

    // 12. Interactive Certifications Timeline (Línea de Vida)
    const timelineSteps = document.querySelectorAll('.timeline-flow-widget .timeline-step');
    const certTitle = document.getElementById('cert-title');
    const certLevel = document.getElementById('cert-level');
    const certDesc = document.getElementById('cert-desc');
    const certDepth = document.getElementById('cert-depth');
    const certReqs = document.getElementById('cert-reqs');
    const certOutcome = document.getElementById('cert-outcome');

    const certData = {
        bautizo: {
            title: "Bautizo de Buceo (Discover Scuba)",
            level: "Iniciación",
            desc: "Tu primera inmersión. Acompañado de un instructor del club, respirarás bajo el agua por primera vez en un entorno seguro y controlado.",
            depth: "6 metros",
            reqs: "Saber nadar",
            outcome: "Experiencia inicial"
        },
        owd: {
            title: "Open Water Diver (Buceador Autónomo)",
            level: "Oficial Básico",
            desc: "El primer curso completo. Aprenderás las bases teóricas y las destrezas de seguridad para bucear de forma autónoma con un compañero en cualquier parte del mundo.",
            depth: "18 metros",
            reqs: "Bautizo previo (recomendado)",
            outcome: "Certificación internacional de por vida"
        },
        aowd: {
            title: "Advanced Open Water Diver",
            level: "Avanzado / Especialidad",
            desc: "Expande tus horizontes y confianza. Probarás inmersiones de orientación natural, buceo profundo hasta 30 metros, flotabilidad óptima, nocturno y pecios.",
            depth: "30 metros",
            reqs: "Open Water Diver",
            outcome: "Habilitación para inmersiones profundas y pecios"
        },
        rescue: {
            title: "Rescue Diver (Buceador de Rescate)",
            level: "Seguridad y Salvamento",
            desc: "Aprende a anticipar problemas bajo el agua y gestionar emergencias. Practicarás rescates en superficie, primeros auxilios específicos del buceo y suministro de oxígeno.",
            depth: "30 metros",
            reqs: "Advanced OWD + Curso EFR (Primeros auxilios)",
            outcome: "Ser el compañero de buceo más seguro y autosuficiente"
        },
        pro: {
            title: "Divemaster & Instructor del Club",
            level: "Profesional / Liderazgo",
            desc: "Lidera y guía inmersiones de socios. Ayuda en la formación de alumnos del club, colabora en salidas en barco e iníciate para impartir cursos si decides ser instructor.",
            depth: "40 metros",
            reqs: "Rescue Diver + 60 inmersiones + Seguro profesional",
            outcome: "Liderar grupos y enseñar en un club sin ánimo de lucro"
        }
    };

    if (timelineSteps.length > 0) {
        timelineSteps.forEach(step => {
            step.addEventListener('click', () => {
                timelineSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');

                const certKey = step.getAttribute('data-cert');
                const data = certData[certKey];

                if (data) {
                    certTitle.textContent = data.title;
                    certLevel.textContent = data.level;
                    certDesc.textContent = data.desc;
                    certDepth.textContent = data.depth;
                    certReqs.textContent = data.reqs;
                    certOutcome.textContent = data.outcome;
                }
            });
        });
    }
});
