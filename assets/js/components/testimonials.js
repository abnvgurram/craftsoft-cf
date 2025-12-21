/* ============================================
   Testimonials Slider Module
   ============================================ */

export function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const cards = slider.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    // Create slider wrapper if not exists
    let track = slider.querySelector('.testimonials-track');
    if (!track) {
        track = document.createElement('div');
        track.className = 'testimonials-track';
        cards.forEach(card => track.appendChild(card.cloneNode(true)));
        slider.innerHTML = '';
        slider.appendChild(track);
    }

    // Navigation dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    slider.appendChild(dotsContainer);

    function createDots() {
        dotsContainer.innerHTML = '';
        const visibleCards = getVisibleCards();
        const numPages = totalCards - visibleCards + 1;

        if (numPages <= 1) return; // No dots if all cards fit

        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function updateSlider() {
        const visibleCards = getVisibleCards();
        const cardWidth = 100 / visibleCards;
        track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function nextSlide() {
        const visibleCards = getVisibleCards();
        const maxIndex = totalCards - visibleCards;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }

    // Initial dot creation
    createDots();

    // Auto-slide every 5 seconds
    let autoSlide = setInterval(nextSlide, 5000);

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        currentIndex = 0;
        createDots();
        updateSlider();
    });
}
