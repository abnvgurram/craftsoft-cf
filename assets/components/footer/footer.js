/* ============================================
   FOOTER Component Loader
   Loads footer.html dynamically into pages
   ============================================ */

(function () {
    // All available courses for dynamic footer
    const allCourses = [
        { name: 'Graphic design', url: 'pages/courses/graphic-design.html' },
        { name: 'UI/UX design', url: 'pages/courses/ui-ux.html' },
        { name: 'Full stack development', url: 'pages/courses/full-stack.html' },
        { name: 'DevOps engineering', url: 'pages/courses/devops.html' },
        { name: 'AWS cloud', url: 'pages/courses/aws.html' },
        { name: 'Python programming', url: 'pages/courses/python.html' },
        { name: 'Resume & interview', url: 'pages/courses/resume-interview.html' },
        { name: 'Spoken English', url: 'pages/courses/spoken-english.html' }
    ];

    // All available services
    const allServices = [
        { name: 'Graphic design', url: 'pages/services/graphic-design.html' },
        { name: 'UI/UX design', url: 'pages/services/ui-ux-design.html' },
        { name: 'Web development', url: 'pages/services/web-development.html' },
        { name: 'Brand identity', url: 'pages/services/branding.html' },
        { name: 'Cloud & DevOps', url: 'pages/services/cloud-devops.html' },
        { name: 'Career services', url: 'pages/services/career-services.html' }
    ];

    // Shuffle helper
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    // Get base path for correct URL resolution
    function getBasePath() {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length - 1;
        if (depth <= 0) return '';
        return '../'.repeat(depth);
    }

    // Load footer dynamically
    function loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        const basePath = getBasePath();

        fetch(basePath + 'assets/components/footer/footer.html')
            .then(response => response.text())
            .then(html => {
                // Fix relative URLs based on page depth
                if (basePath) {
                    html = html.replace(/href="(?!http|mailto|tel|#)/g, `href="${basePath}`);
                    html = html.replace(/src="(?!http)/g, `src="${basePath}`);
                }

                footerPlaceholder.innerHTML = html;
                populateDynamicFooter();
                updateCopyrightYear();
            })
            .catch(err => console.error('Footer load error:', err));
    }

    // Populate courses and services dynamically
    function populateDynamicFooter() {
        const selectedCourses = shuffle([...allCourses]).slice(0, 4);
        const selectedServices = shuffle([...allServices]).slice(0, 4);
        const basePath = getBasePath();

        const coursesContainer = document.getElementById('footer-trending-courses');
        if (coursesContainer) {
            coursesContainer.innerHTML = selectedCourses.map(c =>
                `<li><a href="${basePath}${c.url}">${c.name}</a></li>`
            ).join('');
        }

        const servicesContainer = document.getElementById('footer-services');
        if (servicesContainer) {
            servicesContainer.innerHTML = selectedServices.map(s =>
                `<li><a href="${basePath}${s.url}">${s.name}</a></li>`
            ).join('');
        }
    }

    // Update copyright year
    function updateCopyrightYear() {
        const yearEl = document.getElementById('copyright-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }

    // Export for manual use
    window.loadFooter = loadFooter;
})();
