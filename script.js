const pages = ['index.html', 'about.html', 'skills.html', 'projects.html', 'contact.html'];

async function showSuggestionsAndResults(searchTerm) {
    const searchSuggestions = document.querySelector('.search-suggestions');
    const allTerms = [
        'about', 'skills', 'projects', 'contact', 'portfolio', 'data analytics', 'graphic design', 
        'vathsaran', 'yasotharan', 'leave management', 'colonist management', 'vortixa website',
        'data visualization', 'e-commerce analytics', 'brand identity', 'adobe photoshop',
        'adobe illustrator', 'adobe indesign', 'adobe premiere pro', 'adobe after effects',
        'adobe animate', 'c#', 'python', 'sql', 'html', 'css', 'javascript', 'statistical analysis',
        'machine learning', 'project management', 'user interface design', 'logo design'
    ];
    const suggestions = allTerms.filter(term => term.toLowerCase().includes(searchTerm.toLowerCase()));

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
                    const sectionTitle = section.querySelector('h2, h3');
                    const sectionContent = section.textContent;
                    if (sectionContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const title = sectionTitle ? sectionTitle.textContent : 'Section';
                        const snippet = getSnippet(sectionContent, searchTerm);
                        const anchor = sectionTitle ? sectionTitle.id || `section-${index}` : `section-${index}`;
                        results.push({ page, title, snippet, anchor });
                    }
                });

                // Search in project cards
                const projectCards = mainContent.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    const cardTitle = card.querySelector('h3');
                    const cardContent = card.textContent;
                    if (cardContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const title = cardTitle ? cardTitle.textContent : 'Project';
                        const snippet = getSnippet(cardContent, searchTerm);
                        const anchor = card.id || `project-${index}`;
                        results.push({ page, title, snippet, anchor });
                    }
                });

                // Search in skill items
                const skillItems = mainContent.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    const skillName = item.querySelector('h4');
                    if (skillName && skillName.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const title = skillName.textContent;
                        const snippet = `Skill: ${title}`;
                        const anchor = item.id || `skill-${index}`;
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
    const lowerSearchTerm = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerSearchTerm);
    if (index === -1) return '';
    
    let start = Math.max(0, index - snippetLength / 2);
    let end = Math.min(text.length, index + searchTerm.length + snippetLength / 2);

    // Adjust start and end to not cut words in half
    while (start > 0 && text[start] !== ' ') {
        start--;
    }
    while (end < text.length && text[end] !== ' ') {
        end++;
    }

    let snippet = text.slice(start, end).trim();

    // Add ellipsis if the snippet doesn't start or end at the boundaries of the full text
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet += '...';

    // Highlight the search term in the snippet
    const highlightedSnippet = snippet.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);

    return highlightedSnippet;
}

// Particle.js configuration
// Particle.js configuration
function initParticles() {
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
}

// Enhanced automatic sliding hero with typing effect
function initSlider() {
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;

    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;
        updateDots();
        typeText(slides[index].querySelector('.typing-text'));
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    function goToSlide(index) {
        showSlide(index);
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds
    }

    function typeText(element) {
        if (!element) return;
        const text = element.getAttribute('data-text');
        element.textContent = '';
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50); // Adjust typing speed here
    }

    function typeText(element) {
        if (!element) return;
        const text = element.getAttribute('data-text');
        element.textContent = '';
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                element.classList.add('typing-done');
            }
        }, 50); // Adjust typing speed here
    }

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;
        updateDots();
        
        // Type both heading and paragraph
        const activeSlide = slides[index];
        const headingElement = activeSlide.querySelector('h2.typing-text');
        const paragraphElement = activeSlide.querySelector('p.typing-text');
        
        if (headingElement) typeText(headingElement);
        if (paragraphElement) typeText(paragraphElement);
    }

    // Initialize slider
    createDots();
    showSlide(0);
    resetInterval();

    // Event listeners for manual controls
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
}

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

    // Initialize particle effect
    initParticles();

    // Initialize slider if it exists on the page
    if (document.querySelector('.hero-slider')) {
        initSlider();
    }

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
    
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });

        searchSuggestions.addEventListener('click', (e) => {
            const suggestionItem = e.target.closest('.suggestion');
            const searchResultItem = e.target.closest('.search-result');
            
            if (suggestionItem) {
                const selectedText = suggestionItem.textContent;
                searchInput.value = selectedText;
                showSuggestionsAndResults(selectedText);
            } else if (searchResultItem) {
                const link = searchResultItem.querySelector('a');
                if (link) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    const [page, anchor] = href.split('#');
                    
                    if (page === window.location.pathname.split('/').pop()) {
                        // If it's the same page, just scroll to the anchor
                        const targetElement = document.getElementById(anchor);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        // If it's a different page, navigate to it
                        window.location.href = href;
                    }
                }
            }
            
            searchSuggestions.style.display = 'none';
        });

        console.log('Search event listeners attached');
    } else {
        console.error('Search input or button not found');
    }

    

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
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        navLinks.style.display = 'flex';
        setTimeout(() => {
            navLinks.style.opacity = '1';
            navLinks.style.transform = 'translateY(0)';
        }, 10);
    } else {
        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            navLinks.style.display = 'none';
        }, 300);
    }
});

// Close mobile menu when a link is clicked
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            navLinks.style.display = 'none';
        }, 300);
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnToggle = mobileMenuToggle.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            navLinks.style.display = 'none';
        }, 300);
    }
});


    // Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the form from submitting normally

        if (!validateForm(this)) {
            return;
        }

        const submitButton = this.querySelector('.submit-btn');
        let feedbackDiv = document.querySelector('.form-feedback');
        if (!feedbackDiv) {
            feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'form-feedback';
            this.appendChild(feedbackDiv);
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            feedbackDiv.textContent = 'Submitting your message...';
            feedbackDiv.className = 'form-feedback info';

            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                feedbackDiv.textContent = 'Thank you for your message. I will get back to you soon!';
                feedbackDiv.className = 'form-feedback success';
                this.reset();
            } else {
                throw new Error(result.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            feedbackDiv.textContent = 'There was an error submitting your message. Please try again later.';
            feedbackDiv.className = 'form-feedback error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            // Scroll to the feedback message
            feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            let errorMsg = field.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
            errorMsg.textContent = `${field.name} is required`;
        } else {
            field.classList.remove('error');
            const errorMsg = field.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });

    return isValid;
}


    // Initial call for scroll animation
    handleScrollAnimation();
});

// Scroll event listener
window.addEventListener('scroll', debounce(handleScrollAnimation));
