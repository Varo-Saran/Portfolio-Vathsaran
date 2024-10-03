// Particle.js configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: ["#00bfff", "#1e90ff", "#4dc3ff"] },
        shape: { 
            type: ["circle", "triangle", "edge"],
            stroke: { width: 0, color: "#000000" },
        },
        opacity: { 
            value: 0.6, 
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
        line_linked: { 
            enable: true, 
            distance: 150, 
            color: "#00bfff", 
            opacity: 0.4, 
            width: 1,
            shadow: { enable: true, color: "#00bfff", blur: 5 }
        },
        move: { 
            enable: true, 
            speed: 3, 
            direction: "none", 
            random: true, 
            straight: false, 
            out_mode: "out", 
            bounce: false,
            attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: { 
            onhover: { enable: true, mode: "grab" }, 
            onclick: { enable: true, mode: "push" }, 
            resize: true
        },
        modes: { 
            grab: { distance: 200, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
        }
    },
    retina_detect: true
});

// Debounce function for performance optimization
function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Scroll animation
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimation() {
    var elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(function(element) {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Standard Navigation Enhancement
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'color 0.3s ease, transform 0.3s ease';
            this.style.transform = 'translateY(-2px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Add aria-current attribute to the current page link
        if (link.href === window.location.href) {
            link.setAttribute('aria-current', 'page');
            link.style.borderBottom = '2px solid var(--accent-color)';
        }
    });

    // Highlight the section in view
    const sections = document.querySelectorAll('.section');
    window.addEventListener('scroll', debounce(function() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }));


    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            try {
                // Simulating an asynchronous operation
                setTimeout(() => {
                    alert('Thank you for your message. I will get back to you soon!');
                    this.reset();
                }, 1000);
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your message. Please try again later.');
            }
        });
    }

    // Initial call for scroll animation
    handleScrollAnimation();
});

// Scroll event listener
window.addEventListener('scroll', debounce(handleScrollAnimation));
