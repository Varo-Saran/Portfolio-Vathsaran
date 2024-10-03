const pages = ['index.html', 'about.html', 'skills.html', 'projects.html', 'contact.html'];

async function showSuggestionsAndResults(searchTerm) {
    const searchSuggestions = document.querySelector('.search-suggestions');
    const allTerms = ['about', 'skills', 'projects', 'contact', 'portfolio', 'data analytics', 'graphic design', 'vathsaran', 'yasotharan'];
    const suggestions = allTerms.filter(term => term.includes(searchTerm.toLowerCase()));

    let content = '';

    if (suggestions.length > 0 && searchTerm.length > 0) {
        content += suggestions.map(s => `<li class="suggestion">${s}</li>`).join('');
    }

    if (searchTerm.length > 0) {
        const results = await performSearch(searchTerm);
        if (results.length > 0) {
            content += '<li class="search-results-header">Search Results:</li>';
            content += results.map(result => `
                <li class="search-result">
                    <a href="${result.page}#${result.anchor}">${result.title}</a>
                    <p>${result.snippet}</p>
                </li>
            `).join('');
        } else {
            content += '<li class="no-results">No results found.</li>';
        }
    }

    if (content) {
        searchSuggestions.innerHTML = content;
        searchSuggestions.style.display = 'block';
    } else {
        searchSuggestions.style.display = 'none';
    }
}

async function performSearch(searchTerm) {
    console.log('Performing search for:', searchTerm);
    const results = [];

    for (const page of pages) {
        try {
            const response = await fetch(page);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const mainContent = doc.querySelector('main') || doc.querySelector('[role="main"]');
            if (mainContent) {
                const sections = mainContent.querySelectorAll('.section');
                sections.forEach((section, index) => {
                    const sectionTitle = section.querySelector('h2');
                    const sectionContent = section.textContent;
                    if (sectionContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const title = sectionTitle ? sectionTitle.textContent : 'Section';
                        const snippet = getSnippet(sectionContent, searchTerm);
                        const anchor = sectionTitle ? sectionTitle.id : `section-${index}`;
                        results.push({ page, title, snippet, anchor });
                    }
                });
            }
        } catch (error) {
            console.error(`Error searching ${page}:`, error);
        }
    }

    return results;
}

function getSnippet(text, searchTerm, snippetLength = 150) {
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(searchTerm.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - snippetLength / 2);
    const end = Math.min(text.length, index + searchTerm.length + snippetLength / 2);
    return text.slice(start, end).trim() + '...';
}

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

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchSuggestions = document.querySelector('.search-suggestions');

    if (searchInput && searchBtn) {
        let debounceTimer;

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                showSuggestionsAndResults(searchInput.value);
            }, 300);
        });
    
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSuggestionsAndResults(searchInput.value);
        });
    
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                showSuggestionsAndResults(searchInput.value);
            }
        });
    
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });

        console.log('Search event listeners attached');
    } else {
        console.error('Search input or button not found');
    }

    // Search functionality
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch();
        }, 300); // Wait for 300ms after the user stops typing
    });

    // Add a subtle glow effect to the search input on focus
    searchInput.addEventListener('focus', () => {
        searchInput.style.boxShadow = `0 0 10px var(--accent-color)`;
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.boxShadow = 'none';
    });

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission if it's in a form
        performSearch();
    });


    // Mobile menu toggle with smooth transition
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.style.transition = 'transform 0.3s ease-in-out';
        if (navLinks.classList.contains('active')) {
            navLinks.style.transform = 'translateX(100%)';
            setTimeout(() => {
                navLinks.classList.remove('active');
                navLinks.style.transform = '';
            }, 300);
        } else {
            navLinks.classList.add('active');
            navLinks.style.transform = 'translateX(0)';
        }
    });

    // Close mobile menu when a link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navLinks.style.transform = 'translateX(100%)';
            setTimeout(() => {
                navLinks.classList.remove('active');
                navLinks.style.transform = '';
            }, 300);
        }
    });


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
