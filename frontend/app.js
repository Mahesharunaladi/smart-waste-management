// ===================================
// Initialize AOS (Animate On Scroll)
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
});

// ===================================
// Navigation Functions
// ===================================
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// Counter Animation
// ===================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Trigger counters when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            });
        }
    });
}, observerOptions);

// Observe stats banner
const statsBanner = document.querySelector('.stats-banner');
if (statsBanner) {
    observer.observe(statsBanner);
}

// ===================================
// Form Handlers
// ===================================
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Simulate form submission
    console.log('Contact Form Submitted:', formData);
    
    // Show success message
    alert('Thank you for contacting us! We will get back to you soon.');
    
    // Reset form
    event.target.reset();
    
    // In production, you would send this to your backend:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Simulate newsletter subscription
    console.log('Newsletter Subscription:', email);
    
    // Show success message
    alert('Thank you for subscribing to our newsletter!');
    
    // Reset form
    event.target.reset();
    
    // In production, you would send this to your backend:
    // fetch('/api/newsletter', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    // });
}

// ===================================
// Scroll Functions
// ===================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================================
// Dynamic Content Loading (Optional)
// ===================================
function loadTestimonials() {
    // This could be loaded from an API in production
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Community Manager, Greenville',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 5,
            text: 'SmartWaste has completely transformed how we manage waste in our community. The real-time tracking and automated notifications have made everything so much easier. Highly recommended!'
        },
        {
            name: 'Michael Chen',
            role: 'Operations Director, TechCorp Inc.',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 5,
            text: 'The analytics dashboard provides incredible insights into our waste management operations. We\'ve reduced costs by 30% and improved our environmental impact significantly.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Facility Manager, Metro Hospital',
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            rating: 5,
            text: 'Exceptional service and innovative technology. The mobile app is user-friendly, and the customer support team is always responsive. Best decision we\'ve made for our facility.'
        }
    ];
    
    return testimonials;
}

// ===================================
// Hero Stats Animation
// ===================================
const heroStats = document.querySelectorAll('.hero-stat h3');
if (heroStats.length > 0) {
    // Animate hero stats on page load
    setTimeout(() => {
        heroStats.forEach((stat, index) => {
            setTimeout(() => {
                const target = parseInt(stat.textContent.replace(/\D/g, ''));
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
                    }
                }, 20);
            }, index * 200);
        });
    }, 500);
}

// ===================================
// Parallax Effect (Optional)
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// Loading Animation
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===================================
// Feature Hover Effects
// ===================================
const featureCards = document.querySelectorAll('.feature-card, .service-card, .testimonial-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ===================================
// Scroll Indicator
// ===================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ===================================
// Form Validation
// ===================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[\d\s-()]+$/;
    return re.test(phone);
}

// Add real-time validation to forms
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const emailInput = contactForm.querySelector('#email');
    const phoneInput = contactForm.querySelector('#phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = '';
            }
        });
    }
}

// ===================================
// Service Cards Click Handler
// ===================================
const serviceLinks = document.querySelectorAll('.service-link');
serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // In production, this would navigate to a service detail page
        alert('Service details page would open here. In production, this would link to more information about this service.');
    });
});

// ===================================
// Lazy Loading Images
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// Print/Console Welcome Message
// ===================================
console.log('%c Welcome to SmartWaste Management System! ', 'background: linear-gradient(135deg, #10b981, #06b6d4); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('%c Building a sustainable future, one collection at a time. ', 'color: #10b981; font-size: 14px;');

// ===================================
// Keyboard Navigation
// ===================================
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Ctrl/Cmd + K for quick search (future feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Open search modal (to be implemented)
        console.log('Search feature to be implemented');
    }
});

// ===================================
// Browser Tab Visibility
// ===================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = 'Come back! - SmartWaste';
    } else {
        document.title = 'Smart Waste Management - Professional Waste Solutions';
    }
});

// ===================================
// Performance Monitoring (Optional)
// ===================================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.startTime, 'ms');
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// ===================================
// Export functions for external use
// ===================================
window.smartWasteApp = {
    toggleMobileMenu,
    closeMobileMenu,
    handleContactSubmit,
    handleNewsletterSubmit,
    scrollToTop
};
