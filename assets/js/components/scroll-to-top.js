/* ============================================
   Scroll to Top Module
   ============================================ */

export function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');

    if (!scrollBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
