/* ============================================
   My Courses Page Logic
   Craft Soft - Student Module
   ============================================ */

(function () {
    'use strict';

    // Dom Elements
    const userNameEl = document.getElementById('user-name');
    const userInitialsEl = document.getElementById('user-initials');
    const userIdEl = document.getElementById('user-id');
    const coursesList = document.getElementById('courses-list');
    const btnLogout = document.getElementById('btn-logout');
    const btnLogoutMobile = document.getElementById('btn-logout-mobile');

    // Mobile Nav Controls
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavSheet = document.getElementById('mobile-nav-sheet');
    const mobileNavClose = document.getElementById('mobile-nav-close');

    let studentData = null;

    // Modal Utility
    const Modal = {
        element: document.getElementById('modal-overlay'),
        title: document.getElementById('modal-title'),
        message: document.getElementById('modal-message'),
        icon: document.getElementById('modal-icon'),
        btnConfirm: document.getElementById('modal-confirm'),
        btnCancel: document.getElementById('modal-cancel'),

        show({ title, message, type = 'warning', confirmText = 'Confirm', onConfirm }) {
            this.title.textContent = title;
            this.message.textContent = message;
            this.icon.className = `modal-icon ${type}`;
            this.btnConfirm.textContent = confirmText;
            this.element.style.display = 'flex';
            document.body.classList.add('modal-open');

            const close = () => {
                this.element.style.display = 'none';
                document.body.classList.remove('modal-open');
            };

            this.btnCancel.onclick = close;
            this.btnConfirm.onclick = () => {
                if (onConfirm) onConfirm();
                close();
            };
        }
    };

    // Check Auth
    async function checkAuth() {
        const session = localStorage.getItem('acs_student_session');
        if (!session) {
            window.location.href = '../';
            return;
        }
        studentData = JSON.parse(session);
        initPage();
    }

    async function initPage() {
        userNameEl.textContent = studentData.name;
        userIdEl.textContent = studentData.student_id;
        userInitialsEl.textContent = studentData.name.split(' ').map(n => n[0]).join('').toUpperCase();

        await loadCourses();
    }

    async function loadCourses() {
        try {
            // Get student profile to fetch enrolled course codes
            const { data: profile, error: pErr } = await window.supabaseClient
                .from('students')
                .select('courses, course_tutors')
                .eq('id', studentData.id)
                .single();

            if (pErr) throw pErr;

            const codes = profile.courses || [];
            if (codes.length === 0) {
                renderEmptyState();
                return;
            }

            // Fetch course details
            const { data: courses, error: cErr } = await window.supabaseClient
                .from('courses')
                .select('course_code, course_name, fee')
                .in('course_code', codes);

            if (cErr) throw cErr;

            // Fetch tutor names for assigned tutors
            const tutorIds = Object.values(profile.course_tutors || {}).filter(Boolean);
            let tutorsMap = {};
            if (tutorIds.length > 0) {
                const { data: tutors } = await window.supabaseClient
                    .from('tutors')
                    .select('tutor_id, full_name')
                    .in('tutor_id', tutorIds);
                tutors?.forEach(t => tutorsMap[t.tutor_id] = t.full_name);
            }

            renderCourses(courses, profile.course_tutors || {}, tutorsMap);

        } catch (err) {
            console.error('Error loading courses:', err);
            coursesList.innerHTML = '<p class="loading-state">Error loading courses.</p>';
        }
    }

    function renderCourses(courses, tutorAssignments, tutorsMap) {
        coursesList.innerHTML = '';

        courses.forEach(c => {
            const tutorId = tutorAssignments[c.course_code];
            const tutorName = tutorId && tutorsMap[tutorId] ? tutorsMap[tutorId] : 'Not Assigned';

            const card = document.createElement('div');
            card.className = 'course-card-full';
            card.innerHTML = `
                <div class="course-header">
                    <h3>${c.course_name}</h3>
                    <span class="course-code">${c.course_code}</span>
                </div>
                <div class="course-body">
                    <div class="course-detail">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span>Tutor: <strong>${tutorName}</strong></span>
                    </div>
                    <div class="course-detail">
                        <i class="fas fa-rupee-sign"></i>
                        <span>Course Fee: <strong>₹${(c.fee || 0).toLocaleString()}</strong></span>
                    </div>
                    <div class="course-status-badge">
                        <i class="fas fa-check-circle"></i>
                        Enrolled
                    </div>
                </div>
            `;
            coursesList.appendChild(card);
        });
    }

    function renderEmptyState() {
        coursesList.innerHTML = `
            <div class="empty-courses">
                <i class="fas fa-book-open"></i>
                <h3>No Courses Enrolled</h3>
                <p>You are not enrolled in any courses yet. Please contact the office.</p>
            </div>
        `;
    }

    // Mobile Nav Toggle
    function openMobileNav() {
        mobileNavOverlay.classList.add('open');
        mobileNavSheet.classList.add('open');
        document.body.classList.add('modal-open');
    }

    function closeMobileNav() {
        mobileNavOverlay.classList.remove('open');
        mobileNavSheet.classList.remove('open');
        document.body.classList.remove('modal-open');
    }

    mobileMenuBtn.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);
    mobileNavOverlay.addEventListener('click', closeMobileNav);

    // Logout
    function handleLogout() {
        closeMobileNav();
        Modal.show({
            title: "Logout?",
            message: "Are you sure you want to end your session?",
            type: "warning",
            confirmText: "Logout",
            onConfirm: () => {
                localStorage.removeItem('acs_student_session');
                window.location.href = '../';
            }
        });
    }

    btnLogout.addEventListener('click', handleLogout);
    btnLogoutMobile.addEventListener('click', handleLogout);

    checkAuth();

})();
