document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // SPA Routing Logic
    const VALID_PAGES = ['#home', '#about', '#club', '#activities', '#services', '#inmersiones', '#pricing', '#contact'];
    
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
    const timelineSteps = document.querySelectorAll('.timeline-v-step');
    const vCertTitle = document.getElementById('v-cert-title');
    const vCertDesc = document.getElementById('v-cert-desc');

    const certData = {
        bautizo: {
            title: "Bautizo de Buceo (Discover Scuba)",
            desc: "Tu primera inmersión. Acompañado de un instructor del club, respirarás bajo el agua por primera vez en un entorno seguro y controlado."
        },
        owd: {
            title: "Open Water Diver (Buceador Autónomo)",
            desc: "El primer curso oficial completo. Aprenderás las bases teóricas y de seguridad para bucear de forma autónoma con un compañero hasta los 18 metros."
        },
        aowd: {
            title: "Advanced OWD (Buceador Avanzado)",
            desc: "Expande tus horizontes. Probarás inmersiones nocturnas, buceo profundo hasta 30 metros, orientación natural y buceo en pecios."
        },
        rescue: {
            title: "Rescue Diver (Buceador de Rescate)",
            desc: "El curso de seguridad y salvamento clave. Aprende a anticipar problemas y gestionar emergencias submarinas y de superficie."
        },
        pro: {
            title: "Divemaster & Instructor del Club",
            desc: "Lidera salidas y apoya en la instrucción. Guía inmersiones oficiales y fórmate para enseñar."
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
                    vCertTitle.textContent = data.title;
                    vCertDesc.textContent = data.desc;
                }
            });
        });
    }

    // 13. Sub-tabs Switcher inside Formación Tab
    const subtabBtns = document.querySelectorAll('.subtab-btn');
    const subtabContents = document.querySelectorAll('.subtab-content');

    if (subtabBtns.length > 0 && subtabContents.length > 0) {
        subtabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSubtab = btn.getAttribute('data-subtab');

                // Toggle active button state
                subtabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle active content state
                subtabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `subtab-${targetSubtab}`) {
                        content.classList.add('active');
                    }
                });

                // Update Lucide icons if any new ones render inside subtabs
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    // 14. El Club Section — 4 Groups Photo Slider Logic (Entrada, Equipos, Reunión, Carga)
    const CLUB_ZONES_DATA = {
        entrada: {
            title: "Entrada y Recepción",
            photos: [
                "assets/club/entrada.png"
            ]
        },
        reunion: {
            title: "Sala de Reuniones",
            photos: [
                "assets/club/reunion.png"
            ]
        },
        carga: {
            title: "Zona de Carga",
            photos: [
                "assets/club/carga.jpg",
                "assets/club/carga2.jpg",
                "assets/club/carga (2).jpg",
                "assets/club/carga (5).jpg",
                "assets/club/carga7.jpg"
            ]
        },
        equipos: {
            title: "Almacén de Equipos",
            photos: [
                "assets/club/equipos.png",
                "assets/club/equipos2.jpg",
                "assets/club/equipos3.png",
                "assets/club/equipos4.png",
                "assets/club/equipos5.png",
                "assets/club/equipos8.png"
            ]
        }
    };

    let currentSliderIndex = 0;
    let currentSliderPhotos = [];

    function updateSliderImage(index) {
        if (!currentSliderPhotos || currentSliderPhotos.length === 0) return;
        
        // Wrap index around
        if (index < 0) index = currentSliderPhotos.length - 1;
        if (index >= currentSliderPhotos.length) index = 0;
        
        currentSliderIndex = index;

        const mainImg = document.getElementById('modal-main-img');
        const counterSpan = document.getElementById('modal-img-counter');
        const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');

        if (mainImg) {
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = currentSliderPhotos[currentSliderIndex];
                mainImg.style.opacity = '1';
            }, 150);
        }

        if (counterSpan) {
            counterSpan.textContent = `Foto ${currentSliderIndex + 1} de ${currentSliderPhotos.length}`;
        }

        thumbBtns.forEach((btn, i) => {
            if (i === currentSliderIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function openClubZoneModal(zoneKey) {
        const zone = CLUB_ZONES_DATA[zoneKey];
        if (!zone) return;

        const modal = document.getElementById('club-zone-modal');
        const modalTitle = document.getElementById('modal-zone-title');
        const modalGallery = document.getElementById('modal-zone-gallery');

        if (!modal) return;

        if (modalTitle) {
            modalTitle.textContent = zone.title;
        }

        currentSliderPhotos = zone.photos || [];
        currentSliderIndex = 0;

        if (modalGallery) {
            if (currentSliderPhotos.length > 0) {
                modalGallery.innerHTML = `
                    <div class="gallery-slider-wrapper">
                        <div class="gallery-main-viewport">
                            ${currentSliderPhotos.length > 1 ? `
                                <button class="slider-nav-btn prev-btn" id="slider-prev" type="button" aria-label="Imagen anterior">
                                    <i data-lucide="chevron-left"></i>
                                </button>
                                <button class="slider-nav-btn next-btn" id="slider-next" type="button" aria-label="Imagen siguiente">
                                    <i data-lucide="chevron-right"></i>
                                </button>
                            ` : ''}
                            <img src="${currentSliderPhotos[0]}" id="modal-main-img" alt="" class="gallery-main-img">
                            <span class="gallery-counter-badge" id="modal-img-counter">Foto 1 de ${currentSliderPhotos.length}</span>
                        </div>
                        ${currentSliderPhotos.length > 1 ? `
                            <div class="gallery-thumbs-row">
                                ${currentSliderPhotos.map((src, i) => `
                                    <button class="gallery-thumb-btn ${i === 0 ? 'active' : ''}" data-thumb-idx="${i}" type="button">
                                        <img src="${src}" alt="">
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;

                // Add prev/next click listeners
                const prevBtn = modalGallery.querySelector('#slider-prev');
                const nextBtn = modalGallery.querySelector('#slider-next');

                if (prevBtn) {
                    prevBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        updateSliderImage(currentSliderIndex - 1);
                    });
                }

                if (nextBtn) {
                    nextBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        updateSliderImage(currentSliderIndex + 1);
                    });
                }

                // Add thumbnail click listeners
                const thumbBtns = modalGallery.querySelectorAll('.gallery-thumb-btn');
                thumbBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const idx = parseInt(btn.getAttribute('data-thumb-idx'), 10);
                        updateSliderImage(idx);
                    });
                });

                // Swipe gesture support for mobile touch sliding
                const mainViewport = modalGallery.querySelector('.gallery-main-viewport');
                if (mainViewport) {
                    let touchStartX = 0;
                    let touchEndX = 0;

                    mainViewport.addEventListener('touchstart', (e) => {
                        touchStartX = e.changedTouches[0].screenX;
                    }, { passive: true });

                    mainViewport.addEventListener('touchend', (e) => {
                        touchEndX = e.changedTouches[0].screenX;
                        if (touchStartX - touchEndX > 40) {
                            // Swipe Left -> Next
                            updateSliderImage(currentSliderIndex + 1);
                        } else if (touchEndX - touchStartX > 40) {
                            // Swipe Right -> Prev
                            updateSliderImage(currentSliderIndex - 1);
                        }
                    }, { passive: true });
                }

            }
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeClubZoneModal() {
        const modal = document.getElementById('club-zone-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Keyboard Arrow Key Navigation for Lightbox Slider
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('club-zone-modal');
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                updateSliderImage(currentSliderIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateSliderImage(currentSliderIndex + 1);
            } else if (e.key === 'Escape') {
                closeClubZoneModal();
            }
        }
    });

    // Close Modal Button Event Listener
    const closeBtn = document.getElementById('close-club-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeClubZoneModal);
    }

    // Option 3: Split Screen Integrated Display Logic
    function updateSplitDisplay(zoneKey) {
        const zone = CLUB_ZONES_DATA[zoneKey];
        if (!zone) return;

        const badge = document.getElementById('split-zone-badge');
        const title = document.getElementById('split-zone-title');
        const sub = document.getElementById('split-zone-sub');
        const desc = document.getElementById('split-zone-desc');
        const features = document.getElementById('split-zone-features');
        const gallery = document.getElementById('split-zone-gallery');

        if (badge) badge.textContent = zone.badge;
        if (title) title.innerHTML = `<i data-lucide="${zone.icon}" class="split-title-icon"></i> ${zone.title}`;
        if (sub) sub.textContent = zone.subtitle;
        if (desc) desc.textContent = zone.description;

        if (features) {
            features.innerHTML = zone.features.map(f => `
                <li class="split-feature-pill">
                    <i data-lucide="check-circle-2"></i>
                    <span>${f}</span>
                </li>
            `).join('');
        }

        if (gallery && zone.photos && zone.photos.length > 0) {
            gallery.innerHTML = `
                <div class="gallery-viewer-wrap">
                    <div class="gallery-main-frame">
                        <img src="${zone.photos[0]}" id="split-main-img" alt="${zone.title}" class="gallery-main-img">
                        <span class="gallery-counter-badge" id="split-img-counter">Foto 1 de ${zone.photos.length}</span>
                    </div>
                    ${zone.photos.length > 1 ? `
                        <div class="gallery-thumbs-row">
                            ${zone.photos.map((src, i) => `
                                <button class="gallery-thumb-btn ${i === 0 ? 'active' : ''}" data-thumb-src="${src}" data-thumb-idx="${i + 1}" type="button">
                                    <img src="${src}" alt="miniatura ${i + 1}">
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

            const thumbBtns = gallery.querySelectorAll('.gallery-thumb-btn');
            const mainImg = gallery.querySelector('#split-main-img');
            const counterSpan = gallery.querySelector('#split-img-counter');

            thumbBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetSrc = btn.getAttribute('data-thumb-src');
                    const idx = btn.getAttribute('data-thumb-idx');

                    thumbBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    if (mainImg) mainImg.src = targetSrc;
                    if (counterSpan) counterSpan.textContent = `Foto ${idx} de ${zone.photos.length}`;
                });
            });
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Attach Split Screen click listeners
    const splitItems = document.querySelectorAll('[data-split-target]');
    splitItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const zoneKey = item.getAttribute('data-split-target');
            splitItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            updateSplitDisplay(zoneKey);
        });
    });

    // Attach zone click listeners (chips, hotspot nodes, cards)
    const zoneElements = document.querySelectorAll('[data-zone-target]');
    zoneElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const zoneKey = el.getAttribute('data-zone-target');
            
            // Highlight active chips / hotspot zones
            document.querySelectorAll('[data-zone-target]').forEach(item => item.classList.remove('active'));
            document.querySelectorAll(`[data-zone-target="${zoneKey}"]`).forEach(item => item.classList.add('active'));

            openClubZoneModal(zoneKey);
        });
    });

    const modalCloseBtn = document.getElementById('close-club-modal');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeClubZoneModal);
    }

    const modalBackdrop = document.getElementById('club-zone-modal');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop || e.target.classList.contains('modal-backdrop-area')) {
                closeClubZoneModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeClubZoneModal();
        }
    });
});


// Back to Surface Depth Gauge Logic
document.addEventListener('DOMContentLoaded', () => {
    const surfaceBtn = document.getElementById('back-to-surface');

    if (surfaceBtn) {
        // 1. Visibility logic based on Hero Section presence
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                        surfaceBtn.classList.remove('visible');
                        surfaceBtn.classList.add('hidden');
                    } else {
                        surfaceBtn.classList.remove('hidden');
                        surfaceBtn.classList.add('visible');
                    }
                });
            }, { threshold: [0.0, 0.1, 0.5] });
            observer.observe(heroSection);
        }

        // 3. Click handler to return to the cover page
        surfaceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const textSpan = surfaceBtn.querySelector('.surface-text');
            if (textSpan) textSpan.textContent = 'Subiendo a superficie...';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });
    }
});
