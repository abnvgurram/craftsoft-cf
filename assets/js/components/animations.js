/* ============================================
   Scroll Animations Module
   ============================================ */

export function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .course-card, .service-card, .testimonial-card, .advantage-card, .contact-card, .faq-item'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
}

// Add animation styles dynamically
export function addAnimationStyles() {
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(2), .course-card:nth-child(2), .advantage-card:nth-child(2),
        .testimonial-card:nth-child(2) {
            transition-delay: 0.1s;
        }
        
        .feature-card:nth-child(3), .course-card:nth-child(3), .advantage-card:nth-child(3),
        .testimonial-card:nth-child(3) {
            transition-delay: 0.2s;
        }
        
        .feature-card:nth-child(4), .course-card:nth-child(4), .advantage-card:nth-child(4) {
            transition-delay: 0.3s;
        }
        
        .advantage-card:nth-child(5) {
            transition-delay: 0.4s;
        }
        
        .advantage-card:nth-child(6) {
            transition-delay: 0.5s;
        }
    `;
    document.head.appendChild(animationStyles);
}
