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
    const coursesList = document.getElementById('courses-list');
    const recentPayments = document.getElementById('recent-payments');
    const btnLogout = document.getElementById('btn-logout');

    let studentData = null;

    // Toast Utility
    const Toast = {
        show(msg, type = 'info') {
            let toast = document.getElementById('toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'toast';
                toast.className = 'toast';
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.className = `toast show ${type}`;
            setTimeout(() => toast.classList.remove('show'), 3000);
        },
        success(msg) { this.show(msg, 'success'); },
        error(msg) { this.show(msg, 'error'); }
    };

    // Check Authentication
    async function checkAuth() {
        const session = localStorage.getItem('acs_student_session');
        if (!session) {
            window.location.href = '../';
            return;
        }

        const data = JSON.parse(session);
        const loginTime = new Date(data.loginTime);
        const now = new Date();

        // Session valid for 24 hours
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

        const profile = await fetchCompleteProfile();
        if (profile) {
            await fetchPayments(profile);
            await fetchEnrolledCourses(profile);
        }
    }

    // Fetch full data from DB
    async function fetchCompleteProfile() {
        try {
            const { data, error } = await window.supabaseClient
                .from('students')
                .select('*')
                .eq('id', studentData.id)
                .single();

            if (error) {
                // If student record not found, suggest contacting admin
                Toast.error("Profile not found. Please contact admin.");
                throw error;
            }
            return data;
        } catch (err) {
            console.error('Profile fetch error:', err);
            return null;
        }
    }

    // Fetch Payments & Totals
    async function fetchPayments(profile) {
        try {
            const { data: payments, error } = await window.supabaseClient
                .from('payments')
                .select('*')
                .eq('student_id', studentData.id)
                .order('payment_date', { ascending: false });

            if (error) throw error;

            let totalPaid = 0;
            payments.forEach(p => totalPaid += (p.amount_paid || 0));

            // Update Total Paid
            totalPaidEl.textContent = new Intl.NumberFormat('en-IN', {
                style: 'currency', currency: 'INR', maximumFractionDigits: 0
            }).format(totalPaid);

            // Render Recent list
            renderRecentPayments(payments.slice(0, 3));

            // Calculate Balance Due (Pending)
            const finalFee = profile.final_fee || 0;
            const pending = finalFee - totalPaid;

            totalPendingEl.textContent = new Intl.NumberFormat('en-IN', {
                style: 'currency', currency: 'INR', maximumFractionDigits: 0
            }).format(pending > 0 ? pending : 0);

            if (pending > 500) { // Show alert only if significant amount is pending
                document.getElementById('pending-alert').style.display = 'block';
            }

        } catch (err) {
            console.error('Payment fetch error:', err);
        }
    }

    // Fetch Enrolled Courses
    async function fetchEnrolledCourses(profile) {
        try {
            const enrolledCodes = profile.courses || [];
            if (enrolledCodes.length === 0) {
                renderCourses([]);
                return;
            }

            // Fetch course names from courses table
            const { data, error } = await window.supabaseClient
                .from('courses')
                .select('course_code, course_name')
                .in('course_code', enrolledCodes);

            if (error) throw error;

            // Map and format for display
            const formattedCourses = data.map(c => ({
                name: c.course_name,
                code: c.course_code,
                status: 'In Progress' // Active student implies in progress
            }));

            renderCourses(formattedCourses);
        } catch (err) {
            console.error('Courses fetch error:', err);
        }
    }

    // UI Rendering
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
                    <h4>${c.name}</h4>
                    <span class="status active">${c.status}</span>
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
                    <strong>${p.payment_mode || 'Payment'}</strong>
                    <div class="date">${new Date(p.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                </div>
                <div class="amt">₹${(p.amount_paid || 0).toLocaleString()}</div>
            `;
            recentPayments.appendChild(div);
        });
    }

    // Logout Functionality
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('acs_student_session');
        window.location.href = '../';
    });

    // Start
    checkAuth();

})();
