/* ============================================
   Course Filter Module
   ============================================ */

export function initCourseFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const courseCategories = document.querySelectorAll('.course-category');

    if (filterTabs.length === 0 || courseCategories.length === 0) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            // Show/hide categories
            courseCategories.forEach(category => {
                if (filter === 'all') {
                    category.classList.remove('hidden');
                } else {
                    const categoryType = category.getAttribute('data-category');
                    if (categoryType === filter) {
                        category.classList.remove('hidden');
                    } else {
                        category.classList.add('hidden');
                    }
                }
            });

            // Smooth scroll to courses section
            const coursesSection = document.querySelector('.courses-page');
            if (coursesSection) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                window.scrollTo({
                    top: coursesSection.offsetTop - navbarHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}
