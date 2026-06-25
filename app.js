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
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
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
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Random start height initially
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.size = Math.random() * 4 + 1; // Size 1px to 5px
                this.speedY = Math.random() * 0.8 + 0.2; // Speed up
                this.speedX = Math.random() * 0.5 - 0.25; // Slight drift
                this.opacity = Math.random() * 0.4 + 0.1; // Subtly transparent
                this.wobble = Math.random() * 0.02;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX + Math.sin(this.y * this.wobble) * 0.2;
                
                // If bubble goes off top, reset to bottom
                if (this.y < -10) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 245, 212, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Initialize bubbles (density based on screen width)
        const initBubbles = () => {
            bubblesArray = [];
            const numberOfBubbles = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < numberOfBubbles; i++) {
                bubblesArray.push(new Bubble());
            }
        };
        initBubbles();
        window.addEventListener('resize', initBubbles);

        // Animation Loop
        const animateBubbles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < bubblesArray.length; i++) {
                bubblesArray[i].update();
                bubblesArray[i].draw();
            }
            requestAnimationFrame(animateBubbles);
        };
        animateBubbles();
    }

    // 7. Contact Form Handling (Interactive Mockup)
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
            btnSubmit.innerHTML = `Enviando... <i data-lucide="loader-2" class="btn-icon animate-spin"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Simulate Network delay (1.5 seconds)
            setTimeout(() => {
                // Success message
                formStatus.innerHTML = `<strong>¡Mensaje enviado con éxito!</strong><br>Gracias por contactar con nosotros, ${name}. Nos pondremos en contacto contigo en breve para resolver tus dudas sobre el club. 🌊🐢`;
                formStatus.className = 'form-status-message success';
                
                // Reset form fields
                contactForm.reset();

                // Reset button state
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `Enviar Mensaje <i data-lucide="send" class="btn-icon"></i>`;
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

            }, 1500);
        });
    }
});
