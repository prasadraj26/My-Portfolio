// js/particles.js (This file remains largely the same as before)
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    // Select all sections for hover effect
    const sections = document.querySelectorAll('section');

    // Resize canvas to fit the window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1; // Particle size
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1; // Movement speed factor
            this.color = 'rgba(88, 166, 255, 0.8)'; // Blue color for particles
        }

        // Draw particle
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        // Update particle position based on mouse proximity
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density * 0.3;
            let directionY = forceDirectionY * force * this.density * 0.3;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to base position if mouse is far away
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    // Initialize particles
    function init() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 9000; // Adjust density as needed
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }
    init();

    // Handle mouse movement
    canvas.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        // Mouse radius scales with canvas size for consistent effect
        mouse.radius = (canvas.height / 80) * (canvas.width / 80);
    });

    // Handle mouse out of canvas
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Connect particles with lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) { // Only connect particles within 100px
                    opacityValue = 1 - (distance / 100); // Lines fade with distance
                    ctx.strokeStyle = `rgba(88, 166, 255, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
    }
    animate();

    // Hover effect for sections
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            canvas.style.opacity = '0.4'; // Make background more transparent on hover
        });
        section.addEventListener('mouseleave', () => {
            canvas.style.opacity = '0.7'; // Return to normal opacity
        });
    });
});


// js/main.js (New file for navigation toggle)
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        // Close nav when a link is clicked (for smooth scrolling)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            });
        });
    }
});
// Add this code to your js/main.js file

document.addEventListener('DOMContentLoaded', () => {
    // ... (Your existing navigation toggle code goes here) ...

    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');

    if (contactForm && formMessages) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json' // Important for Formspree AJAX
                }
            });

            if (response.ok) {
                formMessages.textContent = 'Thank you for your message!';
                formMessages.classList.remove('error');
                formMessages.classList.add('blue');
                contactForm.reset(); // Clear the form
            } else {
                const data = await response.json();
                if (data.errors) {
                    formMessages.textContent = data.errors.map(error => error.message).join(', ');
                } else {
                    formMessages.textContent = 'Oops! There was a problem submitting your form.';
                }
                formMessages.classList.remove('success');
                formMessages.classList.add('error');
            }

            formMessages.style.opacity = '1';
            setTimeout(() => {
                formMessages.style.opacity = '0';
                // Optionally clear text after fade out
                setTimeout(() => {
                    formMessages.textContent = '';
                    formMessages.classList.remove('success', 'error');
                }, 300); // Matches CSS transition time
            }, 5000); // Message visible for 5 seconds
        });
    }
});