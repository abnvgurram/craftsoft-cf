/* ============================================
   Student Dashboard Logic
   Craft Soft - Student Module
   ============================================ */

(function () {
    'use strict';

    // Dom Elements
    const userName = document.getElementById('user-name');
    const firstName = document.getElementById('first-name');
    const userId = document.getElementById('user-id');
    const totalPaidEl = document.getElementById('total-paid');
    const totalPendingEl = document.getElementById('total-pending');
    const nextDueEl = document.getElementById('next-due');
    const coursesList = document.getElementById('courses-list');
    const recentPayments = document.getElementById('recent-payments');
    const btnLogout = document.getElementById('btn-logout');

    let studentData = null;

    // Check Authentication
    async function checkAuth() {
        const session = localStorage.getItem('acs_student_session');
        if (!session) {
            window.location.href = '../';
            return;
        }

        const data = JSON.parse(session);
        // Verify session is not too old (e.g. 24 hours)
        const loginTime = new Date(data.loginTime);
        const now = new Date();
        if ((now - loginTime) > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('acs_student_session');
            window.location.href = '../';
            return;
        }

        studentData = data;
        initDashboard();
    }

    // Initialize Dashboard
    async function initDashboard() {
        // Set basic profile info from session
        userName.textContent = studentData.name;
        firstName.textContent = studentData.name.split(' ')[0];
        userId.textContent = studentData.student_id;

        await fetchCompleteProfile();
        await fetchPayments();
        await fetchEnrolledCourses();
    }

    // Fetch full data from DB
    async function fetchCompleteProfile() {
        try {
            const { data, error } = await window.supabaseClient
                .from('students')
                .select('*, courses:student_courses(course_id, status)')
                .eq('id', studentData.id)
                .single();

            if (error) throw error;
            // Update UI with any extra data if needed
        } catch (err) {
            console.error('Profile fetch error:', err);
        }
    }

    // Fetch Payments & Totals
    async function fetchPayments() {
        try {
            const { data: payments, error } = await window.supabaseClient
                .from('payments')
                .select('*')
                .eq('student_id', studentData.id)
                .order('payment_date', { ascending: false });

            if (error) throw error;

            let totalPaid = 0;
            payments.forEach(p => totalPaid += (p.amount_paid || 0));

            // Format Currency
            totalPaidEl.textContent = new Intl.NumberFormat('en-IN', {
                style: 'currency', currency: 'INR', maximumFractionDigits: 0
            }).format(totalPaid);

            // Render Recent
            renderRecentPayments(payments.slice(0, 3));

            // Note: Total Pending will be fetched from the course totals or a separate query
            calculatePending(studentData.id, totalPaid);

        } catch (err) {
            console.error('Payment fetch error:', err);
        }
    }

    async function calculatePending(stuUuid, paid) {
        try {
            // Get total fees from enrolled courses
            const { data, error } = await window.supabaseClient
                .from('student_courses')
                .select('course_fee')
                .eq('student_id', stuUuid);

            if (error) throw error;

            let totalFee = 0;
            data.forEach(c => totalFee += (c.course_fee || 0));

            const pending = totalFee - paid;
            totalPendingEl.textContent = new Intl.NumberFormat('en-IN', {
                style: 'currency', currency: 'INR', maximumFractionDigits: 0
            }).format(pending > 0 ? pending : 0);

            if (pending > 0) {
                document.getElementById('pending-alert').style.display = 'block';
            }
        } catch (err) {
            console.error('Pending calculation error:', err);
        }
    }

    // Fetch Enrolled Courses
    async function fetchEnrolledCourses() {
        try {
            const { data, error } = await window.supabaseClient
                .from('student_courses')
                .select('*, course:courses(course_name)')
                .eq('student_id', studentData.id);

            if (error) throw error;

            renderCourses(data);
        } catch (err) {
            console.error('Courses fetch error:', err);
        }
    }

    // Render Logic
    function renderCourses(courses) {
        coursesList.innerHTML = '';
        if (courses.length === 0) {
            coursesList.innerHTML = '<p class="loading-state">No courses enrolled yet.</p>';
            return;
        }

        courses.forEach(c => {
            const div = document.createElement('div');
            div.className = 'course-card';
            div.innerHTML = `
                <div class="course-icon"><i class="fas fa-book"></i></div>
                <div class="course-info">
                    <h4>${c.course?.course_name || 'Course'}</h4>
                    <span class="status ${c.status.toLowerCase()}">${c.status}</span>
                </div>
            `;
            coursesList.appendChild(div);
        });
    }

    function renderRecentPayments(payments) {
        recentPayments.innerHTML = '';
        if (payments.length === 0) {
            recentPayments.innerHTML = '<p class="loading-state">No payments found.</p>';
            return;
        }

        payments.forEach(p => {
            const div = document.createElement('div');
            div.className = 'payment-item';
            div.innerHTML = `
                <div>
                    <strong>${p.payment_mode}</strong>
                    <div class="date">${new Date(p.payment_date).toLocaleDateString()}</div>
                </div>
                <div class="amt">₹${p.amount_paid.toLocaleString()}</div>
            `;
            recentPayments.appendChild(div);
        });
    }

    // Logout
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('acs_student_session');
        window.location.href = '../';
    });

    // Run
    checkAuth();

})();
