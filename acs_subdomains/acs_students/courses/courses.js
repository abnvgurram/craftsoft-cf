/* ============================================
   My Courses Page Logic - Premium Overhaul
   ============================================ */

(function () {
    'use strict';

    const tableBody = document.getElementById('courses-table-body');
    const mobileGrid = document.getElementById('mobile-view');
    const emptyContainer = document.getElementById('empty-state-container');

    let studentData = null;

    async function checkAuth() {
        const token = localStorage.getItem('acs_student_token');
        if (!token) { window.location.replace('../'); return; }

        const { data: session, error } = await window.supabaseClient
            .from('student_sessions')
            .select('*')
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !session) {
            window.location.replace('../');
            return;
        }

        const metadata = session.metadata;
        studentData = {
            id: session.student_db_id,
            name: metadata.name,
            student_id: metadata.student_id,
            email: metadata.email,
            phone: metadata.phone
        };
        initPage();
    }

    async function initPage() {
        const header = document.getElementById('header-container');
        if (header && window.StudentHeader) {
            header.innerHTML = window.StudentHeader.render(
                'My Courses',
                'View your enrolled learning programs',
                'fa-book-open'
            );
        }

        if (window.StudentSidebar) {
            window.StudentSidebar.init('courses');
            window.StudentSidebar.renderAccountPanel(studentData);
        }

        await loadCourses();
    }

    async function loadCourses() {
        try {
            const { data: profile, error: pErr } = await window.supabaseClient
                .from('students')
                .select('courses, course_tutors, course_discounts, joining_date')
                .eq('id', studentData.id)
                .single();

            if (pErr) throw pErr;

            const codes = profile.courses || [];
            if (codes.length === 0) {
                renderEmptyState();
                return;
            }

            const { data: courses, error: cErr } = await window.supabaseClient
                .from('courses')
                .select('course_code, course_name, fee')
                .in('course_code', codes);

            if (cErr) throw cErr;

            const tutorIds = Object.values(profile.course_tutors || {}).filter(Boolean);
            let tutorsMap = {};

            if (tutorIds.length > 0) {
                const { data: tutors, error: tErr } = await window.supabaseClient
                    .from('tutors')
                    .select('tutor_id, full_name')
                    .in('tutor_id', tutorIds);

                if (!tErr && tutors) {
                    tutors.forEach(t => tutorsMap[t.tutor_id] = t.full_name);
                }
            }

            renderCourses(courses, profile.course_tutors || {}, tutorsMap, profile.course_discounts || {}, profile.joining_date);

        } catch (err) {
            console.error('Error loading courses:', err);
            emptyContainer.innerHTML = '<p class="loading-state">Error loading courses.</p>';
        }
    }

    function renderCourses(courses, tutorAssignments, tutorsMap, courseDiscounts, joiningDate) {
        tableBody.innerHTML = '';
        mobileGrid.innerHTML = '';

        const formattedDate = joiningDate ? new Date(joiningDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) : 'N/A';

        courses.forEach(c => {
            const tutorId = tutorAssignments[c.course_code];
            const tutorName = tutorId && tutorsMap[tutorId] ? tutorsMap[tutorId] : 'Not Assigned';
            const baseFee = c.fee || 0;
            const discount = courseDiscounts[c.course_code] || 0;
            const finalFee = baseFee - discount;
            const feeString = `₹${finalFee.toLocaleString('en-IN')}`;

            // Desktop Row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="course-td-code">${c.course_code}</span>
                    <span class="course-td-name">${c.course_name}</span>
                </td>
                <td>${tutorName}</td>
                <td class="course-td-fee">${feeString}</td>
                <td>${formattedDate}</td>
            `;
            tableBody.appendChild(row);

            // Mobile Card
            const card = document.createElement('div');
            card.className = 'premium-course-card';
            card.innerHTML = `
                <div class="card-tag">${studentData.student_id}</div>
                <h3 class="card-title">${c.course_name}</h3>
                <div class="card-breakdown">
                    <div class="breakdown-row">
                        <span class="breakdown-label">Tutor</span>
                        <span class="breakdown-value">${tutorName}</span>
                    </div>
                    <div class="breakdown-row">
                        <span class="breakdown-label">Start Date</span>
                        <span class="breakdown-value">${formattedDate}</span>
                    </div>
                    <hr class="breakdown-divider">
                    <div class="breakdown-row breakdown-total">
                        <span class="breakdown-label">Total Fee</span>
                        <span class="breakdown-value">${feeString}</span>
                    </div>
                </div>
            `;
            mobileGrid.appendChild(card);
        });
    }

    function renderEmptyState() {
        emptyContainer.innerHTML = `
            <div class="empty-courses">
                <i class="fas fa-book-open"></i>
                <h3>No Courses Enrolled</h3>
                <p>You are not enrolled in any courses yet.</p>
            </div>
        `;
        document.getElementById('desktop-view').style.display = 'none';
        document.getElementById('mobile-view').style.display = 'none';
    }

    checkAuth();
})();
